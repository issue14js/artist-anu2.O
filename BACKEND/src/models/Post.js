const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: 2000,
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: ["Traditional", "Education", "Painting", "Wall Art", "Learning", "Other"],
      default: "Other",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
