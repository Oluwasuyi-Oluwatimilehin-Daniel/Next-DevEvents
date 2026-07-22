"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";

const navItems = [
  { label: "Home", href: "/", target: "home" },
  { label: "Events", href: "#event", target: "events" },
  {
    label: "Create Event",
    href: "/create-events",
    target: "create_event",
  },
] as const;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (target: string, href: string) => {
    posthog.capture("nav_link_clicked", {
      target,
      href,
      nav_location: "header",
    });
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/70 bg-zinc-950/70 backdrop-blur-xl">
      <nav className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 lg:px-8">
        <Link
          className="text-lg font-semibold tracking-tight text-zinc-100 transition-colors hover:text-emerald-400"
          href="/"
          onClick={() => handleNavClick("logo", "/")}
        >
          DevEvents
        </Link>

        {/* Desktop view */}
        <ul className="hidden items-center space-x-3 md:flex lg:space-x-7">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="text-sm text-zinc-300 transition-colors hover:text-emerald-400"
            >
              <Link
                href={item.href}
                onClick={() => handleNavClick(item.target, item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-100 transition hover:border-emerald-400/40 hover:bg-emerald-500/10 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <LuX size={18} /> : <LuMenu size={18} />}
        </button>

        {/* Mobile view */}
        <div
          className={`absolute left-0 top-full w-full overflow-hidden border-b border-zinc-800/70 bg-zinc-950/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
            isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col space-y-3 px-4 py-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => handleNavClick(item.target, item.href)}
                  className="block rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-emerald-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
