
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    domains: {
      type: [String],
      required: true,
      validate: {
        validator: (domains) => domains.length === 4,
        message: "Exactly 4 domains are required",
      },
    },

    teamSizeMin: {
      type: Number,
      required: true,
    },

    teamSizeMax: {
      type: Number,
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;