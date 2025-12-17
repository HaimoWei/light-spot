import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, BarChart3, Coins } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getFishCoinsState, getVisitState } from "@/lib/visits";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";

  return {
    title: isZh ? "站点统计 | Haimo Wei" : "Site Stats | Haimo Wei",
    description: isZh ? "站点访问与互动统计（未公开入口）。" : "Unlisted site stats (visits & interactions).",
    robots: { index: false, follow: false }
  };
}

export default async function VisitsPage({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations("visits");
  const [visitState, fishCoinsState] = await Promise.all([getVisitState(), getFishCoinsState()]);

  const numberLocale = locale === "zh" ? "zh-CN" : "en-US";

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString(numberLocale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const visitsTotal = visitState.total.toLocaleString(numberLocale);
  const fishCoinsTotal = fishCoinsState.total.toLocaleString(numberLocale);
  const visitsUpdatedAt = formatDate(visitState.updatedAt);
  const fishCoinsUpdatedAt = formatDate(fishCoinsState.updatedAt);

  return (
    <div>
      <header className="no-print sticky top-0 z-40 border-b border-border bg-bg/85 dark:bg-bg/70 dark:backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-muted/20 px-3 py-2 text-sm font-semibold text-text-muted transition hover:border-primary/60 hover:text-text"
            href={`/${locale}`}
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
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_60%)]" />
          </div>

          <div className="relative p-7 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{t("tracking")}</Badge>
                  <Badge className="border-border/80 bg-bg/80 text-text-muted">
                    <BarChart3 className="h-3.5 w-3.5" />
                    {t("unlisted")}
                  </Badge>
                </div>

                <h1 className="mt-5 text-3xl font-black tracking-tight text-text sm:text-4xl">
                  {t("title")}
                </h1>
                <p className="mt-3 text-base leading-relaxed text-text-muted">{t("subtitle")}</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12">
              <Card className="p-6 lg:col-span-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">{t("visitsLabel")}</div>
                <div className="mt-3 font-mono text-5xl font-black tracking-tight text-text sm:text-6xl">
                  {visitsTotal}
                </div>
              </Card>

              <Card className="p-6 lg:col-span-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    {t("fishCoinsLabel")}
                  </div>
                  <Coins className="h-4 w-4 text-amber-500 dark:text-amber-400" aria-hidden="true" />
                </div>
                <div className="mt-3 font-mono text-5xl font-black tracking-tight text-text sm:text-6xl">
                  {fishCoinsTotal}
                </div>
              </Card>

              <Card className="p-6 lg:col-span-12">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">{t("detailsTitle")}</div>
                <div className="mt-4 space-y-3 text-sm text-text-muted">
                  <div className="flex items-center justify-between gap-3">
                    <span>{t("visitsUpdatedAt")}</span>
                    <span className="font-mono text-text">{visitsUpdatedAt}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>{t("fishCoinsUpdatedAt")}</span>
                    <span className="font-mono text-text">{fishCoinsUpdatedAt}</span>
                  </div>
                  <div className="h-px bg-border/60" />
                  <div className="text-xs leading-relaxed text-text-muted">{t("detailsHint")}</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
