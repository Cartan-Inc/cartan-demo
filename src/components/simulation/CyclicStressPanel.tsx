"use client";

import { getCyclicStress, ImplantType } from "./simData";

function stressColor(value: number): string {
  if (value < 0.15) return "#1a5c38";
  if (value < 0.25) return "#22c55e";
  if (value < 0.4) return "#84cc16";
  if (value < 0.55) return "#eab308";
  if (value < 0.7) return "#f97316";
  if (value < 0.85) return "#ef4444";
  return "#dc2626";
}

const ROWS = 20;
const COLS = 24;

/**
 * BCR tibial tray: horseshoe/U-shape.
 * Deep anterior-opening channel wrapping around tibial island.
 * Two bearing lobes (medial left, lateral right) connected posteriorly.
 */
function isBCRCell(r: number, c: number): boolean {
  const nx = (c / (COLS - 1)) * 2 - 1;   // -1 medial to +1 lateral
  const ny = (r / (ROWS - 1)) * 2 - 1;   // -1 anterior to +1 posterior

  // Outer boundary: wide ellipse, slightly wider ML than AP
  const outerDist = (nx / 1.0) ** 2 + (ny / 0.92) ** 2;
  if (outerDist > 0.92) return false;

  // Deep U-channel: opens anteriorly, extends ~55% toward posterior
  // Channel is centered, narrower than the lobes
  const channelHalfWidth = 0.22;
  const channelEnd = 0.15; // posterior limit of channel (in ny coords, -1=ant, +1=post)
  if (Math.abs(nx) < channelHalfWidth && ny < channelEnd) return false;

  return true;
}

/**
 * CR tibial tray: anatomic kidney-bean/D-shape.
 * Small shallow anterior notch. Asymmetric (lateral slightly fuller).
 */
function isCRCell(r: number, c: number): boolean {
  const nx = (c / (COLS - 1)) * 2 - 1;
  const ny = (r / (ROWS - 1)) * 2 - 1;

  // Asymmetric outer boundary: lateral (right/+nx) is fuller
  const lateralBulge = nx > 0 ? 1.02 : 0.95;
  const outerDist = (nx / lateralBulge) ** 2 + (ny / 0.90) ** 2;
  if (outerDist > 0.92) return false;

  // Slight anterior-medial concavity
  if (nx < -0.3 && ny < -0.6) {
    const concaveDist = ((nx + 0.6) / 0.35) ** 2 + ((ny + 0.85) / 0.3) ** 2;
    if (concaveDist < 0.8) return false;
  }

  // Small shallow anterior notch for eminence
  const notchHalfWidth = 0.15;
  const notchDepth = -0.65; // only extends slightly from anterior edge
  if (Math.abs(nx) < notchHalfWidth && ny < notchDepth) return false;

  return true;
}

/**
 * BCR stress: articulation paths on each lobe + bridge center stress
 */
function getBCRStress(r: number, c: number, years: number): number {
  const nx = (c / (COLS - 1)) * 2 - 1;
  const ny = (r / (ROWS - 1)) * 2 - 1;

  // Medial condylar articulation path: arc on medial lobe
  // Contact point rolls anterior-to-posterior as knee flexes
  const medialContactX = -0.55;
  const medialContactY = 0.0;
  const medialDist = Math.sqrt((nx - medialContactX) ** 2 + (ny - medialContactY) ** 2);
  const medialStress = Math.max(0, 0.75 - medialDist * 1.5) * 1.0;

  // Lateral condylar articulation path: arc on lateral lobe
  const lateralContactX = 0.55;
  const lateralContactY = -0.05;
  const lateralDist = Math.sqrt((nx - lateralContactX) ** 2 + (ny - lateralContactY) ** 2);
  const lateralStress = Math.max(0, 0.65 - lateralDist * 1.4) * 0.85;

  // Bridge stress: center of posterior connection between lobes
  // The bridge is at nx≈0, ny≈0.15..0.5 (just posterior of channel end)
  const bridgeDist = Math.sqrt(nx ** 2 + ((ny - 0.25) / 0.4) ** 2);
  const bridgeStress = Math.max(0, 0.85 - bridgeDist * 1.8) * 0.95;

  // Background low stress across the whole tray
  const background = 0.08;

  const total = background + medialStress + lateralStress + bridgeStress;
  const fatigue = total * (1 + years * 0.005);
  return Math.min(1, fatigue);
}

/**
 * CR stress: articulation paths on each condyle, medial slightly higher
 */
