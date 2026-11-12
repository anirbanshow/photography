import { ArrowUpRight, Maximize2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/portfolio";
import styles from "./gallery.module.css";

interface GalleryCardProps {
  project: Project;
  number: string;
  onPreview?: () => void;
}

export function GalleryCard({ project, number, onPreview }: GalleryCardProps) {
  return (
    <div className={styles.card}>
      <Link href={`/work/${project.slug}`} className={styles.cardLink}>
        <div className={styles.cardImage}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes="(min-width: 1600px) 700px, (min-width: 700px) 46vw, 92vw"
          />
          <span className={styles.cardNumber} aria-hidden="true">{number}</span>
          <span className={styles.cardOpen} aria-hidden="true"><ArrowUpRight size={21} /></span>
          <span className={styles.cardLocation}>{project.location}</span>
        </div>
        <div className={styles.cardCaption}>
          <h2>{project.title}</h2>
          <p>{project.category} <span aria-hidden="true">/</span> {project.year}</p>
        </div>
      </Link>
      {onPreview && (
        <button
          type="button"
          className={styles.preview}
          aria-label={`View ${project.title} photograph fullscreen`}
          title="View fullscreen"
          onClick={onPreview}
        >
          <Maximize2 size={17} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
