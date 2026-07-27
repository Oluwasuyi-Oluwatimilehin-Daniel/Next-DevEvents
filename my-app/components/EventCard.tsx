"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import type { IEvent } from "@/database/event.model";
import type { Event } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { MapPin, Clock, ArrowUpRight, Tag } from "lucide-react";

interface Props {
  event: IEvent | Event;
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

  const mode = "mode" in event ? event.mode : undefined;
  const organizer = "organizer" in event ? event.organizer : undefined;
  const tags = "tags" in event ? event.tags : undefined;

  return (
    <Link
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-md p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-emerald-500/10"
      href={`/events/${event.slug}`}
      onClick={handleClick}
    >
      {/* Event Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-zinc-950">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="eager"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-emerald-500/90 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-md">
            {formatDate(event.date)}
          </div>
          {mode && (
            <div className="bg-zinc-950/80 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md">
              {mode}
            </div>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="mt-4 flex flex-1 flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Location & Time info bar */}
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-1 text-emerald-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-35">{event.location}</span>
            </span>
            <span className="flex items-center gap-1 text-zinc-400 font-mono">
              <Clock className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
              <span>{event.time}</span>
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-emerald-400 flex items-start justify-between gap-1">
            <span>{event.title}</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-emerald-400" />
          </h3>

          {/* Event Short Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Footer info: Organizer or Tag pills */}
        {(organizer || (tags && tags.length > 0)) && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
            {organizer && (
              <span className="truncate">By <strong className="text-zinc-300 font-medium">{organizer}</strong></span>
            )}
            {tags && tags.length > 0 && (
              <span className="flex items-center gap-1 text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                <Tag className="w-3 h-3" />
                <span>{tags[0]}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default EventCard;
