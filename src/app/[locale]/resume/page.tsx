import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { LogoAvatar } from "@/components/ui/LogoAvatar";
import { PrintButton } from "@/components/ui/PrintButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ScrollAnimation } from "@/components/effects/ScrollAnimation";
import { ResumeNav } from "@/components/resume/ResumeNav";
import { personal } from "@/data/personal";
import { projects } from "@/data/projects";
import { resume } from "@/data/resume";
import { ArrowLeft, Download, ExternalLink, Github, Globe, Linkedin, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

function getLogoFallback(name: string) {
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return words.map((w) => w[0]).join("").slice(0, 4);
  return trimmed.slice(0, 2);
}

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  return {
    title: isZh ? "简历 | Haimo Wei" : "Resume | Haimo Wei",
    description: isZh
      ? "Haimo Wei 的站内简历与项目概览（支持 PDF 下载与打印）。"
      : "Haimo Wei’s resume with selected projects (PDF download and print-friendly)."
  };
}

export default async function ResumePage({ params }: Props) {
  const { locale } = await params;
  const isZh = locale === "zh";
  const t = await getTranslations("resume");
  const websiteUrl = personal.website.startsWith("http") ? personal.website : `https://${personal.website}`;
  const resumeProjects = projects.filter((p) => p.id !== "cyberlight");
  const sectionItems = [
    { id: "summary", label: t("summary") },
    { id: "highlights", label: t("highlights") },
    { id: "skills", label: t("skills") },
    { id: "projects", label: t("projects") },
    { id: "education", label: t("education") }
  ];

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
            <a href="/resume.pdf" target="_blank" rel="noreferrer">
              <Button variant="outline" type="button" className="hidden sm:inline-flex">
                <Download className="h-4 w-4" />
                {t("downloadPdf")}
              </Button>
            </a>
            <PrintButton label={t("print")} className="hidden sm:inline-flex" />
            <LanguageSwitch locale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="overflow-hidden rounded-3xl border border-border bg-card/40">
          <div className="border-b border-border p-7 sm:p-9">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-text sm:text-5xl">{personal.name}</h1>
                <div className="mt-2 text-base font-semibold text-text-muted">
                  {isZh ? personal.titleZh : personal.title} · {personal.location}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{personal.workRights[isZh ? "zh" : "en"]}</Badge>
                  <Badge tone="success">{personal.availability[isZh ? "zh" : "en"]}</Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-text-muted">
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
                    <Globe className="h-4 w-4" />
                    <a className="hover:text-text" href={websiteUrl} target="_blank" rel="noreferrer">
                      {personal.website}
                    </a>
                  </span>
                  <a
                    className="inline-flex items-center gap-2 hover:text-text"
                    href={personal.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                  <a
                    className="inline-flex items-center gap-2 hover:text-text"
                    href={personal.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </div>
              </div>

              <div className="no-print flex flex-col gap-2 sm:items-end">
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <a href="/resume.pdf" target="_blank" rel="noreferrer">
                    <Button type="button">
                      <Download className="h-4 w-4" />
                      {t("downloadPdf")}
                    </Button>
                  </a>
                  <PrintButton label={t("print")} />
                </div>
                <div className="text-xs text-text-muted">{t("pdfHint")}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 p-7 sm:p-9 lg:grid-cols-12">
            <aside className="no-print lg:col-span-4">
              <div className="sticky top-24 space-y-4">
                <Card className="p-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{t("sections")}</div>
                  <ResumeNav items={sectionItems} />
                </Card>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <div className="space-y-10">
                <ScrollAnimation>
                  <section id="summary" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-text">{t("summary")}</h2>
                    <p className="mt-3 max-w-4xl text-sm leading-relaxed text-text-muted">
                      {resume.summary[isZh ? "zh" : "en"]}
                    </p>
                    <div className="mt-4">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                        {t("keywords")}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resume.keywords.map((k) => (
                          <Badge key={k}>{k}</Badge>
                        ))}
                      </div>
                    </div>
                  </section>
                </ScrollAnimation>

                <ScrollAnimation delay={0.05}>
                  <section id="highlights" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-text">{t("highlights")}</h2>
                    <ul className="mt-4 space-y-2 text-sm text-text-muted">
                      {resume.highlights[isZh ? "zh" : "en"].map((h) => (
                        <li key={h} className="flex gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-primary/70" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </ScrollAnimation>

                <ScrollAnimation delay={0.08}>
                  <section id="skills" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-text">{t("skills")}</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {resume.skills.map((group) => (
                        <Card key={group.label.en} className="p-5">
                          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                            {isZh ? group.label.zh : group.label.en}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {group.items.map((item) => (
                              <Badge key={item}>{item}</Badge>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                </ScrollAnimation>

                <ScrollAnimation delay={0.1}>
                  <section id="projects" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-text">{t("projects")}</h2>

                    <div className="mt-4 grid grid-cols-1 gap-6">
                      {resumeProjects.map((p) => (
                        <Card key={p.id} className="p-6">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="text-lg font-bold text-text">{isZh ? p.titleZh : p.title}</div>
                              <div className="mt-1 text-xs text-text-muted">{isZh ? p.roleZh : p.role}</div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <Badge tone="success">{t("deployed")}</Badge>
                              <Badge>{p.collaboration === "personal" ? t("personal") : t("team")}</Badge>
                              <Badge>
                                {t("contributionLabel")}: {p.contribution}%
                              </Badge>
                            </div>
                          </div>

                          <p className="mt-4 text-sm leading-relaxed text-text-muted">
                            {isZh ? p.descriptionZh : p.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {p.technologies.map((tech) => (
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

                          <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row">
                            <a href={p.demoUrl} target="_blank" rel="noreferrer">
                              <Button type="button">
                                <ExternalLink className="h-4 w-4" />
                                {t("liveDemo")}
                              </Button>
                            </a>
                            <a href={p.githubUrl} target="_blank" rel="noreferrer">
                              <Button type="button" variant="outline">
                                <Github className="h-4 w-4" />
                                {t("repo")}
                              </Button>
                            </a>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                </ScrollAnimation>

                <ScrollAnimation delay={0.12}>
                  <section id="education" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-text">{t("education")}</h2>
                    <div className="mt-4">
                      <div className="grid grid-cols-1 gap-4">
                        {personal.education.map((edu) => (
                          <Card key={edu.id} className="p-6">
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
                          </Card>
                        ))}
                      </div>
                    </div>
                  </section>
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
