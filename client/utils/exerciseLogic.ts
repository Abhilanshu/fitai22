import { Keypoint } from '@tensorflow-models/pose-detection';

export type ExerciseType =
    | 'Squat'
    | 'Pushup'
    | 'Bicep Curl'
    | 'Jumping Jacks'
    | 'Lunges'
    | 'Plank'
    | 'High Knees'
    | 'Mountain Climbers'
    | 'Overhead Press'
    | 'Glute Bridges'
    | 'Standard';

export function mapExerciseName(name: string): ExerciseType {
    const n = name.toLowerCase();
    if (n.includes('jack')) return 'Jumping Jacks';
    if (n.includes('lunge')) return 'Lunges';
    if (n.includes('squat')) return 'Squat';
    if (n.includes('push')) return 'Pushup';
    if (n.includes('curl')) return 'Bicep Curl';
    if (n.includes('plank')) return 'Plank';
    if (n.includes('knee')) return 'High Knees';
    if (n.includes('climber')) return 'Mountain Climbers';
    if (n.includes('press')) return 'Overhead Press';
    if (n.includes('bridge')) return 'Glute Bridges';
    return 'Standard';
}

// Helper: Calculate angle between three points (A-B-C)
function calculateAngle(a: Keypoint, b: Keypoint, c: Keypoint): number {
    if (!a || !b || !c) return 0;
    const ba = { x: a.x - b.x, y: a.y - b.y };
    const bc = { x: c.x - b.x, y: c.y - b.y };
    const dot = ba.x * bc.x + ba.y * bc.y;
    const magBA = Math.sqrt(ba.x * ba.x + ba.y * ba.y);
    const magBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y);
    let angle = Math.acos(dot / (magBA * magBC));
    return angle * (180.0 / Math.PI);
}

// State to track rep progress
interface ExerciseState {
    stage: 'UP' | 'DOWN' | 'HOLD';
    reps: number;
    lastFeedback: string;
    holdStartTime?: number;
}

let currentState: ExerciseState = {
    stage: 'UP',
    reps: 0,
    lastFeedback: 'Start whenever you are ready!'
};

export function resetState() {
    currentState = {
        stage: 'UP',
        reps: 0,
        lastFeedback: 'Start whenever you are ready!'
    };
}

// Helpers
function isVertical(keypoints: Keypoint[]): boolean {
    const shoulder = keypoints.find(k => k.name === 'left_shoulder');
    const hip = keypoints.find(k => k.name === 'left_hip');
    const knee = keypoints.find(k => k.name === 'left_knee');
    if (!shoulder || !hip || !knee) return false;
    return shoulder.y < hip.y && hip.y < knee.y;
}

function isHorizontal(keypoints: Keypoint[]): boolean {
    const shoulder = keypoints.find(k => k.name === 'left_shoulder');
    const hip = keypoints.find(k => k.name === 'left_hip');
    if (!shoulder || !hip) return false;
    return Math.abs(shoulder.y - hip.y) < 50;
}

// Helper: Check if legs (ankles) are visible
function checkLegVisibility(keypoints: Keypoint[]): boolean {
    const leftAnkle = keypoints.find(k => k.name === 'left_ankle');
    const rightAnkle = keypoints.find(k => k.name === 'right_ankle');
    // Check if at least one ankle is visible
    return (!!leftAnkle && (leftAnkle.score ?? 0) > 0.3) || (!!rightAnkle && (rightAnkle.score ?? 0) > 0.3);
}

export function analyzeExercise(exercise: ExerciseType, keypoints: Keypoint[]): { feedback: string; reps: number; isCorrect: boolean } {
    switch (exercise) {
        case 'Squat': return analyzeSquat(keypoints);
        case 'Pushup': return analyzePushup(keypoints);
        case 'Bicep Curl': return analyzeBicepCurl(keypoints);
        case 'Jumping Jacks': return analyzeJumpingJacks(keypoints);
        case 'Lunges': return analyzeLunges(keypoints);
        case 'Plank': return analyzePlank(keypoints);
        case 'High Knees': return analyzeHighKnees(keypoints);
        case 'Mountain Climbers': return analyzeMountainClimbers(keypoints);
        case 'Overhead Press': return analyzeOverheadPress(keypoints);
        case 'Glute Bridges': return analyzeGluteBridge(keypoints);
        default: return { feedback: 'Observing...', reps: 0, isCorrect: true };
    }
}

// --- Specific Analyzers ---

