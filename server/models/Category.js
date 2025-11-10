const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subcategory name is required"],
    trim: true,
  },
  image_url: {
    type: String,
    required: [true, "Subcategory image URL is required"],
  },
  image_public_id: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    image_url: {
      type: String,
      required: [true, "Category image URL is required"],
    },
    image_public_id: {
      type: String,
      required: true,
    },
    subcategories: [subcategorySchema],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
