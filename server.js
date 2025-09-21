const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
}

connectDB();
const server = require("./app");   
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.info(`Server is running on ${PORT}`);
});
