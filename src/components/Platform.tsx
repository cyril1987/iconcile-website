"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Layers, Plug, Shield, Smartphone, Cloud, Database, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { RevealText } from "./animations/TextReveal";
import TiltCard from "./animations/TiltCard";

const products = [
  {
    name: "iConSBS",
    tagline: "Simplified Billing System",
    description: "The miscellaneous billing solution for seamless & efficient billing via SIS. 100% compliant with IATA's Simplified Invoicing and Settlement (SIS) platform, with a fully automated interface established with IATA's iiNET.",
    icon: Layers,
    color: "#10b981",
    features: [
      "Comprehensive handling of ICH, ACH & Bilateral settlement methods",
      "Automated ISXML invoice processing & SIS interfacing",
      "Multi-level invoice accounting with ERP integration",
      "Configurable approval workflows for business users",
      "Auto-generation of Outward Reject invoices & GL adjustments",
      "ICH/ACH correspondence & SIS bilateral invoice management",
    ],
  },
  {
    name: "iConRPS",
    tagline: "Route Profitability System",
    description: "The Profitability Reporting Framework for management reporting with Generative AI-powered simulations for new routes and aircraft. A management decision-making tool for determining route profitability and cost analysis.",
    icon: Database,
    color: "#06b6d4",
    features: [
      "Accurate DOC calculations at flight leg level using contract & real-time data",
      "Real-time profitability: daily, weekly, monthly — Actual vs Budgeted vs Forecasted",
      "Integration with ERP, Revenue Accounting & Analytical Reporting tools",
      "Configurable rules to allocate monthly fixed costs at flight leg level",
      "Customizable dashboards & on-demand reporting",
      "AI simulation module for data-driven route & aircraft decisions",
    ],
  },
  {
    name: "iConCMIV",
    tagline: "Contract Management & Invoice Verification",
    description: "The DOC Management tool for efficient, streamlined invoice verification. Handles the full procure-to-pay cycle from contract storage to invoice accounting, dispute management, and credit note reconciliation.",
    icon: Shield,
    color: "#8b5cf6",
    features: [
      "Digital Contract Repository for all supplier contracts",
      "Pre-configured tariffs for Airport Fees, Passenger Levies & Navigation",
      "Multi-dimensional Data-mart with airline source system integration",
      "Dispute management & credit note reconciliation",
      "Invoice Review, Approval & Rejection Management workflows",
      "ERP Posting & data-driven supplier negotiations",
    ],
  },
  {
    name: "iConBMS",
    tagline: "Budget Management System",
    description: "A versatile budget worksheet that simplifies financial forecasting and resource allocation. Compare multiple budget versions, derive rates from supplier contracts, and interface finalized budgets with ERP.",
    icon: Cloud,
    color: "#f59e0b",
    features: [
      "Load flight schedules via Excel templates or SSIM files",
      "Budget cost calculation from historical averages & proxy routes",
      "Configurable rules to derive budgeted rates from contracts",
      "Budget worksheet for user review and refinement",
      "Compare different budget versions & finalize budgets",
      "Interface finalized budgets directly with ERP systems",
    ],
  },
  {
    name: "iConCollect",
    tagline: "AR Automation",
    description: "An AR automation tool that integrates customer contracts with real-time operations data for automated invoice generation. Streamlines the entire outward billing cycle for ground handlers.",
    icon: Plug,
    color: "#ec4899",
    features: [
      "Digital repository for all customer contracts",
      "Load flight schedules using SSIM data or Excel templates",
      "Configurable service form templates for data capture",
      "Digital forms for recording service consumption",
      "Outward billing at flight service level using contractual rates",
      "Automated invoice generation with email triggers to customers",
    ],
  },
  {
    name: "AeroSync",
    tagline: "Mobile Application",
    description: "A responsive mobile app for real-time service tracking and on-site data capture. Designed for ground handling field operations with an intuitive interface for efficient and quick adoption.",
    icon: Smartphone,
    color: "#14b8a6",
    features: [
      "Real-time tracking of ground services for accurate monitoring",
      "On-site service consumption data capture",
      "Intuitive, user-friendly mobile-first design",
      "Seamless sync with iConCollect backend",
      "Offline-capable with automatic data sync",
      "Push notifications for service alerts & updates",
    ],
  },
];

