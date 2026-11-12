import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { ThreeDGallery } from "@/components/three/ThreeDGallery";
import { PageMotion } from "@/components/animations/PageMotion";
import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { siteName } from "@/lib/site";
import styles from "./gallery.module.css";

const title = "The Viewing Room";
const description = "Explore six photographic series in Mira Solenne’s interactive viewing room.";
const { src, alt } = projects[0].cover;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gallery" },
  openGraph: { title: `${title} — ${siteName}`, description, url: "/gallery", siteName, images: [{ url: src, alt }] },
};

export default function GalleryPage() {
  return (
    <section className={styles.page} aria-label="The viewing room">
      <PageMotion />
      <div className={`shell ${styles.header}`}>
        <div>
          <p className="eyebrow"><span /> 02 / Virtual exhibition</p>
          <AnimatedHeading as="h1" lines={["The viewing room."]} enter />
        </div>
        <p>Move through six series and open any frame to see the full project.</p>
      </div>
      <ThreeDGallery projects={projects} />
      <div className={`shell ${styles.foot}`}><Link className="text-link" href="/work">Browse the archive <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </section>
  );
}
