# MCP System API Documentation

## Overview

The MCP System API provides programmatic access to the Multi-Client Protocol system, allowing developers to integrate with and extend the platform's capabilities. This documentation covers all available endpoints, request/response formats, and authentication requirements.

## Base URL

All API endpoints are relative to the base URL:

```
https://your-mcp-system-domain.com/api
```

For local development:

```
http://localhost:3000/api
```

## Authentication

API requests require authentication using an API key. Include your API key in the request header:

```
Authorization: Bearer YOUR_API_KEY
```

## Projects API

### Get All Projects

Retrieves a list of all projects.

**Endpoint:** `GET /projects`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "project_id",
      "name": "Project Name",
      "description": "Project description",
      "type": "static",
      "status": "in_progress",
      "techStack": {
        "css": "Tailwind",
        "javascript": "Vanilla JS"
      },
      "createdAt": "2025-04-01T12:00:00.000Z",
      "updatedAt": "2025-04-01T12:00:00.000Z"
    }
  ]
}
```

### Get Project by ID

Retrieves a specific project by ID.

**Endpoint:** `GET /projects/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "project_id",
    "name": "Project Name",
    "description": "Project description",
    "type": "static",
    "status": "in_progress",
    "techStack": {
      "css": "Tailwind",
      "javascript": "Vanilla JS"
    },
    "createdAt": "2025-04-01T12:00:00.000Z",
    "updatedAt": "2025-04-01T12:00:00.000Z"
  }
}
```

### Create Project

Creates a new project.

**Endpoint:** `POST /projects`

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "type": "static",
  "techStack": {
    "css": "Tailwind",
    "javascript": "Vanilla JS"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_project_id",
    "name": "New Project",
    "description": "Project description",
    "type": "static",
    "status": "planning",
    "techStack": {
      "css": "Tailwind",
      "javascript": "Vanilla JS"
    },
    "createdAt": "2025-04-01T12:00:00.000Z",
    "updatedAt": "2025-04-01T12:00:00.000Z"
  }
}
```

### Update Project

Updates an existing project.

**Endpoint:** `PUT /projects/:id`

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "status": "completed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "project_id",
    "name": "Updated Project Name",
    "description": "Project description",
    "type": "static",
    "status": "completed",
    "techStack": {
      "css": "Tailwind",
      "javascript": "Vanilla JS"
    },
    "createdAt": "2025-04-01T12:00:00.000Z",
    "updatedAt": "2025-04-01T12:30:00.000Z"
  }
}
```

### Delete Project

Deletes a project.

**Endpoint:** `DELETE /projects/:id`

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

## Agents API

### Get All Agents

Retrieves all agents for a project.

**Endpoint:** `GET /agents?projectId=project_id`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "agent_id_1",
      "name": "Claude",
      "role": "Builder",
      "provider": "Anthropic",
      "model": "claude-3-opus",
      "projectId": "project_id",
      "createdAt": "2025-04-01T12:00:00.000Z",
      "updatedAt": "2025-04-01T12:00:00.000Z"
    },
    {
      "_id": "agent_id_2",
      "name": "ChatGPT",
      "role": "Judge",
      "provider": "OpenAI",
      "model": "gpt-4",
      "projectId": "project_id",
      "createdAt": "2025-04-01T12:00:00.000Z",
      "updatedAt": "2025-04-01T12:00:00.000Z"
    }
  ]
}
```

### Get Agent by ID

Retrieves a specific agent by ID.

**Endpoint:** `GET /agents/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "agent_id",
    "name": "Claude",
    "role": "Builder",
    "provider": "Anthropic",
    "model": "claude-3-opus",
    "projectId": "project_id",
    "createdAt": "2025-04-01T12:00:00.000Z",
    "updatedAt": "2025-04-01T12:00:00.000Z"
  }
}
```

### Create Agent

Creates a new agent.

**Endpoint:** `POST /agents`

**Request Body:**
```json
{
  "name": "Claude",
  "role": "Builder",
  "provider": "Anthropic",
  "model": "claude-3-opus",
  "projectId": "project_id",
  "systemPrompt": "You are a builder agent"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_agent_id",
    "name": "Claude",
    "role": "Builder",
    "provider": "Anthropic",
    "model": "claude-3-opus",
    "projectId": "project_id",
    "systemPrompt": "You are a builder agent",
    "createdAt": "2025-04-01T12:00:00.000Z",
    "updatedAt": "2025-04-01T12:00:00.000Z"
  }
}
```

### Update Agent

Updates an existing agent.

**Endpoint:** `PUT /agents/:id`

**Request Body:**
```json
{
  "temperature": 0.8,
  "maxTokens": 2000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "agent_id",
    "name": "Claude",
    "role": "Builder",
    "provider": "Anthropic",
    "model": "claude-3-opus",
    "projectId": "project_id",
    "temperature": 0.8,
    "maxTokens": 2000,
    "createdAt": "2025-04-01T12:00:00.000Z",
    "updatedAt": "2025-04-01T12:30:00.000Z"
  }
}
```

### Switch Agent Role

Switches an agent's role between Builder and Judge.

