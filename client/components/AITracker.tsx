'use client';

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl'; // Register WebGL backend
import { analyzeExercise, ExerciseType, resetState } from '../utils/exerciseLogic';
import { Camera, ChevronDown, Activity, RefreshCw, Maximize } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import MotionAvatar from './MotionAvatar';

const Exercises: ExerciseType[] = [
    'Squat', 'Pushup', 'Bicep Curl',
    'Jumping Jacks', 'Lunges', 'Plank',
    'High Knees', 'Mountain Climbers',
    'Overhead Press', 'Glute Bridges'
];

interface AITrackerProps {
    initialExercise?: ExerciseType;
}

export default function AITracker({ initialExercise = 'Squat' }: AITrackerProps) {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseType>(initialExercise);
    const [reps, setReps] = useState(0);
    const [feedback, setFeedback] = useState('Loading AI Model...');
    const [isCorrect, setIsCorrect] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Refs for accessing state inside the loop without dependencies
    const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
    const exerciseRef = useRef<ExerciseType>(initialExercise);
    const loopRef = useRef<NodeJS.Timeout | null>(null);

    // Update the ref whenever the state changes
    useEffect(() => {
        exerciseRef.current = selectedExercise;
    }, [selectedExercise]);

    // Load Model ONCE
    useEffect(() => {
        const loadModel = async () => {
            try {
                await tf.setBackend('webgl');
                await tf.ready();
                const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
                    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
                });
                detectorRef.current = detector;
                setIsLoading(false);
                setFeedback('Ready! Stand in frame.');

                // Start detection loop
                startLoop();
            } catch (err) {
                console.error("Failed to load AI model", err);
                setFeedback("Error loading AI. Refresh page.");
            }
        };

        loadModel();

        return () => {
            if (loopRef.current) clearInterval(loopRef.current);
        };
    }, []);

    const startLoop = () => {
        if (loopRef.current) clearInterval(loopRef.current);
        loopRef.current = setInterval(() => {
            detectPose();
        }, 100);
    };

    const containerRef = useRef<HTMLDivElement>(null);

    // Handle Native Fullscreen changes (e.g. user presses ESC)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                if (containerRef.current) {
                    await containerRef.current.requestFullscreen();
                }
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error("Error toggling fullscreen:", err);
        }
    };

    const [isMuted, setIsMuted] = useState(false);
    const isMutedRef = useRef(false); // Ref to track mute state in closure
    const lastFeedbackTime = useRef<number>(0);
    const lastSpokenMsg = useRef<string>('');

    const toggleMute = () => {
        const newState = !isMuted;
        setIsMuted(newState);
        isMutedRef.current = newState;
        if (newState) {
            window.speechSynthesis.cancel();
        }
    };

    const speakFeedback = (text: string) => {
        // Use ref to check mute state inside the interval loop
        if (isMutedRef.current || !text || text === 'Observing...') return;

        // List of instructional messages to NOT speak (Text only)
        // We only want to hear CORRECTIONS (e.g. "Go Lower") or SUCCESS (e.g. "Good Rep")
        const SILENT_MESSAGES = [
            'Squat down!', 'Push Up!', 'Curl Up!', 'Jump!', 'Lunge down!',
            'Hold...', 'Drive knees!', 'Press Up!', 'Lift Hips!',
            'Get into Plank!', 'Start whenever you are ready!',
            'Hold... and Up!', 'Drive knees fast!', 'Show profile', 'Push all the way up!',
            'Lower chest!', 'Squeeze!'
        ];

        // Do not speak neutral instructions
        if (SILENT_MESSAGES.includes(text)) return;

        const now = Date.now();

        // If message is SAME as last one, wait 8 seconds (reduce irritation)
        if (text === lastSpokenMsg.current && now - lastFeedbackTime.current < 8000) return;

        // If message is DIFFERENT, allow quicker switch (2s) but not instant overlap
        if (text !== lastSpokenMsg.current && now - lastFeedbackTime.current < 2000) return;

        // Cancel previous speech to avoid queue buildup
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);

        lastFeedbackTime.current = now;
        lastSpokenMsg.current = text;
    };

    const detectPose = async () => {
        const detector = detectorRef.current;
        if (
            !detector ||
            typeof webcamRef.current === 'undefined' ||
            webcamRef.current === null ||
            !webcamRef.current.video ||
            webcamRef.current.video.readyState !== 4
        ) {
            return;
        }

        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        if (canvasRef.current) {
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
        }

        try {
            const poses = await detector.estimatePoses(video);

            if (poses.length > 0) {
                const keypoints = poses[0].keypoints;

                // Use the REF current value to ensure we use the latest selected exercise
                const result = analyzeExercise(exerciseRef.current, keypoints);

                if (result.feedback !== feedback) {
                    setFeedback(result.feedback);
                    speakFeedback(result.feedback);
                }

                setReps(result.reps);
                setIsCorrect(result.isCorrect);

                drawCanvas(keypoints, video, videoWidth, videoHeight);
            }
        } catch (err) {
            console.error("Detection error:", err);
        }
    };

    const drawCanvas = (keypoints: any, video: any, width: number, height: number) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);

        // Draw connections
        const connections = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
        connections.forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];

            if (kp1.score > 0.3 && kp2.score > 0.3) {
                ctx.beginPath();
                ctx.moveTo(kp1.x, kp1.y);
                ctx.lineTo(kp2.x, kp2.y);
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#3b82f6'; // Blue
                ctx.stroke();
            }
        });

        // Draw keypoints
        keypoints.forEach((kp: any) => {
            if (kp.score > 0.3) {
                ctx.beginPath();
                ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
                ctx.fillStyle = '#ef4444'; // Red
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.stroke();
            }
        });
    };

    // Greeting on Exercise Change
    useEffect(() => {
        const msg = `Ready for ${selectedExercise}`;
        setFeedback(msg);

        // Speak greeting with slight delay to ensure model is ready
        setTimeout(() => {
            const u = new SpeechSynthesisUtterance(msg);
            u.rate = 1.0;
            window.speechSynthesis.speak(u);
        }, 500);

    }, [selectedExercise]);

    const [startTime] = useState<number>(Date.now());
    const { user } = useAuth();

    const saveWorkout = async () => {
        if (reps === 0) return;
        try {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            await api.post('/history/log', {
                userId: user?.id,
                duration: duration,
                caloriesBurned: Math.floor(reps * 0.5), // Approx calc
                exercises: [{
                    name: selectedExercise,
                    reps: reps,
                    sets: 1,
                    duration: duration
                }]
            });
            setFeedback('Workout Saved! Check History.');
            speakFeedback('Workout Saved');
        } catch (err) {
            console.error('Failed to save workout', err);
        }
    };

    const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Save previous exercise before switching if reps > 0
        if (reps > 0) {
            saveWorkout();
        }

        setSelectedExercise(e.target.value as ExerciseType);
        resetState();
        setReps(0);
    };

    const resetCounter = () => {
        resetState();
        setReps(0);
        setFeedback('Counter Reset. Ready!');
        speakFeedback('Counter Reset');
    };

    return (
        <div ref={containerRef} className={`${isFullscreen ? 'fixed inset-0 z-[9999] bg-black flex items-center justify-center p-0' : 'flex flex-col items-center justify-center p-4 w-full h-full bg-black/40 rounded-3xl border border-gray-800 backdrop-blur-sm'}`}>

            {/* Header / Controls */}
            <div className={`w-full flex flex-col md:flex-row justify-between items-center mb-6 gap-4 ${isFullscreen ? 'absolute top-4 left-4 right-4 z-[10000] px-4' : ''}`}>
                {!isFullscreen && (
                    <div className="flex items-center gap-3">
                        <Activity className="text-blue-500 w-8 h-8" />
                        <h2 className="text-2xl font-bold text-white tracking-tight">AI Trainer</h2>
                    </div>
                )}

                <div className="flex items-center gap-4 ml-auto">
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-white font-bold"
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>

                    <div className="relative">
                        <select
                            value={selectedExercise}
                            onChange={handleExerciseChange}
                            className="appearance-none bg-gray-800 text-white pl-4 pr-10 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-semibold tracking-wide"
                        >
                            {Exercises.map(ex => (
                                <option key={ex} value={ex}>{ex}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    <button
                        onClick={() => {
                            if (isMutedRef.current) return;
                            const u = new SpeechSynthesisUtterance("Voice Coach Active");
                            u.volume = 1.0;
                            u.rate = 1.0;
                            window.speechSynthesis.speak(u);
                        }}
                        className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-colors font-bold text-xs"
                        title="Test Audio"
                    >
                        Test Audio
                    </button>

                    <button
                        onClick={toggleMute}
                        className={`p-2 rounded-xl transition-colors ${isMuted ? 'bg-red-900/50 text-red-200' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                        title={isMuted ? "Unmute Voice Coach" : "Mute Voice Coach"}
                    >
                        {isMuted ? "🔇" : "🔊"}
                    </button>

                    <button
                        onClick={resetCounter}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-white"
                        title="Reset Counter"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Webcam / Canvas Display */}
            <div className={`relative bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl ${isFullscreen ? 'w-full h-full rounded-none border-none' : 'w-full max-w-3xl aspect-video'}`}>
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gray-900/90 text-white">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-medium animate-pulse">Loading AI Model...</p>
                    </div>
                )}

                <Webcam
                    ref={webcamRef}
                    className="absolute inset-0 w-full h-full object-cover opacity-0" // Hide webcam, show canvas
                    mirrored
                />

                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-contain"
                />

                {/* Smart Alert: Fullscreen Recommendation */}
                {feedback.includes('Fullscreen') && !isFullscreen && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6 text-center">
                        <Maximize className="text-yellow-500 w-16 h-16 mb-4 animate-bounce" />
                        <h3 className="text-2xl font-bold text-white mb-2">Adjust Camera</h3>
                        <p className="text-gray-300 mb-6">We can't see your feet! For best results, use Fullscreen or step back.</p>
                        <button
                            onClick={toggleFullscreen}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all transform hover:scale-105"
                        >
                            Enter Fullscreen
                        </button>
                    </div>
                )}

                {/* Stats Overlay */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 z-10">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Reps</p>
                    <p className="text-4xl font-extrabold text-white">{reps}</p>
                </div>

                {/* AI Motion Mirror (Small Avatar) */}
                <div className="absolute bottom-4 left-4 z-20 hidden md:block opacity-90 hover:opacity-100 transition-opacity">
                    <MotionAvatar exercise={selectedExercise} />
                </div>

                {/* Feedback Overlay */}
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full border shadow-lg min-w-[200px] text-center backdrop-blur-md transition-colors duration-300 z-10 ${isCorrect
                    ? 'bg-green-900/80 border-green-500/50 text-green-200'
                    : 'bg-red-900/80 border-red-500/50 text-red-200'
                    }`}>
                    <p className="text-lg font-bold animate-pulse-slow">
                        {feedback}
                    </p>
                </div>
            </div>

            {!isFullscreen && (
                <div className="mt-6 text-center text-gray-500 text-sm max-w-lg">
                    <p>Ensure your full body is visible in the camera. The AI analyzes your key joints (Shoulders, Hips, Knees) to verify your form.</p>
                </div>
            )}
        </div>
    );
}
