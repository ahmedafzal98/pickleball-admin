const Category = require("../models/Category.js");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../helpers/cloudinaryUpload.js");

/**
 * @desc Create a new category (with optional subcategories)
 * @route POST /api/categories
 */
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "Category name is required" });

    // Upload main category image
    if (!req.files || !req.files.categoryImage)
      return res.status(400).json({ message: "Category image is required" });

    const categoryImage = req.files.categoryImage[0];
    const categoryUpload = await uploadToCloudinary(
      categoryImage.buffer,
      "categories"
    );

    let subcategories = [];

    console.log(req.body.subcategories);
    console.log(req.files.subcategoryImages);

    if (req.files.subcategoryImages && req.body.subcategories) {
      const subcategoryData = JSON.parse(req.body.subcategories); // array of {name}
      const subcategoryImages = req.files.subcategoryImages;

      if (subcategoryData.length !== subcategoryImages.length) {
        return res
          .status(400)
          .json({ message: "Mismatch between subcategory names and images" });
      }

      const uploadedSubcategories = await Promise.all(
        subcategoryImages.map((file, i) =>
          uploadToCloudinary(file.buffer, "subcategories").then((upload) => ({
            name: subcategoryData[i].name,
            image_url: upload.url,
            image_public_id: upload.public_id,
          }))
        )
      );

      subcategories = uploadedSubcategories;
    }

    const newCategory = await Category.create({
      name,
      image_url: categoryUpload.url,
      image_public_id: categoryUpload.public_id,
      subcategories,
    });

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};

/**
 * @desc Get all categories
 * @route GET /api/categories
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

/**
 * @desc Update a category by ID
 * @route PUT /api/categories/:id
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Update name if provided
    if (name) category.name = name;

    // Update category image if new file provided
    if (req.files?.categoryImage) {
      await deleteFromCloudinary(category.image_public_id);
      const upload = await uploadToCloudinary(
        req.files.categoryImage[0].buffer,
        "categories"
      );
      category.image_url = upload.url;
      category.image_public_id = upload.public_id;
    }

    await category.save();
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

/**
 * @desc Delete category
 * @route DELETE /api/categories/:id
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Delete main image
    await deleteFromCloudinary(category.image_public_id);

    // Delete all subcategory images
    for (const sub of category.subcategories) {
      await deleteFromCloudinary(sub.image_public_id);
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

/* ---------------------- NEW SUBCATEGORY CONTROLLERS ---------------------- */

/**
 * @desc Add a new subcategory to an existing category
 * @route POST /api/categories/:id/subcategories
 */
const addSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Subcategory name is required" });

    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (!req.file)
      return res.status(400).json({ message: "Subcategory image is required" });

    const upload = await uploadToCloudinary(req.file.buffer, "subcategories");

    const newSub = {
      name,
      image_url: upload.url,
      image_public_id: upload.public_id,
    };

    category.subcategories.push(newSub);
    await category.save();

    res
      .status(201)
      .json({ message: "Subcategory added successfully", subcategory: newSub });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding subcategory", error: error.message });
  }
};

/**
 * @desc Update a subcategory by ID
 * @route PUT /api/categories/:id/subcategories/:subId
 */
const updateSubcategory = async (req, res) => {
  try {
    const { id, subId } = req.params;
    const { name } = req.body;

    console.log("updated Name", name);

    const category = await Category.findById(id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const subcategory = category.subcategories.id(subId);
    console.log("old subcategory", subcategory);

    if (!subcategory)
      return res.status(404).json({ message: "Subcategory not found" });

    if (name) subcategory.name = name;

    if (req.file) {
      await deleteFromCloudinary(subcategory.image_public_id);
      const upload = await uploadToCloudinary(req.file.buffer, "subcategories");
      subcategory.image_url = upload.url;
      subcategory.image_public_id = upload.public_id;
    }

    await category.save();
    res
      .status(200)
      .json({ message: "Subcategory updated successfully", subcategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating subcategory", error: error.message });
  }
};

/**
 * @desc Delete a subcategory by ID
 * @route DELETE /api/categories/:id/subcategories/:subId
 */
const deleteSubcategory = async (req, res) => {
  try {
    const { id, subId } = req.params;
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const subcategory = category.subcategories.id(subId);
    if (!subcategory)
      return res.status(404).json({ message: "Subcategory not found" });

    await deleteFromCloudinary(subcategory.image_public_id);

    category.subcategories = category.subcategories.filter(
      (sub) => sub._id.toString() !== subId
    );

    await category.save();
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting subcategory", error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
