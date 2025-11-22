'use client';

import { Star } from 'lucide-react';

export default function Testimonials() {
    const testimonials = [
        {
            name: "Michael Chen",
            role: "Software Engineer",
            content: "I never had time for the gym until I found FitAI. The 30-minute home workouts are a game changer.",
            rating: 5
        },
        {
            name: "Emma Davis",
            role: "Marketing Director",
            content: "The nutrition plan is actually sustainable. I'm eating food I love and still hitting my goals.",
            rating: 5
        },
        {
            name: "James Wilson",
            role: "Student",
            content: "Gained 10lbs of muscle in 2 months. The AI adjustments kept me progressing every single week.",
            rating: 5
        }
    ];

    return (
        <section className="py-24 bg-black text-white">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                    What Our Users <span className="text-blue-500">Say</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-zinc-900 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-colors">
                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {[...Array(t.rating)].map((_, idx) => (
                                    <Star key={idx} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed">"{t.content}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{t.name}</h4>
                                    <p className="text-xs text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
