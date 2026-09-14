import express from "express";

import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getDashboardOverview,
  getAllUsers,
  getUserById,
  toggleBlockUser,
  updateUserRole,
  broadcastNotification,
  getAllTeams,
  getTeamById,
  lockTeam,
  unlockTeam,
  deleteTeam,
  exportUsers,
  exportTeams,
  forceAddMember,
  forceRemoveMember,
  markCheckedIn,
  extendDeadline,
} from "../controllers/superAdmin.controller.js";

import isSuperAdmin from "../middleware/isSuperAdmin.middleware.js";

const router = express.Router();

// ===============================
// SUPER ADMIN DASHBOARD
// ===============================

router.get("/dashboard", isSuperAdmin, getDashboardOverview);
router.get("/stats", isSuperAdmin, getDashboardOverview); // Alias for dashboard stats

// ===============================
// EVENT MANAGEMENT
// ===============================

router.post("/events", isSuperAdmin, createEvent);
router.get("/events", isSuperAdmin, getAllEvents);
router.get("/events/:id", isSuperAdmin, getEventById);
router.put("/events/:id", isSuperAdmin, updateEvent);
router.delete("/events/:id", isSuperAdmin, deleteEvent);
router.patch("/events/:id/extend-deadline", isSuperAdmin, extendDeadline);

// ===============================
// USER MANAGEMENT
// ===============================

router.get("/users", isSuperAdmin, getAllUsers);
router.get("/users/:id", isSuperAdmin, getUserById);
router.patch("/users/:id/block", isSuperAdmin, toggleBlockUser); // Changed from toggle-block based on PDF: /users/:id/block
router.patch("/users/:id/toggle-block", isSuperAdmin, toggleBlockUser); // Keeping old for backwards compat if needed
router.patch("/users/:id/role", isSuperAdmin, updateUserRole);

// ===============================
// TEAM MANAGEMENT
// ===============================

router.get("/teams", isSuperAdmin, getAllTeams);
router.get("/teams/:id", isSuperAdmin, getTeamById);
router.patch("/teams/:id/lock", isSuperAdmin, lockTeam);
router.patch("/teams/:id/unlock", isSuperAdmin, unlockTeam);
router.delete("/teams/:id", isSuperAdmin, deleteTeam);
router.post("/teams/:id/members", isSuperAdmin, forceAddMember);
router.delete("/teams/:id/members/:userId", isSuperAdmin, forceRemoveMember);
router.patch("/teams/:id/checkin", isSuperAdmin, markCheckedIn);

// ===============================
// NOTIFICATIONS (BROADCAST)
// ===============================

router.post("/notifications/broadcast", isSuperAdmin, broadcastNotification);

// ===============================
// EXPORT
// ===============================

router.get("/export/users", isSuperAdmin, exportUsers);
router.get("/export/teams", isSuperAdmin, exportTeams);

export default router;
