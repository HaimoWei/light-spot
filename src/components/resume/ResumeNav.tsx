"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  label: string;
};

type Props = {
  items: Item[];
};

export function ResumeNav({ items }: Props) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.1, 0.2, 0.4, 0.6] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "block rounded-xl px-3 py-2 text-sm font-semibold text-text-muted transition hover:bg-bg-muted/40 hover:text-text",
            active === item.id && "bg-bg-muted/40 text-text"
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

