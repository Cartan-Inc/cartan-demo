"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { DistalFemur, ProximalTibia } from "./KneeGeometry";

/* ── colours ────────────────────────────────────────────── */
const BONE = "#e0d4c5";
const BONE_GLOW = "#f0ebe3";
const ACL_COLOR = "#4A8C7E";
const PCL_COLOR = "#3d7a6d";
const COLLATERAL_COLOR = "#A8CDD4";
const CAPSULE_COLOR = "#7aaab5";
const QUAD_COLOR = "#d4a054";

/* ── assembly stages ────────────────────────────────────── */
const STAGES = [
  { id: "scan", label: "Scanning imaging data…", duration: 2000 },
  { id: "bone", label: "Reconstructing bone geometry", duration: 2500 },
  { id: "ligaments", label: "Mapping cruciate & collateral ligaments", duration: 2500 },
  { id: "capsule", label: "Modeling articular capsule", duration: 2000 },
  { id: "muscle", label: "Calibrating extensor mechanism", duration: 2000 },
  { id: "complete", label: "Digital twin ready", duration: 0 },
];

/* ── Ligament tube helper ───────────────────────────────── */
function LigamentTube({
  start,
  end,
  color,
  visible,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  visible: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const mid: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2 + 0.06,
    ];
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    ]);
    return new THREE.TubeGeometry(curve, 16, 0.025, 8, false);
  }, [start, end]);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const target = visible ? 0.85 : 0;
    mat.opacity += (target - mat.opacity) * 0.08;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color={color} transparent opacity={0} roughness={0.3} metalness={0.15} />
    </mesh>
  );
}



/* ── Capsule shell ──────────────────────────────────────── */
function CapsuleShell({ visible }: { visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const target = visible ? 0.15 : 0;
    mat.opacity += (target - mat.opacity) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.0, 0]}>
      <sphereGeometry args={[0.48, 20, 16]} />
      <meshStandardMaterial
        color={CAPSULE_COLOR}
        transparent
        opacity={0}
        roughness={0.2}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ── Quad/extensor tendon ───────────────────────────────── */
function QuadTendon({ visible }: { visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.0, 0.2),
      new THREE.Vector3(0, 0.4, 0.25),
      new THREE.Vector3(0, -0.05, 0.28),
      new THREE.Vector3(0, -0.55, 0.18),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.04, 8, false);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const target = visible ? 0.7 : 0;
    mat.opacity += (target - mat.opacity) * 0.06;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color={QUAD_COLOR} transparent opacity={0} roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

/* ── Scan line effect ───────────────────────────────────── */
function ScanLine({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !active) {
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity *= 0.95;
      }
      return;
    }
    const y = Math.sin(state.clock.elapsedTime * 2) * 1.5;
    meshRef.current.position.y = y;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.4;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.5]}>
      <planeGeometry args={[1.4, 0.02]} />
      <meshBasicMaterial color={ACL_COLOR} transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── Main 3D scene ──────────────────────────────────────── */
function TwinScene({ stage }: { stage: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const showBone = stage >= 1;
  const showLigaments = stage >= 2;
  const showCapsule = stage >= 3;
  const showMuscle = stage >= 4;
  const scanning = stage === 0;

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.5;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 2]} intensity={0.7} />
      <directionalLight position={[-2, 3, -1]} intensity={0.25} color="#A8CDD4" />
      <pointLight position={[0, 0, 3]} intensity={0.25} color={ACL_COLOR} />

      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={groupRef} rotation={[0.15, 0, 0]}>
          {/* Scan line */}
          <ScanLine active={scanning} />

          {/* Distal Femur */}
          <group position={[0, 0.55, 0]}>
            <DistalFemur visible={showBone} />
          </group>

          {/* Proximal Tibia */}
          <group position={[0, -0.45, 0]}>
            <ProximalTibia visible={showBone} />
          </group>

          {/* Cruciate ligaments — positioned between condyles */}
          <LigamentTube start={[0.03, 0.0, 0.06]} end={[-0.03, -0.42, 0.04]} color={ACL_COLOR} visible={showLigaments} />
          <LigamentTube start={[-0.03, 0.0, -0.06]} end={[0.03, -0.44, -0.04]} color={PCL_COLOR} visible={showLigaments} />

          {/* Collateral ligaments — medial and lateral */}
          <LigamentTube start={[-0.22, 0.1, 0]} end={[-0.20, -0.52, 0]} color={COLLATERAL_COLOR} visible={showLigaments} />
          <LigamentTube start={[0.22, 0.1, 0]} end={[0.20, -0.52, 0]} color={COLLATERAL_COLOR} visible={showLigaments} />

          {/* Capsule — positioned around the joint */}
          <CapsuleShell visible={showCapsule} />

          {/* Extensor mechanism */}
          <QuadTendon visible={showMuscle} />
        </group>
      </Float>
    </>
  );
}

