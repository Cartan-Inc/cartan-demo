"use client";

import { motion } from "framer-motion";
import Image from "next/image";


export default function HeroScene() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/banner-1920x1080-new.png"
          alt=""
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cartan-dark/60 via-cartan-dark/40 to-cartan-dark" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image
            src="/logo-3k-name-white.png"
            alt="Cartan"
            width={300}
            height={80}
            className="mx-auto mb-6 h-16 md:h-20 w-auto"
            priority
          />
        </motion.div>

        <motion.p
          className="text-cartan-teal text-lg md:text-xl tracking-[0.3em] uppercase mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          AI-Native Arthroplasty
        </motion.p>

        <motion.p
          className="text-cartan-white/80 text-lg md:text-2xl leading-relaxed max-w-2xl mx-auto mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Every year, over 1 million Americans receive a knee replacement.
        </motion.p>

        <motion.p
          className="text-cartan-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Nearly all of them lose their ACL — the ligament that makes a knee feel like a knee.
          <br />
          <span className="text-cartan-teal">We&apos;re changing that.</span>
        </motion.p>

        <motion.a
          href="#problem"
          className="inline-flex items-center gap-2 px-8 py-3 bg-cartan-teal/10 border border-cartan-teal/30 text-cartan-teal rounded-full hover:bg-cartan-teal/20 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          See How It Works
          <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="w-5 h-8 border-2 border-cartan-gray-blue/40 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 bg-cartan-teal/60 rounded-full mt-1.5"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
