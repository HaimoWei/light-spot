"use client";

import { useTranslations } from "next-intl";
import { personal } from "@/data/personal";
import { ScrollAnimation } from "@/components/effects/ScrollAnimation";
import { LogoAvatar } from "@/components/ui/LogoAvatar";

type Props = {
  locale: string;
};

export function Experience({ locale }: Props) {
  const t = useTranslations("experience");
  const isZh = locale === "zh";

  function getLogoFallback(name: string) {
    const trimmed = name.trim();
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length >= 2) return words.map((w) => w[0]).join("").slice(0, 4);
    return trimmed.slice(0, 2);
  }

  return (
    <section id="experience" className="scroll-mt-28 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollAnimation>
          <h2 className="text-3xl font-black tracking-tight text-text sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-muted">
            {t("education")}
          </p>
        </ScrollAnimation>

        <div className="mt-10 grid grid-cols-1 gap-4">
          {personal.education.map((edu, index) => (
            <ScrollAnimation key={edu.id} delay={0.08 + index * 0.06}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/85 p-6 dark:bg-card/60 dark:backdrop-blur-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.12),transparent_55%)]" />
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <LogoAvatar
                      src={edu.logo}
                      alt={edu.school[isZh ? "zh" : "en"]}
                      fallback={getLogoFallback(edu.school[isZh ? "zh" : "en"])}
                    />

                    <div className="min-w-0">
                      <div className="text-lg font-bold text-text">{edu.school[isZh ? "zh" : "en"]}</div>
                      <div className="mt-1 text-sm text-text-muted">
                        {edu.degree[isZh ? "zh" : "en"]}
                        {edu.field ? ` · ${edu.field[isZh ? "zh" : "en"]}` : ""}
                      </div>
                      <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                        {edu.period[isZh ? "zh" : "en"]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
