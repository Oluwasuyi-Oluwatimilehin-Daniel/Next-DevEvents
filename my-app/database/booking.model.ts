import mongoose, { Schema, model, models, Document, Model, CallbackError } from "mongoose";

// Interface representing the Booking properties
export interface IBooking {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface representing the Booking mongoose document
export interface IBookingDocument extends IBooking, Document {}

const bookingSchema = new Schema<IBookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true, // Speeds up queries searching for bookings under a specific event
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      validate: {
        validator: function (v: string) {
          // Standard RFC 5322 email validation regex
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

// Pre-save hook to verify referenced eventId exists
bookingSchema.pre<IBookingDocument>("save", async function (this: IBookingDocument) {
  // Validate email format prior to saving
  if (this.isModified("email")) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      throw new Error("Invalid email address format.");
    }
  }

  // Verify that the event ID references a real event document
  if (this.isModified("eventId")) {
    const EventModel = mongoose.models.Event || mongoose.model("Event");
    const eventExists = await EventModel.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error(`Referenced Event with ID '${this.eventId}' does not exist.`);
    }
  }
});

const Bookings: Model<IBookingDocument> =
  models.Bookings || model<IBookingDocument>("Bookings", bookingSchema);

export default Bookings;
