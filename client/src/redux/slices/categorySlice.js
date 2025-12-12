import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/ categoryApi";

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async () => {
    return await fetchCategories();
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (data) => {
    return await createCategory(data);
  }
);

export const editCategory = createAsyncThunk(
  "categories/editCategory",
  async ({ id, data }) => {
    return await updateCategory(id, data);
  }
);

export const removeCategory = createAsyncThunk(
  "categories/removeCategory",
  async (id) => {
    return await deleteCategory(id);
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
