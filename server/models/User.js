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
  backupEmail: {
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
  createdAt: {
    type: Number,
    default: Date.now()
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;