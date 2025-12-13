"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine, type IParticlesProps } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useReducedMotion } from "framer-motion";

type ParticleOptions = NonNullable<IParticlesProps["options"]>;

export function ParticleBackground() {
  const [ready, setReady] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setHoverEnabled(window.matchMedia("(hover: hover)").matches);
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options: ParticleOptions = useMemo(
    () => ({
      background: { color: { value: "transparent" } },
      fpsLimit: reduceMotion ? 30 : 40,
      detectRetina: false,
      interactivity: {
        events: {
          onHover: { enable: hoverEnabled && !reduceMotion, mode: "grab" },
          resize: { enable: true, delay: 0.5 }
        },
        modes: {
          grab: { distance: 140, links: { opacity: 0.35 } }
        }
      },
      particles: {
        number: { value: 34, density: { enable: true } },
        color: { value: ["#3b82f6", "#60a5fa", "#8b5cf6"] },
        links: { enable: true, distance: 130, opacity: 0.16, color: "#60a5fa", width: 1 },
        move: { enable: !reduceMotion, speed: 0.9, outModes: "out" },
        opacity: { value: 0.4 },
        size: { value: { min: 1, max: 2.2 } }
      }
    }),
    [hoverEnabled, reduceMotion]
  );

  if (!ready) return null;

  return <Particles id="tsparticles" options={options} className="absolute inset-0" />;
}
