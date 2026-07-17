'use server';

import Booking from "@/database/booking.model";

import dbConnect from "../mongodb";

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

    // 2. Save the new booking
    const bookingDoc = await Booking.create({
      eventId,
      email: normalizedEmail,
    });

    // 3. Serialize mongoose document safely for Next.js Client/Server Components
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