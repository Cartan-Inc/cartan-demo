"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BONE_COLOR = "#e0d4c5";
const BONE_HIGHLIGHT = "#ede5da";
const CARTILAGE_COLOR = "#c8d8dc";

/**
 * Procedural distal femur.
 * Built from a combination of shapes to approximate the condylar anatomy:
 * - Shaft: tapered cylinder
 * - Medial/lateral condyles: elongated ellipsoids
 * - Intercondylar notch: carved between condyles
 * - Anterior flange / trochlear groove: smooth ramp for patellar tracking
 * - Epicondyles: subtle lateral bumps
 */
export function DistalFemur({
  visible,
  opacity = 0.92,
}: {
  visible: boolean;
  opacity?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Build condyle geometry (elongated in AP direction)
  const medialCondyle = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 24, 18);
    // Scale to create elongated condyle: wider AP, narrower ML
    geo.scale(0.26, 0.24, 0.32);
    return geo;
  }, []);

  const lateralCondyle = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 24, 18);
    geo.scale(0.24, 0.23, 0.30);
    return geo;
  }, []);

  // Trochlear groove / anterior flange
  const trochlea = useMemo(() => {
    const shape = new THREE.Shape();
    // Saddle-like profile for patellar groove
    shape.moveTo(-0.18, 0);
    shape.quadraticCurveTo(-0.12, 0.08, -0.04, 0.04);
    shape.quadraticCurveTo(0, 0.02, 0.04, 0.04);
    shape.quadraticCurveTo(0.12, 0.08, 0.18, 0);
    shape.quadraticCurveTo(0.12, -0.02, 0, -0.01);
    shape.quadraticCurveTo(-0.12, -0.02, -0.18, 0);

    const extrudeSettings = {
      depth: 0.25,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return geo;
  }, []);

  // Shaft geometry - slight anterior bow
  const shaft = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(0, 0.4, 0.02),
      new THREE.Vector3(0, 0, 0.04),
      new THREE.Vector3(0, -0.3, 0.03),
    ]);
    // Custom radii: wider at top, narrowing toward condyles
    const radiuses = [0.14, 0.15, 0.16, 0.18];
    const frames = curve.computeFrenetFrames(20);
    const pts = curve.getPoints(20);

    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const segments = 20;
    const radialSegments = 12;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const rIdx = Math.min(Math.floor(t * (radiuses.length - 1)), radiuses.length - 2);
      const rT = (t * (radiuses.length - 1)) - rIdx;
      const radius = radiuses[rIdx] * (1 - rT) + radiuses[rIdx + 1] * rT;

      for (let j = 0; j <= radialSegments; j++) {
        const angle = (j / radialSegments) * Math.PI * 2;
        const x = pts[i].x + Math.cos(angle) * radius;
        const z = pts[i].z + Math.sin(angle) * radius;
        vertices.push(x, pts[i].y, z);

        if (i < segments && j < radialSegments) {
          const a = i * (radialSegments + 1) + j;
          const b = a + 1;
          const c = a + radialSegments + 1;
          const d = c + 1;
          indices.push(a, c, b, b, c, d);
        }
      }
    }

    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Metaphyseal flare - transition from shaft to condyles
  const flare = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.30, 0.18, 0.25, 16);
    return geo;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        const target = visible ? opacity : 0;
        mat.opacity += (target - mat.opacity) * 0.06;
      }
    });
    const targetScale = visible ? 1 : 0.6;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    );
  });

  return (
    <group ref={groupRef} scale={[0.6, 0.6, 0.6]}>
      {/* Shaft */}
      <mesh geometry={shaft}>
        <meshStandardMaterial
          color={BONE_COLOR}
          transparent
          opacity={0}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>

      {/* Metaphyseal flare */}
      <mesh geometry={flare} position={[0, -0.42, 0.02]}>
        <meshStandardMaterial
          color={BONE_COLOR}
          transparent
          opacity={0}
          roughness={0.5}
          metalness={0.08}
        />
      </mesh>

      {/* Medial condyle (left when viewed anteriorly) */}
      <mesh geometry={medialCondyle} position={[-0.16, -0.62, 0.02]}>
        <meshStandardMaterial
          color={BONE_HIGHLIGHT}
          transparent
          opacity={0}
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>

      {/* Lateral condyle */}
      <mesh geometry={lateralCondyle} position={[0.16, -0.62, 0.02]}>
        <meshStandardMaterial
          color={BONE_HIGHLIGHT}
          transparent
          opacity={0}
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>

      {/* Trochlear groove (anterior) */}
      <mesh geometry={trochlea} position={[0, -0.44, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color={CARTILAGE_COLOR}
          transparent
          opacity={0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Medial epicondyle bump */}
      <mesh position={[-0.30, -0.50, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial
          color={BONE_COLOR}
          transparent
          opacity={0}
          roughness={0.5}
          metalness={0.08}
        />
      </mesh>

      {/* Lateral epicondyle bump */}
      <mesh position={[0.30, -0.50, 0]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial
          color={BONE_COLOR}
          transparent
          opacity={0}
          roughness={0.5}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}

/**
 * Procedural proximal tibia.
 * - Tibial plateau: flat-ish disc with slight concavities for medial/lateral compartments
 * - Tibial eminence (spine): two small peaks between compartments
 * - Tibial tuberosity: anterior bump for patellar tendon
 * - Shaft: tapered triangular-ish cross section
 */
export function ProximalTibia({
  visible,
  opacity = 0.92,
}: {
  visible: boolean;
  opacity?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Tibial plateau - slightly wider ML than AP, slight posterior slope
  const plateau = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.34, 0.30, 0.08, 20);
    // Slightly compress in z (AP) direction
    geo.scale(1, 1, 0.85);
    return geo;
  }, []);

  // Medial plateau concavity
  const medialPlateau = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.16, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.35);
    return geo;
  }, []);

  // Lateral plateau (slightly convex/flat)
  const lateralPlateau = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.14, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.3);
    return geo;
  }, []);

  // Tibial eminence (intercondylar spines)
  const medialSpine = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.03, 0.10, 8);
    return geo;
  }, []);

  const lateralSpine = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.025, 0.08, 8);
    return geo;
  }, []);

  // Tibial tuberosity
  const tuberosity = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.06, 10, 10);
    geo.scale(0.8, 1.2, 1);
    return geo;
  }, []);

  // Shaft - triangular cross-section approximation
  const shaft = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.4, 0.01),
      new THREE.Vector3(0, -0.8, 0),
    ]);
    const pts = curve.getPoints(16);
    const vertices: number[] = [];
    const indices: number[] = [];
    const segments = 16;
    const radialSegments = 12;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const radius = 0.17 - t * 0.04; // taper down

      for (let j = 0; j <= radialSegments; j++) {
        const angle = (j / radialSegments) * Math.PI * 2;
        // Slightly triangular: sharper anteriorly
        const r = radius * (1 + 0.15 * Math.cos(angle * 3));
        const x = pts[i].x + Math.cos(angle) * r;
        const z = pts[i].z + Math.sin(angle) * r;
        vertices.push(x, pts[i].y, z);

        if (i < segments && j < radialSegments) {
          const a = i * (radialSegments + 1) + j;
          const b = a + 1;
          const c = a + radialSegments + 1;
          const d = c + 1;
          indices.push(a, c, b, b, c, d);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        const target = visible ? opacity : 0;
        mat.opacity += (target - mat.opacity) * 0.06;
      }
    });
    const targetScale = visible ? 1 : 0.6;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    );
  });

  const matProps = {
    transparent: true as const,
    opacity: 0,
    roughness: 0.5,
    metalness: 0.08,
  };

  return (
    <group ref={groupRef} scale={[0.6, 0.6, 0.6]}>
      {/* Tibial plateau base */}
      <mesh geometry={plateau} position={[0, 0, 0]} rotation={[0.05, 0, 0]}>
        <meshStandardMaterial color={BONE_COLOR} {...matProps} />
      </mesh>

      {/* Medial plateau concavity (articular surface) */}
      <mesh
        geometry={medialPlateau}
        position={[-0.12, 0.04, -0.02]}
        rotation={[Math.PI, 0, 0]}
      >
        <meshStandardMaterial color={CARTILAGE_COLOR} {...matProps} roughness={0.3} />
      </mesh>

      {/* Lateral plateau */}
      <mesh
        geometry={lateralPlateau}
        position={[0.12, 0.04, -0.02]}
        rotation={[Math.PI, 0, 0]}
      >
        <meshStandardMaterial color={CARTILAGE_COLOR} {...matProps} roughness={0.3} />
      </mesh>

      {/* Medial tibial spine */}
      <mesh geometry={medialSpine} position={[-0.025, 0.09, -0.01]}>
        <meshStandardMaterial color={BONE_HIGHLIGHT} {...matProps} />
      </mesh>

      {/* Lateral tibial spine */}
      <mesh geometry={lateralSpine} position={[0.025, 0.08, -0.01]}>
        <meshStandardMaterial color={BONE_HIGHLIGHT} {...matProps} />
      </mesh>

      {/* Tibial tuberosity (anterior) */}
      <mesh geometry={tuberosity} position={[0, -0.08, 0.28]}>
        <meshStandardMaterial color={BONE_COLOR} {...matProps} />
      </mesh>

      {/* Shaft */}
      <mesh geometry={shaft} position={[0, -0.04, 0]}>
        <meshStandardMaterial color={BONE_COLOR} {...matProps} />
      </mesh>
    </group>
  );
}
