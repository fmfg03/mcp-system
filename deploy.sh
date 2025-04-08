#!/bin/bash

# MCP System Deployment Script
# This script sets up and deploys the MCP system

# Exit on error
set -e

echo "Starting MCP System deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v20 or later."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "Node.js version 20 or later is required. Current version: $(node -v)"
    exit 1
fi

# Check if MongoDB is installed and running
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Please install MongoDB."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x mongod > /dev/null; then
    echo "MongoDB is not running. Please start MongoDB."
    exit 1
fi

# Check if Redis is installed and running
if ! command -v redis-cli &> /dev/null; then
    echo "Redis is not installed. Please install Redis."
    exit 1
fi

# Check if Redis is running
if ! pgrep -x redis-server > /dev/null; then
    echo "Redis is not running. Please start Redis."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# MCP System Environment Variables
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mcp_system
REDIS_URL=redis://localhost:6379

# OpenAI API Key (replace with your actual key)
OPENAI_API_KEY=your_openai_api_key

# Anthropic API Key (replace with your actual key)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Session Secret
SESSION_SECRET=$(openssl rand -hex 32)
EOF
    echo ".env file created. Please update with your API keys."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Run database migrations if needed
echo "Running database setup..."
node scripts/setup-db.js

# Run tests to ensure everything is working
echo "Running tests..."
npm test

# Start the application
echo "Starting MCP System..."
npm start

echo "MCP System deployment complete!"
echo "The system is now running at http://localhost:3000"
echo "Press Ctrl+C to stop the server."
