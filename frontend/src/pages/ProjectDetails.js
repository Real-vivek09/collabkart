import React from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetails() {
  const { id } = useParams();

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Project Details for ID: {id}</h1>
    </div>
  );
}

export default ProjectDetails;
