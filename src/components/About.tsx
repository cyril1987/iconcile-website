"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { Rocket, Eye, Users, Linkedin } from "lucide-react";
import { RevealText } from "./animations/TextReveal";
import TiltCard from "./animations/TiltCard";

const team = [
  {
    name: "Rahul Pandey",
    role: "Co-Founder & CEO",
    description:
      "An MBA from Symbiosis and a certified PSPO, Rahul leads iConcile with 15+ years of experience in SaaS solutions for Airlines and Logistics. His strategic leadership drives innovation, operational optimization, and scalable growth for clients.",
    image: "/team/rahul-pandey.jpg",
    linkedin: "https://www.linkedin.com/in/rahul-pandey-93645755/",
  },
  {
    name: "Mohit Johari",
    role: "Co-Founder & CPTO",
    description:
      "A dual alumnus of IIT Bombay and IIM Ahmedabad, Mohit brings 13+ years of expertise in creating tailored enterprise solutions for Airlines, Logistics, and Payments. His vision and technical excellence drive innovation and quality across our products.",
    image: "/team/mohit-johari.jpg",
    linkedin: "https://www.linkedin.com/in/mohit-johari/",
  },
  {
    name: "Cyril George",
    role: "Co-Founder & COO",
    description:
      "As COO, Cyril aligns operations with client needs, leveraging 13+ years of Airline and Banking experience. A University of Pune postgraduate and CSPO, he ensures iConcile delivers impactful, reliable solutions through his business and technology expertise.",
    image: "/team/cyril-george.jpg",
    linkedin: "https://www.linkedin.com/in/cyril-george-2011/",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 radial-glow opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-3xl mx-auto mb-16">
          <RevealText><span className="text-primary text-sm font-semibold tracking-wider uppercase">About Us</span></RevealText>
          <RevealText delay={0.1}><h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">Powering Aviation to <span className="gradient-text">Sustainable Growth</span></h2></RevealText>
          <RevealText delay={0.2}><p className="text-muted text-lg leading-relaxed">Founded in 2023 by industry veterans with over 15 years of aviation cost management experience, iConcile is on a mission to revolutionize how airlines manage their financial operations.</p></RevealText>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {[
            { icon: Eye, title: "Our Vision", text: "Build the best-in-class financial management and analytics platform that minimizes effort and enables better cost control for airlines and logistics service providers.", gradient: "from-primary to-accent", iconColor: "text-primary" },
            { icon: Rocket, title: "Our Mission", text: "Revolutionize the way airlines and logistics providers manage their operations and optimize profitability using cutting-edge, innovative solutions.", gradient: "from-accent to-violet-500", iconColor: "text-accent" },
          ].map((card, i) => (
            <motion.div key={card.title} initial={{ opacity: 0, x: i === 0 ? -40 : 40, rotateY: i === 0 ? 10 : -10 }} animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <TiltCard>
                <div className="relative bg-surface border border-border rounded-2xl p-8 overflow-hidden h-full">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.gradient}`} />
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <card.icon className={`w-10 h-10 ${card.iconColor} mb-4`} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                  <p className="text-muted leading-relaxed">{card.text}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Leadership Team</h3>
          </div>
          <p className="text-muted max-w-2xl mx-auto">Led by seasoned professionals combining deep aviation expertise with technology innovation.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({
  member,
  index,
  isInView,
}: {
  member: (typeof team)[0];
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: 0.5 + index * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 h-full flex flex-col">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden">
          {/* Gradient overlay on image */}
          <motion.div
            className="absolute inset-0 z-10 bg-gradient-to-t from-surface via-surface/40 to-transparent"
            animate={{ opacity: isHovered ? 0.9 : 0.7 }}
            transition={{ duration: 0.4 }}
          />

          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 z-20 rounded-2xl"
            animate={{
              boxShadow: isHovered
                ? "inset 0 0 60px rgba(16, 185, 129, 0.15)"
                : "inset 0 0 0px rgba(16, 185, 129, 0)",
            }}
            transition={{ duration: 0.5 }}
          />

          {/* The image */}
          <motion.div
            className="relative w-full h-full"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>

          {/* Floating particles on hover */}
          {isHovered && (
            <>
              {[...Array(5)].map((_, j) => (
                <motion.div
                  key={j}
                  className="absolute w-1 h-1 rounded-full bg-primary/40 z-20"
                  initial={{
                    x: 100 + j * 40,
                    y: 200,
                    opacity: 0,
                  }}
                  animate={{
                    y: [200, 50 + j * 20],
                    opacity: [0, 0.8, 0],
                    x: 80 + j * 50 + Math.sin(j) * 20,
                  }}
                  transition={{
                    duration: 2,
                    delay: j * 0.15,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 -mt-16 px-6 pb-6 flex flex-col flex-1">
          <motion.div
            animate={{ y: isHovered ? -4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-xl font-bold mb-1">{member.name}</h4>
            <p className="text-primary text-sm font-semibold mb-3 tracking-wide">
              {member.role}
            </p>
          </motion.div>

          <motion.p
            className="text-sm text-muted/80 leading-relaxed flex-1"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {member.description}
          </motion.p>

          {/* LinkedIn link */}
          <motion.div
            className="mt-4 pt-4 border-t border-border/50"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-muted hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>Connect on LinkedIn</span>
              <motion.span
                animate={{ x: isHovered ? 3 : 0 }}
                transition={{ duration: 0.3 }}
              >
                &rarr;
              </motion.span>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
