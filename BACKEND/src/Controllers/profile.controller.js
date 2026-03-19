const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/profile/:id
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/profile/current/me
exports.getCurrentProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/update
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, phone, location, skills, website, specialization, experience, portfolioLink, avatar } = req.body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (skills) updateData.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
    if (website) updateData.website = website;
    if (specialization) updateData.specialization = specialization;
    if (experience !== undefined) updateData.experience = experience;
    if (portfolioLink) updateData.portfolioLink = portfolioLink;
    if (avatar) updateData.avatar = avatar;

    // Update user
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   PUT /api/profile/avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ error: "Please provide an avatar" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (for artists directory/gallery)
// @route   GET /api/profile/all
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, specialization } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ];
    }

    if (specialization) {
      filter.specialization = specialization;
    }

    const users = await User.find(filter)
      .select("-password")
      .limit(50);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};
