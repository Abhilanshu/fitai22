'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        fitness_goal: 'weight_loss',
        activity_level: 'sedentary',
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const { name, email, password, age, gender, height, weight, fitness_goal, activity_level } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val < 0) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/signup', {
                ...formData,
                age: Number(age),
                height: Number(height),
                weight: Number(weight),
            });
            localStorage.setItem('token', res.data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.errors?.[0]?.msg || 'Signup failed');
        }
    };

    return (
        <main className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center px-6 py-20">
                <div className="w-full max-w-2xl bg-zinc-900 p-8 rounded-2xl border border-gray-800">
                    <h2 className="text-3xl font-bold text-center mb-8">Create Your Account</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                required
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                            <input
                                type="number"
                                name="age"
                                min="1"
                                value={age}
                                onChange={onNumberChange}
                                required
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="25"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Gender</label>
                            <select
                                name="gender"
                                value={gender}
                                onChange={onChange}
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                min="1"
                                value={height}
                                onChange={onNumberChange}
                                required
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="175"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                min="1"
                                value={weight}
                                onChange={onNumberChange}
                                required
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="70"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Fitness Goal</label>
                            <select
                                name="fitness_goal"
                                value={fitness_goal}
                                onChange={onChange}
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="weight_loss">Weight Loss</option>
                                <option value="muscle_gain">Muscle Gain</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="general_fitness">General Fitness</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Activity Level</label>
                            <select
                                name="activity_level"
                                value={activity_level}
                                onChange={onChange}
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="sedentary">Sedentary (Little to no exercise)</option>
                                <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                                <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                                <option value="very_active">Very Active (6-7 days/week)</option>
                                <option value="extra_active">Extra Active (Physical job or training)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                            >
                                Create Account & Generate Plan
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-500 hover:text-blue-400">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
