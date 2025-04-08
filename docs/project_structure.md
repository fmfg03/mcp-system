# MCP System Project Structure

This document provides an overview of the MCP System codebase organization and structure.

## Directory Structure

```
mcp_system/
├── docs/                     # Documentation files
│   ├── api_documentation.md  # API reference for developers
│   ├── images/               # Documentation images
│   ├── project_structure.md  # This file
│   └── user_documentation.md # End-user guide
│
├── scripts/                  # Utility scripts
│   └── setup-db.js           # Database initialization script
│
├── src/                      # Source code
│   ├── client/               # Frontend React application
│   │   ├── __tests__/        # Frontend tests
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── styles/           # CSS and styling
│   │   ├── utils/            # Frontend utilities
│   │   ├── App.jsx           # Main React component
│   │   └── index.js          # React entry point
│   │
│   ├── server/               # Backend Node.js application
│       ├── api/              # API route handlers
│       ├── config/           # Configuration files
│       ├── integrations/     # Third-party API integrations
│       ├── models/           # MongoDB schemas
│       ├── services/         # Business logic
│       ├── utils/            # Backend utilities
│       └── server.js         # Express server entry point
│
├── tests/                    # Backend tests
│   ├── api.test.js           # API endpoint tests
│   ├── memory.test.js        # Memory system tests
│   └── utils.test.js         # Utility function tests
│
├── .env                      # Environment variables (not in repo)
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore file
├── deploy.sh                 # Deployment script
├── jest.config.js            # Jest test configuration
├── jest.setup.js             # Jest setup file
├── package.json              # NPM package configuration
├── README.md                 # Project overview
├── tailwind.config.js        # Tailwind CSS configuration
└── webpack.config.js         # Webpack configuration
```

## Key Components

### Frontend (src/client)

#### Components

- **Navbar.jsx**: Top navigation bar
- **Footer.jsx**: Page footer

#### Pages

- **Home.jsx**: Project listing and creation
- **Project.jsx**: Agent interaction interface
- **Settings.jsx**: API key management

#### Utils

- **SocketContext.jsx**: Socket.io context provider

### Backend (src/server)

#### Models

- **agent.js**: Agent schema (Claude/ChatGPT)
- **memory.js**: Memory schema for conversation storage
- **project.js**: Project schema for website projects

#### API

- **agents.js**: Agent CRUD operations
- **memory.js**: Memory management endpoints
- **projects.js**: Project CRUD operations

#### Services

- **agent_service.js**: Agent business logic
- **llm_service.js**: LLM provider communication
- **memory_service.js**: Memory management logic
- **project_service.js**: Project business logic

#### Utils

- **agent_communication.js**: Agent interaction logic
- **prompt_templates.js**: LLM prompt templates
- **socket_handler.js**: Socket.io event handlers
- **summarizer.js**: Conversation summarization
- **token_manager.js**: Token counting and optimization

#### Integrations

- **anthropic_integration.js**: Claude API integration
- **openai_integration.js**: ChatGPT API integration

## Data Flow

1. User interacts with the frontend (src/client)
2. React components dispatch actions via Socket.io or API calls
3. Backend receives requests through API routes or Socket.io events
4. Services process the requests using business logic
5. Models interact with the MongoDB database
6. Responses are sent back to the frontend
7. React components update the UI based on the responses

## Configuration

- **Environment Variables**: Stored in .env file (not in repo)
- **Development Config**: src/server/config/development.js
- **Production Config**: src/server/config/production.js

## Testing

- **Frontend Tests**: src/client/__tests__/
- **Backend Tests**: tests/
- **Test Configuration**: jest.config.js and jest.setup.js

## Deployment

- **Deployment Script**: deploy.sh
- **Database Setup**: scripts/setup-db.js

## Documentation

- **README.md**: Project overview
- **docs/user_documentation.md**: End-user guide
- **docs/api_documentation.md**: API reference
- **docs/project_structure.md**: This file
