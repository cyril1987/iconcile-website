"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  Send,
  MapPin,
  Mail,
  Building,
  CheckCircle,
} from "lucide-react";
import { RevealText } from "./animations/TextReveal";
import TiltCard from "./animations/TiltCard";
import MagneticButton from "./animations/MagneticButton";

const offices = [
  {
    city: "Gurugram",
    country: "India",
    label: "Headquarters",
  },
  {
    city: "Pune",
    country: "India",
    label: "Development Center",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const orbY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClasses =
    "w-full px-4 py-3 bg-surface-light border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300";

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div
        className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        style={{ y: orbY, rotate: bgRotate }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        style={{ y: orbY2 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <RevealText>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Contact
            </span>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
              Ready to Get{" "}
              <span className="gradient-text">Started?</span>
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-muted text-lg leading-relaxed">
              Schedule a personalized demo to see how iConSuite can transform
              your aviation cost management.
            </p>
          </RevealText>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: 5 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-3"
          >
            <div className="bg-surface border border-border rounded-2xl p-8 lg:p-10 hover:border-primary/10 transition-colors duration-500">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold mb-2"
                  >
                    Thank You!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-muted"
                  >
                    We&apos;ll get back to you within 24 hours to schedule your
                    demo.
                  </motion.p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { label: "First Name", type: "text", placeholder: "John" },
                      { label: "Last Name", type: "text", placeholder: "Doe" },
                    ].map((field, i) => (
                      <motion.div
                        key={field.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <label className="block text-sm font-medium mb-2">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          required
                          className={inputClasses}
                          placeholder={field.placeholder}
                        />
                      </motion.div>
                    ))}
                  </div>
                  {[
                    { label: "Work Email", type: "email", placeholder: "john@airline.com" },
                    { label: "Company", type: "text", placeholder: "Your Airline" },
                  ].map((field, i) => (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <label className="block text-sm font-medium mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required
                        className={inputClasses}
                        placeholder={field.placeholder}
                      />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      How can we help?
                    </label>
                    <textarea
                      rows={4}
                      className={`${inputClasses} resize-none`}
                      placeholder="Tell us about your cost management challenges..."
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                  >
                    <MagneticButton
                      as="button"
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold text-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-300"
                    >
                      <Send className="w-5 h-5" />
                      Book a Demo
                    </MagneticButton>
                  </motion.div>
                </form>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -5 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Offices */}
            <TiltCard>
              <div className="bg-surface border border-border rounded-2xl p-8">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Building className="w-5 h-5 text-primary" />
                  </motion.div>
                  Our Offices
                </h3>
                <div className="space-y-6">
                  {offices.map((office, i) => (
                    <motion.div
                      key={office.city}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className="flex items-start gap-3 group"
                    >
                      <MapPin className="w-5 h-5 text-primary mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="font-medium">
                          {office.city}, {office.country}
                        </p>
                        <p className="text-sm text-muted">{office.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Email */}
            <TiltCard>
              <div className="bg-surface border border-border rounded-2xl p-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.2, rotate: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Mail className="w-5 h-5 text-primary" />
                  </motion.div>
                  Email Us
                </h3>
                <a
                  href="mailto:info@iconcile.com"
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  info@iconcile.com
                </a>
              </div>
            </TiltCard>

            {/* Quick CTA */}
            <TiltCard>
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                <h3 className="font-bold text-lg mb-3 relative">
                  Ready to see iConSuite in action?
                </h3>
                <p className="text-sm text-muted mb-4 relative">
                  Get a personalized walkthrough from our team.
                </p>
                <MagneticButton
                  as="a"
                  href="mailto:info@iconcile.com"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-light text-sm font-medium transition-colors relative"
                >
                  Contact Sales
                  <Send className="w-4 h-4" />
                </MagneticButton>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
