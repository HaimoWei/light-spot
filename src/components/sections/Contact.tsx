"use client";

import { useTranslations } from "next-intl";
import { personal } from "@/data/personal";
import { ScrollAnimation } from "@/components/effects/ScrollAnimation";
import { Button } from "@/components/ui/Button";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="scroll-mt-28 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollAnimation>
          <h2 className="text-3xl font-black tracking-tight text-text sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-muted">{t("subtitle")}</p>
        </ScrollAnimation>

        <ScrollAnimation delay={0.08}>
          <div className="mt-10 rounded-2xl border border-border bg-card/85 p-6 dark:bg-card/60 dark:backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-text-muted">
                <a className="inline-flex items-center gap-2 hover:text-text" href={`mailto:${personal.email}`}>
                  <Mail className="h-4 w-4" />
                  {personal.email}
                </a>
                <a
                  className="inline-flex items-center gap-2 hover:text-text"
                  href={`tel:${personal.phone.replaceAll(" ", "")}`}
                >
                  <Phone className="h-4 w-4" />
                  {personal.phone}
                </a>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {personal.location}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  className="rounded-full border border-border bg-bg-muted/30 p-2 text-text-muted transition hover:border-primary/60 hover:text-text"
                  href={personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  className="rounded-full border border-border bg-bg-muted/30 p-2 text-text-muted transition hover:border-primary/60 hover:text-text"
                  href={personal.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <Button
                  type="button"
                  variant="outline"
                  className="ml-1"
                  onClick={() => window.dispatchEvent(new Event("open-contact-widget"))}
                >
                  {t("openWidget")}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-xs text-text-muted">{t("hint")}</div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
