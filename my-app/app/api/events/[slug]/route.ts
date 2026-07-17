import dbConnect from "@/lib/mongodb";
import Event from "@/database/event.model";
import Bookings from "@/database/booking.model";
import { NextRequest, NextResponse } from "next/server";

// Define context type containing dynamic params as a Promise for Next.js 16 compatibility
interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET handler to retrieve event details by its slug parameter.
 * URL: /api/events/[slug]
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    // Resolve dynamic params Promise
    const { slug } = await params;

    // Validate the slug input parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "A valid slug parameter is required." },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Query event collection by slug
    const event = await Event.findOne({ slug: slug.trim() });

    // Handle event not found error
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${slug}' not found.` },
        { status: 404 },
      );
    }

    // Query bookings count for this event
    const bookingsCount = await Bookings.countDocuments({ eventId: event._id });

    // Return the fetched event and bookings count
    return NextResponse.json(
      {
        message: "Event details fetched successfully.",
        event,
        bookingsCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(`[GET /api/events/[slug]] Error:`, error);

    // Return internal server error details
    return NextResponse.json(
      {
        message: "An unexpected error occurred while retrieving event details.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
