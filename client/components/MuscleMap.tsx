'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const muscles = [
    { id: 'chest', name: 'Chest', cx: 50, cy: 28, r: 8, info: 'Pectoralis Major & Minor. Best exercises: Bench Press, Push-ups, Flys.' },
    { id: 'back', name: 'Back', cx: 50, cy: 30, r: 10, info: 'Latissimus Dorsi, Traps, Rhomboids. Best exercises: Pull-ups, Rows, Deadlifts.', isBack: true },
    { id: 'shoulders', name: 'Shoulders', cx: 50, cy: 22, r: 7, info: 'Deltoids (Front, Side, Rear). Best exercises: Overhead Press, Lateral Raises.' },
    { id: 'arms', name: 'Arms', cx: 25, cy: 35, r: 6, info: 'Biceps & Triceps. Best exercises: Curls, Dips, Skullcrushers.' },
    { id: 'abs', name: 'Abs', cx: 50, cy: 42, r: 7, info: 'Rectus Abdominis & Obliques. Best exercises: Planks, Crunches, Leg Raises.' },
    { id: 'legs', name: 'Legs', cx: 50, cy: 65, r: 12, info: 'Quads, Hamstrings, Glutes, Calves. Best exercises: Squats, Lunges, Leg Press.' },
];

export default function MuscleMap() {
    const [activeMuscle, setActiveMuscle] = useState<any>(null);
    const [view, setView] = useState<'front' | 'back'>('front');

    return (
        <div className="bg-zinc-900 rounded-3xl border border-gray-800 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Info className="text-blue-500" /> 3D Body Map
                    </h3>
                    <p className="text-gray-400 text-sm">Interactive Anatomy Visualization</p>
                </div>
                <div className="flex gap-2 bg-black/50 p-1 rounded-lg">
                    <button
                        onClick={() => setView('front')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'front' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Front
                    </button>
                    <button
                        onClick={() => setView('back')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'back' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Back
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative z-10">
                {/* Body Map Container */}
                <div className="relative w-64 h-96 bg-black/30 rounded-2xl border border-gray-800 flex items-center justify-center group overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-full"
                        >
                            <img
                                src={view === 'front' ? '/body-front.png' : '/body-back.png'}
                                alt={`Body ${view} view`}
                                className="w-full h-full object-contain opacity-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            />

                            {/* Interactive Points Overlay */}
                            <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full">
                                {muscles.filter(m => (view === 'front' ? !m.isBack : m.isBack)).map((m) => (
                                    <motion.circle
                                        key={m.id}
                                        cx={view === 'front' ? m.cx : (100 - m.cx)} // Mirror for back view if needed
                                        cy={m.cy}
                                        r={m.r}
                                        className="fill-blue-500/30 hover:fill-blue-400/60 cursor-pointer stroke-blue-400 stroke-[0.5]"
                                        onClick={() => setActiveMuscle(m)}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        whileHover={{ scale: 1.2 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    />
                                ))}
                            </svg>
                        </motion.div>
                    </AnimatePresence>

                    {/* Scanning Line Animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,1)] animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>
                </div>

                {/* Info Panel */}
                <div className="flex-1 w-full md:w-auto h-64">
                    <AnimatePresence mode="wait">
                        {activeMuscle ? (
                            <motion.div
                                key={activeMuscle.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-black/50 p-6 rounded-xl border border-blue-500/30 h-full flex flex-col justify-center"
                            >
                                <h4 className="text-xl font-bold text-blue-400 mb-2">{activeMuscle.name}</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">{activeMuscle.info}</p>
                                <div className="mt-4 pt-4 border-t border-gray-800">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-green-400 text-sm">Recovered</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center text-gray-500 p-8 border border-dashed border-gray-800 rounded-xl h-full flex items-center justify-center"
                            >
                                <p>Click on a muscle group to view details.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
