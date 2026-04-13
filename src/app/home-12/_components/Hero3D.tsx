"use client";

/**
 * Hero3D for home-12 - "Split Classical".
 *
 * Differences from home-6:
 *  - Designed to live inside a CONTAINED rounded rectangle panel,
 *    not full-bleed. Canvas fills its parent.
 *  - Cooler, more refined palette: deep graphite base, soft sage ridge,
 *    muted slate blue accents. One restrained warm highlight for the
 *    current-value glow.
 *  - Gentler camera: a soft pan across the scene, tighter orbit radius,
 *    no heavy breathing motion.
 *  - Particle count reduced to ~1600 for a calmer field.
 *  - On mobile we fall back to a 2D static gradient preview so low-end
 *    devices are never asked to run WebGL.
 *
 * Terrain vertices are still derived from Anna's real 5-year fasting
 * glucose trajectory (5.0 -> 5.8 mmol/L), preserving the concept that
 * the 3D hill IS the data.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

const GLUCOSE_SERIES = [5.0, 5.1, 5.2, 5.4, 5.5, 5.8];

// Refined cool palette
const TERRAIN_BASE = "#4B5E52"; // sage slate
const TERRAIN_EMISSIVE = "#2B3A34"; // deeper sage shadow
const WIRE = "#B8C2BC"; // pale sage for wire overlay
const PARTICLE_COLOR = "#A8BFC9"; // slate blue dust
const WARM_HIGHLIGHT = "#C97A3D"; // single warm pulse for the latest point
const DIR_LIGHT_WARM = "#E9DCC4"; // soft cream keylight
const DIR_LIGHT_COOL = "#7B94A8"; // slate blue fill

function GlucoseTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const { geometry } = useMemo(() => {
    const segments = 88;
    const geom = new THREE.PlaneGeometry(3.4, 2.2, segments, segments);
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

      const traj = sampleTrajectory(x / 1.7);
      const ridge = Math.exp(-(y * y) / 0.5) * traj * 0.85;
      const n1 = valueNoise(x * 1.25 + 3, y * 1.25 + 7) * 0.14;
      const n2 = valueNoise(x * 2.5 + 9, y * 2.5 + 1) * 0.07;
      const slope = (x / 1.7) * 0.18 + 0.08;
      pos.setZ(i, ridge + n1 + n2 + slope);
    }
    geom.computeVertexNormals();
    return { geometry: geom };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      // Much gentler breathing, smaller amplitude
      meshRef.current.rotation.z = Math.sin(t * 0.05) * 0.025;
      meshRef.current.position.y = Math.sin(t * 0.18) * 0.008 - 0.3;
    }
    if (materialRef.current) {
      const pulse = 0.14 + Math.sin(t * 0.4) * 0.02;
      materialRef.current.emissiveIntensity = pulse;
    }
  });

  return (
    <group rotation={[-Math.PI / 2.35, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          ref={materialRef}
          color={TERRAIN_BASE}
          emissive={TERRAIN_EMISSIVE}
          emissiveIntensity={0.14}
          roughness={0.75}
          metalness={0.15}
          flatShading={false}
        />
      </mesh>
      {/* Fine wire overlay for the topology feel */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={WIRE}
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>
      {/* A small warm pulse at the right edge marks the "today" reading */}
      <mesh position={[1.55, -0.3, 0.62]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={WARM_HIGHLIGHT}
          emissive={WARM_HIGHLIGHT}
          emissiveIntensity={1.8}
        />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, phases, radii } = useMemo(() => {
    const count = 1600;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const radii = new Float32Array(count);
    const rand = (seed: number) => {
      const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < count; i++) {
      const theta = rand(i + 1) * Math.PI * 2;
      const r = 1.7 + rand(i + 101) * 1.9;
      const y = (rand(i + 203) - 0.5) * 2.3;
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
      const theta = t * 0.022 + phase;
      arr[i * 3 + 0] = Math.cos(theta) * r;
      arr[i * 3 + 2] = Math.sin(theta) * r;
      arr[i * 3 + 1] += Math.sin(t * 0.3 + phase) * 0.0004;
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.012;
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
        size={0.012}
        color={PARTICLE_COLOR}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig() {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Clamp the mouse influence to a small window around center
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.35;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.18;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const camera = state.camera;
    // Gentle pan, tighter radius
    const orbitX = Math.sin(t * 0.06) * 0.22 + target.current.x;
    const orbitY = 1.45 + Math.sin(t * 0.09) * 0.06 + target.current.y;
    camera.position.x += (orbitX - camera.position.x) * 0.035;
    camera.position.y += (orbitY - camera.position.y) * 0.035;
    camera.position.z = 3.4;
    camera.lookAt(0, -0.25, 0);
  });

  return null;
}

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

  // Mobile fallback: a cool-palette static preview
  if (isMobile) {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 70% at 65% 55%, #4B5E52 0%, #2B3A34 42%, #14181C 75%, #0D1014 100%)",
        }}
      />
    );
  }

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 42, position: [0, 1.45, 3.4], near: 0.1, far: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 110% 80% at 55% 60%, #1F2A26 0%, #14181C 55%, #0D1014 100%)",
      }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.3}
        color={DIR_LIGHT_WARM}
      />
      <directionalLight
        position={[-3, 2, -1]}
        intensity={0.75}
        color={DIR_LIGHT_COOL}
      />
      <pointLight position={[1.5, 0.8, 1.5]} intensity={0.5} color={WARM_HIGHLIGHT} />

      <GlucoseTerrain />
      <ParticleField />
      <CameraRig />

      <fog attach="fog" args={["#0D1014", 3.4, 10]} />
    </Canvas>
  );
}
