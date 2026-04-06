"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { DistalFemur, ProximalTibia } from "./KneeGeometry";

const ACL_COLOR = "#4A8C7E";
const PCL_COLOR = "#3d7a6d";
const COLLATERAL_COLOR = "#A8CDD4";

function LigamentTube({
  start,
  end,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
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
    return new THREE.TubeGeometry(curve, 16, 0.022, 8, false);
  }, [start, end]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} transparent opacity={0.75} roughness={0.3} metalness={0.15} />
    </mesh>
  );
}

function KneeAssembly({
  showLigaments = true,
  autoRotate = true,
}: {
  showLigaments?: boolean;
  autoRotate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} rotation={[0.15, 0, 0]}>
        {/* Distal Femur */}
        <group position={[0, 0.55, 0]}>
          <DistalFemur visible={true} />
        </group>

        {/* Proximal Tibia */}
        <group position={[0, -0.45, 0]}>
          <ProximalTibia visible={true} />
        </group>

        {showLigaments && (
          <>
            <LigamentTube start={[0.03, 0.0, 0.06]} end={[-0.03, -0.42, 0.04]} color={ACL_COLOR} />
            <LigamentTube start={[-0.03, 0.0, -0.06]} end={[0.03, -0.44, -0.04]} color={PCL_COLOR} />
            <LigamentTube start={[-0.22, 0.1, 0]} end={[-0.20, -0.52, 0]} color={COLLATERAL_COLOR} />
            <LigamentTube start={[0.22, 0.1, 0]} end={[0.20, -0.52, 0]} color={COLLATERAL_COLOR} />
          </>
        )}
      </group>
    </Float>
  );
}

export default function KneeModel({
  showLigaments = true,
  autoRotate = true,
  className = "",
}: {
  showLigaments?: boolean;
  autoRotate?: boolean;
  className?: string;
}) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 2]} intensity={0.8} />
        <directionalLight position={[-2, 3, -1]} intensity={0.3} color="#A8CDD4" />
        <pointLight position={[0, 0, 3]} intensity={0.3} color="#4A8C7E" />
        <KneeAssembly showLigaments={showLigaments} autoRotate={autoRotate} />
      </Canvas>
    </div>
  );
}
