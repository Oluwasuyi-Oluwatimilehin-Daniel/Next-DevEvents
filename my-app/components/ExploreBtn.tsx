"use client";

import posthog from "posthog-js";

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
      className="mx-auto mt-7 border border-gray-500 bg-gray-600/30 text-white rounded-full px-10 py-2 cursor-pointer hover:bg-gray-500/50 transition-colors"
      id="explore-btn"
      onClick={handleClick}
    >
      Explore Events
    </a>
  );
};

export default ExploreBtn;
