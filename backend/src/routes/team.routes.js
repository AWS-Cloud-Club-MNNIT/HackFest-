import express from 'express';
import { 
  createTeam, 
  getTeam, 
  updateDomain, 
  removeMember, 
  leaveTeam, 
  getQRCode, 
  scanQR 
} from '../controllers/team.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST: Create a team
router.post('/', protect, createTeam);

// GET: View team details
router.get('/:id', protect, getTeam);

// PATCH: Change domain (Leader only)
router.patch('/:id/domain', protect, updateDomain);

// DELETE: Remove a member (Leader only)
router.delete('/:id/members/:userId', protect, removeMember);

// POST: Member leaves team
router.post('/:id/leave', protect, leaveTeam);

// GET: Get QR Code base64 image
router.get('/:id/qr', protect, getQRCode);

// GET: Public/Organizer QR Scan endpoint (No protect required)
router.get('/scan/:qrToken', scanQR);

export default router;
