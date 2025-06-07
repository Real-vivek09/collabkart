// Homepage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../views/ProjectCard';
import Button from '../components/Button';
import axios from 'axios';

const Homepage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => setProjects(res.data.slice(0, 3)))
      .catch(err => console.error(err));
  }, []);

  const handleStudentClick = () => {
    navigate('/signup?type=student');
  };

  const handleStartupClick = () => {
    navigate('/signup?type=startup');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar removed from here */}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            Connect with Startups, Build Your Future
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in delay-200">
            VNIT students, work on real projects and skyrocket your skills!
          </p>
          <div className="flex justify-center space-x-4">
            <Button text="Join as Student" className="bg-white text-blue-600 hover:bg-blue-100" onClick={handleStudentClick} />
            <Button text="Join as Startup" className="border-2 border-white text-white hover:bg-white hover:text-blue-600" onClick={handleStartupClick} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className="cursor-pointer">
                  <ProjectCard project={project} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-3">
                No projects available yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer removed from here */}
    </div>
  );
};

export default Homepage;
