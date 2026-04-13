"use client";

/**
 * Hero3D (home-14) - Monochromatic glucose terrain,
 * rendered as a contained "cover feature" widget rather than a full-bleed
 * hero. Ink + paper palette only. Very slow camera drift.
 *
 * This version deliberately omits the orbiting particle field. The 3D is
 * a precious object on the page, not the star of the page.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Anna's real 5-year fasting glucose trajectory. Rising 5.0 -> 5.8.
const GLUCOSE_SERIES = [5.0, 5.1, 5.2, 5.4, 5.5, 5.8];

// Palette: ink + paper + faint rust ridge.
const INK = "#14120E";
const PAPER = "#F4EFE6";
const RIDGE = "#B24E1A";

function GlucoseTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  const { geometry } = useMemo(() => {
    const segments = 80;
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

    // Simple deterministic value noise.
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
      const ridge = Math.exp(-(y * y) / 0.5) * traj * 0.95;

      const n1 = valueNoise(x * 1.2 + 3, y * 1.2 + 7) * 0.16;
      const n2 = valueNoise(x * 2.4 + 9, y * 2.4 + 1) * 0.08;

      const slope = (x / 2) * 0.18 + 0.05;

      pos.setZ(i, ridge + n1 + n2 + slope);
    }
    geom.computeVertexNormals();
    return { geometry: geom };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      // Very slow breathing
      meshRef.current.rotation.z = Math.sin(t * 0.04) * 0.03;
    }
    if (wireRef.current) {
      wireRef.current.rotation.z = Math.sin(t * 0.04) * 0.03;
    }
  });

  return (
    <group rotation={[-Math.PI / 2.35, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={PAPER}
          emissive={RIDGE}
          emissiveIntensity={0.05}
          roughness={0.85}
          metalness={0.05}
          flatShading={false}
        />
      </mesh>
      {/* Wireframe overlay gives that topographic map feel */}
      <mesh ref={wireRef} geometry={geometry}>
        <meshBasicMaterial
          color={INK}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const camera = state.camera;
    // Very gentle drift, no mouse parallax
    const orbitX = Math.sin(t * 0.05) * 0.25;
    const orbitY = 1.9 + Math.sin(t * 0.08) * 0.08;
    camera.position.x += (orbitX - camera.position.x) * 0.02;
    camera.position.y += (orbitY - camera.position.y) * 0.02;
    camera.position.z = 4.2;
    camera.lookAt(0, -0.2, 0);
  });
  return null;
}

export default function Hero3D() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () =>
      setIsMobile(
        window.innerWidth < 640 ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted || isMobile) {
    // Static SVG fallback - contour lines evoking the same shape
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: PAPER,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 400 400"
          style={{ width: "88%", height: "88%" }}
          aria-hidden
        >
          <g fill="none" stroke={INK} strokeWidth="0.8" opacity="0.5">
            {Array.from({ length: 14 }).map((_, i) => {
              const y = 80 + i * 18;
              const amp = 10 + i * 3;
              const path = Array.from({ length: 40 }).map((_, j) => {
                const x = j * 10;
                const dy =
                  Math.sin((j + i) * 0.5) * amp * 0.25 +
                  Math.cos((j - i) * 0.3) * amp * 0.2;
                return `${j === 0 ? "M" : "L"} ${x} ${y + dy}`;
              }).join(" ");
              return <path key={i} d={path} />;
            })}
          </g>
          <path
            d="M 20 260 Q 80 240 140 220 T 260 170 T 380 130"
            fill="none"
            stroke={RIDGE}
            strokeWidth="2.5"
          />
        </svg>
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 42, position: [0, 1.9, 4.2], near: 0.1, far: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "default",
      }}
      style={{
        position: "absolute",
        inset: 0,
        background: PAPER,
      }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} color={"#FFFFFF"} />
      <directionalLight position={[-3, 2, -1]} intensity={0.4} color={"#E8DCC2"} />

      <GlucoseTerrain />
      <CameraRig />
    </Canvas>
  );
}
