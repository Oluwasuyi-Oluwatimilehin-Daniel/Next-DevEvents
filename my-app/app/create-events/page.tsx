import CreateEventForm from "@/components/CreateEventForm";

/**
 * CreateEventsPage Component
 * Serves as the page wrapper for creating new developer events.
 * Renders page headers and embeds the interactive form.
 */
const CreateEventsPage = () => {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 lg:px-10">
      {/* Header section with page title and description */}
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Create Event
        </p>
        <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
          Share your next developer event
        </h1>
        <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
          Fill in the details below to publish an event for the community.
        </p>
      </div>

      {/* Render the event creation client component */}
      <CreateEventForm />
    </main>
  );
};

export default CreateEventsPage;

