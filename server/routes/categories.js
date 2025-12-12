const express = require("express");
const router = express.Router();
const fs = require("fs");
const XLSX = require("xlsx");
const multer = require("multer");
const Category = require("../models/Category");
const Counter = require("../models/Counter");

// Configure multer to store uploaded files temporarily
const upload = multer({ dest: "uploads/" });

// ---------------------- STATIC ROUTES FIRST ----------------------

// Get all categories (flat list)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json(categories);
  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Dropdown (alphabetical)
router.get("/dropdown/all", async (req, res) => {
  try {
    const list = await Category.find()
      .sort({ name: 1 })
      .select("id name parent")
      .lean();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Full tree (nested categories)
router.get("/tree", async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const buildTree = (parentId = null) => {
      return categories
        .filter((cat) =>
          parentId === null ? cat.parent === null : cat.parent === parentId
        )
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          children: buildTree(cat.id),
        }));
    };

    res.json(buildTree());
  } catch (err) {
    console.error("TREE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Search categories by name (optional parent filter)
router.get("/search", async (req, res) => {
  try {
    const { q, parent } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required." });

    const filter = { name: { $regex: q, $options: "i" } };

    if (parent !== undefined) {
      const parentNum = Number(parent);
      if (!isNaN(parentNum)) filter.parent = parentNum;
    }

    const results = await Category.find(filter).sort({ name: 1 }).lean();
    res.json(results);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Direct children of a category
router.get("/:id/children", async (req, res) => {
  try {
    const parentId = Number(req.params.id);
    const children = await Category.find({ parent: parentId })
      .sort({ name: 1 })
      .lean();
    return res.json(children);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Direct subcategories (alias for children)
router.get("/:id/subcategories", async (req, res) => {
  try {
    const parentId = Number(req.params.id);
    const subcategories = await Category.find({ parent: parentId });
    res.json({
      parentId,
      count: subcategories.length,
      subcategories,
    });
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- DYNAMIC ROUTES ----------------------

// Get single category by numeric id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cat = await Category.findOne({ id });
    if (!cat) return res.status(404).json({ message: "Category not found." });
    return res.json(cat);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Create category
router.post("/", async (req, res) => {
  try {
    const { name, parent = null } = req.body;

    if (parent !== null) {
      const parentDoc = await Category.findOne({ id: parent });
      if (!parentDoc)
        return res.status(400).json({ message: "Parent category not found." });
    }

    const cat = new Category({ name, parent });
    await cat.save();
    return res.status(201).json(cat);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Name must be unique." });
    return res.status(500).json({ message: err.message });
  }
});

// Update category (name / parent)
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, parent } = req.body;

    const cat = await Category.findOne({ id });
    if (!cat) return res.status(404).json({ message: "Category not found." });

    // Prevent setting parent to itself
    if (parent === id)
      return res
        .status(400)
        .json({ message: "Category cannot be parent of itself." });

    // If parent provided, ensure exists and prevent cycles
    if (parent !== null && parent !== undefined) {
      const parentDoc = await Category.findOne({ id: parent });
      if (!parentDoc)
        return res.status(400).json({ message: "Parent category not found." });

      // Walk up parent chain to detect cycles
      let currentParent = parentDoc;
      while (currentParent && currentParent.parent !== null) {
        if (currentParent.parent === cat.id) {
          return res.status(400).json({
            message:
              "Cannot set parent to a descendant (would create a cycle).",
          });
        }
        currentParent = await Category.findOne({ id: currentParent.parent });
      }
    }

    if (name !== undefined) cat.name = name;
    if (parent !== undefined) cat.parent = parent;

    await cat.save();
    return res.json(cat);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Name must be unique." });
    return res.status(500).json({ message: err.message });
  }
});

// Delete category (only if no children)
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cat = await Category.findOne({ id });
    if (!cat) return res.status(404).json({ message: "Category not found." });

    const childrenCount = await Category.countDocuments({ parent: id });
    if (childrenCount > 0)
      return res.status(400).json({
        message: "Category has child categories. Delete children first.",
      });

    await Category.deleteOne({ id });
    return res.json({ message: "Category deleted." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

const cleanName = (name) => {
  if (!name) return "";
  return name.replace(/^"+|"+$/g, "").trim(); // remove leading/trailing quotes and spaces
};

const parseParent = (value) => {
  if (!value) return null;
  const num = Number(value);
  if (!isNaN(num)) return num; // numeric parent
  return value.replace(/^"+|"+$/g, "").trim(); // clean string parent
};

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "File is required." });

    const filePath = req.file.path;
    let rawData = [];

    // ---------------- CSV (Simplified) ----------------
    if (
      req.file.mimetype.includes("csv") ||
      req.file.originalname.endsWith(".csv")
    ) {
      const csv = fs.readFileSync(filePath, "utf-8");

      // Basic split by newline and filter empty rows
      const rows = csv.split("\n").filter((row) => row.trim() !== "");

      // Use a more robust split for cells and remove surrounding quotes.
      // This is still fragile but works for the file provided.
      const dataRows = rows
        .slice(1)
        .map((row) =>
          row
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((c) => c.replace(/^"|"$/g, "").trim())
        );

      rawData = dataRows
        .map((row) => {
          // Correct Index Mapping: 0:id, 1:name, 2:image (IGNORED), 3:parent
          const categoryId = parseInt(row[0], 10);
          const categoryParent = parseParent(row[3]); // Assumes parseParent handles null/empty string

          return {
            // Use the stable ID from the CSV
            id: isNaN(categoryId) ? null : categoryId,
            name: cleanName(row[1]),
            parent: categoryParent, // Will be the parent's ID (number) or null
          };
        })
        .filter((row) => row.id !== null && row.name); // Filter invalid rows
    }
    // ---------------- XLSX ----------------
    else {
      // Keep existing XLSX logic, assuming it correctly maps columns by name.
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      rawData = XLSX.utils
        .sheet_to_json(sheet, { defval: null })
        .filter((row) => row.id && (row.Name || row.name))
        .map((row) => ({
          id: parseInt(row.ID || row.id, 10),
          name: cleanName(row.Name || row.name),
          parent: parseParent(row.Parent || row.parent),
        }));
    }

    // Remove duplicates & empty names
    const uniqueNames = new Set();
    const data = rawData.filter(
      (row) =>
        row.name && !uniqueNames.has(row.name) && uniqueNames.add(row.name)
    );

    // ---------------- Delete existing categories ----------------
    await Category.deleteMany({});

    // ---------------- Map all categories by ID ----------------
    const idToRow = {};
    for (const row of data) {
      idToRow[row.id] = row;
    }

    // ---------------- Prepare for Bulk Insert ----------------
    const categoriesToInsert = data.map((row) => {
      let parentId = null;

      // 1. Check if the row has a parent ID
      if (row.parent) {
        // 2. Check if the parent ID exists in our dataset
        if (idToRow[row.parent]) {
          parentId = row.parent;
        } else {
          console.warn(
            `Parent ID ${row.parent} for category ${row.name} (ID: ${row.id}) not found in the uploaded file.`
          );
        }
      }

      return {
        id: row.id,
        name: row.name,
        parent: parentId, // The parent's stable ID or null
        // image: null // The image field is now completely omitted
      };
    });

    // ---------------- Insert all categories in one batch ----------------
    const insertedCats = await Category.insertMany(categoriesToInsert);

    // ---------------- Cleanup uploaded file ----------------
    fs.unlinkSync(filePath);

    return res.json({
      message: "Categories uploaded successfully.",
      insertedCount: insertedCats.length,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    // Manual rollback
    await Category.deleteMany({});
    fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

module.exports = router;
