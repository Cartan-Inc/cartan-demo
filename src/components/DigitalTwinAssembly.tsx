"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

/* ── Rotating scene with manual + auto rotation ─────────── */
function TwinScene({
  stage,
  ligamentData,
  manualRotation,
  autoRotate,
  layers,
}: {
  stage: number;
  ligamentData: Record<string, number[][]> | null;
  manualRotation: number;
  autoRotate: boolean;
  layers: { bone: boolean; cartilage: boolean; cruciates: boolean; collaterals: boolean };
}) {
  const groupRef = useRef<THREE.Group>(null);

  const showBone = stage >= 1 && layers.bone;
  const showCartilage = stage >= 2 && layers.cartilage;
  const showLigaments = stage >= 3;
  const scanning = stage === 0;

  // Filter ligament data based on toggles
  const filteredLigaments = ligamentData
    ? {
        ...(layers.cruciates
          ? {
              ACL_Fem: ligamentData.ACL_Fem,
              ACL_Tib: ligamentData.ACL_Tib,
              PCL_Fem: ligamentData.PCL_Fem,
              PCL_Tib: ligamentData.PCL_Tib,
            }
          : {}),
        ...(layers.collaterals
          ? {
              MCL_Fem: ligamentData.MCL_Fem,
              MCL_Tib: ligamentData.MCL_Tib,
              LCL_Fem: ligamentData.LCL_Fem,
              LCL_Tib: ligamentData.LCL_Tib,
            }
          : {}),
      }
    : undefined;

  useFrame((state) => {
    if (!groupRef.current) return;
    if (autoRotate) {
      groupRef.current.rotation.y = manualRotation + Math.sin(state.clock.elapsedTime * 0.25) * 0.5;
    } else {
      groupRef.current.rotation.y = manualRotation;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} />
      <directionalLight position={[-2, 3, -1]} intensity={0.3} color="#A8CDD4" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#4A8C7E" />

      <Float speed={1} rotationIntensity={0.08} floatIntensity={0.15}>
        <group ref={groupRef}>
          <ScanLine active={scanning} />
          <RealKneeAssembly
            showBone={showBone}
            showCartilage={showCartilage}
            showLigaments={showLigaments}
            ligamentData={filteredLigaments}
          />
        </group>
      </Float>
    </>
  );
}

/* ── Zoom camera control ─────────────────────────────────── */
function ZoomControl({ zoom }: { zoom: number }) {
  const { camera } = useThree();

  useFrame(() => {
    const targetZ = 3.2 / zoom;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
  });

  return null;
}

/* ── Data readout box (bottom-right corner) ──────────────── */
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

  const visibleReadouts = readouts.filter((r) => r.show);
  if (visibleReadouts.length === 0) return null;

  return (
    <div className="absolute bottom-2 right-2 bg-cartan-dark/90 backdrop-blur-sm border border-cartan-mid-navy/50 rounded-lg px-3 py-2 pointer-events-none">
      <div className="text-[8px] text-cartan-gray-blue/60 uppercase tracking-wider mb-1.5">Parameters</div>
      <div className="space-y-1">
        {readouts.map((r, i) => (
          <div
            key={r.label}
            className={`flex items-center justify-between gap-4 transition-all duration-500 ${
              r.show ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className="text-[9px] text-cartan-gray-blue whitespace-nowrap">{r.label}</span>
            <span className="text-[10px] font-mono text-cartan-teal whitespace-nowrap">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="text-[8px] font-mono text-cartan-gray-blue/30 mt-1.5 pt-1 border-t border-cartan-mid-navy/30">
        Specimen John Doe
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function DigitalTwinAssembly() {
  const [stage, setStage] = useState(-1);
  const [inView, setInView] = useState(false);
  const [ligamentData, setLigamentData] = useState<Record<string, number[][]> | null>(null);
  const [manualRotation, setManualRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState({
    bone: true,
    cartilage: true,
    cruciates: true,
    collaterals: true,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const toggleLayer = useCallback((key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    setManualRotation((prev) => prev + dx * 0.01);
    if (autoRotate) setAutoRotate(false);
  }, [autoRotate]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

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
  const assemblyComplete = stage >= STAGES.length - 1;

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[420px] flex flex-col">
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
      <div className="flex items-center gap-2 mb-2 h-5">
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
              ✓ Digital twin ready — John Doe
            </span>
          </>
        )}
      </div>

      {/* 3D Canvas — drag to rotate */}
      <div
        className="relative flex-1 min-h-0 rounded-lg overflow-hidden border border-cartan-mid-navy/30 bg-cartan-dark/80 cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
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
          <ZoomControl zoom={zoom} />
          <TwinScene
            stage={stage}
            ligamentData={ligamentData}
            manualRotation={manualRotation}
            autoRotate={autoRotate}
            layers={layers}
          />
        </Canvas>

        {/* Data readout box - bottom right */}
        <DataReadout stage={stage} />
      </div>

      {/* Controls: Rotation + Zoom */}
      {assemblyComplete && (
        <div className="mt-3 space-y-2">
          {/* Rotation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-cartan-gray-blue">Rotation</span>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                  autoRotate
                    ? "text-cartan-teal border-cartan-teal/30 bg-cartan-teal/10"
                    : "text-cartan-gray-blue border-cartan-mid-navy"
                }`}
              >
                {autoRotate ? "Auto ✓" : "Manual"}
              </button>
            </div>
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              value={manualRotation}
              onChange={(e) => {
                setManualRotation(parseFloat(e.target.value));
                if (autoRotate) setAutoRotate(false);
              }}
              className="w-full h-1 bg-cartan-mid-navy rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cartan-teal
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(74,140,126,0.4)]"
            />
          </div>

          {/* Zoom */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-cartan-gray-blue">Zoom</span>
              <span className="text-[10px] font-mono text-cartan-teal">{zoom.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1 bg-cartan-mid-navy rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cartan-teal
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(74,140,126,0.4)]"
            />
          </div>
        </div>
      )}

      {/* Layer toggles */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
        {[
          { key: "bone" as const, label: "Cortical Bone", color: "bg-[#e8ddd0]", show: stage >= 1 },
          { key: "cartilage" as const, label: "Articular Cartilage", color: "bg-[#c0d4da]", show: stage >= 2 },
          { key: "cruciates" as const, label: "ACL / PCL", color: "bg-cartan-teal", show: stage >= 3 },
          { key: "collaterals" as const, label: "MCL / LCL", color: "bg-cartan-light-blue", show: stage >= 3 },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => item.show && toggleLayer(item.key)}
            disabled={!item.show}
            className={`flex items-center gap-1.5 transition-all duration-300 text-left ${
              !item.show ? "opacity-20 cursor-default" : "cursor-pointer hover:opacity-90"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-sm border transition-all ${
                item.show && layers[item.key]
                  ? `${item.color} border-white/20`
                  : "bg-transparent border-cartan-gray-blue/40"
              }`}
            />
            <span
              className={`text-[10px] transition-all ${
                item.show && layers[item.key] ? "text-cartan-white/80" : "text-cartan-gray-blue/50"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