/* ── Data readout sidebar ───────────────────────────────── */
function DataReadout({ stage }: { stage: number }) {
  const readouts = [
    { label: "Bone Density", value: "T: -1.2", show: stage >= 1 },
    { label: "ACL Tension", value: "142 N", show: stage >= 2 },
    { label: "PCL Tension", value: "118 N", show: stage >= 2 },
    { label: "MCL Stiffness", value: "74 N/mm", show: stage >= 2 },
    { label: "Capsule Vol.", value: "38.2 mL", show: stage >= 3 },
    { label: "Quad Force", value: "2,840 N", show: stage >= 4 },
    { label: "Patellar Track", value: "Normal", show: stage >= 4 },
  ];

  return (
    <div className="absolute right-2 top-12 bottom-2 w-24 flex flex-col justify-center gap-1.5 pointer-events-none">
      {readouts.map((r, i) => (
        <div
          key={r.label}
          className={`transition-all duration-700 ${
            r.show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <div className="text-[8px] text-cartan-gray-blue leading-none">{r.label}</div>
          <div className="text-[10px] font-mono text-cartan-teal leading-tight">{r.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Main exported component ────────────────────────────── */
export default function DigitalTwinAssembly() {
  const [stage, setStage] = useState(-1);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer to start animation when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Progress through stages
  useEffect(() => {
    if (!inView) return;
    if (stage >= STAGES.length - 1) return;

    const nextStage = stage + 1;
    const delay = stage < 0 ? 600 : STAGES[stage].duration;

    const timer = setTimeout(() => setStage(nextStage), delay);
    return () => clearTimeout(timer);
  }, [inView, stage]);

  const currentStage = stage >= 0 && stage < STAGES.length ? STAGES[stage] : null;
  const progress = Math.min(((stage + 1) / (STAGES.length - 1)) * 100, 100);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[380px] flex flex-col">
      {/* Header */}
      <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-2">
        Digital Twin Assembly
      </h3>

      {/* Progress bar */}
      <div className="h-1 bg-cartan-mid-navy/40 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-cartan-teal/60 to-cartan-teal rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${stage < 0 ? 0 : progress}%` }}
        />
      </div>

      {/* Status line */}
      <div className="flex items-center gap-2 mb-3 h-5">
        {currentStage && currentStage.id !== "complete" && (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-cartan-teal animate-pulse" />
            <span className="text-[11px] font-mono text-cartan-teal/80 truncate">
              {currentStage.label}
            </span>
          </>
        )}
        {currentStage?.id === "complete" && (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[11px] font-mono text-green-400">
              ✓ Digital twin ready — 4 layers assembled
            </span>
          </>
        )}
      </div>

      {/* 3D Canvas + data overlay */}
      <div className="relative flex-1 min-h-0 rounded-lg overflow-hidden border border-cartan-mid-navy/30 bg-cartan-dark/80">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(74,140,126,1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,140,126,1) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <TwinScene stage={stage} />
        </Canvas>

        <DataReadout stage={stage} />

        {/* Corner labels */}
        <div className="absolute top-2 left-2 text-[9px] font-mono text-cartan-gray-blue/50">
          ANTERIOR
        </div>
        <div className="absolute bottom-2 left-2 text-[9px] font-mono text-cartan-gray-blue/50">
          POSTERIOR
        </div>
      </div>

      {/* Layer legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
        {[
          { label: "Bone", color: "bg-[#e0d4c5]", show: stage >= 1 },
          { label: "ACL / PCL", color: "bg-cartan-teal", show: stage >= 2 },
          { label: "MCL / LCL", color: "bg-cartan-light-blue", show: stage >= 2 },
          { label: "Capsule", color: `bg-[${CAPSULE_COLOR}]`, show: stage >= 3 },
          { label: "Extensor Mech.", color: "bg-amber-500", show: stage >= 4 },
          { label: "Complete", color: "bg-green-400", show: stage >= 5 },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-1.5 transition-all duration-500 ${
              item.show ? "opacity-100" : "opacity-20"
            }`}
          >
            <div className={`w-2 h-2 rounded-sm ${item.color}`} />
            <span className="text-[10px] text-cartan-white/70">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
