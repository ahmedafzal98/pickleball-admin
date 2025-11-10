import React, { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;
  return (
    <div className="fixed right-6 bottom-6 bg-white p-3 shadow rounded-xl border">
      <div className="text-sm">{message}</div>
    </div>
  );
}
