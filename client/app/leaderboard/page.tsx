'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Trophy, Medal, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
    _id: string; // Backend returns _id
    name: string;
    xp: number;
    totalWorkouts: number; // Backend returns totalWorkouts
    badges?: any[];
}

export default function Leaderboard() {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/leaderboard');
                setLeaders(res.data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="inline-block p-4 bg-yellow-500/10 rounded-full mb-4"
                    >
                        <Trophy className="text-yellow-500 w-16 h-16" />
                    </motion.div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        Global Leaderboard
                    </h1>
                    <p className="text-gray-400 mt-2">Top performers this week</p>
                </div>

                <div className="bg-zinc-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-800 text-gray-400 text-sm font-bold uppercase tracking-wider">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-6">Athlete</div>
                        <div className="col-span-2 text-center">XP</div>
                        <div className="col-span-2 text-center">Workouts</div>
                    </div>

                    <div className="divide-y divide-gray-800">
                        {leaders.length > 0 ? (
                            leaders.map((entry, idx) => (
                                <motion.div
                                    key={entry._id || idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/5 transition-colors ${idx < 3 ? 'bg-yellow-500/5' : ''}`}
                                >
// ...
                                    <div className="col-span-2 text-center text-gray-400">
                                        {entry.totalWorkouts}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                No ranked athletes yet. Be the first!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
