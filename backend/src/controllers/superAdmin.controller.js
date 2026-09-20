import Event from "../models/Event.js";
import User from "../models/User.js";
import Team from "../models/Team.js";
import Notification from "../models/Notification.js";
import logActivity from "../utils/activityLogger.js";


// ===============================
// EVENT VALIDATION HELPER
// ===============================
const validateEventData = (data) => {
  const {
    title,
    domains,
    teamSizeMin,
    teamSizeMax,
    registrationDeadline,
    startDate,
    endDate,
  } = data;

  if (!title || !title.trim()) {
    return "Event title is required";
  }

  if (
    !Array.isArray(domains) ||
    domains.length !== 4 ||
    domains.some((domain) => !domain || !domain.trim())
  ) {
    return "Exactly 4 non-empty domains are required";
  }

  if (
    teamSizeMin === undefined ||
    teamSizeMax === undefined ||
    Number(teamSizeMin) < 1 ||
    Number(teamSizeMax) < Number(teamSizeMin)
  ) {
    return "Invalid team size range";
  }

  if (
    registrationDeadline &&
    startDate &&
    new Date(registrationDeadline) >= new Date(startDate)
  ) {
    return "Registration deadline must be before the event start date";
  }

  if (
    startDate &&
    endDate &&
    new Date(startDate) >= new Date(endDate)
  ) {
    return "Event start date must be before the end date";
  }

  return null;
};

