'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Save, RefreshCw, User as UserIcon, Activity, Ruler, Weight, Award, Dumbbell, Footprints, Hand } from 'lucide-react';

export default function Profile() {
    const router = useRouter();
    const { user, loading: authLoading, refreshUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        weight: '',
        height: '',
        fitness_goal: '',
        activity_level: ''
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            setFormData({
                age: user.age?.toString() || '',
                gender: user.gender || 'male',
                weight: user.weight?.toString() || '',
                height: user.height?.toString() || '',
                fitness_goal: user.fitness_goal || 'weight_loss',
                activity_level: user.activity_level || 'sedentary'
            });
        }
    }, [user, authLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // 1. Update Profile
            await api.put('/user/profile', formData);

            // 2. Regenerate Plan
            await api.post('/plan/generate');

            // 3. Refresh Local User Data
            await refreshUser();

            // 4. Redirect
            router.push('/dashboard');
        } catch (err) {
            console.error('Failed to update profile', err);
            setSaving(false);
        }
    };

    // Helper to render dynamic badge icons
    const renderBadgeIcon = (iconName: string) => {
        switch (iconName) {
            case 'Dumbbell': return <Dumbbell className="text-blue-900" size={24} />;
            case 'Footprints': return <Footprints className="text-green-900" size={24} />;
            case 'Hand': return <Hand className="text-yellow-900" size={24} />;
            default: return <Award className="text-purple-900" size={24} />;
        }
    };

    const getBadgeColor = (iconName: string) => {
        switch (iconName) {
            case 'Dumbbell': return 'bg-blue-400';
            case 'Footprints': return 'bg-green-400';
            case 'Hand': return 'bg-yellow-400';
            default: return 'bg-purple-400';
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <UserIcon className="text-blue-500" size={40} />
                        Your Profile
                    </h1>
                    <p className="text-gray-400">Manage your stats and view your achievements.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: Badges */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-zinc-900 p-6 rounded-3xl border border-gray-800">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Award className="text-yellow-500" /> Achievements
                            </h3>

                            <div className="space-y-4">
                                {user?.badges && user.badges.length > 0 ? (
                                    user.badges.map((badge: any, idx: number) => (
                                        <div key={idx} className="bg-black/50 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${getBadgeColor(badge.icon)}`}>
                                                {renderBadgeIcon(badge.icon)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{badge.name}</div>
                                                <div className="text-xs text-gray-400">{badge.description}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        <div className="bg-gray-800/50 w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center">
                                            <Award className="text-gray-600" />
                                        </div>
                                        No badges yet.
                                        <br />Start working out to earn them!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="bg-zinc-900 p-6 rounded-3xl border border-gray-800">
                            <h3 className="text-xl font-bold mb-4">Lifetime Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-gray-400">Workouts</span>
                                    <span className="font-bold text-xl">{user?.totalWorkouts || 0}</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-gray-400">XP</span>
                                    <span className="font-bold text-xl text-yellow-500">{user?.xp || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-zinc-900 p-8 rounded-3xl border border-gray-800">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Gender</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                            <Weight size={16} /> Weight (kg)
                                        </label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                            <Ruler size={16} /> Height (cm)
                                        </label>
                                        <input
                                            type="number"
                                            name="height"
                                            value={formData.height}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                        <Activity size={16} /> Fitness Goal
                                    </label>
                                    <select
                                        name="fitness_goal"
                                        value={formData.fitness_goal}
                                        onChange={handleChange}
                                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="weight_loss">Weight Loss</option>
                                        <option value="muscle_gain">Muscle Gain</option>
                                        <option value="general_fitness">General Fitness</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Activity Level</label>
                                    <select
                                        name="activity_level"
                                        value={formData.activity_level}
                                        onChange={handleChange}
                                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="sedentary">Sedentary (Little to no exercise)</option>
                                        <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                                        <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                                        <option value="very_active">Very Active (6-7 days/week)</option>
                                        <option value="extra_active">Extra Active (Physical job or 2x training)</option>
                                    </select>
                                </div>

                                <div className="pt-6 border-t border-gray-800">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>
                                                <RefreshCw className="animate-spin" /> Regenerating Plan...
                                            </>
                                        ) : (
                                            <>
                                                <Save /> Save & Regenerate Plan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
