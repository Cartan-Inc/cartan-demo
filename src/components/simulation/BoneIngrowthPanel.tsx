"use client";

import { getBoneIngrowth, ImplantType } from "./simData";

function IngrowthChart({ points, currentX, maxY }: {
  points: { x: number; y: number }[];
  currentX: number;
  maxY: number;
}) {
  const w = 280;
  const h = 80;
  const pad = { top: 5, bottom: 15, left: 30, right: 10 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  // Only show first 5 years (where the action is), then compress
  const xMax = Math.max(5, Math.min(50, currentX + 2));
  const xScale = (x: number) => pad.left + (x / xMax) * cw;
  const yScale = (y: number) => pad.top + ch - (y / maxY) * ch;

  const visible = points.filter((p) => p.x <= xMax);
  const pathD = visible
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`)
    .join(" ");

  const currentPt = points.reduce((closest, p) =>
    Math.abs(p.x - currentX) < Math.abs(closest.x - currentX) ? p : closest
  );

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: "100px" }}>
      {/* Grid */}
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={pad.left} x2={w - pad.right} y1={yScale(v)} y2={yScale(v)}
            stroke="#263545" strokeWidth="0.5" />
          <text x={pad.left - 3} y={yScale(v) + 3} fill="#5A6872" fontSize="6" textAnchor="end">{v}%</text>
        </g>
      ))}
      {/* X axis */}
      {Array.from({ length: Math.min(6, Math.ceil(xMax)) }, (_, i) => {
        const y = Math.round((i / 5) * xMax);
        return (
          <text key={y} x={xScale(y)} y={h - 2} fill="#5A6872" fontSize="6" textAnchor="middle">
            {y < 1 ? `${y * 12}mo` : `${y}yr`}
          </text>
        );
      })}
      {/* Plateau reference */}
      <line x1={pad.left} x2={w - pad.right} y1={yScale(95)} y2={yScale(95)}
        stroke="#4A8C7E" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.3" />
      {/* Curve */}
      <path d={pathD} fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.8" />
      {/* Fill under curve */}
      <path d={`${pathD} L${xScale(visible[visible.length - 1].x)},${yScale(0)} L${xScale(0)},${yScale(0)} Z`}
        fill="#22c55e" opacity="0.06" />
      {/* Current dot */}
      <circle cx={xScale(currentPt.x)} cy={yScale(currentPt.y)} r="3" fill="#22c55e" />
      <text x={xScale(currentPt.x) + 5} y={yScale(currentPt.y) - 4} fill="#22c55e" fontSize="7" fontFamily="monospace">
        {currentPt.y.toFixed(1)}%
      </text>
    </svg>
  );
}

export default function BoneIngrowthPanel({ years, implant }: { years: number; implant: ImplantType }) {
  const data = getBoneIngrowth(years, implant);

  return (
    <div className="space-y-4">
      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Surface Coverage</div>
          <div className="text-lg font-mono text-green-400">{data.ingrowth}<span className="text-[10px] text-cartan-gray-blue">%</span></div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Fixation Strength</div>
          <div className="text-lg font-mono text-cartan-teal">{data.fixationStrength} <span className="text-[10px] text-cartan-gray-blue">MPa</span></div>
        </div>
        <div className="bg-cartan-dark/60 rounded-lg p-3">
          <div className="text-[9px] text-cartan-gray-blue">Target</div>
          <div className="text-lg font-mono text-cartan-white/60">{data.maxIngrowth}<span className="text-[10px] text-cartan-gray-blue">%</span></div>
        </div>
      </div>

      {/* Ingrowth curve */}
      <div className="bg-cartan-dark/60 rounded-lg p-3">
        <div className="text-[10px] text-cartan-gray-blue mb-2">Osseointegration Progression</div>
        <IngrowthChart
          points={data.curvePoints.map((p) => ({ x: p.year, y: p.ingrowth }))}
          currentX={years}
          maxY={100}
        />
      </div>

      {/* Regional breakdown */}
      <div className="bg-cartan-dark/60 rounded-lg p-3">
        <div className="text-[9px] text-cartan-gray-blue mb-3">Regional Ingrowth</div>
        <div className="space-y-2.5">
          {[
            { label: "Femoral Anterior", value: data.regions.femoralAnterior },
            { label: "Femoral Posterior", value: data.regions.femoralPosterior },
            { label: "Tibial Medial", value: data.regions.tibialMedial },
            { label: "Tibial Lateral", value: data.regions.tibialLateral },
          ].map((region) => (
            <div key={region.label}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] text-cartan-white/60">{region.label}</span>
                <span className="text-[10px] font-mono text-green-400">{region.value}%</span>
              </div>
              <div className="h-1.5 bg-cartan-mid-navy rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400/60 rounded-full transition-all duration-700"
                  style={{ width: `${region.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixation strength gauge */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-cartan-gray-blue">Shear Fixation Strength</span>
          <span className="text-[10px] font-mono text-cartan-teal">{data.fixationStrength} / {data.maxStrength} MPa</span>
        </div>
        <div className="h-2.5 bg-cartan-mid-navy rounded-full overflow-hidden">
          <div
            className="h-full bg-cartan-teal/60 rounded-full transition-all duration-700"
            style={{ width: `${(data.fixationStrength / data.maxStrength) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
