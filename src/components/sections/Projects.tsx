"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { projects } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScrollAnimation } from "@/components/effects/ScrollAnimation";
import { Check, ChevronDown, ChevronUp, Copy, ExternalLink, Eye, EyeOff, Github, KeyRound } from "lucide-react";
import type { DemoAccessCredential } from "@/types";
import { cn } from "@/lib/utils";

const badgeOverlayClass =
  "border-border/80 bg-bg/90 text-text shadow-sm backdrop-blur-sm dark:bg-bg/70 dark:text-text";
const badgeSuccessOverlayClass = "border-success/50 bg-success/20 text-success shadow-sm backdrop-blur-sm";

type Props = {
  locale: string;
};

type CredentialProps = {
  credential: DemoAccessCredential;
  copiedKey: string | null;
  isZh: boolean;
  onCopy: (text: string, key: string) => void;
};

function CredentialCard({ credential, copiedKey, isZh, onCopy }: CredentialProps) {
  const t = useTranslations("projects");
  const [showPassword, setShowPassword] = useState(false);

  const roleLabel = isZh ? credential.role.zh : credential.role.en;
  const identifierLabel = credential.identifierKind === "email" ? t("identifierEmail") : t("identifierUsername");
  const accessLabel = t("access");

  const identifierKey = useMemo(
    () => `${roleLabel}:identifier:${credential.identifier}`,
    [credential.identifier, roleLabel]
  );
  const passwordKey = useMemo(() => `${roleLabel}:password:${credential.password}`, [credential.password, roleLabel]);

  const identifierCopied = copiedKey === identifierKey;
  const passwordCopied = copiedKey === passwordKey;

  return (
    <div className="rounded-2xl border border-border bg-bg-muted/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="text-sm font-bold text-text">{roleLabel}</div>
        {credential.accessUrl ? (
          <a
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg/70 px-3 py-1 text-xs font-semibold text-text-muted transition hover:border-primary/60 hover:text-text"
            href={credential.accessUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {accessLabel}
          </a>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg/70 px-3 py-2">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{identifierLabel}</div>
            <div className="truncate font-mono text-sm text-text">{credential.identifier}</div>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-9 flex-none rounded-full p-0"
            aria-label={identifierCopied ? t("copied") : t("copy")}
            onClick={(e) => {
              e.stopPropagation();
              onCopy(credential.identifier, identifierKey);
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {identifierCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg/70 px-3 py-2">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{t("password")}</div>
            <div className="truncate font-mono text-sm text-text">
              {showPassword ? credential.password : "••••••••"}
            </div>
          </div>

          <div className="flex flex-none items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-9 rounded-full p-0"
              aria-label={showPassword ? t("hide") : t("show")}
              onClick={(e) => {
                e.stopPropagation();
                setShowPassword((v) => !v);
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-9 w-9 rounded-full p-0"
              aria-label={passwordCopied ? t("copied") : t("copy")}
              onClick={(e) => {
                e.stopPropagation();
                onCopy(credential.password, passwordKey);
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {passwordCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects({ locale }: Props) {
  const t = useTranslations("projects");
  const isZh = locale === "zh";
  const [accessOpenId, setAccessOpenId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = useCallback(async (text: string, key: string) => {
    const markCopied = () => {
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1200);
    };

    try {
      await navigator.clipboard.writeText(text);
      markCopied();
      return;
    } catch {
      // fall through
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (ok) markCopied();
    } catch {
      // ignore
    }
  }, []);

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
              <div className="group h-full">
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

                      {p.demoAccess?.credentials?.length ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          aria-expanded={accessOpenId === p.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAccessOpenId((current) => (current === p.id ? null : p.id));
                          }}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <KeyRound className="h-4 w-4" />
                          {t("demoAccess")}
                          {accessOpenId === p.id ? (
                            <ChevronUp className="h-4 w-4 opacity-80" />
                          ) : (
                            <ChevronDown className="h-4 w-4 opacity-80" />
                          )}
                        </Button>
                      ) : null}

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

                    {accessOpenId === p.id && p.demoAccess?.credentials?.length ? (
                      <div
                        className={cn(
                          "mt-4 rounded-2xl border border-border bg-bg-muted/20 p-4",
                          "focus-within:ring-2 focus-within:ring-primary/40"
                        )}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                            {t("demoAccessPanelTitle")}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-9 rounded-full px-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAccessOpenId(null);
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                          >
                            {t("close")}
                          </Button>
                        </div>

                        <div className="mt-3 space-y-3">
                          {p.demoAccess.credentials.map((credential, credIndex) => (
                            <CredentialCard
                              key={`${p.id}:${credIndex}:${credential.identifier}`}
                              credential={credential}
                              copiedKey={copiedKey}
                              isZh={isZh}
                              onCopy={copyText}
                            />
                          ))}

                          {p.demoAccess.note ? (
                            <div className="text-xs text-text-muted">
                              {isZh ? p.demoAccess.note.zh : p.demoAccess.note.en}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Card>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
