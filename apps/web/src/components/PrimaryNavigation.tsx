"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PrimaryNavigation({
  items,
}: {
  items: Array<{ href: string; label: string }>;
}) {
  const pathname = usePathname();
  return (
    <nav className="desktop-nav" aria-label="Điều hướng chính">
      {items.map((item) => {
        const current =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            aria-current={current ? "page" : undefined}
            className={current ? "is-current" : ""}
            key={item.href}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
