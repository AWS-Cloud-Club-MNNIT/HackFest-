import Invite from '../models/Invite.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import crypto from 'crypto';

// POST /api/invites
export const sendInvite = async (req, res) => {
  try {
    const { teamId, toUserId } = req.body;
    const fromUserId = req.user._id;

    const team = await Team.findById(teamId).populate('eventId');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    if (team.leaderId.toString() !== fromUserId.toString()) {
      return res.status(403).json({ message: 'Only team leader can send invites' });
    }

    if (team.lockedBySuperAdmin || new Date() > new Date(team.eventId.registrationDeadline)) {
      return res.status(403).json({ message: 'Registration deadline has passed' });
    }

    if (team.status === 'complete' || team.members.length >= team.eventId.teamSizeMax) {
      return res.status(400).json({ message: 'Team is already full' });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ message: 'Invited user not found' });
    if (toUser.teamId) {
      return res.status(400).json({ message: 'User is already in a team' });
    }

    const existingInvite = await Invite.findOne({ teamId, toUserId, status: 'pending' });
    if (existingInvite) {
      return res.status(400).json({ message: 'Invite already sent to this user' });
    }

    const invite = new Invite({ teamId, fromUserId, toUserId });
    await invite.save();

    // Create a Notification for the invited user
    const notification = await Notification.create({
      userId: toUserId,
      type: 'invite_received',
      message: `You have been invited to join team: ${team.name}`,
      relatedId: invite._id
    });

    req.app.get('io').to(`user:${toUserId}`).emit('notification:new', notification);

    res.status(201).json(invite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/invites/received
export const getReceivedInvites = async (req, res) => {
  try {
    const invites = await Invite.find({ toUserId: req.user._id, status: 'pending' })
      .populate('teamId', 'name domain')
      .populate('fromUserId', 'name email');
    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/invites/:id/accept
export const acceptInvite = async (req, res) => {
  try {
    const invite = await Invite.findById(req.params.id);
    if (!invite) return res.status(404).json({ message: 'Invite not found' });
    
    if (invite.toUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this invite' });
    }
    if (invite.status !== 'pending') {
      return res.status(400).json({ message: 'Invite is no longer pending' });
    }

    if (req.user.teamId) {
      return res.status(400).json({ message: 'You are already in a team' });
    }

    const team = await Team.findById(invite.teamId).populate('eventId');
    if (!team) return res.status(404).json({ message: 'Team no longer exists' });
    
    if (team.lockedBySuperAdmin || new Date() > new Date(team.eventId.registrationDeadline)) {
      return res.status(403).json({ message: 'Registration deadline has passed' });
    }

    if (team.status === 'complete' || team.members.length >= team.eventId.teamSizeMax) {
      invite.status = 'cancelled';
      await invite.save();
      return res.status(400).json({ message: 'Team is already full' });
    }

    team.members.push(req.user._id);
    
    if (team.members.length >= team.eventId.teamSizeMax) {
      team.status = 'complete';
      if (!team.qrToken) {
        team.qrToken = crypto.randomBytes(20).toString('hex');
      }
    }

    await team.save();

    await User.findByIdAndUpdate(req.user._id, { 
      teamId: team._id, 
      lookingForTeam: false 
    });

    invite.status = 'accepted';
    await invite.save();

    // Cancel other pending invites for this user
    await Invite.updateMany(
      { toUserId: req.user._id, status: 'pending' },
      { status: 'cancelled' }
    );

    // Notify the leader that their invite was accepted
    const notification = await Notification.create({
      userId: team.leaderId,
      type: 'invite_accepted',
      message: `${req.user.name} accepted your invite to join ${team.name}`,
      relatedId: team._id
    });

    req.app.get('io').to(`user:${team.leaderId}`).emit('notification:new', notification);

    res.status(200).json({ message: 'Invite accepted', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/invites/:id/reject
export const rejectInvite = async (req, res) => {
  try {
    const invite = await Invite.findById(req.params.id);
    if (!invite) return res.status(404).json({ message: 'Invite not found' });
    
    if (invite.toUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this invite' });
    }

    invite.status = 'rejected';
    await invite.save();

    res.status(200).json({ message: 'Invite rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/invites/:id
export const cancelInvite = async (req, res) => {
  try {
    const invite = await Invite.findById(req.params.id);
    if (!invite) return res.status(404).json({ message: 'Invite not found' });

    if (invite.fromUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only sender can cancel the invite' });
    }

    await invite.deleteOne();

    res.status(200).json({ message: 'Invite cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
