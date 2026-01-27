// 3D Hero Component - Analytics Dashboard Theme
import React, { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/**
 * A single bar in the 3D Bar Chart
 */
function ChartBar({ position, height, color, index, isDark }) {
    const mesh = useRef();
    const targetHeight = useRef(height);
    const [currentHeight, setCurrentHeight] = useState(0);

    useFrame((state, delta) => {
        // Animate height growth on mount
        if (mesh.current) {
            // Simple lerp for growth animation
            if (currentHeight < targetHeight.current) {
                const newHeight = THREE.MathUtils.lerp(currentHeight, targetHeight.current, delta * 3);
                setCurrentHeight(newHeight);
                mesh.current.scale.y = newHeight;
                // Adjust position y so it grows from bottom
                mesh.current.position.y = position[1] + newHeight / 2;
            }
        }
    });

    const materialProps = {
        color: new THREE.Color(color).convertSRGBToLinear(),
        roughness: 0.2,
        metalness: 0.6,
        clearcoat: 0.5,
    };

    return (
        <mesh ref={mesh} position={[position[0], position[1], position[2]]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 1, 0.5]} />
            <meshStandardMaterial {...materialProps} />
        </mesh>
    );
}

/**
 * 3D Bar Chart Widget
 */
function BarChartWidget({ position, rotation, isDark }) {
    // Data representation: height and color
    const data = [
        { h: 2, c: '#3b82f6' }, // Blue
        { h: 3.5, c: '#8b5cf6' }, // Purple
        { h: 1.5, c: '#10b981' }, // Green
        { h: 4, c: '#f59e0b' }, // Amber
        { h: 2.8, c: '#ef4444' }, // Red
    ];

    return (
        <group position={position} rotation={rotation}>
            {/* Base "Glass" Card */}
            <RoundedBox args={[4.5, 0.2, 3]} radius={0.1} smoothness={4} position={[0, -0.1, 0]} receiveShadow>
                <meshPhysicalMaterial
                    transmission={0.6}
                    thickness={1}
                    roughness={0.2}
                    color={isDark ? '#1e293b' : '#ffffff'}
                    transparent
                    opacity={0.8}
                />
            </RoundedBox>

            {/* Bars */}
            {data.map((item, i) => (
                <ChartBar
                    key={i}
                    position={[-1.6 + (i * 0.8), 0, 0]}
                    height={item.h}
                    color={item.c}
                    index={i}
                    isDark={isDark}
                />
            ))}
        </group>
    );
}

/**
 * Floating Donut / Pie Chart abstraction
 */
function DonutStat({ position, rotation, color, isDark }) {
    const mesh = useRef();

    useFrame((state) => {
        mesh.current.rotation.x += 0.01;
        mesh.current.rotation.y += 0.01;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group position={position} rotation={rotation}>
                <mesh ref={mesh} castShadow>
                    <torusGeometry args={[0.8, 0.25, 16, 32]} />
                    <meshStandardMaterial
                        color={new THREE.Color(color).convertSRGBToLinear()}
                        roughness={0.1}
                        metalness={0.5}
                        emissive={new THREE.Color(color)}
                        emissiveIntensity={0.2}
                    />
                </mesh>
            </group>
        </Float>
    );
}

function Rig() {
    const { camera, mouse } = useThree();
    const vec = new THREE.Vector3();
    useFrame(() => {
        camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 1, camera.position.z), 0.05);
        camera.lookAt(0, 0, 0);
    });
}

function Loader() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="gray" wireframe />
        </mesh>
    );
}

export default function ThreeHero() {
    console.log("ThreeHero Analytics Redesign rendering...");
    const { theme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const responsiveScale = window.innerWidth < 768 ? 0.65 : 1.1;

    return (
        <div className="w-full h-full relative cursor-move">
            <Canvas
                shadows
                dpr={[1, 1.5]} // Cap pixel ratio for performance
                performance={{ min: 0.5 }} // Allow degrading quality on slow devices
                camera={{ position: [0, 2, 7], fov: 40 }}
                gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                className="rounded-3xl"
            >
                <Suspense fallback={<Loader />}>
                    {/* Dynamic Lighting - Boosted for "No Environment" setup */}
                    <ambientLight intensity={isDark ? 1.5 : 2.0} />
                    <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize={[512, 512]} />
                    <pointLight position={[-5, 5, -5]} intensity={2} color={isDark ? "#4f46e5" : "#60a5fa"} />

                    {/* Environment removed to fix slow loading (blocks rendering until downloaded) */}
                    {/* <Environment preset={isDark ? "city" : "studio"} blur={0.6} /> */}

                    <group scale={responsiveScale}>
                        {/* Main Bar Chart Widget */}
                        <Float rotationIntensity={0.2} floatIntensity={0.5} speed={1.5}>
                            <BarChartWidget position={[0, -1, 0]} rotation={[0.3, -0.3, 0]} isDark={isDark} />
                        </Float>

                        {/* Floating "Stats" Donuts */}
                        <DonutStat position={[-3, 1, -1]} rotation={[0, 0, 0]} color="#10b981" />
                        <DonutStat position={[3, 2, -2]} rotation={[1, 0, 0]} color="#8b5cf6" />

                        {/* Background Floating Elements for Depth */}
                        <Float speed={1} rotationIntensity={1} floatIntensity={1}>
                            <mesh position={[2.5, -2, -3]} receiveShadow>
                                <sphereGeometry args={[0.4, 32, 32]} />
                                <meshStandardMaterial color="#3b82f6" roughness={0.4} />
                            </mesh>
                        </Float>
                    </group>

                    <Rig />

                    <ContactShadows
                        position={[0, -3, 0]}
                        opacity={0.4}
                        scale={15}
                        blur={2.5}
                        far={5}
                        resolution={512} // Reduced from default (likely 1024) for speed
                        color={isDark ? "#000000" : "#9ca3af"}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
