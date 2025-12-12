import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../redux/slices/categorySlice";

export const useCategories = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return { categories: items, loading, error };
};
