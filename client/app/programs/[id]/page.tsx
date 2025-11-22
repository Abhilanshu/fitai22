'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { programs, Program } from '@/lib/programs';
import { Play, Lock, CheckCircle, Utensils, Activity } from 'lucide-react';

export default function ProgramDetails() {
    const params = useParams();
    const router = useRouter();
    const [program, setProgram] = useState<Program | null>(null);
    const [unlocked, setUnlocked] = useState(false);

    useEffect(() => {
        if (params.id) {
            const foundProgram = programs.find((p) => p.id === params.id);
            if (foundProgram) {
                setProgram(foundProgram);
                // Auto-unlock non-premium programs
                if (!foundProgram.isPremium) {
                    setUnlocked(true);
                }
            } else {
                router.push('/');
            }
        }
    }, [params.id, router]);

    const handleUnlock = () => {
        // Mock payment/unlock logic
        const confirmed = window.confirm("Unlock Premium Access for $9.99?");
        if (confirmed) {
            setUnlocked(true);
            alert("Access Granted! Welcome to the Premium Tier.");
        }
    };

    if (!program) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Hero Section */}
            <div className={`relative py-24 overflow-hidden bg-gradient-to-br ${program.color}`}>
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4 border border-white/30">
                            {program.isPremium ? 'PREMIUM PROGRAM' : 'FREE PROGRAM'}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">{program.title}</h1>
                        <p className="text-xl text-white/90 mb-8 leading-relaxed">{program.description}</p>

                        {!unlocked && (
                            <button
                                onClick={handleUnlock}
                                className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
                            >
                                <Lock size={20} />
                                Unlock Full Access
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                {unlocked ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Workout Section */}
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Activity className="text-blue-500" />
                                    Workout Routine
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-zinc-900 rounded-xl border border-gray-800 text-center">
                                        <p className="text-xs text-gray-400 uppercase">Frequency</p>
                                        <p className="font-bold">{program.workoutPlan.frequency}</p>
                                    </div>
                                    <div className="p-4 bg-zinc-900 rounded-xl border border-gray-800 text-center">
                                        <p className="text-xs text-gray-400 uppercase">Duration</p>
                                        <p className="font-bold">{program.workoutPlan.duration}</p>
                                    </div>
                                    <div className="p-4 bg-zinc-900 rounded-xl border border-gray-800 text-center">
                                        <p className="text-xs text-gray-400 uppercase">Total Exercises</p>
                                        <p className="font-bold">{program.workoutPlan.exercises.length}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {program.workoutPlan.exercises.map((exercise, idx) => (
                                        <div key={idx} className="bg-zinc-900 p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-xs font-bold">{idx + 1}</span>
                                                    <h3 className="text-xl font-bold">{exercise.name}</h3>
                                                </div>
                                                <p className="text-gray-400 mb-4 pl-9">{exercise.sets}</p>
                                            </div>
                                            <div className="md:w-1/3">
                                                <a
                                                    href={exercise.video}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full py-3 bg-red-600 hover:bg-red-700 text-white text-center rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Play size={16} fill="currentColor" />
                                                    Watch Demo
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Diet Section */}
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Utensils className="text-green-500" />
                                    Nutrition Plan
                                </h2>
                                <div className="bg-zinc-900 rounded-xl border border-gray-800 overflow-hidden">
                                    {program.dietPlan.map((item, idx) => (
                                        <div key={idx} className="p-6 border-b border-gray-800 last:border-0 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-400 uppercase mb-1">{item.meal}</p>
                                                <p className="font-semibold text-lg">{item.food}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-400">{item.calories} kcal</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-zinc-900 p-6 rounded-2xl border border-gray-800 sticky top-24">
                                <h3 className="text-xl font-bold mb-4">Program Status</h3>
                                <div className="flex items-center gap-2 text-green-500 mb-6">
                                    <CheckCircle size={20} />
                                    <span className="font-semibold">Active Access</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-6">
                                    You have full access to all videos and nutrition guides in this program.
                                </p>
                                <div className="p-4 bg-black/50 rounded-lg border border-gray-800">
                                    <p className="text-xs text-gray-500 uppercase mb-2">Next Workout</p>
                                    <p className="font-bold">Day 1: {program.workoutPlan.exercises[0].name}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto text-center py-12">
                        <Lock className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Content Locked</h2>
                        <p className="text-gray-400 mb-8">
                            This is a premium program designed for serious results. Unlock it now to get instant access to the full workout schedule, video demonstrations, and customized meal plan.
                        </p>
                        <button
                            onClick={handleUnlock}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-600/20"
                        >
                            Unlock for $9.99
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
