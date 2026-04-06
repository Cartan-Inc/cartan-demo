"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AgentMessageProps {
  message: string;
  delay?: number;
  typing?: boolean;
}

export default function AgentMessage({ message, delay = 0, typing = true }: AgentMessageProps) {
  const [showMessage, setShowMessage] = useState(!typing);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!typing) {
      setDisplayText(message);
      return;
    }

    const startTimer = setTimeout(() => {
      setShowMessage(true);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayText(message.slice(0, i));
        if (i >= message.length) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startTimer);
  }, [message, delay, typing]);

  return (
    <motion.div
      className="flex items-start gap-3 max-w-md"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="w-8 h-8 rounded-full bg-cartan-teal/20 border border-cartan-teal/40 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-cartan-teal text-xs font-mono">AI</span>
      </div>
      <div className="bg-cartan-mid-navy/60 border border-cartan-teal/10 rounded-lg rounded-tl-none px-4 py-3">
        <p className="text-sm text-cartan-white/90 font-mono leading-relaxed">
          {showMessage ? displayText : (
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 bg-cartan-teal rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-cartan-teal rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-cartan-teal rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          )}
          {showMessage && displayText.length < message.length && (
            <span className="inline-block w-0.5 h-4 bg-cartan-teal ml-0.5 animate-pulse" />
          )}
        </p>
      </div>
    </motion.div>
  );
}
