"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Category, Project } from "@/types/portfolio";
import { GalleryCard } from "./GalleryCard";
import { ImageLightbox, type LightboxEntry } from "./ImageLightbox";
import styles from "./gallery.module.css";

interface PortfolioGridProps {
  projects: readonly Project[];
  categories: readonly Category[];
}

export function PortfolioGrid({ projects, categories }: PortfolioGridProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [preview, setPreview] = useState<{ entries: LightboxEntry[]; index: number } | null>(null);
  const reduceMotion = useReducedMotion();
  const shown = projects.filter((project) => !category || project.category === category);

  function openPreview(index: number) {
    const entries = shown.map((project) => ({
      photo: project.cover,
      title: project.title,
      detail: project.category,
      href: `/work/${project.slug}`,
    }));
    setPreview({ entries, index });
  }

  return (
    <section className="shell" aria-label="Portfolio archive" id="archive">
      <div className={styles.filters}>
        <div className={styles.filterList} role="group" aria-label="Filter work by category">
          <button type="button" aria-pressed={!category} onClick={() => setCategory(null)}>All work</button>
          {categories.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={category === option}
              onClick={() => setCategory(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <span className={styles.filterCount} aria-live="polite" aria-atomic="true">
          {String(shown.length).padStart(2, "0")} {shown.length === 1 ? "project" : "projects"}
        </span>
      </div>
      <div className={styles.grid}>
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((project, index) => (
            <motion.article
              key={project.slug}
              data-offset={index % 2 === 1}
              layout={reduceMotion ? false : "position"}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0 : 0.32 }}
            >
              <GalleryCard
                project={project}
                number={String(projects.indexOf(project) + 1).padStart(2, "0")}
                onPreview={() => openPreview(index)}
              />
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      {!shown.length && <p className={styles.empty}>There are no projects in this category yet.</p>}
      {preview && (
        <ImageLightbox
          entries={preview.entries}
          initialIndex={preview.index}
          onClose={() => setPreview(null)}
        />
      )}
    </section>
  );
}
