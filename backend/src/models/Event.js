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
      trim: true,
    },

    domains: {
      type: [String],
      required: true,
      validate: {
        validator: (domains) =>
          Array.isArray(domains) &&
          domains.length === 4 &&
          domains.every((domain) => domain.trim().length > 0),

        message: "Exactly 4 non-empty domains are required",
      },
    },

    teamSizeMin: {
      type: Number,
      required: true,
      min: 1,
    },

    teamSizeMax: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: function (value) {
          return value >= this.teamSizeMin;
        },

        message:
          "Maximum team size must be greater than or equal to minimum team size",
      },
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