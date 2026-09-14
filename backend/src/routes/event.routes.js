import express from "express";

import { getAllEvents, getEventById, getActiveEvent } from "../controllers/event.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Read-only for participants — event creation/editing lives under
// /api/super-admin/events instead.
router.get("/active", protect, getActiveEvent);
router.get("/", protect, getAllEvents);
router.get("/:id", protect, getEventById);

export default router;
