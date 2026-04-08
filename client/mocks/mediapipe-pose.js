// Empty mock for @mediapipe/pose
// @tensorflow-models/pose-detection imports this, but we only use MoveNet
// which does NOT actually require @mediapipe/pose at runtime.
// This mock prevents Turbopack/Webpack bundling errors.

exports.Pose = function () {};
exports.POSE_CONNECTIONS = [];
exports.POSE_LANDMARKS = {};
exports.POSE_LANDMARKS_LEFT = {};
exports.POSE_LANDMARKS_RIGHT = {};
exports.POSE_LANDMARKS_NEUTRAL = {};
