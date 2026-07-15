"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";

const Page = () => {
  useEffect(() => {
    posthog.capture("featured_events_viewed", {
      event_count: events.length,
      section: "featured_events",
    });
  }, []);
  return (
    <section className="flex flex-col px-4 py-12">
      <h1 className="text-center text-3xl font-medium">
        {" "}
        The Hub for Every Dev <br />{" "}
        <span className="text-shadow-zinc-500/15">Event You Can&apos;t Miss</span>
      </h1>
      <p className="text-center mt-1">
        Hackatons, Meetups, and Conferences, All In One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3 className="font-medium text-xl">Featured Events</h3>

        <div id="event" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Page;
