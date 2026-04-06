"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function FemurBone({ opacity = 0.9 }: { opacity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    // Stylized femoral condyles — two rounded forms
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: "#e8ddd0",
      roughness: 0.6,
      metalness: 0.1,
      transparent: true,
      opacity,
    });
    return { mat };
  }, [opacity]);

  return (
    <group position={[0, 0.8, 0]}>
      {/* Femoral shaft */}
      <mesh>
        <cylinderGeometry args={[0.18, 0.22, 1.6, 16]} />
        <meshStandardMaterial color="#e8ddd0" roughness={0.6} metalness={0.1} transparent opacity={opacity} />
      </mesh>
      {/* Medial condyle */}
      <mesh position={[-0.18, -0.85, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#e0d4c5" roughness={0.5} metalness={0.1} transparent opacity={opacity} />
      </mesh>
      {/* Lateral condyle */}
      <mesh position={[0.18, -0.85, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#e0d4c5" roughness={0.5} metalness={0.1} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function TibiaBone({ opacity = 0.9 }: { opacity?: number }) {
  return (
    <group position={[0, -1.0, 0]}>
      {/* Tibial plateau */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.32, 0.28, 0.2, 16]} />
        <meshStandardMaterial color="#e0d4c5" roughness={0.6} metalness={0.1} transparent opacity={opacity} />
      </mesh>
      {/* Tibial island (for ACL attachment) */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 8]} />
        <meshStandardMaterial color="#d4c8b5" roughness={0.5} metalness={0.1} transparent opacity={opacity} />
      </mesh>
      {/* Tibial shaft */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.16, 1.4, 16]} />
        <meshStandardMaterial color="#e8ddd0" roughness={0.6} metalness={0.1} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function Ligament({
  start,
  end,
  color,
  label,
  opacity = 0.7,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  label: string;
  opacity?: number;
}) {
  const curve = useMemo(() => {
    const mid: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2 + 0.05,
    ];
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  const geometry = useMemo(() => {
    const points = curve.getPoints(20);
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      20,
      0.025,
      8,
      false
    );
  }, [curve]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.2}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function Implant({ visible = false }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <group>
      {/* Femoral component — metallic cap over condyles */}
      <group position={[0, -0.02, 0]}>
        <mesh position={[-0.18, -0.05, 0]}>
          <sphereGeometry args={[0.30, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#b0b8c0" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0.18, -0.05, 0]}>
          <sphereGeometry args={[0.30, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#b0b8c0" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* Tibial tray */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.05, 16]} />
        <meshStandardMaterial color="#a0a8b0" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Poly insert */}
      <mesh position={[0, -0.24, 0]}>
        <cylinderGeometry args={[0.30, 0.30, 0.04, 16]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.0} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function KneeAssembly({
  showLigaments = true,
  showImplant = false,
  autoRotate = true,
}: {
  showLigaments?: boolean;
  showImplant?: boolean;
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
        <FemurBone opacity={showImplant ? 0.4 : 0.9} />
        <TibiaBone opacity={showImplant ? 0.4 : 0.9} />

        {showLigaments && (
          <>
            {/* ACL — anterior cruciate ligament */}
            <Ligament
              start={[0.05, -0.1, 0.08]}
              end={[-0.05, -0.32, 0.05]}
              color="#4A8C7E"
              label="ACL"
            />
            {/* PCL — posterior cruciate ligament */}
            <Ligament
              start={[-0.05, -0.1, -0.08]}
              end={[0.05, -0.35, -0.05]}
              color="#3d7a6d"
              label="PCL"
            />
            {/* MCL — medial collateral */}
            <Ligament
              start={[-0.35, 0.0, 0]}
              end={[-0.28, -0.5, 0]}
              color="#A8CDD4"
              label="MCL"
            />
            {/* LCL — lateral collateral */}
            <Ligament
              start={[0.35, 0.0, 0]}
              end={[0.28, -0.5, 0]}
              color="#A8CDD4"
              label="LCL"
            />
          </>
        )}

        <Implant visible={showImplant} />
      </group>
    </Float>
  );
}

export default function KneeModel({
  showLigaments = true,
  showImplant = false,
  autoRotate = true,
  className = "",
}: {
  showLigaments?: boolean;
  showImplant?: boolean;
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
        <KneeAssembly
          showLigaments={showLigaments}
          showImplant={showImplant}
          autoRotate={autoRotate}
        />
      </Canvas>
    </div>
  );
}
