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
      className="flex items-center mx-auto mt-7 border px-10 py-3 border-gray-500 transition-colors duration-200 bg-gray-600/30 text-white rounded-full cursor-pointer hover:bg-gray-500/50 "
      id="explore-btn"
      onClick={handleClick}
    >
      <p>Explore Events</p>
      <ArrowDown className="w-5 h-5 ml-2" />
    </a>
  );
};

export default ExploreBtn;
