"use client";

import { useTranslations } from "next-intl";
import { skills } from "@/data/skills";
import { ScrollAnimation } from "@/components/effects/ScrollAnimation";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  locale: string;
};

function groupLabel(t: ReturnType<typeof useTranslations>, key: string) {
  switch (key) {
    case "backend":
      return t("backend");
    case "frontend":
      return t("frontend");
    case "dataDevops":
      return t("dataDevops");
    case "tools":
      return t("tools");
    default:
      return key;
  }
}

const iconContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const iconItem = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 20 }
  }
};

export function About({ locale }: Props) {
  const t = useTranslations("about");
  const reduceMotion = useReducedMotion();

  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    acc[s.category] ||= [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const orderedKeys = ["backend", "frontend", "dataDevops", "tools"];

  return (
    <section id="about" className="scroll-mt-28 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollAnimation>
          <h2 className="text-3xl font-black tracking-tight text-text sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 text-base leading-relaxed text-text-muted">{t("subtitle")}</p>
        </ScrollAnimation>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <ScrollAnimation delay={0.08}>
              <div className="rounded-2xl border border-border bg-card/85 p-6 dark:bg-card/60 dark:backdrop-blur-sm">
                <div className="text-sm font-bold text-text">{t("skillsTitle")}</div>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {orderedKeys.map((key, index) => {
                    const list = grouped[key] ?? [];
                    if (list.length === 0) return null;

                    return (
                      <ScrollAnimation key={key} delay={0.06 * index}>
                        <div>
                          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                            {groupLabel(t, key)}
                          </div>
                          <motion.div
                            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                            variants={reduceMotion ? undefined : iconContainer}
                            initial={reduceMotion ? false : "hidden"}
                            whileInView={reduceMotion ? undefined : "visible"}
                            viewport={{ once: true, amount: 0.2 }}
                          >
                            {list.map((s) => (
                              <motion.div
                                key={s.name}
                                variants={reduceMotion ? undefined : iconItem}
                                className="flex items-center gap-2 rounded-xl border border-border bg-bg-muted/20 px-3 py-2 text-sm text-text-muted transition hover:border-primary/50 hover:bg-bg-muted/30 hover:text-text"
                              >
                                {s.iconClass ? <i className={`${s.iconClass} text-base`} /> : null}
                                <span className="truncate">{s.name}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      </ScrollAnimation>
                    );
                  })}
                </div>
                {locale === "zh" ? (
                  <p className="mt-6 text-xs text-text-muted">
                    图标来自 Devicon（CDN）。如需离线/内网部署，可替换为本地图标资源。
                  </p>
                ) : (
                  <p className="mt-6 text-xs text-text-muted">
                    Icons are loaded via Devicon CDN. For offline/internal deployments, replace with local assets.
                  </p>
                )}
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
