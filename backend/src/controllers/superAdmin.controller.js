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
// BLOCK / UNBLOCK USER
// ===============================
const toggleBlockUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (targetUser.role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot block another Super Admin",
      });
    }

    targetUser.isBlocked = !targetUser.isBlocked;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: targetUser.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user: {
        _id: targetUser._id,
        isBlocked: targetUser.isBlocked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user block status",
      error: error.message,
    });
  }
};

// ===============================
// BROADCAST NOTIFICATION
// ===============================
// Sends an in-app notification to every targeted user by creating one
// Notification doc per recipient (the schema is per-user, so a "broadcast"
// is just a fan-out insert). Also emits a live "notification:new" socket
// event to each connected recipient if Socket.io has been wired up
// (see backend/src/services/socket.service.js) so the bell updates
// instantly instead of waiting on the frontend's poll interval.
const broadcastNotification = async (req, res) => {
  try {
    const { message, audience } = req.body;
    // audience: "all" | "participants" | "team_leaders" (default: "participants")

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const filter =
      audience === "all"
        ? {}
        : audience === "team_leaders"
        ? { role: "participant" } // narrowed further below
        : { role: "participant" };

    let targetUsers = await User.find(filter).select("_id");

    if (audience === "team_leaders") {
      const leaderIds = await Team.distinct("leaderId");
      const leaderIdSet = new Set(leaderIds.map((id) => id.toString()));
      targetUsers = targetUsers.filter((u) =>
        leaderIdSet.has(u._id.toString())
      );
    }

    if (targetUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching users to notify",
      });
    }

    const notifications = await Notification.insertMany(
      targetUsers.map((u) => ({
        userId: u._id,
        type: "announcement",
        message: message.trim(),
      }))
    );

    // Fire a live socket event per recipient, if socket.io is attached.
    const io = req.app.get("io");
    if (io) {
      notifications.forEach((n) => {
        io.to(`user:${n.userId}`).emit("notification:new", n);
      });
    }

    res.status(201).json({
      success: true,
      message: `Broadcast sent to ${notifications.length} user(s)`,
      count: notifications.length,
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
// TEAM MANAGEMENT
// ===============================
const getAllTeams = async (req, res) => {
  try {
    const { status, eventId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (eventId) filter.eventId = eventId;

    const teams = await Team.find(filter)
      .populate("leaderId", "name email college")
      .populate("members", "name email college")
      .populate("eventId", "title")
      .populate("memberHistory.userId", "name email college isBlocked")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
      error: error.message,
    });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("leaderId", "name email college")
      .populate("members", "name email college")
      .populate("eventId", "title domains")
      .populate("memberHistory.userId", "name email college isBlocked");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch team",
      error: error.message,
    });
  }
};

// Force-lock a team regardless of the registration deadline (e.g. to
// freeze the roster once check-in starts).
const lockTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { lockedBySuperAdmin: true, status: "locked" },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team locked successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to lock team",
      error: error.message,
    });
  }
};

const unlockTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { lockedBySuperAdmin: false, status: "complete" },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team unlocked successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to unlock team",
      error: error.message,
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete team",
      error: error.message,
    });
  }
};

// ===============================
// CSV EXPORT
// ===============================
const escapeCsvField = (value) => {
  if (value === undefined || value === null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const rowsToCsv = (headers, rows) => {
  const headerLine = headers.join(",");
  const lines = rows.map((row) =>
    headers.map((h) => escapeCsvField(row[h])).join(",")
  );
  return [headerLine, ...lines].join("\n");
};

const exportUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").lean();

    const headers = [
      "_id",
      "name",
      "email",
      "phone",
      "college",
      "branch",
      "year",
      "role",
      "lookingForTeam",
      "isBlocked",
      "createdAt",
    ];

    const csv = rowsToCsv(
      headers,
      users.map((u) => ({ ...u, skills: (u.skills || []).join("; ") }))
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="users-export.csv"'
    );
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to export users",
      error: error.message,
    });
  }
};

const exportTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("leaderId", "name email")
      .populate("eventId", "title")
      .lean();

    const headers = [
      "_id",
      "name",
      "eventTitle",
      "leaderName",
      "leaderEmail",
      "memberCount",
      "quitOrRemovedCount",
      "domain",
      "status",
      "checkedIn",
      "lockedBySuperAdmin",
      "createdAt",
    ];

    const csv = rowsToCsv(
      headers,
      teams.map((t) => ({
        _id: t._id,
        name: t.name,
        eventTitle: t.eventId?.title || "",
        leaderName: t.leaderId?.name || "",
        leaderEmail: t.leaderId?.email || "",
        memberCount: (t.members || []).length,
        quitOrRemovedCount: (t.memberHistory || []).filter((h) => !h.rejoined)
          .length,
        domain: t.domain || "",
        status: t.status,
        checkedIn: t.checkedIn,
        lockedBySuperAdmin: t.lockedBySuperAdmin,
        createdAt: t.createdAt,
      }))
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="teams-export.csv"'
    );
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to export teams",
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
  toggleBlockUser,
  broadcastNotification,
  getAllTeams,
  getTeamById,
  lockTeam,
  unlockTeam,
  deleteTeam,
  exportUsers,
  exportTeams,
};