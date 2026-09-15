import JoinRequest from '../models/JoinRequest.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import crypto from 'crypto';

// POST /api/join-requests
export const createJoinRequest = async (req, res) => {
  try {
    const { teamId } = req.body;
    const fromUserId = req.user._id;

    if (req.user.teamId) {
      return res.status(400).json({ message: 'You are already in a team' });
    }

    const team = await Team.findById(teamId).populate('eventId');
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.lockedBySuperAdmin || new Date() > new Date(team.eventId.registrationDeadline)) {
      return res.status(403).json({ message: 'Registration deadline has passed' });
    }

    if (team.status === 'complete' || team.members.length >= team.eventId.teamSizeMax) {
      return res.status(400).json({ message: 'Team is already full' });
    }

    const existingRequest = await JoinRequest.findOne({ teamId, fromUserId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'Join request already sent to this team' });
    }

    const joinRequest = new JoinRequest({ teamId, fromUserId });
    await joinRequest.save();

    res.status(201).json(joinRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/join-requests/team/:teamId
export const getTeamJoinRequests = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team leader can view join requests' });
    }

    const requests = await JoinRequest.find({ teamId: team._id, status: 'pending' })
      .populate('fromUserId', 'name email skills college branch year');
      
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/join-requests/:id/accept
export const acceptJoinRequest = async (req, res) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.id);
    if (!joinRequest) return res.status(404).json({ message: 'Join request not found' });
    
    if (joinRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }

    const team = await Team.findById(joinRequest.teamId).populate('eventId');
    if (!team) return res.status(404).json({ message: 'Team no longer exists' });
    
    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team leader can accept join requests' });
    }

    if (team.lockedBySuperAdmin || new Date() > new Date(team.eventId.registrationDeadline)) {
      return res.status(403).json({ message: 'Registration deadline has passed' });
    }

    if (team.status === 'complete' || team.members.length >= team.eventId.teamSizeMax) {
      joinRequest.status = 'rejected';
      await joinRequest.save();
      return res.status(400).json({ message: 'Team is already full' });
    }

    const joiningUser = await User.findById(joinRequest.fromUserId);
    if (!joiningUser) return res.status(404).json({ message: 'User not found' });
    if (joiningUser.teamId) {
      joinRequest.status = 'rejected';
      await joinRequest.save();
      return res.status(400).json({ message: 'User is already in another team' });
    }

    team.members.push(joinRequest.fromUserId);

    // If this user had previously left/been removed from this same team,
    // mark that history as resolved (rejoined) rather than leaving it
    // looking like an unresolved quit in the Super Admin panel.
    team.memberHistory.forEach((h) => {
      if (h.userId.toString() === joinRequest.fromUserId.toString() && !h.rejoined) {
        h.rejoined = true;
      }
    });

    if (team.members.length >= team.eventId.teamSizeMax) {
      team.status = 'complete';
      if (!team.qrToken) {
        team.qrToken = crypto.randomBytes(20).toString('hex');
      }
    }

    await team.save();

    await User.findByIdAndUpdate(joinRequest.fromUserId, { 
      teamId: team._id, 
      lookingForTeam: false 
    });

    joinRequest.status = 'accepted';
    await joinRequest.save();

    // Cancel other pending requests from this user
    await JoinRequest.updateMany(
      { fromUserId: joinRequest.fromUserId, status: 'pending' },
      { status: 'rejected' }
    );

    res.status(200).json({ message: 'Request accepted', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/join-requests/:id/reject
export const rejectJoinRequest = async (req, res) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.id);
    if (!joinRequest) return res.status(404).json({ message: 'Join request not found' });

    const team = await Team.findById(joinRequest.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team leader can reject join requests' });
    }

    joinRequest.status = 'rejected';
    await joinRequest.save();

    res.status(200).json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};