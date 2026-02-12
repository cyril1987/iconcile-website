"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Smartphone, FileText, BarChart, Plug, Clock, CheckCircle2 } from "lucide-react";
import { RevealText } from "./animations/TextReveal";
import TiltCard from "./animations/TiltCard";
import MagneticButton from "./animations/MagneticButton";

const features = [
  { icon: FileText, title: "AR Automation", description: "Automate accounts receivable with intelligent billing workflows." },
  { icon: Clock, title: "Real-Time Service Tracking", description: "Monitor ground operations in real-time with live dashboards." },
  { icon: Smartphone, title: "Mobile Application", description: "Digital service forms and field operations via AeroSync mobile app." },
  { icon: BarChart, title: "Outward Billing", description: "Generate accurate customer invoices with contract-based pricing." },
  { icon: Plug, title: "ERP Integration", description: "Seamless connectivity with SAP, Oracle, and other enterprise systems." },
  { icon: CheckCircle2, title: "SLA Management", description: "Track and enforce service level agreements across all operations." },
];

export default function GroundHandling() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const leftX = useTransform(scrollYProgress, [0, 0.5, 1], [-60, 0, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section id="ground-handling" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div ref={ref} style={{ x: leftX, opacity: leftOpacity }}>
            <RevealText><span className="text-primary text-sm font-semibold tracking-wider uppercase">Ground Handling</span></RevealText>
            <RevealText delay={0.1}><h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">Optimize Ground <span className="gradient-text">Operations</span></h2></RevealText>
            <RevealText delay={0.2}><p className="text-muted text-lg leading-relaxed mb-8">Streamline every aspect of ground handling — from customer contracts and service tracking to billing and SLA management — with purpose-built tools for ground handlers.</p></RevealText>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-4">
              <MagneticButton as="a" href="#contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all duration-300">
                Request Demo
              </MagneticButton>
              <MagneticButton as="a" href="#solutions" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-surface-light transition-colors">
                View All Solutions
              </MagneticButton>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <TiltCard>
                  <div className="group p-5 bg-surface border border-border rounded-xl hover:border-primary/20 transition-all duration-300">
                    <motion.div whileHover={{ scale: 1.2, rotate: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <feat.icon className="w-8 h-8 text-primary mb-3" />
                    </motion.div>
                    <h4 className="font-semibold mb-1 text-sm">{feat.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{feat.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
