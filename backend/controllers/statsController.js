const User = require('../models/User');
const Project = require('../models/Project');

exports.getStats = async (req, res) => {
  try {
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const users = await User.countDocuments();
    const startups = await User.countDocuments({ role: 'startup' });

    res.json({ activeProjects, users, startups });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
