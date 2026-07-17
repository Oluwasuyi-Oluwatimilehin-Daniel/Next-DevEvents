import dbConnect from "@/lib/mongodb";
import Event from "@/database/event.model";
import Bookings from "@/database/booking.model";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * POST handler to book a spot for an event.
 * URL: /api/events/[slug]/book
 */
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "A valid slug parameter is required." },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Find the event by slug to get its ID
    const event = await Event.findOne({ slug: slug.trim() });
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${slug}' not found.` },
        { status: 404 },
      );
    }

    // Parse email from request body
    const body = await req.json();
    const email = body.email;

    if (!email || typeof email !== "string" || email.trim() === "") {
      return NextResponse.json(
        { message: "A valid email address is required." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Invalid email address format." },
        { status: 400 },
      );
    }

    // Check if the user has already booked a spot for this event
    const existingBooking = await Bookings.findOne({
      eventId: event._id,
      email: normalizedEmail,
    });

    if (existingBooking) {
      return NextResponse.json(
        { message: "You have already booked a spot for this event!" },
        { status: 400 },
      );
    }

    // Save the new booking
    const booking = await Bookings.create({
      eventId: event._id,
      email: normalizedEmail,
    });

    return NextResponse.json(
      {
        message: "Spot booked successfully!",
        booking,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(`[POST /api/events/[slug]/book] Error:`, error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred while booking the spot.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
