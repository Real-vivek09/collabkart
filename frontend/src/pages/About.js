import React from 'react';
import { Helmet } from 'react-helmet-async';

const About = () => (
  <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100 py-16 px-4">
    <Helmet>
      <title>About Us - CollabKart</title>
      <meta name="description" content="Learn about CollabKart's mission to connect VNIT students and startups." />
    </Helmet>
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800 mb-6">
        About CollabKart
      </h1>
      <p className="text-gray-300 dark:text-gray-200 light:text-gray-700 mb-4">
        CollabKart is a dynamic platform designed to bridge the gap between VNIT students and innovative startups. Our mission is to foster collaboration, ignite creativity, and empower the next generation of innovators to solve real-world problems through technology and entrepreneurship.
      </p>
      <p className="text-gray-300 dark:text-gray-200 light:text-gray-700">
        Founded in 2025, CollabKart connects talented students with startups seeking fresh perspectives, enabling impactful projects that drive growth and innovation.
      </p>
    </div>
  </div>
);

export default About;