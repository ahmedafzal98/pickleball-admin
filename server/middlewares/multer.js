// middlewares/multer.js
const multer = require("multer");

// Use memory storage to temporarily hold images before Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

module.exports = upload;