const integrations = ["SAP", "Oracle", "Power BI", "Tableau", "IATA SIS", "Custom ERP"];

function ProductCard({
  product,
  index,
  isInView,
  onSelect,
}: {
  product: (typeof products)[0];
  index: number;
  isInView: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <TiltCard>
        <button
          onClick={onSelect}
          className="w-full text-left group relative bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer"
        >
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ backgroundColor: product.color + "15" }}
          />
          <motion.div
            whileHover={{ scale: 1.15, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative z-10"
          >
            <product.icon className="w-10 h-10 mb-4" style={{ color: product.color }} />
          </motion.div>
          <h3 className="text-lg font-bold mb-1 font-mono" style={{ color: product.color }}>
            {product.name}
          </h3>
          <p className="text-sm text-muted relative z-10">{product.tagline}</p>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted">
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>
      </TiltCard>
    </motion.div>
  );
}

function ProductDetail({
  product,
  onClose,
}: {
  product: (typeof products)[0];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto bg-surface border border-border rounded-2xl shadow-2xl"
      >
        {/* Top color accent */}
        <div
          className="h-1 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${product.color}, ${product.color}80)` }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-surface-light border border-border text-muted hover:text-foreground hover:border-primary/30 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 sm:p-8">
          {/* Header */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pr-8">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: product.color + "15" }}
            >
              <product.icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: product.color }} />
            </motion.div>
            <div className="min-w-0">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl sm:text-2xl font-bold font-mono"
                style={{ color: product.color }}
              >
                {product.name}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-muted"
              >
                {product.tagline}
              </motion.p>
            </div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-sm sm:text-base text-muted leading-relaxed mb-6 sm:mb-8"
          >
            {product.description}
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Key Features
            </h4>
            <div className="space-y-3">
              {product.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: product.color }}
                  />
                  <span className="text-sm text-muted leading-relaxed">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-6 border-t border-border"
          >
            <a
              href="#contact"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-background transition-all duration-300 hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${product.color}, ${product.color}cc)` }}
            >
              Request {product.name} Demo
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Platform() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <section id="platform" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-primary/[0.03] rounded-full pointer-events-none"
        style={{ rotate }}
      >
        <div className="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-sm" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <RevealText>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Platform
            </span>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
              The <span className="gradient-text">iConSuite</span> Ecosystem
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-muted text-lg leading-relaxed">
              A modular microservice architecture with six powerful products — each designed to solve
              specific challenges, all working together seamlessly. Click any product to explore.
            </p>
          </RevealText>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mb-16">
          {products.map((product, i) => (
            <ProductCard
              key={product.name}
              product={product}
              index={i}
              isInView={isInView}
              onSelect={() => setSelectedProduct(i)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-surface border border-border rounded-2xl p-8 lg:p-12"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/3">
              <h3 className="text-2xl font-bold mb-3">Seamless Integrations</h3>
              <p className="text-muted leading-relaxed">
                Connect iConSuite with your existing ERP, accounting, and analytics tools through
                robust APIs and ETL connectors.
              </p>
            </div>
            <div className="lg:w-2/3 flex flex-wrap gap-3">
              {integrations.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                  transition={{ delay: 0.9 + i * 0.08, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="px-6 py-3 bg-surface-light border border-border rounded-xl text-sm font-medium text-muted hover:text-foreground hover:border-primary/30 transition-all cursor-default"
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct !== null && (
          <ProductDetail
            product={products[selectedProduct]}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
