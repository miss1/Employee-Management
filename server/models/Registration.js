const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: Date.now()
  },
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;