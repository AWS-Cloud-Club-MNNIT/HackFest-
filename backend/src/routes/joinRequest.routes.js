import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { 
  createJoinRequest,
  getTeamJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest
} from '../controllers/joinRequest.controller.js';

const router = express.Router();

// POST: Solo user requests to join team
router.post('/', protect, createJoinRequest);

// GET: Leader views incoming requests
router.get('/team/:teamId', protect, getTeamJoinRequests);

// PATCH: Leader accepts request
router.patch('/:id/accept', protect, acceptJoinRequest);

// PATCH: Leader rejects request
router.patch('/:id/reject', protect, rejectJoinRequest);

export default router;
