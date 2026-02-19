'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface PWAContextType {
    promptInstall: any;
    supportsPWA: boolean;
    installPWA: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider = ({ children }: { children: React.ReactNode }) => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
            });
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const installPWA = () => {
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
        promptInstall.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
                setPromptInstall(null); // Clear prompt after use
            } else {
                console.log('User dismissed the A2HS prompt');
            }
        });
    };

    return (
        <PWAContext.Provider value={{ promptInstall, supportsPWA, installPWA }}>
            {children}
        </PWAContext.Provider>
    );
};

export const usePWA = () => {
    const context = useContext(PWAContext);
    if (context === undefined) {
        throw new Error('usePWA must be used within a PWAProvider');
    }
    return context;
};
