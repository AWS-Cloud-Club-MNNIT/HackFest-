import mongoose from 'mongoose';

const joinRequestSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // The solo user who is requesting to join
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  }
);

const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema);

export default JoinRequest;
