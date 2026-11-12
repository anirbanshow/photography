"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./Brand";
import { FullscreenMenu, menuLinks } from "./FullscreenMenu";

export function Navbar() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Brand />
        <nav aria-label="Primary navigation" className="header-nav">
          {menuLinks.map(({ href, title }) => (
            <Link href={href} key={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{title}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="header-contact" href="/contact">Book a shoot <ArrowUpRight size={14} aria-hidden="true" /></Link>
          <button className="menu-toggle" type="button" aria-label="Open navigation" aria-controls="site-menu" aria-expanded={open} onClick={() => setMenuPath(pathname)}>
            <span /><span />
          </button>
        </div>
      </div>
      <FullscreenMenu open={open} close={() => setMenuPath(null)} pathname={pathname} />
    </header>
  );
}
