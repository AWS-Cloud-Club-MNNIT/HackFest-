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

export default router;
