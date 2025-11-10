import React, { useEffect, useRef, useState } from "react";

export default function CategoryDrawer({
  isOpen,
  onClose,
  onSave,
  initial = null,
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || null);
  const ref = useRef();

  useEffect(() => {
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setPreview(initial?.image || null);
    setImageFile(null);
  }, [initial, isOpen]);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (f) setImageFile(f);
  }

  function submit() {
    if (!title.trim()) return alert("Category title required");
    const payload = {
      title: title.trim(),
      description: description.trim(),
      image: preview,
    };
    onSave(payload);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isOpen ? "" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        } drawer-backdrop`}
      ></div>
      <div
        ref={ref}
        className={`ml-auto w-full max-w-md bg-white h-full shadow-xl transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {initial ? "Edit Category" : "Add Category"}
            </h3>
            <button onClick={onClose} className="text-gray-500">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 block w-full rounded-md border p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 block w-full rounded-md border p-2"
                rows={3}
              ></textarea>
            </div>

            <div>
              <label className="text-sm font-medium">Image</label>
              <div className="mt-2 flex gap-3 items-center">
                <div className="w-28 h-20 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleFile} />
                  {preview && (
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setPreview(null);
                        }}
                        className="text-xs text-red-600"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-md">
              Cancel
            </button>
            <button
              onClick={submit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              {initial ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
