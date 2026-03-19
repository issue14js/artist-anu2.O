const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const upload = require("../config/multer");
const {
  uploadPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  getUserPosts,
} = require("../Controllers/post.controller");

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPost);
router.get("/user/:userId", getUserPosts);

// Protected & Admin-only routes (require authentication + admin role)
router.post("/upload", protect, adminOnly, upload.single("image"), uploadPost);
router.put("/:id", protect, adminOnly, upload.single("image"), updatePost);
router.delete("/:id", protect, adminOnly, deletePost);

module.exports = router;
