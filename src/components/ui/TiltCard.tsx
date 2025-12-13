"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
};

export function TiltCard({ children, className, tiltAmount = 8 }: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 22, mass: 0.6 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

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

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || reduceMotion) return;
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const x = Math.max(0, Math.min(1, px)) - 0.5;
    const y = Math.max(0, Math.min(1, py)) - 0.5;

    rotateY.set(x * tiltAmount * 2);
    rotateX.set(-y * tiltAmount * 2);
  }

  if (!enabled || reduceMotion) {
    return <div className={cn("group", className)}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn("group relative [perspective:1000px]", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      <motion.div
        className="[transform-style:preserve-3d] will-change-transform"
        style={{ rotateX: rotateXSpring, rotateY: rotateYSpring }}
      >
        {children}
      </motion.div>
    </div>
  );
}
