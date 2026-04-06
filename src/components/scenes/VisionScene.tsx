"use client";

import { motion } from "framer-motion";
import SceneWrapper from "../SceneWrapper";
import ToolingBadge from "../ToolingBadge";

const roadmap = [
  { year: "2029", product: "BCR Knee", status: "First product launch", active: true },
  { year: "2030", product: "CR & UC Knee", status: "Platform expansion", active: false },
  { year: "2032+", product: "THA · TSA · TAA", status: "Multi-joint platform", active: false },
];

const networkStats = [
  { value: "1 twin", label: "Per patient, before surgery" },
  { value: "50yr", label: "Simulated per patient" },
  { value: "98.1%", label: "Predicted survivorship" },
  { value: "∞", label: "Continuous learning" },
];

export default function VisionScene() {
  return (
    <SceneWrapper id="vision" className="bg-cartan-navy/30">
      <div className="max-w-6xl mx-auto w-full">
        <motion.p
          className="text-cartan-teal text-sm tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          The Vision
        </motion.p>

        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Every procedure makes every
          <br />
          <span className="text-cartan-teal">future procedure better.</span>
        </motion.h2>

        <motion.p
          className="text-cartan-white/60 text-lg mb-16 max-w-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Each case generates pre-, intra-, and post-operative data that flows back into the AI stack.
          De-identified and aggregated, this data continuously improves predictions, surgical plans,
          and patient outcomes — creating a compounding advantage that deepens with every surgery.
        </motion.p>

        {/* Network effect visualization */}
        <motion.div
          className="bg-cartan-dark/60 border border-cartan-mid-navy rounded-2xl p-8 md:p-12 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Animated network nodes */}
          <div className="relative h-48 mb-8 overflow-hidden">
            {Array.from({ length: 24 }, (_, i) => {
              const x = 10 + (i % 8) * 12;
              const y = 15 + Math.floor(i / 8) * 30;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    i < 16 ? "bg-cartan-teal/60" : "bg-cartan-teal/30"
                  }`} />
                  {/* Connection lines */}
                  {i > 0 && i % 8 !== 0 && (
                    <div
                      className="absolute top-1.5 right-3 w-[calc(12vw-12px)] h-px bg-cartan-teal/10"
                    />
                  )}
                </motion.div>
              );
            })}

            {/* Central label */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-cartan-dark/80 backdrop-blur-sm border border-cartan-teal/30 rounded-xl px-6 py-4 text-center">
                <div className="text-cartan-teal font-mono text-sm mb-1">Surgical AI Stack</div>
                <div className="text-xs text-cartan-gray-blue">Thousands of digital twins, one intelligence</div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {networkStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl md:text-3xl font-bold font-mono text-cartan-teal mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-cartan-gray-blue">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Product Roadmap */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-sm text-cartan-teal font-mono uppercase tracking-wider mb-8">
            Product Roadmap
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            {roadmap.map((item, i) => (
              <motion.div
                key={item.year}
                className={`flex-1 rounded-xl p-6 border ${
                  item.active
                    ? "bg-cartan-teal/5 border-cartan-teal/30"
                    : "bg-cartan-dark/40 border-cartan-mid-navy"
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="text-xs text-cartan-gray-blue mb-1">{item.year}</div>
                <div className={`text-lg font-semibold mb-2 ${item.active ? "text-cartan-teal" : "text-cartan-white/60"}`}>
                  {item.product}
                </div>
                <div className="text-xs text-cartan-gray-blue">{item.status}</div>
                {i < roadmap.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-cartan-mid-navy">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Manifesto + CTA */}
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-4">
            This is what <span className="text-cartan-teal">AI-native</span> means.
          </p>
          <p className="text-lg text-cartan-white/60 mb-12">
            Not AI-assisted. Not AI-enabled. The implant, the instruments, and the intelligence
            are co-designed from the ground up — each making the others better.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:jonathan.trousdale@cartan.io"
              className="px-8 py-3 bg-cartan-teal text-cartan-dark font-semibold rounded-full hover:bg-cartan-teal/90 transition-all"
            >
              Get in Touch
            </a>
            <a
              href="https://www.linkedin.com/company/cartanai/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-cartan-teal/10 border border-cartan-teal/30 text-cartan-teal rounded-full hover:bg-cartan-teal/20 transition-all"
            >
              Follow Us
            </a>
          </div>
        </motion.div>

        <ToolingBadge
          tools={["NVIDIA PhysicsNeMo", "PINNs", "NVIDIA Cosmos", "MONAI", "Federated Learning", "JAX", "Edge AI"]}
          delay={1.0}
        />

        {/* Footer */}
        <motion.footer
          className="mt-24 pt-8 border-t border-cartan-mid-navy/30 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-xs text-cartan-gray-blue">
            © {new Date().getFullYear()} Cartan Medical. All rights reserved.
          </p>
          <p className="text-[10px] text-cartan-gray-blue/60 mt-2">
            This is a technology demonstration. Not a medical device or clinical tool.
          </p>
        </motion.footer>
      </div>
    </SceneWrapper>
  );
}
