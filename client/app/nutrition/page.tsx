'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Check, X, Loader2, Utensils, Info, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

// Mock Database of detectable foods
const MOCK_FOOD_DATABASE = [
    { name: 'Grilled Chicken Salad', calories: 450, protein: '40g', carbs: '12g', fat: '15g' },
    { name: 'Oatmeal with Berries', calories: 320, protein: '8g', carbs: '55g', fat: '6g' },
    { name: 'Protein Shake', calories: 180, protein: '25g', carbs: '5g', fat: '2g' },
    { name: 'Avocado Toast', calories: 380, protein: '12g', carbs: '45g', fat: '18g' },
    { name: 'Salmon & Quinoa', calories: 550, protein: '35g', carbs: '40g', fat: '22g' },
    { name: 'Greek Yogurt Parfait', calories: 280, protein: '15g', carbs: '35g', fat: '5g' },
];

export default function NutritionScanner() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [logging, setLogging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraActive, setCameraActive] = useState(false);

    // Camera handling
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            console.error('Camera access denied:', err);
            alert('Camera access denied. Please use "Upload Image" instead.');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setCameraActive(false);
        }
    };

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImage(dataUrl);
            stopCamera();
            analyzeImage();
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                analyzeImage();
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = () => {
        setAnalyzing(true);
        setResult(null);

        // Simulate AI Delay (2-3 seconds)
        setTimeout(() => {
            const randomFood = MOCK_FOOD_DATABASE[Math.floor(Math.random() * MOCK_FOOD_DATABASE.length)];
            setResult(randomFood);
            setAnalyzing(false);
        }, 2500);
    };

    const logMeal = async () => {
        if (!result) return;
        setLogging(true);
        try {
            await api.post('/plan/diet-log', {
                mealName: result.name, // Log the detected name
                eaten: true
            });
            // Show success and redirect
            alert(`Logged ${result.name} successfully!`);
            router.push('/dashboard');
        } catch (err) {
            console.error('Failed to log meal:', err);
            alert('Failed to log meal. Please try again.');
        } finally {
            setLogging(false);
        }
    };

    const reset = () => {
        setImage(null);
        setResult(null);
        setAnalyzing(false);
        stopCamera();
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ScanLine className="text-purple-500" size={32} />
                        AI Meal Scanner
                    </h1>
                    <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-zinc-800 rounded-full">
                        <X />
                    </button>
                </div>

                <div className="bg-zinc-900 rounded-3xl border border-gray-800 overflow-hidden relative min-h-[400px] flex flex-col items-center justify-center">

                    {!image && !cameraActive && (
                        <div className="text-center p-8 space-y-6">
                            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Utensils size={40} className="text-gray-500" />
                            </div>
                            <h2 className="text-xl font-bold">What are you eating?</h2>
                            <p className="text-gray-400 max-w-sm mx-auto">
                                Snap a photo or upload an image. Our AI will analyze the nutrition for you.
                            </p>

                            <div className="flex gap-4 justify-center mt-8">
                                <button
                                    onClick={startCamera}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105"
                                >
                                    <Camera size={20} /> Take Photo
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105"
                                >
                                    <Upload size={20} /> Upload
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        </div>
                    )}

                    {cameraActive && (
                        <div className="relative w-full h-full flex flex-col items-center">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-[400px] object-cover" />
                            <button
                                onClick={captureImage}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-300 shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                            >
                                <div className="w-12 h-12 bg-transparent border-2 border-black rounded-full" />
                            </button>
                        </div>
                    )}

                    {image && (
                        <div className="relative w-full h-full">
                            <img src={image} alt="Meal" className="w-full max-h-[500px] object-cover opacity-80" />

                            {/* Analyzing Overlay */}
                            {analyzing && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                    <div className="text-center">
                                        <div className="relative w-20 h-20 mx-auto mb-4">
                                            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping" />
                                            <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin" />
                                            <ScanLine className="absolute inset-0 m-auto text-purple-500" />
                                        </div>
                                        <h3 className="text-xl font-bold animate-pulse">Analyzing Food...</h3>
                                        <p className="text-sm text-gray-400 mt-2">Identifying ingredients & macros</p>
                                    </div>
                                </div>
                            )}

                            {/* Result Card */}
                            {!analyzing && result && (
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-12 p-6">
                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="bg-zinc-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="text-purple-400 text-xs font-mono mb-1 uppercase tracking-wider flex items-center gap-1">
                                                    <ScanLine size={12} /> AI Detected
                                                </div>
                                                <h2 className="text-2xl font-bold">{result.name}</h2>
                                            </div>
                                            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg font-bold text-sm">
                                                {result.calories} kcal
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <div className="bg-black/40 p-3 rounded-xl text-center">
                                                <div className="text-gray-400 text-xs">Protein</div>
                                                <div className="font-bold text-blue-400">{result.protein}</div>
                                            </div>
                                            <div className="bg-black/40 p-3 rounded-xl text-center">
                                                <div className="text-gray-400 text-xs">Carbs</div>
                                                <div className="font-bold text-orange-400">{result.carbs}</div>
                                            </div>
                                            <div className="bg-black/40 p-3 rounded-xl text-center">
                                                <div className="text-gray-400 text-xs">Fats</div>
                                                <div className="font-bold text-yellow-400">{result.fat}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={reset}
                                                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-colors"
                                            >
                                                Scan Again
                                            </button>
                                            <button
                                                onClick={logMeal}
                                                disabled={logging}
                                                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                            >
                                                {logging ? <Loader2 className="animate-spin" /> : <Check size={20} />}
                                                Log to Plan
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                        </div>
                    )}

                </div>

                <div className="mt-6 flex items-start gap-3 bg-blue-500/10 p-4 rounded-xl text-sm text-blue-300 border border-blue-500/20">
                    <Info className="shrink-0 mt-0.5" size={16} />
                    <p>
                        This is a <strong>Simulation</strong>. In a production app, this would connect to the OpenAI Vision API or a custom TensorFlow model to analyze real food pixels.
                    </p>
                </div>
            </div>
        </div>
    );
}
