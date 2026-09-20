import express from 'express';
import { 
  createTeam, 
  getTeam, 
  updateDomain, 
  removeMember, 
  leaveTeam, 
  getQRCode, 
  toggleLookingForTeammates,
  toggleStatus,
  getAvailableTeams
} from '../controllers/team.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST: Create a team
router.post('/', protect, createTeam);

// GET: View available teams
router.get('/available', protect, getAvailableTeams);

// GET: View team details
router.get('/:id', protect, getTeam);

// PATCH: Toggle looking for teammates (Leader only)
router.patch('/:id/looking-for-teammates', protect, toggleLookingForTeammates);

// PATCH: Toggle team status between forming and complete (Leader only)
router.patch('/:id/toggle-status', protect, toggleStatus);

// PATCH: Change domain (Leader only)
router.patch('/:id/domain', protect, updateDomain);

// DELETE: Remove a member (Leader only)
router.delete('/:id/members/:userId', protect, removeMember);

// POST: Member leaves team
router.post('/:id/leave', protect, leaveTeam);

// GET: Get QR Code base64 image
router.get('/:id/qr', protect, getQRCode);

export default router;
