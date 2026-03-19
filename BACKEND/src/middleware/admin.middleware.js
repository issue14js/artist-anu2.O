// Admin role check middleware
exports.adminOnly = async (req, res, next) => {
  try {
    // Check if user is authenticated (protect middleware should run first)
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: "Not authorized to access this route" 
      });
    }

    // Check if user is admin
    if (!req.user.isAdmin && req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        error: "Only admins can perform this action" 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
