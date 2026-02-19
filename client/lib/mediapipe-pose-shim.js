/* eslint-disable */
// Shim for @mediapipe/pose to fix "Export Pose doesn't exist" error
// The package claims to be ESM in package.json but is actually UMD/CJS.
const mpPose = require('../node_modules/@mediapipe/pose/pose.js');
module.exports = mpPose;
