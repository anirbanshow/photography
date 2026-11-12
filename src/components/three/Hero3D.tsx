"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "@/types/portfolio";
import { createSceneBridge, SceneBoundary, useWebGLStage } from "./enhancement";
import styles from "./three.module.css";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const heroCanvasMedia = "(prefers-reduced-motion: no-preference) and (min-width: 800px) and (min-aspect-ratio: 6/5)";

export type HeroInput = { x: number; y: number; scroll: number };

export function Hero3D({ frames }: { frames: Photo[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const input = useRef<HeroInput>({ x: 0, y: 0, scroll: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [readySession, setReadySession] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const photos = useMemo(() => frames.slice(1, 3), [frames]);
  const cover = frames[0];
  const { session, visible } = useWebGLStage(stage, imageLoaded && photos.length > 0, heroCanvasMedia);
  const bridge = useMemo(() => createSceneBridge(
    () => setReadySession(session),
    () => setFailed(true),
  ), [session]);
  const useCanvas = session !== null && !failed;

  useEffect(() => {
    const element = stage.current;
    if (!element || !useCanvas || !visible) return;

    function moveCamera() {
      const current = input.current;
      element?.style.setProperty("--hero-shift-x", `${-current.x * 9}px`);
      element?.style.setProperty("--hero-shift-y", `${-current.y * 6 - current.scroll * 13}px`);
      element?.style.setProperty("--hero-zoom", `${1.045 + current.scroll * 0.035}`);
      bridge.invalidate();
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !element) return;
      const bounds = element.getBoundingClientRect();
      input.current.x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      input.current.y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      moveCamera();
    }

    function onPointerLeave() {
      input.current.x = 0;
      input.current.y = 0;
      moveCamera();
    }

    function onScroll() {
      if (!element) return;
      const bounds = element.getBoundingClientRect();
      input.current.scroll = Math.max(0, Math.min(1, -bounds.top / bounds.height));
      moveCamera();
    }

    const section = element.parentElement;
    section?.addEventListener("pointermove", onPointerMove, { passive: true });
    section?.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      section?.removeEventListener("pointermove", onPointerMove);
      section?.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      element.style.removeProperty("--hero-shift-x");
      element.style.removeProperty("--hero-shift-y");
      element.style.removeProperty("--hero-zoom");
    };
  }, [bridge, useCanvas, visible]);

  return (
    <div ref={stage} className={styles.hero} data-camera={useCanvas && visible}>
      {cover && (
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="100vw"
          preload
          className={styles.heroCover}
          onLoad={() => setImageLoaded(true)}
        />
      )}
      {useCanvas && (
        <div className={styles.canvasLayer} data-ready={readySession === session} aria-hidden="true">
          <SceneBoundary onFailure={bridge.onFailure}>
            <HeroScene photos={photos} input={input} bridge={bridge} visible={visible} />
          </SceneBoundary>
        </div>
      )}
      <div className={styles.heroVignette} aria-hidden="true" />
    </div>
  );
}
