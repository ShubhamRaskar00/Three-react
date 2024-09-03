import React from "react";

function Heading({ children, className = '' }) {
  return <h2 className={`text-2xl font-bold mb-6 text-center ${className}`}>{children}</h2>;
}

export default Heading;
