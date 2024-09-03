import React from "react";

function ErrorMessage({ message }) {
  if (!message) return null;

  return <p className="text-red-500 text-xs italic mt-1">{message}</p>;
}

export default ErrorMessage;
