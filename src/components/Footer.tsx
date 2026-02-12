"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Linkedin,
  Youtube,
  Instagram,
} from "lucide-react";

const footerLinks = {
  Solutions: [
    { label: "Airline Solutions", href: "#solutions" },
    { label: "Ground Handling", href: "#ground-handling" },
    { label: "Analytics & Planning", href: "#solutions" },
    { label: "Integrations", href: "#platform" },
  ],
  Products: [
    { label: "iConSBS", href: "#platform" },
    { label: "iConRPS", href: "#platform" },
    { label: "iConCMIV", href: "#platform" },
    { label: "iConBMS", href: "#platform" },
    { label: "iConCollect", href: "#platform" },
    { label: "AeroSync", href: "#platform" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#contact" },
    { label: "Contact", href: "#contact" },
    { label: "Resources", href: "#faq" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/iconcile-technologies-private-limited", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="border-t border-border bg-surface/30 relative overflow-hidden">
      <div className="absolute inset-0 radial-glow opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="col-span-2 md:col-span-1"
          >
            <a href="#" className="flex items-center gap-2 mb-4 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-background text-lg"
              >
                iC
              </motion.div>
              <span className="text-xl font-bold">
                <span className="text-foreground">i</span>
                <span className="gradient-text">Concile</span>
              </span>
            </a>
            <p className="text-sm text-muted leading-relaxed mb-6 max-w-xs">
              Elevating industry excellence through cutting-edge aviation cost
              management and financial analytics solutions.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  className="w-10 h-10 rounded-xl bg-surface-light border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links], colIdx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + colIdx * 0.1 }}
            >
              <h4 className="font-semibold mb-4 text-sm">{title}</h4>
              <ul className="space-y-3">
                {links.map((link, linkIdx) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + colIdx * 0.1 + linkIdx * 0.05 }}
                  >
                    <a
                      href={link.href}
                      className="text-sm text-muted hover:text-primary hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} iConcile Technologies Pvt. Ltd.
            All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service"].map((text) => (
              <a
                key={text}
                href="#"
                className="text-sm text-muted hover:text-primary transition-colors duration-200"
              >
                {text}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
