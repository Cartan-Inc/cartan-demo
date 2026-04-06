"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { RealKneeAssembly } from "./KneeGeometry";

/* ── assembly stages ────────────────────────────────────── */
const STAGES = [
  { id: "scan", label: "Processing imaging data…", duration: 2000 },
  { id: "bone", label: "Reconstructing bone geometry", duration: 2500 },
  { id: "cartilage", label: "Mapping articular cartilage", duration: 2500 },
  { id: "ligaments", label: "Identifying cruciate & collateral ligaments", duration: 2500 },
  { id: "complete", label: "Digital twin ready", duration: 0 },
];

/* ── Scan line effect ───────────────────────────────────── */
function ScanLine({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (!active) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity *= 0.95;
      return;
    }
    const y = Math.sin(state.clock.elapsedTime * 2) * 1.2;
    meshRef.current.position.y = y;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.5;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.6]}>
      <planeGeometry args={[2, 0.015]} />
      <meshBasicMaterial color="#4A8C7E" transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── Rotating scene with staged reveals ─────────────────── */
function TwinScene({
  stage,
  ligamentData,
}: {
  stage: number;
  ligamentData: Record<string, number[][]> | null;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const showBone = stage >= 1;
  const showCartilage = stage >= 2;
  const showLigaments = stage >= 3;
  const scanning = stage === 0;

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.5;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} />
      <directionalLight position={[-2, 3, -1]} intensity={0.3} color="#A8CDD4" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#4A8C7E" />

      <Float speed={1} rotationIntensity={0.08} floatIntensity={0.15}>
        <group ref={groupRef} rotation={[0.1, 0, 0]}>
          <ScanLine active={scanning} />
          <RealKneeAssembly
            showBone={showBone}
            showCartilage={showCartilage}
            showLigaments={showLigaments}
            ligamentData={ligamentData || undefined}
          />
        </group>
      </Float>
    </>
  );
}

/* ── Data readout overlay ───────────────────────────────── */
function DataReadout({ stage }: { stage: number }) {
  const readouts = [
    { label: "Femoral Mesh", value: "8,000 tri", show: stage >= 1 },
    { label: "Tibial Mesh", value: "7,998 tri", show: stage >= 1 },
    { label: "Bone Density", value: "T: -1.2", show: stage >= 1 },
    { label: "Cart. Thickness", value: "2.1 mm", show: stage >= 2 },
    { label: "ACL Tension", value: "142 N", show: stage >= 3 },
    { label: "PCL Tension", value: "118 N", show: stage >= 3 },
    { label: "MCL Stiffness", value: "74 N/mm", show: stage >= 3 },
    { label: "LCL Stiffness", value: "62 N/mm", show: stage >= 3 },
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

/* ── Main component ─────────────────────────────────────── */
export default function DigitalTwinAssembly() {
  const [stage, setStage] = useState(-1);
  const [inView, setInView] = useState(false);
  const [ligamentData, setLigamentData] = useState<Record<string, number[][]> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load ligament attachment points
  useEffect(() => {
    fetch("/models/ligaments.json")
      .then((r) => r.json())
      .then(setLigamentData)
      .catch(() => console.warn("Ligament data not loaded"));
  }, []);

  // Intersection observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
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

      {/* Status */}
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
              ✓ Digital twin ready — real cadaveric anatomy
            </span>
          </>
        )}
      </div>

      {/* 3D Canvas */}
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
          camera={{ position: [0, 0, 3.2], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <TwinScene stage={stage} ligamentData={ligamentData} />
        </Canvas>

        <DataReadout stage={stage} />

        <div className="absolute top-2 left-2 text-[9px] font-mono text-cartan-gray-blue/50">
          ANTERIOR
        </div>
        <div className="absolute bottom-2 left-2 text-[9px] font-mono text-cartan-gray-blue/50">
          POSTERIOR
        </div>
        <div className="absolute bottom-2 right-2 text-[8px] font-mono text-cartan-gray-blue/30">
          Cadaveric specimen DU01
        </div>
      </div>

      {/* Layer legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
        {[
          { label: "Cortical Bone", color: "bg-[#e8ddd0]", show: stage >= 1 },
          { label: "Articular Cartilage", color: "bg-[#c0d4da]", show: stage >= 2 },
          { label: "ACL / PCL", color: "bg-cartan-teal", show: stage >= 3 },
          { label: "MCL / LCL", color: "bg-cartan-light-blue", show: stage >= 3 },
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
