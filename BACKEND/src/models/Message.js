const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      required: [true, "Please provide a subject"],
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, "Please provide a message"],
      maxlength: 5000,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isReplied: {
      type: Boolean,
      default: false,
    },
    reply: {
      type: String,
      default: null,
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    category: {
      type: String,
      enum: ["General", "Collaboration", "Workshop", "Commission", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["new", "viewed", "replied", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
