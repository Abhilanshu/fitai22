import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from '@/components/Chatbot';
import { AuthProvider } from '../context/AuthContext';
import { PWAProvider } from '../context/PWAContext';
import InstallPWA from '@/components/InstallPWA'; // Import PWA Component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitAI - Personal Trainer",
  description: "AI-powered workout and meal plans tailored to your goals.",
  manifest: "/manifest.json", // Add Manifest Link
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
