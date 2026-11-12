import type { Metadata } from "next";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource-variable/manrope";
import "lenis/dist/lenis.css";
import "@/app/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionSystem } from "@/components/animations/MotionSystem";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Mira Solenne — Photography", template: "%s — Mira Solenne" },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName,
    title: "Mira Solenne — Photography",
    description: siteDescription,
    images: [{ url: projects[0].cover.src, alt: projects[0].cover.alt }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteName,
    jobTitle: "Photographer",
    description: siteDescription,
    url: siteUrl.href,
    image: new URL("/images/mira-solenne.webp", siteUrl).href,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar />
        <ScrollProgress />
        <MotionSystem />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
