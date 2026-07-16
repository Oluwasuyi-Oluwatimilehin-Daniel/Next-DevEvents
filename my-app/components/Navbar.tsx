"use client";

import Link from "next/link";
import posthog from "posthog-js";

const navItems = [
  { label: "Home", href: "/", target: "home" },
  { label: "Events", href: "#event", target: "events" },
  { label: "Create Event", href: "mailto:hello@devevents.dev", target: "create_event" },
] as const;

const Navbar = () => {
  const handleNavClick = (target: string, href: string) => {
    posthog.capture("nav_link_clicked", {
      target,
      href,
      nav_location: "header",
    });
  };

  return (
    <header className="border-b border-zinc-950/30 sticky top-0 z-50 bg-zinc-950/30 backdrop-blur-lg">
      <nav className="flex items-center justify-between py-3 px-4">
        <Link className="text-xl font-medium tracking-tighter" href="/" onClick={() => handleNavClick("logo", "/")}>
          Logo
        </Link>

        <ul className="flex items-center space-x-3 lg:space-x-7">
          {navItems.map((item) => (
            <li key={item.label} className="text-sm">
              <Link href={item.href} onClick={() => handleNavClick(item.target, item.href)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
