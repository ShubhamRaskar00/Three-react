import React from "react";

function Label({ htmlFor, children, className = '' }) {
  return (
    <label className={`block text-gray-700 text-sm font-bold mb-2 ${className}`} htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export default Label;
