'use server';

import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import dbConnect from "../mongodb";
import { sendBookingConfirmationEmail } from "../email";
import { formatDate } from "../utils";

export const createBooking = async ({
  eventId,
  slug,
  email,
}: {
  eventId: string;
  slug?: string;
  email: string;
}) => {
  try {
    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if the user has already booked a spot for this event
    const existingBooking = await Booking.findOne({
      eventId,
      email: normalizedEmail,
    });

    if (existingBooking) {
      return {
        success: false,
        error: "You have already booked a spot for this event!",
      };
    }

    // 2. Query event details to send personalized email notification
    let event = null;
    if (eventId) {
      event = await Event.findById(eventId);
    } else if (slug) {
      event = await Event.findOne({ slug });
    }

    // 3. Save the new booking in MongoDB
    const bookingDoc = await Booking.create({
      eventId,
      email: normalizedEmail,
    });

    // 4. Send email notification to the entered email address
    if (event) {
      await sendBookingConfirmationEmail({
        to: normalizedEmail,
        eventTitle: event.title,
        eventDate: formatDate(event.date),
        eventTime: event.time,
        eventLocation: event.location,
        eventVenue: event.venue,
      });
    }

    // 5. Serialize mongoose document safely for Next.js Client/Server Components
    const booking = JSON.parse(JSON.stringify(bookingDoc));

    return { success: true, booking };
  } catch (error) {
    console.error("[createBooking] Booking creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }
};