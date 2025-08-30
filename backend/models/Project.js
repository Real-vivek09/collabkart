const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [String],
  budget: { type: Number, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to the startup user
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);