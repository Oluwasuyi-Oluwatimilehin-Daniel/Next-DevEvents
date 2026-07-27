import CreateEventForm from "@/components/CreateEventForm";
import Link from "next/link";
import { ChevronLeft, CalendarPlus } from "lucide-react";

/**
 * CreateEventsPage Component
 * Serves as the page wrapper for creating new developer events.
 * Renders page headers and embeds the interactive form.
 */
const CreateEventsPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background ambient gradient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-75 bg-linear-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <main className="container mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {/* Header section with page title and description */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <CalendarPlus className="h-3.5 w-3.5 text-emerald-400" />
            <span>Community Event Submission</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl tracking-tight">
            Share your next{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              developer event
            </span>
          </h1>

          <p className="max-w-xl text-sm text-zinc-400 sm:text-base leading-relaxed">
            Fill in the event details below to publish your meetup, hackathon,
            or conference for the global developer community.
          </p>
        </div>

        {/* Render the event creation client component */}
        <CreateEventForm />
      </main>
    </div>
  );
};

export default CreateEventsPage;
