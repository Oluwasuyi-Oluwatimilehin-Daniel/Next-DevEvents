"use client";

import posthog from "posthog-js";
import { ArrowDown } from "lucide-react";

const ExploreBtn = () => {
  const handleClick = () => {
    posthog.capture("explore_events_clicked", {
      destination: "featured_events",
      cta_location: "hero",
    });
  };

  return (
    <a
      href="#event"
      className="group inline-flex items-center gap-2 mx-auto mt-8 px-8 py-3.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-medium text-sm transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/15 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      id="explore-btn"
      onClick={handleClick}
    >
      <span>Explore Events</span>
      <ArrowDown className="w-4 h-4 text-emerald-400 transition-transform duration-300 group-hover:translate-y-0.5" />
    </a>
  );
};

export default ExploreBtn;