// ===============================
// CREATE EVENT
// ===============================
const createEvent = async (req, res) => {
  try {
    const validationError = validateEventData(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const event = await Event.create({
      ...req.body,
      title: req.body.title.trim(),
      description: req.body.description?.trim() || "",
      domains: req.body.domains.map((domain) => domain.trim()),
      teamSizeMin: Number(req.body.teamSizeMin),
      teamSizeMax: Number(req.body.teamSizeMax),
    });

    await logActivity({
      req,
      action: "CREATE_EVENT",
      targetType: "Event",
      targetId: event._id,
      description: `Created event: ${event.title}`,
      metadata: {
        domains: event.domains,
        teamSizeMin: event.teamSizeMin,
        teamSizeMax: event.teamSizeMax,
      },
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);

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
        isActive:
          isActive !== undefined
            ? isActive === "true"
            : null,
      },
      events,
    });
  } catch (error) {
    console.error("Get all events error:", error);

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
    console.error("Get event error:", error);

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
    const validationError = validateEventData(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // Fetch the actual document and mutate + .save() instead of
    // findByIdAndUpdate(). Schema validators (like the teamSizeMax
    // cross-check against teamSizeMin) rely on `this` pointing to the
    // document — on findByIdAndUpdate, `this` is the Query object instead,
    // so `this.teamSizeMin` comes back undefined and the check always fails.
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const oldDomains = event.domains;
    const newDomains = req.body.domains.map((domain) => domain.trim());

    Object.assign(event, {
      ...req.body,
      title: req.body.title.trim(),
      description: req.body.description?.trim() || "",
      domains: newDomains,
      teamSizeMin: Number(req.body.teamSizeMin),
      teamSizeMax: Number(req.body.teamSizeMax),
    });

    await event.save();

    // Positional rename cascade: if domain[i] changed name, update every
    // Team on this event currently tagged with the old name so team.domain
    // stays in sync with the event config instead of pointing at a
    // now-nonexistent domain string.
    let teamsReassigned = 0;

    for (let i = 0; i < oldDomains.length; i++) {
      const oldName = oldDomains[i];
      const newName = newDomains[i];

      if (oldName && newName && oldName !== newName) {
        const result = await Team.updateMany(
          { eventId: event._id, domain: oldName },
          { $set: { domain: newName } }
        );

        teamsReassigned += result.modifiedCount || 0;
      }
    }

    await logActivity({
      req,
      action: "UPDATE_EVENT",
      targetType: "Event",
      targetId: event._id,
      description: `Updated event: ${event.title}`,
      metadata: {
        updatedFields: req.body,
        teamsReassigned,
      },
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
      teamsReassigned,
    });
  } catch (error) {
    console.error("Update event error:", error);

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

    await logActivity({
      req,
      action: "DELETE_EVENT",
      targetType: "Event",
      targetId: event._id,
      description: `Deleted event: ${event.title}`,
      metadata: {
        deletedEventTitle: event.title,
      },
    });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

// ===============================
// EXTEND DEADLINE
// ===============================
const extendDeadline = async (req, res) => {
  try {
    const { registrationDeadline } = req.body;

    if (!registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: "New deadline is required",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (
      event.startDate &&
      new Date(registrationDeadline) >= new Date(event.startDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline must be before event start date",
      });
    }

    const previousDeadline = event.registrationDeadline;

    event.registrationDeadline = registrationDeadline;

    await event.save();

    await logActivity({
      req,
      action: "EXTEND_DEADLINE",
      targetType: "Event",
      targetId: event._id,
      description: `Extended registration deadline for event: ${event.title}`,
      metadata: {
        previousDeadline,
        newDeadline: event.registrationDeadline,
      },
    });

    res.status(200).json({
      success: true,
      message: "Deadline extended successfully",
      event,
    });
  } catch (error) {
    console.error("Extend deadline error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to extend deadline",
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

    const activeEvents = await Event.countDocuments({
      isActive: true,
    });

    const totalUsers = await User.countDocuments();
    const totalTeams = await Team.countDocuments();

    // EventsTab always edits the most recently created event, so mirror
    // that here — this keeps the Overview's domain list in sync with
    // whatever the admin last configured, even with zero teams so far.
    const currentEvent = await Event.findOne()
      .sort({ createdAt: -1 })
      .select("domains")
      .lean();

    const eventDomains = currentEvent?.domains || [];

    const teams = await Team.find()
      .select("domain members status checkedIn")
      .lean();

    const domains = {};
    const domainAnalytics = {};

    // Seed every current event domain at zero so newly renamed / still-empty
    // domains show up in the Overview instead of being silently omitted.
    eventDomains.forEach((domain) => {
      domains[domain] = 0;
      domainAnalytics[domain] = { teams: 0, participants: 0 };
    });

    let checkedInTeams = 0;
    let completeTeams = 0;
    let formingTeams = 0;
    let totalAssignedParticipants = 0;

    teams.forEach((team) => {
      const domain = team.domain || "Unspecified";

      domains[domain] = (domains[domain] || 0) + 1;

      if (!domainAnalytics[domain]) {
        domainAnalytics[domain] = {
          teams: 0,
          participants: 0,
        };
      }

      domainAnalytics[domain].teams += 1;

      const participants = Array.isArray(team.members)
        ? team.members.length
        : 0;

      domainAnalytics[domain].participants += participants;
      totalAssignedParticipants += participants;

      if (
        team.status === "complete" ||
        team.status === "locked"
      ) {
        completeTeams++;
      }

      if (team.status === "forming") {
        formingTeams++;
      }

      if (team.checkedIn) {
        checkedInTeams++;
      }
    });

    const checkedInPercentage =
      totalTeams > 0
        ? Number(
            ((checkedInTeams / totalTeams) * 100).toFixed(2)
          )
        : 0;

    res.status(200).json({
      success: true,
      dashboard: {
        totalEvents,
        activeEvents,
        totalUsers,
        totalTeams,
        eventDomains,
        domains,
        domainAnalytics,
        totalAssignedParticipants,
        checkedInTeams,
        checkedInPercentage,
        formingTeams,
        completeTeams,
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL USERS
// ===============================
const getAllUsers = async (req, res) => {
  try {
    const {
      college,
      branch,
      lookingForTeam,
      blocked,
    } = req.query;

    const filter = {};

    if (college) filter.college = college;
    if (branch) filter.branch = branch;

    if (lookingForTeam !== undefined) {
      filter.lookingForTeam = lookingForTeam === "true";
    }

    if (blocked !== undefined) {
      filter.isBlocked = blocked === "true";
    }

    const users = await User.find(filter)
      .select("-passwordHash")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

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
    const user = await User.findById(req.params.id).select(
      "-passwordHash"
    );

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
    console.error("Get user error:", error);

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

    await logActivity({
      req,
      action: targetUser.isBlocked ? "BLOCK_USER" : "UNBLOCK_USER",
      targetType: "User",
      targetId: targetUser._id,
      description: `${targetUser.isBlocked ? "Blocked" : "Unblocked"} user: ${targetUser.name} (${targetUser.email})`,
      metadata: {
        isBlocked: targetUser.isBlocked,
      },
    });

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
    console.error("Toggle block user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user block status",
      error: error.message,
    });
  }
};

// ===============================
// PROMOTE / DEMOTE USER ROLE
// ===============================
const updateUserRole = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const previousRole = targetUser.role;

    targetUser.role =
      targetUser.role === "super_admin"
        ? "participant"
        : "super_admin";

    await targetUser.save();

    await logActivity({
      req,
      action: "UPDATE_USER_ROLE",
      targetType: "User",
      targetId: targetUser._id,
      description: `Changed role of ${targetUser.name} (${targetUser.email}) from ${previousRole} to ${targetUser.role}`,
      metadata: {
        previousRole,
        newRole: targetUser.role,
      },
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${targetUser.role}`,
      user: {
        _id: targetUser._id,
        role: targetUser.role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

// ===============================
// BROADCAST NOTIFICATION
// ===============================
const broadcastNotification = async (req, res) => {
  try {
    const { message, audience } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (message.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 500 characters",
      });
    }

    const allowedAudiences = [
      "all",
      "participants",
      "team_leaders",
    ];

    if (!allowedAudiences.includes(audience)) {
      return res.status(400).json({
        success: false,
        message: "Invalid audience selected",
      });
    }

    const filter =
      audience === "all"
        ? {}
        : { role: "participant" };

    let targetUsers = await User.find(filter).select("_id");

    if (audience === "team_leaders") {
      const leaderIds = await Team.distinct("leaderId");

      const leaderIdSet = new Set(
        leaderIds.map((id) => id.toString())
      );

      targetUsers = targetUsers.filter((user) =>
        leaderIdSet.has(user._id.toString())
      );
    }

    if (targetUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching users to notify",
      });
    }

    const notifications = await Notification.insertMany(
      targetUsers.map((user) => ({
        userId: user._id,
        type: "announcement",
        message: message.trim(),
      }))
    );

    const io = req.app.get("io");

    if (io) {
      notifications.forEach((notification) => {
        io.to(`user:${notification.userId}`).emit(
          "notification:new",
          notification
        );
      });
    }

    await logActivity({
      req,
      action: "BROADCAST_NOTIFICATION",
      targetType: "Notification",
      targetId: null,
      description: `Broadcast sent to ${notifications.length} user(s) (audience: ${audience})`,
      metadata: {
        audience,
        message: message.trim(),
        recipientCount: notifications.length,
      },
    });

    res.status(201).json({
      success: true,
      message: `Broadcast sent to ${notifications.length} user(s)`,
      count: notifications.length,
    });
  } catch (error) {
    console.error("Broadcast notification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create broadcast notification",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL TEAMS
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
      .populate(
        "memberHistory.userId",
        "name email college isBlocked"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    console.error("Get all teams error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
      error: error.message,
    });
  }
};

// ===============================
// GET SINGLE TEAM
// ===============================
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("leaderId", "name email college")
      .populate("members", "name email college")
      .populate("eventId", "title domains")
      .populate(
        "memberHistory.userId",
        "name email college isBlocked"
      );

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
    console.error("Get team error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch team",
      error: error.message,
    });
  }
};

// ===============================
// LOCK TEAM
// ===============================
const lockTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      {
        lockedBySuperAdmin: true,
        status: "locked",
      },
      {
        new: true,
      }
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    await logActivity({
      req,
      action: "LOCK_TEAM",
      targetType: "Team",
      targetId: team._id,
      description: `Locked team: ${team.name}`,
      metadata: {},
    });

    res.status(200).json({
      success: true,
      message: "Team locked successfully",
      team,
    });
  } catch (error) {
    console.error("Lock team error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to lock team",
      error: error.message,
    });
  }
};

// ===============================
// UNLOCK TEAM
// ===============================
const unlockTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("eventId");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const minSize = team.eventId?.teamSizeMin || 1;
    const currentSize = team.members.length;

    team.lockedBySuperAdmin = false;
    team.status = currentSize >= minSize ? "complete" : "forming";

    await team.save();

    await logActivity({
      req,
      action: "UNLOCK_TEAM",
      targetType: "Team",
      targetId: team._id,
      description: `Unlocked team: ${team.name}`,
      metadata: {
        newStatus: team.status,
      },
    });

    res.status(200).json({
      success: true,
      message: "Team unlocked successfully",
      team,
    });
  } catch (error) {
    console.error("Unlock team error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to unlock team",
      error: error.message,
    });
  }
};

// ===============================
// DELETE TEAM
// ===============================
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    await logActivity({
      req,
      action: "DELETE_TEAM",
      targetType: "Team",
      targetId: team._id,
      description: `Deleted team: ${team.name}`,
      metadata: {
        deletedTeamName: team.name,
      },
    });

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("Delete team error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete team",
      error: error.message,
    });
  }
};

// ===============================
// FORCE ADD MEMBER
// ===============================
const forceAddMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required in body",
      });
    }

    const team = await Team.findById(req.params.id).populate("eventId");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      team.members.some(
        (memberId) => memberId.toString() === userId.toString()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "User is already in this team",
      });
    }

    if (user.teamId) {
      return res.status(400).json({
        success: false,
        message: "User is already assigned to another team",
      });
    }

    const teamSizeMax = team.eventId?.teamSizeMax;

    if (teamSizeMax && team.members.length >= teamSizeMax) {
      return res.status(400).json({
        success: false,
        message: "Team has reached its maximum size",
      });
    }

    team.members.push(userId);

    await team.save();

    user.teamId = team._id;
    user.lookingForTeam = false;

    await user.save();

    await logActivity({
      req,
      action: "FORCE_ADD_MEMBER",
      targetType: "Team",
      targetId: team._id,
      description: `Force-added ${user.name} (${user.email}) to team: ${team.name}`,
      metadata: {
        userId: user._id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Member force-added successfully",
      team,
    });
  } catch (error) {
    console.error("Force add member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to force add member",
      error: error.message,
    });
  }
};

// ===============================
// FORCE REMOVE MEMBER
// ===============================
const forceRemoveMember = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.params.userId;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (
      team.leaderId.toString() === userId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot remove the team leader. Change leader or delete team.",
      });
    }

    team.members = team.members.filter(
      (id) => id.toString() !== userId.toString()
    );

    await team.save();

    const user = await User.findById(userId);

    if (user) {
      user.teamId = null;
      user.lookingForTeam = true;

      await user.save();
    }

    await logActivity({
      req,
      action: "FORCE_REMOVE_MEMBER",
      targetType: "Team",
      targetId: team._id,
      description: `Force-removed ${user ? `${user.name} (${user.email})` : `user ${userId}`} from team: ${team.name}`,
      metadata: {
        userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Member force-removed successfully",
      team,
    });
  } catch (error) {
    console.error("Force remove member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to force remove member",
      error: error.message,
    });
  }
};

// ===============================
// VERIFY QR
// ===============================
const verifyQR = async (req, res) => {
  try {
    const { qrToken } = req.body;
    
    if (!qrToken) {
      return res.status(400).json({
        success: false,
        message: "QR Token is required",
      });
    }

    const team = await Team.findOne({ qrToken })
      .populate("members", "name college")
      .populate("eventId", "title domains");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR Token or Registration Not Found",
      });
    }

    if (team.status !== "complete") {
      return res.status(400).json({
        success: false,
        message: "Registration not completed for this QR",
      });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error("Verify QR error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify QR",
      error: error.message,
    });
  }
};

// ===============================
// MARK CHECKED IN
// ===============================
const markCheckedIn = async (req, res) => {
  try {
    const team = await Team.findOneAndUpdate(
      { _id: req.params.id, checkedIn: false },
      { checkedIn: true, checkedInAt: new Date() },
      { new: true }
    );

    if (!team) {
      const existingTeam = await Team.findById(req.params.id);
      if (!existingTeam) {
        return res.status(404).json({
          success: false,
          message: "Team not found",
        });
      }
      if (existingTeam.checkedIn) {
        return res.status(400).json({
          success: false,
          message: "Already checked in",
        });
      }
    }

    await logActivity({
      req,
      action: "MARK_CHECKED_IN",
      targetType: "Team",
      targetId: team._id,
      description: `Marked team as checked in: ${team.name}`,
      metadata: {
        checkedInAt: team.checkedInAt,
      },
    });

    res.status(200).json({
      success: true,
      message: "Team marked as checked in",
      team,
    });
  } catch (error) {
    console.error("Mark checked-in error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check in team",
      error: error.message,
    });
  }
};

// ===============================
// CSV HELPERS
// ===============================
const escapeCsvField = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  const str = String(value);

  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
};

const rowsToCsv = (headers, rows) => {
  const headerLine = headers.join(",");

  const lines = rows.map((row) =>
    headers
      .map((header) => escapeCsvField(row[header]))
      .join(",")
  );

  return [headerLine, ...lines].join("\n");
};

// ===============================
// EXPORT USERS
// ===============================
const exportUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .lean();

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
      users.map((user) => ({
        ...user,
        skills: (user.skills || []).join("; "),
      }))
    );

    res.setHeader("Content-Type", "text/csv");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="users-export.csv"'
    );

    res.status(200).send(csv);
  } catch (error) {
    console.error("Export users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to export users",
      error: error.message,
    });
  }
};

// ===============================
// EXPORT TEAMS
// ===============================
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
      teams.map((team) => ({
        _id: team._id,
        name: team.name,
        eventTitle: team.eventId?.title || "",
        leaderName: team.leaderId?.name || "",
        leaderEmail: team.leaderId?.email || "",
        memberCount: (team.members || []).length,
        quitOrRemovedCount: (team.memberHistory || []).filter(
          (history) => !history.rejoined
        ).length,
        domain: team.domain || "",
        status: team.status,
        checkedIn: team.checkedIn,
        lockedBySuperAdmin: team.lockedBySuperAdmin,
        createdAt: team.createdAt,
      }))
    );

    res.setHeader("Content-Type", "text/csv");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="teams-export.csv"'
    );

    res.status(200).send(csv);
  } catch (error) {
    console.error("Export teams error:", error);

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
  extendDeadline,
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
  forceAddMember,
  forceRemoveMember,
  markCheckedIn,
  verifyQR,
  exportUsers,
  exportTeams,
};