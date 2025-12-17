import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ExternalLink, Github, Mail, Snowflake } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { personal } from "@/data/personal";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";

  return {
    title: isZh ? "节假日模式 | Haimo Wei" : "Holiday Mode | Haimo Wei",
    description: isZh
      ? "假期期间在线 Demo 暂时关闭以节省成本；如需访问请邮件联系，并可通过 GitHub README 查看项目详情。"
      : "Live demos are temporarily offline during the holiday to save costs. Email to turn one on and review details in GitHub READMEs.",
    robots: { index: false, follow: true }
  };
}

export default async function HolidayPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("holiday");

  const homeHref = `/${locale}`;
  const mailtoHref = `mailto:${personal.email}`;

  return (
    <div>
      <header className="no-print sticky top-0 z-40 border-b border-border bg-bg/85 dark:bg-bg/70 dark:backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-muted/20 px-3 py-2 text-sm font-semibold text-text-muted transition hover:border-primary/60 hover:text-text"
            href={homeHref}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </a>

          <div className="flex items-center gap-2">
            <LanguageSwitch locale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_60%)]" />
            <div className="absolute -left-28 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
            <div className="absolute -bottom-40 -right-28 h-96 w-96 rounded-full bg-primary-2/10 blur-3xl dark:bg-primary-2/15" />
          </div>

          <div className="relative p-7 sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-2 text-white shadow-glow">
                    <Snowflake className="h-5 w-5" />
                  </span>
                  <Badge className="border-primary/30 bg-primary/10 text-primary">{t("badgeHoliday")}</Badge>
                  <Badge>{t("badgeOffline")}</Badge>
                </div>

                <h1 className="mt-6 text-3xl font-black tracking-tight text-text sm:text-4xl">
                  <span className="bg-gradient-to-r from-primary to-primary-2 bg-clip-text text-transparent">
                    {t("title")}
                  </span>
                </h1>
                <p className="mt-4 text-base leading-relaxed text-text-muted">{t("subtitle")}</p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
                <a href={mailtoHref}>
                  <Button className="w-full sm:w-auto" type="button">
                    <Mail className="h-4 w-4" />
                    {t("ctaEmail")}
                  </Button>
                </a>

                <a href={personal.github} target="_blank" rel="noreferrer">
                  <Button className="w-full sm:w-auto" variant="outline" type="button">
                    <Github className="h-4 w-4" />
                    {t("ctaGithub")}
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12">
              <Card className="p-6 lg:col-span-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">{t("contactTitle")}</div>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{t("contactBody")}</p>
                <a
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-bg/60 px-3 py-2 font-mono text-sm text-text transition hover:border-primary/60"
                  href={mailtoHref}
                >
                  <Mail className="h-4 w-4 text-text-muted" />
                  {personal.email}
                </a>
              </Card>

              <Card className="p-6 lg:col-span-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">{t("githubTitle")}</div>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{t("githubBody")}</p>
                <a
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-bg/60 px-3 py-2 font-mono text-sm text-text transition hover:border-primary/60"
                  href={personal.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="h-4 w-4 text-text-muted" />
                  {personal.github.replace("https://", "")}
                </a>
              </Card>

              <Card className="p-6 lg:col-span-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">{t("notesTitle")}</div>
                <ul className="mt-4 space-y-2 text-sm text-text-muted">
                  {["note1", "note2", "note3", "note4"].map((key) => (
                    <li key={key} className="flex gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-primary/70" />
                      <span>{t(key as any)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="mt-8 text-xs text-text-muted">{t("hint")}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

