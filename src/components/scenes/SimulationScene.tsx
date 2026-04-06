"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SceneWrapper from "../SceneWrapper";
import ToolingBadge from "../ToolingBadge";
import CyclicStressPanel from "../simulation/CyclicStressPanel";
import WearPanel from "../simulation/WearPanel";
import FractureRiskPanel from "../simulation/FractureRiskPanel";
import BoneIngrowthPanel from "../simulation/BoneIngrowthPanel";
import LooseningPanel from "../simulation/LooseningPanel";
import type { ImplantType } from "../simulation/simData";

const simulationPanels = [
  {
    id: "stress",
    label: "Cyclic Stress",
    description: "Implant mechanical failure risk at the tibial bridge",
    icon: "⚡",
    gradient: "from-blue-500/20 to-red-500/20",
  },
  {
    id: "wear",
    label: "HXLPE Wear",
    description: "Polyethylene insert wear pattern evolution",
    icon: "🔄",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "fracture",
    label: "Fracture Risk",
    description: "Stress risers on tibial island",
    icon: "⚠️",
    gradient: "from-red-500/20 to-pink-500/20",
  },
  {
    id: "ingrowth",
    label: "Bone Ingrowth",
    description: "Osseointegration probability map",
    icon: "🦴",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "loosening",
    label: "Aseptic Loosening",
    description: "Normal/shear forces at implant-bone interface",
    icon: "📊",
    gradient: "from-purple-500/20 to-violet-500/20",
  },
];

const surgeonParams = [
  { label: "Femoral Rotation", value: 3, unit: "° external", min: 0, max: 7 },
  { label: "Tibial Slope (Medial)", value: 5, unit: "°", min: 0, max: 10 },
  { label: "Tibial Slope (Lateral)", value: 3, unit: "°", min: 0, max: 10 },
  { label: "Coronal Angle", value: 0, unit: "° (neutral)", min: -3, max: 3 },
];

