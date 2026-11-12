import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageMotion } from "@/components/animations/PageMotion";
import { ProjectViewer } from "@/components/gallery/ProjectViewer";
import styles from "@/components/gallery/gallery.module.css";
import { projects } from "@/data/projects";
import { siteName } from "@/lib/site";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();

  const url = `/work/${slug}`;
  const image = {
    url: project.cover.src,
    width: project.cover.width,
    height: project.cover.height,
    alt: project.cover.alt,
  };
  const title = `${project.title} — ${siteName}`;

  return {
    title: project.title,
    description: project.excerpt,
    alternates: { canonical: url },
    openGraph: { title, description: project.excerpt, type: "article", siteName, url, images: [image] },
    twitter: { card: "summary_large_image", title, description: project.excerpt, images: [image] },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const index = projects.findIndex((entry) => entry.slug === slug);
  const project = projects[index];
  if (!project) notFound();

  const next = projects[(index + 1) % projects.length];
  const previous = projects[(index + projects.length - 1) % projects.length];

  return (
    <article className={styles.project}>
      <PageMotion />
      <ProjectViewer project={project} />
      {projects.length > 1 && (
        <nav className={`shell ${styles.projectNavigation}`} aria-label="Adjacent projects">
          <Link className={styles.previousProject} href={`/work/${previous.slug}`}>
            <span className="eyebrow"><ArrowLeft size={15} aria-hidden="true" /> Previous project</span>
            <span className={styles.previousTitle}>{previous.title}</span>
          </Link>
          <Link className={styles.nextProject} href={`/work/${next.slug}`}>
            <div className={styles.nextImage}>
              <Image src={next.cover.src} alt="" fill sizes="(min-width: 700px) 60vw, 92vw" />
            </div>
            <div className={styles.nextCaption}>
              <span className="eyebrow">Next project / {next.category}</span>
              <span className={styles.nextTitle}>{next.title}</span>
            </div>
            <ArrowUpRight className={styles.nextArrow} size={28} aria-hidden="true" />
          </Link>
        </nav>
      )}
    </article>
  );
}
