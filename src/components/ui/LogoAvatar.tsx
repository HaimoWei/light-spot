"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
};

export function LogoAvatar({ src, alt, fallback, className }: Props) {
  const [ok, setOk] = useState(true);

  const fallbackText = useMemo(() => fallback.trim().slice(0, 4).toUpperCase(), [fallback]);

  return (
    <div
      className={cn(
        "relative h-11 w-11 overflow-hidden rounded-xl border border-border bg-bg-muted/30",
        className
      )}
    >
      {src && ok ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="44px"
          className="object-contain p-1"
          onError={() => setOk(false)}
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-xs font-black text-text">
          {fallbackText}
        </div>
      )}
    </div>
  );
}

