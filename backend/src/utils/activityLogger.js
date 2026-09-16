import ActivityLog from "../models/Activitylog.js";

const logActivity = async ({
  req,
  action,
  targetType,
  targetId = null,
  description,
  metadata = {},
}) => {
  try {
    if (!req.user?._id) {
      console.error("Activity log failed: Admin user not found");
      return null;
    }

    const log = await ActivityLog.create({
      adminId: req.user._id,
      action,
      targetType,
      targetId,
      description,
      metadata,
    });

    return log;
  } catch (error) {
    // Logging failure should not break the main operation
    console.error("Activity logger error:", error);
    return null;
  }
};

export default logActivity;