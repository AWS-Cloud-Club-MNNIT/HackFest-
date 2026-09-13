import Team from '../models/Team.js';
import Event from '../models/Event.js';
import crypto from 'crypto';
import QRCode from 'qrcode';

// POST /api/teams
export const createTeam = async (req, res) => {
  try {
    const { name, domain, eventId } = req.body;
    
    // TODO: Change this mock when Auth is fully implemented.
    // In the future, this will securely come from req.userId (from JWT)
    const leaderId = req.userId; 

    // TODO: In real implementation, check if Event registrationDeadline has passed
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
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

    // TODO: Update the User model to set their user.teamId to newTeam._id

    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/teams/:id
export const getTeam = async (req, res) => {
  try {
    // TODO: In future, use .populate('members') to get full user profiles
    const team = await Team.findById(req.params.id);
    
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/teams/:id/domain
export const updateDomain = async (req, res) => {
  try {
    const { domain } = req.body;
    const team = await Team.findById(req.params.id);
    
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // TODO: Verify if req.userId === team.leaderId.toString()
    // TODO: Verify if Event deadline has passed
    
    team.domain = domain;
    await team.save();
    
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/teams/:id/members/:userId
export const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const team = await Team.findById(id);
    
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // TODO: Verify if req.userId === team.leaderId.toString()
    // TODO: Verify if Event deadline has passed

    team.members = team.members.filter(member => member.toString() !== userId);
    team.status = 'forming'; // Team is no longer full
    
    await team.save();
    
    // TODO: Update the removed User's profile to clear their teamId
    
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/teams/:id/leave
export const leaveTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    
    const userId = req.userId; // Mocked for now

    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    // TODO: Verify if Event deadline has passed
    // TODO: Ensure userId is NOT the leader (leader must transfer or delete)

    team.members = team.members.filter(member => member.toString() !== userId);
    team.status = 'forming';
    
    await team.save();
    
    // TODO: Update the User's profile to clear their teamId
    
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
    
    // According to PDF spec, QR is only generated when team is complete
    if (team.status !== 'complete') {
      return res.status(400).json({ message: 'Team status is not complete yet' });
    }

    // Generate a unique token if it doesn't have one
    if (!team.qrToken) {
      team.qrToken = crypto.randomBytes(20).toString('hex');
      await team.save();
    }

    // Generate base64 QR code image using the qrToken
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
    
    // TODO: In future, use .populate('members') to return full details
    const team = await Team.findOne({ qrToken });
    
    if (!team) return res.status(404).json({ message: 'Invalid QR Token' });
    
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
