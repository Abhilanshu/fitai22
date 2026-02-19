'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle rotation
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.4;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
        }
    });

    return (
        <Sphere ref={meshRef} visible args={[1, 100, 200]} scale={2}>
            <MeshDistortMaterial
                color="#0ea5e9" // Brighter Blue (Sky 500)
                emissive="#0284c7" // Emissive Blue (Sky 600)
                emissiveIntensity={0.5} // Slight internal glow
                attach="material"
                distort={0.4} // Wobbly effect
                speed={2} // Fast pulse
                roughness={0.2}
                metalness={0.9}
            />
        </Sphere>
    );
};

const GlowRing = () => {
    const ringRef = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z += 0.02;
            ringRef.current.rotation.x += 0.01;
        }
    });

    return (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.8, 0.05, 16, 100]} />
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} toneMapped={false} />
        </mesh>
    );
};

export default function AIAvatar({ size = 120 }: { size?: number }) {
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={1.5} /> {/* Much brighter ambient light */}
                    <directionalLight position={[2, 5, 5]} intensity={2} color="#ffffff" />
                    <pointLight position={[-5, -5, -5]} intensity={5} color="#3b82f6" />

                    <AnimatedSphere />
                    <GlowRing />

                    {/* Add particles for "AI Intelligence" vibe */}
                    <Sparkles count={50} scale={6} size={4} speed={0.4} opacity={0.5} color="#60a5fa" />

                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
                </Suspense>
            </Canvas>

            {/* Holographic Scanlines overlay - brighter */}
            <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-50 animate-scan" style={{ backgroundSize: '100% 3px' }} />
        </div>
    );
}
