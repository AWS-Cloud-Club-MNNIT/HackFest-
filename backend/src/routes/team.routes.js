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

const router = express.Router();

// ==========================================
// MOCK AUTHENTICATION MIDDLEWARE FOR TESTING
// ==========================================
// TODO: Replace this entirely with real JWT verification middleware later!
const mockAuth = (req, res, next) => {
  // We inject a fake valid MongoDB ObjectId as the logged-in user
  req.userId = '60c72b2f9b1e8a001c8e4a11'; 
  console.log(`[Mock Auth] Proceeding as User ID: ${req.userId}`);
  next();
};

// POST: Create a team
router.post('/', mockAuth, createTeam);

// GET: View team details
router.get('/:id', mockAuth, getTeam);

// PATCH: Change domain (Leader only)
router.patch('/:id/domain', mockAuth, updateDomain);

// DELETE: Remove a member (Leader only)
router.delete('/:id/members/:userId', mockAuth, removeMember);

// POST: Member leaves team
router.post('/:id/leave', mockAuth, leaveTeam);

// GET: Get QR Code base64 image
router.get('/:id/qr', mockAuth, getQRCode);

// GET: Public/Organizer QR Scan endpoint
router.get('/scan/:qrToken', scanQR);

export default router;
