"use client";

/**
 * Hero3D - Topographic glucose trajectory scene.
 *
 * Concept: A soft, warm 3D topographic landscape whose terrain height is
 * derived from Anna's real 5-year fasting glucose series. The trajectory
 * is visible as a glowing ridge line that rises from left to right. A
 * field of soft orbiting particles pulses around the terrain, and the
 * camera slowly orbits on a gentle breathing curve.
 *
 * Performance notes:
 * - Terrain mesh: 96 x 96 plane segments (~18k triangles) - cheap
 * - Particle field: 2800 points (single THREE.Points, additive blend)
 * - dpr clamped to [1, 2]
 * - frameloop = "always" but motion is slow, CPU-light
 * - Only renders client-side via dynamic import with ssr: false
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Anna's real 5-year fasting glucose trajectory from mock-patient.
// Rising from 5.0 -> 5.8 over 5 years. This drives the terrain shape.
const GLUCOSE_SERIES = [5.0, 5.1, 5.2, 5.4, 5.5, 5.8];

// ---------------------------------------------------------------------------
// Terrain mesh: derives vertex heights from the glucose trajectory.
// Left side of the plane = earliest reading, right side = latest. We bake
// a Gaussian-smoothed ridge that follows the series from x=-1 to x=1 and
// then modulate with low-frequency value noise for organic relief.
// ---------------------------------------------------------------------------
function GlucoseTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const { geometry } = useMemo(() => {
    const segments = 96;
    const geom = new THREE.PlaneGeometry(4, 2.4, segments, segments);
    const pos = geom.attributes.position;

    // Normalized glucose 0..1 across the series
    const min = Math.min(...GLUCOSE_SERIES);
    const max = Math.max(...GLUCOSE_SERIES);
    const norm = GLUCOSE_SERIES.map((v) => (v - min) / (max - min));

    // Linear interpolation into the glucose series along x (-1..1)
    const sampleTrajectory = (tx: number) => {
      const u = (tx + 1) * 0.5; // 0..1
      const f = u * (norm.length - 1);
      const i = Math.floor(f);
      const j = Math.min(i + 1, norm.length - 1);
      const t = f - i;
      return norm[i] * (1 - t) + norm[j] * t;
    };

    // Cheap value noise for organic relief
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

      // Trajectory value along x, scaled 0..1
      const traj = sampleTrajectory(x / 2);

      // Gaussian ridge centered around y=0 follows the trajectory height
      const ridge = Math.exp(-(y * y) / 0.45) * traj * 0.9;

      // Organic terrain relief
      const n1 = valueNoise(x * 1.2 + 3, y * 1.2 + 7) * 0.18;
      const n2 = valueNoise(x * 2.4 + 9, y * 2.4 + 1) * 0.09;

      // Base slope rising toward the right side (the future)
      const slope = (x / 2) * 0.22 + 0.12;

      pos.setZ(i, ridge + n1 + n2 + slope);
    }
    geom.computeVertexNormals();
    return { geometry: geom };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      // Slow breathing rotation
      meshRef.current.rotation.z = Math.sin(t * 0.08) * 0.05;
      meshRef.current.position.y = Math.sin(t * 0.25) * 0.015 - 0.35;
    }
    if (materialRef.current) {
      // Subtle emissive pulse for the ridge
      const pulse = 0.22 + Math.sin(t * 0.6) * 0.04;
      materialRef.current.emissiveIntensity = pulse;
    }
  });

  return (
    <group rotation={[-Math.PI / 2.4, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          ref={materialRef}
          color={"#C77A45"}
          emissive={"#8A3E1C"}
          emissiveIntensity={0.22}
          roughness={0.65}
          metalness={0.2}
          wireframe={false}
          flatShading={false}
        />
      </mesh>
      {/* Overlayed wireframe for that data-topology look */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={"#F5E6D0"}
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Particle field: 2800 soft points orbiting the terrain.
// Each particle has a deterministic random-looking phase so motion looks
// organic but is idempotent across renders (no Math.random in useMemo).
// ---------------------------------------------------------------------------
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, phases, radii } = useMemo(() => {
    const count = 2800;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const radii = new Float32Array(count);
    // Deterministic pseudo-random from index (stable across renders).
    const rand = (seed: number) => {
      const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < count; i++) {
      // Cylindrical distribution around the terrain
      const theta = rand(i + 1) * Math.PI * 2;
      const r = 1.8 + rand(i + 101) * 2.2;
      const y = (rand(i + 203) - 0.5) * 2.6;
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
      const theta = t * 0.035 + phase;
      arr[i * 3 + 0] = Math.cos(theta) * r;
      arr[i * 3 + 2] = Math.sin(theta) * r;
      // gentle vertical bob
      arr[i * 3 + 1] += Math.sin(t * 0.4 + phase) * 0.0006;
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.02;
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
        size={0.018}
        color={"#C77A45"}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Camera rig: slowly orbits around the scene with mouse parallax influence.
// ---------------------------------------------------------------------------
function CameraRig() {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const camera = state.camera;
    const orbitX = Math.sin(t * 0.08) * 0.4 + target.current.x;
    const orbitY = 1.6 + Math.sin(t * 0.12) * 0.12 + target.current.y;
    camera.position.x += (orbitX - camera.position.x) * 0.03;
    camera.position.y += (orbitY - camera.position.y) * 0.03;
    camera.position.z = 3.8;
    camera.lookAt(0, -0.3, 0);
  });

  return null;
}

// ---------------------------------------------------------------------------
// Main Hero3D component. Mounts Canvas only after client mount to avoid
// hydration mismatch and SSR failure (Three.js requires window/document).
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

  // Mobile fallback: soft static gradient that evokes the 3D scene
  // without shipping the whole render pipeline to low-end devices.
  if (isMobile) {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 60% 50%, #C77A45 0%, #8A3E1C 28%, #2A1810 65%, #0E0E10 100%)",
          filter: "blur(0.5px)",
        }}
      />
    );
  }

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 1.6, 3.8], near: 0.1, far: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 100% 70% at 50% 55%, #1A120C 0%, #0E0A08 60%, #070506 100%)",
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.8}
        color={"#FFD9A8"}
      />
      <directionalLight
        position={[-3, 2, -1]}
        intensity={0.6}
        color={"#7FA8C0"}
      />
      <pointLight position={[0, 1, 2]} intensity={0.4} color={"#FFB070"} />

      <GlucoseTerrain />
      <ParticleField />
      <CameraRig />

      {/* Warm fog fades edges and deepens the scene */}
      <fog attach="fog" args={["#0E0A08", 4, 12]} />
    </Canvas>
  );
}
