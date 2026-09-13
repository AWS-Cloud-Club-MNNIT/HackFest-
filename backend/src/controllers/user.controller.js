import User from "../models/User.js";

// GET /api/users/looking-for-team
export const getUsersLookingForTeam = async (req, res) => {
  try {
    const { skill, branch, college } = req.query;

    const filter = {
      lookingForTeam: true,
      isBlocked: false,
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