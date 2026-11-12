"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import type { RefObject } from "react";
import { MathUtils } from "three";
import type { Photo } from "@/types/portfolio";
import type { SceneBridge } from "./enhancement";
import type { HeroInput } from "./Hero3D";
import { textureAspect, useSceneBridge, useSceneTextures } from "./scene-resources";

type HeroSceneProps = {
  photos: Photo[];
  input: RefObject<HeroInput>;
  bridge: SceneBridge;
  visible: boolean;
};

function HeroComposition({ photos, input, bridge, visible }: HeroSceneProps) {
  const viewport = useThree((state) => state.viewport);
  const textures = useSceneTextures(photos, bridge);
  useSceneBridge(bridge, Boolean(textures));

  useFrame(({ camera, invalidate }, delta) => {
    if (!visible || !textures) return;

    const current = input.current;
    const targetX = current.x * 0.32;
    const targetY = -current.y * 0.19 + current.scroll * 0.20;
    const targetZ = 7 + current.scroll * 0.39;
    const step = Math.min(delta, 1 / 20);

    camera.position.x = MathUtils.damp(camera.position.x, targetX, 5, step);
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 5, step);
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 5, step);
    camera.lookAt(camera.position.x * 0.36, camera.position.y * 0.30, 0);

    if (
      Math.abs(camera.position.x - targetX) > 0.001 ||
      Math.abs(camera.position.y - targetY) > 0.001 ||
      Math.abs(camera.position.z - targetZ) > 0.001
    ) invalidate();
  });

  if (!textures || viewport.aspect < 1.2) return null;

  return photos.map((photo, index) => {
    const width = viewport.width * (index === 0 ? 0.108 : 0.098);

    return (
      <Plane
        key={photo.texture}
        args={[width, width / textureAspect(textures[index], photo)]}
        position={[(index === 0 ? 0.405 : 0.454) * viewport.width, (index === 0 ? -0.18 : 0.30) * viewport.height, 0.21 + index * 0.12]}
        rotation={[0, -0.18, index === 0 ? 0.055 : -0.07]}
      >
        <meshBasicMaterial map={textures[index]} toneMapped={false} transparent opacity={0.51} />
      </Plane>
    );
  });
}

export default function HeroScene(props: HeroSceneProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 7], fov: 39 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      flat
    >
      <HeroComposition {...props} />
    </Canvas>
  );
}
