'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const { email, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.errors?.[0]?.msg || 'Login failed');
        }
    };

    return (
        <main className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center px-6 pt-20">
                <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-gray-800">
                    <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
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

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                        >
                            Login
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-500 hover:text-blue-400">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
