"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function MobileMenu({ items }: { items: Array<{ href: string; label: string }> }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="mobile-menu">
      <button
        className="menu-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? "Đóng menu" : "Mở menu"}</span>
        <span className={`menu-icon ${open ? "is-open" : ""}`} aria-hidden="true"><i /><i /><i /></span>
      </button>
      {open && (
        <nav id="mobile-navigation" className="mobile-nav-panel" aria-label="Điều hướng di động">
          {items.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
          <Link className="button" href="/game" onClick={() => setOpen(false)}>Chơi bản thử</Link>
        </nav>
      )}
    </div>
  );
}
