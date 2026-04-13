"use client";

/**
 * Hero3D (home-15) - Scientific instrument readout.
 *
 * A contained 3D topographic terrain that feels like a clinical data
 * instrument, not a cinematic landscape. Palette is cool and technical:
 * deep navy, slate, muted cyan, paper cream. Camera movement is minimal
 * and controlled. Overlay labels mark specific peaks as risk factors.
 *
 * The terrain is still derived from Anna's real 5-year fasting glucose
 * trajectory (5.0 -> 5.8 mmol/L), but the visual treatment is a
 * laboratory instrument readout, not a warm sunset scene.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Anna's 5-year fasting glucose trajectory from mock-patient.ts
const GLUCOSE_SERIES = [5.0, 5.1, 5.2, 5.4, 5.5, 5.8];

// Cool clinical palette - no warm amber
const PAL = {
  paper: "#F4F6F8",
  paperDeep: "#E4E9EE",
  slate: "#6C7A89",
  slateDeep: "#3A4654",
  ink: "#0B1520",
  navy: "#0E1A2A",
  navyDeep: "#060C18",
  cyan: "#66B2CC",
  cyanDeep: "#3E86A6",
  cyanSoft: "#B4D5E0",
} as const;

// ---------------------------------------------------------------------------
// Contained terrain mesh - a scientific readout, not a cinematic landscape.
// ---------------------------------------------------------------------------
function ClinicalTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  const { geometry } = useMemo(() => {
    const segments = 120;
    const geom = new THREE.PlaneGeometry(4.2, 2.6, segments, segments);
    const pos = geom.attributes.position;

    // Normalize glucose 0..1
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

      const traj = sampleTrajectory(x / 2.1);

      // Ridge follows trajectory, slightly broader than home-6
      const ridge = Math.exp(-(y * y) / 0.55) * traj * 1.05;

      // Subtle organic relief
      const n1 = valueNoise(x * 1.1 + 3, y * 1.1 + 7) * 0.14;
      const n2 = valueNoise(x * 2.6 + 9, y * 2.6 + 1) * 0.07;

      const slope = (x / 2.1) * 0.18 + 0.08;

      pos.setZ(i, ridge + n1 + n2 + slope);
    }
    geom.computeVertexNormals();
    return { geometry: geom };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      // Very subtle rotation - scientific instrument, not cinematic
      meshRef.current.rotation.z = Math.sin(t * 0.05) * 0.018;
      meshRef.current.position.y = -0.32 + Math.sin(t * 0.2) * 0.008;
    }
    if (wireRef.current) {
      wireRef.current.rotation.z = Math.sin(t * 0.05) * 0.018;
      wireRef.current.position.y = -0.32 + Math.sin(t * 0.2) * 0.008;
    }
  });

  return (
    <group rotation={[-Math.PI / 2.45, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={"#1A2A3C"}
          emissive={"#0E1A2A"}
          emissiveIntensity={0.18}
          roughness={0.72}
          metalness={0.32}
          flatShading={false}
        />
      </mesh>
      {/* Wireframe overlay - technical readout feel */}
      <mesh ref={wireRef} geometry={geometry}>
        <meshBasicMaterial
          color={PAL.cyan}
          wireframe
          transparent
          opacity={0.24}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Thin data grid: a ground plane of lines beneath the terrain so the whole
// scene reads like a plotted dataset.
// ---------------------------------------------------------------------------
function DataGrid() {
  const { gridGeometry } = useMemo(() => {
    const size = 5.4;
    const divisions = 18;
    const step = size / divisions;
    const half = size / 2;
    const vertices: number[] = [];
    for (let i = 0; i <= divisions; i++) {
      const p = -half + i * step;
      vertices.push(-half, 0, p, half, 0, p);
      vertices.push(p, 0, -half, p, 0, half);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    return { gridGeometry: geom };
  }, []);

  return (
    <lineSegments position={[0, -0.82, 0]} geometry={gridGeometry}>
      <lineBasicMaterial
        color={PAL.slate}
        transparent
        opacity={0.25}
      />
    </lineSegments>
  );
}

// ---------------------------------------------------------------------------
// Sparse data points - soft dots that mark sample points in the field.
// No particle swarm. Feels like sensor readings.
// ---------------------------------------------------------------------------
function DataPoints() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions } = useMemo(() => {
    const count = 420;
    const positions = new Float32Array(count * 3);
    const rand = (seed: number) => {
      const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < count; i++) {
      // Distribute within a bounded region, not a cylinder
      const x = (rand(i + 1) - 0.5) * 5.0;
      const z = (rand(i + 101) - 0.5) * 3.6;
      const y = (rand(i + 203) - 0.2) * 1.8 - 0.4;
      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return { positions };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.01;
    }
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
        size={0.013}
        color={PAL.cyanSoft}
        transparent
        opacity={0.58}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Controlled camera: very small parallax, fixed orbit. Technical feel.
// ---------------------------------------------------------------------------
function CameraRig() {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.25;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.14;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const camera = state.camera;
    // Very subtle drift - a lab instrument, not a film camera
    const orbitX = Math.sin(t * 0.06) * 0.14 + target.current.x;
    const orbitY = 1.42 + Math.sin(t * 0.08) * 0.05 + target.current.y;
    camera.position.x += (orbitX - camera.position.x) * 0.035;
    camera.position.y += (orbitY - camera.position.y) * 0.035;
    camera.position.z = 3.35;
    camera.lookAt(0, -0.2, 0);
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

  // Mobile fallback - static gradient in the clinical palette
  if (isMobile) {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 65% at 50% 55%, #162232 0%, #0E1A2A 32%, #060C18 72%, #03070E 100%)",
        }}
      />
    );
  }

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 42, position: [0, 1.4, 3.35], near: 0.1, far: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 95% 72% at 50% 52%, #142132 0%, #0B1626 48%, #050A13 92%, #03060C 100%)",
      }}
    >
      <ambientLight intensity={0.42} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.3}
        color={"#B4D5E0"}
      />
      <directionalLight
        position={[-3, 2, -1]}
        intensity={0.55}
        color={"#3E86A6"}
      />
      <pointLight position={[0, 1.2, 2.2]} intensity={0.35} color={"#66B2CC"} />

      <ClinicalTerrain />
      <DataGrid />
      <DataPoints />
      <CameraRig />

      {/* Cool fog to deepen edges */}
      <fog attach="fog" args={["#060C18", 3.8, 11]} />
    </Canvas>
  );
}
