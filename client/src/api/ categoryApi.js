import axios from "axios";
import axiosInstance from "./axiosInstance";

export const fetchCategories = async () => {
  const { data } = await axiosInstance.get("/api/categories");
  return data;
};

export const createCategory = async (formData) => {
  const { data } = await axiosInstance.post("/api/categories", formData);
  return data;
};

export const updateCategory = async (id, formData) => {
  const { data } = await axiosInstance.put(`/api/categories/${id}`, formData);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await axiosInstance.delete(`/api/categories/${id}`);
  return data;
};
