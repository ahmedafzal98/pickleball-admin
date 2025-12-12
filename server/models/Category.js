// Category.js (Corrected)
const mongoose = require("mongoose");
// You no longer need to import Counter in this file, as the auto-increment logic is gone.

const CategorySchema = new mongoose.Schema(
  {
    // ----------------------------------------------------------------------
    // CHANGE 1: 'id' is no longer auto-incremented by the model.
    // It's the stable ID provided by the upload file. It is now REQUIRED.
    // ----------------------------------------------------------------------
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true, // Add an index for lookup speed
    },

    name: {
      type: String,
      required: true,
      unique: true,
    },

    // 'parent' column is correct.
    parent: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true, _id: false } // CHANGE 2: Disable Mongoose's default '_id' if you want 'id' to be the primary key conceptually.
);

// ----------------------------------------------------------------------
// REMOVED: The CategorySchema.pre("save", ...) hook.
// This hook is what was causing the incompatibility by overriding the CSV ID.
// ----------------------------------------------------------------------

module.exports =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
