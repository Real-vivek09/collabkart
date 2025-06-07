import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../App';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-gradient-to-r from-black to-blue-950 sticky top-0 z-50 shadow-neon">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-pink-600">
          CollabKart
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-300 hover:text-purple-700">
            Home
          </Link>
          <Link to="/signup" className="text-gray-300 hover:text-purple-700">
            Signup
          </Link>
          <Link to="/login" className="text-gray-300 hover:text-purple-700">
            Login
          </Link>
          <button
            onClick={toggleTheme}
            className="text-gray-300 hover:text-pink-600 focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;