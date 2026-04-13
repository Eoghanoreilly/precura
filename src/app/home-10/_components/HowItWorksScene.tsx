"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * The 3D scene for How It Works. Three floating objects:
 *  - A vial (cylinder) - the blood test
 *  - A cube - the risk model processor
 *  - A rounded card - the profile
 * Gentle orbit + float, user can drag to rotate camera.
 */

function Vial() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.elapsedTime * 0.3;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={group} position={[-2.6, 0.6, 0]}>
        {/* Glass tube */}
        <mesh>
          <cylinderGeometry args={[0.35, 0.35, 1.6, 32]} />
          <meshPhysicalMaterial
            color="#FAF6EC"
            transparent
            opacity={0.22}
            roughness={0.04}
            transmission={0.8}
            thickness={0.4}
            ior={1.4}
          />
        </mesh>
        {/* Blood inside */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.8, 32]} />
          <meshStandardMaterial
            color="#B04020"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        {/* Cap */}
        <mesh position={[0, 0.88, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.24, 32]} />
          <meshStandardMaterial color="#0C0E0B" roughness={0.5} />
        </mesh>
        {/* Label ring */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.5, 32]} />
          <meshStandardMaterial
            color="#F5EFE4"
            roughness={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Processor() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.3;
      group.current.rotation.x = Math.cos(clock.elapsedTime * 0.4) * 0.15;
    }
  });
  return (
    <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={group} position={[0, 0, 0]}>
        <RoundedBox args={[1.6, 1.6, 1.6]} radius={0.18} smoothness={4}>
          <meshPhysicalMaterial
            color="#E06B2D"
            roughness={0.35}
            metalness={0.2}
            clearcoat={0.4}
          />
        </RoundedBox>
        {/* Inner glow cube */}
        <mesh>
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshStandardMaterial
            color="#FAF6EC"
            emissive="#E06B2D"
            emissiveIntensity={0.4}
            transparent
            opacity={0.12}
          />
        </mesh>
      </group>
    </Float>
  );
}

function ProfileCard() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = -clock.elapsedTime * 0.25;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group} position={[2.6, -0.4, 0]}>
        <RoundedBox args={[1.5, 2.1, 0.12]} radius={0.1} smoothness={4}>
          <meshPhysicalMaterial
            color="#FAF6EC"
            roughness={0.45}
            clearcoat={0.3}
          />
        </RoundedBox>
        {/* Text bars on card (represent data lines) */}
        <mesh position={[0, 0.7, 0.065]}>
          <boxGeometry args={[1.0, 0.08, 0.01]} />
          <meshStandardMaterial color="#0C0E0B" />
        </mesh>
        <mesh position={[-0.2, 0.5, 0.065]}>
          <boxGeometry args={[0.6, 0.05, 0.01]} />
          <meshStandardMaterial color="#4A4F43" />
        </mesh>
        <mesh position={[0, 0.2, 0.065]}>
          <boxGeometry args={[1.1, 0.12, 0.01]} />
          <meshStandardMaterial color="#E06B2D" />
        </mesh>
        <mesh position={[0, 0, 0.065]}>
          <boxGeometry args={[0.85, 0.05, 0.01]} />
          <meshStandardMaterial color="#6B8F71" />
        </mesh>
        <mesh position={[0, -0.2, 0.065]}>
          <boxGeometry args={[1.1, 0.05, 0.01]} />
          <meshStandardMaterial color="#6B8F71" />
        </mesh>
        <mesh position={[-0.15, -0.55, 0.065]}>
          <boxGeometry args={[0.7, 0.14, 0.01]} />
          <meshStandardMaterial color="#0C0E0B" />
        </mesh>
      </group>
    </Float>
  );
}

function FlowLine() {
  return (
    <group position={[0, 0, -0.1]}>
      {/* Thin dashed lines connecting the three objects */}
      {[-2.1, -1.8, -1.5, 1.5, 1.8, 2.1].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#4A4F43" />
        </mesh>
      ))}
    </group>
  );
}

export default function HowItWorksScene() {
  return (
    <Canvas
      camera={{ position: [0, 1, 6], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[4, 5, 4]}
        intensity={1.1}
        castShadow
      />
      <directionalLight position={[-4, -2, 2]} intensity={0.35} color="#E06B2D" />

      <Vial />
      <Processor />
      <ProfileCard />
      <FlowLine />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.6}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
