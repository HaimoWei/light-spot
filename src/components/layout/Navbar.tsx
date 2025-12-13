"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { personal } from "@/data/personal";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";

type Props = {
  locale: string;
};

const sectionIds = ["about", "projects", "experience", "contact"] as const;

export function Navbar({ locale }: Props) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<(typeof sectionIds)[number]>("about");
  const resumeHref = `/${locale}/resume`;
  const items = useMemo(
    () => [
      { id: "about", label: t("about") },
      { id: "projects", label: t("projects") },
      { id: "experience", label: t("experience") },
      { id: "contact", label: t("contact") }
    ],
    [t]
  );

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id as any);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.1, 0.2, 0.4, 0.6] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-bg/85 px-4 py-3 dark:bg-bg/70 dark:backdrop-blur-sm">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-2 text-sm font-black text-white">
              HW
            </span>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-text">{personal.name}</div>
              <div className="text-xs text-text-muted">{personal.location}</div>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold text-text-muted transition hover:text-text",
                  active === item.id && "bg-bg-muted/40 text-text"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={resumeHref} className="hidden lg:block">
              <Button type="button" variant="outline" className="h-10 rounded-full px-4">
                <FileText className="h-4 w-4" />
                {t("resume")}
              </Button>
            </a>
            <LanguageSwitch locale={locale} />
            <ThemeToggle />

            <Button
              type="button"
              variant="ghost"
              className="h-10 w-10 rounded-full p-0 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={t("openMenu")}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mx-auto mt-2 max-w-6xl px-4 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="rounded-2xl border border-border bg-bg/90 p-2 dark:bg-bg/80 dark:backdrop-blur-sm">
          <a
            href={resumeHref}
            className="block rounded-xl px-3 py-3 text-sm font-semibold text-text-muted transition hover:bg-bg-muted/40 hover:text-text"
            onClick={() => setOpen(false)}
          >
            {t("resume")}
          </a>
          <div className="my-1 h-px bg-border/60" />
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "block rounded-xl px-3 py-3 text-sm font-semibold text-text-muted transition hover:bg-bg-muted/40 hover:text-text",
                active === item.id && "bg-bg-muted/40 text-text"
              )}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
