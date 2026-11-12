"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { SRGBColorSpace, TextureLoader, type Texture } from "three";
import type { Photo } from "@/types/portfolio";
import type { SceneBridge } from "./enhancement";

export function useSceneTextures(photos: Photo[], bridge: SceneBridge) {
  const gl = useThree((state) => state.gl);
  const [loaded, setLoaded] = useState<{ photos: Photo[]; textures: Texture[] } | null>(null);

  useEffect(() => {
    const loader = new TextureLoader();
    const anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 4);
    let active = true;
    let pending = photos.length;

    const textures = photos.map((photo) => loader.load(photo.texture, (texture) => {
      if (!active) {
        texture.dispose();
        return;
      }

      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = anisotropy;
      texture.needsUpdate = true;
      pending -= 1;
      if (pending === 0) setLoaded({ photos, textures });
    }, undefined, () => {
      if (active) bridge.onFailure();
    }));

    return () => {
      active = false;
      textures.forEach((texture) => texture.dispose());
    };
  }, [bridge, gl, photos]);

  return loaded?.photos === photos ? loaded.textures : null;
}

export function textureAspect(texture: Texture, photo: Photo) {
  const source: unknown = texture.image;
  return source instanceof HTMLImageElement && source.naturalHeight > 0
    ? source.naturalWidth / source.naturalHeight
    : photo.width / photo.height;
}

export function useSceneBridge(bridge: SceneBridge, hasTextures: boolean) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const ready = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;
    function handleContextLoss(event: Event) {
      event.preventDefault();
      bridge.onFailure();
    }

    bridge.bindInvalidation(invalidate);
    canvas.addEventListener("webglcontextlost", handleContextLoss);
    return () => {
      bridge.bindInvalidation(null);
      canvas.removeEventListener("webglcontextlost", handleContextLoss);
    };
  }, [bridge, gl, invalidate]);

  useFrame(() => {
    if (ready.current || !hasTextures) return;
    ready.current = true;
    // Reveal the canvas after its first complete frame.
    queueMicrotask(bridge.onReady);
  });
}
