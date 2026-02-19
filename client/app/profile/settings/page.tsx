'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User, Save, RefreshCw, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
        goal: 'muscle_gain',
        activityLevel: 'moderate',
        dietType: 'balanced',
        equipment: [] as string[] // Assuming equipment is an array of strings
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/profile');
                setUser(res.data);
                setFormData({
                    name: res.data.name || '',
                    age: res.data.age || '',
                    weight: res.data.weight || '',
                    height: res.data.height || '',
                    goal: res.data.goal || 'muscle_gain',
                    activityLevel: res.data.activityLevel || 'moderate',
                    dietType: res.data.dietType || 'balanced',
                    equipment: res.data.equipment || []
                });
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            // Update profile
            await api.put('/user/profile', formData);

            // Should we regenerate plan? Maybe ask user?
            // For now, let's just save.
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleRegeneratePlan = async () => {
        if (!confirm("Are you sure? This will overwrite your current plan with a new one based on your current stats.")) return;

        setUpdating(true);
        try {
            await api.post('/plan/generate');
            router.push('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to regenerate plan');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
                        &larr; Back
                    </button>
                    <h1 className="text-3xl font-bold">Profile Settings</h1>
                </div>

                <div className="bg-zinc-900 rounded-3xl border border-gray-800 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Weight (kg)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Height (cm)</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="space-y-4 pt-4 border-t border-gray-800">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Fitness Goal</label>
                                <select
                                    name="goal"
                                    value={formData.goal}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                >
                                    <option value="weight_loss">Weight Loss</option>
                                    <option value="muscle_gain">Muscle Gain</option>
                                    <option value="endurance">Endurance</option>
                                    <option value="flexibility">Flexibility</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Diet Preference</label>
                                <select
                                    name="dietType"
                                    value={formData.dietType}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                >
                                    <option value="balanced">Balanced</option>
                                    <option value="keto">Keto</option>
                                    <option value="vegan">Vegan</option>
                                    <option value="paleo">Paleo</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <button
                                type="submit"
                                disabled={updating}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <Save size={20} />
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={handleRegeneratePlan}
                                disabled={updating}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-700"
                            >
                                <RefreshCw size={20} />
                                Regenerate Plan
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                router.push('/login');
                            }}
                            className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            <LogOut size={20} />
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
