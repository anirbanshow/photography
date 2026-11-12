"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";

export const menuLinks = [
  { href: "/work", title: "Selected Work" },
  { href: "/gallery", title: "3D Gallery" },
  { href: "/about", title: "About" },
] as const;

export function FullscreenMenu({ open, close, pathname }: { open: boolean; close: () => void; pathname: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && dialog && !dialog.open) dialog.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} id="site-menu" className="menu-overlay" aria-labelledby="menu-title" onClose={close} data-lenis-prevent>
      <div className="shell menu-shell">
        <div className="menu-top">
          <p id="menu-title" className="eyebrow"><span /> Navigation</p>
          <button className="menu-close" type="button" onClick={close} aria-label="Close navigation"><X size={22} /></button>
        </div>
        <nav aria-label="Fullscreen navigation" className="menu-links">
          {[{ href: "/", title: "Home" }, ...menuLinks, { href: "/contact", title: "Book a Shoot" }].map(({ href, title }, index) => (
            <Link href={href} onClick={close} key={href} aria-current={pathname === href ? "page" : undefined}>
              <span className="eyebrow">0{index + 1}</span>{title}<ArrowUpRight aria-hidden="true" strokeWidth={1} />
            </Link>
          ))}
        </nav>
        <div className="menu-foot eyebrow">Independent photography <span>Paris · Worldwide</span></div>
      </div>
    </dialog>
  );
}
