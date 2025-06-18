const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
     enum: [
        'sales',
        'inventory',
        'purchases',
        'customers',
        'auth',
        'client',
        'product',
    ]
  },
  parameters: {
    type: Object,
    default: {}
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    index: true
  },
  fileUrl: {
    type: String
  },
  generatedAt: {
    type: Date
  },
  error: {
    type: String
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Report', reportSchema);
