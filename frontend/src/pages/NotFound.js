import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../views/Navbar';
import Footer from '../views/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 animate-pulse">404</h1>
          <p className="text-2xl mb-6">Oops! Page not found.</p>
          <Link
            to="/"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-100"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;