function getCRStress(r: number, c: number, years: number): number {
  const nx = (c / (COLS - 1)) * 2 - 1;
  const ny = (r / (ROWS - 1)) * 2 - 1;

  // Medial condylar contact: larger, more conforming
  const medialContactX = -0.4;
  const medialContactY = 0.05;
  const medialDist = Math.sqrt((nx - medialContactX) ** 2 + ((ny - medialContactY) / 1.3) ** 2);
  const medialStress = Math.max(0, 0.7 - medialDist * 1.2) * 0.9;

  // Lateral condylar contact: slightly smaller footprint
  const lateralContactX = 0.42;
  const lateralContactY = -0.0;
  const lateralDist = Math.sqrt((nx - lateralContactX) ** 2 + ((ny - lateralContactY) / 1.2) ** 2);
  const lateralStress = Math.max(0, 0.6 - lateralDist * 1.3) * 0.75;

  // Posterior horn loading (slight)
  const postLoad = ny > 0.3 ? (ny - 0.3) * 0.15 : 0;

  const background = 0.10;
  const total = background + medialStress + lateralStress + postLoad;
  const fatigue = total * (1 + years * 0.004);
  return Math.min(1, fatigue);
}

export default function CyclicStressPanel({ years, implant }: { years: number; implant: ImplantType }) {
  const data = getCyclicStress(years, implant);

  const isCell = implant === "bcr" ? isBCRCell : isCRCell;
  const getStress = implant === "bcr" ? getBCRStress : getCRStress;

  const cells: { active: boolean; value: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const active = isCell(r, c);
      const value = active ? getStress(r, c, years) : 0;
      cells.push({ active, value });
    }
  }

  return (
    <div className="space-y-4">
      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Peak Stress</div>
          <div className="text-lg font-mono text-cartan-teal">{data.peakStress} <span className="text-[10px] text-cartan-gray-blue">MPa</span></div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Safety Factor</div>
          <div className={`text-lg font-mono ${data.safetyFactor > 2 ? "text-green-400" : data.safetyFactor > 1.5 ? "text-yellow-400" : "text-red-400"}`}>
            {data.safetyFactor}×
          </div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Loading Cycles</div>
          <div className="text-lg font-mono text-cartan-white/80">{(data.cycles / 1e6).toFixed(0)}<span className="text-[10px] text-cartan-gray-blue">M</span></div>
        </div>
      </div>

      {/* Tibial tray heatmap */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-cartan-gray-blue">
            {implant === "bcr" ? "BCR Tibial Tray — Von Mises Stress" : "CR Tibial Tray — Von Mises Stress"}
          </span>
          <span className="text-[9px] font-mono text-cartan-gray-blue">{years}yr</span>
        </div>
        <div className="bg-cartan-dark/80 rounded-lg p-4 flex justify-center">
          <div
            className="grid gap-[1px]"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {cells.map((cell, i) => (
              <div
                key={i}
                className="aspect-square rounded-[1px] transition-colors duration-500"
                style={{
                  backgroundColor: cell.active ? stressColor(cell.value) : "transparent",
                  opacity: cell.active ? 0.5 + cell.value * 0.5 : 0,
                }}
              />
            ))}
          </div>
        </div>
        {/* Annotations */}
        <div className="flex justify-between mt-1.5 px-4">
          <span className="text-[8px] text-cartan-gray-blue">Medial</span>
          {implant === "bcr" && <span className="text-[8px] text-cartan-teal">↑ Tibial island (preserved)</span>}
          {implant === "cr" && <span className="text-[8px] text-cartan-gray-blue/50">↑ Eminence notch</span>}
          <span className="text-[8px] text-cartan-gray-blue">Lateral</span>
        </div>
        <div className="text-center mt-0.5">
          <span className="text-[8px] text-cartan-gray-blue">Anterior ↑ · Posterior ↓</span>
        </div>
        {/* Color legend */}
        <div className="flex items-center gap-1 mt-2 justify-center">
          <span className="text-[8px] text-cartan-gray-blue">Low</span>
          {["#1a5c38", "#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444", "#dc2626"].map((c) => (
            <div key={c} className="w-4 h-2 rounded-sm" style={{ backgroundColor: c }} />
          ))}
          <span className="text-[8px] text-cartan-gray-blue">High</span>
        </div>
      </div>

      {/* Fatigue damage */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-cartan-gray-blue">Fatigue Damage Accumulation</span>
          <span className="text-[10px] font-mono text-cartan-teal">{(data.damageFraction * 100).toFixed(1)}%</span>
        </div>
        <div className="h-2.5 bg-cartan-mid-navy rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${data.damageFraction * 100}%`,
              backgroundColor: data.damageFraction < 0.5 ? "#22c55e" : data.damageFraction < 0.75 ? "#eab308" : "#ef4444",
            }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[8px] text-cartan-gray-blue">0% (pristine)</span>
          <span className="text-[8px] text-cartan-gray-blue">100% (failure)</span>
        </div>
      </div>
    </div>
  );
}
