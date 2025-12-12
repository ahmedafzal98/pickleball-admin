import { useState } from "react";

export default function ImageUpload({ image, setImage }) {
  const [preview, setPreview] = useState(image || "");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Pass File object to parent
    setImage(file);
  };

  return (
    <div>
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 object-cover mb-2 rounded"
        />
      )}
      <input type="file" onChange={handleChange} />
    </div>
  );
}
