import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // recipient
    },
    type: {
      type: String,
      enum: [
        'invite_received', 
        'invite_accepted', 
        'request_received', 
        'request_accepted', 
        'member_left', 
        'domain_changed', 
        'deadline_reminder'
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      // teamId / inviteId / requestId
    },
    read: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // handles createdAt
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
