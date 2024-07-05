const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  relationship: {
    type: String,
    required: true,
  },
});

module.exports = personSchema;