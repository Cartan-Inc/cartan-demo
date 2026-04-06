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
 * Ligament rendered as tube through control points.
 * Uses attachment point centroids by default, with optional waypoints
 * for routing around bone surfaces.
 */
function LigamentFromPoints({
  femPoints,
  tibPoints,
  color,
  visible,
  proximalOverride,
  distalOverride,
  waypoints,
  radius = 0.018,
}: {
  femPoints: number[][];
  tibPoints: number[][];
  color: string;
  visible: boolean;
  proximalOverride?: [number, number, number];
  distalOverride?: [number, number, number];
  waypoints?: [number, number, number][];
  radius?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    if (!femPoints.length || !tibPoints.length) return null;

    const femCentroid = proximalOverride
      ? proximalOverride
      : (femPoints
          .reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0])
          .map((v) => v / femPoints.length) as [number, number, number]);
    const tibCentroid = distalOverride
      ? distalOverride
      : (tibPoints
          .reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0])
          .map((v) => v / tibPoints.length) as [number, number, number]);

    // Build control points: proximal → waypoints → distal
    const controlPoints: THREE.Vector3[] = [
      new THREE.Vector3(...femCentroid),
    ];

    if (waypoints && waypoints.length > 0) {
      for (const wp of waypoints) {
        controlPoints.push(new THREE.Vector3(...wp));
      }
    } else {
      // Default: simple midpoint with slight anterior offset
      const mid = new THREE.Vector3(
        (femCentroid[0] + tibCentroid[0]) / 2,
        (femCentroid[1] + tibCentroid[1]) / 2,
        (femCentroid[2] + tibCentroid[2]) / 2 + 0.02,
      );
      controlPoints.push(mid);
    }

    controlPoints.push(new THREE.Vector3(...tibCentroid));

    // Use LineCurve segments joined into a smooth path
    // This prevents CatmullRom overshoot through bone surfaces
    const smoothed: THREE.Vector3[] = [];
    const subdivisions = 4; // subdivide each segment for smoothness
    for (let i = 0; i < controlPoints.length - 1; i++) {
      const a = controlPoints[i];
      const b = controlPoints[i + 1];
      for (let j = 0; j < subdivisions; j++) {
        const t = j / subdivisions;
        smoothed.push(new THREE.Vector3(
          a.x + (b.x - a.x) * t,
          a.y + (b.y - a.y) * t,
          a.z + (b.z - a.z) * t,
        ));
      }
    }
    smoothed.push(controlPoints[controlPoints.length - 1]);

    // Use CatmullRom on the densely-sampled polyline for slight smoothing
    const curve = new THREE.CatmullRomCurve3(smoothed, false, 'chordal');
    return new THREE.TubeGeometry(curve, smoothed.length * 2, radius, 8, false);
  }, [femPoints, tibPoints, proximalOverride, distalOverride, waypoints, radius]);

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
          {/* MCL: medial epicondyle → STRAIGHT to first tibial contact → wraps tibial surface
              Phase 1: taut straight line (stays outside femoral condyle X≈0.56)
              Phase 2: follows tibial cortical bone surface + 0.03 offset to insertion */}
          <LigamentFromPoints
            femPoints={ligamentData.MCL_Fem || []}
            tibPoints={ligamentData.MCL_Tib || []}
            color={MCL_COLOR}
            visible={showLigaments}
            proximalOverride={[0.58, 0.20, -0.15]}
            waypoints={[
              // Phase 1: straight descent, staying outside femoral condyle (surface X≈0.53-0.56)
              [0.58, 0.10, -0.16],
              [0.57, 0.00, -0.17],
              [0.56, -0.06, -0.18],
              // Phase 2: tibial contact → follow surface (bone + 0.04 offset)
              [0.53, -0.13, -0.19],
              [0.54, -0.18, -0.19],
              [0.53, -0.23, -0.18],
              [0.52, -0.28, -0.18],
              [0.51, -0.33, -0.19],
              [0.50, -0.38, -0.20],
              [0.48, -0.43, -0.20],
              [0.46, -0.48, -0.19],
            ]}
            distalOverride={[0.42, -0.52, -0.19]}
            radius={0.014}
          />
          {/* LCL: lateral epicondyle → fibular head
              Proximal starts inside lateral epicondyle (surface at X≈-0.55) */}
          <LigamentFromPoints
            femPoints={ligamentData.LCL_Fem || []}
            tibPoints={ligamentData.LCL_Tib || []}
            color={LCL_COLOR}
            visible={showLigaments}
            proximalOverride={[-0.59, 0.19, -0.15]}
            distalOverride={[-0.50, -0.48, -0.36]}
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
