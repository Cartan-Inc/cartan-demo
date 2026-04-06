"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SceneWrapper from "../SceneWrapper";
import AgentMessage from "../AgentMessage";
import ToolingBadge from "../ToolingBadge";

const surgicalSteps = [
  {
    id: 1,
    phase: "data",
    label: "Intraop Data Collection",
    description: "Bone length, hardness, condylar forces through ROM, gap measurements",
    status: "complete",
  },
  {
    id: 2,
    phase: "instrument",
    label: "IM Rod & Cutting Jig",
    description: "Smart instruments positioned with real-time alignment feedback",
    status: "complete",
  },
  {
    id: 3,
    phase: "cut",
    label: "Distal Femoral Cut",
    description: "AI provides translational and rotational adjustments to cutting jig",
    status: "active",
  },
  {
    id: 4,
    phase: "cut",
    label: "Proximal Tibial Cut",
    description: "Tibial island preserved for ACL attachment — rotation locked in",
    status: "upcoming",
  },
  {
    id: 5,
    phase: "trial",
    label: "Trialing & Verification",
    description: "AI confirms alignment, forces, and kinematics within thresholds",
    status: "upcoming",
  },
  {
    id: 6,
    phase: "implant",
    label: "Implant Press-Fit",
    description: "Final component placement and wound closure",
    status: "upcoming",
  },
];

const gauges = [
  {
    label: "Medial Force",
    value: 42,
    unit: "N",
    target: "35-50N",
    status: "nominal",
  },
  {
    label: "Lateral Force",
    value: 38,
    unit: "N",
    target: "35-50N",
    status: "nominal",
  },
  {
    label: "Gap Balance",
    value: 1.2,
    unit: "mm",
    target: "<2mm",
    status: "nominal",
  },
  {
    label: "Cut Plane Deviation",
    value: 0.4,
    unit: "°",
    target: "<1°",
    status: "nominal",
  },
];

export default function SurgeryScene() {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <SceneWrapper id="surgery" className="bg-cartan-navy/30">
      <div className="max-w-6xl mx-auto w-full">
        <motion.p
          className="text-cartan-teal text-sm tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Intra-Operative
        </motion.p>

        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Smart Surgery
        </motion.h2>

        <motion.p
          className="text-cartan-white/60 text-lg mb-12 max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          AI agents track surgical state in real time, provide precise cutting guidance,
          dynamically update the plan with intraop data, and verify every step against prescribed thresholds.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Surgical Timeline */}
          <motion.div
            className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-6">
              Workflow Tracker
            </h3>

            <div className="space-y-0">
              {surgicalSteps.map((step, i) => (
                <motion.div
                  key={step.id}
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        step.status === "complete"
                          ? "bg-cartan-teal"
                          : step.status === "active"
                          ? "bg-cartan-teal animate-pulse ring-4 ring-cartan-teal/20"
                          : "bg-cartan-mid-navy"
                      }`}
                    />
                    {i < surgicalSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-full min-h-[40px] ${
                          step.status === "complete" ? "bg-cartan-teal/40" : "bg-cartan-mid-navy"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="pb-6">
                    <div
                      className={`text-sm font-medium ${
                        step.status === "active" ? "text-cartan-teal" : "text-cartan-white/70"
                      }`}
                    >
                      {step.label}
                      {step.status === "active" && (
                        <span className="ml-2 text-[10px] bg-cartan-teal/20 text-cartan-teal px-2 py-0.5 rounded-full">
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-cartan-gray-blue mt-1 leading-relaxed">
                      {step.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Center: Instrument Gauges */}
          <motion.div
            className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-6">
              Smart Instruments — Live
            </h3>

            <div className="space-y-5">
              {gauges.map((gauge, i) => (
                <motion.div
                  key={gauge.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-cartan-white/70">{gauge.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-cartan-teal">
                        {gauge.value}{gauge.unit}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                  </div>
                  <div className="h-2 bg-cartan-mid-navy rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cartan-teal to-emerald-400 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(gauge.value / 60) * 100}%` }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <div className="text-[10px] text-cartan-gray-blue mt-1">
                    Target: {gauge.target}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Dynamic plan update */}
            <motion.div
              className="mt-6 p-3 bg-cartan-teal/5 border border-cartan-teal/20 rounded-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-cartan-teal animate-pulse" />
                <span className="text-xs text-cartan-teal font-mono">PLAN UPDATED</span>
              </div>
              <p className="text-xs text-cartan-white/70 leading-relaxed">
                Intraop bone hardness measurement integrated. Confidence interval
                updated: 97.2% → 98.1% survivorship.
              </p>
            </motion.div>

            {/* Warning toggle */}
            <button
              onClick={() => setShowWarning(!showWarning)}
              className="mt-4 w-full text-xs text-cartan-gray-blue hover:text-amber-400 transition-colors py-2 border border-dashed border-cartan-mid-navy rounded-lg"
            >
              {showWarning ? "Hide" : "Simulate"} deviation warning →
            </button>

            {showWarning && (
              <motion.div
                className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-400">⚠️</span>
                  <span className="text-xs text-amber-400 font-mono">DEVIATION DETECTED</span>
                </div>
                <p className="text-xs text-cartan-white/70 leading-relaxed">
                  Prepared plane misaligned 1.8° from plan. Suggested: Re-cut with
                  0.5mm lateral adjustment to cutting jig.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Right: AI Agent */}
          <motion.div
            className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-6">
              AI Guidance
            </h3>

            <div className="space-y-4">
              <AgentMessage
                message="Step 3/6: Distal femoral cut. Adjust jig 1.2° external rotation based on intraop condylar measurements."
                delay={0.6}
              />
              <AgentMessage
                message="Gap measurement: Extension 18mm medial / 17mm lateral. Within BCR tolerance. Proceeding."
                delay={1.2}
              />
              <AgentMessage
                message="Recommend preserving 12mm tibial island width. ACL footprint confirmed intact."
                delay={1.8}
              />
            </div>

            {/* Conversion option */}
            <motion.div
              className="mt-6 p-4 bg-cartan-mid-navy/30 border border-cartan-mid-navy rounded-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-xs text-cartan-gray-blue mb-2">Seamless Conversion</div>
              <p className="text-xs text-cartan-white/60 leading-relaxed mb-3">
                If the surgeon decides to convert from BCR to CR or UC during the procedure,
                the AI instantly modifies the surgical plan for seamless transition.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-[10px] bg-cartan-teal/10 text-cartan-teal rounded border border-cartan-teal/20">
                  BCR → CR
                </span>
                <span className="px-2 py-1 text-[10px] bg-cartan-mid-navy/60 text-cartan-gray-blue rounded border border-cartan-mid-navy">
                  BCR → UC
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <ToolingBadge
          tools={["Real-time IMU Fusion", "Computer Vision", "NVIDIA Isaac", "Edge Inference", "Force Sensing"]}
          delay={0.8}
        />
      </div>
    </SceneWrapper>
  );
}
