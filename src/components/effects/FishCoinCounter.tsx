"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Coins } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Pop = {
  id: number;
  dx: number;
  rotate: number;
};

export function FishCoinCounter() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [coins, setCoins] = useState(0);
  const [pops, setPops] = useState<Pop[]>([]);

  const nextIdRef = useRef(1);
  const timeoutsRef = useRef<number[]>([]);

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
    if (!enabled || reduceMotion) return;

    const onKill = () => {
      setCoins((value) => value + 1);

      const id = nextIdRef.current++;
      const pop: Pop = {
        id,
        dx: Math.round((Math.random() - 0.4) * 18),
        rotate: Math.round((Math.random() - 0.5) * 18)
      };

      setPops((items) => [...items, pop]);

      const timeout = window.setTimeout(() => {
        setPops((items) => items.filter((item) => item.id !== id));
      }, 850);
      timeoutsRef.current.push(timeout);
    };

    window.addEventListener("fish:kill", onKill as EventListener, { passive: true });
    return () => {
      window.removeEventListener("fish:kill", onKill as EventListener);
      for (const timeout of timeoutsRef.current) window.clearTimeout(timeout);
      timeoutsRef.current = [];
    };
  }, [enabled, reduceMotion]);

  if (!enabled || reduceMotion) return null;

  return (
    <div className="no-print pointer-events-none fixed bottom-4 right-4 z-30 select-none">
      <div className="relative">
        <motion.div
          key={coins}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 0.32, ease: "easeOut", times: [0, 0.45, 1] }}
          className="flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/60 px-3 py-2 text-sm text-slate-800 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/40 dark:text-slate-200"
        >
          <Coins className="h-4 w-4 text-amber-500 dark:text-amber-400" aria-hidden="true" />
          <span className="tabular-nums">{coins}</span>
        </motion.div>

        <AnimatePresence>
          {pops.map((pop) => (
            <motion.div
              key={pop.id}
              initial={{ opacity: 0, y: 8, scale: 0.9, x: pop.dx, rotate: pop.rotate }}
              animate={{ opacity: 1, y: -20, scale: 1, x: pop.dx, rotate: pop.rotate }}
              exit={{ opacity: 0, y: -36, scale: 0.88, x: pop.dx, rotate: pop.rotate }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="pointer-events-none absolute right-2 top-0 flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            >
              <Coins className="h-3.5 w-3.5" aria-hidden="true" />
              <span>+1</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
