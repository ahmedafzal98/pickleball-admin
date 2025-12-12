const mongoose = require("mongoose");
const Category = require("./models/Category");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    const result = await Category.deleteMany({});
    console.log(`Deleted ${result.deletedCount} categories.`);

    mongoose.disconnect();
  })
  .catch((err) => console.error("MongoDB connection error:", err));
