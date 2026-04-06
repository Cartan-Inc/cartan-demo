"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const scenes = [
  { id: "hero", label: "Home" },
  { id: "problem", label: "The Problem" },
  { id: "digital-twin", label: "Digital Twin" },
  { id: "simulation", label: "Simulation" },
  { id: "surgery", label: "Surgery" },
  { id: "postop", label: "Post-Op" },
  { id: "vision", label: "Vision" },
];

export default function Navigation() {
  const [activeScene, setActiveScene] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = scenes.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return { id: s.id, top: 0 };
        return { id: s.id, top: el.getBoundingClientRect().top };
      });

      const current = sections.reduce((closest, section) => {
        return Math.abs(section.top) < Math.abs(closest.top) ? section : closest;
      });

      setActiveScene(current.id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cartan-dark/90 backdrop-blur-md border-b border-cartan-mid-navy/50" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3">
          <Image
            src="/logo-2k-white.png"
            alt="Cartan"
            width={120}
            height={32}
            className="h-6 w-auto"
          />
        </a>

        <div className="hidden md:flex items-center gap-1">
          {scenes.slice(1).map((scene) => (
            <a
              key={scene.id}
              href={`#${scene.id}`}
              className={`px-3 py-1.5 text-xs tracking-wide rounded-full transition-all duration-300 ${
                activeScene === scene.id
                  ? "text-cartan-teal bg-cartan-teal/10"
                  : "text-cartan-gray-blue hover:text-cartan-white"
              }`}
            >
              {scene.label}
            </a>
          ))}
        </div>

        {/* Progress dots for mobile */}
        <div className="flex md:hidden items-center gap-1.5">
          {scenes.map((scene) => (
            <a
              key={scene.id}
              href={`#${scene.id}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeScene === scene.id
                  ? "bg-cartan-teal scale-125"
                  : "bg-cartan-mid-navy"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