function analyzeSquat(keypoints: Keypoint[]) {
    // 1. Visibility Check
    if (!checkLegVisibility(keypoints)) {
        return { feedback: 'Feet not visible! Use Fullscreen or step back.', reps: currentState.reps, isCorrect: false };
    }

    if (!isVertical(keypoints)) return { feedback: 'Stand upright to Squat!', reps: currentState.reps, isCorrect: false };
    const hip = keypoints.find(k => k.name === 'left_hip');
    const knee = keypoints.find(k => k.name === 'left_knee');
    const ankle = keypoints.find(k => k.name === 'left_ankle');
    if (!hip || !knee || !ankle) return { feedback: 'Full body needed', reps: currentState.reps, isCorrect: false };

    const angle = calculateAngle(hip, knee, ankle);

    // STRICTER Thresholds
    // Stand: > 165 (Must be fully upright)
    // Deep Squat: < 125 (Must go parallel or lower)

    if (angle > 165) {
        if (currentState.stage === 'DOWN') {
            currentState.reps += 1;
            currentState.lastFeedback = 'Perfect Squat!';
            currentState.stage = 'UP';
            return { feedback: 'Perfect Squat!', reps: currentState.reps, isCorrect: true };
        } else {
            currentState.lastFeedback = 'Squat down!';
            return { feedback: 'Squat down!', reps: currentState.reps, isCorrect: true };
        }
    } else if (angle < 125) {
        currentState.stage = 'DOWN';
        currentState.lastFeedback = 'Hold... and Up!';
        return { feedback: 'Hold... and Up!', reps: currentState.reps, isCorrect: true };
    }

    // Intermediate feedback (Strict)
    if (currentState.stage === 'UP' && angle < 150) return { feedback: 'Go Lower!', reps: currentState.reps, isCorrect: false };
    if (currentState.stage === 'DOWN' && angle > 130) return { feedback: 'Push all the way up!', reps: currentState.reps, isCorrect: false };

    return { feedback: currentState.lastFeedback, reps: currentState.reps, isCorrect: true };
}

function analyzePushup(keypoints: Keypoint[]) {
    if (!isHorizontal(keypoints)) return { feedback: 'Get into plank position!', reps: currentState.reps, isCorrect: false };
    const shoulder = keypoints.find(k => k.name === 'left_shoulder');
    const elbow = keypoints.find(k => k.name === 'left_elbow');
    const wrist = keypoints.find(k => k.name === 'left_wrist');
    if (!shoulder || !elbow || !wrist) return { feedback: 'Arms needed', reps: currentState.reps, isCorrect: false };

    const angle = calculateAngle(shoulder, elbow, wrist);

    // Strict Extension > 165
    // Strict Depth < 85
    if (angle > 165) {
        if (currentState.stage === 'DOWN') {
            currentState.reps += 1;
            currentState.lastFeedback = 'Clean Rep!';
            currentState.stage = 'UP';
            return { feedback: 'Clean Rep!', reps: currentState.reps, isCorrect: true };
        } else {
            currentState.lastFeedback = 'Lower chest!';
            return { feedback: 'Lower chest!', reps: currentState.reps, isCorrect: true };
        }
    } else if (angle < 85) {
        currentState.stage = 'DOWN';
        currentState.lastFeedback = 'Push Up!';
        return { feedback: 'Push Up!', reps: currentState.reps, isCorrect: true };
    }

    if (currentState.stage === 'UP' && angle < 155) return { feedback: 'Lower your chest', reps: currentState.reps, isCorrect: false };

    return { feedback: currentState.lastFeedback, reps: currentState.reps, isCorrect: true };
}

