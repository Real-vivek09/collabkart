import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../App';
import { signOut } from 'firebase/auth';
import { FaGithub, FaLinkedin, FaTwitter, FaSearch, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { auth } from '../firebase';
import axios from 'axios';
import Button from '../components/Button';

const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const { data } = await axios.get(`http://localhost:5001/api/projects/search?q=${searchQuery}`);
      navigate('/projects', { state: { searchResults: data } });
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Failed to search projects');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className="bg-gray-800 dark:bg-gray-900 light:bg-white shadow-lg py-4 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800"
          aria-label="CollabKart homepage"
        >
          CollabKart
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 dark:text-gray-200 light:text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="px-4 py-2 rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-gray-100 text-white dark:text-gray-200 light:text-gray-900 border border-gray-600 dark:border-gray-700 light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-600 w-48"
              aria-label="Search projects"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
              aria-label="Submit search"
            >
              <FaSearch />
            </button>
          </form>

          {/* Navigation Links */}
          <Link
            to="/projects"
            className="text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors"
            aria-label="Projects page"
          >
            Projects
          </Link>
          <Link
            to="/about"
            className="text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors"
            aria-label="About page"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors"
            aria-label="Contact page"
          >
            Contact
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
              console.log('Theme toggle clicked'); // Debug log
            }}
            className="text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors flex items-center space-x-2"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
            <span className="text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                <img
                  src={user.photoURL || 'https://via.placeholder.com/32'}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full border-2 border-pink-600 shadow-neon"
                />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 dark:bg-gray-900 light:bg-white rounded-lg shadow-lg py-2 animate-fade-in">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 light:hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                    aria-label="Dashboard"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile/edit"
                    className="block px-4 py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 light:hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                    aria-label="Edit profile"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 light:hover:bg-gray-100"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors"
                aria-label="Login page"
              >
                Login
              </Link>
              <Button
                text="Sign Up"
                className="bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform shadow-neon"
                onClick={() => navigate('/signup')}
                aria-label="Sign up"
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 dark:bg-gray-900 light:bg-white px-4 py-6 animate-fade-in">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full px-4 py-2 rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-gray-100 text-white dark:text-gray-200 light:text-gray-900 border border-gray-600 dark:border-gray-700 light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-600"
              aria-label="Search projects"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
              aria-label="Submit search"
            >
              <FaSearch />
            </button>
          </form>
          <Link
            to="/projects"
            className="block py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Projects page"
          >
            Projects
          </Link>
          <Link
            to="/about"
            className="block py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
            aria-label="About page"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Contact page"
          >
            Contact
          </Link>
          <button
            onClick={() => {
              toggleTheme();
              console.log('Mobile theme toggle clicked'); // Debug log
              setIsMenuOpen(false);
            }}
            className="block py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Dashboard"
              >
                Dashboard
              </Link>
              <Link
                to="/profile/edit"
                className="block py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Edit profile"
              >
                Edit Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Login page"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block py-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Sign up page"
              >
                Sign Up
              </Link>
            </>
          )}
          <div className="flex space-x-4 mt-4">
            <a
              href="https://github.com/collabkart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
              aria-label="GitHub profile"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://linkedin.com/company/collabkart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
              aria-label="LinkedIn profile"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://x.com/collabkart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600"
              aria-label="Twitter profile"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;