**Endpoint:** `POST /agents/:id/switch-role`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "agent_id",
    "name": "Claude",
    "role": "Judge", // Changed from Builder to Judge
    "provider": "Anthropic",
    "model": "claude-3-opus",
    "projectId": "project_id",
    "createdAt": "2025-04-01T12:00:00.000Z",
    "updatedAt": "2025-04-01T12:30:00.000Z"
  }
}
```

## Memory API

### Get Memory for Agent

Retrieves memory for a specific agent.

**Endpoint:** `GET /memory/:agentId`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "memory_id",
    "agentId": "agent_id",
    "projectId": "project_id",
    "messages": [
      {
        "role": "user",
        "content": "User message",
        "timestamp": "2025-04-01T12:00:00.000Z"
      },
      {
        "role": "assistant",
        "content": "Assistant response",
        "timestamp": "2025-04-01T12:01:00.000Z"
      }
    ],
    "summary": "Conversation summary",
    "anchors": [
      "Project goal: Create a website",
      "Tech stack: React, Node.js"
    ],
    "createdAt": "2025-04-01T12:00:00.000Z",
    "updatedAt": "2025-04-01T12:01:00.000Z"
  }
}
```

### Add Message to Memory

Adds a message to an agent's memory.

**Endpoint:** `POST /memory/:agentId/messages`

**Request Body:**
```json
{
  "role": "user",
  "content": "New message content"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "memory_id",
    "agentId": "agent_id",
    "projectId": "project_id",
    "messages": [
      // Previous messages...
      {
        "role": "user",
        "content": "New message content",
        "timestamp": "2025-04-01T12:10:00.000Z"
      }
    ],
    "updatedAt": "2025-04-01T12:10:00.000Z"
  }
}
```

### Update Memory Summary

Updates the summary for an agent's memory.

**Endpoint:** `POST /memory/:agentId/summary`

**Request Body:**
```json
{
  "summary": "Updated conversation summary"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "memory_id",
    "agentId": "agent_id",
    "projectId": "project_id",
    "summary": "Updated conversation summary",
    "updatedAt": "2025-04-01T12:15:00.000Z"
  }
}
```

### Add Memory Anchors

Adds memory anchors for an agent.

**Endpoint:** `POST /memory/:agentId/anchors`

**Request Body:**
```json
{
  "anchors": [
    "Project goal: Create a website",
    "Tech stack: React, Node.js"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "memory_id",
    "agentId": "agent_id",
    "projectId": "project_id",
    "anchors": [
      "Project goal: Create a website",
      "Tech stack: React, Node.js"
    ],
    "updatedAt": "2025-04-01T12:20:00.000Z"
  }
}
```

### Clear Memory Messages

Clears all messages from an agent's memory.

**Endpoint:** `DELETE /memory/:agentId/messages`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "memory_id",
    "agentId": "agent_id",
    "projectId": "project_id",
    "messages": [],
    "updatedAt": "2025-04-01T12:25:00.000Z"
  }
}
```

## WebSocket Events

The MCP System uses Socket.io for real-time communication. Here are the available events:

### Client Events (Emit to Server)

- `join:project` - Join a project room
  ```javascript
  socket.emit('join:project', projectId);
  ```

- `agent:message` - Send a message to an agent
  ```javascript
  socket.emit('agent:message', {
    agentId: 'agent_id',
    message: 'User message'
  });
  ```

- `agent:switch_roles` - Switch agent roles
  ```javascript
  socket.emit('agent:switch_roles', {
    projectId: 'project_id'
  });
  ```

- `conversation:start` - Start a conversation between agents
  ```javascript
  socket.emit('conversation:start', {
    projectId: 'project_id',
    message: 'User message'
  });
  ```

### Server Events (Listen From Server)

- `agent:processing` - Agent is processing a message
  ```javascript
  socket.on('agent:processing', (data) => {
    console.log(`Agent ${data.agentId} is processing`);
  });
  ```

- `agent:response` - Agent has responded
  ```javascript
  socket.on('agent:response', (data) => {
    console.log(`Agent ${data.agentName} (${data.role}): ${data.message}`);
  });
  ```

- `roles:switching` - Agent roles are being switched
  ```javascript
  socket.on('roles:switching', (data) => {
    console.log(`Switching roles for project ${data.projectId}`);
  });
  ```

- `roles:switched` - Agent roles have been switched
  ```javascript
  socket.on('roles:switched', (data) => {
    console.log('Roles switched:', data.agents);
  });
  ```

- `conversation:processing` - Conversation is being processed
  ```javascript
  socket.on('conversation:processing', (data) => {
    console.log(`Processing conversation for project ${data.projectId}`);
  });
  ```

- `conversation:completed` - Conversation has completed
  ```javascript
  socket.on('conversation:completed', (data) => {
    console.log('Builder:', data.builder.message);
    console.log('Judge:', data.judge.message);
  });
  ```

- `error` - Error occurred
  ```javascript
  socket.on('error', (data) => {
    console.error('Error:', data.message);
  });
  ```

## Error Handling

All API endpoints return a consistent error format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are rate-limited to 100 requests per minute per API key. If you exceed this limit, you'll receive a 429 Too Many Requests response.

## Versioning

The current API version is v1. The version is included in the URL path:

```
/api/v1/projects
```

Future API versions will be announced with appropriate migration guides.
