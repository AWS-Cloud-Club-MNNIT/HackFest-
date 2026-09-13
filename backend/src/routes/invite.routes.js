import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { 
  sendInvite,
  getReceivedInvites,
  acceptInvite,
  rejectInvite,
  cancelInvite
} from '../controllers/invite.controller.js';

const router = express.Router();

// POST: Leader sends invite
router.post('/', protect, sendInvite);

// GET: Invites for logged-in user
router.get('/received', protect, getReceivedInvites);

// PATCH: Accept invite
router.patch('/:id/accept', protect, acceptInvite);

// PATCH: Reject invite
router.patch('/:id/reject', protect, rejectInvite);

// DELETE: Leader cancels a pending invite
router.delete('/:id', protect, cancelInvite);

export default router;
