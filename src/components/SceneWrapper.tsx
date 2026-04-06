"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SceneWrapperProps {
  children: ReactNode;
  id: string;
  className?: string;
}

export default function SceneWrapper({ children, id, className = "" }: SceneWrapperProps) {
  return (
    <motion.section
      id={id}
      className={`min-h-screen relative flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.section>
  );
}
