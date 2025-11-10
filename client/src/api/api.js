// src/api/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
  },
});

// Helper: extract error message
const getErrorMessage = (err) => {
  if (!err) return "Unknown error";
  return err.response?.data?.message || err.message || String(err);
};

/* ===========================
   CATEGORY ENDPOINTS
   =========================== */

/**
 * Get all categories
 * @returns {Promise<Array>}
 */
export const getCategories = async () => {
  try {
    const res = await api.get("/api/categories");
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

/**
 * Create a category (with optional subcategories)
 * - categoryImage: File
 * - subcategories: Array of { name: string, file: File }  (optional)
 *
 * @param {{ name: string, categoryImage: File, subcategories?: Array }} payload
 */
export const createCategory = async (payload) => {
  try {
    // const name = payload.get("name");
    // const categoryImage = payload.get("image");
    // const subcategories = payload.get("subcategories");
    // const subcategoriesArray = JSON.parse(subcategories);

    // const form = new FormData();
    // form.append("name", name);
    // if (categoryImage) form.append("categoryImage", categoryImage);
    // if (subcategoriesArray.length > 0) {
    //   // build names array of objects: [{ name }]
    //   const namesArray = subcategoriesArray.map((s) => ({ name: s.name }));
    //   form.append("subcategories", JSON.stringify(namesArray));
    //   subcategoriesArray.forEach((s) => {
    //     if (s.preview) form.append("subcategoryImages", s.preview);
    //   });
    // } else {
    //   // ensure backend can receive empty list if you want
    //   form.append("subcategories", JSON.stringify([]));
    // }
    // console.log(form.get("name"));
    // console.log(form.get("categoryImage"));
    // console.log(form.get("subcategories"));
    const res = await api.post("/api/categories", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

/**
 * Update category (name and/or categoryImage)
 * @param {string} id
 * @param {{ name?: string, categoryImage?: File }} payload
 */
export const updateCategory = async (id, payload) => {
  try {
    const { name, categoryImage } = payload;
    // Use FormData so file or name can be updated
    const form = new FormData();
    if (name) form.append("name", name);
    if (categoryImage) form.append("categoryImage", categoryImage);

    const res = await api.put(`/api/categories/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(res.data);

    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

/**
 * Delete category
 * @param {string} id
 */
export const deleteCategory = async (id) => {
  try {
    const res = await api.delete(`/api/categories/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

/* ===========================
   SUBCATEGORY ENDPOINTS
   =========================== */

/**
 * Add single subcategory to category
 * - name: string
 * - file: File
 * @param {string} categoryId
 * @param {{ name: string, file: File }} payload
 */
export const addSubcategory = async (categoryId, payload) => {
  try {
    const { name, file } = payload;
    const form = new FormData();
    form.append("name", name);
    if (file) form.append("subcategoryImage", file);

    const res = await api.post(
      `/api/categories/${categoryId}/subcategories`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

/**
 * Update a subcategory
 * - name?: string
 * - file?: File
 * @param {string} categoryId
 * @param {string} subId
 * @param {{ name?: string, file?: File }} payload
 */
export const updateSubcategory = async (categoryId, subId, payload) => {
  try {
    const name = payload.get("name");
    const image = payload.get("image");

    console.log(name);
    console.log(image);

    // const form = new FormData();
    // if (name) form.append("name", name);
    // if (file) form.append("subcategoryImage", file);

    const res = await api.put(
      `/api/categories/${categoryId}/subcategories/${subId}`,
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log(res.data);

    // return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

/**
 * Delete a subcategory
 * @param {string} categoryId
 * @param {string} subId
 */
export const deleteSubcategory = async (categoryId, subId) => {
  try {
    const res = await api.delete(
      `/api/categories/${categoryId}/subcategories/${subId}`
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

/* ===========================
   OPTIONAL: upload-only helper
   If you want a separate image upload endpoint later, you can add it here.
   =========================== */

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
