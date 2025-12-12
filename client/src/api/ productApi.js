import axios from "axios";

export const fetchProducts = async (categoryId) => {
  const { data } = await axios.get(`/api/products?category=${categoryId}`);
  return data;
};

export const fetchAmazonProducts = async (query) => {
  const { data } = await axios.get(`/api/amazon?query=${query}`);
  return data;
};
