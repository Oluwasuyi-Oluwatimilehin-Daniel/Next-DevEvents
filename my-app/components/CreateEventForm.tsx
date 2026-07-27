"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type EventFormState = {
  title: string;
  description: string;
  overview: string;
  image: File | null;
  venue: string;
  location: string;
  date: string;
  time: string;
  audience: string;
  mode: string;
  agenda: string;
  organizer: string;
  tags: string;
};

const initialFormState: EventFormState = {
  title: "",
  description: "",
  overview: "",
  image: null,
  venue: "",
  location: "",
  date: "",
  time: "",
  audience: "",
  mode: "",
  agenda: "",
  organizer: "",
  tags: "",
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200";

const CreateEventForm = () => {
  const router = useRouter(); // Next.js router instance for client-side navigation
  const [form, setForm] = useState<EventFormState>(initialFormState); // Local form input state
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for button
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null); // Feedback message state (success / error banner)

  // Generic change handler for text inputs, textareas, selects, and file uploads
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handles form submission to the backend API endpoint
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Validate image file upload before submitting
    if (!form.image) {
      setMessage({ type: "error", text: "Please upload an event image." });
      setIsSubmitting(false);
      return;
    }

    // Construct FormData object to transfer text fields and image file payload
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append("image", value);
      } else if (typeof value === "string" && value.trim()) {
        formData.append(key, value);
      }
    });

    try {
      // Send POST request to backend route handler (/api/events)
      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to create event.",
        );
      }

      // Display success message and reset form fields
      setMessage({
        type: "success",
        text: data.message || "Event created successfully!",
      });
      setForm(initialFormState);

      // Redirect user to home page and force router refresh to display the newly revalidated event immediately
      router.push("/");
      router.refresh();
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Something went wrong.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-2xl shadow-emerald-500/5 backdrop-blur md:p-8"
    >
      {message && (
        <div
          className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-500/20 bg-emerald-950/20 text-emerald-200"
              : "border-red-500/20 bg-red-950/20 text-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="title">
            Event Title
          </label>
          <input
            id="title"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Developer Summit 2026"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-300"
            htmlFor="organizer"
          >
            Organizer
          </label>
          <input
            id="organizer"
            name="organizer"
            required
            value={form.organizer}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Your name or team"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            className="text-sm font-medium text-zinc-300"
            htmlFor="description"
          >
            Short Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            value={form.description}
            onChange={handleChange}
            className={inputClassName}
            placeholder="A short one-line summary for the event card"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            className="text-sm font-medium text-zinc-300"
            htmlFor="overview"
          >
            Full Overview
          </label>
          <textarea
            id="overview"
            name="overview"
            required
            rows={5}
            value={form.overview}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Describe what attendees can expect"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="image">
            Event Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
            onChange={handleChange}
            className="w-full rounded-xl border border-dashed border-white/10 py-3 bg-zinc-950/60 px-4 text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="venue">
            Venue
          </label>
          <input
            id="venue"
            name="venue"
            required
            value={form.venue}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Main Hall, Zoom, etc."
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-300"
            htmlFor="location"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            required
            value={form.location}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Lagos, Nigeria"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            value={form.date}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="time">
            Time
          </label>
          <input
            id="time"
            name="time"
            required
            value={form.time}
            onChange={handleChange}
            className={inputClassName}
            placeholder="6:00 PM"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-300"
            htmlFor="audience"
          >
            Audience
          </label>
          <input
            id="audience"
            name="audience"
            required
            value={form.audience}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Developers, Designers, Students"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="mode">
            Event Mode
          </label>
          <select
            id="mode"
            name="mode"
            required
            value={form.mode}
            onChange={handleChange}
            className={inputClassName}
          >
            <option value="">Select mode</option>
            <option value="In Person">In Person</option>
            <option value="Virtual">Virtual</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="agenda">
            Agenda (separate items with commas)
          </label>
          <textarea
            id="agenda"
            name="agenda"
            rows={3}
            value={form.agenda}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Opening keynote, Workshop, Networking"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="tags">
            Tags (separate with commas)
          </label>
          <textarea
            id="tags"
            name="tags"
            rows={2}
            value={form.tags}
            onChange={handleChange}
            className={inputClassName}
            placeholder="ai, react, community"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 px-8 py-3.5 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
            <span>Publishing Event...</span>
          </>
        ) : (
          <span>Publish Event Now</span>
        )}
      </button>
    </form>
  );
};

export default CreateEventForm;
