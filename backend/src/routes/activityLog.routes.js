import express from "express";

import { getActivityLogs } from "../controllers/activityLog.controller.js";

import isSuperAdmin from "../middleware/isSuperAdmin.middleware.js";

const router = express.Router();

// GET ACTIVITY LOGS
router.get("/", isSuperAdmin, getActivityLogs);

export default router;