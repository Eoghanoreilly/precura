"use client";

/**
 * Hero3D (home-11) - Minimal-ambient topographic scene.
 *
 * Inherits the terrain-from-glucose concept from home-6 but dials every
 * parameter down. This 3D lives in the BACKGROUND of the hero, behind
 * a cream/paper foreground, and should feel like weather behind a window.
 *
 * Changes vs home-6:
 *  - Muted sage + stone palette (no amber/terracotta)
 *  - Reduced emissive intensity on the terrain ridge
 *  - Particle count 1200 (was 2800)
 *  - Camera orbit at half speed
 *  - Mouse parallax sensitivity reduced
 *  - Atmospheric fog brought closer (fades edges fast)
 *  - Cream background gradient instead of near-black
 *  - dpr clamped to [1, 1.75] to stay featherweight
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Anna's real 5-year fasting glucose trajectory.
const GLUCOSE_SERIES = [5.0, 5.1, 5.2, 5.4, 5.5, 5.8];

// ---------------------------------------------------------------------------
// Terrain mesh.
// ---------------------------------------------------------------------------
function GlucoseTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const { geometry } = useMemo(() => {
    const segments = 88;
    const geom = new THREE.PlaneGeometry(4, 2.4, segments, segments);
    const pos = geom.attributes.position;

    const min = Math.min(...GLUCOSE_SERIES);
    const max = Math.max(...GLUCOSE_SERIES);
    const norm = GLUCOSE_SERIES.map((v) => (v - min) / (max - min));

    const sampleTrajectory = (tx: number) => {
      const u = (tx + 1) * 0.5;
      const f = u * (norm.length - 1);
      const i = Math.floor(f);
      const j = Math.min(i + 1, norm.length - 1);
      const t = f - i;
      return norm[i] * (1 - t) + norm[j] * t;
    };

    const hash = (x: number, y: number) => {
      const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const valueNoise = (x: number, y: number) => {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const xf = x - xi;
      const yf = y - yi;
      const a = hash(xi, yi);
      const b = hash(xi + 1, yi);
      const c = hash(xi, yi + 1);
      const d = hash(xi + 1, yi + 1);
      const u = smooth(xf);
      const v = smooth(yf);
      return (
        a * (1 - u) * (1 - v) +
        b * u * (1 - v) +
        c * (1 - u) * v +
        d * u * v
      );
    };

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const traj = sampleTrajectory(x / 2);

      // Softer ridge
      const ridge = Math.exp(-(y * y) / 0.55) * traj * 0.7;

      // Gentler noise
      const n1 = valueNoise(x * 1.1 + 3, y * 1.1 + 7) * 0.14;
      const n2 = valueNoise(x * 2.2 + 9, y * 2.2 + 1) * 0.07;

      const slope = (x / 2) * 0.18 + 0.1;
      pos.setZ(i, ridge + n1 + n2 + slope);
    }
    geom.computeVertexNormals();
    return { geometry: geom };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      // Half-speed breathing rotation
      meshRef.current.rotation.z = Math.sin(t * 0.04) * 0.04;
      meshRef.current.position.y = Math.sin(t * 0.12) * 0.01 - 0.38;
    }
    if (materialRef.current) {
      // Barely perceptible emissive pulse
      const pulse = 0.1 + Math.sin(t * 0.3) * 0.02;
      materialRef.current.emissiveIntensity = pulse;
    }
  });

  return (
    <group rotation={[-Math.PI / 2.4, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          ref={materialRef}
          color={"#A8B59C"}
          emissive={"#3F5C46"}
          emissiveIntensity={0.1}
          roughness={0.85}
          metalness={0.05}
          wireframe={false}
          flatShading={false}
        />
      </mesh>
      {/* Very faint wireframe overlay for the topography read */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={"#5F7065"}
          wireframe
          transparent
          opacity={0.14}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Particle field. 1200 soft points. Slower, dimmer.
// ---------------------------------------------------------------------------
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, phases, radii } = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const radii = new Float32Array(count);
    const rand = (seed: number) => {
      const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < count; i++) {
      const theta = rand(i + 1) * Math.PI * 2;
      const r = 1.9 + rand(i + 101) * 2.3;
      const y = (rand(i + 203) - 0.5) * 2.4;
      positions[i * 3 + 0] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;
      phases[i] = rand(i + 307) * Math.PI * 2;
      radii[i] = r;
    }
    return { positions, phases, radii };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry as THREE.BufferGeometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const r = radii[i];
      // Half orbit speed
      const theta = t * 0.018 + phase;
      arr[i * 3 + 0] = Math.cos(theta) * r;
      arr[i * 3 + 2] = Math.sin(theta) * r;
      arr[i * 3 + 1] += Math.sin(t * 0.2 + phase) * 0.0003;
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.014}
        color={"#7C8F7F"}
        transparent
        opacity={0.38}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Camera rig. Half orbit, quarter parallax.
// ---------------------------------------------------------------------------
function CameraRig() {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Reduced sensitivity
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const camera = state.camera;
    const orbitX = Math.sin(t * 0.04) * 0.22 + target.current.x;
    const orbitY = 1.5 + Math.sin(t * 0.06) * 0.06 + target.current.y;
    camera.position.x += (orbitX - camera.position.x) * 0.02;
    camera.position.y += (orbitY - camera.position.y) * 0.02;
    camera.position.z = 3.9;
    camera.lookAt(0, -0.3, 0);
  });

  return null;
}

// ---------------------------------------------------------------------------
// Main Hero3D component.
// ---------------------------------------------------------------------------
export default function Hero3D() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsMobile(
        window.innerWidth < 768 ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mobile fallback: a calm cream gradient hinting at the terrain shape
  if (isMobile) {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 55% at 58% 58%, #DDE3D4 0%, #EFECDF 40%, #F7F5EF 75%, #FAFAF7 100%)",
          filter: "blur(0.5px)",
        }}
      />
    );
  }

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 44, position: [0, 1.5, 3.9], near: 0.1, far: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 100% 70% at 52% 58%, #EDEBDF 0%, #F4F2EA 55%, #FAFAF7 100%)",
      }}
    >
      {/* Quiet, diffuse lighting - no hotspots */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[2.5, 3.5, 2]}
        intensity={0.9}
        color={"#FFFBF0"}
      />
      <directionalLight
        position={[-3, 2, -1]}
        intensity={0.35}
        color={"#C5D3C0"}
      />
      <hemisphereLight args={["#F7F5EF", "#A8B59C", 0.4]} />

      <GlucoseTerrain />
      <ParticleField />
      <CameraRig />

      {/* Fog brought very close so the scene dissolves at the edges */}
      <fog attach="fog" args={["#F4F2EA", 2.4, 8]} />
    </Canvas>
  );
}
