const app = require("./src/app");
const connectDB = require("./src/config/database");
const dotenv = require('dotenv')
dotenv()
const PORT = process.env.PORT || 3000;




// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port 3000`);
});



