export default function CategoryCard({ category, onClick }) {
  return (
    <div
      onClick={() => onClick(category)}
      className="cursor-pointer p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-32 object-cover rounded"
      />
      <h2 className="mt-2 text-center font-semibold">{category.name}</h2>
    </div>
  );
}
