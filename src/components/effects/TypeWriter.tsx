"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  phrases: string[];
  typingMs?: number;
  pauseMs?: number;
};

export function TypeWriter({ phrases, typingMs = 34, pauseMs = 900 }: Props) {
  const safePhrases = useMemo(() => phrases.filter(Boolean), [phrases]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (safePhrases.length === 0) return;
    const current = safePhrases[phraseIndex % safePhrases.length] ?? "";

    const tick = window.setTimeout(() => {
      if (!isDeleting) {
        const next = Math.min(cursorIndex + 1, current.length);
        setCursorIndex(next);
        if (next === current.length) {
          window.setTimeout(() => setIsDeleting(true), pauseMs);
        }
        return;
      }

      const next = Math.max(cursorIndex - 1, 0);
      setCursorIndex(next);
      if (next === 0) {
        setIsDeleting(false);
        setPhraseIndex((v) => (v + 1) % safePhrases.length);
      }
    }, isDeleting ? Math.max(typingMs - 10, 18) : typingMs);

    return () => window.clearTimeout(tick);
  }, [cursorIndex, isDeleting, phraseIndex, safePhrases, typingMs, pauseMs]);

  const current = safePhrases.length ? safePhrases[phraseIndex % safePhrases.length] : "";
  const text = current.slice(0, cursorIndex);

  return (
    <span className="font-mono text-text-muted">
      {text}
      <span className="ml-0.5 inline-block h-4 w-[1px] animate-pulse bg-text-muted align-middle" />
    </span>
  );
}

