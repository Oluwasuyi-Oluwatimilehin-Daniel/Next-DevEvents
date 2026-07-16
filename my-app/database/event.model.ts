import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Interface representing the Event properties
export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  audience: string;
  mode: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface representing the Event mongoose document
export interface IEventDocument extends IEvent, Document {}

const eventSchema = new Schema<IEventDocument>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    overview: { type: String, required: [true, "Overview is required"], trim: true },
    image: { type: String, required: [true, "Image is required"], trim: true },
    venue: { type: String, required: [true, "Venue is required"], trim: true },
    location: { type: String, required: [true, "Location is required"], trim: true },
    date: { type: String, required: [true, "Date is required"], trim: true },
    time: { type: String, required: [true, "Time is required"], trim: true },
    audience: { type: String, required: [true, "Audience is required"], trim: true },
    mode: { type: String, required: [true, "Mode is required"], trim: true },
    agenda: { type: [String], required: [true, "Agenda is required"] },
    organizer: { type: String, required: [true, "Organizer is required"], trim: true },
    tags: { type: [String], required: [true, "Tags are required"] },
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

// Pre-save hook to validate required fields, generate slug, and normalize date
eventSchema.pre<IEventDocument>("save", async function (this: IEventDocument) {
  // Validate that required fields are present and non-empty
  const requiredFields: (keyof IEvent)[] = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "audience",
    "mode",
    "organizer",
  ];

  for (const field of requiredFields) {
    const value = this[field];
    if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
      throw new Error(`Field '${field}' is required and cannot be empty.`);
    }
  }

  // Generate URL-friendly slug from title if modified
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
      .replace(/(^-|-$)+/g, ""); // Trim leading/trailing hyphens
  }

  // Validate and normalize date to consistent ISO string format
  if (this.isModified("date")) {
    const parsedDate = Date.parse(this.date);
    if (isNaN(parsedDate)) {
      throw new Error(`Invalid date value/format: ${this.date}`);
    }
    this.date = new Date(parsedDate).toISOString();
  }
});

const Event: Model<IEventDocument> =
  models.Event || model<IEventDocument>("Event", eventSchema);

export default Event;
