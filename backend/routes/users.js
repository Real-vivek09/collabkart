const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { firebaseUid, name, email, role, skills, companyName } = req.body;
    const user = new User({
      firebaseUid,
      name,
      email,
      role,
      skills: skills ? skills.split(',').map((s) => s.trim()) : [],
      companyName,
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('User registration error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.get('/profile/:firebaseUid', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile/:firebaseUid', async (req, res) => {
  try {
    const { name, skills, companyName } = req.body;
    const updateData = {
      name,
      skills: skills ? skills.split(',').map((s) => s.trim()) : [],
      companyName,
    };
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { $set: updateData },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/projects/:userId', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId });
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const pendingPayments = projects.reduce((sum, p) => sum + (p.status === 'active' ? p.paymentAmount : 0), 0);
    res.json({ active, completed, pendingPayments });
  } catch (err) {
    console.error('Projects fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

module.exports = router;