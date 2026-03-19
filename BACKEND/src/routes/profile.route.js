const express = require("express");
const { 
  getProfile, 
  getCurrentProfile, 
  updateProfile, 
  uploadAvatar, 
  getAllUsers 
} = require("../Controllers/profile.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/users/all", getAllUsers);
router.get("/:id", getProfile);

// Protected routes
router.get("/current/me", protect, getCurrentProfile);
router.put("/update", protect, updateProfile);
router.put("/avatar", protect, uploadAvatar);

module.exports = router;
