"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FileCheck, BarChart3, Brain, ArrowRight, Receipt, GitCompareArrows, PieChart, TrendingUp, Target, Calculator } from "lucide-react";
import TiltCard from "./animations/TiltCard";
import { RevealText } from "./animations/TextReveal";

const solutions = [
  { id: "procure-to-pay", icon: FileCheck, title: "Procure to Pay", description: "End-to-end cost management from contract management to invoice verification, ERP posting, and rejection management — all in one seamless workflow.", features: [{ icon: Receipt, text: "Contract Management" }, { icon: FileCheck, text: "Invoice Verification" }, { icon: GitCompareArrows, text: "ERP Integration" }], gradient: "from-primary to-emerald-400", bgGlow: "rgba(16, 185, 129, 0.06)" },
  { id: "reporting-budgeting", icon: BarChart3, title: "Reporting & Budgeting", description: "Comprehensive profitability reporting, cost budgeting, and what-if analysis to drive data-informed decisions at every level of your organization.", features: [{ icon: PieChart, text: "Profitability Reporting" }, { icon: Calculator, text: "Budget vs Actuals" }, { icon: TrendingUp, text: "What-if Simulation" }], gradient: "from-accent to-blue-400", bgGlow: "rgba(6, 182, 212, 0.06)" },
  { id: "analytics-planning", icon: Brain, title: "Analytics & Planning", description: "AI-driven spend analysis, demand forecasting, and route optimization to identify savings opportunities and maximize operational efficiency.", features: [{ icon: Target, text: "Spend Analysis" }, { icon: Brain, text: "Demand Forecasting" }, { icon: BarChart3, text: "Route Optimization" }], gradient: "from-violet-500 to-purple-400", bgGlow: "rgba(139, 92, 246, 0.06)" },
];

function SolutionCard({ solution, index }: { solution: (typeof solutions)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60, rotateX: 15 }} animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}} transition={{ duration: 0.7, delay: index * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
      <TiltCard className="h-full">
        <div className="group relative bg-surface border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 h-full">
          <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${solution.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle at 50% 0%, ${solution.bgGlow}, transparent 70%)` }} />
          <div className="relative z-10">
            <motion.div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-6`} whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <solution.icon className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
            <p className="text-muted leading-relaxed mb-6">{solution.description}</p>
            <div className="space-y-3 mb-6">
              {solution.features.map((feat, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 + index * 0.2 + i * 0.1 }} className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><feat.icon className="w-3.5 h-3.5 text-primary" /></div>
                  <span className="text-muted">{feat.text}</span>
                </motion.div>
              ))}
            </div>
            <a href="#contact" className="inline-flex items-center gap-2 text-primary hover:text-primary-light text-sm font-medium transition-colors group/link">Learn More <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform duration-300" /></a>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Solutions() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  return (
    <section id="solutions" ref={sectionRef} className="relative py-24 lg:py-32">
      <motion.div className="absolute inset-0 radial-glow opacity-50" style={{ x: bgX }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <RevealText><span className="text-primary text-sm font-semibold tracking-wider uppercase">Solutions</span></RevealText>
          <RevealText delay={0.1}><h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">One Platform, <span className="gradient-text">Complete Control</span></h2></RevealText>
          <RevealText delay={0.2}><p className="text-muted text-lg leading-relaxed">iConSuite delivers the full spectrum of aviation cost management — from procurement to strategic planning — in a single, integrated platform.</p></RevealText>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, i) => (<SolutionCard key={solution.id} solution={solution} index={i} />))}
        </div>
      </div>
    </section>
  );
}