function analyzeBicepCurl(keypoints: Keypoint[]) {
    if (!isVertical(keypoints)) return { feedback: 'Stand straight!', reps: currentState.reps, isCorrect: false };
    const shoulder = keypoints.find(k => k.name === 'left_shoulder');
    const elbow = keypoints.find(k => k.name === 'left_elbow');
    const wrist = keypoints.find(k => k.name === 'left_wrist');
    const hip = keypoints.find(k => k.name === 'left_hip');

    if (!shoulder || !elbow || !wrist || !hip) return { feedback: 'Arm visible?', reps: currentState.reps, isCorrect: false };

    // Anti-Swing
    const upperArmAngle = calculateAngle(elbow, shoulder, hip);
    if (upperArmAngle > 35) return { feedback: 'Keep elbow tucked!', reps: currentState.reps, isCorrect: false };

    const angle = calculateAngle(shoulder, elbow, wrist);
    if (angle > 165) {
        if (currentState.stage === 'UP') {
            currentState.reps += 1;
            currentState.lastFeedback = 'Good Control!';
            currentState.stage = 'DOWN';
            return { feedback: 'Good Control!', reps: currentState.reps, isCorrect: true };
        } else {
            currentState.lastFeedback = 'Curl Up!';
            return { feedback: 'Curl Up!', reps: currentState.reps, isCorrect: true };
        }
    } else if (angle < 45) {
        currentState.stage = 'UP';
        currentState.lastFeedback = 'Squeeze!';
        return { feedback: 'Squeeze!', reps: currentState.reps, isCorrect: true };
    }
    return { feedback: currentState.lastFeedback, reps: currentState.reps, isCorrect: true };
}

function analyzeJumpingJacks(keypoints: Keypoint[]) {
    if (!checkLegVisibility(keypoints)) return { feedback: 'Feet not visible! Step back.', reps: currentState.reps, isCorrect: false };

    const leftWrist = keypoints.find(k => k.name === 'left_wrist');
    const rightWrist = keypoints.find(k => k.name === 'right_wrist');
    const leftAnkle = keypoints.find(k => k.name === 'left_ankle');
    const rightAnkle = keypoints.find(k => k.name === 'right_ankle');
    if (!leftWrist || !rightWrist || !leftAnkle || !rightAnkle) return { feedback: 'Full body needed', reps: currentState.reps, isCorrect: false };

    const handsUp = leftWrist.y < 100 && rightWrist.y < 100;
    const feetDist = Math.abs(leftAnkle.x - rightAnkle.x);
    const feetWide = feetDist > 120; // Stricter width

    if (handsUp && feetWide) {
        if (currentState.stage === 'DOWN') {
            currentState.stage = 'UP';
            currentState.lastFeedback = 'Good Reach!';
            return { feedback: 'Good Reach!', reps: currentState.reps, isCorrect: true };
        }
    } else if (!handsUp && !feetWide) {
        if (currentState.stage === 'UP') {
            currentState.stage = 'DOWN';
            currentState.reps += 1;
            currentState.lastFeedback = 'Jack Complete!';
            return { feedback: 'Jack Complete!', reps: currentState.reps, isCorrect: true };
        } else {
            currentState.lastFeedback = 'Jump!';
            return { feedback: 'Jump!', reps: currentState.reps, isCorrect: true };
        }
    }
    return { feedback: currentState.lastFeedback, reps: currentState.reps, isCorrect: true };
}

function analyzeLunges(keypoints: Keypoint[]) {
    // 1. Visibility Check
    if (!checkLegVisibility(keypoints)) return { feedback: 'Feet not visible! Use Fullscreen.', reps: currentState.reps, isCorrect: false };

    const hip = keypoints.find(k => k.name === 'left_hip');
    const knee = keypoints.find(k => k.name === 'left_knee');
    const ankle = keypoints.find(k => k.name === 'left_ankle');
    if (!hip || !knee || !ankle) return { feedback: 'Show profile', reps: currentState.reps, isCorrect: false };

    const angle = calculateAngle(hip, knee, ankle);
    if (angle > 165) {
        if (currentState.stage === 'DOWN') {
            currentState.reps += 1;
            currentState.lastFeedback = 'Powerful Lunge!';
            currentState.stage = 'UP';
            return { feedback: 'Powerful Lunge!', reps: currentState.reps, isCorrect: true };
        } else {
            currentState.lastFeedback = 'Lunge down!';
            return { feedback: 'Lunge down!', reps: currentState.reps, isCorrect: true };
        }
    } else if (angle < 95) { // Deeper lunge
        currentState.stage = 'DOWN';
        currentState.lastFeedback = 'Hold...';
        return { feedback: 'Hold...', reps: currentState.reps, isCorrect: true };
    }
    return { feedback: currentState.lastFeedback, reps: currentState.reps, isCorrect: true };
}

