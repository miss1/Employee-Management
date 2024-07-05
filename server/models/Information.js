const mongoose = require('mongoose');
const personSchema = require('Person');

const informationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
  preferredName: {
    type: String,
  },
  picture: {
    type: String,
  },
  addressLine: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  cellPhone: {
    type: String,
    required: true,
  },
  workPhone: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  ssn: {
    type: String,
    required: true,
  },
  birthDate: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  workAuth: {
    type: String,  // green card, citizen, H1-B, F1, L2...
    required: true,
  },
  workAuthStart: {
    type: String,
    required: true,
  },
  workAuthEnd: {
    type: String,
    required: true,
  },
  optReceipt: {
    type: String,
    validate: {
      validator: function (value) {
        return this.workAuth !== 'F1' || (this.workAuth === 'F1' && value);
      },
      message: 'OPT Receipt is required when you are a F1'
    }
  },
  reference: personSchema,
  emergencyContacts: [personSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Information = mongoose.model('Information', informationSchema);

module.exports = Information;