const mongoose = require('mongoose');

const informationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
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
    type: String,
    required: true,
    enum: ['GreenCard', 'Citizen', 'H1-B', 'L2', 'F1', 'H4', 'Other'],
  },
  workAuthOther: {
    type: String,
    validate: {
      validator: function (value) {
        return this.workAuth !== 'Other' || (this.workAuth === 'Other' && value);
      },
      message: 'Work Auth is required'
    }
  },
  workAuthStart: {
    type: String,
    validate: {
      validator: function (value) {
        return this.workAuth === 'GreenCard' || this.workAuth === 'Citizen' || value;
      },
      message: 'Work Auth start date is required'
    }
  },
  workAuthEnd: {
    type: String,
    validate: {
      validator: function (value) {
        return this.workAuth === 'GreenCard' || this.workAuth === 'Citizen' || value;
      },
      message: 'Work Auth end date is required'
    }
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
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    require: true
  },
  emergencyContacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Information = mongoose.model('Information', informationSchema);

module.exports = Information;