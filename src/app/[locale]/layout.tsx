import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { ContactWidget } from "@/components/contact/ContactWidget";
import { routing } from "@/i18n/routing";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "Haimo Wei | Full-Stack Developer",
  description:
    "Production-deployed full-stack projects: microservices, real-time systems, cloud-native deployments.",
  keywords: [
    "Full-Stack Developer",
    "Sydney",
    "Java",
    "Spring Boot",
    "Microservices",
    "React",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Redis",
    "AWS",
    "Docker",
    "CI/CD",
    "WebSocket"
  ],
  metadataBase: new URL("https://lightspot.uk"),
  openGraph: {
    title: "Haimo Wei | Full-Stack Developer",
    description:
      "Production-deployed full-stack projects: microservices, real-time systems, cloud-native deployments.",
    url: "https://lightspot.uk",
    siteName: "Light-Spot",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Haimo Wei | Full-Stack Developer",
    description:
      "Production-deployed full-stack projects: microservices, real-time systems, cloud-native deployments."
  }
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="font-sans antialiased">
        <MouseGlow />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <ContactWidget />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
