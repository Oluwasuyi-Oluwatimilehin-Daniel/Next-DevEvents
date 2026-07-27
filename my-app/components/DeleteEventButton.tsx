"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import posthog from "posthog-js";

interface DeleteEventButtonProps {
  slug: string;
  eventTitle: string;
}

/**
 * DeleteEventButton Component
 * Renders a sleek delete action button for event detail pages.
 * API call to DELETE /api/events/[slug], and homepage redirection.
 */
const DeleteEventButton = ({ slug, eventTitle }: DeleteEventButtonProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Handles event deletion process upon user confirmation
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // 2. Send DELETE request to backend endpoint (/api/events/[slug])
      const response = await fetch(`/api/events/${slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event.");
      }

      // 3. Track event deletion in PostHog analytics
      posthog.capture("event_deleted", { slug, title: eventTitle });

      // 4. Redirect user to home page and force router refresh to display updated list
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("[DeleteEventButton] Error deleting event:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the event.",
      );
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      type="button"
      className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:border-red-400/50 hover:shadow-md hover:shadow-red-500/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      title="Delete this event"
    >
      {isDeleting ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-red-400" />
          <span>Deleting...</span>
        </>
      ) : (
        <>
          <Trash2 className="h-3.5 w-3.5 text-red-400" />
          <span>Delete Event</span>
        </>
      )}
    </button>
  );
};

export default DeleteEventButton;
