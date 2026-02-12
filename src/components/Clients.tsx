"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
import Marquee from "./animations/Marquee";
import { RevealText } from "./animations/TextReveal";
import TiltCard from "./animations/TiltCard";

const clients = [
  { name: "Biman Bangladesh Airlines", logo: "/clients/biman-bangladesh.png" },
  { name: "Riyadh Air", logo: "/clients/riyadh-air.png" },
  { name: "Porter Airlines", logo: "/clients/porter-airlines.png" },
  { name: "Royal Brunei Airlines", logo: "/clients/royal-brunei.png" },
  { name: "Air Niugini", logo: "/clients/air-niugini.webp" },
  { name: "Sutherland", logo: "/clients/sutherland.png" },
];

const testimonials = [
  { quote: "The Route Profitability Solution has transformed how we determine profitability across different routes and perform cost analysis. It's become an essential tool for our financial planning.", author: "DGM, Cost & Budget", company: "Biman Bangladesh Airlines" },
  { quote: "iConcile's invoice verification system has significantly reduced our processing time while detecting billing discrepancies we were previously missing. The ROI was evident within the first quarter.", author: "VP Finance Operations", company: "Leading Airline Customer" },
];

export default function Clients() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="clients" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-3xl mx-auto mb-16">
          <RevealText><span className="text-primary text-sm font-semibold tracking-wider uppercase">Trusted Worldwide</span></RevealText>
          <RevealText delay={0.1}><h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">Trusted by <span className="gradient-text">Industry Leaders</span></h2></RevealText>
          <RevealText delay={0.2}><p className="text-muted text-lg leading-relaxed">Leading airlines and ground handlers across the globe rely on iConcile to optimize their financial operations.</p></RevealText>
        </div>

        {/* Infinite scrolling marquee for client logos */}
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="mb-20">
          <Marquee speed={25}>
            {clients.map((client) => (
              <div key={client.name} className="flex items-center justify-center px-8 sm:px-10 py-6 bg-surface border border-border rounded-xl hover:border-primary/20 transition-colors min-w-[180px] sm:min-w-[220px] h-20 sm:h-24 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}${client.logo}`}
                  alt={client.name}
                  className="h-8 sm:h-10 w-auto max-w-[120px] sm:max-w-[144px] object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </Marquee>
        </motion.div>

        {/* Testimonials with 3D tilt */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40, rotateX: 10 }} animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}} transition={{ duration: 0.7, delay: 0.5 + i * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <TiltCard>
                <div className="relative bg-surface border border-border rounded-2xl p-8 lg:p-10 h-full">
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  <p className="text-foreground/90 leading-relaxed mb-6 text-lg">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted">{testimonial.company}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
