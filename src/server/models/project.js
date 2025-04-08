const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Project Schema
 * Represents a website development project in the MCP system
 */
const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['static', 'dynamic'],
    default: 'static'
  },
  techStack: {
    frontend: {
      type: String,
      required: true,
      default: 'HTML/CSS/JS'
    },
    css: {
      type: String,
      enum: ['CSS', 'Tailwind', 'SCSS', 'Bootstrap'],
      default: 'Tailwind'
    },
    javascript: {
      type: String,
      enum: ['Vanilla JS', 'Alpine.js', 'React', 'Vue'],
      default: 'Vanilla JS'
    },
    backend: {
      type: String,
      default: 'None'
    },
    database: {
      type: String,
      default: 'None'
    },
    cms: {
      type: String,
      default: 'None'
    }
  },
  structure: {
    pages: [String],
    components: [String]
  },
  fileStructure: {
    type: Object,
    default: {}
  },
  status: {
    type: String,
    enum: ['planning', 'in_progress', 'review', 'completed'],
    default: 'planning'
  },
  deploymentInfo: {
    platform: String,
    url: String,
    deployedAt: Date
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
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
