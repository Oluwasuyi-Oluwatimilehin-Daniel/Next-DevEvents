import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IEvent } from "@/database/event.model";
import BookEvent from "@/components/BookEvent";
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  ChevronLeft,
  BookOpen,
} from "lucide-react";

import { ElementType } from "react";
import { formatDate } from "@/lib/utils";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  Icon,
  label,
  value,
}: {
  Icon: ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex gap-4 items-center bg-zinc-900/30 border border-white/5 p-4 rounded-xl hover:border-emerald-500/20 transition-all duration-200">
    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-zinc-200">{value}</p>
    </div>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl space-y-4">
    <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
      <BookOpen className="w-5 h-5 text-emerald-400" />
      <span>Event Agenda</span>
    </h3>
    <div className="relative border-l border-white/10 pl-6 ml-3 space-y-6">
      {agendaItems.map((item, index) => (
        <div key={item} className="relative">
          {/* Timeline Dot with number */}
          <span className="absolute left-[-32px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 border border-emerald-500/60 text-[10px] text-emerald-400 font-mono font-bold">
            {index + 1}
          </span>
          <p className="text-sm font-medium text-zinc-200">{item}</p>
        </div>
      ))}
    </div>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex gap-2 flex-wrap">
    {tags.map((tag) => (
      <span
        className="px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full hover:bg-emerald-500/20 transition-colors duration-250"
        key={tag}
      >
        #{tag}
      </span>
    ))}
  </div>
);

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const {
    event,
    bookingsCount = 0,
  }: { event: IEvent; bookingsCount?: number } = await request.json();

  if (!event) return notFound();

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)

  return (
    <section className="container mx-auto px-4 py-8 lg:px-10 max-w-7xl animate-in fade-in duration-500">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-emerald-400 transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>

      {/* Header and Title */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white lg:text-5xl">
          {event.title}
        </h1>
        <p className="text-base text-zinc-400 lg:text-lg max-w-3xl">
          {event.description}
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Banner Hero Image */}
          <div className="relative w-full aspect-video md:h-[400px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          </div>

          {/* Overview */}
          <section className="bg-zinc-900/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">Overview</h2>
            <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
              {event.overview}
            </p>
          </section>

          {/* Event Details Grid */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-100">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EventDetailItem
                Icon={Calendar}
                label="Date"
                value={formatDate(event.date)}
              />
              <EventDetailItem Icon={Clock} label="Time" value={event.time} />
              <EventDetailItem
                Icon={MapPin}
                label="Location"
                value={event.location}
              />
              <EventDetailItem
                Icon={Globe}
                label="Event Mode"
                value={event.mode}
              />
              <EventDetailItem
                Icon={Users}
                label="Audience"
                value={event.audience}
              />
            </div>
          </section>

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <EventAgenda agendaItems={event.agenda} />
          )}

          {/* Organizer */}
          <section className="bg-zinc-900/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl space-y-4">
            <h2 className="text-xl font-bold text-zinc-100">Organizer</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg font-bold text-emerald-400 uppercase">
                {event.organizer.substring(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-200">
                  {event.organizer}
                </h4>
                <p className="text-xs text-zinc-500">Verified Host</p>
              </div>
            </div>
          </section>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="pt-2">
              <EventTags tags={event.tags} />
            </div>
          )}
        </div>

        {/* Right sidebar - booking widget */}
        <div className="lg:col-span-1">
          <aside className="sticky top-14 bg-zinc-900/60 border border-white/10 p-6 shadow-2xl shadow-emerald-500/5 backdrop-blur-md rounded-2xl">
            <BookEvent slug={slug} initialBookingsCount={bookingsCount} />
          </aside>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 pt-20">
        <h2 className="text-2xl font-bold text-zinc-100">
          Similar Events
        </h2>
        <p className="text-zinc-400 text-sm">
          Browse through other similar events that might interest you
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
            <EventCard key={similarEvent.slug} event={similarEvent} />
          ))}
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarEvents.map((similarEvent) => (
            <Link
              key={similarEvent._id}
              href={`/events/${similarEvent.slug}`}
              className="group relative bg-zinc-900/40 border border-white/5 backdrop-blur-md p-4 rounded-2xl hover:border-emerald-500/20 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src={similarEvent.image}
                  alt={similarEvent.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors duration-200">
                  {similarEvent.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(similarEvent.date)}</span>
                  <Clock className="w-4 h-4" />
                  <span>{similarEvent.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <MapPin className="w-4 h-4" />
                  <span>{similarEvent.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default EventDetailsPage;
