"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

/** A decorative transition that never delays or intercepts navigation. */
export function RouteWave({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const wave = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const previous = previousPathname.current;
      previousPathname.current = pathname;
      if (previous === null || previous === pathname || !wave.current || !page.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const timeline = gsap.timeline();
      timeline.fromTo(
        wave.current,
        { xPercent: -110, autoAlpha: 1 },
        { xPercent: 110, autoAlpha: 1, duration: 0.82, ease: "power2.inOut" },
      );
      timeline.set(wave.current, { autoAlpha: 0 });
      timeline.fromTo(
        page.current,
        { opacity: 0.55, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        0.24,
      );
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="route-transition-root">
      <div ref={page} className="route-transition-page">{children}</div>
      <div className="route-wave" aria-hidden="true">
        <div ref={wave} className="route-wave-panel">
          <span className="route-wave-wind route-wave-wind-one" />
          <span className="route-wave-wind route-wave-wind-two" />
          <span className="route-wave-wind route-wave-wind-three" />
        </div>
      </div>
    </div>
  );
}
