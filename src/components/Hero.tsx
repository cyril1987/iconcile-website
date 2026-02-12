"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Send, Globe } from "lucide-react";
import HeroCanvas from "./animations/HeroCanvas";
import HeroIntro from "./animations/HeroIntro";
import { SplitText } from "./animations/TextReveal";
import AnimatedCounter from "./animations/AnimatedCounter";
import MagneticButton from "./animations/MagneticButton";

function TypewriterCycle({ words, delay = 3 }: { words: string[]; delay?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, delay * 1000);
    return () => clearInterval(timer);
  }, [words, delay]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[index]}
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="inline-block gradient-text"
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const [introComplete, setIntroComplete] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.35], [1, 0.95]);
  const blurAmount = useTransform(scrollYProgress, [0, 0.35], [0, 8]);
  const filterStr = useTransform(blurAmount, (v) => `blur(${v}px)`);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Globe canvas — starts hidden, fades in when intro completes */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={introComplete ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <HeroCanvas />
      </motion.div>

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }} />

      {/* Cinematic intro animation overlay */}
      <AnimatePresence>
        {!introComplete && (
          <motion.div
            className="absolute inset-0 z-30"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroIntro onComplete={() => setIntroComplete(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content — animates in after intro */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full"
        style={{ y: textY, opacity, scale, filter: filterStr }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/15 bg-primary/[0.03] backdrop-blur-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs sm:text-sm text-primary/70 font-medium tracking-wide">
              Trusted by airlines across 6 continents
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] mb-4 tracking-tight"
          >
            <span className="block text-foreground">Elevating Aviation</span>
            <span className="block mt-1 h-[1.15em]">
              {introComplete && (
                <TypewriterCycle
                  words={["Cost Intelligence", "Route Profitability", "Invoice Automation", "Financial Analytics"]}
                  delay={3}
                />
              )}
            </span>
          </motion.h1>

          {/* Decorative divider */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={introComplete ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/30" />
            <Send className="w-4 h-4 text-primary/40" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/30" />
          </motion.div>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-base sm:text-lg md:text-xl text-muted/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {introComplete && (
              <SplitText delay={1.2}>
                The iConSuite platform transforms airline cost management — from invoice verification to route profitability, powered by intelligent automation.
              </SplitText>
            )}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              as="a"
              href="#contact"
              className="group relative flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold text-base sm:text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]"
            >
              <span className="relative z-10">Book a Demo</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#platform"
              className="group flex items-center gap-2.5 px-8 py-4 rounded-xl border border-border/50 text-foreground font-semibold text-base sm:text-lg hover:bg-surface/50 hover:border-primary/20 backdrop-blur-sm transition-all duration-300"
            >
              <Globe className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
              Explore iConSuite
            </MagneticButton>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-1"
          >
            {[
              { value: 99, suffix: "%", label: "Overbilling Detection" },
              { value: 2000, suffix: "+", label: "Airport & ATC Contracts" },
              { value: 100, suffix: "%", label: "SIS Compliant" },
              { value: 95, suffix: "%", label: "No-Touch Processing" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={introComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.9 + i * 0.1 }}
                className="relative text-center group py-5 px-3"
              >
                {/* Subtle separator between stats */}
                {i > 0 && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border/30 hidden md:block" />
                )}
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono gradient-text mb-1">
                  {introComplete && (
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                  )}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-muted/60 tracking-wider uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : {}}
        transition={{ delay: 2.5 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-5 h-8 border border-primary/15 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-0.5 h-1.5 rounded-full bg-primary/50"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
