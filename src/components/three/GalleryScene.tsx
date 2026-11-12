"use client";

import { Plane } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { MathUtils, type Mesh, type MeshBasicMaterial } from "three";
import type { Photo } from "@/types/portfolio";
import type { SceneBridge } from "./enhancement";
import { textureAspect, useSceneBridge, useSceneTextures } from "./scene-resources";
import type { GalleryInput } from "./ThreeDGallery";

type GallerySceneProps = {
  photos: Photo[];
  input: RefObject<GalleryInput>;
  bridge: SceneBridge;
  visible: boolean;
  onSelect: (index: number) => void;
  onHover: (index: number | null) => void;
};

function PhotoWall({ photos, input, bridge, visible, onSelect, onHover }: GallerySceneProps) {
  const viewport = useThree((state) => state.viewport);
  const textures = useSceneTextures(photos, bridge);
  const ratios = useMemo(() => textures?.map((texture, index) => textureAspect(texture, photos[index])), [photos, textures]);
  const planes = useRef<(Mesh | null)[]>([]);
  const offset = useRef(0);
  const hasLayout = useRef(false);
  useSceneBridge(bridge, Boolean(textures));

  useFrame(({ camera, invalidate }, delta) => {
    if (!visible || !ratios) return;

    const controls = input.current;
    const step = hasLayout.current ? Math.min(delta, 1 / 24) : 1;
    if (!hasLayout.current) {
      offset.current = controls.offset;
      hasLayout.current = true;
    }
    const maxHeight = viewport.height * 0.78;
    const maxWidth = viewport.width * (viewport.aspect > 1.3 ? 0.44 : 0.73);
    const spacing = Math.min(viewport.width * 0.46, 4.45);
    offset.current = MathUtils.damp(offset.current, controls.offset, controls.dragging ? 17 : 8, step);
    if (Math.abs(offset.current - controls.offset) < 0.0008) offset.current = controls.offset;

    const targetX = controls.x * 0.25;
    const targetY = -controls.y * 0.13;
    camera.position.x = MathUtils.damp(camera.position.x, targetX, 5, step);
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 5, step);
    camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.26, 0);

    let moving = offset.current !== controls.offset ||
      Math.abs(camera.position.x - targetX) > 0.001 || Math.abs(camera.position.y - targetY) > 0.001;

    for (let index = 0; index < photos.length; index += 1) {
      const plane = planes.current[index];
      if (!plane) continue;

      const distance = index - offset.current;
      const separation = Math.abs(distance);
      plane.visible = separation < 2.6;
      if (!plane.visible) continue;

      const hovered = controls.hovered === index && !controls.dragging;
      const ratio = ratios[index];
      const height = Math.min(maxHeight, maxWidth / ratio);
      const width = height * ratio;
      const targetScale = Math.max(0.7, 1 - separation * 0.10) * (hovered ? 1.055 : 1);
      const targetZ = -Math.min(separation * 0.83, 3) + (hovered ? 0.18 : 0);
      const targetTilt = hovered ? -controls.y * 0.042 : 0;
      const targetYaw = -MathUtils.clamp(distance * 0.22, -0.62, 0.62) + (hovered ? controls.x * 0.038 : 0);
      const targetOpacity = MathUtils.clamp(1 - separation * 0.43, 0, 1);
      const material = plane.material as MeshBasicMaterial;

      plane.position.x = spacing * distance / (1 + separation * 0.075);
      plane.position.z = MathUtils.damp(plane.position.z, targetZ, 12, step);
      plane.rotation.x = MathUtils.damp(plane.rotation.x, targetTilt, 12, step);
      plane.rotation.y = MathUtils.damp(plane.rotation.y, targetYaw, 12, step);
      plane.scale.x = MathUtils.damp(plane.scale.x, width * targetScale, 14, step);
      // Reuse one scale factor so the image retains its precise aspect ratio as it animates.
      plane.scale.y = plane.scale.x / ratio;
      material.opacity = MathUtils.damp(material.opacity, targetOpacity, 13, step);

      moving ||= Math.abs(plane.position.z - targetZ) > 0.001 ||
        Math.abs(plane.rotation.x - targetTilt) > 0.001 || Math.abs(plane.rotation.y - targetYaw) > 0.001 ||
        Math.abs(plane.scale.x - width * targetScale) > 0.001 || Math.abs(material.opacity - targetOpacity) > 0.001;
    }

    if (moving) invalidate();
  });

  if (!textures || !ratios) return null;

  return photos.map((photo, index) => {
    const ratio = ratios[index];
    const height = Math.min(viewport.height * 0.78, viewport.width * (viewport.aspect > 1.3 ? 0.44 : 0.73) / ratio);

    return (
      <Plane
        key={photo.texture}
        ref={(mesh) => { planes.current[index] = mesh; }}
        args={[1, 1]}
        scale={[height * ratio, height, 1]}
        onPointerOver={(event) => {
          if (input.current.dragging || event.pointerType !== "mouse" || Math.abs(index - offset.current) > 1.6) return;
          event.stopPropagation();
          onHover(index);
        }}
        onPointerOut={() => {
          if (input.current.hovered === index) onHover(null);
        }}
        onClick={(event) => {
          if (Math.abs(index - offset.current) > 1.6) return;
          event.stopPropagation();
          onSelect(index);
        }}
      >
        <meshBasicMaterial map={textures[index]} toneMapped={false} transparent depthWrite={false} />
      </Plane>
    );
  });
}

export default function GalleryScene(props: GallerySceneProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.4]}
      camera={{ position: [0, 0, 8.6], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      flat
    >
      <PhotoWall {...props} />
    </Canvas>
  );
}
