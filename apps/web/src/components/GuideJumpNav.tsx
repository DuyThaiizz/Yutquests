"use client";

import { useEffect, useState } from "react";

const items = [
  { id: "setup", label: "Thiết lập" },
  { id: "turn", label: "Một lượt" },
  { id: "outcomes", label: "Kết quả" },
  { id: "strategy", label: "Chiến thuật" },
  { id: "finish", label: "Về đích" },
];

export function GuideJumpNav() {
  const [active, setActive] = useState(items[0].id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-24% 0px -62% 0px", threshold: [0, 0.2, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="guide-jump-nav" aria-label="Mục lục luật chơi">
      <div className="section-shell">
        <span>Đi đến</span>
        {items.map((item) => (
          <a
            aria-current={active === item.id ? "location" : undefined}
            className={active === item.id ? "is-current" : ""}
            href={`#${item.id}`}
            key={item.id}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
