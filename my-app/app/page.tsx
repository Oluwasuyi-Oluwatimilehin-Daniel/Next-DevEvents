import Event, { IEvent } from "@/database/event.model";
import dbConnect from "@/lib/mongodb";
import { cacheLife } from "next/cache";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import FeaturedEventsTracker from "@/components/FeaturedEventsTracker";

// Helper function to query events directly from MongoDB, cached
const getEvents = async () => {
  'use cache';
  cacheLife('hours');
  try {
    await dbConnect();
    const eventsDoc = await Event.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(eventsDoc));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

const Page = async () => {
  const events = await getEvents();

  return (
    <section className="flex flex-col px-4 py-12 container mx-auto max-w-7xl lg:px-10">
      <FeaturedEventsTracker eventCount={events.length} />
      <h1 className="text-center text-3xl font-medium lg:text-5xl">
        {" "}
        The Hub for Every Dev <br />{" "}
        <span className="text-white/70">Event You Can&apos;t Miss</span>
      </h1>
      <p className="text-center mt-1">
        Hackatons, Meetups, and Conferences, All In One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3 className="font-medium text-xl lg:text-2xl">Featured Events</h3>

        <div id="event" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Page;
