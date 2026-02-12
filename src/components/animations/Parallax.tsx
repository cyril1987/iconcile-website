"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Parallax({
  children,
  speed = 0.5,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = 100 * speed;

  const up = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const down = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const left = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const right = useTransform(scrollYProgress, [0, 1], [-range, range]);

  const transforms = { up, down, left, right };
  const isVertical = direction === "up" || direction === "down";

  return (
    <div ref={ref} className={`overflow-visible ${className}`}>
      <motion.div
        style={isVertical ? { y: transforms[direction] } : { x: transforms[direction] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function ParallaxLayer({
  children,
  offset = 0.3,
  className = "",
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset * 200, -offset * 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
