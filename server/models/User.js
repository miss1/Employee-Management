const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['hr', 'employee'],
  },
  password: {
    type: String,
    required: true,
  },
  onboarding: {
    type: String,
    required: true,
    enum: ['never', 'pending', 'approved', 'rejected'],
    default: 'never',
  },
  feedback: {
    type: String,
    default: '',
  },
  information: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Information',
    unique: true,
    sparse: true,
  },
  documents: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    unique: true,
    sparse: true,
  },
  status: {
    type: Number,
    required: true,
    enum: [0, 1],  // in progress, finished
    default: 0,
  },
  createdAt: {
    type: Number,
    default: Date.now()
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;