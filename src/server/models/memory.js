const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Memory Schema
 * Represents conversation memory for an agent in the MCP system
 */
const MemorySchema = new Schema({
  agentId: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  messages: [{
    role: {
      type: String,
      required: true,
      enum: ['system', 'user', 'assistant']
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  summary: {
    type: String,
    default: ''
  },
  summaryTimestamp: {
    type: Date
  },
  tokenCount: {
    type: Number,
    default: 0
  },
  anchors: [{
    key: String,
    value: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
MemorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Memory', MemorySchema);
