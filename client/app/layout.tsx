import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from '@/components/Chatbot';
import { AuthProvider } from '../context/AuthContext';
import { PWAProvider } from '../context/PWAContext';
import InstallPWA from '@/components/InstallPWA'; // Import PWA Component
import Script from 'next/script';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitAI - Your Ultimate Personal AI Trainer",
  description: "FitAI is a revolutionary AI-powered workout tracker and meal planner. Use your phone camera for real-time form correction, voice-controlled workouts, and diet tracking.",
  keywords: ["FitAI", "Fit AI", "AI Trainer", "Workout Tracker", "AI form correction", "Fitness App", "Home Workout", "AI Coach"],
  authors: [{ name: "Abhilanshu" }],
  openGraph: {
    title: "FitAI - Personal Trainer",
    description: "Get real-time AI form correction, voice-controlled tracking, and automated diet plans directly from your browser. No app install needed!",
    url: "https://fitai22-8.onrender.com",
    siteName: "FitAI",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <PWAProvider>
            {children}
            <Chatbot />
            <InstallPWA />
          </PWAProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
