const mongoose = require("mongoose");
require("dotenv").config();

const databaseUrl = process.env.MONGO_URI;

if (!databaseUrl) {
  console.error("Error: MONGODB_DB environment variable is not set.");
  process.exit(1);
}

mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
