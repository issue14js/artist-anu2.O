const Message = require("../models/Message");

// @desc    Send contact message
// @route   POST /api/contact/send
// @access  Public
exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email, subject, and message",
      });
    }

    // Create message
    const newMessage = await Message.create({
      name,
      email,
      phone: phone || "",
      subject,
      message,
      category: category || "Other",
      status: "new",
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully. We will get back to you soon!",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error sending message",
    });
  }
};

// @desc    Get all messages (Admin only)
// @route   GET /api/contact/messages
// @access  Private/Admin
exports.getAllMessages = async (req, res, next) => {
  try {
    const { status = "", search = "", limit = 10, page = 1 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find(query)
      .populate("repliedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalMessages = await Message.countDocuments(query);
    const totalPages = Math.ceil(totalMessages / parseInt(limit));

    res.status(200).json({
      success: true,
      count: messages.length,
      totalMessages,
      totalPages,
      currentPage: parseInt(page),
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching messages",
    });
  }
};

// @desc    Get unread message count (Admin only)
// @route   GET /api/contact/unread-count
// @access  Private/Admin
exports.getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Message.countDocuments({ isRead: false });
    const newCount = await Message.countDocuments({ status: "new" });

    res.status(200).json({
      success: true,
      unreadCount,
      newCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching unread count",
    });
  }
};

// @desc    Get single message (Admin only)
// @route   GET /api/contact/messages/:id
// @access  Private/Admin
exports.getMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true, status: message?.isReplied ? "replied" : "viewed" },
      { new: true }
    ).populate("repliedBy", "name email");

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching message",
    });
  }
};

// @desc    Reply to message (Admin only)
// @route   PUT /api/contact/messages/:id/reply
// @access  Private/Admin
exports.replyMessage = async (req, res, next) => {
  try {
    const { reply } = req.body;

    if (!reply || reply.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Please provide a reply message",
      });
    }

    let message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    message.reply = reply;
    message.repliedBy = req.user._id;
    message.isReplied = true;
    message.status = "replied";

    message = await message.save();
    message = await message.populate("repliedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error sending reply",
    });
  }
};

// @desc    Mark message as read (Admin only)
// @route   PUT /api/contact/messages/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error marking message as read",
    });
  }
};

// @desc    Delete message (Admin only)
// @route   DELETE /api/contact/messages/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error deleting message",
    });
  }
};

// @desc    Get messages by category (Admin only)
// @route   GET /api/contact/category/:category
// @access  Private/Admin
exports.getMessagesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { status = "", limit = 10, page = 1 } = req.query;

    let query = { category };

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find(query)
      .populate("repliedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalMessages = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      totalMessages,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching messages",
    });
  }
};
