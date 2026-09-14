import express from "express";
import {
  getUsersLookingForTeam,
  getUserById,
  updateAvailability,
  searchParticipants
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Browse users who are looking for a team
router.get(
  "/looking-for-team",
  protect,
  getUsersLookingForTeam
);

// Update current user availability
router.patch(
  "/availability",
  protect,
  updateAvailability
);

// Search participants directly
router.get(
  "/search",
  protect,
  searchParticipants
);

// Get a specific user's profile
router.get(
  "/:id",
  protect,
  getUserById
);

export default router;