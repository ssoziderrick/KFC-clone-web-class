const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const databaseURL = process.env.DATABASE;

    if (!databaseURL) {
      throw new Error("DATABASE is missing from the .env file");
    }

    await mongoose.connect(databaseURL);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;