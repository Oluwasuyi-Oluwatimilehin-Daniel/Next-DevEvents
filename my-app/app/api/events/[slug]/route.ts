import dbConnect from "@/lib/mongodb";
import Event from "@/database/event.model";
import Bookings from "@/database/booking.model";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

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

/**
 * DELETE handler to delete an event by its slug parameter.
 * URL: /api/events/[slug]
 * 1. Resolves dynamic route parameters.
 * 2. Connects to MongoDB database.
 * 3. Finds and deletes the event matching the slug.
 * 4. Cleans up associated booking records.
 * 5. Purges Next.js homepage cache so deleted event is removed immediately.
 */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    // Step 1: Resolve dynamic route params Promise to get slug
    const { slug } = await params;

    // Validate the slug input parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "A valid slug parameter is required." },
        { status: 400 },
      );
    }

    // Step 2: Connect to MongoDB database
    await dbConnect();

    // Step 3: Find the target event document by slug
    const event = await Event.findOne({ slug: slug.trim() });

    // Handle event not found error
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${slug}' not found.` },
        { status: 404 },
      );
    }

    // Step 4: Delete associated event image from Cloudinary storage if present
    if (event.image && typeof event.image === "string") {
      try {
        const parts = event.image.split("/");
        const filenameWithExt = parts.pop() || "";
        const filename = filenameWithExt.split(".")[0];
        const folderIndex = parts.indexOf("Next-DevEvents");

        if (folderIndex !== -1 && filename) {
          const publicId = `Next-DevEvents/${filename}`;
          await cloudinary.uploader.destroy(publicId);
          console.log(`[DELETE /api/events/[slug]] Cloudinary image deleted: ${publicId}`);
        }
      } catch (imgError) {
        console.warn("[DELETE /api/events/[slug]] Cloudinary deletion warning:", imgError);
      }
    }

    // Step 5: Permanently delete the event document from MongoDB
    await event.deleteOne();

    // Step 6: Delete all associated bookings from the Bookings collection
    await Bookings.deleteMany({ eventId: event._id });

    // Step 7: Revalidate the home page cache so the deleted event disappears immediately from homepage
    revalidatePath("/");

    // Step 7: Return success response
    return NextResponse.json(
      {
        message: "Event deleted successfully.",
        eventSlug: slug,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(`[DELETE /api/events/[slug]] Error:`, error);

    // Return internal server error response
    return NextResponse.json(
      {
        message: "An unexpected error occurred while deleting the event.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}