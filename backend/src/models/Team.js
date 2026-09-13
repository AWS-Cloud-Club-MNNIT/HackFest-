import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    domain: {
      type: String,
      // Will be validated against Event.domains when joining/creating
    },
    status: {
      type: String,
      enum: ['forming', 'complete', 'locked'],
      default: 'forming',
    },
    qrToken: {
      type: String,
      // Generated once status = "complete"
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkedInAt: {
      type: Date,
      // Timestamp of check-in
    },
    lockedBySuperAdmin: {
      type: Boolean,
      default: false,
      // Super-admin can force-lock a team regardless of deadline
    }
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  }
);

// The PDF states name must be "unique per event". 
// A compound index ensures no two teams can have the same name in the same event.
teamSchema.index({ name: 1, eventId: 1 }, { unique: true });

const Team = mongoose.model('Team', teamSchema);

export default Team;
