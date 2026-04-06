"use client";

import { motion } from "framer-motion";
import SceneWrapper from "../SceneWrapper";
import AgentMessage from "../AgentMessage";
import ToolingBadge from "../ToolingBadge";

const timelinePoints = [
  { time: "2 weeks", fjs: 42, rom: "5°–95°", status: "Early recovery" },
  { time: "6 weeks", fjs: 58, rom: "2°–108°", status: "PT progression" },
  { time: "3 months", fjs: 71, rom: "0°–118°", status: "Return to activity" },
  { time: "6 months", fjs: 82, rom: "0°–125°", status: "Near full recovery" },
  { time: "1 year", fjs: 89, rom: "0°–130°", status: "Optimal" },
  { time: "2 years", fjs: 93, rom: "0°–132°", status: "Steady state" },
];

export default function PostOpScene() {
  return (
    <SceneWrapper id="postop">
      <div className="max-w-6xl mx-auto w-full">
        <motion.p
          className="text-cartan-teal text-sm tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Post-Operative
        </motion.p>

        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
        >
          The Learning Loop
        </motion.h2>

        <motion.p
          className="text-cartan-white/60 text-lg mb-12 max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          After surgery, AI agents are designed to continue working — collecting outcomes,
          monitoring for complications, generating PT protocols, and feeding real-world
          data back into the digital twin.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Recovery Timeline */}
          <motion.div
            className="md:col-span-2 bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-6">
              Patient Recovery Timeline
            </h3>

            {/* FJS-12 Score Chart */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-cartan-gray-blue">Forgotten Joint Score (FJS-12)</span>
                <span className="text-xs text-cartan-gray-blue">Higher = better (max 100)</span>
              </div>
              <div className="flex items-end gap-1 md:gap-2 h-32 md:h-40">
                {timelinePoints.map((point, i) => (
                  <motion.div
                    key={point.time}
                    className="flex-1 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-xs font-mono text-cartan-teal">{point.fjs}</span>
                    <motion.div
                      className="w-full bg-gradient-to-t from-cartan-teal/40 to-cartan-teal rounded-t"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(point.fjs / 100) * 120}px` }}
                      transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                      viewport={{ once: true }}
                    />
                    <span className="text-[10px] text-cartan-gray-blue whitespace-nowrap">{point.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ROM Progress */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-6">
              {timelinePoints.map((point, i) => (
                <motion.div
                  key={point.time}
                  className="bg-cartan-navy/40 rounded-lg p-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="text-[10px] text-cartan-gray-blue mb-1">{point.time}</div>
                  <div className="text-sm font-mono text-cartan-white/80">{point.rom}</div>
                  <div className="text-[10px] text-cartan-teal/80 mt-1">{point.status}</div>
                </motion.div>
              ))}
            </div>

            {/* Predicted vs Actual */}
            <motion.div
              className="bg-cartan-teal/5 border border-cartan-teal/20 rounded-lg p-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-cartan-teal text-sm">📊</span>
                <span className="text-xs text-cartan-teal font-mono">DIGITAL TWIN FEEDBACK</span>
              </div>
              <p className="text-xs text-cartan-white/70 leading-relaxed">
                Post-op data feeds back into the digital twin, enabling comparison between
                simulated and actual outcomes.
                <span className="text-cartan-teal"> Designed to improve with each case.</span>
              </p>
              <p className="text-[9px] text-cartan-gray-blue/50 mt-1 italic">
                Illustrative data shown for demonstration purposes
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Agent Actions */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Complication Monitoring */}
            <div className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6">
              <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-4">
                Complication Monitor
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Aseptic Loosening", risk: 1.2, threshold: 5 },
                  { label: "Infection", risk: 0.8, threshold: 3 },
                  { label: "Tibial Island Fracture", risk: 0.3, threshold: 2 },
                  { label: "Instability", risk: 0.5, threshold: 4 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-cartan-white/60">{item.label}</span>
                      <span className="text-xs font-mono text-green-400">{item.risk}%</span>
                    </div>
                    <div className="h-1 bg-cartan-mid-navy rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400/60 rounded-full"
                        style={{ width: `${(item.risk / item.threshold) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-cartan-gray-blue mt-3">All risks below threshold. No intervention needed.</p>
            </div>

            {/* AI Agent */}
            <div className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6">
              <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-4">
                AI Agent
              </h3>
              <div className="space-y-3">
                <AgentMessage
                  message="PT protocol generated: Phase 2 progression. Focus on closed-chain quad strengthening. ROM target: 0°–120° by week 8."
                  delay={1.0}
                  typing={false}
                />
                <AgentMessage
                  message="Patient reported FJS-12: 82 at 6 months. Tracking above 75th percentile for BCR cohort."
                  delay={1.4}
                  typing={false}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <ToolingBadge
          tools={["Longitudinal PRO Collection", "HIPAA-Compliant Pipeline", "Federated Learning", "Bayesian Updating"]}
          delay={0.8}
        />
      </div>
    </SceneWrapper>
  );
}
