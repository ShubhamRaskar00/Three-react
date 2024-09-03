import React from 'react'

function Button({ onClick, children, className = '', type = 'button' }) {
  return (
    <button
      className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button;