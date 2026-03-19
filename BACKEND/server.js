const app = require("./src/app");
const connectDB = require("./src/config/database");



// Connect to database
connectDB();

// Start server
app.listen(3000, () => {
  console.log(`✓ Server running on port 3000`);
});



