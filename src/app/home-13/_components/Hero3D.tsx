"use client";

/**
 * Hero3D (home-13) - "Reveal Terrain".
 *
 * This is a modified copy of home-6's Hero3D. Key changes for home-13:
 *
 *  1. Mount-on-demand: only starts rendering when the parent container
 *     becomes visible (driven by IntersectionObserver on the outer wrapper).
 *  2. Entrance animation: the camera pulls back from a tight close-up
 *     (z = 1.5) to the final resting position (z = 3.8) over 1.2 seconds.
 *  3. Build-in effect: during the intro, the terrain vertices expand from
 *     a flat plane (z=0) to their final z values, so the landscape "forms"
 *     from below. Particle field also fades in.
 *  4. Palette is calmed down compared to home-6: less saturated amber,
 *     more ivory, softer fog, gentler emissive.
 *  5. Mobile fallback: a soft warm gradient preview, same pattern as home-6.
 *
 * All rendering still happens client-side only via dynamic import.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Anna's real 5-year fasting glucose series drives the terrain shape.
const GLUCOSE_SERIES = [5.0, 5.1, 5.2, 5.4, 5.5, 5.8];

// Duration of the build-in animation in seconds.
const INTRO_DURATION = 1.4;

// ---------------------------------------------------------------------------
// Terrain mesh. Vertices interpolate from z=0 (flat) to their final shape
// during the intro window, controlled by a shared clock offset.
// ---------------------------------------------------------------------------
function GlucoseTerrain({ startTime }: { startTime: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Pre-compute the target z values so we can interpolate each frame
  // without re-running the noise math.
  const { geometry, targetZ } = useMemo(() => {
    const segments = 96;
    const geom = new THREE.PlaneGeometry(4, 2.4, segments, segments);
    const pos = geom.attributes.position;
    const targetZ = new Float32Array(pos.count);

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

      const traj = sampleTrajectory(x / 2);
      const ridge = Math.exp(-(y * y) / 0.45) * traj * 0.9;
      const n1 = valueNoise(x * 1.2 + 3, y * 1.2 + 7) * 0.18;
      const n2 = valueNoise(x * 2.4 + 9, y * 2.4 + 1) * 0.09;
      const slope = (x / 2) * 0.22 + 0.12;

      const z = ridge + n1 + n2 + slope;
      targetZ[i] = z;
      // Start flat. Intro animation will lerp to target.
      pos.setZ(i, 0);
    }
    geom.computeVertexNormals();
    return { geometry: geom, targetZ };
  }, []);

  // Animation state: how much of the intro has played.
  const introProgress = useRef(0);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime - startTime;
    const t = state.clock.elapsedTime;

    // Intro: lerp vertices from 0 to target over INTRO_DURATION
    if (introProgress.current < 1) {
      const raw = Math.min(1, elapsed / INTRO_DURATION);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - raw, 3);
      introProgress.current = raw;

      if (meshRef.current) {
        const geom = meshRef.current.geometry as THREE.BufferGeometry;
        const pos = geom.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < targetZ.length; i++) {
          pos.setZ(i, targetZ[i] * eased);
        }
        pos.needsUpdate = true;
        geom.computeVertexNormals();
      }
    }

    if (meshRef.current) {
      // Slow breathing rotation, starts only after intro completes
      const breatheMix = Math.min(
        1,
        Math.max(0, (elapsed - INTRO_DURATION) / 0.6)
      );
      meshRef.current.rotation.z =
        Math.sin(t * 0.08) * 0.05 * breatheMix;
      meshRef.current.position.y =
        Math.sin(t * 0.25) * 0.015 - 0.35;
    }
    if (materialRef.current) {
      const pulse = 0.18 + Math.sin(t * 0.6) * 0.03;
      materialRef.current.emissiveIntensity = pulse * introProgress.current;
    }
  });

  return (
    <group rotation={[-Math.PI / 2.4, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          ref={materialRef}
          color={"#B76B3B"}
          emissive={"#6B3212"}
          emissiveIntensity={0}
          roughness={0.7}
          metalness={0.18}
          wireframe={false}
          flatShading={false}
        />
      </mesh>
      {/* Overlayed wireframe for the topology look, softer than home-6 */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={"#F5EFE2"}
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Particle field. Fades in during intro. Slower, calmer motion than home-6.
// ---------------------------------------------------------------------------
function ParticleField({ startTime }: { startTime: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const { positions, phases, radii } = useMemo(() => {
    const count = 2200;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const radii = new Float32Array(count);
    const rand = (seed: number) => {
      const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < count; i++) {
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
    const elapsed = t - startTime;
    if (!pointsRef.current || !materialRef.current) return;

    // Particles fade in during first 1.6s
    const fadeIn = Math.min(1, Math.max(0, elapsed / 1.6));
    materialRef.current.opacity = fadeIn * 0.65;

    const geom = pointsRef.current.geometry as THREE.BufferGeometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const r = radii[i];
      const theta = t * 0.03 + phase;
      arr[i * 3 + 0] = Math.cos(theta) * r;
      arr[i * 3 + 2] = Math.sin(theta) * r;
      arr[i * 3 + 1] += Math.sin(t * 0.4 + phase) * 0.0005;
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.015;
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
        ref={materialRef}
        size={0.016}
        color={"#D59668"}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Camera rig. Handles the dramatic intro pull-back and gentle orbit after.
// The intro starts from a tight close-up (z=1.5), pulls back to z=3.8 in
// 1.2 seconds with cubic ease-out, then hands off to the gentle orbit.
// ---------------------------------------------------------------------------
function CameraRig({ startTime }: { startTime: number }) {
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
    const elapsed = t - startTime;
    const camera = state.camera;

    // Intro pull-back: z goes from 1.5 to 3.8 over 1.2s, cubic ease-out
    const raw = Math.min(1, Math.max(0, elapsed / 1.2));
    const eased = 1 - Math.pow(1 - raw, 3);
    const zIntro = 1.5 + (3.8 - 1.5) * eased;

    // Orbit influence ramps up after intro finishes
    const orbitMix = Math.min(1, Math.max(0, (elapsed - 1.2) / 0.8));
    const orbitX =
      (Math.sin(t * 0.08) * 0.4 + target.current.x) * orbitMix;
    const orbitY =
      1.6 + (Math.sin(t * 0.12) * 0.12 + target.current.y) * orbitMix;

    // Smooth target follow
    camera.position.x += (orbitX - camera.position.x) * 0.04;
    camera.position.y += (orbitY - camera.position.y) * 0.04;
    camera.position.z = zIntro;
    camera.lookAt(0, -0.3, 0);
  });

  return null;
}

// ---------------------------------------------------------------------------
// Inner scene. startTime is captured the first time the scene is mounted
// so the intro animation always runs exactly once after mount.
// ---------------------------------------------------------------------------
function Scene() {
  const startTime = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useFrame((state) => {
    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime;
      setReady(true);
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.6}
        color={"#FFD9A8"}
      />
      <directionalLight
        position={[-3, 2, -1]}
        intensity={0.5}
        color={"#8FA8B6"}
      />
      <pointLight position={[0, 1, 2]} intensity={0.35} color={"#FFB070"} />

      {ready && startTime.current !== null && (
        <>
          <GlucoseTerrain startTime={startTime.current} />
          <ParticleField startTime={startTime.current} />
          <CameraRig startTime={startTime.current} />
        </>
      )}

      <fog attach="fog" args={["#0E0A07", 4, 11]} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Hero3D export. Accepts an `active` prop so it only mounts the Canvas
// once the parent says the reveal zone is actually visible.
// ---------------------------------------------------------------------------
export default function Hero3D({ active }: { active: boolean }) {
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

  // Mobile fallback: soft warm gradient, no Canvas
  if (isMobile) {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 58% 52%, #B76B3B 0%, #6B3212 32%, #1A140E 68%, #0E0A07 100%)",
          filter: "blur(0.4px)",
        }}
      />
    );
  }

  // Before the reveal zone is visible, show a dark placeholder so the
  // layout doesn't jump when the Canvas mounts.
  if (!active) {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 100% 70% at 50% 55%, #1A140E 0%, #0E0A07 60%, #070503 100%)",
        }}
      />
    );
  }

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 1.6, 1.5], near: 0.1, far: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 100% 70% at 50% 55%, #1A140E 0%, #0E0A07 60%, #070503 100%)",
      }}
    >
      <Scene />
    </Canvas>
  );
}
