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
  broadcastNotification,
  getAllTeams,
  getTeamById,
  lockTeam,
  unlockTeam,
  deleteTeam,
  exportUsers,
  exportTeams,
} from "../controllers/superAdmin.controller.js";

import isSuperAdmin from "../middleware/isSuperAdmin.middleware.js";

const router = express.Router();

// ===============================
// SUPER ADMIN DASHBOARD
// ===============================

router.get("/dashboard", isSuperAdmin, getDashboardOverview);

// ===============================
// EVENT MANAGEMENT
// ===============================

router.post("/events", isSuperAdmin, createEvent);

router.get("/events", isSuperAdmin, getAllEvents);

router.get("/events/:id", isSuperAdmin, getEventById);

router.put("/events/:id", isSuperAdmin, updateEvent);

router.delete("/events/:id", isSuperAdmin, deleteEvent);

// ===============================
// USER MANAGEMENT
// ===============================

router.get("/users", isSuperAdmin, getAllUsers);

router.get("/users/:id", isSuperAdmin, getUserById);

router.patch("/users/:id/toggle-block", isSuperAdmin, toggleBlockUser);

// ===============================
// TEAM MANAGEMENT
// ===============================

router.get("/teams", isSuperAdmin, getAllTeams);

router.get("/teams/:id", isSuperAdmin, getTeamById);

router.patch("/teams/:id/lock", isSuperAdmin, lockTeam);

router.patch("/teams/:id/unlock", isSuperAdmin, unlockTeam);

router.delete("/teams/:id", isSuperAdmin, deleteTeam);

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
