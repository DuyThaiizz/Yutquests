"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { routeTransitionFor } from "@/lib/route-transition";

gsap.registerPlugin(useGSAP);

/** Decorative motion that never delays or intercepts navigation. */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const wave = useRef<HTMLDivElement>(null);
  const breeze = useRef<HTMLDivElement>(null);
  const ripple = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const kind = routeTransitionFor(pathname);

  useGSAP(
    () => {
      const previous = previousPathname.current;
      previousPathname.current = pathname;
      if (previous === null || previous === pathname || !page.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const content = page.current.querySelector("main") ?? page.current;
      const timeline = gsap.timeline();
      if (kind === "wave" && wave.current) {
        timeline.fromTo(
          wave.current,
          { xPercent: -110, autoAlpha: 1 },
          { xPercent: 110, autoAlpha: 1, duration: 0.74, ease: "sine.inOut" },
          0,
        );
        timeline.set(wave.current, { autoAlpha: 0 });
        timeline.fromTo(
          content,
          { opacity: 0.76, y: 10 },
          { opacity: 1, y: 0, duration: 0.44, ease: "power2.out" },
          0.18,
        );
      } else if (kind === "breeze" && breeze.current) {
        const ribbons = breeze.current.querySelectorAll<HTMLElement>(".route-breeze-ribbon");
        timeline.set(ribbons, { autoAlpha: 1 }, 0);
        timeline.fromTo(
          ribbons,
          { xPercent: -150 },
          { xPercent: 160, duration: 0.63, ease: "sine.inOut", stagger: 0.07 },
          0,
        );
        timeline.set(ribbons, { autoAlpha: 0 });
        timeline.fromTo(
          content,
          { opacity: 0.8, x: 10 },
          { opacity: 1, x: 0, duration: 0.48, ease: "power2.out" },
          0.12,
        );
      } else if (ripple.current) {
        const rings = ripple.current.querySelectorAll<HTMLElement>(".route-ripple-ring");
        timeline.fromTo(
          rings,
          { scale: 0.38, autoAlpha: 0.72 },
          { scale: 2.8, autoAlpha: 0, duration: 0.7, ease: "power2.out", stagger: 0.1 },
          0,
        );
        timeline.fromTo(
          content,
          { opacity: 0.77, scale: 0.988 },
          { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" },
          0.08,
        );
      }
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="route-transition-root" data-transition={kind}>
      <div ref={page} className="route-transition-page">{children}</div>
      <div className="route-transition-overlay" aria-hidden="true">
        <div ref={wave} className="route-wave-panel">
          <span className="route-wave-wind route-wave-wind-one" />
          <span className="route-wave-wind route-wave-wind-two" />
          <span className="route-wave-wind route-wave-wind-three" />
        </div>
        <div ref={breeze} className="route-breeze">
          <span className="route-breeze-ribbon" />
          <span className="route-breeze-ribbon" />
          <span className="route-breeze-ribbon" />
        </div>
        <div ref={ripple} className="route-ripple">
          <span className="route-ripple-ring" />
          <span className="route-ripple-ring" />
        </div>
      </div>
    </div>
  );
}