export default function SimulationScene() {
  const [years, setYears] = useState(25);
  const [activePanel, setActivePanel] = useState("stress");
  const [implantType, setImplantType] = useState<"bcr" | "cr">("bcr");

  // Simulated survivorship curve
  const survivorship = implantType === "bcr" ? 97.2 - (years * 0.12) : 95.8 - (years * 0.18);

  return (
    <SceneWrapper id="simulation">
      <div className="max-w-6xl mx-auto w-full">
        <motion.p
          className="text-cartan-teal text-sm tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Pre-Operative — Step 2
        </motion.p>

        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
        >
          50-Year Simulation
        </motion.h2>

        <motion.p
          className="text-cartan-white/60 text-lg mb-12 max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          The AI stack is designed to simulate the post-operative knee across
          a 50-year horizon — exploring wear, stress, and failure modes before the first incision.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Timeline + Survivorship */}
          <motion.div
            className="md:col-span-2 bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Implant toggle */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setImplantType("bcr")}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  implantType === "bcr"
                    ? "bg-cartan-teal/20 text-cartan-teal border border-cartan-teal/40"
                    : "bg-cartan-mid-navy/40 text-cartan-gray-blue border border-cartan-mid-navy"
                }`}
              >
                BCR Implant
              </button>
              <button
                onClick={() => setImplantType("cr")}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  implantType === "cr"
                    ? "bg-cartan-teal/20 text-cartan-teal border border-cartan-teal/40"
                    : "bg-cartan-mid-navy/40 text-cartan-gray-blue border border-cartan-mid-navy"
                }`}
              >
                CR Implant
              </button>
              <span className="text-xs text-cartan-gray-blue ml-2">Compare implant configurations</span>
            </div>

            {/* Timeline slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-cartan-gray-blue font-mono">Year 0 (Surgery)</span>
                <span className="text-sm font-mono text-cartan-teal">
                  Year {years} Post-Op
                </span>
                <span className="text-xs text-cartan-gray-blue font-mono">Year 50</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full h-1 bg-cartan-mid-navy rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cartan-teal
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(74,140,126,0.5)]"
              />
            </div>

            {/* Survivorship display */}
            <div className="bg-cartan-navy/40 rounded-xl p-6 mb-6">
              <div className="flex items-end gap-4 mb-4">
                <div>
                  <div className="text-xs text-cartan-gray-blue mb-1">Simulated Survivorship</div>
                  <div className="text-4xl font-bold text-cartan-teal font-mono">
                    {survivorship.toFixed(1)}%
                  </div>
                </div>
                <div className="text-xs text-cartan-gray-blue mb-2">
                  at {years} years ({implantType.toUpperCase()}) — illustrative
                </div>
              </div>

              {/* Visual survivorship bar */}
              <div className="h-3 bg-cartan-mid-navy rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cartan-teal to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${survivorship}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-cartan-gray-blue">0%</span>
                <span className="text-[10px] text-cartan-gray-blue/60 italic">Simulated data for demonstration purposes only</span>
                <span className="text-[10px] text-cartan-gray-blue">100%</span>
              </div>
            </div>

            {/* Simulation panels */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {simulationPanels.map((panel) => (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id)}
                  className={`flex-shrink-0 px-3 py-2 text-xs rounded-lg transition-all ${
                    activePanel === panel.id
                      ? "bg-cartan-teal/20 text-cartan-teal border border-cartan-teal/30"
                      : "bg-cartan-mid-navy/30 text-cartan-gray-blue border border-transparent hover:border-cartan-mid-navy"
                  }`}
                >
                  <span className="mr-1">{panel.icon}</span>
                  {panel.label}
                </button>
              ))}
            </div>

            {/* Active panel visualization */}
            <div className="bg-cartan-dark/40 rounded-xl border border-cartan-mid-navy p-4">
              {activePanel === "stress" && <CyclicStressPanel years={years} implant={implantType} />}
              {activePanel === "wear" && <WearPanel years={years} implant={implantType} />}
              {activePanel === "fracture" && <FractureRiskPanel years={years} implant={implantType} />}
              {activePanel === "ingrowth" && <BoneIngrowthPanel years={years} implant={implantType} />}
              {activePanel === "loosening" && <LooseningPanel years={years} implant={implantType} />}
            </div>
          </motion.div>

          {/* Right: Surgeon Parameters */}
          <motion.div
            className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-6">
              Surgeon Parameters
            </h3>

            <p className="text-xs text-cartan-gray-blue mb-6 leading-relaxed">
              Surgeons review and adjust the proposed plan. Each change triggers an updated simulation
              with new confidence intervals.
            </p>

            <div className="space-y-6">
              {surgeonParams.map((param) => (
                <div key={param.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-cartan-white/70">{param.label}</span>
                    <span className="text-sm font-mono text-cartan-teal">
                      {param.value}{param.unit}
                    </span>
                  </div>
                  <div className="h-1.5 bg-cartan-mid-navy rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cartan-teal/60 rounded-full"
                      style={{
                        width: `${((param.value - param.min) / (param.max - param.min)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-cartan-gray-blue">{param.min}</span>
                    <span className="text-[10px] text-cartan-gray-blue">{param.max}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-cartan-teal/5 border border-cartan-teal/20 rounded-lg">
              <div className="text-xs text-cartan-teal font-mono mb-1">Plan Status</div>
              <div className="text-sm text-cartan-white/80">
                Surgeon-approved with modifications
              </div>
              <div className="text-xs text-cartan-gray-blue mt-1">
                2 iterations · Last updated 14m ago
              </div>
            </div>
          </motion.div>
        </div>

        <ToolingBadge
          tools={["NVIDIA PhysicsNeMo", "PINNs", "FEBio", "JAX/Diffrax", "Monte Carlo"]}
          delay={0.8}
        />
      </div>
    </SceneWrapper>
  );
}
