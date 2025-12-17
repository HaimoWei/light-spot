"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

export function VisitTracker() {
  const pathname = usePathname();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    if (!pathname) return;

    if (pathname.endsWith("/visits")) {
      trackedRef.current = true;
      return;
    }

    trackedRef.current = true;

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/visits");
        return;
      }
    } catch {
      // fall through
    }

    fetch("/api/visits", { method: "POST", keepalive: true }).catch(() => {});
  }, [pathname]);

  return null;
}

