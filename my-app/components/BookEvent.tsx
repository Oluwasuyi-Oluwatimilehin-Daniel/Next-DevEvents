"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

interface BookEventProps {
  eventId: string;
  slug: string;
  initialBookingsCount: number;
}

const BookEvent = ({ eventId, slug, initialBookingsCount }: BookEventProps) => {
  const [email, setEmail] = useState("");
  const [bookingsCount, setBookingsCount] = useState(initialBookingsCount);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // 1. Create the booking using the type-safe Server Action
      const result = await createBooking({ eventId, slug, email });

      if (!result.success) {
        throw new Error(result.error || "Failed to book your spot.");
      }

      setSubmitted(true);
      setBookingsCount((prev) => prev + 1);

      // 2. Track successful booking in analytics
      posthog.capture("event_booked", { eventId, slug, email });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to book your spot.";
      setErrorMsg(errMsg);

      // 3. Track any exceptions in analytics
      posthog.captureException(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-zinc-100">Book Your Spot</h3>
        {bookingsCount > 0 ? (
          <p className="text-sm text-emerald-400 font-medium">
            🔥 Join {bookingsCount} {bookingsCount === 1 ? "person" : "people"} registered
          </p>
        ) : (
          <p className="text-sm text-zinc-400">Be the first to secure a spot!</p>
        )}
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center p-6 text-center border border-emerald-500/20 bg-emerald-950/20 rounded-xl animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3 animate-bounce" />
          <h4 className="text-base font-semibold text-zinc-100 mb-1">Spot Secured!</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Thank you! A confirmation has been prepared for <span className="text-zinc-200 font-medium">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="name@company.com"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-zinc-950/60 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 border border-red-500/20 bg-red-950/20 text-red-200 rounded-xl text-xs leading-relaxed animate-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-600 disabled:opacity-80 text-zinc-950 font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Securing Spot...</span>
              </>
            ) : (
              <span>Book Spot Now</span>
            )}
          </button>

          <div className="flex items-center gap-1.5 justify-center text-[10px] text-zinc-500 pt-1 border-t border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
            <span>Secure, free signup. Cancel anytime.</span>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
