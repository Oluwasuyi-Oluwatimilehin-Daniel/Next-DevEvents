import Event, { IEvent } from "@/database/event.model";
import dbConnect from "@/lib/mongodb";
import { cacheLife } from "next/cache";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import FeaturedEventsTracker from "@/components/FeaturedEventsTracker";
import { Sparkles, CalendarDays } from "lucide-react";

/**
 * Helper function to fetch all events from MongoDB.
 * Uses Next.js caching directives ('use cache' and cacheLife).
 * Queries events sorted by { createdAt: -1 } so newest events are returned first.
 */
const getEvents = async () => {
  "use cache";
  cacheLife("hours");
  try {
    // Connect to MongoDB database
    await dbConnect();

    // Fetch events sorted by creation date descending (newest first)
    const eventsDoc = await Event.find().sort({ createdAt: -1 });

    // Serialize Mongoose documents into plain JS objects for React rendering
    return JSON.parse(JSON.stringify(eventsDoc));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

/**
 * Main Home Page Component
 * Renders hero header, featured tracker, and grid of event cards.
 */
const Page = async () => {
  // Fetch real-time events list sorted newest-first
  const events = await getEvents();

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background ambient gradient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-87.5 bg-linear-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <section className="flex flex-col px-4 py-16 container mx-auto max-w-7xl lg:px-10">
        <FeaturedEventsTracker eventCount={events.length} />

        {/* Hero Header Pill */}
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>The Ultimate Developer Event Hub</span>
        </div>

        {/* Hero Main Heading */}
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-[1.15]">
          The Hub for Every Dev <br />
          <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
            Event You Can&apos;t Miss
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-center mt-4 text-zinc-400 text-base sm:text-lg max-w-xl mx-auto font-normal">
          Hackathons, Meetups, and Conferences — all curated in one place for
          tech creators.
        </p>

        {/* CTA Button */}
        <ExploreBtn />

        {/* Featured Events Section */}
        <div className="mt-24 space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CalendarDays className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-xl tracking-tight text-white">
                Featured Events
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
              {events.length} {events.length === 1 ? "Event" : "Events"} Live
            </span>
          </div>

          {/* Event Cards Grid */}
          <div
            id="event"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-24"
          >
            {events && events.length > 0 ? (
              events.map((event: IEvent) => (
                <EventCard key={event.slug} event={event} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl bg-zinc-900/30">
                <p className="text-zinc-400 text-sm">
                  No events found yet. Be the first to publish one!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
