import Team from '../models/Team.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import crypto from 'crypto';
import QRCode from 'qrcode';

// POST /api/teams
export const createTeam = async (req, res) => {
  try {
    const { name, domain, eventId } = req.body;
    const leaderId = req.user._id;

    if (req.user.teamId) {
      return res.status(400).json({ message: 'You are already in a team' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }
    if (domain && !event.domains.includes(domain)) {
      return res.status(400).json({ message: 'Invalid domain selected' });
    }

    const newTeam = new Team({
      name,
      domain,
      eventId,
      leaderId,
      members: [leaderId],
      status: 'forming'
    });

    await newTeam.save();

    await User.findByIdAndUpdate(leaderId, { 
      teamId: newTeam._id, 
      lookingForTeam: false 
    });

    res.status(201).json(newTeam);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Team name already exists for this event' });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET /api/teams/:id
export const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('members', '-passwordHash')
      .populate('leaderId', '-passwordHash')
      .populate('eventId', 'name teamSizeMax registrationDeadline');
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Auto-complete logic if team is full but status is forming
    if (team.status !== 'complete' && team.eventId && team.members.length >= team.eventId.teamSizeMax) {
      team.status = 'complete';
      if (!team.qrToken) {
        team.qrToken = crypto.randomBytes(20).toString('hex');
      }
      await team.save();
    }

    // Security check: Only allow actual team members or super_admin to see email and phone
    const isMember = team.members.some(member => member._id.toString() === req.user._id.toString());
    const isSuperAdmin = req.user.role === 'super_admin';

    const teamObj = team.toObject();

    if (!isMember && !isSuperAdmin) {
      teamObj.members = teamObj.members.map(member => {
        const { email, phone, ...safeMember } = member;
        return safeMember;
      });
      if (teamObj.leaderId) {
        const { email, phone, ...safeLeader } = teamObj.leaderId;
        teamObj.leaderId = safeLeader;
      }
    }

    res.status(200).json(teamObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/teams/:id/domain
export const updateDomain = async (req, res) => {
  try {
    const { domain } = req.body;
    const team = await Team.findById(req.params.id).populate('eventId');
    
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team leader can change domain' });
    }
    if (team.lockedBySuperAdmin || new Date() > new Date(team.eventId.registrationDeadline)) {
      return res.status(403).json({ message: 'Edits are locked (deadline passed or super admin lock)' });
    }
    if (!team.eventId.domains.includes(domain)) {
      return res.status(400).json({ message: 'Invalid domain selected' });
    }

    team.domain = domain;
    await team.save();
    
    // Notify all members
    const notifications = await Promise.all(
      team.members.map(memberId => 
        Notification.create({
          userId: memberId,
          type: 'domain_changed',
          message: `Your team domain was changed to ${domain}`,
          relatedId: team._id
        })
      )
    );

    notifications.forEach(notif => {
      req.app.get('io').to(`user:${notif.userId}`).emit('notification:new', notif);
    });

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/teams/:id/members/:userId
export const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const team = await Team.findById(id).populate('eventId');
    
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team leader can remove members' });
    }
    if (team.lockedBySuperAdmin || new Date() > new Date(team.eventId.registrationDeadline)) {
      return res.status(403).json({ message: 'Edits are locked (deadline passed or super admin lock)' });
    }
    if (team.leaderId.toString() === userId) {
      return res.status(400).json({ message: 'Leader cannot be removed. Transfer leadership or delete team.' });
    }
    if (!team.members.some(m => m.toString() === userId)) {
      return res.status(404).json({ message: 'User is not in this team' });
    }

    const removedUser = await User.findById(userId).select('name email');

    team.members = team.members.filter(member => member.toString() !== userId);
    team.status = 'forming';
    team.memberHistory.push({
      userId,
      name: removedUser?.name,
      email: removedUser?.email,
      action: 'removed',
    });

    await team.save();
    await User.findByIdAndUpdate(userId, { $unset: { teamId: 1 }, lookingForTeam: true });
    
    // Notify the removed member
    const notification = await Notification.create({
      userId,
      type: 'member_left',
      message: `You were removed from the team ${team.name}`,
      relatedId: team._id
    });
    req.app.get('io').to(`user:${userId}`).emit('notification:new', notification);

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/teams/:id/leave
export const leaveTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id).populate('eventId');
    const userId = req.user._id.toString();

    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.lockedBySuperAdmin || new Date() > new Date(team.eventId.registrationDeadline)) {
      return res.status(403).json({ message: 'Edits are locked (deadline passed or super admin lock)' });
    }
    if (team.leaderId.toString() === userId) {
      return res.status(400).json({ message: 'Leader cannot leave. Transfer leadership or delete team.' });
    }
    if (!team.members.some(m => m.toString() === userId)) {
      return res.status(404).json({ message: 'You are not in this team' });
    }

    team.members = team.members.filter(member => member.toString() !== userId);
    team.status = 'forming';
    team.memberHistory.push({
      userId,
      name: req.user.name,
      email: req.user.email,
      action: 'left',
    });

    await team.save();
    await User.findByIdAndUpdate(userId, { $unset: { teamId: 1 }, lookingForTeam: true });
    
    // Notify the leader
    const notification = await Notification.create({
      userId: team.leaderId,
      type: 'member_left',
      message: `${req.user.name} has left your team ${team.name}`,
      relatedId: team._id
    });
    req.app.get('io').to(`user:${team.leaderId}`).emit('notification:new', notification);

    res.status(200).json({ message: 'Successfully left the team', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/teams/:id/qr
export const getQRCode = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (!team.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized for this team' });
    }
    
    if (team.status !== 'complete') {
      return res.status(400).json({ message: 'Team status is not complete yet' });
    }

    if (!team.qrToken) {
      team.qrToken = crypto.randomBytes(20).toString('hex');
      await team.save();
    }

    const qrImageBase64 = await QRCode.toDataURL(team.qrToken);
    
    res.status(200).json({ 
      qrToken: team.qrToken,
      qrImage: qrImageBase64 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/teams/scan/:qrToken
export const scanQR = async (req, res) => {
  try {
    const { qrToken } = req.params;
    const team = await Team.findOne({ qrToken }).populate('members', '-passwordHash');
    
    if (!team) return res.status(404).json({ message: 'Invalid QR Token' });
    
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/teams/:id/looking-for-teammates
export const toggleLookingForTeammates = async (req, res) => {
  try {
    const { id } = req.params;
    const { lookingForTeammates } = req.body;
    
    const team = await Team.findById(id).populate('eventId');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team leader can change this setting' });
    }
    
    team.lookingForTeammates = lookingForTeammates;
    await team.save();
    
    res.status(200).json({ message: 'Looking for teammates status updated', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/teams/available
export const getAvailableTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      lookingForTeammates: true,
      $expr: { $lt: [{ $size: "$members" }, 4] },
      status: 'forming'
    })
      .populate('leaderId', '-passwordHash -email -phone')
      .populate('members', '-passwordHash -email -phone')
      .populate('eventId', 'name teamSizeMax');
    
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/teams/:id/toggle-status
export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id).populate('eventId');
    
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team leader can change status' });
    }
    
    if (team.status === 'forming') {
      const minSize = team.eventId.teamSizeMin || 2;
      const maxSize = team.eventId.teamSizeMax || 4;
      const currentSize = team.members.length;
      
      if (currentSize < minSize || currentSize > maxSize) {
         return res.status(400).json({ message: `Team size must be between ${minSize} and ${maxSize} to complete.` });
      }
      
      team.status = 'complete';
      team.lookingForTeammates = false; // Disable looking for teammates
    } else {
      team.status = 'forming';
    }
    
    await team.save();
    res.status(200).json({ message: `Team is now ${team.status}`, team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
