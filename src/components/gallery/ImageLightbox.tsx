"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Photo } from "@/types/portfolio";
import styles from "./gallery.module.css";

export interface LightboxEntry {
  photo: Photo;
  title: string;
  detail?: string;
  href?: string;
}

interface ImageLightboxProps {
  entries: readonly LightboxEntry[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageLightbox({ entries, initialIndex, onClose }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const [index, setIndex] = useState(initialIndex);
  const entry = entries[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  function step(amount: number) {
    setIndex((current) => (current + amount + entries.length) % entries.length);
  }

  function handleKeys(event: KeyboardEvent<HTMLDialogElement>) {
    switch (event.key) {
      case "ArrowLeft":
        step(-1);
        break;
      case "ArrowRight":
        step(1);
        break;
      case "Home":
        setIndex(0);
        break;
      case "End":
        setIndex(entries.length - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch" || !event.isPrimary) return;
    swipe.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }

  function finishSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = swipe.current;
    if (!start || start.id !== event.pointerId) return;

    swipe.current = null;
    const horizontal = event.clientX - start.x;
    const vertical = event.clientY - start.y;
    if (Math.abs(horizontal) > 48 && Math.abs(horizontal) > Math.abs(vertical) * 1.4) {
      step(horizontal < 0 ? 1 : -1);
    }
  }

  if (!entry) return null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.lightbox}
      aria-label="Photograph viewer"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={handleKeys}
    >
      <header className={styles.lightboxHeader}>
        <span className="eyebrow">Full screen / {entry.detail ?? "Photograph"}</span>
        <button ref={closeRef} type="button" className={styles.iconButton} aria-label="Close photograph viewer" onClick={onClose}>
          <X size={24} aria-hidden="true" />
        </button>
      </header>
      <div
        className={styles.lightboxStage}
        onPointerDown={startSwipe}
        onPointerUp={finishSwipe}
        onPointerCancel={() => { swipe.current = null; }}
      >
        <Image
          key={entry.photo.src}
          src={entry.photo.src}
          alt={entry.photo.alt}
          fill
          sizes="96vw"
          loading="eager"
          draggable={false}
        />
      </div>
      <footer className={styles.lightboxFooter}>
        <div className={styles.lightboxCaption}>
          <span aria-live="polite" aria-atomic="true">
            {entry.title} <span className={styles.lightboxCount}>/ {index + 1} of {entries.length}</span>
          </span>
          {entry.href && (
            <Link href={entry.href} onClick={onClose} className={styles.lightboxLink}>
              View project <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          )}
        </div>
        {entries.length > 1 && (
          <div className={styles.lightboxControls}>
            <button type="button" className={styles.iconButton} aria-label="Previous photograph" onClick={() => step(-1)}>
              <ArrowLeft size={22} aria-hidden="true" />
            </button>
            <button type="button" className={styles.iconButton} aria-label="Next photograph" onClick={() => step(1)}>
              <ArrowRight size={22} aria-hidden="true" />
            </button>
          </div>
        )}
      </footer>
    </dialog>
  );
}
