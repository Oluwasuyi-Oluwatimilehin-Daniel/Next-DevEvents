import dbConnect from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import Event from "@/database/event.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    let event: Record<string, string | File | string[] | undefined>;

    try {
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

    // Retrieve file from either 'file' or 'image' key if uploaded as a File
    let file = formData.get("file") as File | null;
    if (!file || (file instanceof File && file.size === 0)) {
      const imageField = formData.get("image");
      if (imageField && imageField instanceof File && imageField.size > 0) {
        file = imageField;
      }
    }

    if (!file || (file instanceof File && file.size === 0)) {
      return NextResponse.json(
        { message: "Image File is required" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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

    // Overwrite event.image with the secure URL from Cloudinary
    event.image = (uploadResult as { secure_url: string }).secure_url;

    // Clean up temporary file fields so they aren't passed to Mongoose
    delete event.file;

    // Parse 'agenda' if it's a string (e.g. from form-data)
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

    // Parse 'tags' if it's a string (e.g. from form-data)
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

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

