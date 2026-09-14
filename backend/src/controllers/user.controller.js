import User from "../models/User.js";

// PATCH /api/users/availability
export const updateAvailability = async (req, res) => {
  try {
    const { lookingForTeam } = req.body;
    
    // User must not be in a team to set lookingForTeam to true
    if (lookingForTeam && req.user.teamId) {
      return res.status(400).json({
        message: "You cannot be available for joining while already in a team",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { lookingForTeam: Boolean(lookingForTeam) },
      { new: true }
    ).select("-passwordHash");

    res.status(200).json({
      message: `Availability updated to ${lookingForTeam ? 'available' : 'unavailable'}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update availability error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET /api/users/search
export const searchParticipants = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: "Search query must be at least 2 characters long" });
    }

    // Search by name or email
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ],
      isBlocked: false,
      role: "participant",
      _id: { $ne: req.user._id }
    })
    .select("name email college branch skills lookingForTeam teamId")
    .limit(10);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Search participants error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/looking-for-team
export const getUsersLookingForTeam = async (req, res) => {
  try {
    const { skill, branch, college } = req.query;

    const filter = {
      lookingForTeam: true,
      isBlocked: false,
      teamId: null,
    };

    if (skill) {
      filter.skills = {
        $regex: skill,
        $options: "i",
      };
    }

    if (branch) {
      filter.branch = {
        $regex: branch,
        $options: "i",
      };
    }

    if (college) {
      filter.college = {
        $regex: college,
        $options: "i",
      };
    }

    const users = await User.find(filter)
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Browse users error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};