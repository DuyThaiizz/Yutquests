"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export function MotionDirector() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    document.documentElement.classList.add("js");
    const media = gsap.matchMedia();

    media.add(
      {
        motionOK: "(prefers-reduced-motion: no-preference)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { motionOK } = context.conditions as { motionOK: boolean };
        const heroTargets = gsap.utils.toArray<HTMLElement>(
          "[data-motion='hero']",
        );
        const sectionTargets = gsap.utils.toArray<HTMLElement>(
          "[data-motion='section']",
        );

        if (!motionOK) {
          gsap.set([...heroTargets, ...sectionTargets], {
            autoAlpha: 1,
            x: 0,
            y: 0,
            clearProps: "transform",
          });
          return;
        }

        gsap.fromTo(
          heroTargets,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            ease: "power3.out",
            stagger: 0.08,
            clearProps: "transform,opacity,visibility",
          },
        );
        gsap.set(sectionTargets, { autoAlpha: 1, clearProps: "transform" });
      },
    );

    return () => media.revert();
  }, [pathname]);

  return null;
}
