"use client";

import { getCyclicStress, ImplantType } from "./simData";

function stressColor(value: number): string {
  if (value < 0.3) return "#22c55e";      // green
  if (value < 0.5) return "#84cc16";      // lime
  if (value < 0.7) return "#eab308";      // yellow
  if (value < 0.85) return "#f97316";     // orange
  return "#ef4444";                        // red
}

export default function CyclicStressPanel({ years, implant }: { years: number; implant: ImplantType }) {
  const data = getCyclicStress(years, implant);

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

      {/* Tibial plateau heatmap */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-cartan-gray-blue">
            {implant === "bcr" ? "Tibial Bridge Stress Distribution" : "Tibial Tray Stress Distribution"}
          </span>
          <span className="text-[9px] font-mono text-cartan-gray-blue">Von Mises (normalized)</span>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="grid gap-[2px]" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
            {data.heatmap.flat().map((value, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm transition-colors duration-500"
                style={{ backgroundColor: stressColor(value), opacity: 0.5 + value * 0.5 }}
              />
            ))}
          </div>
          {implant === "bcr" && (
            <div className="text-center mt-2">
              <span className="text-[9px] text-cartan-gray-blue">↑ ACL bridge region (stress concentration)</span>
            </div>
          )}
          {/* Color legend */}
          <div className="flex items-center gap-1 mt-2 justify-center">
            <span className="text-[8px] text-cartan-gray-blue">Low</span>
            {["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"].map((c) => (
              <div key={c} className="w-4 h-2 rounded-sm" style={{ backgroundColor: c }} />
            ))}
            <span className="text-[8px] text-cartan-gray-blue">High</span>
          </div>
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
