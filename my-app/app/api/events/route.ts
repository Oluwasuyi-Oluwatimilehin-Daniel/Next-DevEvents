import dbConnect from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import Event from "@/database/event.model";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * POST /api/events
 * Handles creation of a new event:
 * 1. Connects to MongoDB database.
 * 2. Parses form data and extracts uploaded image file.
 * 3. Uploads image to Cloudinary storage and obtains secure URL.
 * 4. Parses text fields (agenda and tags into arrays).
 * 5. Saves new event document in MongoDB.
 * 6. Revalidates Next.js cache for the home page so the new event appears at the top.
 */
export async function POST(req: NextRequest) {
  try {
    // Step 1: Connect to MongoDB database
    await dbConnect();

    // Step 2: Extract FormData sent from the client form submission
    const formData = await req.formData();

    let event: Record<string, string | File | string[] | undefined>;

    try {
      // Convert FormData entries to a plain JavaScript object
      event = Object.fromEntries(formData.entries()) as unknown as Record<
        string,
        string | File | string[] | undefined
      >;
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 },
      );
    }

    // Step 3: Retrieve the image file from either 'file' or 'image' field
    let file = formData.get("file") as File | null;
    if (!file || (file instanceof File && file.size === 0)) {
      const imageField = formData.get("image");
      if (imageField && imageField instanceof File && imageField.size > 0) {
        file = imageField;
      }
    }

    // Validate that an image file was provided
    if (!file || (file instanceof File && file.size === 0)) {
      return NextResponse.json(
        { message: "Image File is required" },
        { status: 400 },
      );
    }

    // Convert file to Buffer for Cloudinary upload stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to Cloudinary folder "Next-DevEvents"
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "Next-DevEvents" },
          (error, results) => {
            if (error) reject(error);
            resolve(results);
          },
        )
        .end(buffer);
    });

    // Replace the file object with the secure URL string returned from Cloudinary
    event.image = (uploadResult as { secure_url: string }).secure_url;

    // Clean up temporary file key before saving to database
    delete event.file;

    // Step 4: Normalize and parse 'agenda' (comma-separated string -> string array)
    const rawAgenda = event.agenda;
    if (typeof rawAgenda === "string" && rawAgenda.trim() !== "") {
      try {
        const parsed = JSON.parse(rawAgenda);
        event.agenda = Array.isArray(parsed) ? parsed : [rawAgenda];
      } catch {
        event.agenda = rawAgenda
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean);
      }
    }

    // Step 5: Normalize and parse 'tags' (comma-separated string -> string array)
    const rawTags = event.tags;
    if (typeof rawTags === "string" && rawTags.trim() !== "") {
      try {
        const parsed = JSON.parse(rawTags);
        event.tags = Array.isArray(parsed) ? parsed : [rawTags];
      } catch {
        event.tags = rawTags
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean);
      }
    }

    // Step 6: Create and save new Event document in MongoDB database
    const createdEvent = await Event.create(event);

    // Step 7: Purge Next.js cache for the home page ('/') so the new event shows up immediately at the top
    revalidatePath("/");

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 },
    );
  } catch (e) {
    console.error("API error:", e);
    
    // Safely extract and format error message
    let errorMessage = "Unknown error";
    if (e instanceof Error) {
      errorMessage = e.message;
    } else if (e && typeof e === "object") {
      errorMessage = (e as any).message || JSON.stringify(e);
    } else if (e) {
      errorMessage = String(e);
    }

    return NextResponse.json(
      {
        message: "Event creation failed",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/events
 * Fetches all events from MongoDB sorted newest-first (createdAt: -1).
 */
export async function GET() {
  try {
    await dbConnect();

    // Query events collection sorted by creation timestamp descending
    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event fetching failed",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
