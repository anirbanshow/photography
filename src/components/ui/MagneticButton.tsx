"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

export function MagneticButton({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 24 });
  const springY = useSpring(y, { stiffness: 250, damping: 24 });
  const reduce = useReducedMotion();

  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.13);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.17);
  }

  return (
    <Link href={href} className={className} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <motion.span className="magnetic-content" style={{ x: springX, y: springY }}>{children}</motion.span>
    </Link>
  );
}
