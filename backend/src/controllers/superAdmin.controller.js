import Event from "../models/Event.js";
import User from "../models/User.js";
import Team from "../models/Team.js";
import Notification from "../models/Notification.js";

// ===============================
// CREATE EVENT
// ===============================
const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL EVENTS
// ===============================
const getAllEvents = async (req, res) => {
  try {
    const { status, isActive } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const events = await Event.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: events.length,
      filters: {
        status: status || null,
        isActive: isActive !== undefined ? isActive === "true" : null,
      },
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

// ===============================
// GET SINGLE EVENT
// ===============================
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE EVENT
// ===============================
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

// ===============================
// DELETE EVENT
// ===============================
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

// ===============================
// SUPER ADMIN DASHBOARD
// ===============================
const getDashboardOverview = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    const totalTeams = await Team.countDocuments();

    res.status(200).json({
      success: true,
      dashboard: {
        totalEvents,
        activeEvents,
        totalUsers,
        totalTeams,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL USERS
// ===============================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// ===============================
// GET SINGLE USER
// ===============================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// ===============================
// BROADCAST NOTIFICATION
// ===============================
// NOTE: Notification schema (models/Notification.js) currently requires
// a per-user `userId` and a `type` from a fixed enum that has no
// "broadcast"/"announcement" value. This function needs to be aligned
// with Naman's Notification schema before it will work — see the
// TODO below.
const broadcastNotification = async (req, res) => {
  try {
    const { message, type } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // TODO: Notification schema requires userId + a fixed type enum.
    // Loop over target users (e.g. all participants) and create one
    // notification per user, using an allowed `type` value, e.g.:
    //
    // const users = await User.find({ role: "participant" });
    // await Notification.insertMany(
    //   users.map((u) => ({
    //     userId: u._id,
    //     type: type || "deadline_reminder",
    //     message,
    //   }))
    // );

    res.status(501).json({
      success: false,
      message:
        "Broadcast not implemented yet — Notification schema needs a broadcast-friendly type/userId strategy first.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create broadcast notification",
      error: error.message,
    });
  }
};

// ===============================
// EXPORTS
// ===============================
export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getDashboardOverview,
  getAllUsers,
  getUserById,
  broadcastNotification,
};
