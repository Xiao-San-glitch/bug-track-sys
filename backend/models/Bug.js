const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the bug'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description for the bug'],
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bug', bugSchema);
