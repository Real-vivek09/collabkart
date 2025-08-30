const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');
const Project = require('../models/Project');
const router = express.Router();

router.get('/data', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await User.findOne({ firebaseUid: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const projects = await Project.find({ $or: [{ createdBy: user._id }, { assignedTo: user._id }] });
    const tasks = [
      { id: 1, title: 'Complete project proposal', dueDate: '2025-06-15', status: 'pending' },
      { id: 2, title: 'Review startup feedback', dueDate: '2025-06-16', status: 'in-progress' },
    ]; // Placeholder, replace with Task model later
    const notifications = [
      { id: 1, message: 'New project assigned: AI Chatbot', timestamp: new Date() },
      { id: 2, message: 'Payment received for E-Commerce Platform', timestamp: new Date() },
    ]; // Placeholder, replace with Notification model later

    const stats = {
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
    };

    res.json({ projects, tasks, notifications, stats });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;