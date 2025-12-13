"use client";

import { Languages } from "lucide-react";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "./Button";

type Props = {
  locale: string;
};

export function LanguageSwitch({ locale }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = locale === "en" ? "zh" : "en";

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-10 gap-2 rounded-full px-3"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      aria-label="Switch language"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-semibold">{routing.locales.includes(nextLocale as any) ? nextLocale.toUpperCase() : "EN"}</span>
    </Button>
  );
}

