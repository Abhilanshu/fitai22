'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../context/PWAContext';

export default function InstallPWA() {
    const { supportsPWA, promptInstall, installPWA } = usePWA();
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (supportsPWA && promptInstall) {
            // Show banner after a delay if install is available
            const timer = setTimeout(() => setShowBanner(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [supportsPWA, promptInstall]);

    if (!showBanner) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-zinc-900 border border-blue-500/30 p-4 rounded-2xl shadow-2xl z-50 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Download className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Install FitAI App</h3>
                        <p className="text-xs text-gray-400">Add to Home Screen for offline access</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowBanner(false)}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400"
                    >
                        <X size={18} />
                    </button>
                    <button
                        onClick={() => {
                            installPWA();
                            setShowBanner(false);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors"
                    >
                        Install
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
