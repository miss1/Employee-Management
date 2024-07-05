const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  step: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4],
    default: 1,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
  },
  feedback: {
    type: String,
    required: true,
  },
  optReceipt: {
    type: String,
    required: true
  },
  optEAD: {
    type: String,
    validate: {
      validator: function (value) {
        return this.step < 2 || (this.step >= 2 && value);
      },
      message: 'OPT EAD is required'
    }
  },
  i983: {
    type: String,
    validate: {
      validator: function (value) {
        return this.step < 3 || (this.step >= 3 && value);
      },
      message: 'I-983 is required'
    }
  },
  i20: {
    type: String,
    validate: {
      validator: function (value) {
        return this.step < 4 || (this.step === 4 && value);
      },
      message: 'I20 is required'
    }
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;