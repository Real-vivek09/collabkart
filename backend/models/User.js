const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'startup'], required: true },
  skills: [String],
  companyName: String,
  profilePhoto: String,
  isVerified: { type: Boolean, default: false },
  fcmToken: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
