'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 z-0" />

            {/* Animated Shapes */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-0"
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    rotate: [0, -90, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl z-0"
            />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                >
                    Transform Your Body with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        AI-Powered Precision
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
                >
                    Get personalized workout plans and diet schedules tailored to your unique biology and goals, generated instantly by our advanced AI engine.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col md:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/signup"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:scale-105"
                    >
                        Start Your Journey
                    </Link>
                    <Link
                        href="#features"
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold text-lg backdrop-blur-sm transition-all hover:scale-105"
                    >
                        Learn More
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
