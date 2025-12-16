const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true, // keep unique only if you want IDs unique
    },

    name: {
      type: String,
      required: true, // duplicates allowed
      // unique: true <-- removed
    },

    parent: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
