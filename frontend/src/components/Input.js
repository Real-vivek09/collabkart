import React from 'react';

const Input = ({ type = 'text', placeholder, value, onChange, className = '' }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-4 py-2 rounded-md bg-gray-800 text-white border border-pink-600 shadow-neon focus:outline-none focus:ring-2 focus:ring-purple-700 ${className}`}
    />
  );
};

export default Input;
