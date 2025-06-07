import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-gradient-to-b from-blue-600 to-purple-600 text-white h-screen ${
        isOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 fixed md:static`}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className={`text-xl font-bold ${isOpen ? 'block' : 'hidden'}`}>
          CollabKart
        </h2>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      <nav className="mt-8">
        <Link
          to="/dashboard"
          className="flex items-center p-4 hover:bg-blue-700"
        >
          <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M7 4h10a1 1 0 011 1v14a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1z"
            />
          </svg>
          <span className={isOpen ? 'block' : 'hidden'}>Dashboard</span>
        </Link>
        <Link
          to="/projects"
          className="flex items-center p-4 hover:bg-blue-700"
        >
          <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2v0M9 5a2 2 0 0a2 2 0 002-2h2v0"
            />
          </svg>
          <span className={isOpen ? 'block' : 'hidden'}>Projects</span>
        </Link>
        <Link
          to="/messaging"
          className="flex items-center p-4 hover:bg-blue-800"
        >
          <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className={isOpen ? 'block' : 'hidden'}>Messaging</span>
        </Link>
        <Link
          to="/payment"
          className="flex items-center p-4 hover:bg-blue-700"
        >
          <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <span className={isOpen ? 'block' : 'hidden'}>Payments</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;