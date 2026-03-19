const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const {
  updateUserRole,
  getAllUsers,
  getUser,
  promoteToAdmin,
  demoteFromAdmin,
} = require("../Controllers/admin.controller");

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// User management routes
router.get("/users", getAllUsers);
router.get("/users/:userId", getUser);
router.put("/users/:userId/role", updateUserRole);
router.put("/users/:userId/promote", promoteToAdmin);
router.put("/users/:userId/demote", demoteFromAdmin);

module.exports = router;
