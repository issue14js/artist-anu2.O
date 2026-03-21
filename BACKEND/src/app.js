const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth.route");
const profileRoutes = require("./routes/profile.route");
const postRoutes = require("./routes/post.route");
const adminRoutes = require("./routes/admin.route");
const contactRoutes = require("./routes/contact.route");
const dirname = require('dirname')



const app = express();


// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://artist-anuradha.vercel.app/",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public/dist")));

// Static files middleware for uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Welcome to Artist ANNURADHA App API" });
});

app.get("/path", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dist/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
