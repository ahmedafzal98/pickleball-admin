const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");
const uploadSubcategoryImages = require("../utils/uploadSubcategoryImages");
// Create a top-level category
exports.createCategory = async (req, res) => {
  try {
    // 1️⃣ Parse fields safely
    const { name, subcategories = "[]" } = req.body;

    let subcats = [];
    try {
      subcats = JSON.parse(subcategories || "[]"); // default empty array
    } catch (parseErr) {
      return res.status(400).json({ error: "Invalid JSON for subcategories" });
    }

    // 2️⃣ Upload top-level category image
    let image_url = "";
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "coverflow_categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.image[0].buffer);
      });
      image_url = result.secure_url;
    }

    // 3️⃣ Upload subcategory images recursively
    if (
      req.files &&
      req.files.subcat_images &&
      req.files.subcat_images.length > 0
    ) {
      subcats = await uploadSubcategoryImages(subcats, req.files.subcat_images);
    }

    // 4️⃣ Save to database
    const cat = new Category({ name, image_url, subcategories: subcats });
    await cat.save();

    res.status(201).json(cat);
  } catch (err) {
    console.error("Create Category Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all categories (full tree)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id).lean();
    if (!cat) return res.status(404).json({ error: "Not found" });
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update a category doc entirely (overwrite fields)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const { name, subcategories = "[]" } = req.body;
    if (name) category.name = name;

    let subcats = JSON.parse(subcategories);

    // Upload top-level image if provided
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "coverflow_categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.image[0].buffer);
      });
      category.image_url = result.secure_url;
    }

    // Upload subcategory images recursively
    if (req.files && req.files.subcat_images) {
      subcats = await uploadSubcategoryImages(subcats, req.files.subcat_images);
    }

    category.subcategories = subcats;
    await category.save();

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a category (top-level doc)
exports.deleteCategory = async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Upload image to Cloudinary and return URL
// req.file from multer upload.single("image")
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    // upload buffer to cloudinary
    const result = (await cloudinary.uploader.upload_stream_promise)
      ? cloudinary.uploader.upload_stream_promise(
          { resource_type: "image" },
          req.file.buffer
        )
      : uploadFromBuffer(req.file.buffer);

    // Note: many cloudinary libs don't have upload_stream_promise built-in; use helper below if needed
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Helper: upload from buffer using upload_stream
// (use if your cloudinary version doesn't provide promise API)
async function uploadFromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "coverflow_categories" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}
