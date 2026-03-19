const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const {
  sendMessage,
  getAllMessages,
  getUnreadCount,
  getMessage,
  replyMessage,
  markAsRead,
  deleteMessage,
  getMessagesByCategory,
} = require("../Controllers/contact.controller");

// Public routes
router.post("/send", sendMessage);

// Protected/Admin routes (require authentication + admin role)
router.get("/messages", protect, adminOnly, getAllMessages);
router.get("/unread-count", protect, adminOnly, getUnreadCount);
router.get("/messages/:id", protect, adminOnly, getMessage);
router.put("/messages/:id/reply", protect, adminOnly, replyMessage);
router.put("/messages/:id/read", protect, adminOnly, markAsRead);
router.delete("/messages/:id", protect, adminOnly, deleteMessage);
router.get("/category/:category", protect, adminOnly, getMessagesByCategory);

module.exports = router;
