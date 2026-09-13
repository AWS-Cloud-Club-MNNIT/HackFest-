import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    domains: {
      type: [String],
      // The PDF specifies fixed length 4, e.g., ["AI/ML","Web3","FinTech","HealthTech"]
      validate: {
        validator: function(arr) {
          return arr && arr.length === 4;
        },
        message: 'An event must have exactly 4 domains.'
      },
      required: true,
    },
    teamSizeMin: {
      type: Number,
      required: true,
      // e.g. 2
    },
    teamSizeMax: {
      type: Number,
      required: true,
      // e.g. 4
    },
    registrationDeadline: {
      type: Date,
      required: true,
      // All team edits locked after this date
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
