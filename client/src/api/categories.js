import axios from "axios";

const BASE_URL = "http://localhost:5000/api/categories";

export const fetchCategories = async () => {
  const res = await axios.get(`${BASE_URL}/dropdown/all`);
  return res.data;
};

export const fetchCategoryTree = async () => {
  const res = await axios.get(`${BASE_URL}/tree`);
  return res.data;
};

export const searchCategories = async (q, parent) => {
  const params = { q };
  if (parent !== undefined) params.parent = parent;
  const res = await axios.get(`${BASE_URL}/search`, { params });
  return res.data;
};

export const createCategory = async (category) => {
  const res = await axios.post(BASE_URL, category);
  return res.data;
};

export const updateCategory = async (id, category) => {
  const res = await axios.put(`${BASE_URL}/${id}`, category);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};

export const uploadCategories = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
