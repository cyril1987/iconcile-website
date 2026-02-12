"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Paper plane intro — three acts:
 *
 * ACT 1 (0 → 0.40) "Launch"
 *   A crisp paper plane launches from the bottom-left, arcing across
 *   the screen in a smooth parabolic path. It leaves a glowing
 *   emerald/cyan trail that shimmers and fades. Tiny paper confetti
 *   particles scatter in its wake.
 *
 * ACT 2 (0.35 → 0.70) "Orbit"
 *   The paper plane spirals inward toward center, shrinking as if
 *   flying into the distance. The trail curves into a circular orbit
 *   that becomes the globe outline. Grid lines and city dots emerge.
 *
 * ACT 3 (0.65 → 1.0) "Reveal"
 *   Globe fully formed with flight arcs. Canvas fades to transparent,
 *   revealing the live HeroCanvas underneath.
 */

export default function HeroIntro({
  onComplete,
  className = "",
}: {
  onComplete: () => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const t0Ref = useRef<number>(0);
  const doneRef = useRef(false);
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;

  const DURATION = 4000;

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeInOutQuart = (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

  const run = useCallback(
    (ctx: CanvasRenderingContext2D, W: number, H: number) => {
      // Seeded random
      const R: number[] = [];
      let seed = 48271;
      for (let i = 0; i < 300; i++) {
        seed = (seed * 16807 + 7) % 2147483647;
        R.push(seed / 2147483647);
      }

      // Globe target (matches HeroCanvas)
      const GX = W * 0.5;
      const GY = H * 0.52;
      const GR = Math.min(W, H) * 0.32;

      // Trail history — stores points the paper plane has visited
      const trail: { x: number; y: number; angle: number; t: number }[] = [];

      // Confetti particles spawned by the plane
      const confetti: {
        x: number; y: number; vx: number; vy: number;
        rot: number; rotV: number; size: number; alpha: number;
        color: string;
      }[] = [];

      // ---- Paper plane path: bezier curve ----
      // Act 1: launch arc from bottom-left to upper-right
      const p1Start = { x: W * -0.05, y: H * 1.05 };
      const p1Cp1 = { x: W * 0.15, y: H * 0.2 };
      const p1Cp2 = { x: W * 0.55, y: H * 0.05 };
      const p1End = { x: W * 0.78, y: H * 0.35 };

      // Act 2: curve inward to center and spiral
      const p2Start = p1End;
      const p2Cp1 = { x: W * 0.9, y: H * 0.5 };
      const p2Cp2 = { x: W * 0.65, y: H * 0.7 };
      const p2End = { x: GX, y: GY };

      function cubicBezier(
        t: number,
        p0: { x: number; y: number },
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        p3: { x: number; y: number }
      ) {
        const u = 1 - t;
        return {
          x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
          y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
        };
      }

      function cubicBezierTangent(
        t: number,
        p0: { x: number; y: number },
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        p3: { x: number; y: number }
      ) {
        const u = 1 - t;
        return {
          x: 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
          y: 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y),
        };
      }

      // Get plane position for master progress
      function getPlanePos(p: number): { x: number; y: number; angle: number; scale: number } {
        if (p < 0.40) {
          // Act 1 path
          const t = easeOutCubic(p / 0.40);
          const pos = cubicBezier(t, p1Start, p1Cp1, p1Cp2, p1End);
          const tan = cubicBezierTangent(t, p1Start, p1Cp1, p1Cp2, p1End);
          const angle = Math.atan2(tan.y, tan.x);
          return { ...pos, angle, scale: 1 };
        } else if (p < 0.70) {
          // Act 2 path — curve to center + shrink
          const t = easeInOutQuart((p - 0.40) / 0.30);
          const pos = cubicBezier(t, p2Start, p2Cp1, p2Cp2, p2End);
          const tan = cubicBezierTangent(t, p2Start, p2Cp1, p2Cp2, p2End);
          const angle = Math.atan2(tan.y, tan.x);
          const scale = 1 - t * 0.85;
          return { ...pos, angle, scale };
        } else {
          // Settled at center, invisible
          return { x: GX, y: GY, angle: 0, scale: 0.1 };
        }
      }

      let lastTrailTime = 0;
      let lastConfettiTime = 0;

      // ---- Frame ----
      const frame = (ts: number) => {
        if (!t0Ref.current) t0Ref.current = ts;
        const elapsed = ts - t0Ref.current;
        const p = Math.min(elapsed / DURATION, 1);

        ctx.clearRect(0, 0, W, H);

        // Background
        ctx.fillStyle = "#030712";
        ctx.fillRect(0, 0, W, H);

        // === Ambient glow at globe position (builds up) ===
        if (p > 0.25) {
          const glowP = Math.min((p - 0.25) / 0.5, 1);
          const ambGlow = ctx.createRadialGradient(GX, GY, 0, GX, GY, GR * 1.5);
          ambGlow.addColorStop(0, `rgba(16,185,129,${glowP * 0.03})`);
          ambGlow.addColorStop(0.5, `rgba(6,182,212,${glowP * 0.015})`);
          ambGlow.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = ambGlow;
          ctx.fillRect(0, 0, W, H);
        }

        // === Paper plane ===
        if (p < 0.72) {
          const plane = getPlanePos(p);
          const fade = p > 0.62 ? 1 - (p - 0.62) / 0.10 : 1;

          // Record trail point
          if (elapsed - lastTrailTime > 12) {
            trail.push({ x: plane.x, y: plane.y, angle: plane.angle, t: elapsed });
            lastTrailTime = elapsed;
          }

          // Spawn confetti
          if (p < 0.55 && elapsed - lastConfettiTime > 50) {
            const spawnCount = 2;
            for (let c = 0; c < spawnCount; c++) {
              const ri = (confetti.length * 7 + c * 13) % 300;
              confetti.push({
                x: plane.x - Math.cos(plane.angle) * 15 * plane.scale,
                y: plane.y - Math.sin(plane.angle) * 15 * plane.scale,
                vx: (R[ri] - 0.5) * 2 - Math.cos(plane.angle) * 0.5,
                vy: (R[(ri + 1) % 300] - 0.5) * 2 + 0.3,
                rot: R[(ri + 2) % 300] * Math.PI * 2,
                rotV: (R[(ri + 3) % 300] - 0.5) * 0.15,
                size: 2 + R[(ri + 4) % 300] * 4,
                alpha: 0.4 + R[(ri + 5) % 300] * 0.4,
                color: c % 2 === 0 ? "16,185,129" : "6,182,212",
              });
            }
            lastConfettiTime = elapsed;
          }

          // Draw paper plane
          drawPaperPlane(ctx, plane.x, plane.y, plane.angle, plane.scale, fade, W, H);
        }

        // === Trail ===
        drawTrail(ctx, trail, elapsed, W, H, p);

        // === Confetti ===
        drawConfetti(ctx, confetti, p);

        // === Globe formation (p 0.30 → 0.85) ===
        if (p >= 0.30 && p < 0.88) {
          const gp = Math.min((p - 0.30) / 0.40, 1);
          const ge = easeInOutQuart(gp);

          // Globe circle
          const arcLen = ge * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(GX, GY, GR, -Math.PI / 2, -Math.PI / 2 + arcLen);
          ctx.strokeStyle = `rgba(16,185,129,${0.12 * ge})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Atmosphere
          if (ge > 0.25) {
            const aa = (ge - 0.25) / 0.75;
            const atmo = ctx.createRadialGradient(GX, GY, GR * 0.92, GX, GY, GR * 1.15);
            atmo.addColorStop(0, `rgba(16,185,129,${aa * 0.035})`);
            atmo.addColorStop(0.5, `rgba(6,182,212,${aa * 0.018})`);
            atmo.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = atmo;
            ctx.beginPath();
            ctx.arc(GX, GY, GR * 1.15, 0, Math.PI * 2);
            ctx.fill();
          }

          // Globe sphere fill
          if (ge > 0.3) {
            const sa = (ge - 0.3) / 0.7;
            const sph = ctx.createRadialGradient(GX - GR * 0.3, GY - GR * 0.3, 0, GX, GY, GR);
            sph.addColorStop(0, `rgba(15,25,40,${sa * 0.3})`);
            sph.addColorStop(0.7, `rgba(8,15,25,${sa * 0.2})`);
            sph.addColorStop(1, `rgba(3,7,18,${sa * 0.1})`);
            ctx.fillStyle = sph;
            ctx.beginPath();
            ctx.arc(GX, GY, GR, 0, Math.PI * 2);
            ctx.fill();
          }

          // Grid
          if (ge > 0.4) {
            drawGlobeGrid(ctx, GX, GY, GR, (ge - 0.4) / 0.6 * 0.05, elapsed);
          }

          // Cities
          if (ge > 0.5) {
            drawGlobeCities(ctx, GX, GY, GR, (ge - 0.5) / 0.5, elapsed);
          }

          // Flight arcs
          if (ge > 0.55) {
            drawGlobeFlightArcs(ctx, GX, GY, GR, (ge - 0.55) / 0.45, elapsed);
          }
        }

        // === Reveal fade (p 0.72 → 1.0) ===
        if (p >= 0.72) {
          const rp = (p - 0.72) / 0.28;
          const re = easeOutQuint(rp);

          // Pulse ring
          if (rp < 0.5) {
            const ringR = GR * 0.3 + re * GR * 1.8;
            ctx.beginPath();
            ctx.arc(GX, GY, ringR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(16,185,129,${0.1 * (1 - re)})`;
            ctx.lineWidth = 1.5 * (1 - re);
            ctx.stroke();
          }

          // Fade bg to transparent
          ctx.fillStyle = `rgba(3,7,18,${1 - re})`;
          ctx.fillRect(0, 0, W, H);

          // Bloom
          if (re < 0.7) {
            const bR = GR * (0.4 + re * 1.2);
            const bloom = ctx.createRadialGradient(GX, GY, 0, GX, GY, bR);
            bloom.addColorStop(0, `rgba(16,185,129,${0.06 * (1 - re)})`);
            bloom.addColorStop(0.4, `rgba(6,182,212,${0.03 * (1 - re)})`);
            bloom.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = bloom;
            ctx.beginPath();
            ctx.arc(GX, GY, bR, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Done
        if (p >= 1 && !doneRef.current) {
          doneRef.current = true;
          cbRef.current();
          return;
        }
        if (p < 1) animRef.current = requestAnimationFrame(frame);
      };

      animRef.current = requestAnimationFrame(frame);
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = cvs.parentElement?.getBoundingClientRect();
    const W = rect?.width || window.innerWidth;
    const H = rect?.height || window.innerHeight;
    cvs.width = W * dpr;
    cvs.height = H * dpr;
    cvs.style.width = W + "px";
    cvs.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    run(ctx, W, H);
    return () => cancelAnimationFrame(animRef.current);
  }, [run]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-50 ${className}`}
    />
  );
}

// ====================================================================
//  Drawing helpers
// ====================================================================

/** Paper plane — clean geometric origami shape */
function drawPaperPlane(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number,
  alpha: number,
  W: number,
  H: number
) {
  if (alpha <= 0 || scale <= 0) return;
  const S = Math.min(W, H) * 0.04 * scale;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;

  // Shadow/glow underneath
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, S * 3);
  glow.addColorStop(0, "rgba(16,185,129,0.08)");
  glow.addColorStop(1, "rgba(16,185,129,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, S * 3, 0, Math.PI * 2);
  ctx.fill();

  // === Paper plane shape (nose pointing right along x-axis) ===

  // Top fold (lighter)
  ctx.beginPath();
  ctx.moveTo(S * 2.2, 0);          // Nose tip
  ctx.lineTo(-S * 1.2, -S * 1.0);  // Top-left wing tip
  ctx.lineTo(-S * 0.3, 0);         // Center crease
  ctx.closePath();
  const topGrad = ctx.createLinearGradient(-S * 1.2, -S * 1.0, S * 2.2, 0);
  topGrad.addColorStop(0, "rgba(16,185,129,0.25)");
  topGrad.addColorStop(0.5, "rgba(16,185,129,0.55)");
  topGrad.addColorStop(1, "rgba(255,255,255,0.15)");
  ctx.fillStyle = topGrad;
  ctx.fill();

  // Top fold outline
  ctx.strokeStyle = "rgba(16,185,129,0.7)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Bottom fold (darker)
  ctx.beginPath();
  ctx.moveTo(S * 2.2, 0);          // Nose tip
  ctx.lineTo(-S * 0.3, 0);         // Center crease
  ctx.lineTo(-S * 1.2, S * 1.0);   // Bottom-left wing tip
  ctx.closePath();
  const botGrad = ctx.createLinearGradient(-S * 1.2, S * 1.0, S * 2.2, 0);
  botGrad.addColorStop(0, "rgba(6,182,212,0.2)");
  botGrad.addColorStop(0.5, "rgba(16,185,129,0.4)");
  botGrad.addColorStop(1, "rgba(255,255,255,0.1)");
  ctx.fillStyle = botGrad;
  ctx.fill();

  // Bottom fold outline
  ctx.strokeStyle = "rgba(6,182,212,0.5)";
  ctx.lineWidth = 0.6;
  ctx.stroke();

  // Center crease line (fold edge)
  ctx.beginPath();
  ctx.moveTo(S * 2.2, 0);
  ctx.lineTo(-S * 0.3, 0);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Tail fold details
  ctx.beginPath();
  ctx.moveTo(-S * 0.3, 0);
  ctx.lineTo(-S * 0.9, -S * 0.15);
  ctx.strokeStyle = "rgba(16,185,129,0.2)";
  ctx.lineWidth = 0.4;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-S * 0.3, 0);
  ctx.lineTo(-S * 0.9, S * 0.15);
  ctx.strokeStyle = "rgba(6,182,212,0.2)";
  ctx.lineWidth = 0.4;
  ctx.stroke();

  // Nose highlight
  ctx.beginPath();
  ctx.arc(S * 1.8, 0, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.restore();
}

/** Glowing trail behind the plane */
function drawTrail(
  ctx: CanvasRenderingContext2D,
  trail: { x: number; y: number; angle: number; t: number }[],
  now: number,
  W: number,
  H: number,
  masterP: number
) {
  if (trail.length < 2) return;

  // Fade out trail in reveal phase
  const trailFade = masterP > 0.65 ? Math.max(1 - (masterP - 0.65) / 0.15, 0) : 1;
  if (trailFade <= 0) return;

  // Draw gradient trail
  for (let i = 1; i < trail.length; i++) {
    const age = (now - trail[i].t) / 1000; // seconds
    const maxAge = 2.5;
    if (age > maxAge) continue;

    const a = trail[i - 1];
    const b = trail[i];
    const life = 1 - age / maxAge;
    const alpha = life * life * 0.35 * trailFade;

    if (alpha < 0.005) continue;

    // Main line
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
    ctx.lineWidth = 1.5 * life + 0.5;
    ctx.stroke();

    // Secondary glow line (wider, more transparent)
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(6,182,212,${alpha * 0.3})`;
    ctx.lineWidth = 4 * life;
    ctx.stroke();
  }

  // Shimmer dots along trail
  for (let i = 0; i < trail.length; i += 4) {
    const age = (now - trail[i].t) / 1000;
    if (age > 2) continue;
    const life = 1 - age / 2;
    const shimmer = Math.sin(now * 0.005 + i * 0.7) * 0.5 + 0.5;
    const alpha = life * shimmer * 0.25 * trailFade;
    if (alpha < 0.01) continue;

    ctx.beginPath();
    ctx.arc(trail[i].x, trail[i].y, 1 + life * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }
}

/** Tiny paper confetti particles */
function drawConfetti(
  ctx: CanvasRenderingContext2D,
  particles: {
    x: number; y: number; vx: number; vy: number;
    rot: number; rotV: number; size: number; alpha: number;
    color: string;
  }[],
  masterP: number
) {
  const confettiFade = masterP > 0.55 ? Math.max(1 - (masterP - 0.55) / 0.2, 0) : 1;

  for (const p of particles) {
    // Physics
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.015; // gravity
    p.vx *= 0.995;
    p.rot += p.rotV;
    p.alpha *= 0.997;

    const a = p.alpha * confettiFade;
    if (a < 0.01) continue;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    // Tiny diamond/rhombus shape (like a folded paper scrap)
    const s = p.size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.5, 0);
    ctx.lineTo(0, s * 0.6);
    ctx.lineTo(-s * 0.5, 0);
    ctx.closePath();
    ctx.fillStyle = `rgba(${p.color},${a})`;
    ctx.fill();

    ctx.restore();
  }
}

// === Globe drawing (shared with previous version) ===

function drawGlobeGrid(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  alpha: number, time: number
) {
  const rot = time * 0.008;

  for (let lat = -60; lat <= 60; lat += 30) {
    ctx.beginPath();
    let first = true;
    for (let lng = 0; lng <= 360; lng += 4) {
      const p = proj(lat, lng, rot, cx, cy, r);
      if (!p.v) { first = true; continue; }
      if (first) { ctx.moveTo(p.x, p.y); first = false; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  for (let lng = 0; lng < 360; lng += 30) {
    ctx.beginPath();
    let first = true;
    for (let lat = -90; lat <= 90; lat += 4) {
      const p = proj(lat, lng, rot, cx, cy, r);
      if (!p.v) { first = true; continue; }
      if (first) { ctx.moveTo(p.x, p.y); first = false; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = `rgba(16,185,129,${alpha * 0.6})`;
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }
}

function drawGlobeCities(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  alpha: number, time: number
) {
  const rot = time * 0.008;
  const cities = [
    { lat: 28.6, lng: 77.2, s: 3 },
    { lat: 25.3, lng: 55.3, s: 3 },
    { lat: 51.5, lng: -0.1, s: 2.5 },
    { lat: 40.7, lng: -74, s: 2.5 },
    { lat: 1.3, lng: 103.8, s: 2.5 },
    { lat: 24.5, lng: 54.6, s: 2 },
    { lat: 23.8, lng: 90.4, s: 2 },
    { lat: 24.7, lng: 46.7, s: 2 },
    { lat: 35.7, lng: 139.7, s: 2 },
    { lat: -33.9, lng: 151.2, s: 2 },
    { lat: 19.1, lng: 72.9, s: 2 },
    { lat: 43.7, lng: -79.4, s: 2 },
  ];

  for (const c of cities) {
    const p = proj(c.lat, c.lng, rot, cx, cy, r);
    if (!p.v || p.z < 0) continue;
    const da = alpha * (0.3 + p.z * 0.7);
    const sz = c.s * (0.5 + p.z * 0.5);

    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 4);
    g.addColorStop(0, `rgba(16,185,129,${da * 0.15})`);
    g.addColorStop(1, "rgba(16,185,129,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, sz * 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(16,185,129,${da})`;
    ctx.fill();

    const pulse = sz * 2 + Math.sin(time * 0.003 + c.lat) * 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(16,185,129,${da * 0.2})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}

function drawGlobeFlightArcs(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  alpha: number, time: number
) {
  const rot = time * 0.008;
  const routes = [
    [28.6, 77.2, 25.3, 55.3],
    [28.6, 77.2, 51.5, -0.1],
    [28.6, 77.2, 1.3, 103.8],
    [25.3, 55.3, 51.5, -0.1],
    [51.5, -0.1, 40.7, -74],
    [40.7, -74, 43.7, -79.4],
    [1.3, 103.8, 35.7, 139.7],
    [25.3, 55.3, 24.7, 46.7],
    [28.6, 77.2, 23.8, 90.4],
    [28.6, 77.2, 19.1, 72.9],
  ];

  const steps = 40;
  for (let ri = 0; ri < routes.length; ri++) {
    const [lat1, lng1, lat2, lng2] = routes[ri];
    const stagger = ri * 0.06;
    const localA = Math.min(Math.max((alpha - stagger) / 0.5, 0), 1);
    if (localA <= 0) continue;

    const pts: { x: number; y: number; z: number; v: boolean }[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = lat1 + (lat2 - lat1) * t;
      const lng = lng1 + (lng2 - lng1) * t;
      const p = proj(lat, lng, rot, cx, cy, r);
      const elev = Math.sin(t * Math.PI) * r * 0.12;
      const dx = p.x - cx;
      const dy = p.y - cy;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      p.x += (dx / d) * elev;
      p.y += (dy / d) * elev;
      pts.push(p);
    }

    ctx.beginPath();
    let started = false;
    for (const pt of pts) {
      if (!pt.v || pt.z < -0.1) { started = false; continue; }
      if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
      else ctx.lineTo(pt.x, pt.y);
    }
    const color = ri % 2 === 0 ? "16,185,129" : "6,182,212";
    ctx.strokeStyle = `rgba(${color},${localA * 0.08})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    const dotT = ((time * 0.0004 + ri * 0.15) % 1);
    const dotIdx = Math.floor(dotT * steps);
    if (dotIdx < pts.length && pts[dotIdx].v && pts[dotIdx].z > 0) {
      const dp = pts[dotIdx];
      for (let t = 0; t < 8; t++) {
        const ti = dotIdx - t;
        if (ti < 0 || !pts[ti].v) continue;
        const ta = (1 - t / 8) * localA * 0.4;
        const ts = (1 - t / 8) * 2;
        ctx.beginPath();
        ctx.arc(pts[ti].x, pts[ti].y, ts, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${ta})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(dp.x, dp.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${localA * 0.7})`;
      ctx.fill();

      const dg = ctx.createRadialGradient(dp.x, dp.y, 0, dp.x, dp.y, 6);
      dg.addColorStop(0, `rgba(${color},${localA * 0.15})`);
      dg.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = dg;
      ctx.beginPath();
      ctx.arc(dp.x, dp.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Globe projection */
function proj(lat: number, lng: number, rot: number, cx: number, cy: number, r: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + rot) * Math.PI) / 180;
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return { x: cx + x * r, y: cy - y * r, z, v: z > -0.1 };
}
