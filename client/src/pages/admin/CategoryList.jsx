import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CategoryList() {
  const categories = useSelector((state) => state.categories.list);
  console.log(categories);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">All Categories</h1>
      {categories.map((cat) => (
        <div key={cat.id} className="border p-4 rounded">
          <img src={cat.image} className="w-32 h-32 object-cover mb-2" />
          <h2 className="font-semibold">{cat.name}</h2>
          <Link
            to={`/admin/categories/edit/${cat.id}`}
            className="text-blue-500 mt-2 inline-block"
          >
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
}
