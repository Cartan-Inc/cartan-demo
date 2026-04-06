"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { RealKneeAssembly } from "./KneeGeometry";

function RotatingKnee({ ligamentData }: { ligamentData: Record<string, number[][]> | null }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} rotation={[0.15, 0, 0]}>
        <RealKneeAssembly
          showBone={true}
          showCartilage={true}
          showLigaments={true}
          ligamentData={ligamentData || undefined}
        />
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
  const [ligamentData, setLigamentData] = useState<Record<string, number[][]> | null>(null);

  useEffect(() => {
    fetch("/models/ligaments.json")
      .then((r) => r.json())
      .then(setLigamentData)
      .catch(() => {});
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 2]} intensity={0.8} />
        <directionalLight position={[-2, 3, -1]} intensity={0.3} color="#A8CDD4" />
        <pointLight position={[0, 0, 3]} intensity={0.3} color="#4A8C7E" />
        <RotatingKnee ligamentData={ligamentData} />
      </Canvas>
    </div>
  );
}
