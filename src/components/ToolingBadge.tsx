"use client";

import { motion } from "framer-motion";

interface ToolingBadgeProps {
  tools: string[];
  delay?: number;
}

export default function ToolingBadge({ tools, delay = 0 }: ToolingBadgeProps) {
  return (
    <motion.div
      className="flex flex-wrap gap-2 mt-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <span className="text-xs text-cartan-gray-blue uppercase tracking-wider mr-2 self-center">
        Powered by
      </span>
      {tools.map((tool) => (
        <span
          key={tool}
          className="px-3 py-1 text-xs font-mono bg-cartan-mid-navy/60 text-cartan-teal border border-cartan-teal/20 rounded-full"
        >
          {tool}
        </span>
      ))}
    </motion.div>
  );
}
