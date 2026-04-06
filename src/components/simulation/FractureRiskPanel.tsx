"use client";

import { getFractureRisk, ImplantType } from "./simData";

function RiskChart({ points, currentX, maxY }: {
  points: { x: number; y: number }[];
  currentX: number;
  maxY: number;
}) {
  const w = 280;
  const h = 90;
  const pad = { top: 5, bottom: 15, left: 30, right: 10 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const xScale = (x: number) => pad.left + (x / 50) * cw;
  const yScale = (y: number) => pad.top + ch - (y / maxY) * ch;

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`)
    .join(" ");

  const currentY = points.find((p) => p.x >= currentX)?.y ?? 0;

  // Risk zone bands
  const zones = [
    { y: 0, h: 2, color: "#22c55e", label: "Low Risk" },
    { y: 2, h: 3, color: "#eab308", label: "Moderate" },
    { y: 5, h: maxY - 5, color: "#ef4444", label: "High Risk" },
  ];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: "110px" }}>
      {/* Risk zone bands */}
      {zones.map((z) => (
        <rect key={z.label} x={pad.left} y={yScale(z.y + z.h)} width={cw}
          height={yScale(z.y) - yScale(z.y + z.h)}
          fill={z.color} opacity="0.08" />
      ))}
      {/* Zone labels */}
      {zones.map((z) => (
        <text key={z.label + "l"} x={w - pad.right - 2} y={yScale(z.y + z.h / 2) + 2}
          fill={z.color} fontSize="5" textAnchor="end" opacity="0.5">{z.label}</text>
      ))}
      {/* Threshold lines */}
      <line x1={pad.left} x2={w - pad.right} y1={yScale(2)} y2={yScale(2)}
        stroke="#eab308" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.4" />
      <line x1={pad.left} x2={w - pad.right} y1={yScale(5)} y2={yScale(5)}
        stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.4" />
      {/* Y axis */}
      {[0, 2, 4, 6].map((v) => (
        <text key={v} x={pad.left - 3} y={yScale(v) + 3} fill="#5A6872" fontSize="6" textAnchor="end">
          {v}%
        </text>
      ))}
      {/* X axis */}
      {[0, 10, 20, 30, 40, 50].map((y) => (
        <text key={y} x={xScale(y)} y={h - 2} fill="#5A6872" fontSize="6" textAnchor="middle">{y}yr</text>
      ))}
      {/* Risk curve */}
      <path d={pathD} fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.8" />
      {/* Confidence band */}
      <path d={pathD} fill="none" stroke="#ef4444" strokeWidth="6" opacity="0.08" />
      {/* Current position */}
      <circle cx={xScale(currentX)} cy={yScale(currentY)} r="3" fill="#ef4444" />
      <text x={xScale(currentX) + 5} y={yScale(currentY) - 4} fill="#ef4444" fontSize="7" fontFamily="monospace">
        {currentY.toFixed(1)}%
      </text>
    </svg>
  );
}

export default function FractureRiskPanel({ years, implant }: { years: number; implant: ImplantType }) {
  const data = getFractureRisk(years, implant);

  if (!data.applicable) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3">
        <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </div>
        <div className="text-sm text-green-400 font-semibold">Not Applicable</div>
        <div className="text-xs text-cartan-gray-blue text-center max-w-xs leading-relaxed">
          CR implant design does not include a tibial island.
          No ACL preservation = no tibial bridge fracture risk.
          <br /><br />
          <span className="text-cartan-white/50">
            This is the tradeoff: CR eliminates bridge fracture risk
            but sacrifices the ACL and its proprioceptive benefits.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Fracture Risk</div>
          <div className={`text-lg font-mono ${
            data.riskZone === "low" ? "text-green-400" : data.riskZone === "moderate" ? "text-yellow-400" : "text-red-400"
          }`}>
            {data.risk}%
          </div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Island Width</div>
          <div className="text-lg font-mono text-cartan-white/80">{data.islandWidth} <span className="text-[10px] text-cartan-gray-blue">mm</span></div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Peak Moment</div>
          <div className="text-lg font-mono text-cartan-white/80">{data.peakMoment} <span className="text-[10px] text-cartan-gray-blue">Nm</span></div>
        </div>
      </div>

      {/* Risk curve */}
      <div className="bg-cartan-dark/60 rounded-lg p-3">
        <div className="text-[10px] text-cartan-gray-blue mb-2">Cumulative Fracture Probability (%)</div>
        <RiskChart
          points={data.curvePoints.map((p) => ({ x: p.year, y: p.risk }))}
          currentX={years}
          maxY={7}
        />
      </div>

      {/* Risk factors */}
      <div className="bg-cartan-dark/60 rounded-lg p-3">
        <div className="text-[9px] text-cartan-gray-blue mb-2">Contributing Factors</div>
        <div className="space-y-2">
          {[
            { label: "Bone mineral density", value: `T: ${data.boneDensity}`, status: data.boneDensity > -1.5 ? "ok" : "warn" },
            { label: "Island width", value: `${data.islandWidth} mm`, status: data.islandWidth > 10 ? "ok" : "warn" },
            { label: "Cumulative fatigue", value: `${years}M cycles`, status: years < 30 ? "ok" : "warn" },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between">
              <span className="text-[9px] text-cartan-white/60">{f.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cartan-white/70">{f.value}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${f.status === "ok" ? "bg-green-400" : "bg-yellow-400"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
