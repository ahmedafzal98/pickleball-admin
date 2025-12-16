const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    parent: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true } // 🔥 REMOVE `_id: false`
);

module.exports = mongoose.model("Category", CategorySchema);
