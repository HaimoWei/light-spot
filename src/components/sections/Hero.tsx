"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { personal } from "@/data/personal";
import { Button } from "@/components/ui/Button";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { AnimatedText } from "@/components/effects/AnimatedText";
import { TypeWriter } from "@/components/effects/TypeWriter";
import { ArrowDown, FileText, FolderKanban } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  locale: string;
};

export function Hero({ locale }: Props) {
  const t = useTranslations("hero");
  const [avatarOk, setAvatarOk] = useState(true);
  const reduceMotion = useReducedMotion();

  const phrases =
    locale === "zh"
      ? ["微服务架构 · 云原生部署", "WebSocket 实时系统 · Redis", "安全优先 · 可观测 · 可维护"]
      : ["Microservices · Cloud-native deployments", "Real-time systems · WebSocket · Redis", "Security-first · Observable · Maintainable"];

  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_60%)]" />
        <ParticleBackground />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <div className="inline-flex items-center rounded-full border border-border bg-bg-muted/30 px-3 py-1 text-xs font-semibold text-text-muted">
            {personal.location} · {personal.website}
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-text sm:text-5xl lg:text-6xl">
            <AnimatedText text={t("headlinePrefix")} delay={0.15} />{" "}
            <AnimatedText
              text={personal.name}
              className="bg-gradient-to-r from-primary to-primary-2 bg-clip-text text-transparent"
              delay={0.45}
            />
          </h1>

          <p className="mt-3 text-lg font-semibold text-text-muted">{t("headlineRole")}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted">{personal.summary[locale === "zh" ? "zh" : "en"]}</p>

          <div className="mt-6">
            <TypeWriter phrases={phrases} />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#projects">
              <Button className="w-full sm:w-auto" type="button">
                <FolderKanban className="h-4 w-4" />
                {t("ctaProjects")}
              </Button>
            </a>
            <a href={`/${locale}/resume`}>
              <Button className="w-full sm:w-auto" variant="outline" type="button">
                <FileText className="h-4 w-4" />
                {t("ctaResume")}
              </Button>
            </a>
          </div>

          <div className="mt-10 flex items-center gap-2 text-sm text-text-muted">
            <ArrowDown className="h-4 w-4 animate-float" />
            <span>{t("scrollHint")}</span>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end">
          <motion.div
            className="relative h-40 w-40 will-change-transform sm:h-52 sm:w-52"
            initial={reduceMotion ? false : { scale: 0.86, opacity: 0 }}
            animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
            transition={reduceMotion ? undefined : { type: "spring", stiffness: 220, damping: 20, delay: 0.25 }}
          >
            <div
              className={cn(
                "absolute -inset-1 rounded-full bg-gradient-conic from-primary via-primary-2 to-primary opacity-70 blur-sm",
                !reduceMotion && "animate-spin-slow"
              )}
            />
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/15 to-primary-2/15 blur-xl dark:from-primary/25 dark:to-primary-2/25" />
            <div className="relative h-full w-full overflow-hidden rounded-full border border-border bg-bg-muted/40">
              {avatarOk ? (
                <Image
                  src="/images/profile.jpg"
                  alt={personal.name}
                  fill
                  sizes="(max-width: 1024px) 208px, 208px"
                  className="object-cover"
                  priority
                  onError={() => setAvatarOk(false)}
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-primary-2/10 text-3xl font-black text-text">
                  HW
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
