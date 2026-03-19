const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");

// @desc    Upload post to gallery
// @route   POST /api/posts/upload
// @access  Private/Admin
exports.uploadPost = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: "Please provide title and description",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image",
      });
    }

    // Create post
    const post = await Post.create({
      title,
      description,
      category: category || "Other",
      image: req.file.filename,
      imageUrl: `/uploads/posts/${req.file.filename}`,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Post uploaded successfully",
      data: post,
    });
  } catch (error) {
    // Delete uploaded file if post creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      error: error.message || "Error uploading post",
    });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getAllPosts = async (req, res, next) => {
  try {
    const { category, limit = 12, skip = 0 } = req.query;

    let query = { isActive: true };

    if (category && category !== "All") {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate("uploadedBy", "name avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const totalPosts = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      totalPosts,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching posts",
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("uploadedBy", "name avatar bio");

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching post",
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private/Admin
exports.updatePost = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    // Check if user is the owner or admin
    if (post.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this post",
      });
    }

    // Update fields
    if (title) post.title = title;
    if (description) post.description = description;
    if (category) post.category = category;

    // Handle image update
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, `../../uploads/posts/${post.image}`);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      post.image = req.file.filename;
      post.imageUrl = `/uploads/posts/${req.file.filename}`;
    }

    post = await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      error: error.message || "Error updating post",
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    // Check if user is the owner
    if (post.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this post",
      });
    }

    // Delete image from filesystem
    const imagePath = path.join(__dirname, `../../uploads/posts/${post.image}`);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error deleting post",
    });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Public
exports.getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ uploadedBy: req.params.userId, isActive: true })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name avatar");

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching user posts",
    });
  }
};
