const cloudinary = require("../config/cloudinary");

/**
 * Recursively uploads images for subcategories to Cloudinary
 * @param {Array} subcategories - Array of subcategory objects
 * @param {Array} files - Array of files from multer (req.files.subcat_images)
 * @returns {Array} - Updated subcategories with image_url
 */
async function uploadSubcategoryImages(subcategories = [], files = []) {
  if (!Array.isArray(subcategories)) return subcategories;

  for (let i = 0; i < subcategories.length; i++) {
    const subcat = subcategories[i];

    // Match file by temp_filename (provided in JSON)
    const file = files.find((f) => f.originalname === subcat.temp_filename);

    if (file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "coverflow_subcategories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      subcat.image_url = result.secure_url;
    }

    // Recursively process nested subcategories
    if (
      Array.isArray(subcat.subcategories) &&
      subcat.subcategories.length > 0
    ) {
      subcat.subcategories = await uploadSubcategoryImages(
        subcat.subcategories,
        files
      );
    }
  }

  return subcategories;
}

module.exports = uploadSubcategoryImages;
