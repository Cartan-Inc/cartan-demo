"use client";

import { getCyclicStress, ImplantType } from "./simData";

function stressColor(value: number): string {
  if (value < 0.2) return "#1a5c38";      // dark green
  if (value < 0.35) return "#22c55e";     // green
  if (value < 0.5) return "#84cc16";      // lime
  if (value < 0.65) return "#eab308";     // yellow
  if (value < 0.8) return "#f97316";      // orange
  if (value < 0.9) return "#ef4444";      // red
  return "#dc2626";                        // dark red
}

/**
 * Generate a tibial tray-shaped mask.
 * BCR: has a notch/island in the anterior-center for ACL preservation.
 * CR: standard D-shaped tibial tray without notch.
 * Returns true if the cell is part of the tray shape.
 */
function isTrayCell(row: number, col: number, rows: number, cols: number, implant: ImplantType): boolean {
  // Normalize to -1..1
  const nx = (col / (cols - 1)) * 2 - 1; // -1 (medial) to +1 (lateral)
  const ny = (row / (rows - 1)) * 2 - 1; // -1 (posterior) to +1 (anterior)

  // Tibial tray is roughly elliptical, wider ML than AP
  // Slight D-shape: flatter posteriorly
  const mlRadius = 1.0;
  const apRadius = ny < 0 ? 0.85 : 0.95; // flatter posterior
  const dist = Math.sqrt((nx / mlRadius) ** 2 + (ny / apRadius) ** 2);

  if (dist > 0.95) return false; // outside tray

  if (implant === "bcr") {
    // BCR: tibial island/notch in anterior-center (ACL footprint)
    // Small rectangular region excluded
    const islandX = Math.abs(nx) < 0.18;
    const islandY = ny > -0.15 && ny < 0.35;
    if (islandX && islandY) return false; // island gap
  }

  return true;
}

/**
 * Generate stress value for each cell.
 * BCR: high stress concentration around the tibial bridge (edges of the island notch)
 * CR: moderate stress, higher medially, slight posterior loading
 */
function getStressValue(row: number, col: number, rows: number, cols: number, years: number, implant: ImplantType): number {
  const nx = (col / (cols - 1)) * 2 - 1;
  const ny = (row / (rows - 1)) * 2 - 1;

  if (implant === "bcr") {
    // Stress concentration around the bridge/island edges
    const distToIslandEdge = Math.sqrt(
      Math.pow(Math.max(0, Math.abs(nx) - 0.18) * 3, 2) +
      Math.pow(Math.max(0, ny < -0.15 ? -0.15 - ny : ny > 0.35 ? ny - 0.35 : 0) * 3, 2)
    );
    // Proximity to island = higher stress
    const bridgeStress = Math.max(0, 1 - distToIslandEdge * 0.8);

    // Background stress from condylar loading (medial > lateral)
    const medialBias = 0.3 + (1 - nx) * 0.1;
    const posteriorBias = 0.2 + (1 - ny) * 0.05;

    const base = bridgeStress * 0.6 + medialBias * 0.25 + posteriorBias * 0.15;
    const fatigue = base * (1 + years * 0.006);
    return Math.min(1, fatigue);
  } else {
    // CR: no island, more distributed loading
    // Medial compartment higher stress, posterior horn loading
    const medialLoad = 0.25 + (1 - nx) * 0.15; // medial side higher
    const posteriorLoad = 0.15 + (1 - ny) * 0.08; // posterior horn
    // Slight central concentration from condylar contact
    const centralDist = Math.sqrt(nx * nx + ny * ny);
    const contactStress = Math.max(0, 0.35 - centralDist * 0.2);
    // Medial contact point
    const medialContact = Math.max(0, 0.3 * Math.exp(-((nx + 0.3) ** 2 + (ny - 0.1) ** 2) * 4));
    // Lateral contact point
    const lateralContact = Math.max(0, 0.2 * Math.exp(-((nx - 0.35) ** 2 + (ny - 0.05) ** 2) * 4));

    const base = medialLoad * 0.25 + posteriorLoad * 0.15 + contactStress * 0.2 + medialContact + lateralContact;
    const fatigue = base * (1 + years * 0.004);
    return Math.min(1, Math.max(0.08, fatigue));
  }
}

const GRID_ROWS = 16;
const GRID_COLS = 20;

export default function CyclicStressPanel({ years, implant }: { years: number; implant: ImplantType }) {
  const data = getCyclicStress(years, implant);

  // Generate tray-shaped heatmap
  const cells: { row: number; col: number; value: number; active: boolean }[] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const active = isTrayCell(r, c, GRID_ROWS, GRID_COLS, implant);
      const value = active ? getStressValue(r, c, GRID_ROWS, GRID_COLS, years, implant) : 0;
      cells.push({ row: r, col: c, value, active });
    }
  }

  return (
    <div className="space-y-4">
      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Peak Stress</div>
          <div className="text-lg font-mono text-cartan-teal">{data.peakStress} <span className="text-[10px] text-cartan-gray-blue">MPa</span></div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Fatigue Safety Factor</div>
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
          <span className="text-[9px] font-mono text-cartan-gray-blue">{years}yr / {(data.cycles / 1e6).toFixed(0)}M cycles</span>
        </div>
        <div className="bg-cartan-dark/80 rounded-lg p-4 flex justify-center">
          <div
            className="grid gap-[1px]"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              width: "100%",
              maxWidth: "300px",
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
        <div className="flex justify-between mt-1 px-4">
          <span className="text-[8px] text-cartan-gray-blue">Medial</span>
          {implant === "bcr" && <span className="text-[8px] text-cartan-teal">↑ ACL island</span>}
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

      {/* Fatigue damage accumulation */}
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
