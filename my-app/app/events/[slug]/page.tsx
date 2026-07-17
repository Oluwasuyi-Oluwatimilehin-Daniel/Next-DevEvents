import Image from "next/image";
import { notFound } from "next/navigation";
import { IEvent } from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon, alt, label }: { icon: string; alt: string; label: string }) => (
  <div className="flex gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex gap-2 flex-wrap mt-4">
    {tags.map((tag) => (
      <span
        className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
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
  const { event }: { event: IEvent } = await request.json();

  if (!event) return notFound();

  return (
    <section className="container mx-auto px-4 py-10 lg:px-10">
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl lg:text-5xl">{event.title}</h1>
        <p className="text-sm lg:text-lg">{event.description}</p>
      </div>

      {/* event Details */}
      <div className="">
        {/* left-side-bar */}
        <div className="">
          <Image
            src={event.image}
            alt={event.title}
            width={200}
            height={200}
            className="rounded"
          />

          <section className="flex flex-col gap-2 ">
            <h2>Overview</h2>
            <p className="text-muted-foreground">{event.overview}</p>
          </section>

          <section className="flex flex-col gap-2 ">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calender.svg" alt="calender" label={event.date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={event.time} />
            <EventDetailItem icon="/icons/location.svg" alt="location" label={event.location} />
            <EventDetailItem icon="/icons/price.svg" alt="mode" label={event.mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={event.audience} />
          </section>

          {event.agenda && event.agenda.length > 0 && (
            <EventAgenda agendaItems={event.agenda} />
          )}
          
          <section className="flex flex-col gap-2">
            <h2>About the Organizer</h2>
            <p>{event.organizer}</p>
          </section>
          
          {event.tags && event.tags.length > 0 && (
            <EventTags tags={event.tags} />
          )}
        </div>

        {/* right-side event booking */}
        <aside>
          <p></p>
        </aside>
      </div>
    </section>
  );
};
export default EventDetailsPage;
