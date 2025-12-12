import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";

export const useProducts = (categoryId) => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (categoryId) dispatch(getProducts(categoryId));
  }, [categoryId, dispatch]);

  return { products: items, loading, error };
};
