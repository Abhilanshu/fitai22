'use client';

import { useState } from 'react';
import { Play, Lock } from 'lucide-react';
import Link from 'next/link';
import { programs } from '@/lib/programs';

export default function Programs() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Specialized Programs
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Choose a path that fits your goals. Follow along with our expert-curated video sessions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {programs.map((program, idx) => (
                        <ProgramCard key={idx} program={program} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProgramCard({ program }: { program: any }) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all hover:-translate-y-2 duration-300">
            {/* Video Embed / Thumbnail */}
            <div className="relative aspect-video w-full bg-black">
                {isPlaying ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${program.videoId}?autoplay=1`}
                        title={program.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    ></iframe>
                ) : (
                    <div className="absolute inset-0 w-full h-full cursor-pointer group/video" onClick={() => setIsPlaying(true)}>
                        <img
                            src={`https://img.youtube.com/vi/${program.videoId}/maxresdefault.jpg`}
                            alt={program.title}
                            className="w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-blue-600/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover/video:scale-110 transition-transform">
                                <Play size={32} className="text-white ml-1" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                )}
                {program.isPremium && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/20 pointer-events-none">
                        <Lock size={12} className="text-yellow-400" />
                        <span className="text-xs font-bold text-white">PREMIUM • ₹999</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3 bg-gradient-to-r ${program.color}`}>
                    {program.isPremium ? 'PREMIUM' : 'FEATURED'}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{program.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {program.description}
                </p>

                <Link href={`/programs/${program.id}`} className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors flex items-center justify-center gap-2 group-hover:text-blue-400">
                    <Play size={16} fill="currentColor" />
                    {program.isPremium ? 'Unlock Program' : 'Start Program'}
                </Link>
            </div>
        </div>
    );
}
