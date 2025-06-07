import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white shadow-md z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CollabKart
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/projects" className="text-gray-700 hover:text-blue-600 transition">
            Projects
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
            Login
          </Link>
          <Link to="/signup" className="text-gray-700 hover:text-blue-600 transition">
            Signup
          </Link>
        </div>
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col space-y-4 p-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/projects" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Projects
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Signup
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;