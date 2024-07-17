const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
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
    default: ''
  },
  optReceipt: {
    type: String,
    required: true
  },
  optEAD: {
    type: String,
  },
  i983: {
    type: String,
  },
  i20: {
    type: String,
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;