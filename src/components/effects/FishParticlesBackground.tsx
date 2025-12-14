"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Rgb = [number, number, number];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  mix: number;
};

type Fish = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  size: number;
  mix: number;
  wander: number;
  cooldown: number;
  target: Particle | null;
  deadAt: number | null;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function rgbToCss([r, g, b]: Rgb, alpha: number) {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function normalize(x: number, y: number) {
  const len = Math.hypot(x, y);
  if (len <= 1e-6) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
}

function wrap(value: number, max: number) {
  if (value < 0) return value + max;
  if (value > max) return value - max;
  return value;
}

function deltaWrap(from: number, to: number, size: number) {
  let d = to - from;
  const half = size / 2;
  if (d > half) d -= size;
  if (d < -half) d += size;
  return d;
}

function readRgbVar(style: CSSStyleDeclaration, name: string, fallback: Rgb): Rgb {
  const raw = style.getPropertyValue(name).trim();
  if (!raw) return fallback;
  const parts = raw.split(/\s+/).map((v) => Number(v)).filter((n) => Number.isFinite(n));
  if (parts.length < 3) return fallback;
  return [parts[0] ?? fallback[0], parts[1] ?? fallback[1], parts[2] ?? fallback[2]];
}

function drawFishV2(
  ctx: CanvasRenderingContext2D,
  fish: Fish,
  fill: string,
  stroke: string,
  timeMs: number,
  dead: boolean
) {
  const speed = Math.hypot(fish.vx, fish.vy);
  const angle = speed > 0.001 ? Math.atan2(fish.vy, fish.vx) : 0;

  const bodyRx = fish.size * 1.35;
  const bodyRy = fish.size * 0.78;

  const tailBaseX = -bodyRx * 0.95;
  const tailLength = fish.size * 0.95;
  const tailWidth = bodyRy * 1.05;
  const wag = Math.sin(timeMs / 190 + fish.mix * 12) * 0.22;
  const tailScale = 1 + wag;
  const tailTipX = tailBaseX - tailLength;
  const forkX = tailBaseX - tailLength * 0.55;

  ctx.save();
  ctx.translate(fish.x, fish.y);
  ctx.rotate(angle);
  ctx.lineWidth = 1;

  ctx.save();
  ctx.globalAlpha *= 0.7;
  ctx.beginPath();
  ctx.moveTo(tailBaseX, 0);
  ctx.quadraticCurveTo(
    tailBaseX - tailLength * 0.35,
    tailWidth * 0.85 * tailScale,
    tailTipX,
    tailWidth * 0.55 * tailScale
  );
  ctx.quadraticCurveTo(tailTipX + tailLength * 0.12, tailWidth * 0.12 * tailScale, forkX, 0);
  ctx.quadraticCurveTo(
    tailTipX + tailLength * 0.12,
    -tailWidth * 0.12 * tailScale,
    tailTipX,
    -tailWidth * 0.55 * tailScale
  );
  ctx.quadraticCurveTo(tailBaseX - tailLength * 0.35, -tailWidth * 0.85 * tailScale, tailBaseX, 0);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  const bodyGrad = ctx.createLinearGradient(bodyRx, 0, -bodyRx, 0);
  bodyGrad.addColorStop(0, "rgba(255,255,255,0.06)");
  bodyGrad.addColorStop(0.22, fill);
  bodyGrad.addColorStop(1, fill);

  ctx.beginPath();
  ctx.ellipse(0, 0, bodyRx, bodyRy, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = stroke;
  ctx.fill();
  ctx.stroke();

  const eyeX = bodyRx * 0.5;
  const eyeY = -bodyRy * 0.16;
  const eyeR = Math.max(1.4, fish.size * 0.1);
  if (dead) {
    const xSize = Math.max(3.2, eyeR * 2.1);
    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1.6, eyeR * 0.85);
    ctx.beginPath();
    ctx.moveTo(eyeX - xSize, eyeY - xSize);
    ctx.lineTo(eyeX + xSize, eyeY + xSize);
    ctx.moveTo(eyeX - xSize, eyeY + xSize);
    ctx.lineTo(eyeX + xSize, eyeY - xSize);
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = stroke;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eyeX + eyeR * 0.35, eyeY - eyeR * 0.35, Math.max(0.7, eyeR * 0.35), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fill();
  }

  ctx.restore();
}

export function FishParticlesBackground() {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);

  const boundsRef = useRef({ left: 0, top: 0, width: 1, height: 1 });
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const colorsRef = useRef<{
    primary: Rgb;
    primary2: Rgb;
    textMuted: Rgb;
  }>({
    primary: [59, 130, 246],
    primary2: [96, 165, 250],
    textMuted: [100, 116, 139]
  });

  const simRef = useRef<{ particles: Particle[]; fish: Fish[] } | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (reduceMotion) return;

    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, [reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.01 }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled || reduceMotion || !inView) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = 1;
    const targetFps = 40;
    const targetFrameMs = 1000 / targetFps;

    const countForArea = (width: number, height: number) => {
      const area = width * height;
      return {
        particleCount: Math.round(Math.max(110, Math.min(170, area / 15000))),
        fishCount: Math.round(Math.max(8, Math.min(12, area / 260000)))
      };
    };

    const repelRadius = 140;
    const eatRadius = 14;
    const seekRadius = 220;
    const keepTargetRadius = 320;
    const hitRadiusFactor = 2.1;
    const minHitRadius = 18;
    const deathFadeMs = 900;

    const updateBounds = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(canvas.clientWidth));
      const height = Math.max(1, Math.floor(canvas.clientHeight));
      boundsRef.current = { left: rect.left, top: rect.top, width, height };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(canvas.clientWidth));
      const height = Math.max(1, Math.floor(canvas.clientHeight));

      boundsRef.current = { left: rect.left, top: rect.top, width, height };

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updateColors = () => {
      const style = getComputedStyle(document.documentElement);
      colorsRef.current = {
        primary: readRgbVar(style, "--color-primary", [59, 130, 246]),
        primary2: readRgbVar(style, "--color-primary-2", [96, 165, 250]),
        textMuted: readRgbVar(style, "--color-text-muted", [100, 116, 139])
      };
    };

    const pickSizeSpeed = () => {
      const minSize = 10;
      const maxSize = 24;
      const bias = 1.75;
      const size = lerp(minSize, maxSize, Math.random() ** bias);
      const baseSpeed = randomBetween(52, 78);
      const speed = Math.max(38, Math.min(95, baseSpeed * (15 / size)));
      return { size, speed };
    };

    const resetFish = (f: Fish) => {
      const { width, height } = boundsRef.current;
      const { size, speed } = pickSizeSpeed();
      f.x = randomBetween(0, width);
      f.y = randomBetween(0, height);
      f.vx = randomBetween(-24, 24);
      f.vy = randomBetween(-24, 24);
      f.size = size;
      f.speed = speed;
      f.mix = Math.random();
      f.wander = randomBetween(0, Math.PI * 2);
      f.cooldown = randomBetween(0, 0.9);
      f.target = null;
      f.deadAt = null;
    };

    const initSimulation = () => {
      const { width, height } = boundsRef.current;
      const { particleCount, fishCount } = countForArea(width, height);

      const particles: Particle[] = Array.from({ length: particleCount }, () => ({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-10, 10),
        vy: randomBetween(-10, 10),
        size: randomBetween(1.1, 2.1),
        alpha: randomBetween(0.18, 0.5),
        mix: Math.random()
      }));

      const fish: Fish[] = Array.from({ length: fishCount }, () => ({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-24, 24),
        vy: randomBetween(-24, 24),
        ...pickSizeSpeed(),
        mix: Math.random(),
        wander: randomBetween(0, Math.PI * 2),
        cooldown: randomBetween(0, 0.9),
        target: null,
        deadAt: null
      }));

      simRef.current = { particles, fish };
    };

    const respawnParticle = (particle: Particle) => {
      const { width, height } = boundsRef.current;
      particle.x = randomBetween(0, width);
      particle.y = randomBetween(0, height);
      particle.vx = randomBetween(-10, 10);
      particle.vy = randomBetween(-10, 10);
      particle.size = randomBetween(1.1, 2.1);
      particle.alpha = randomBetween(0.18, 0.5);
      particle.mix = Math.random();
    };

    const step = (now: number) => {
      rafRef.current = window.requestAnimationFrame(step);
      if (now - lastFrameRef.current < targetFrameMs) return;

      const dt = Math.min((now - lastFrameRef.current) / 1000, 0.05);
      lastFrameRef.current = now;

      const sim = simRef.current;
      if (!sim) return;

      const { particles, fish } = sim;
      const { width, height } = boundsRef.current;

      ctx.clearRect(0, 0, width, height);

      const { primary, primary2, textMuted } = colorsRef.current;

      for (const p of particles) {
        p.x = wrap(p.x + p.vx * dt, width);
        p.y = wrap(p.y + p.vy * dt, height);

        const color = lerpRgb(primary, primary2, p.mix);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = rgbToCss(color, p.alpha);
        ctx.fill();
      }

      const mouse = mouseRef.current;
      const localMouse = mouse.active
        ? { x: mouse.x - boundsRef.current.left, y: mouse.y - boundsRef.current.top }
        : null;

      const claimedTargets = new Set<Particle>();
      const seekRadiusSq = seekRadius * seekRadius;
      const keepTargetRadiusSq = keepTargetRadius * keepTargetRadius;
      const eatRadiusSq = eatRadius * eatRadius;

      for (const f of fish) {
        if (f.deadAt != null) {
          const age = now - f.deadAt;
          const fade = 1 - Math.min(1, age / deathFadeMs);

          ctx.save();
          ctx.globalAlpha *= fade;
          const fishFill = rgbToCss(lerpRgb(primary, primary2, f.mix), 0.2);
          const fishStroke = rgbToCss(textMuted, 0.38);
          drawFishV2(ctx, f, fishFill, fishStroke, now, true);
          ctx.restore();

          if (age >= deathFadeMs) resetFish(f);
          continue;
        }

        f.cooldown = Math.max(0, f.cooldown - dt);

        let target = f.target;
        let targetDistSq = Number.POSITIVE_INFINITY;

        if (target) {
          const dx = deltaWrap(f.x, target.x, width);
          const dy = deltaWrap(f.y, target.y, height);
          targetDistSq = dx * dx + dy * dy;

          if (claimedTargets.has(target) || targetDistSq > keepTargetRadiusSq) {
            f.target = null;
            target = null;
            targetDistSq = Number.POSITIVE_INFINITY;
          } else {
            claimedTargets.add(target);
          }
        }

        if (!target && f.cooldown <= 0) {
          let best: Particle | null = null;
          let bestDistSq = Number.POSITIVE_INFINITY;

          for (const p of particles) {
            if (claimedTargets.has(p)) continue;
            const dx = deltaWrap(f.x, p.x, width);
            const dy = deltaWrap(f.y, p.y, height);
            const d2 = dx * dx + dy * dy;
            if (d2 < seekRadiusSq && d2 < bestDistSq) {
              bestDistSq = d2;
              best = p;
            }
          }

          if (best) {
            f.target = best;
            target = best;
            targetDistSq = bestDistSq;
            claimedTargets.add(best);
          }
        }

        let ax = 0;
        let ay = 0;

        if (target) {
          const dx = deltaWrap(f.x, target.x, width);
          const dy = deltaWrap(f.y, target.y, height);
          const n = normalize(dx, dy);
          ax += n.x * 1.05;
          ay += n.y * 1.05;
        }

        if (localMouse) {
          const dx = f.x - localMouse.x;
          const dy = f.y - localMouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0.001 && dist < repelRadius) {
            const strength = (1 - dist / repelRadius) * 2.2;
            const n = { x: dx / dist, y: dy / dist };
            ax += n.x * strength;
            ay += n.y * strength;
          }
        }

        f.wander += randomBetween(-1.15, 1.15) * dt;
        ax += Math.cos(f.wander) * 0.26;
        ay += Math.sin(f.wander) * 0.26;

        const desired = normalize(ax, ay);
        const speedBoost = localMouse
          ? (() => {
              const dx = f.x - localMouse.x;
              const dy = f.y - localMouse.y;
              const dist = Math.hypot(dx, dy);
              return dist < repelRadius ? 1.35 : 1;
            })()
          : 1;

        const targetVx = desired.x * f.speed * speedBoost;
        const targetVy = desired.y * f.speed * speedBoost;

        const steer = 1 - Math.exp(-8 * dt);
        f.vx += (targetVx - f.vx) * steer;
        f.vy += (targetVy - f.vy) * steer;

        const maxSpeed = f.speed * speedBoost;
        const currentSpeed = Math.hypot(f.vx, f.vy);
        if (currentSpeed > maxSpeed && currentSpeed > 0.001) {
          f.vx = (f.vx / currentSpeed) * maxSpeed;
          f.vy = (f.vy / currentSpeed) * maxSpeed;
        }

        f.x = wrap(f.x + f.vx * dt, width);
        f.y = wrap(f.y + f.vy * dt, height);

        if (target) {
          const dx = deltaWrap(f.x, target.x, width);
          const dy = deltaWrap(f.y, target.y, height);
          targetDistSq = dx * dx + dy * dy;
        }

        if (target && targetDistSq < eatRadiusSq) {
          respawnParticle(target);
          f.target = null;
          f.cooldown = randomBetween(0.6, 1.2);
          f.wander += randomBetween(-1, 1);
        }

        const fishFill = rgbToCss(lerpRgb(primary, primary2, f.mix), 0.2);
        const fishStroke = rgbToCss(textMuted, 0.38);
        drawFishV2(ctx, f, fishFill, fishStroke, now, false);
      }
    };

    resize();
    updateBounds();
    updateColors();
    initSimulation();

    let ro: ResizeObserver | null = null;
    const ResizeObserverCtor = (globalThis as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
    if (typeof ResizeObserverCtor === "function") {
      ro = new ResizeObserverCtor(() => {
        resize();
        updateBounds();
        initSimulation();
      });
      ro.observe(canvas);
    } else {
      window.addEventListener("resize", resize, { passive: true });
    }

    const mo = new MutationObserver(updateColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY, active: true };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    const interactiveSelector =
      "a, button, input, textarea, select, summary, label, [role='button'], [role='link'], [contenteditable]";

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (event.target instanceof Element && event.target.closest(interactiveSelector)) return;

      updateBounds();
      const { width, height } = boundsRef.current;
      const x = event.clientX - boundsRef.current.left;
      const y = event.clientY - boundsRef.current.top;
      if (x < 0 || y < 0 || x > width || y > height) return;

      const sim = simRef.current;
      if (!sim) return;

      let victim: Fish | null = null;
      let bestDistSq = Number.POSITIVE_INFINITY;

      for (const f of sim.fish) {
        if (f.deadAt != null) continue;
        const dx = f.x - x;
        const dy = f.y - y;
        const d2 = dx * dx + dy * dy;
        const hitRadius = Math.max(minHitRadius, f.size * hitRadiusFactor);
        const hitDistSq = hitRadius * hitRadius;
        if (d2 <= hitDistSq && d2 < bestDistSq) {
          bestDistSq = d2;
          victim = f;
        }
      }

      if (!victim) return;
      victim.deadAt = performance.now();
      victim.target = null;
      victim.cooldown = randomBetween(1.1, 1.9);
      victim.vx *= 0.2;
      victim.vy *= 0.2;
      window.dispatchEvent(new CustomEvent("fish:kill"));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", updateBounds, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true, capture: true });

    lastFrameRef.current = performance.now();
    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      simRef.current = null;

      mo.disconnect();
      ro?.disconnect();

      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", updateBounds);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("resize", resize);
    };
  }, [enabled, inView, reduceMotion]);

  if (!enabled || reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 block h-full w-full"
      aria-hidden="true"
    />
  );
}
