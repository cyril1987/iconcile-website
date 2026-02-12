"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function GlitchText({
  children,
  className = "",
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

  useEffect(() => {
    const timer = setTimeout(() => {
      let iteration = 0;
      const target = children;
      const interval = setInterval(() => {
        setDisplayText(
          target
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i < iteration) return char;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        iteration += 1 / 2;
        if (iteration >= target.length) {
          clearInterval(interval);
          setDisplayText(target);
          setRevealed(true);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [children, delay]);

  // Periodic mini-glitch after reveal
  useEffect(() => {
    if (!revealed) return;
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      }
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, [revealed]);

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.1 }}
    >
      <span className={isGlitching ? "hero-glitch" : ""}>{displayText}</span>
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 hero-glitch-r"
            aria-hidden
          >
            {displayText}
          </span>
          <span
            className="absolute top-0 left-0 hero-glitch-b"
            aria-hidden
          >
            {displayText}
          </span>
        </>
      )}
    </motion.span>
  );
}
