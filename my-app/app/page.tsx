import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import FeaturedEventsTracker from "@/components/FeaturedEventsTracker";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  'use cache';
  cacheLife('hours');
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

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
