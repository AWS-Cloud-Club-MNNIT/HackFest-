import ActivityLog from "../models/Activitylog.js";

// GET ALL ACTIVITY LOGS
const getActivityLogs = async (req, res) => {
  try {
    const { action, targetType, limit = 50 } = req.query;

    const filter = {};

    if (action) {
      filter.action = action;
    }

    if (targetType) {
      filter.targetType = targetType;
    }

    const logs = await ActivityLog.find(filter)
      .populate("adminId", "name email")
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 50, 100));

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error("Get activity logs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error: error.message,
    });
  }
};

export { getActivityLogs };