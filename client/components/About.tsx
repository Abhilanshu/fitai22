'use client';

export default function About() {
    return (
        <section id="about" className="py-20 bg-black text-white">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Science-Backed <br />
                        <span className="text-blue-500">Results</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-6">
                        We combine the latest in sports science with cutting-edge artificial intelligence to eliminate the guesswork from your fitness journey. No more generic plans—get a roadmap built just for you.
                    </p>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            Customized to your body type
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            Adapts to your schedule
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            Real-time adjustments
                        </li>
                    </ul>
                </div>
                <div className="md:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-20 rounded-full" />
                    <div className="relative bg-zinc-900 p-8 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                S
                            </div>
                            <div>
                                <div className="font-bold text-white text-lg">Sarah Jenkins</div>
                                <div className="text-sm text-blue-400">Lost 15kg in 3 months</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-gray-300 italic">
                                "FitAI completely changed my approach to health. The personalized plan was exactly what I needed—no guesswork, just results. I've never felt stronger!"
                            </p>
                            <div className="flex gap-1 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
