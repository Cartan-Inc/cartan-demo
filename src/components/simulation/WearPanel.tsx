"use client";

import { getWearData, ImplantType } from "./simData";

function MiniLineChart({ points, maxY, currentX, color, label }: {
  points: { x: number; y: number }[];
  maxY: number;
  currentX: number;
  color: string;
  label: string;
}) {
  const w = 280;
  const h = 80;
  const pad = { top: 5, bottom: 15, left: 30, right: 10 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const xScale = (x: number) => pad.left + (x / 50) * cw;
  const yScale = (y: number) => pad.top + ch - (y / maxY) * ch;

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`)
    .join(" ");

  const currentIdx = points.findIndex((p) => p.x >= currentX);
  const currentY = currentIdx >= 0 ? points[currentIdx].y : 0;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: "100px" }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={pad.left} x2={w - pad.right} y1={yScale(f * maxY)} y2={yScale(f * maxY)}
          stroke="#263545" strokeWidth="0.5" />
      ))}
      {/* Y axis labels */}
      {[0, maxY / 2, maxY].map((v) => (
        <text key={v} x={pad.left - 3} y={yScale(v) + 3} fill="#5A6872" fontSize="6" textAnchor="end">
          {Math.round(v)}
        </text>
      ))}
      {/* X axis labels */}
      {[0, 10, 20, 30, 40, 50].map((y) => (
        <text key={y} x={xScale(y)} y={h - 2} fill="#5A6872" fontSize="6" textAnchor="middle">{y}yr</text>
      ))}
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" />
      {/* Current position dot */}
      <circle cx={xScale(currentX)} cy={yScale(currentY)} r="3" fill={color} />
      <text x={xScale(currentX) + 5} y={yScale(currentY) - 4} fill={color} fontSize="7" fontFamily="monospace">
        {currentY.toFixed(1)}
      </text>
      {/* Label */}
      <text x={w - pad.right} y={pad.top + 8} fill="#5A6872" fontSize="6" textAnchor="end">{label}</text>
    </svg>
  );
}

export default function WearPanel({ years, implant }: { years: number; implant: ImplantType }) {
  const data = getWearData(years, implant);
  const maxWear = implant === "bcr" ? 300 : 400;

  return (
    <div className="space-y-4">
      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Cumulative Wear</div>
          <div className="text-lg font-mono text-cartan-teal">{data.cumulativeWear} <span className="text-[10px] text-cartan-gray-blue">mm³</span></div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Wear Rate</div>
          <div className="text-lg font-mono text-cartan-white/80">{data.currentRate} <span className="text-[10px] text-cartan-gray-blue">mm³/yr</span></div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Debris Particles</div>
          <div className="text-lg font-mono text-amber-400">~{data.wearDebris}<span className="text-[10px] text-cartan-gray-blue">B</span></div>
        </div>
      </div>

      {/* Wear curve */}
      <div className="bg-cartan-dark/60 rounded-lg p-3">
        <div className="text-[10px] text-cartan-gray-blue mb-2">Cumulative Volumetric Wear (mm³)</div>
        <MiniLineChart
          points={data.curvePoints.map((p) => ({ x: p.year, y: p.wear }))}
          maxY={maxWear}
          currentX={years}
          color="#4A8C7E"
          label={`${implant.toUpperCase()} — ${data.currentRate} mm³/yr steady`}
        />
      </div>

      {/* Linear penetration gauge */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-cartan-gray-blue">Linear Penetration</span>
          <span className={`text-[10px] font-mono ${data.linearPenetration > data.penThreshold ? "text-red-400" : "text-green-400"}`}>
            {data.linearPenetration.toFixed(3)} mm
          </span>
        </div>
        <div className="relative h-2.5 bg-cartan-mid-navy rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (data.linearPenetration / 0.4) * 100)}%`,
              backgroundColor: data.linearPenetration > data.penThreshold ? "#ef4444" : "#4A8C7E",
            }}
          />
          {/* Threshold marker */}
          <div
            className="absolute top-0 bottom-0 w-px bg-red-400/60"
            style={{ left: `${(data.penThreshold / 0.4) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[8px] text-cartan-gray-blue">0 mm</span>
          <span className="text-[8px] text-red-400/60">↑ 0.3mm threshold</span>
          <span className="text-[8px] text-cartan-gray-blue">0.4 mm</span>
        </div>
      </div>
    </div>
  );
}
