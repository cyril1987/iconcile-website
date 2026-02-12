"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Headphones, Award, Settings2, Clock, Users, Sparkles } from "lucide-react";
import { RevealText } from "./animations/TextReveal";
import Parallax from "./animations/Parallax";

const differentiators = [
  { icon: Headphones, title: "24/7 Expert Support", description: "Our dedicated technical team ensures prompt assistance around the clock, with continuous product enhancement driven by your feedback." },
  { icon: Award, title: "15+ Years Domain Expertise", description: "Built by industry veterans who have managed 2,000+ DOC contracts for leading airlines including Qantas, Singapore Airlines, and United Airways." },
  { icon: Settings2, title: "Highly Customizable", description: "Modular microservice architecture allows easy adaptation to your complex business needs with minimal customization effort." },
  { icon: Clock, title: "Rapid Deployment", description: "Go live faster with our streamlined implementation process, pre-built connectors, and dedicated onboarding team." },
  { icon: Users, title: "Built for Airlines", description: "Purpose-built for aviation — not a generic tool retrofitted for airlines. Every feature addresses real operational challenges." },
  { icon: Sparkles, title: "Continuous Innovation", description: "Regular platform updates with AI-powered features, ensuring you always have access to the latest cost management capabilities." },
];

export default function WhyIConcile() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgRotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <section id="why-iconcile" ref={sectionRef} className="relative py-24 lg:py-32">
      <motion.div className="absolute inset-0 radial-glow opacity-30" style={{ rotate: bgRotate }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-3xl mx-auto mb-16">
          <RevealText><span className="text-primary text-sm font-semibold tracking-wider uppercase">Why iConcile</span></RevealText>
          <RevealText delay={0.1}><h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">What Sets Us <span className="gradient-text">Apart</span></h2></RevealText>
          <RevealText delay={0.2}><p className="text-muted text-lg leading-relaxed">Deep domain expertise meets cutting-edge technology — delivering unmatched value for airlines and ground handlers globally.</p></RevealText>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentiators.map((item, i) => (
            <Parallax key={item.title} speed={0.05 * (i % 3)} direction={i % 2 === 0 ? "up" : "down"}>
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative p-6 rounded-2xl border border-border hover:border-primary/20 bg-surface/50 hover:bg-surface transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 30% 30%, rgba(16,185,129,0.05), transparent 70%)" }} />
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                >
                  <item.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </motion.div>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
