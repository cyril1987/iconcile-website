"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import ScrollProgress from "./animations/ScrollProgress";

const navLinks = [
  { label: "Solutions", href: "#solutions", children: [{ label: "Airline Solutions", href: "#solutions" }, { label: "Ground Handling", href: "#ground-handling" }, { label: "What Sets Us Apart", href: "#why-iconcile" }] },
  { label: "Platform", href: "#platform" },
  { label: "Clients", href: "#clients" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ScrollProgress />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-background/20" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex items-center gap-2 group">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }} className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-background text-lg">
                iC
              </motion.div>
              <span className="text-xl font-bold"><span className="text-foreground">i</span><span className="gradient-text">Concile</span></span>
            </a>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative" onMouseEnter={() => link.children && setOpenDropdown(link.label)} onMouseLeave={() => setOpenDropdown(null)}>
                  <a href={link.href} className="flex items-center gap-1 px-4 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-surface-light/50">
                    {link.label}
                    {link.children && <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`} />}
                  </a>
                  <AnimatePresence>
                    {link.children && openDropdown === link.label && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 mt-1 w-56 bg-surface/95 backdrop-blur-xl border border-border rounded-xl p-2 shadow-2xl">
                        {link.children.map((child) => (
                          <a key={child.label} href={child.href} className="block px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface-light rounded-lg transition-colors">{child.label}</a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#contact" className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-primary to-accent text-background hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
                Book a Demo
              </motion.a>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-muted hover:text-foreground">
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-6 h-6" /></motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-6 h-6" /></motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-surface/95 backdrop-blur-xl border-b border-border">
              <div className="px-4 py-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div key={link.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <a href={link.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-muted hover:text-foreground rounded-lg hover:bg-surface-light transition-colors">{link.label}</a>
                    {link.children?.map((child) => (
                      <a key={child.label} href={child.href} onClick={() => setMobileOpen(false)} className="block px-8 py-2 text-sm text-muted hover:text-foreground rounded-lg hover:bg-surface-light transition-colors">{child.label}</a>
                    ))}
                  </motion.div>
                ))}
                <div className="pt-4">
                  <a href="#contact" onClick={() => setMobileOpen(false)} className="block text-center px-5 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-primary to-accent text-background">Book a Demo</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
