import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {project.title || 'Untitled Project'}
      </h3>
      <p className="text-gray-600 mb-4">
        {project.description?.substring(0, 100) || 'No description available'}...
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.skills?.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}
      </div>
      <p className="text-gray-700 font-medium mb-4">
        Budget: ₹{project.budget || 'N/A'}
      </p>
      <Link
        to={`/projects/${project.id}`}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        View Details →
      </Link>
    </div>
  );
};

export default ProjectCard;