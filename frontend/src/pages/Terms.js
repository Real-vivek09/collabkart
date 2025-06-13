import React from 'react';
import { Helmet } from 'react-helmet-async';

const Terms = () => (
  <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100 py-16 px-4">
    <Helmet>
      <title>Terms of Service - CollabKart</title>
      <meta name="description" content="Read CollabKart's terms of service." />
    </Helmet>
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800 mb-6">
        Terms of Service
      </h1>
      <p className="text-gray-300 dark:text-gray-200 light:text-gray-700">Coming soon...</p>
    </div>
  </div>
);

export default Terms;