import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/**
 * Geometric shape with Glassmorphism material
 */
function FloatingShape({ position, rotation, scale, color, speed, geometryType = 'dodecahedron' }) {
    const mesh = useRef();
    const { theme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Material configuration for that "premium glass" look
    const materialProps = {
        transmission: 0.95, // Glass-like transmission
        thickness: 0.2,     // Refraction thickness
        roughness: 0.1,     // Glossy
        metalness: 0.1,     // Slight metal look
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        color: new THREE.Color(color).convertSRGBToLinear(),
        attenuationDistance: 0.5,
        attenuationColor: new THREE.Color(isDark ? '#ffffff' : '#000000').convertSRGBToLinear(),
    };

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Subtle extra rotation on top of Float
        mesh.current.rotation.x = rotation[0] + Math.cos(t / 4 * speed) / 8;
        mesh.current.rotation.y = rotation[1] + Math.sin(t / 4 * speed) / 8;
        mesh.current.rotation.z = rotation[2] + Math.sin(t / 4 * speed) / 8;
    });

    let Geometry;
    switch (geometryType) {
        case 'sphere': Geometry = THREE.SphereGeometry; break;
        case 'box': Geometry = THREE.BoxGeometry; break;
        case 'torus': Geometry = THREE.TorusGeometry; break;
        case 'icosahedron': Geometry = THREE.IcosahedronGeometry; break;
        default: Geometry = THREE.DodecahedronGeometry;
    }

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={2} floatingRange={[-0.2, 0.2]}>
            <mesh ref={mesh} position={position} scale={scale} castShadow receiveShadow>
                {geometryType === 'torus' ? (
                    <torusGeometry args={[0.7, 0.2, 16, 32]} />
                ) : geometryType === 'box' ? (
                    <roundedBoxGeometry args={[1, 1, 1, 4, 0.1]} /> // Requires drei's RoundedBox but we'll stick to simple primitives for speed
                ) : (
                    <dodecahedronGeometry args={[1, 0]} />
                )}
                <meshPhysicalMaterial {...materialProps} />
            </mesh>
        </Float>
    );
}

/**
 * Interactive Camera Rig
 * Moves the camera slightly based on mouse position for parallax effect
 */
function Rig() {
    const { camera, mouse } = useThree();
    const vec = new THREE.Vector3();

    useFrame(() => {
        camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 1, camera.position.z), 0.05);
        camera.lookAt(0, 0, 0);
    });
}

export default function ThreeHero() {
    const { theme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Responsive scaling factor
    const responsiveScale = window.innerWidth < 768 ? 0.6 : 1;

    return (
        <div className="w-full h-full relative cursor-move">
            <Canvas
                shadows
                dpr={[1, 2]} // Optimization for high DPI screens
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                className="rounded-3xl"
            >
                {/* Lighting Environment */}
                <ambientLight intensity={isDark ? 0.4 : 0.8} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.5 : 1} color={isDark ? "#4f46e5" : "#60a5fa"} />

                {/* Environment Reflection Map */}
                <Environment preset={isDark ? "city" : "studio"} blur={0.8} />

                {/* Floating Objects Group */}
                <group scale={responsiveScale}>
                    {/* Center Hero Object - Blue/Primary */}
                    <FloatingShape
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        scale={1.5}
                        color="#3b82f6"
                        speed={1.5}
                        geometryType="icosahedron"
                    />

                    {/* Surrounding Objects - Various colors/shapes */}
                    <FloatingShape position={[-3, 2, -2]} rotation={[1, 2, 0]} scale={0.8} color="#8b5cf6" speed={2} geometryType="torus" />
                    <FloatingShape position={[3.5, -1, -3]} rotation={[2, 1, 0]} scale={0.9} color="#10b981" speed={1.2} geometryType="dodecahedron" />

                    {/* Background Distant Objects for Depth */}
                    <FloatingShape position={[-2, -3, -5]} rotation={[0, 1, 0]} scale={0.5} color="#6366f1" speed={0.8} geometryType="icosahedron" />
                    <FloatingShape position={[4, 3, -6]} rotation={[1, 0, 0]} scale={0.6} color="#f59e0b" speed={1} geometryType="dodecahedron" />
                </group>

                {/* Interactive Rig */}
                <Rig />

                {/* Soft Shadows for grounding */}
                <ContactShadows
                    position={[0, -3.5, 0]}
                    opacity={0.6}
                    scale={20}
                    blur={2}
                    far={4.5}
                    color={isDark ? "#000000" : "#d1d5db"}
                />
            </Canvas>
        </div>
    );
}
