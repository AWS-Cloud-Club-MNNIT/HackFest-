import express from "express";
import {
  getUsersLookingForTeam,
  getUserById,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Browse users who are looking for a team
router.get(
  "/looking-for-team",
  protect,
  getUsersLookingForTeam
);

// Get a specific user's profile
router.get(
  "/:id",
  protect,
  getUserById
);

export default router;