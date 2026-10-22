const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const requireAdmin = async (req, res, next) => {
  try {
    // protect middleware should run before this middleware.
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Read the current role from MongoDB, not from the client.
    const user = await User.findById(req.userId).select("role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireAdmin };
