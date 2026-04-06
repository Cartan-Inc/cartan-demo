"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const BONE_COLOR = "#e8ddd0";
const CARTILAGE_COLOR = "#c0d4da";
const ACL_COLOR = "#4A8C7E";
const PCL_COLOR = "#3d7a6d";
const MCL_COLOR = "#A8CDD4";
const LCL_COLOR = "#9abdc5";

/**
 * Load a GLB mesh and render with animated visibility.
 */
function AnatomyMesh({
  url,
  color,
  visible,
  opacity = 0.92,
  roughness = 0.5,
  metalness = 0.08,
}: {
  url: string;
  color: string;
  visible: boolean;
  opacity?: number;
  roughness?: number;
  metalness?: number;
}) {
  const gltf = useLoader(GLTFLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    // Extract first mesh geometry from GLB
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && !geometry) {
        setGeometry(child.geometry);
      }
    });
  }, [gltf, geometry]);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const target = visible ? opacity : 0;
    mat.opacity += (target - mat.opacity) * 0.06;
    const targetScale = visible ? 1 : 0.85;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    );
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} scale={[0.85, 0.85, 0.85]}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0}
        roughness={roughness}
        metalness={metalness}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Ligament rendered as tube between attachment point centroids.
 */
function LigamentFromPoints({
  femPoints,
  tibPoints,
  color,
  visible,
}: {
  femPoints: number[][];
  tibPoints: number[][];
  color: string;
  visible: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    if (!femPoints.length || !tibPoints.length) return null;

    // Compute centroids
    const femCentroid = femPoints
      .reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0])
      .map((v) => v / femPoints.length);
    const tibCentroid = tibPoints
      .reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0])
      .map((v) => v / tibPoints.length);

    const mid = [
      (femCentroid[0] + tibCentroid[0]) / 2,
      (femCentroid[1] + tibCentroid[1]) / 2,
      (femCentroid[2] + tibCentroid[2]) / 2 + 0.02,
    ];

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(femCentroid[0], femCentroid[1], femCentroid[2]),
      new THREE.Vector3(mid[0], mid[1], mid[2]),
      new THREE.Vector3(tibCentroid[0], tibCentroid[1], tibCentroid[2]),
    ]);

    return new THREE.TubeGeometry(curve, 12, 0.018, 8, false);
  }, [femPoints, tibPoints]);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const target = visible ? 0.85 : 0;
    mat.opacity += (target - mat.opacity) * 0.06;
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0}
        roughness={0.3}
        metalness={0.15}
      />
    </mesh>
  );
}

/**
 * Full anatomical knee assembly using real cadaveric data.
 */
export function RealKneeAssembly({
  showBone = true,
  showCartilage = true,
  showLigaments = true,
  ligamentData,
}: {
  showBone?: boolean;
  showCartilage?: boolean;
  showLigaments?: boolean;
  ligamentData?: Record<string, number[][]>;
}) {
  return (
    <group>
      {/* Bones */}
      <AnatomyMesh url="/models/femur.glb" color={BONE_COLOR} visible={showBone} />
      <AnatomyMesh url="/models/tibia.glb" color={BONE_COLOR} visible={showBone} />
      <AnatomyMesh url="/models/fibula.glb" color={BONE_COLOR} visible={showBone} opacity={0.5} />
      <AnatomyMesh url="/models/patella.glb" color={BONE_COLOR} visible={showBone} opacity={0.7} />

      {/* Cartilage */}
      <AnatomyMesh
        url="/models/femur_cart.glb"
        color={CARTILAGE_COLOR}
        visible={showCartilage}
        opacity={0.6}
        roughness={0.3}
        metalness={0.05}
      />
      <AnatomyMesh
        url="/models/tibia_cart.glb"
        color={CARTILAGE_COLOR}
        visible={showCartilage}
        opacity={0.6}
        roughness={0.3}
        metalness={0.05}
      />
      <AnatomyMesh
        url="/models/patella_cart.glb"
        color={CARTILAGE_COLOR}
        visible={showCartilage}
        opacity={0.5}
        roughness={0.3}
        metalness={0.05}
      />

      {/* Ligaments from real attachment points */}
      {ligamentData && (
        <>
          <LigamentFromPoints
            femPoints={ligamentData.ACL_Fem || []}
            tibPoints={ligamentData.ACL_Tib || []}
            color={ACL_COLOR}
            visible={showLigaments}
          />
          <LigamentFromPoints
            femPoints={ligamentData.PCL_Fem || []}
            tibPoints={ligamentData.PCL_Tib || []}
            color={PCL_COLOR}
            visible={showLigaments}
          />
          <LigamentFromPoints
            femPoints={ligamentData.MCL_Fem || []}
            tibPoints={ligamentData.MCL_Tib || []}
            color={MCL_COLOR}
            visible={showLigaments}
          />
          <LigamentFromPoints
            femPoints={ligamentData.LCL_Fem || []}
            tibPoints={ligamentData.LCL_Tib || []}
            color={LCL_COLOR}
            visible={showLigaments}
          />
        </>
      )}
    </group>
  );
}

// Keep procedural versions as fallback exports
export function DistalFemur({ visible }: { visible: boolean; opacity?: number }) {
  return <AnatomyMesh url="/models/femur.glb" color={BONE_COLOR} visible={visible} />;
}

export function ProximalTibia({ visible }: { visible: boolean; opacity?: number }) {
  return <AnatomyMesh url="/models/tibia.glb" color={BONE_COLOR} visible={visible} />;
}
