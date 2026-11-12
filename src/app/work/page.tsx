import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageMotion } from "@/components/animations/PageMotion";
import { PortfolioGrid } from "@/components/gallery/PortfolioGrid";
import styles from "@/components/gallery/gallery.module.css";
import { categories, projects } from "@/data/projects";
import { siteName } from "@/lib/site";

const description = "An archive of Mira Solenne’s photographic work, from intimate portraits to landscapes, street observations, and fashion editorials.";
const title = `Selected Work — ${siteName}`;
const cover = projects[0]?.cover;
const images = cover ? [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }] : [];

export const metadata: Metadata = {
  title: "Selected Work",
  description,
  alternates: { canonical: "/work" },
  openGraph: { title, description, type: "website", siteName, url: "/work", images },
  twitter: { card: "summary_large_image", title, description, images },
};

export default function WorkPage() {
  return (
    <div className={styles.archive}>
      <PageMotion />
      <header className={`shell ${styles.archiveHeader}`}>
        <p className="eyebrow">The portfolio / an ongoing archive</p>
        <div className={styles.archiveTitle} data-reveal>
          <h1 className="display">Selected <em>work.</em></h1>
          <div className={styles.archiveNote}>
            <p>A collection of commissions, personal studies, and places that stayed with me.</p>
            <Link href="/gallery" className={styles.backLink}>Enter 3D gallery <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </header>
      <PortfolioGrid projects={projects} categories={categories} />
    </div>
  );
}
