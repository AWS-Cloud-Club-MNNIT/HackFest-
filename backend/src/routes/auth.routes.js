import express from "express";
import {
  signup,
  login,
  getMe,
  updateMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);

export default router;
//he