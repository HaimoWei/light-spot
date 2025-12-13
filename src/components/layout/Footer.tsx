import { personal } from "@/data/personal";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-text">{personal.name}</div>
          <div className="text-xs text-text-muted">{t("builtWith")}</div>
        </div>

        <div className="flex items-center gap-3">
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
          <a
            className="rounded-full border border-border bg-bg-muted/30 p-2 text-text-muted transition hover:border-primary/60 hover:text-text"
            href={`mailto:${personal.email}`}
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

