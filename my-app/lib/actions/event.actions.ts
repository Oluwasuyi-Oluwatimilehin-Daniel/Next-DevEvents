"use server";

import Event from "@/database/event.model";
import dbConnect from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await dbConnect();

    const event = await Event.findOne({ slug });

    if (!event) {
      return [];
    }

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();

    return JSON.parse(JSON.stringify(similarEvents));
  } catch (e) {
    console.error("Error fetching similar events:", e);
    return [];
  }
};
