"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SceneWrapper from "../SceneWrapper";
import AgentMessage from "../AgentMessage";
import ToolingBadge from "../ToolingBadge";

const KneeModel = dynamic(() => import("../KneeModel"), { ssr: false });

const twinLayers = [
  { label: "Bone Geometry", color: "bg-cartan-white/20", icon: "🦴", delay: 0.3 },
  { label: "Ligaments (ACL/PCL/MCL/LCL)", color: "bg-cartan-teal/30", icon: "🔗", delay: 0.6 },
  { label: "Articular Capsule", color: "bg-cartan-light-blue/20", icon: "🫧", delay: 0.9 },
  { label: "Quadricep & Patella Tracking", color: "bg-amber-500/20", icon: "💪", delay: 1.2 },
];

const patientData = [
  { label: "Age", value: "62" },
  { label: "BMI", value: "28.4" },
  { label: "Activity Level", value: "Moderate" },
  { label: "Deformity", value: "Varus 4°" },
  { label: "Bone Quality", value: "T-score: -1.2" },
  { label: "ROM", value: "5° — 118°" },
];

export default function DigitalTwinScene() {
  return (
    <SceneWrapper id="digital-twin" className="bg-cartan-navy/30">
      <div className="max-w-6xl mx-auto w-full">
        <motion.p
          className="text-cartan-teal text-sm tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Pre-Operative — Step 1
        </motion.p>

        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Build the Digital Twin
        </motion.h2>

        <motion.p
          className="text-cartan-white/60 text-lg mb-12 max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          AI agents ingest patient imaging and kinematic data to construct a physics-based
          digital twin — a complete biomechanical model of the patient&apos;s knee.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Patient Intake */}
          <motion.div
            className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-4">
              Patient Profile
            </h3>
            <div className="space-y-3">
              {patientData.map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-xs text-cartan-gray-blue">{item.label}</span>
                  <span className="text-sm font-mono text-cartan-white/90">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-cartan-mid-navy">
              <h4 className="text-xs text-cartan-gray-blue mb-3">Imaging</h4>
              <div className="grid grid-cols-2 gap-2">
                {["WB X-Ray", "MRI", "CT Scan", "Gait Analysis"].map((img, i) => (
                  <motion.div
                    key={img}
                    className="bg-cartan-mid-navy/40 border border-cartan-mid-navy rounded-lg px-3 py-2 text-xs text-cartan-white/70 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-cartan-teal">✓</span> {img}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center: Twin Assembly Visualization */}
          <motion.div
            className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6 flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-4">
              Digital Twin Assembly
            </h3>

            {/* 3D Knee Model */}
            <div className="flex-1 flex flex-col justify-center">
              <motion.div
                className="relative mx-auto w-full h-56"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <KneeModel showLigaments={true} showImplant={false} autoRotate={true} />
              </motion.div>

              {/* Layer labels */}
              <div className="mt-4 space-y-2">
                {twinLayers.map((layer) => (
                  <motion.div
                    key={layer.label}
                    className="flex items-center gap-2 text-xs"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: layer.delay + 0.6, duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className={`w-3 h-3 rounded-sm ${layer.color} border border-cartan-white/10`} />
                    <span className="text-cartan-white/70">{layer.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: AI Agent Sidebar */}
          <motion.div
            className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-4">
              AI Agent
            </h3>

            <div className="space-y-4">
              <AgentMessage
                message="Segmentation complete. Patient classified as BCR-eligible (Kellgren-Lawrence Grade III, intact ACL/PCL confirmed on MRI)."
                delay={0.8}
              />
              <AgentMessage
                message="Digital twin constructed. Four-bar linkage model of ACL/PCL calibrated. Estimating ligament stress-strain curves..."
                delay={1.4}
              />
              <AgentMessage
                message="Recommending Size 4 femoral / Size 3 tibial. Confidence: 94.2%. Requesting radiological laximetry to improve estimate."
                delay={2.0}
              />
            </div>
          </motion.div>
        </div>

        <ToolingBadge
          tools={["NVIDIA Cosmos", "MONAI", "PINNs", "EHR/FHIR Integration", "DICOM Pipeline"]}
          delay={1.0}
        />
      </div>
    </SceneWrapper>
  );
}
