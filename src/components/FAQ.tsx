"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { RevealText } from "./animations/TextReveal";

const faqs = [
  {
    question: "What is iConSuite?",
    answer:
      "iConSuite is our comprehensive aviation cost management platform that includes modules for invoice verification, contract management, route profitability analysis, budget management, AR automation, and mobile operations. It's built specifically for airlines and ground handlers.",
  },
  {
    question: "Which systems does iConSuite integrate with?",
    answer:
      "iConSuite integrates seamlessly with major ERP systems like SAP and Oracle, revenue accounting tools, and analytics platforms such as Power BI and Tableau. Our robust APIs and ETL connectors ensure frictionless data synchronization.",
  },
  {
    question: "Is iConSuite compliant with IATA SIS standards?",
    answer:
      "Yes, iConSuite is 100% IATA SIS compliant. Our platform supports the full SIS workflow, ensuring your invoicing and settlement processes meet global aviation industry standards.",
  },
  {
    question: "How customizable is the platform?",
    answer:
      "iConSuite uses a modular microservice architecture that allows easy adaptation to complex business needs with minimal customization effort. Each module can be configured independently to match your specific operational workflows.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We provide 24/7 technical support from a skilled team with deep aviation domain expertise. Our support includes prompt assistance, continuous product enhancement, and dedicated account management for enterprise clients.",
  },
  {
    question: "How do I request a demo?",
    answer:
      "You can request a demo by clicking the 'Book a Demo' button on our website or reaching out through our contact form. Our team will schedule a personalized walkthrough of the platform tailored to your specific needs.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, rotateY: index % 2 === 0 ? 5 : -5 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? "border-primary/30 bg-surface shadow-[0_0_30px_rgba(16,185,129,0.08)]"
          : "border-border hover:border-primary/20 hover:bg-surface/50"
      }`}>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-6 text-left transition-colors"
        >
          <div className="flex items-center gap-3 pr-4">
            <motion.div
              animate={isOpen ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                isOpen ? "text-primary" : "text-muted"
              }`} />
            </motion.div>
            <span className="font-semibold">{faq.question}</span>
          </div>
          <motion.div
            animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
              isOpen ? "text-primary" : "text-muted"
            }`} />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="px-6 pb-6 pl-14 text-muted leading-relaxed">
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {faq.answer}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 radial-glow opacity-20" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <RevealText>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              FAQ
            </span>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-muted text-lg">
              Everything you need to know about iConSuite and our platform.
            </p>
          </RevealText>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
