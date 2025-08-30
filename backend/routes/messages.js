const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  // Instead of separate IDs, we'll store participants in an array for easier querying
  participants: [{
    type: String, // Storing firebaseUid
    ref: 'User',
    required: true
  }],
  sender: {
    type: String, // firebaseUid of the sender
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  projectId: { // Optional: Link to a project
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);