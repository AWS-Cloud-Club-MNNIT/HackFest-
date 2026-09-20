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
    lookingForTeammates: {
      type: Boolean,
      default: true,
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
    },
    // Audit trail of members who left or were removed from this team.
    // Kept even after the member is no longer in `members`, so Super Admin
    // can see quit/removal history. The user's own profile (User doc) is
    // never deleted on leave/removal, so if they rejoin (this team or a
    // new one) their data is intact — this array is purely historical log.
    memberHistory: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: String,   // snapshot at time of event, in case user is later deleted entirely
        email: String,
        action: {
          type: String,
          enum: ['left', 'removed'],
        },
        at: {
          type: Date,
          default: Date.now,
        },
        rejoined: {
          type: Boolean,
          default: false,
          // set true if this user is added back to this team afterwards
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  }
);

// The PDF states name must be "unique per event". 
// A compound index ensures no two teams can have the same name in the same event.
teamSchema.index({ name: 1, eventId: 1 }, { unique: true });

// Ensure qrToken is unique across all teams, but only for teams that have one (sparse)
teamSchema.index({ qrToken: 1 }, { unique: true, sparse: true });

const Team = mongoose.model('Team', teamSchema);

export default Team;