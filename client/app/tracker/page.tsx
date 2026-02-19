'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ExerciseType, mapExerciseName } from '@/utils/exerciseLogic'; // Import type and helper

// Lazy load the AI Tracker for performance
const AITracker = dynamic(() => import('@/components/AITracker'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center h-96 w-full max-w-3xl bg-gray-900 rounded-3xl border border-gray-800 animate-pulse">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading AI Engine...</p>
        </div>
    ),
});

function TrackerContent() {
    const searchParams = useSearchParams();
    const exerciseParam = searchParams.get('exercise');

    // Validate exercise param using helper
    const initialExercise = mapExerciseName(exerciseParam || '');

    return (
        <div className="relative pt-32 pb-20 container mx-auto px-4 z-10 flex flex-col items-center">
            {/* Background Blobs */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                    AI Form Tracker
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Real-time posture analysis powered by TensorFlow.js. Select an exercise, enable your camera, and get instant feedback.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full flex justify-center"
            >
                <AITracker initialExercise={initialExercise} />
            </motion.div>
        </div>
    );
}

export default function TrackerPage() {
    return (
        <main className="min-h-screen bg-black text-white overflow-hidden selection:bg-blue-500/30">
            <Navbar />
            <Suspense fallback={<div className="pt-32 text-center text-white">Loading Tracker...</div>}>
                <TrackerContent />
            </Suspense>
        </main>
    );
}
