const User = require('../models/User');

// Register a new user (student or startup)
exports.registerUser = async (req, res) => {
  try {
    const { firebaseUid, name, email, role, skills, companyName } = req.body;

    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists in DB.' });
    }

    // Create new user object based on role
    const newUser = new User({
      firebaseUid,
      name,
      email,
      role,
      skills: role === 'student' ? skills : undefined,
      companyName: role === 'startup' ? companyName : undefined,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully in DB.' });
  } catch (error) {
    console.error('Error registering user in DB:', error);
    res.status(500).json({ message: 'Server error while registering user.' });
  }
};
