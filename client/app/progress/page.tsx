'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, Calendar, Trophy, Flame, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { motion } from 'framer-motion';
import { exerciseToMuscles, MuscleGroup } from '../../lib/muscleMapping';

// Lazy Load Components
const AnalyticsChart = dynamic(() => import('../../components/AnalyticsChart'), { ssr: false });
const HistoryCalendar = dynamic(() => import('../../components/HistoryCalendar'), { ssr: false });
const MuscleHeatmap = dynamic(() => import('../../components/MuscleHeatmap'), { ssr: false });

export default function Progress() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);

    // Chart States
    const [xpData, setXpData] = useState<any[]>([]);
    const [activityData, setActivityData] = useState<any[]>([]);
    const [muscleData, setMuscleData] = useState<Record<MuscleGroup, number>>({} as any);

    const [stats, setStats] = useState({
        totalWorkouts: 0,
        streak: 0,
        totalMinutes: 0,
        xp: 0
    });

    useEffect(() => {
        if (!user) return;

        const fetchProgress = async () => {
            try {
                // Fetch History from NEW endpoint
                const historyRes = await api.get(`/history/${user.id}`);
                const logs = historyRes.data;

                // Process logs for charts & stats
                const processed = logs.map((log: any) => ({
                    date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    xp: (log.exercises?.length || 0) * 50 + 100, // Est XP
                    minutes: Math.round(log.duration / 60)
                })).reverse(); // Oldest first for charts

                setHistory(logs);
                setXpData(processed.map((p: any) => ({ date: p.date, value: p.xp })));
                setActivityData(processed.map((p: any) => ({ date: p.date, value: p.minutes })));

                // Calculate Muscle Heatmap Data
                const muscleCounts: Record<string, number> = {};
                logs.forEach((log: any) => {
                    log.exercises.forEach((ex: any) => {
                        const targets = exerciseToMuscles[ex.name] || [];
                        targets.forEach((muscle) => {
                            muscleCounts[muscle] = (muscleCounts[muscle] || 0) + (ex.sets * ex.reps * 0.1); // Weighting
                        });
                    });
                });
                setMuscleData(muscleCounts as any);

                // Fetch Aggregated Stats
                const statsRes = await api.get(`/history/stats/${user.id}`);
                setStats({
                    totalWorkouts: statsRes.data.totalWorkouts,
                    streak: 0, // Todo: Calculate Streak
                    totalMinutes: Math.round(statsRes.data.totalDuration / 60),
                    xp: statsRes.data.totalWorkouts * 150 // Approx Total XP
                });

            } catch (err) {
                console.error('Error fetching progress:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                    <TrendingUp className="text-orange-500" size={40} />
                    Progress Tracking
                </h1>

                {/* Analytics Charts - Updated to use new structure and data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900 border border-gray-800 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="text-blue-400" />
                            <h2 className="text-xl font-bold">XP Growth</h2>
                        </div>
                        <div className="h-64">
                            <AnalyticsChart
                                data={xpData}
                                dataKey="value"
                                type="area"
                                color="#3b82f6"
                                title="XP Growth"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900 border border-gray-800 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="text-green-400" />
                            <h2 className="text-xl font-bold">Active Minutes</h2>
                        </div>
                        <div className="h-64">
                            <AnalyticsChart
                                data={activityData}
                                dataKey="value"
                                type="bar"
                                color="#22c55e"
                                title="Active Minutes"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 bg-zinc-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -z-10"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <Flame className="text-red-500" />
                            <h2 className="text-xl font-bold">Muscle Heatmap</h2>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-around">
                            <div className="text-gray-400 text-sm max-w-sm mb-8 md:mb-0">
                                <p className="mb-4">
                                    Visualize your training focus. Darker and more vibrant colors indicate higher training volume for that muscle group.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2"><div className="w-2 h-2 bg-red-400 rounded-full"></div> Chest & Push</li>
                                    <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-400 rounded-full"></div> Shoulders</li>
                                    <li className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div> Legs & Squat</li>
                                    <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full"></div> Core & Abs</li>
                                </ul>
                            </div>
                            <MuscleHeatmap data={muscleData} />
                        </div>
                    </motion.div>
                </div>

                {/* New Calendar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <HistoryCalendar />
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
                            <Trophy size={16} className="text-yellow-500" /> Total XP
                        </div>
                        <div className="text-2xl font-bold">{stats.xp}</div>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
                            <Flame size={16} className="text-orange-500" /> Streak
                        </div>
                        <div className="text-2xl font-bold">{stats.streak} Days</div>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
                            <Calendar size={16} className="text-blue-500" /> Workouts
                        </div>
                        <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
                            <TrendingUp size={16} className="text-green-500" /> Minutes
                        </div>
                        <div className="text-2xl font-bold">{stats.totalMinutes}</div>
                    </div>
                </div>

                {/* History List */}
                <div className="bg-zinc-900 rounded-3xl border border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="text-xl font-bold">Workout History</h3>
                        <button className="text-sm text-blue-500 hover:text-blue-400">View All</button>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {history.length > 0 ? (
                            history.map((item, idx) => (
                                <div key={idx} className="p-6 flex items-center justify-between hover:bg-black/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-orange-500/10 p-3 rounded-full text-orange-500">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">Workout Completed</div>
                                            <div className="text-sm text-gray-400">{item.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-500">+{item.xp} XP</div>
                                        <div className="text-sm text-gray-400">{item.exercises} Exercises</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                No workout history yet. Start your first workout in the Dashboard!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
