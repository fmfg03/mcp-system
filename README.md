# MCP System - Multi-Client Protocol for LLM Collaboration

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2020.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green.svg)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-6.0%2B-red.svg)](https://redis.io/)

## Overview

MCP System is a collaborative website development platform that leverages Claude and ChatGPT as autonomous agents. The system enables structured, persistent dialogue between these LLMs, with one acting as a Builder to generate code and design solutions, and the other as a Judge to evaluate and critique the Builder's work.

![MCP System Screenshot](docs/images/mcp-system-screenshot.png)

## Features

- **Dual-Agent Architecture**: Utilizes both Claude and ChatGPT in complementary roles
- **Role Switching**: Dynamically swap Builder and Judge roles between LLMs
- **Persistent Memory**: Maintains conversation history and context across sessions
- **Token Optimization**: Intelligently manages context windows for optimal performance
- **Real-time Communication**: Socket.io integration for immediate agent responses
- **Project Management**: Create and manage multiple website development projects
- **Responsive UI**: Modern interface that works across desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js v20 or later
- MongoDB (running locally or accessible via connection string)
- Redis (running locally or accessible via connection string)
- API keys for OpenAI and Anthropic

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/mcp-system.git
   cd mcp-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mcp_system
   REDIS_URL=redis://localhost:6379
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   SESSION_SECRET=your_session_secret
   ```

4. Set up the database:
   ```
   node scripts/setup-db.js
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Access the application at http://localhost:3000

### Deployment

For production deployment:

1. Run the deployment script:
   ```
   ./deploy.sh
   ```

2. Follow the prompts to configure your production environment.

## Architecture

The MCP System is built with a modern tech stack:

- **Backend**: Node.js with Express
- **Frontend**: React with Tailwind CSS
- **Database**: MongoDB for persistent storage
- **Cache**: Redis for session management and memory optimization
- **Real-time Communication**: Socket.io for agent interactions
- **LLM Integration**: OpenAI and Anthropic APIs

The system follows a modular architecture:

- **Server**: Express application with RESTful API endpoints
- **Client**: React SPA with component-based UI
- **Models**: MongoDB schemas for Projects, Agents, and Memory
- **Services**: Business logic for agent communication and memory management
- **Utils**: Helper functions for token management and summarization

## Documentation

- [User Documentation](docs/user_documentation.md) - Guide for end users
- [API Documentation](docs/api_documentation.md) - Reference for developers
- [Project Structure](docs/project_structure.md) - Overview of codebase organization

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build production-ready frontend assets
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run lint` - Run ESLint to check code quality

### Testing

The MCP System includes comprehensive tests:

- **Unit Tests**: For individual components and utilities
- **Integration Tests**: For API endpoints and database operations
- **End-to-End Tests**: For complete user flows

Run tests with:
```
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for the ChatGPT API
- Anthropic for the Claude API
- The open-source community for the amazing tools and libraries

## Contact

For questions or support, please open an issue on this repository or contact the maintainers at support@mcp-system.com.