function analyzePlank(keypoints: Keypoint[]) {
    if (!isHorizontal(keypoints)) return { feedback: 'Get into Plank!', reps: currentState.reps, isCorrect: false };
    if (!checkLegVisibility(keypoints)) return { feedback: 'Straighten legs, show ankles.', reps: currentState.reps, isCorrect: false };

    const shoulder = keypoints.find(k => k.name === 'left_shoulder');
    const hip = keypoints.find(k => k.name === 'left_hip');
    const ankle = keypoints.find(k => k.name === 'left_ankle');
    if (!shoulder || !hip || !ankle) return { feedback: 'Full body needed', reps: currentState.reps, isCorrect: false };

    const angle = calculateAngle(shoulder, hip, ankle);

    if (angle > 165) {
        currentState.lastFeedback = 'Solid Core!';
        return { feedback: 'Solid Core!', reps: currentState.reps, isCorrect: true };
    } else {
        currentState.lastFeedback = 'Straighten back!';
        return { feedback: 'Straighten back!', reps: currentState.reps, isCorrect: false };
    }
}

function analyzeHighKnees(keypoints: Keypoint[]) {
    if (!isVertical(keypoints)) return { feedback: 'Stand up!', reps: currentState.reps, isCorrect: false };
    const hip = keypoints.find(k => k.name === 'left_hip');
    const knee = keypoints.find(k => k.name === 'left_knee');
    if (!hip || !knee) return { feedback: 'Legs needed', reps: currentState.reps, isCorrect: false };

    // Stricter: Knee must be ABOVE hip (y < hip.y)
    if (knee.y < hip.y - 10) {
        if (currentState.stage === 'DOWN') {
            currentState.reps += 1;
            currentState.lastFeedback = 'Higher!';
            currentState.stage = 'UP';
            return { feedback: 'Higher!', reps: currentState.reps, isCorrect: true };
        }
    } else if (knee.y > hip.y + 50) {
        currentState.stage = 'DOWN';
    }
    return { feedback: currentState.lastFeedback, reps: currentState.reps, isCorrect: true };
}

function analyzeMountainClimbers(keypoints: Keypoint[]) {
    if (!isHorizontal(keypoints)) return { feedback: 'Plank position!', reps: currentState.reps, isCorrect: false };

    // Just drive feedback
    currentState.lastFeedback = 'Drive knees!';
    currentState.reps += 0.05;
    return { feedback: 'Drive knees!', reps: Math.floor(currentState.reps), isCorrect: true };
}

function analyzeOverheadPress(keypoints: Keypoint[]) {
    if (!isVertical(keypoints)) return { feedback: 'Stand/Sit straight!', reps: currentState.reps, isCorrect: false };
    const shoulder = keypoints.find(k => k.name === 'left_shoulder');
    const elbow = keypoints.find(k => k.name === 'left_elbow');
    const wrist = keypoints.find(k => k.name === 'left_wrist');
    if (!shoulder || !elbow || !wrist) return { feedback: 'Arms needed', reps: currentState.reps, isCorrect: false };

    const angle = calculateAngle(shoulder, elbow, wrist);
    // Strict Lockout > 165
    if (angle > 165 && wrist.y < shoulder.y - 60) {
        if (currentState.stage === 'DOWN') {
            currentState.reps += 1;
            currentState.lastFeedback = 'Strong!';
            currentState.stage = 'UP';
            return { feedback: 'Strong!', reps: currentState.reps, isCorrect: true };
        }
    } else if (angle < 90) {
        currentState.stage = 'DOWN';
        currentState.lastFeedback = 'Press Up!';
        return { feedback: 'Press Up!', reps: currentState.reps, isCorrect: true };
    }
    return { feedback: currentState.lastFeedback, reps: currentState.reps, isCorrect: true };
}

function analyzeGluteBridge(keypoints: Keypoint[]) {
    const shoulder = keypoints.find(k => k.name === 'left_shoulder');
    const hip = keypoints.find(k => k.name === 'left_hip');
    const knee = keypoints.find(k => k.name === 'left_knee');
    if (!shoulder || !hip || !knee) return { feedback: 'Lie down side view', reps: currentState.reps, isCorrect: false };

    const angle = calculateAngle(shoulder, hip, knee);

    if (angle > 170) {
        if (currentState.stage === 'DOWN') {
            currentState.reps += 1;
            currentState.lastFeedback = 'Max Squeeze!';
            currentState.stage = 'UP';
            return { feedback: 'Max Squeeze!', reps: currentState.reps, isCorrect: true };
        }
    } else if (angle < 130) {
        currentState.stage = 'DOWN';
        currentState.lastFeedback = 'Lift Hips!';
        return { feedback: 'Lift Hips!', reps: currentState.reps, isCorrect: true };
    }
    return { feedback: currentState.lastFeedback, reps: currentState.reps, isCorrect: true };
}
