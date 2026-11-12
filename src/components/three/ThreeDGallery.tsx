"use client";

import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Project } from "@/types/portfolio";
import { createSceneBridge, SceneBoundary, useWebGLStage } from "./enhancement";
import styles from "./three.module.css";

const GalleryScene = dynamic(() => import("./GalleryScene"), { ssr: false });

export type GalleryInput = {
  offset: number;
  x: number;
  y: number;
  hovered: number | null;
  dragging: boolean;
};

type Gesture = {
  id: number;
  x: number;
  y: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  origin: number;
  distance: number;
};

function formatIndex(index: number) {
  return String(index).padStart(2, "0");
}

function FlatGallery({ active, projects, moveTo }: {
  active: number;
  projects: Project[];
  moveTo: (index: number) => void;
}) {
  return (
    <div className={styles.flatStage}>
      {projects.map((project, index) => {
        const offset = index - active;
        if (Math.abs(offset) > 1) return null;

        const photo = project.cover;
        const ratio = photo.width / photo.height;
        const style = {
          left: `${50 + offset * 39}%`,
          aspectRatio: ratio,
          width: `min(var(--frame-width), calc(var(--stage-height) * ${ratio * 0.78}))`,
        };
        const picture = (
          <Image
            src={photo.src}
            alt={offset === 0 ? photo.alt : ""}
            fill
            sizes="(max-width: 650px) 75vw, 46vw"
            className={styles.flatPhoto}
          />
        );

        if (offset === 0) {
          return (
            <Link className={styles.flatFrame} style={style} data-current href={`/work/${project.slug}`} key={project.slug}>
              {picture}
              <span className={styles.flatIcon} aria-hidden="true"><ArrowUpRight size={17} /></span>
            </Link>
          );
        }

        return (
          <button type="button" className={styles.flatFrame} style={style} aria-label={`Show ${project.title}`} onClick={() => moveTo(index)} key={project.slug}>
            {picture}
          </button>
        );
      })}
    </div>
  );
}

