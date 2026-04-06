"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SceneWrapper from "../SceneWrapper";
import AgentMessage from "../AgentMessage";
import ToolingBadge from "../ToolingBadge";

const DigitalTwinAssembly = dynamic(() => import("../DigitalTwinAssembly"), { ssr: false });

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
              <h4 className="text-xs text-cartan-gray-blue mb-3">Imaging Pipeline</h4>
              <div className="space-y-2">
                {[
                  { label: "Weight-Bearing X-Ray", status: "Processed", icon: "✓" },
                  { label: "MRI (3T Sagittal)", status: "Segmented", icon: "✓" },
                  { label: "CT Scan", status: "Meshed", icon: "✓" },
                  { label: "Video Gait Analysis", status: "Analyzed", icon: "✓" },
                ].map((img, i) => (
                  <motion.div
                    key={img.label}
                    className="flex items-center justify-between bg-cartan-mid-navy/30 border border-cartan-mid-navy/50 rounded-lg px-3 py-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-xs text-cartan-white/70">{img.label}</span>
                    <span className="text-[10px] font-mono text-cartan-teal">{img.icon} {img.status}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Segmentation confidence */}
            <motion.div
              className="mt-4 p-3 bg-cartan-teal/5 border border-cartan-teal/15 rounded-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-cartan-gray-blue">BCR Eligibility</span>
                <span className="text-xs font-mono text-cartan-teal">94.2%</span>
              </div>
              <div className="h-1.5 bg-cartan-mid-navy rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cartan-teal rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "94.2%" }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Center: Twin Assembly Visualization */}
          <motion.div
            className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <DigitalTwinAssembly />
          </motion.div>

          {/* Right: AI Agent Sidebar */}
          <motion.div
            className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6 flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-4">
              AI Agent
            </h3>

            <div className="space-y-4 flex-1">
              <AgentMessage
                message="Segmentation complete. Kellgren-Lawrence Grade III confirmed. ACL/PCL intact on MRI — patient is BCR-eligible."
                delay={0.8}
              />
              <AgentMessage
                message="Four-bar linkage model calibrated. ACL tension: 142N, PCL: 118N. Estimating stress-strain curves from laximetry data…"
                delay={1.8}
              />
              <AgentMessage
                message="Implant sizing: Femoral 4 / Tibial 3. Medial tibial slope: 5°. Confidence: 94.2%. Digital twin ready for simulation."
                delay={2.8}
              />
            </div>

            {/* Processing summary */}
            <motion.div
              className="mt-4 pt-4 border-t border-cartan-mid-navy space-y-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-[10px] text-cartan-gray-blue uppercase tracking-wider mb-2">Processing Summary</div>
              {[
                { label: "Imaging sources", value: "4" },
                { label: "Mesh elements", value: "284,192" },
                { label: "Parameters estimated", value: "47" },
                { label: "Processing time", value: "2.4 min" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-[10px] text-cartan-gray-blue">{item.label}</span>
                  <span className="text-[11px] font-mono text-cartan-white/70">{item.value}</span>
                </div>
              ))}
            </motion.div>
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
