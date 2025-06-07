import React from 'react';

const Button = ({ text, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
