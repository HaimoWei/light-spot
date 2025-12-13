import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;

  return (
    <div>
      <Navbar locale={locale} />
      <main>
        <Hero locale={locale} />
        <About locale={locale} />
        <Projects locale={locale} />
        <Experience locale={locale} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
