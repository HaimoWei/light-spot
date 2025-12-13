"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { ScrollAnimation } from "@/components/effects/ScrollAnimation";
import { ExternalLink, Github } from "lucide-react";

const badgeOverlayClass =
  "border-border/80 bg-bg/90 text-text shadow-sm backdrop-blur-sm dark:bg-bg/70 dark:text-text";
const badgeSuccessOverlayClass = "border-success/50 bg-success/20 text-success shadow-sm backdrop-blur-sm";

type Props = {
  locale: string;
};

export function Projects({ locale }: Props) {
  const t = useTranslations("projects");
  const isZh = locale === "zh";

  return (
    <section id="projects" className="scroll-mt-28 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollAnimation>
          <h2 className="text-3xl font-black tracking-tight text-text sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-muted">{t("subtitle")}</p>
        </ScrollAnimation>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((p, index) => (
            <ScrollAnimation key={p.id} delay={0.06 * index}>
              <TiltCard className="h-full cursor-pointer">
                <Card
                  role="link"
                  tabIndex={0}
                  className="cursor-pointer overflow-hidden will-change-transform group-hover:scale-[1.01] group-hover:border-primary/50 group-hover:shadow-glow group-focus-within:scale-[1.01] group-focus-within:border-primary/50 group-focus-within:shadow-glow"
                  onClick={() => window.open(p.demoUrl, "_blank", "noreferrer")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") window.open(p.demoUrl, "_blank", "noreferrer");
                  }}
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition duration-300 ease-out group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <Badge tone="success" className={badgeSuccessOverlayClass}>
                        {t("deployed")}
                      </Badge>
                      <Badge className={badgeOverlayClass}>
                        {p.collaboration === "personal" ? t("personal") : t("team")}
                      </Badge>
                      <Badge className={badgeOverlayClass}>
                        {t("contributionLabel")}: {p.contribution}%
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold text-text">{isZh ? p.titleZh : p.title}</div>
                        <div className="mt-1 text-xs text-text-muted">
                          {isZh ? p.roleZh : p.role} ·{" "}
                          {p.collaboration === "personal" ? t("personalProject") : t("teamProject")}
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-text-muted" />
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-text-muted">
                      {isZh ? p.descriptionZh : p.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.technologies.slice(0, 7).map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-text-muted">
                      {(isZh ? p.highlightsZh : p.highlights).slice(0, 4).map((h) => (
                        <li key={h} className="flex gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-primary/70" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button type="button" className="w-full sm:w-auto">
                        <ExternalLink className="h-4 w-4" />
                        {t("liveDemo")}
                      </Button>

                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                          <Github className="h-4 w-4" />
                          {t("repo")}
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              </TiltCard>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
