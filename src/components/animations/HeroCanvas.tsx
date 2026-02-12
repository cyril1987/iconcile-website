"use client";

import { useEffect, useRef } from "react";

/**
 * Animated 3D globe with flight arcs, glowing dots, and orbiting particles.
 * Inspired by premium SaaS hero sections (Stripe, Vercel, Linear style).
 */
export default function HeroCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    // ---- Types ----
    interface GlobePoint {
      lat: number;
      lng: number;
      label?: string;
      size: number;
    }

    interface FlightArc {
      from: GlobePoint;
      to: GlobePoint;
      progress: number;
      speed: number;
      color: string;
    }

    interface FloatingParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }

    // ---- State ----
    const cities: GlobePoint[] = [
      { lat: 28.6, lng: 77.2, label: "DEL", size: 3 },       // Delhi (HQ)
      { lat: 23.8, lng: 90.4, label: "DAC", size: 2.5 },     // Dhaka
      { lat: 24.5, lng: 54.6, label: "AUH", size: 2.5 },     // Abu Dhabi
      { lat: 24.7, lng: 46.7, label: "RUH", size: 2.5 },     // Riyadh
      { lat: 4.7, lng: 114.9, label: "BWN", size: 2 },       // Brunei
      { lat: -6.1, lng: 147.0, label: "POM", size: 2 },      // Port Moresby
      { lat: 19.1, lng: 72.9, label: "BOM", size: 2.5 },     // Mumbai
      { lat: 1.3, lng: 103.8, label: "SIN", size: 2.5 },     // Singapore
      { lat: 51.5, lng: -0.1, label: "LHR", size: 2.5 },     // London
      { lat: 40.7, lng: -74.0, label: "JFK", size: 2.5 },    // New York
      { lat: 25.3, lng: 55.3, label: "DXB", size: 3 },       // Dubai
      { lat: 35.7, lng: 139.7, label: "NRT", size: 2 },      // Tokyo
      { lat: -33.9, lng: 151.2, label: "SYD", size: 2 },     // Sydney
      { lat: 43.7, lng: -79.4, label: "YYZ", size: 2 },      // Toronto
      { lat: 13.7, lng: 100.5, label: "BKK", size: 2 },      // Bangkok
      { lat: 12.9, lng: 80.2, label: "MAA", size: 2 },       // Chennai
    ];

    const arcs: FlightArc[] = [];
    const particles: FloatingParticle[] = [];
    let globeRotation = 0;

    // Globe params
    const getGlobeCenter = () => ({
      x: width * 0.5,
      y: height * 0.52,
    });
    const getGlobeRadius = () => Math.min(width, height) * 0.32;

    // ---- Init ----
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width || window.innerWidth;
      height = rect?.height || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initArcs = () => {
      arcs.length = 0;
      const routes = [
        [0, 10], [0, 1], [0, 3], [0, 6], [0, 15],  // Delhi hub
        [10, 8], [10, 7], [10, 3],                    // Dubai connections
        [8, 9], [9, 13],                               // Transatlantic
        [7, 4], [7, 14], [4, 5],                       // SE Asia
        [11, 12], [8, 11],                             // Asia-Pacific
        [3, 2], [1, 7],                                // Middle East routes
      ];
      for (const [a, b] of routes) {
        arcs.push({
          from: cities[a],
          to: cities[b],
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.003,
          color: Math.random() > 0.5 ? "16, 185, 129" : "6, 182, 212",
        });
      }
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 0.5 + Math.random() * 1.5,
          alpha: 0.1 + Math.random() * 0.3,
          color: Math.random() > 0.6 ? "16, 185, 129" : "6, 182, 212",
        });
      }
    };

    // ---- 3D Projection ----
    const project = (lat: number, lng: number, rotation: number) => {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lng + rotation) * Math.PI) / 180;
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      // Simple perspective
      const gc = getGlobeCenter();
      const r = getGlobeRadius();
      return {
        x: gc.x + x * r,
        y: gc.y - y * r,
        z, // positive z = front-facing
        visible: z > -0.1,
      };
    };

    // ---- Draw Functions ----

    // Ambient background
    const drawBackground = () => {
      // Deep space
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // Large ambient glow behind globe
      const gc = getGlobeCenter();
      const r = getGlobeRadius();
      const glow = ctx.createRadialGradient(gc.x, gc.y, r * 0.2, gc.x, gc.y, r * 2.5);
      glow.addColorStop(0, "rgba(16, 185, 129, 0.04)");
      glow.addColorStop(0.3, "rgba(6, 182, 212, 0.02)");
      glow.addColorStop(0.6, "rgba(16, 185, 129, 0.008)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
    };

    // Globe wireframe
    const drawGlobe = (rotation: number, time: number) => {
      const gc = getGlobeCenter();
      const r = getGlobeRadius();

      // Globe shadow/atmosphere ring
      const atmo = ctx.createRadialGradient(gc.x, gc.y, r * 0.95, gc.x, gc.y, r * 1.15);
      atmo.addColorStop(0, "rgba(16, 185, 129, 0.03)");
      atmo.addColorStop(0.5, "rgba(6, 182, 212, 0.015)");
      atmo.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(gc.x, gc.y, r * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Globe fill — very subtle dark sphere
      const sphereGrad = ctx.createRadialGradient(
        gc.x - r * 0.3, gc.y - r * 0.3, 0,
        gc.x, gc.y, r
      );
      sphereGrad.addColorStop(0, "rgba(15, 25, 40, 0.4)");
      sphereGrad.addColorStop(0.7, "rgba(8, 15, 25, 0.3)");
      sphereGrad.addColorStop(1, "rgba(3, 7, 18, 0.2)");
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(gc.x, gc.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Globe edge glow
      ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(gc.x, gc.y, r, 0, Math.PI * 2);
      ctx.stroke();

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lng = 0; lng <= 360; lng += 3) {
          const p = project(lat, lng, rotation);
          if (!p.visible) { first = true; continue; }
          if (first) { ctx.moveTo(p.x, p.y); first = false; }
          else ctx.lineTo(p.x, p.y);
        }
        const alpha = 0.03 + Math.abs(lat) * 0.0003;
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Longitude lines
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = project(lat, lng, rotation);
          if (!p.visible) { first = true; continue; }
          if (first) { ctx.moveTo(p.x, p.y); first = false; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(16, 185, 129, 0.025)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Equator — slightly brighter
      ctx.beginPath();
      let first = true;
      for (let lng = 0; lng <= 360; lng += 2) {
        const p = project(0, lng, rotation);
        if (!p.visible) { first = true; continue; }
        if (first) { ctx.moveTo(p.x, p.y); first = false; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(16, 185, 129, 0.06)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    };

    // City dots on globe
    const drawCities = (rotation: number, time: number) => {
      for (const city of cities) {
        const p = project(city.lat, city.lng, rotation);
        if (!p.visible) continue;

        const depthAlpha = 0.3 + p.z * 0.6;

        // Outer pulse ring
        const pulseR = city.size * 2 + Math.sin(time * 0.003 + city.lat) * 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${depthAlpha * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, city.size * (0.5 + p.z * 0.5), 0, Math.PI * 2);
        const dotGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, city.size);
        dotGrad.addColorStop(0, `rgba(16, 185, 129, ${depthAlpha})`);
        dotGrad.addColorStop(1, `rgba(16, 185, 129, ${depthAlpha * 0.2})`);
        ctx.fillStyle = dotGrad;
        ctx.fill();

        // Glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, city.size * 4);
        glow.addColorStop(0, `rgba(16, 185, 129, ${depthAlpha * 0.08})`);
        glow.addColorStop(1, "rgba(16, 185, 129, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, city.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Label
        if (city.label && p.z > 0.3 && city.size >= 2.5) {
          ctx.font = "9px monospace";
          ctx.fillStyle = `rgba(16, 185, 129, ${depthAlpha * 0.5})`;
          ctx.textAlign = "left";
          ctx.fillText(city.label, p.x + city.size + 4, p.y + 3);
        }
      }
    };

    // Flight arcs
    const drawFlightArcs = (rotation: number, time: number) => {
      for (const arc of arcs) {
        arc.progress += arc.speed;
        if (arc.progress > 1) arc.progress = 0;

        const fromP = project(arc.from.lat, arc.from.lng, rotation);
        const toP = project(arc.to.lat, arc.to.lng, rotation);

        // Only draw if at least one end is visible
        if (!fromP.visible && !toP.visible) continue;

        // Draw arc path with elevation
        const steps = 50;
        const points: { x: number; y: number; z: number }[] = [];

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          // Interpolate lat/lng
          const lat = arc.from.lat + (arc.to.lat - arc.from.lat) * t;
          const lng = arc.from.lng + (arc.to.lng - arc.from.lng) * t;

          const p = project(lat, lng, rotation);

          // Elevation — arc peaks in the middle
          const gc = getGlobeCenter();
          const elevation = Math.sin(t * Math.PI) * getGlobeRadius() * 0.15;
          const dx = p.x - gc.x;
          const dy = p.y - gc.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            p.x += (dx / dist) * elevation;
            p.y += (dy / dist) * elevation;
          }

          points.push(p);
        }

        // Draw the arc trail
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < points.length; i++) {
          if (points[i].z < -0.1) { started = false; continue; }
          if (!started) { ctx.moveTo(points[i].x, points[i].y); started = true; }
          else ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = `rgba(${arc.color}, 0.06)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Moving dot along arc
        const dotIdx = Math.floor(arc.progress * steps);
        if (dotIdx < points.length && points[dotIdx].z > -0.1) {
          const dp = points[dotIdx];

          // Trail behind the dot
          const trailLen = 12;
          for (let t = 0; t < trailLen; t++) {
            const ti = dotIdx - t;
            if (ti < 0 || ti >= points.length) continue;
            if (points[ti].z < -0.1) continue;
            const trailAlpha = (1 - t / trailLen) * 0.5;
            const trailSize = (1 - t / trailLen) * 2.5;
            ctx.beginPath();
            ctx.arc(points[ti].x, points[ti].y, trailSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${arc.color}, ${trailAlpha})`;
            ctx.fill();
          }

          // Main dot
          ctx.beginPath();
          ctx.arc(dp.x, dp.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${arc.color}, 0.8)`;
          ctx.fill();

          // Dot glow
          const dotGlow = ctx.createRadialGradient(dp.x, dp.y, 0, dp.x, dp.y, 8);
          dotGlow.addColorStop(0, `rgba(${arc.color}, 0.2)`);
          dotGlow.addColorStop(1, `rgba(${arc.color}, 0)`);
          ctx.fillStyle = dotGlow;
          ctx.beginPath();
          ctx.arc(dp.x, dp.y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // Orbiting ring
    const drawOrbitRing = (rotation: number, time: number) => {
      const gc = getGlobeCenter();
      const r = getGlobeRadius();
      const orbitR = r * 1.25;

      // Dotted orbit ring
      ctx.setLineDash([2, 6]);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.04)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.ellipse(gc.x, gc.y, orbitR, orbitR * 0.3, 0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Orbiting data points
      const numOrbiters = 5;
      for (let i = 0; i < numOrbiters; i++) {
        const angle = (time * 0.0005 + (i * Math.PI * 2) / numOrbiters) % (Math.PI * 2);
        const ox = gc.x + Math.cos(angle) * orbitR;
        const oy = gc.y + Math.sin(angle) * orbitR * 0.3;
        const behindGlobe = Math.sin(angle) > 0.5;

        if (!behindGlobe) {
          ctx.beginPath();
          ctx.arc(ox, oy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(6, 182, 212, 0.5)";
          ctx.fill();

          const oGlow = ctx.createRadialGradient(ox, oy, 0, ox, oy, 6);
          oGlow.addColorStop(0, "rgba(6, 182, 212, 0.1)");
          oGlow.addColorStop(1, "rgba(6, 182, 212, 0)");
          ctx.fillStyle = oGlow;
          ctx.beginPath();
          ctx.arc(ox, oy, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // Floating ambient particles
    const drawParticles = (time: number) => {
      const gc = getGlobeCenter();

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Gentle attraction toward globe center
        const dx = gc.x - p.x;
        const dy = gc.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        p.vx += (dx / dist) * 0.002;
        p.vy += (dy / dist) * 0.002;

        // Speed damping
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap around
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Fade based on distance from center
        const fadeDist = Math.min(dist / (width * 0.5), 1);
        const alpha = p.alpha * (1 - fadeDist * 0.7);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.fill();
      }

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.03;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Subtle data stream lines radiating from globe
    const drawDataStreams = (time: number) => {
      const gc = getGlobeCenter();
      const r = getGlobeRadius();

      const numStreams = 8;
      for (let i = 0; i < numStreams; i++) {
        const baseAngle = (i * Math.PI * 2) / numStreams + time * 0.0001;
        const startR = r * 1.1;
        const endR = r * 1.6 + Math.sin(time * 0.001 + i) * r * 0.2;

        const sx = gc.x + Math.cos(baseAngle) * startR;
        const sy = gc.y + Math.sin(baseAngle) * startR;
        const ex = gc.x + Math.cos(baseAngle) * endR;
        const ey = gc.y + Math.sin(baseAngle) * endR;

        const streamGrad = ctx.createLinearGradient(sx, sy, ex, ey);
        streamGrad.addColorStop(0, "rgba(16, 185, 129, 0.04)");
        streamGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.02)");
        streamGrad.addColorStop(1, "rgba(6, 182, 212, 0)");

        ctx.strokeStyle = streamGrad;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Small traveling dot on stream
        const dotT = ((time * 0.001 + i * 0.5) % 2) / 2;
        if (dotT < 1) {
          const dx = sx + (ex - sx) * dotT;
          const dy = sy + (ey - sy) * dotT;
          ctx.beginPath();
          ctx.arc(dx, dy, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${0.3 * (1 - dotT)})`;
          ctx.fill();
        }
      }
    };

    // ---- Main Loop ----
    const init = () => {
      resize();
      initArcs();
      initParticles();
    };

    const animate = (timestamp: number) => {
      // Smooth mouse interpolation
      smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.03;
      smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.03;

      // Globe rotation — auto + mouse influence
      globeRotation += 0.08;
      globeRotation += (smoothMouse.current.x - 0.5) * 0.3;

      ctx.clearRect(0, 0, width, height);

      drawBackground();
      drawParticles(timestamp);
      drawDataStreams(timestamp);
      drawGlobe(globeRotation, timestamp);
      drawFlightArcs(globeRotation, timestamp);
      drawCities(globeRotation, timestamp);
      drawOrbitRing(globeRotation, timestamp);

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / width, y: e.clientY / height };
    };

    init();
    animationRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      resize();
      initArcs();
      initParticles();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
    />
  );
}
