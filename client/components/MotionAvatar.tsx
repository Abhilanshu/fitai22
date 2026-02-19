'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box, Html } from '@react-three/drei';
import { useRef, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';

// --- ROBOT PARTS ---

const RobotHead = ({ rotation }: { rotation: [number, number, number] }) => (
    <group position={[0, 1.2, 0]} rotation={rotation}>
        {/* Head Shape */}
        <Sphere args={[0.35, 32, 32]} scale={[1, 0.8, 1]}>
            <meshStandardMaterial color="white" roughness={0.3} />
        </Sphere>
        {/* Visor / Face */}
        <Box args={[0.5, 0.25, 0.2]} position={[0, 0, 0.25]}>
            <meshStandardMaterial color="#000" roughness={0.2} metalness={0.8} />
        </Box>
        {/* Eyes (Glowing) */}
        <Sphere args={[0.04]} position={[-0.12, 0, 0.36]}>
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
        </Sphere>
        <Sphere args={[0.04]} position={[0.12, 0, 0.36]}>
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
        </Sphere>
        {/* Antenna */}
        <Cylinder args={[0.02, 0.02, 0.3]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#94a3b8" />
        </Cylinder>
        <Sphere args={[0.05]} position={[0, 0.55, 0]}>
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
        </Sphere>
    </group>
);

const RobotBody = () => (
    <group position={[0, 0.6, 0]}>
        {/* Torso */}
        <Cylinder args={[0.25, 0.3, 0.7]} position={[0, 0, 0]}>
            <meshStandardMaterial color="white" roughness={0.3} />
        </Cylinder>
        {/* Chest Plate */}
        <Box args={[0.3, 0.2, 0.1]} position={[0, 0.1, 0.26]}>
            <meshStandardMaterial color="#94a3b8" metalness={0.5} />
        </Box>
        <Sphere args={[0.06]} position={[0, 0.1, 0.32]}>
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
        </Sphere>
    </group>
);

const RobotLimb = ({ position, rotation, args }: { position: any, rotation: any, args: any }) => (
    <group position={position} rotation={rotation}>
        <Cylinder args={args || [0.08, 0.08, 0.4]}>
            <meshStandardMaterial color="white" />
        </Cylinder>
        <Sphere args={[0.1]} position={[0, -0.2, 0]}>
            <meshStandardMaterial color="#333" />
        </Sphere>
    </group>
);

// --- ANIMATION CONTROLLER ---

const CuteRobot = ({ exercise }: { exercise: string }) => {
    const groupRef = useRef<THREE.Group>(null!);
    const leftArmRef = useRef<THREE.Group>(null!);
    const rightArmRef = useRef<THREE.Group>(null!);
    const headRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const yBob = Math.sin(t * 2) * 0.05;

        // Base Floating Animation
        if (groupRef.current) {
            groupRef.current.position.y = -0.5 + yBob;
        }

        if (exercise === 'Idle' || !exercise) {
            // Waving Animation
            if (rightArmRef.current) {
                rightArmRef.current.rotation.z = Math.sin(t * 5) * 0.5 + 2.5; // Wave up high
                rightArmRef.current.rotation.x = Math.sin(t * 3) * 0.2;
            }
            if (leftArmRef.current) {
                leftArmRef.current.rotation.z = -0.5; // Relaxed
            }
            // Head tilt
            if (headRef.current) {
                headRef.current.rotation.z = Math.sin(t * 1) * 0.1;
                headRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
            }
        }
        else if (exercise === 'Squat') {
            const squatCycle = (Math.sin(t * 3) + 1) / 2; // 0 to 1
            if (groupRef.current) {
                groupRef.current.position.y = -0.5 - (squatCycle * 0.3); // Go down
            }
            // Arms out for balance
            if (leftArmRef.current) leftArmRef.current.rotation.z = -1.5;
            if (rightArmRef.current) rightArmRef.current.rotation.z = 1.5;
        }
        else if (exercise === 'Jumping Jacks') {
            const jumpCycle = Math.sin(t * 6);
            if (groupRef.current) {
                groupRef.current.position.y = -0.5 + Math.abs(jumpCycle) * 0.2; // Jump up
            }
            // Arms flap
            const armAngle = jumpCycle > 0 ? 2.8 : 0.5;
            if (leftArmRef.current) leftArmRef.current.rotation.z = -armAngle;
            if (rightArmRef.current) rightArmRef.current.rotation.z = armAngle;
        }
        else if (exercise === 'Pushup') {
            // Rotate robot to be horizontal
            if (groupRef.current) groupRef.current.rotation.x = -1.5;
            // Push movement
            const pushCycle = (Math.sin(t * 3) + 1) / 2;
            if (groupRef.current) groupRef.current.position.y = -0.8 + (pushCycle * 0.2);
        }
    });

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            <group ref={headRef}>
                <RobotHead rotation={[0, 0, 0]} />
            </group>

            <RobotBody />

            {/* Arms - Pivoted at shoulders */}
            <group position={[-0.3, 0.8, 0]} ref={leftArmRef}>
                <RobotLimb position={[0, -0.2, 0]} rotation={[0, 0, 0]} args={[0.08, 0.08, 0.4]} />
            </group>

            <group position={[0.3, 0.8, 0]} ref={rightArmRef}>
                <RobotLimb position={[0, -0.2, 0]} rotation={[0, 0, 0]} args={[0.08, 0.08, 0.4]} />
            </group>

            {/* Legs - Static for now or simple movement */}
            <group position={[-0.15, 0.3, 0]}>
                <RobotLimb position={[0, -0.25, 0]} rotation={[0, 0, 0.1]} args={[0.09, 0.07, 0.5]} />
            </group>
            <group position={[0.15, 0.3, 0]}>
                <RobotLimb position={[0, -0.25, 0]} rotation={[0, 0, -0.1]} args={[0.09, 0.07, 0.5]} />
            </group>

        </group>
    );
};

export default function MotionAvatar({ exercise }: { exercise: string }) {
    const [motivation, setMotivation] = useState("Hi! I'm Robo-Coach! 👋");

    useEffect(() => {
        if (!exercise) return;
        setMotivation(`${exercise}? Let's do it!`);

        const phrases = ["Keep going!", "You're doing great!", "Feel the burn!", "Don't stop!", "Awesome form!"];
        const interval = setInterval(() => {
            setMotivation(phrases[Math.floor(Math.random() * phrases.length)]);
        }, 6000);
        return () => clearInterval(interval);
    }, [exercise]);

    return (
        <div className="w-48 h-60 relative">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.8} />
                    <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-5, 5, 5]} intensity={0.5} color="#3b82f6" />

                    <CuteRobot exercise={exercise || 'Idle'} />

                </Suspense>
            </Canvas>

            {/* Speech Bubble */}
            <div className="absolute top-0 right-[-60px] bg-white text-black px-4 py-2 rounded-2xl rounded-bl-none shadow-xl text-xs font-bold animate-bounce md:right-[-80px] z-50">
                {motivation}
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                AI TRAINER
            </div>
        </div>
    );
}