export function ThreeDGallery({ projects }: { projects: Project[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const suppressClick = useRef(false);
  const input = useRef<GalleryInput>({ offset: 0, x: 0, y: 0, hovered: null, dragging: false });
  const [active, setActive] = useState(0);
  const [readySession, setReadySession] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const router = useRouter();
  const photos = useMemo(() => projects.map((project) => project.cover), [projects]);
  const { visible, session } = useWebGLStage(stage, photos.length > 0);
  const bridge = useMemo(() => createSceneBridge(
    () => setReadySession(session),
    () => setFailed(true),
  ), [session]);
  const last = projects.length - 1;
  const useCanvas = session !== null && !failed;
  const interactive = useCanvas && readySession === session;
  const project = projects[active];

  function clamp(index: number) {
    return Math.max(0, Math.min(last, index));
  }

  function moveTo(index: number) {
    const next = clamp(index);
    input.current.offset = next;
    setActive(next);
    bridge.invalidate();
  }

  function select(index: number) {
    if (!suppressClick.current && !input.current.dragging) {
      router.push(`/work/${projects[index].slug}`);
    }
  }

  function hover(index: number | null) {
    input.current.hovered = index;
    if (stage.current) stage.current.dataset.overPhoto = String(index !== null);
    bridge.invalidate();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter") {
      event.preventDefault();
      router.push(`/work/${projects[active].slug}`);
      return;
    }

    const commands: Record<string, number> = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: last };
    if (!Object.hasOwn(commands, event.key)) return;

    event.preventDefault();
    moveTo(commands[event.key]);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || !event.isPrimary || event.button !== 0) return;

    suppressClick.current = false;
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      origin: input.current.offset,
      distance: Math.max(104, Math.min(310, event.currentTarget.clientWidth * 0.37)),
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || !event.isPrimary) return;

    const current = input.current;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.pointerType === "mouse") {
      current.x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      current.y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    }

    const drag = gesture.current;
    if (drag?.id === event.pointerId) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!current.dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        current.dragging = true;
        suppressClick.current = true;
        event.currentTarget.dataset.dragging = "true";
        event.currentTarget.setPointerCapture(event.pointerId);
        hover(null);
      }

      if (current.dragging) {
        const elapsed = event.timeStamp - drag.lastTime;
        if (elapsed > 0) drag.velocity = drag.velocity * 0.35 + (event.clientX - drag.lastX) / elapsed * 0.65;
        drag.lastX = event.clientX;
        drag.lastTime = event.timeStamp;
        current.offset = clamp(drag.origin - dx / drag.distance);
      }
    }

    bridge.invalidate();
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>, canceled = false) {
    const drag = gesture.current;
    if (drag?.id !== event.pointerId) return;

    gesture.current = null;
    if (!input.current.dragging) return;

    input.current.dragging = false;
    event.currentTarget.dataset.dragging = "false";
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);

    const glide = !canceled && event.timeStamp - drag.lastTime < 90
      ? Math.max(-1.4, Math.min(1.4, -drag.velocity * 160 / drag.distance))
      : 0;
    moveTo(Math.round(input.current.offset + glide));
  }

  function onPointerLeave(event: PointerEvent<HTMLDivElement>) {
    if (!input.current.dragging) finishDrag(event, true);
    input.current.x = 0;
    input.current.y = 0;
    hover(null);
  }

  if (!project) return null;

  return (
    <section className={styles.gallery} aria-label="Interactive photo gallery">
      <div className={`shell ${styles.galleryHeader}`} aria-hidden="true">
        <span><ArrowDownRight size={12} /> Exhibition / 01</span>
        <span>{interactive ? "Spatial view" : "Image view"}</span>
      </div>
      <div
        ref={stage}
        className={styles.galleryStage}
        data-interactive={interactive}
        tabIndex={0}
        role="group"
        aria-label="Photographs. Use left and right arrow keys to browse and Enter to open the selected project."
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={(event) => finishDrag(event, true)}
        onLostPointerCapture={(event) => finishDrag(event, true)}
        onPointerLeave={onPointerLeave}
      >
        <span className={styles.stageAxis} aria-hidden="true" />
        {!interactive && <FlatGallery active={active} projects={projects} moveTo={moveTo} />}
        {useCanvas && (
          <div className={styles.canvasLayer} data-ready={interactive} aria-hidden="true">
            <SceneBoundary onFailure={bridge.onFailure}>
              <GalleryScene photos={photos} input={input} bridge={bridge} visible={visible} onSelect={select} onHover={hover} />
            </SceneBoundary>
          </div>
        )}
        <div className={styles.galleryHint} aria-hidden="true">
          <MoveHorizontal size={14} /> {interactive ? "Drag to explore" : "Use arrows to explore"}
        </div>
      </div>
      <div className={`shell ${styles.galleryControls}`}>
        <div aria-live="polite" aria-atomic="true" className={styles.galleryMeta}>
          <p>{project.category} <span>·</span> {project.year}</p>
          <h2>{project.title}</h2>
          <span className={styles.visuallyHidden}>{project.cover.alt}</span>
        </div>
        <div className={styles.galleryNavigation} aria-label="Gallery controls">
          <button type="button" className={styles.controlButton} onClick={() => moveTo(active - 1)} disabled={active === 0} aria-label="Previous photo">
            <ArrowLeft size={18} strokeWidth={1.4} />
          </button>
          <span className={styles.galleryCount}>{formatIndex(active + 1)} <span>/</span> {formatIndex(projects.length)}</span>
          <button type="button" className={styles.controlButton} onClick={() => moveTo(active + 1)} disabled={active === last} aria-label="Next photo">
            <ArrowRight size={18} strokeWidth={1.4} />
          </button>
        </div>
        <Link href={`/work/${project.slug}`} className={styles.projectLink}>
          View project <ArrowUpRight size={15} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
