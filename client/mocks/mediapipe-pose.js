// Empty mock for @mediapipe/pose
// This mock prevents Turbopack/Webpack bundling errors.

const mockPose = {
    Pose: function () {},
    POSE_CONNECTIONS: [],
    POSE_LANDMARKS: {},
    POSE_LANDMARKS_LEFT: {},
    POSE_LANDMARKS_RIGHT: {},
    POSE_LANDMARKS_NEUTRAL: {}
};

// Next.js client-side module execution expects this globally since we alias it!
if (typeof globalThis !== 'undefined') {
    globalThis.MPPose = mockPose;
} else if (typeof window !== 'undefined') {
    window.MPPose = mockPose;
}

module.exports = mockPose;
