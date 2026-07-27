'use server';

import mongoose from "mongoose";
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import dbConnect from "../mongodb";
import { sendBookingConfirmationEmail } from "../email";
import { formatDate } from "../utils";
import { revalidatePath } from "next/cache";

export const createBooking = async ({
  eventId,
  slug,
  email,
}: {
  eventId?: string;
  slug?: string;
  email: string;
}) => {
  try {
    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find the target Event document by ID or slug first
    let event = null;
    if (eventId && mongoose.Types.ObjectId.isValid(eventId)) {
      event = await Event.findById(eventId);
    }
    
    if (!event && slug) {
      event = await Event.findOne({ slug: slug.trim() });
    }

    if (!event) {
      return {
        success: false,
        error: "Target event not found.",
      };
    }

    // 2. Check if this email address has ALREADY booked a spot for THIS SPECIFIC event
    const existingBooking = await Booking.findOne({
      eventId: event._id,
      email: normalizedEmail,
    });

    if (existingBooking) {
      return {
        success: false,
        error: "You have already booked a spot for this event!",
      };
    }

    // 3. Save the new booking in MongoDB bound to event._id
    const bookingDoc = await Booking.create({
      eventId: event._id,
      email: normalizedEmail,
    });

    // 4. Send email notification to the entered email address
    await sendBookingConfirmationEmail({
      to: normalizedEmail,
      eventTitle: event.title,
      eventDate: formatDate(event.date),
      eventTime: event.time,
      eventLocation: event.location,
      eventVenue: event.venue,
    });

    // 5. Revalidate cache for home page and event detail page
    revalidatePath("/");
    if (event.slug) {
      revalidatePath(`/events/${event.slug}`);
    }

    // 6. Serialize mongoose document safely for Next.js Client/Server Components
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