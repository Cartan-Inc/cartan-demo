"use client";

import { motion } from "framer-motion";
import SceneWrapper from "../SceneWrapper";

const stats = [
  { value: "1M+", label: "TKA procedures per year in the US" },
  { value: "20-25%", label: "of patients are candidates for BCR" },
  { value: "<1%", label: "of TKA cases actually receive BCR" },
  { value: "65%", label: "of surgeons willing to consider BCR" },
];

export default function ProblemScene() {
  return (
    <SceneWrapper id="problem">
      <div className="max-w-6xl mx-auto w-full">
        <motion.p
          className="text-cartan-teal text-sm tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          The Problem
        </motion.p>

        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
        >
          The best knee replacement exists.
          <br />
          <span className="text-cartan-gray-blue">Almost no one gets it.</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left: Explanation */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-cartan-white/80 text-lg leading-relaxed">
              A <strong className="text-cartan-teal">Bicruciate-Retaining (BCR)</strong> knee replacement
              preserves both the ACL and PCL — giving patients the most stable, natural-feeling knee possible.
            </p>
            <p className="text-cartan-white/60 leading-relaxed">
              But BCR is significantly more complex than conventional TKA. Surgeons must navigate tighter
              anatomical constraints, perform hybrid measured-resection and gap-balancing techniques, and
              commit to tibial rotation earlier in the procedure. A poorly balanced BCR risks manipulation
              under anesthesia, poor satisfaction, and early revision.
            </p>
            <p className="text-cartan-white/60 leading-relaxed">
              Over thousands of cases, expert surgeons develop an intuition for BCR. But the vast majority
              of orthopedic surgeons will never perform enough BCR procedures to reach that level.
            </p>

            {/* Surgeon quote */}
            <motion.blockquote
              className="border-l-2 border-cartan-teal/40 pl-4 py-2 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-cartan-white/70 italic text-sm leading-relaxed">
                &ldquo;What one must understand is that any releases done in extension,
                on either the medial or lateral side of the knee, can have an unpredictable
                effect on the flexion space.&rdquo;
              </p>
              <p className="text-cartan-white/50 text-xs mt-1">— Orthopedic surgeon on the challenge of soft-tissue balancing in TKA</p>
            </motion.blockquote>
          </motion.div>

          {/* Right: Conventional vs BCR comparison */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Conventional TKA */}
            <div className="bg-cartan-navy/60 border border-cartan-mid-navy rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <h3 className="text-lg font-semibold text-cartan-white/80">Conventional TKA</h3>
              </div>
              <ul className="space-y-2 text-sm text-cartan-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✕</span>
                  ACL sacrificed in nearly all procedures
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✕</span>
                  PCL sacrificed in ~50% of procedures
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✕</span>
                  Forced choice between measured resection or gap balancing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✕</span>
                  ~20% patient dissatisfaction rate
                </li>
              </ul>
            </div>

            {/* BCR with Cartan */}
            <div className="bg-cartan-teal/5 border border-cartan-teal/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-cartan-teal" />
                <h3 className="text-lg font-semibold text-cartan-white">BCR with Cartan</h3>
              </div>
              <ul className="space-y-2 text-sm text-cartan-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-cartan-teal mt-0.5">✓</span>
                  Both ACL and PCL preserved
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cartan-teal mt-0.5">✓</span>
                  AI-guided hybrid technique adapts to each patient
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cartan-teal mt-0.5">✓</span>
                  Smart instruments provide real-time feedback
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cartan-teal mt-0.5">✓</span>
                  Expert-level outcomes accessible to every surgeon
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-cartan-teal mb-2">{stat.value}</div>
              <div className="text-xs text-cartan-gray-blue leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Transition */}
        <motion.p
          className="text-center text-xl md:text-2xl text-cartan-white/80 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
        >
          What if every surgeon could perform BCR{" "}
          <span className="text-cartan-teal">like an expert?</span>
        </motion.p>
      </div>
    </SceneWrapper>
  );
}
