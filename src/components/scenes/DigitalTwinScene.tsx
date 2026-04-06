"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import SceneWrapper from "../SceneWrapper";
import AgentMessage from "../AgentMessage";
import ToolingBadge from "../ToolingBadge";

const DigitalTwinAssembly = dynamic(() => import("../DigitalTwinAssembly"), { ssr: false });

// Real specimen data from DU01
const patientData = [
  { label: "Specimen", value: "John Doe" },
  { label: "Sex", value: "Male" },
  { label: "Body Part", value: "Lower Extremity" },
  { label: "Ligament Status", value: "Intact (ACL/PCL)" },
  { label: "ROM (measured)", value: "14.7° — 137.5°" },
  { label: "Quad Force Range", value: "84.5 — 632.6 N" },
];

const imagingSources = [
  {
    id: "ct",
    label: "CT Scan (0.6mm)",
    status: "251 slices · segmented",
    detail: "Siemens Sensation 64 · 120 kVP · 512×512 · 0.39mm pixel spacing · 0.6mm slice thickness · B31s kernel",
    preview: "/models/ct_slice.png",
    previewLabel: "Axial CT — Slice 125/251",
  },
  {
    id: "mri",
    label: "MRI (WB Sagittal)",
    status: "192 slices · segmented",
    detail: "Siemens Avanto 1.5T · t2_trufi3d · 320×320 · 0.53mm pixel spacing · 0.6mm slice thickness",
    preview: "/models/sag_slice.png",
    previewLabel: "Sagittal MRI — Slice 96/192",
  },
  {
    id: "recon",
    label: "3D Reconstruction",
    status: "7 meshes · 16 point clouds",
    detail: "Probed surfaces: Femur, Tibia, Fibula, Patella (bone + cartilage) · ACL/PCL/MCL/LCL attachment sites",
    preview: null,
    previewLabel: null,
  },
  {
    id: "kin",
    label: "Kinematics & Laxity",
    status: "9,101 data points",
    detail: "Intact knee extension (101 pts) · AP/IE/VV laxity testing (9,000 pts) · Tibiofemoral + patellofemoral 6-DOF",
    preview: null,
    previewLabel: null,
  },
];

export default function DigitalTwinScene() {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

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
          {/* Left: Patient Data + Imaging Pipeline */}
          <motion.div
            className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-xl p-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-4">
              Specimen Data
            </h3>
            <div className="space-y-2.5">
              {patientData.map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-xs text-cartan-gray-blue">{item.label}</span>
                  <span className="text-xs font-mono text-cartan-white/90">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-cartan-mid-navy">
              <h4 className="text-xs text-cartan-teal font-mono uppercase tracking-wider mb-3">
                Imaging Pipeline
              </h4>
              <div className="space-y-2">
                {imagingSources.map((src, i) => (
                  <motion.div
                    key={src.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <button
                      onClick={() => setExpandedSource(expandedSource === src.id ? null : src.id)}
                      className={`w-full text-left rounded-lg px-3 py-2.5 transition-all border ${
                        expandedSource === src.id
                          ? "bg-cartan-teal/10 border-cartan-teal/30"
                          : "bg-cartan-mid-navy/30 border-cartan-mid-navy/50 hover:border-cartan-teal/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-cartan-white/80">{src.label}</span>
                        <span className="text-[10px] font-mono text-cartan-teal">
                          ✓ {src.status.split("·")[0].trim()}
                        </span>
                      </div>
                      <div className="text-[10px] text-cartan-gray-blue mt-0.5">
                        {src.status}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedSource === src.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 py-2 mt-1 bg-cartan-dark/80 rounded-lg border border-cartan-mid-navy/30">
                            <p className="text-[10px] text-cartan-white/60 leading-relaxed mb-2">
                              {src.detail}
                            </p>
                            {src.preview && (
                              <div className="relative rounded overflow-hidden border border-cartan-mid-navy/40">
                                <Image
                                  src={src.preview}
                                  alt={src.previewLabel || ""}
                                  width={300}
                                  height={300}
                                  className="w-full h-auto opacity-80"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cartan-dark/90 to-transparent px-2 py-1.5">
                                  <span className="text-[9px] font-mono text-cartan-teal/80">
                                    {src.previewLabel}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                message="Ingesting 251 CT slices (0.6mm) + 192 MRI slices (1.5T sagittal). Running MONAI segmentation pipeline…"
                delay={0.6}
              />
              <AgentMessage
                message="Segmentation complete. 7 anatomical structures meshed (femur, tibia, fibula, patella × bone + cartilage). ACL/PCL intact — specimen is BCR-eligible."
                delay={1.6}
              />
              <AgentMessage
                message="Calibrating four-bar linkage from 16 probed attachment sites. Integrating 9,101 kinematics data points (extension + laxity). Digital twin ready for simulation."
                delay={2.6}
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
                { label: "Imaging slices", value: "443" },
                { label: "Mesh triangles", value: "52,704" },
                { label: "Attachment sites", value: "16" },
                { label: "Kinematic data pts", value: "9,101" },
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
