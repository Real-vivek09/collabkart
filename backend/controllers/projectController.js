const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error('GetAllProjects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('CreateProject error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

exports.searchProjects = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });

    const projects = await Project.find({ title: { $regex: q, $options: 'i' } });
    res.json(projects);
  } catch (err) {
    console.error('SearchProjects error:', err);
    res.status(500).json({ error: 'Failed to search' });
  }
};
