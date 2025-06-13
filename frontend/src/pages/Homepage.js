import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Button from '../components/Button';
import Laptop3D from '../components/Laptop3D';
import { FaRocket, FaUsers, FaLock, FaStar, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Custom arrows for carousel
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-pink-600 hover:text-purple-700 p-2"
    aria-label="Previous slide"
  >
    <FaArrowLeft size={24} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-pink-600 hover:text-purple-700 p-2"
    aria-label="Next slide"
  >
    <FaArrowRight size={24} />
  </button>
);

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ activeProjects: 500, users: 1000, startups: 50 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Fetch dynamic stats
    axios.get('http://localhost:5001/api/stats')
      .then(({ data }) => setStats(data))
      .catch(err => console.error('Stats fetch error:', err));
    return () => unsubscribe();
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    accessibility: true,
    focusOnSelect: true,
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100">
      <Helmet>
        <title>CollabKart - Connect VNIT Students with Startups</title>
        <meta name="description" content="CollabKart empowers VNIT students to collaborate with startups on innovative projects with secure payments." />
        <meta name="keywords" content="CollabKart, VNIT, startups, projects, collaboration, students" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "CollabKart",
            "url": "https://collabkart.com",
            "description": "Platform connecting VNIT students with startups for innovative projects.",
          })}
        </script>
      </Helmet>
      {/* Hero Section with Parallax */}
      <section className="py-24 px-4 relative bg-[url('https://via.placeholder.com/1920x1080')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-gradient-text text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
              Build the Future with CollabKart
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-lg mx-auto md:mx-0">
              Join VNIT students and startups to build groundbreaking projects with secure collaboration.
            </p>
            <Link to={user ? '/dashboard' : '/signup'}>
              <Button
                text={user ? 'Go to Dashboard' : 'Launch Your Journey'}
                className="bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform shadow-neon text-lg px-8 py-4"
                aria-label={user ? 'Go to dashboard' : 'Sign up now'}
              />
            </Link>
          </div>
          <div className="md:w-1/2 h-80 md:h-96">
            <Laptop3D />
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            How CollabKart Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-400">Students browse startup projects; startups post opportunities.</p>
            </div>
            <div className="text-center animate-fade-in delay-200">
              <div className="bg-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
              <p className="text-gray-400">Connect, communicate, and work together seamlessly.</p>
            </div>
            <div className="text-center animate-fade-in delay-400">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Succeed</h3>
              <p className="text-gray-400">Complete projects with secure payments via Razorpay.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section (Dynamic) */}
      <section className="py-12 px-4 bg-gradient-to-r from-gray-900 to-blue-950">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in">
            <h3 className="text-4xl font-bold text-pink-600">{stats.activeProjects}+</h3>
            <p className="text-gray-400">Active Projects</p>
          </div>
          <div className="animate-fade-in delay-200">
            <h3 className="text-4xl font-bold text-purple-700">{stats.users}+</h3>
            <p className="text-gray-400">VNIT Students</p>
          </div>
          <div className="animate-fade-in delay-400">
            <h3 className="text-4xl font-bold text-blue-500">{stats.startups}+</h3>
            <p className="text-gray-400">Startups</p>
          </div>
        </div>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "CollabKart",
            "url": "https://collabkart.com",
            "statistics": {
              "activeProjects": stats.activeProjects,
              "users": stats.users,
              "startups": stats.startups,
            },
          })}
        </script>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            Why CollabKart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:scale-105 transform transition-transform animate-fade-in">
              <FaRocket className="text-pink-600 text-5xl mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold text-center mb-4">Discover Projects</h3>
              <p className="text-gray-400 text-center">Find innovative startup projects tailored for your skills.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:scale-105 transform transition-transform animate-fade-in delay-200">
              <FaUsers className="text-purple-700 text-5xl mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold text-center mb-4">Hire Top Talent</h3>
              <p className="text-gray-400 text-center">Startups connect with VNIT’s brightest minds.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:scale-105 transform transition-transform animate-fade-in delay-400">
              <FaLock className="text-blue-500 text-5xl mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold text-center mb-4">Secure Payments</h3>
              <p className="text-gray-400 text-center">Hassle-free transactions powered by Razorpay.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Project Carousel Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            Featured Projects
          </h2>
          <Slider {...carouselSettings} className="relative">
            <div className="px-4" role="region" aria-label="Project carousel slide">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">AI-Powered Chatbot</h3>
                <p className="text-gray-400 mb-4">Developed by VNIT students for TechTrend, enhancing customer support.</p>
                <Link to="/projects/1" className="text-pink-600 hover:text-purple-700">Learn More</Link>
              </div>
            </div>
            <div className="px-4" role="region" aria-label="Project carousel slide">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">E-Commerce Platform</h3>
                <p className="text-gray-400 mb-4">Built for Innov8, streamlining online sales.</p>
                <Link to="/projects/2" className="text-pink-600 hover:text-purple-700">Learn More</Link>
              </div>
            </div>
            <div className="px-4" role="region" aria-label="Project carousel slide">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">IoT Smart Home</h3>
                <p className="text-gray-400 mb-4">Created for SmartTech, integrating home automation.</p>
                <Link to="/projects/3" className="text-pink-600 hover:text-purple-700">Learn More</Link>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/* Partners Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-950 to-black">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            Our Partners
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <img src="https://via.placeholder.com/150?text=TechTrend" alt="TechTrend logo" className="h-16 opacity-70 hover:opacity-100 transition-opacity" />
            <img src="https://via.placeholder.com/150?text=Innov8" alt="Innov8 logo" className="h-16 opacity-70 hover:opacity-100 transition-opacity" />
            <img src="https://via.placeholder.com/150?text=SmartTech" alt="SmartTech logo" className="h-16 opacity-70 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </section>
      {/* Testimonials Section with Carousel */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            What Our Community Says
          </h2>
          <Slider {...carouselSettings} className="relative">
            <div className="px-4" role="region" aria-label="Testimonial carousel slide">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400" />
                </div>
                <p className="text-gray-300 mb-4">"CollabKart connected me with a startup for an AI project. The experience was seamless!"</p>
                <p className="text-pink-600 font-semibold">— Aditya, VNIT Student</p>
              </div>
            </div>
            <div className="px-4" role="region" aria-label="Testimonial carousel slide">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400" />
                </div>
                <p className="text-gray-300 mb-4">"We hired top talent from VNIT for our app. CollabKart made it easy!"</p>
                <p className="text-purple-700 font-semibold">— TechTrend Innovations</p>
              </div>
            </div>
            <div className="px-4" role="region" aria-label="Testimonial carousel slide">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400" />
                </div>
                <p className="text-gray-300 mb-4">"The platform’s secure payments gave us confidence to collaborate."</p>
                <p className="text-blue-500 font-semibold">— Priya, VNIT Student</p>
              </div>
            </div>
            <div className="px-4" role="region" aria-label="Testimonial carousel slide">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400" />
                </div>
                <p className="text-gray-300 mb-4">"CollabKart helped us scale our startup with VNIT talent."</p>
                <p className="text-pink-600 font-semibold">— Innov8 Solutions</p>
              </div>
            </div>
          </Slider>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
              },
              "author": [
                { "@type": "Person", "name": "Aditya" },
                { "@type": "Organization", "name": "TechTrend Innovations" },
                { "@type": "Person", "name": "Priya" },
                { "@type": "Organization", "name": "Innov8 Solutions" },
              ],
            })}
          </script>
        </div>
      </section>
      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-blue-950">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:scale-105 transform transition-transform animate-fade-in">
              <img src="https://via.placeholder.com/150" alt="Vivek, Founder" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center mb-2">Vivek</h3>
              <p className="text-gray-400 text-center">Founder & CEO</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:scale-105 transform transition-transform animate-fade-in delay-200">
              <img src="https://via.placeholder.com/150" alt="Ankita, CTO" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center mb-2">Ankita</h3>
              <p className="text-gray-400 text-center">CTO</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:scale-105 transform transition-transform animate-fade-in delay-400">
              <img src="https://via.placeholder.com/150" alt="Rahul, COO" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center mb-2">Rahul</h3>
              <p className="text-gray-400 text-center">COO</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            Ready to Shape the Future?
          </h2>
          <Link to={user ? '/dashboard' : '/signup'}>
            <Button
              text="Join CollabKart Now"
              className="bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform text-lg px-8 py-4 shadow-neon"
              aria-label="Join CollabKart"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;