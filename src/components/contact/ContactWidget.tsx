"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Mail, X } from "lucide-react";
import { personal } from "@/data/personal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const responseSchema = z.union([
  z.object({ ok: z.literal(true) }),
  z.object({
    ok: z.literal(false),
    error: z.string().optional(),
    retryAfterSec: z.number().optional()
  })
]);

type Status = "idle" | "sending" | "sent" | "error" | "rate_limited" | "not_configured";

export function ContactWidget() {
  const t = useTranslations("contact");
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [isTriggerHovered, setIsTriggerHovered] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [retryAfterSec, setRetryAfterSec] = useState<number | null>(null);
  const hasNudgedRef = useRef(false);

  const schema = useMemo(
    () =>
      z.object({
        contact: z.string().trim().min(3).max(120),
        message: z.string().trim().min(10).max(2000),
        company: z.string().optional()
      }),
    []
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { contact: "", message: "", company: "" }
  });

  useEffect(() => {
    const onOpen = () => {
      hasNudgedRef.current = true;
      setShowNudge(false);
      setRevealed(true);
      setOpen(true);
    };
    window.addEventListener("open-contact-widget", onOpen);
    return () => window.removeEventListener("open-contact-widget", onOpen);
  }, []);

  useEffect(() => {
    const projects = document.getElementById("projects");
    if (!projects) {
      setRevealed(true);
      return;
    }

    let observer: IntersectionObserver | null = null;

    const startObserving = () => {
      if (observer) return;

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setRevealed(true);
            observer?.disconnect();
            observer = null;
          }
        },
        { threshold: 0.01, rootMargin: "0px 0px -35% 0px" }
      );

      observer.observe(projects);
    };

    if (window.scrollY > 0) startObserving();
    else {
      const onFirstScroll = () => {
        startObserving();
        window.removeEventListener("scroll", onFirstScroll);
      };
      window.addEventListener("scroll", onFirstScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onFirstScroll);
        observer?.disconnect();
      };
    }

    return () => observer?.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (!open) return;
    form.setFocus("contact");
    setShowNudge(false);
    setIsTriggerHovered(false);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [form, open]);

  useEffect(() => {
    if (!revealed || open || hasNudgedRef.current) return;

    hasNudgedRef.current = true;
    const delayMs = 0;
    const visibleMs = 2000;
    const showTimer = window.setTimeout(() => setShowNudge(true), delayMs);
    const hideTimer = window.setTimeout(() => {
      setShowNudge(false);
      setIsTriggerHovered(false);
    }, delayMs + visibleMs);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [open, revealed]);

  async function onSubmit(values: FormValues) {
    setStatus("sending");
    setRetryAfterSec(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values)
      });

      const raw = await res.json().catch(() => ({}));
      const parsed = responseSchema.safeParse(raw);
      if (!parsed.success) throw new Error("Invalid response");
      const data = parsed.data;

      if (!res.ok || data.ok !== true) {
        if (res.status === 429) {
          setRetryAfterSec(data.ok === false ? (data.retryAfterSec ?? null) : null);
          setStatus("rate_limited");
          window.setTimeout(() => setStatus("idle"), 4000);
          return;
        }
        if (res.status === 503 && data.ok === false && data.error === "NOT_CONFIGURED") {
          setStatus("not_configured");
          window.setTimeout(() => setStatus("idle"), 6000);
          return;
        }

        throw new Error("Contact send failed");
      }

      form.reset();
      setStatus("sent");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const hintVariants = useMemo<Variants>(() => {
    if (reduceMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0 } },
        exit: { opacity: 0, transition: { duration: 0 } }
      };
    }

    return {
      hidden: { opacity: 0, x: 10, y: 6, scale: 0.96 },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 520, damping: 30, mass: 0.8 }
      },
      exit: {
        opacity: 0,
        x: 16,
        y: 0,
        scale: 0.96,
        rotate: [0, -12, 12, -8, 8, 0],
        transition: {
          duration: 0.45,
          ease: [0.2, 0.8, 0.2, 1]
        }
      }
    };
  }, [reduceMotion]);

  return (
    <div className="no-print fixed right-6 top-2/3 z-[60] flex -translate-y-1/2 flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            className="w-[360px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-border bg-bg/95 shadow-glow backdrop-blur-sm dark:bg-bg/75"
            role="dialog"
            aria-label={t("title")}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="text-sm font-bold text-text">{t("title")}</div>
              <Button
                type="button"
                variant="ghost"
                className="h-9 w-9 rounded-full p-0"
                aria-label={t("close")}
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-4 py-4">
              <p className="mb-4 text-xs leading-relaxed text-text-muted">{t("hint")}</p>

              <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                  <div className="mb-1.5 text-xs font-semibold text-text-muted">{t("contactLabel")}</div>
                  <Input
                    placeholder={t("contactPlaceholder")}
                    {...form.register("contact")}
                    disabled={status === "sending"}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <div className="mb-1.5 text-xs font-semibold text-text-muted">{t("messageLabel")}</div>
                  <Textarea
                    placeholder={t("messagePlaceholder")}
                    {...form.register("message")}
                    disabled={status === "sending"}
                  />
                </div>

                <input
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  {...form.register("company")}
                />

                <div className="flex items-center gap-3">
                  <Button disabled={status === "sending"} type="submit" className="w-full">
                    {status === "sending" ? t("sending") : t("send")}
                  </Button>
                </div>

                {status === "sent" ? <div className="text-sm text-success">{t("sent")}</div> : null}
                {status === "rate_limited" ? (
                  <div className="text-sm text-text-muted">{t("rateLimited", { seconds: retryAfterSec ?? 30 })}</div>
                ) : null}
                {status === "not_configured" ? (
                  <div className="text-sm text-text-muted">{t("notConfigured", { email: personal.email })}</div>
                ) : null}
                {status === "error" ? <div className="text-sm text-text-muted">{t("failed")}</div> : null}
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {!open && revealed ? (
          <motion.div
            key="trigger"
            initial={reduceMotion ? false : { opacity: 0, x: 18, y: 18, scale: 0.9 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 18, y: 14, scale: 0.96 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 28, mass: 0.9 }
            }
            className="relative flex items-center gap-2"
            onMouseEnter={() => setIsTriggerHovered(true)}
            onMouseLeave={() => setIsTriggerHovered(false)}
            onFocusCapture={() => setIsTriggerHovered(true)}
            onBlurCapture={() => setIsTriggerHovered(false)}
          >
            <AnimatePresence>
              {showNudge || isTriggerHovered ? (
                <motion.div
                  key="hint"
                  variants={hintVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="pointer-events-none relative max-w-[240px] whitespace-nowrap rounded-[18px] bg-gradient-to-br from-primary to-primary-2 px-4 py-2.5 text-xs font-semibold text-white shadow-glow ring-1 ring-white/15 origin-right"
                >
                  {t("widgetHint")}
                  <span
                    aria-hidden="true"
                    className="absolute -right-[7px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[7px] border-y-transparent border-l-[10px] border-l-primary-2 drop-shadow"
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="relative">
              <AnimatePresence>
                {showNudge && !reduceMotion ? (
                  <motion.span
                    key="ripple"
                    className="pointer-events-none absolute inset-0 rounded-full bg-primary/20"
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: [0.35, 0.15, 0], scale: [1, 1.35, 1.85] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                  />
                ) : null}
              </AnimatePresence>

              {!reduceMotion ? (
                <span className="pointer-events-none absolute -inset-3 rounded-full bg-primary/25 blur-2xl animate-pulse" />
              ) : null}
              <Button
                type="button"
                aria-label={t("openWidget")}
                className="relative h-12 w-12 rounded-full p-0 shadow-glow ring-1 ring-primary/35"
                onClick={() => {
                  hasNudgedRef.current = true;
                  setShowNudge(false);
                  setRevealed(true);
                  setOpen(true);
                }}
              >
                <motion.span
                  initial={false}
                  animate={
                    showNudge && !reduceMotion
                      ? { scale: [1, 1.08, 1.02, 1.06, 1], rotate: [0, -18, 18, -12, 12, -6, 6, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={
                    showNudge && !reduceMotion
                      ? { duration: 0.75, ease: [0.2, 0.8, 0.2, 1], repeat: 1, repeatDelay: 0.08 }
                      : { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }
                  }
                  className="inline-flex"
                  style={{ transformOrigin: "50% 10%" }}
                >
                  <Mail className="h-5 w-5" />
                </motion.span>
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
