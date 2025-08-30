const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Register user and send verification email
exports.registerUser = async (req, res) => {
  try {
    const { firebaseUid, name, email, role, skills, companyName } = req.body;

    const user = new User({ firebaseUid, name, email, role, skills, companyName });
    await user.save();

    const verificationLink = `http://localhost:3000/verify-email?uid=${firebaseUid}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your CollabKart Account',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });

    res.status(201).json({ message: 'User registered, verification email sent' });
  } catch (err) {
    console.error('Register User Error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Verify email from link
exports.verifyEmail = async (req, res) => {
  try {
    const { uid } = req.query;

    const user = await User.findOneAndUpdate({ firebaseUid: uid }, { isVerified: true }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.redirect('/login'); // redirect frontend login route
  } catch (err) {
    console.error('Email Verification Error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile and optional photo upload
exports.updateUserProfile = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { name, skills, companyName } = req.body;
    let profilePhotoUrl = '';

    if (req.files?.profilePhoto) {
      const profilePhoto = req.files.profilePhoto;
      const result = await cloudinary.uploader.upload(profilePhoto.tempFilePath, {
        folder: 'collabkart/profiles',
        transformation: [{ width: 200, height: 200, crop: 'fill' }],
      });

      profilePhotoUrl = result.secure_url;
    }

    const updates = { name, skills, companyName, ...(profilePhotoUrl && { profilePhoto: profilePhotoUrl }) };
    const updatedUser = await User.findOneAndUpdate({ firebaseUid }, updates, { new: true });

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
};
