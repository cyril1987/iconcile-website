"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import MagneticButton from "./animations/MagneticButton";
import { CharacterReveal } from "./animations/TextReveal";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" style={{ y: bgY }} />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" style={{ scale: orbScale }} />
      <motion.div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" style={{ scale: orbScale }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.1, type: "spring", stiffness: 200 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Start Your Transformation Today</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <CharacterReveal delay={0.2}>Ready to Transform Your</CharacterReveal>
            <br />
            <span className="gradient-text"><CharacterReveal delay={0.6}>Aviation Cost Management?</CharacterReveal></span>
          </h2>

          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.2 }} className="text-muted text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Join leading airlines worldwide who are saving millions with iConSuite. See the platform in action with a personalized demo.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton as="a" href="#contact" className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold text-lg hover:shadow-[0_0_50px_rgba(16,185,129,0.35)] transition-all duration-300">
              Book Your Free Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <MagneticButton as="a" href="#platform" className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-lg hover:bg-surface-light transition-colors">
              Explore Platform
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
