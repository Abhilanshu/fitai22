'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MuscleGroup, muscleColors } from '../lib/muscleMapping';

interface MuscleHeatmapProps {
    data: Record<MuscleGroup, number>; // Muscle -> Intensity (0-100+)
}

export default function MuscleHeatmap({ data }: MuscleHeatmapProps) {
    const getOpacity = (muscle: MuscleGroup) => {
        const intensity = data[muscle] || 0;
        // Normalize: 0 -> 0.2, 50+ -> 1.0
        return Math.min(0.2 + (intensity / 50) * 0.8, 1);
    };

    const getColor = (muscle: MuscleGroup) => {
        return muscleColors[muscle] || '#525252';
    };

    // SVG Paths for a stylized front/back body map
    // These are simplified generic paths
    const paths = {
        shoulders: "M85,60 Q115,60 145,60 L155,80 L140,90 L85,90 L30,90 L15,80 L25,60 Q55,60 85,60",
        chest: "M85,90 L140,90 L135,130 L85,130 L35,130 L30,90 L85,90",
        abs: "M85,130 L135,130 L130,190 L85,190 L40,190 L35,130 L85,130",
        biceps: "M155,80 L175,120 L155,125 L140,90 Z M15,80 L30,90 L15,125 L-5,120 Z", // Left & Right
        triceps: "M175,80 L195,120 L175,125 L160,90 Z M-5,80 L10,90 L-5,125 L-25,120 Z", // Simplified (usually back view)
        quads: "M40,190 L85,190 L130,190 L140,260 L85,260 L30,260 L40,190",
        calves: "M35,270 L85,270 L135,270 L130,340 L85,340 L40,340 L35,270",
        // Back view approximation logic or combined view
    };

    return (
        <div className="relative w-full h-[400px] flex items-center justify-center">
            <svg viewBox="0 0 170 360" className="h-full drop-shadow-2xl">
                {/* Silhouette Background */}
                <path d="M85,10 C105,10 115,30 115,50 L155,70 L175,120 L165,150 L140,190 L145,260 L140,340 L120,350 L85,350 L50,350 L30,340 L25,260 L30,190 L5,150 L-5,120 L15,70 L55,50 C55,30 65,10 85,10" fill="#171717" stroke="#262626" strokeWidth="2" />

                {/* Muscle Groups */}

                {/* Shoulders */}
                <motion.path
                    d="M30,70 Q85,50 140,70 L150,90 Q85,70 20,90 Z"
                    fill={getColor('shoulders')}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: getOpacity('shoulders') }}
                    stroke="black" strokeWidth="1"
                />

                {/* Chest */}
                <motion.path
                    d="M35,90 Q85,100 135,90 L130,140 Q85,150 40,140 Z"
                    fill={getColor('chest')}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: getOpacity('chest') }}
                    stroke="black" strokeWidth="1"
                />

                {/* Abs */}
                <motion.path
                    d="M45,140 Q85,150 125,140 L120,200 Q85,210 50,200 Z"
                    fill={getColor('abs')}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: getOpacity('abs') }}
                    stroke="black" strokeWidth="1"
                />

                {/* Arms (Biceps) */}
                <motion.path
                    d="M140,90 L165,95 L160,140 L135,130 Z M30,90 L5,95 L10,140 L35,130 Z"
                    fill={getColor('biceps')}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: getOpacity('biceps') }}
                    stroke="black" strokeWidth="1"
                />

                {/* Quads (Thighs) */}
                <motion.path
                    d="M40,200 Q85,210 130,200 L125,280 Q85,290 45,280 Z"
                    fill={getColor('quads')}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: getOpacity('quads') }}
                    stroke="black" strokeWidth="1"
                />

                {/* Calves */}
                <motion.path
                    d="M45,285 Q85,295 125,285 L120,350 Q85,360 50,350 Z"
                    fill={getColor('calves')}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: getOpacity('calves') }}
                    stroke="black" strokeWidth="1"
                />

                {/* Cardio Icon Overlay (Heart in Chest) */}
                {data['cardio'] && data['cardio'] > 10 && (
                    <motion.circle
                        cx="85" cy="115" r="10"
                        fill={getColor('cardio')}
                        animate={{ scale: [1, 1.2, 1], opacity: 0.8 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                )}

            </svg>

            {/* Legend */}
            <div className="absolute top-0 right-0 bg-black/80 p-4 rounded-xl border border-gray-800 text-xs">
                <div className="font-bold mb-2">Intensity Map</div>
                {Object.entries(data).map(([muscle, val]) => (
                    val > 0 && (
                        <div key={muscle} className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ background: muscleColors[muscle as MuscleGroup] }}></div>
                            <span className="capitalize text-gray-300">{muscle}: {val}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
