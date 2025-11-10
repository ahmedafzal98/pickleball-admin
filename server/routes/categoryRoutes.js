const express = require("express");
const upload = require("../middlewares/multer.js");
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/categoryController.js");

const router = express.Router();

/**
 * CATEGORY ROUTES
 */

// Create category (with optional subcategories)
router.post(
  "/",
  upload.fields([
    { name: "categoryImage", maxCount: 1 },
    { name: "subcategoryImages", maxCount: 10 },
  ]),
  createCategory
);

// Get all categories
router.get("/", getAllCategories);

// Update category (name or image)
router.put(
  "/:id",
  upload.fields([{ name: "categoryImage", maxCount: 1 }]),
  updateCategory
);

// Delete category
router.delete("/:id", deleteCategory);

/**
 * SUBCATEGORY ROUTES
 */

// Add a new subcategory to a category
router.post(
  "/:id/subcategories",
  upload.single("subcategoryImage"),
  addSubcategory
);

// Update a specific subcategory
router.put(
  "/:id/subcategories/:subId",
  upload.single("subcategoryImage"),
  updateSubcategory
);

// Delete a specific subcategory
router.delete("/:id/subcategories/:subId", deleteSubcategory);

module.exports = router;
