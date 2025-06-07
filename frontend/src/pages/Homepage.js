import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Button from '../components/Button';
import Laptop3D from '../components/Laptop3D';
import { FaRocket, FaUsers, FaLock, FaStar } from 'react-icons/fa';

const Homepage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <Helmet>
        <title>CollabKart - Connect VNIT Students with Startups</title>
        <meta name="description" content="CollabKart empowers VNIT students to collaborate with startups on innovative projects with secure payments." />
        <meta name="keywords" content="CollabKart, VNIT, startups, projects, collaboration, students" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      {/* Hero Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0 z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-gradient-text text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
              Build the Future with CollabKart
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-lg mx-auto md:mx-0">
              Empowering VNIT students to collaborate with startups on cutting-edge projects with secure payments.
            </p>
            <Link to={user ? '/dashboard' : '/signup'}>
              <Button
                text={user ? 'Go to Dashboard' : 'Start Collaborating'}
                className="bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform shadow-neon"
              />
            </Link>
          </div>
          <div className="md:w-1/2 h-80 md:h-96">
            <Laptop3D />
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in">
            <h3 className="text-4xl font-bold text-pink-600">500+</h3>
            <p className="text-gray-400">Active Projects</p>
          </div>
          <div className="animate-fade-in delay-200">
            <h3 className="text-4xl font-bold text-purple-700">1000+</h3>
            <p className="text-gray-400">VNIT Students</p>
          </div>
          <div className="animate-fade-in delay-400">
            <h3 className="text-4xl font-bold text-blue-500">50+</h3>
            <p className="text-gray-400">Startups</p>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            Why Choose CollabKart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:scale-105 transform transition-transform animate-fade-in">
              <FaRocket className="text-pink-600 text-5xl mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold text-center mb-4 text-white">Discover Projects</h3>
              <p className="text-gray-400 text-center">
                Find innovative startup projects tailored for your skills.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:scale-105 transform transition-transform animate-fade-in delay-200">
              <FaUsers className="text-purple-700 text-5xl mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold text-center mb-4 text-white">Hire Top Talent</h3>
              <p className="text-gray-400 text-center">
                Startups connect with VNIT’s brightest minds.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:scale-105 transform transition-transform animate-fade-in delay-400">
              <FaLock className="text-blue-500 text-5xl mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold text-center mb-4 text-white">Secure Payments</h3>
              <p className="text-gray-400 text-center">
                Hassle-free transactions powered by Razorpay.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-950 to-black">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            Hear from Our Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg animate-fade-in">
              <div className="flex items-center mb-4">
                <FaStar className="text-yellow-400 mr-1" />
                <FaStar className="text-yellow-400 mr-1" />
                <FaStar className="text-yellow-400 mr-1" />
                <FaStar className="text-yellow-400 mr-1" />
                <FaStar className="text-yellow-400" />
              </div>
              <p className="text-gray-300 mb-4">
                "CollabKart connected me with a startup for an AI project. The experience was seamless!"
              </p>
              <p className="text-pink-600 font-semibold">— Aditya, VNIT Student</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg animate-fade-in delay-200">
              <div className="flex items-center mb-4">
                <FaStar className="text-yellow-400 mr-1" />
                <FaStar className="text-yellow-400 mr-1" />
                <FaStar className="text-yellow-400 mr-1" />
                <FaStar className="text-yellow-400 mr-1" />
                <FaStar className="text-yellow-400" />
              </div>
              <p className="text-gray-300 mb-4">
                "We hired top talent from VNIT for our app. CollabKart made it easy!"
              </p>
              <p className="text-purple-700 font-semibold">— TechTrend Innovations</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            Ready to Transform Ideas into Reality?
          </h2>
          <Link to={user ? '/dashboard' : '/signup'}>
            <Button
              text="Join CollabKart Now"
              className="bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform text-lg px-8 py-4 shadow-neon"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;