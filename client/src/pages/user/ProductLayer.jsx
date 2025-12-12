import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { fetchAmazonProducts } from "../../api/ productApi";
import ProductCard from "../../components/ProductCard";

export default function ProductLayer({ category }) {
  const { products: ebayProducts, loading } = useProducts(category?.id);
  const [amazonProducts, setAmazonProducts] = useState([]);

  useEffect(() => {
    if (category) {
      fetchAmazonProducts(category.name).then(setAmazonProducts);
    }
  }, [category]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex space-x-4 overflow-x-auto p-2">
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-bold">eBay</h2>
        {ebayProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-bold">Amazon</h2>
        {amazonProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
