"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import type { Event } from "@/lib/constants";

interface Props {
  event: Event;
}

const EventCard = ({ event }: Props) => {
  const handleClick = () => {
    posthog.capture("event_card_clicked", {
      event_slug: event.slug,
      event_title: event.title,
      event_location: event.location,
      event_date: event.date,
    });
  };

  return (
    <Link
      className="group block relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md p-4 transition-all duration-300 hover:border-emerald-500/30 hover:bg-zinc-900/60 hover:shadow-lg hover:shadow-emerald-500/5"
      href={`/event/${event.slug}`}
      onClick={handleClick}
    >
      {/* Event Image Container */}
      <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-800`}>
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="eager"
        />
        {/* Date Badge Overlay */}
        <div className="absolute top-3 left-3 bg-emerald-500/90 text-zinc-950 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
          {event.date}
        </div>
      </div>

      {/* Event Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1 font-medium text-emerald-400">
            📍 {event.location}
          </span>
          <span className="font-mono">🕒 {event.time}</span>
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-emerald-400">
          {event.title}
        </h3>

        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </div>
    </Link>
  );
};

export default EventCard;
