"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import { Calendar, Plus } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", target: "home" },
  { label: "Explore Events", href: "/#event", target: "events" },
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md shadow-lg shadow-black/20">
      <nav className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 lg:px-8">
        {/* Brand Logo */}
        <Link
          className="group inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
          href="/"
          onClick={() => handleNavClick("logo", "/")}
        >
          <span>
            Dev
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Events
            </span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center space-x-6">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => handleNavClick(item.target, item.href)}
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-emerald-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Create Event CTA Button */}
          <Link
            href="/create-events"
            onClick={() => handleNavClick("create_event", "/create-events")}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs rounded-full bg-emerald-500/10  font-semibold text-emerald-400 border border-emerald-500/30 transition-all duration-200 hover:bg-emerald-500/20 hover:border-emerald-400/60 hover:shadow-md hover:shadow-emerald-500/10 active:scale-95"
          >
            Create Event
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-100 transition hover:border-emerald-400/40 hover:bg-emerald-500/10 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <LuX size={18} /> : <LuMenu size={18} />}
        </button>

        {/* Mobile View Dropdown */}
        <div
          className={`absolute left-0 top-full w-full overflow-hidden border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
            isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col space-y-2 px-4 py-4">
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
            <li className="pt-2 border-t border-white/5">
              <Link
                href="/create-events"
                onClick={() => handleNavClick("create_event", "/create-events")}
                className="flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                Create Event
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
