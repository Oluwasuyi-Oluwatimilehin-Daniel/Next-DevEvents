"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface FeaturedEventsTrackerProps {
  eventCount: number;
}

export default function FeaturedEventsTracker({ eventCount }: FeaturedEventsTrackerProps) {
  useEffect(() => {
    posthog.capture("featured_events_viewed", {
      event_count: eventCount,
      section: "featured_events",
    });
  }, [eventCount]);

  return null;
}
