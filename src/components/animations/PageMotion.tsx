"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Drives the GSAP reveal/parallax/pin animations for the page it is rendered in.
 *
 * It must be rendered inside the page itself (not the root layout). The page sits in its own
 * Suspense boundary (loading.tsx), which React hydrates after the layout. An effect in the layout
 * could therefore run before the page is hydrated, and GSAP's inline styles would then be
 * compared against the server HTML and cause a hydration mismatch.
 */
export function PageMotion() {
  const pathname = usePathname();

  // A layout effect (not useEffect) on purpose: ScrollTrigger's `pin` wraps the pinned element in a
  // `pin-spacer` div. The cleanup below has to undo that before React removes the page's DOM nodes
  // on navigation, otherwise React throws "removeChild: The node to be removed is not a child".
  // Layout-effect cleanups run before React detaches the nodes; passive-effect cleanups run after.
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const frame = requestAnimationFrame(() => {
      const main = document.getElementById("main");
      if (!main) return;

      media.add("(prefers-reduced-motion: no-preference)", () => {
        main.querySelectorAll<HTMLElement>("[data-heading]").forEach((heading) => {
          const lines = heading.querySelectorAll(".heading-mask > *");
          if (heading.dataset.heading === "enter") {
            gsap.from(lines, { yPercent: 110, duration: 1.05, stagger: 0.105, ease: "power4.out", clearProps: "transform" });
          } else {
            gsap.from(lines, {
              yPercent: 105, duration: 0.92, stagger: 0.09, ease: "power3.out", clearProps: "transform",
              scrollTrigger: { trigger: heading, start: "top 93%", once: true },
            });
          }
        });

        main.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 24, opacity: 0.5, duration: 0.85, ease: "power3.out", clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
          });
        });

        main.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
          gsap.fromTo(element, { yPercent: -4 }, {
            yPercent: 4, ease: "none",
            scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });

      media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const exhibition = main.querySelector<HTMLElement>("[data-exhibition]");
        if (!exhibition) return;
        const image = exhibition.querySelector<HTMLElement>("[data-exhibition-image]");
        if (!image) return;

        gsap.timeline({
          scrollTrigger: { trigger: exhibition, start: "top top", end: "+=42%", pin: true, scrub: true, invalidateOnRefresh: true },
        }).fromTo(image, { scale: 1.03, clipPath: "inset(4% 5% 4% 5%)" }, { scale: 1.12, clipPath: "inset(0% 0% 0% 0%)", ease: "none" });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, [pathname]);

  return null;
}
