"use client";

import { getLooseningData, ImplantType } from "./simData";

function MicroChart({ points, currentMonth, threshold }: {
  points: { x: number; y: number }[];
  currentMonth: number;
  threshold: number;
}) {
  const w = 280;
  const h = 80;
  const pad = { top: 5, bottom: 15, left: 30, right: 10 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const xMax = 36;
  const yMax = 160;
  const xScale = (x: number) => pad.left + (x / xMax) * cw;
  const yScale = (y: number) => pad.top + ch - (y / yMax) * ch;

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`)
    .join(" ");

  const cappedMonth = Math.min(currentMonth, xMax);
  const currentPt = points.reduce((closest, p) =>
    Math.abs(p.x - cappedMonth) < Math.abs(closest.x - cappedMonth) ? p : closest
  );

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: "100px" }}>
      {/* Threshold zone */}
      <rect x={pad.left} y={yScale(yMax)} width={cw} height={yScale(threshold) - yScale(yMax)}
        fill="#ef4444" opacity="0.05" />
      {/* Threshold line */}
      <line x1={pad.left} x2={w - pad.right} y1={yScale(threshold)} y2={yScale(threshold)}
        stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.5" />
      <text x={w - pad.right - 2} y={yScale(threshold) - 3} fill="#ef4444" fontSize="5" textAnchor="end" opacity="0.6">
        {threshold}μm threshold
      </text>
      {/* Grid */}
      {[0, 50, 100, 150].map((v) => (
        <text key={v} x={pad.left - 3} y={yScale(v) + 3} fill="#5A6872" fontSize="6" textAnchor="end">{v}</text>
      ))}
      {/* X axis */}
      {[0, 6, 12, 18, 24, 30, 36].map((m) => (
        <text key={m} x={xScale(m)} y={h - 2} fill="#5A6872" fontSize="6" textAnchor="middle">{m}mo</text>
      ))}
      {/* Safe zone */}
      <rect x={pad.left} y={yScale(threshold)} width={cw} height={yScale(0) - yScale(threshold)}
        fill="#22c55e" opacity="0.03" />
      {/* Line */}
      <path d={pathD} fill="none" stroke="#A8CDD4" strokeWidth="1.5" opacity="0.8" />
      {/* Current */}
      <circle cx={xScale(currentPt.x)} cy={yScale(currentPt.y)} r="3" fill="#A8CDD4" />
      <text x={xScale(currentPt.x) + 5} y={yScale(currentPt.y) + 10} fill="#A8CDD4" fontSize="7" fontFamily="monospace">
        {currentPt.y.toFixed(0)}μm
      </text>
    </svg>
  );
}

function RiskCurve({ points, currentX }: {
  points: { x: number; y: number }[];
  currentX: number;
}) {
  const w = 280;
  const h = 70;
  const pad = { top: 5, bottom: 15, left: 30, right: 10 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const maxY = 5;

  const xScale = (x: number) => pad.left + (x / 50) * cw;
  const yScale = (y: number) => pad.top + ch - (y / maxY) * ch;

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`)
    .join(" ");

  const currentPt = points.reduce((closest, p) =>
    Math.abs(p.x - currentX) < Math.abs(closest.x - currentX) ? p : closest
  );

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: "90px" }}>
      {[0, 1, 2, 3, 4, 5].map((v) => (
        <text key={v} x={pad.left - 3} y={yScale(v) + 3} fill="#5A6872" fontSize="6" textAnchor="end">{v}%</text>
      ))}
      {[0, 10, 20, 30, 40, 50].map((y) => (
        <text key={y} x={xScale(y)} y={h - 2} fill="#5A6872" fontSize="6" textAnchor="middle">{y}yr</text>
      ))}
      {/* Confidence band */}
      <path d={pathD} fill="none" stroke="#a855f7" strokeWidth="8" opacity="0.06" />
      <path d={pathD} fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.8" />
      <circle cx={xScale(currentPt.x)} cy={yScale(currentPt.y)} r="3" fill="#a855f7" />
      <text x={xScale(currentPt.x) + 5} y={yScale(currentPt.y) - 4} fill="#a855f7" fontSize="7" fontFamily="monospace">
        {currentPt.y.toFixed(1)}%
      </text>
    </svg>
  );
}

export default function LooseningPanel({ years, implant }: { years: number; implant: ImplantType }) {
  const data = getLooseningData(years, implant);
  const months = years * 12;

  return (
    <div className="space-y-4">
      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Micromotion</div>
          <div className={`text-lg font-mono ${data.micromotion < 50 ? "text-green-400" : "text-yellow-400"}`}>
            {data.micromotion}<span className="text-[10px] text-cartan-gray-blue">μm</span>
          </div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Stress Shielding</div>
          <div className={`text-lg font-mono ${data.stressShielding > 80 ? "text-green-400" : data.stressShielding > 70 ? "text-yellow-400" : "text-red-400"}`}>
            {data.stressShielding}<span className="text-[10px] text-cartan-gray-blue">%</span>
          </div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Loosening Risk</div>
          <div className={`text-lg font-mono ${data.looseningRisk < 2 ? "text-green-400" : "text-yellow-400"}`}>
            {data.looseningRisk}<span className="text-[10px] text-cartan-gray-blue">%</span>
          </div>
        </div>
      </div>

      {/* Micromotion chart (first 36 months) */}
      <div className="bg-cartan-dark/60 rounded-lg p-3">
        <div className="text-[10px] text-cartan-gray-blue mb-2">Bone-Implant Micromotion (μm) — First 36 Months</div>
        <MicroChart
          points={data.microCurve.map((p) => ({ x: p.months, y: p.micro }))}
          currentMonth={Math.min(months, 36)}
          threshold={data.microThreshold}
        />
      </div>

      {/* Loosening probability curve */}
      <div className="bg-cartan-dark/60 rounded-lg p-3">
        <div className="text-[10px] text-cartan-gray-blue mb-2">Cumulative Loosening Probability (%)</div>
        <RiskCurve
          points={data.riskCurve.map((p) => ({ x: p.year, y: p.risk }))}
          currentX={years}
        />
      </div>

      {/* Periprosthetic bone retention */}
      <div className="bg-cartan-dark/60 rounded-lg p-3">
        <div className="text-[9px] text-cartan-gray-blue mb-2">Periprosthetic Bone Retention (Gruen Zones)</div>
        <div className="flex gap-1 items-end justify-center h-12">
          {Object.entries(data.boneRetention).map(([zone, val]) => (
            <div key={zone} className="flex flex-col items-center gap-0.5">
              <span className="text-[7px] font-mono text-cartan-teal">{val}%</span>
              <div
                className="w-5 rounded-t transition-all duration-500"
                style={{
                  height: `${(val / 100) * 36}px`,
                  backgroundColor: val > 90 ? "#22c55e" : val > 85 ? "#eab308" : "#ef4444",
                  opacity: 0.7,
                }}
              />
              <span className="text-[6px] text-cartan-gray-blue">{zone.replace("zone", "")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
