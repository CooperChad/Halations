"use client";

import { useState, useEffect } from "react";

const LINKS = [
  { label: "Photography", href: "#photography", external: false },
  { label: "About", href: "#about", external: false },
  { label: "Client Galleries", href: "https://halationstudio.pixieset.com", external: true },
  { label: "Contact", href: "#book", external: false },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger — only shown on mobile via CSS */}
      <button
        className="mobile-nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`mobile-nav-toggle__bar ${open ? "is-open-1" : ""}`} />
        <span className={`mobile-nav-toggle__bar ${open ? "is-open-2" : ""}`} />
        <span className={`mobile-nav-toggle__bar ${open ? "is-open-3" : ""}`} />
      </button>

      {/* Full-screen overlay menu */}
      <div className={`mobile-nav-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav className="mobile-nav-links">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a className="mobile-nav-book" href="#book" onClick={() => setOpen(false)}>
            Book a Session
          </a>
        </nav>
      </div>
    </>
  );
}
