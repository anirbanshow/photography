"use client";

import { Component, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

let webGLAvailable: boolean | undefined;

function canRenderWebGL() {
  if (webGLAvailable !== undefined) return webGLAvailable;

  try {
    const context = document.createElement("canvas").getContext("webgl2");
    webGLAvailable = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webGLAvailable = false;
  }

  return webGLAvailable;
}

export function useWebGLStage(
  stage: RefObject<HTMLElement | null>,
  enabled = true,
  mediaQuery = "(prefers-reduced-motion: no-preference)",
) {
  const [state, setState] = useState<{ visible: boolean; session: number | null }>({ visible: false, session: null });
  const sessionSequence = useRef(0);

  useEffect(() => {
    if (!enabled || !stage.current) return;

    const media = window.matchMedia(mediaQuery);
    let visible = false;
    let session: number | null = null;

    function updateStage() {
      if (!media.matches) session = null;
      if (visible && media.matches && session === null && canRenderWebGL()) {
        sessionSequence.current += 1;
        session = sessionSequence.current;
      }

      const next = { visible, session };
      setState((previous) => previous.visible === next.visible && previous.session === next.session ? previous : next);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateStage();
    });

    media.addEventListener("change", updateStage);
    observer.observe(stage.current);

    return () => {
      media.removeEventListener("change", updateStage);
      observer.disconnect();
    };
  }, [stage, enabled, mediaQuery]);

  return { visible: state.visible, session: enabled ? state.session : null };
}

export type SceneBridge = {
  invalidate: () => void;
  bindInvalidation: (invalidate: (() => void) | null) => void;
  onReady: () => void;
  onFailure: () => void;
};

export function createSceneBridge(onReady: () => void, onFailure: () => void): SceneBridge {
  let requestFrame: (() => void) | null = null;

  return {
    invalidate: () => requestFrame?.(),
    bindInvalidation: (invalidate) => { requestFrame = invalidate; },
    onReady,
    onFailure,
  };
}

export class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
