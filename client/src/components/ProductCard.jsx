export default function ProductCard({ product }) {
  return (
    <div className="p-2 bg-white rounded-lg shadow hover:shadow-md">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-40 object-contain"
      />
      <h3 className="mt-2 text-sm font-medium">{product.title}</h3>
      <p className="text-sm text-gray-600">{product.price}</p>
    </div>
  );
}
