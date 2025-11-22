'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How does the AI generate my plan?",
            answer: "Our AI analyzes your age, gender, weight, height, and fitness goals against thousands of successful data points to create a scientifically optimized routine just for you."
        },
        {
            question: "Do I need gym equipment?",
            answer: "Not necessarily! You can select 'Home Workout' to get a plan based entirely on bodyweight exercises, or 'Gym' if you have access to equipment."
        },
        {
            question: "Can I change my plan later?",
            answer: "Yes, you can regenerate your plan at any time from your dashboard as your goals or circumstances change."
        },
        {
            question: "Is the diet plan restrictive?",
            answer: "No. We focus on flexible dieting (IIFYM) and sustainable habits rather than strict restrictions, ensuring you can stick to the plan long-term."
        }
    ];

    return (
        <section className="py-24 bg-zinc-900">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white">
                    Frequently Asked <span className="text-blue-500">Questions</span>
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-black rounded-2xl border border-gray-800 overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-lg text-white">{faq.question}</span>
                                {openIndex === index ? (
                                    <Minus className="text-blue-500" />
                                ) : (
                                    <Plus className="text-gray-500" />
                                )}
                            </button>
                            <div
                                className={`px-6 text-gray-400 transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
