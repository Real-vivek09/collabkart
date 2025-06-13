import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../components/Button';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5001/api/newsletter/subscribe', { email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err);
      toast.error('Failed to subscribe');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      className="bg-gray-800 dark:bg-gray-900 light:bg-gray-200 text-gray-300 dark:text-gray-200 light:text-gray-700 py-12"
      role="contentinfo"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800 mb-4">
              About CollabKart
            </h3>
            <p className="text-sm leading-relaxed">
              CollabKart is a platform connecting VNIT students with startups for innovative projects. Our mission is to foster collaboration, spark creativity, and drive real-world impact through technology and entrepreneurship.
            </p>
          </div>
          {/* Navigation Links */}
          <div className="animate-fade-in delay-200">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors" aria-label="Home page">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors" aria-label="Projects page">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors" aria-label="Dashboard page">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile/edit" className="hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors" aria-label="Edit profile page">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          {/* Legal Links */}
          <div className="animate-fade-in delay-400">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800 mb-4">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors" aria-label="Privacy policy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors" aria-label="Terms of service">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors" aria-label="Contact us">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          {/* Newsletter Signup */}
          <div className="animate-fade-in delay-600">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800 mb-4">
              Stay Updated
            </h3>
            <form onSubmit={handleSubscribe} className="space-y-4" aria-label="Newsletter signup form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-600 dark:border-gray-700 light:border-gray-300 rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-white text-white dark:text-gray-200 light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-600 transform hover:scale-105 transition-transform"
                required
                aria-label="Email for newsletter"
              />
              <Button
                text={submitting ? <span className="animate-spin inline-block h-5 w-5 border-t-2 border-white rounded-full"></span> : 'Subscribe'}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform shadow-neon"
                type="submit"
                disabled={submitting}
                aria-label="Subscribe to newsletter"
              />
            </form>
          </div>
        </div>
        {/* Social Media & Copyright */}
        <div className="mt-8 border-t border-gray-700 dark:border-gray-800 light:border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="https://github.com/collabkart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors"
              aria-label="GitHub profile"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://linkedin.com/company/collabkart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors"
              aria-label="LinkedIn profile"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://x.com/collabkart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 light:hover:text-blue-600 transition-colors"
              aria-label="Twitter profile"
            >
              <FaTwitter size={24} />
            </a>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 light:text-gray-600">
            &copy; {new Date().getFullYear()} CollabKart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;