#!/bin/bash

# MCP System Database Setup Script
# This script sets up the MongoDB database for the MCP system

# Exit on error
set -e

echo "Setting up MongoDB database for MCP System..."

# Connect to MongoDB and create database and collections
mongo --eval "
  // Connect to database (creates it if it doesn't exist)
  db = db.getSiblingDB('mcp_system');
  
  // Create collections with validation
  db.createCollection('projects', {
    validator: {
      \$jsonSchema: {
        bsonType: 'object',
        required: ['name', 'type'],
        properties: {
          name: {
            bsonType: 'string',
            description: 'Project name is required'
          },
          description: {
            bsonType: 'string'
          },
          type: {
            bsonType: 'string',
            enum: ['static', 'dynamic'],
            description: 'Project type must be either static or dynamic'
          },
          status: {
            bsonType: 'string',
            enum: ['planning', 'in_progress', 'completed'],
            description: 'Project status must be one of the allowed values'
          }
        }
      }
    }
  });
  
  db.createCollection('agents', {
    validator: {
      \$jsonSchema: {
        bsonType: 'object',
        required: ['name', 'role', 'provider', 'model', 'projectId'],
        properties: {
          name: {
            bsonType: 'string',
            description: 'Agent name is required'
          },
          role: {
            bsonType: 'string',
            enum: ['Builder', 'Judge'],
            description: 'Agent role must be either Builder or Judge'
          },
          provider: {
            bsonType: 'string',
            enum: ['OpenAI', 'Anthropic'],
            description: 'Provider must be either OpenAI or Anthropic'
          },
          model: {
            bsonType: 'string',
            description: 'Model name is required'
          },
          projectId: {
            bsonType: 'objectId',
            description: 'Project ID is required'
          }
        }
      }
    }
  });
  
  db.createCollection('memory', {
    validator: {
      \$jsonSchema: {
        bsonType: 'object',
        required: ['agentId', 'projectId', 'messages'],
        properties: {
          agentId: {
            bsonType: 'objectId',
            description: 'Agent ID is required'
          },
          projectId: {
            bsonType: 'objectId',
            description: 'Project ID is required'
          },
          messages: {
            bsonType: 'array',
            description: 'Messages array is required'
          },
          summary: {
            bsonType: 'string'
          },
          anchors: {
            bsonType: 'array'
          }
        }
      }
    }
  });
  
  // Create indexes
  db.projects.createIndex({ name: 1 }, { unique: true });
  db.agents.createIndex({ projectId: 1, role: 1 });
  db.memory.createIndex({ agentId: 1, projectId: 1 }, { unique: true });
  
  print('Database setup complete!');
"

echo "MongoDB database setup complete!"
