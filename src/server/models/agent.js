const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Agent Schema
 * Represents an LLM agent in the MCP system
 */
const AgentSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['Claude', 'ChatGPT']
  },
  role: {
    type: String,
    required: true,
    enum: ['Builder', 'Judge'],
    default: 'Builder'
  },
  provider: {
    type: String,
    required: true,
    enum: ['Anthropic', 'OpenAI']
  },
  model: {
    type: String,
    required: true
  },
  systemPrompt: {
    type: String,
    required: true
  },
  contextWindow: {
    type: Number,
    required: true
  },
  maxTokens: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    default: 0.7,
    min: 0,
    max: 1
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
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
AgentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Agent', AgentSchema);
