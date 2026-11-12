"use client";

import { ArrowLeft, Maximize2, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/types/portfolio";
import { ImageLightbox } from "./ImageLightbox";
import styles from "./gallery.module.css";

export function ProjectViewer({ project }: { project: Project }) {
  const [preview, setPreview] = useState<number | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const [shareLink, setShareLink] = useState("");
  const photos = [project.cover, ...project.images.filter((photo) => photo.src !== project.cover.src)];

  async function shareProject() {
    const url = window.location.href;
    setShareStatus("");
    setShareLink("");
    try {
      if (navigator.share) {
        await navigator.share({ title: project.title, text: project.excerpt, url });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Project link copied.");
    } catch {
      setShareLink(url);
      setShareStatus("Select the project link to copy it.");
    }
  }

  return (
    <>
      <header className={`shell ${styles.projectHeader}`}>
        <Link href="/work" className={styles.backLink}><ArrowLeft size={15} aria-hidden="true" /> All work</Link>
        <div className={styles.projectTitle} data-reveal>
          <div>
            <p className="eyebrow">{project.category} / {project.year}</p>
            <h1 className="display">{project.title}</h1>
          </div>
          <p className={styles.projectDek}>{project.excerpt}</p>
        </div>
      </header>

      <figure className={styles.projectCover}>
        <div className={styles.projectCoverMedia} data-parallax>
          <Image src={project.cover.src} alt={project.cover.alt} fill sizes="100vw" preload />
        </div>
        <button
          type="button"
          className={styles.projectPreview}
          aria-label={`View ${project.title} cover photograph fullscreen`}
          onClick={() => setPreview(0)}
        >
          <Maximize2 size={18} aria-hidden="true" /> <span>View full image</span>
        </button>
      </figure>

      <section className={`shell ${styles.projectStory}`} aria-label="Project notes" data-reveal>
        <div className={styles.projectFacts}>
          <p className="eyebrow">Field notes</p>
          <dl>
            <div><dt>Place</dt><dd>{project.location}</dd></div>
            <div><dt>Discipline</dt><dd>{project.category}</dd></div>
            <div><dt>Year</dt><dd>{project.year}</dd></div>
          </dl>
        </div>
        <div className={styles.storyCopy}>
          <h2 className={styles.storyHeading}>Behind the frame</h2>
          {project.story.split(/\n\s*\n/).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className={styles.shareArea}>
            <button type="button" className={styles.shareButton} onClick={shareProject}>
              <Share2 size={16} aria-hidden="true" /> Share project
            </button>
            <span className={styles.shareStatus} role="status">{shareStatus}</span>
            {shareLink && (
              <input
                type="url"
                aria-label="Project link"
                value={shareLink}
                readOnly
                onFocus={(event) => event.currentTarget.select()}
              />
            )}
          </div>
        </div>
      </section>

      {photos.length > 1 && (
        <section className={`shell ${styles.projectFrames}`} aria-label="Photographs from the project">
          {photos.slice(1).map((photo, index) => (
            <figure key={photo.src} className={styles.projectFrame} data-reveal>
              <button
                type="button"
                className={styles.frameButton}
                aria-label={`View photograph ${index + 2} fullscreen: ${photo.alt}`}
                onClick={() => setPreview(index + 1)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes={index % 3 === 0 ? "(min-width: 700px) 63vw, 92vw" : "(min-width: 700px) 49vw, 92vw"}
                />
                <span className={styles.frameOpen}><Maximize2 size={18} aria-hidden="true" /></span>
              </button>
              <figcaption className="eyebrow">Plate {String(index + 2).padStart(2, "0")} / {project.title}</figcaption>
            </figure>
          ))}
        </section>
      )}

      {preview !== null && (
        <ImageLightbox
          entries={photos.map((photo) => ({ photo, title: project.title, detail: project.category }))}
          initialIndex={preview}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
