const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server/server');
const Memory = require('../src/server/models/memory');
const Agent = require('../src/server/models/agent');
const Project = require('../src/server/models/project');

// Mock data
const mockProject = {
  name: 'Memory Test Project',
  description: 'A test project for memory API testing',
  type: 'static'
};

const mockAgent = {
  name: 'Test Agent',
  role: 'Builder',
  provider: 'OpenAI',
  model: 'gpt-4',
  systemPrompt: 'You are a test agent'
};

const mockMessage = {
  role: 'user',
  content: 'This is a test message'
};

describe('Memory API Endpoints', () => {
  let projectId;
  let agentId;
  let memoryId;

  // Connect to test database before tests
  beforeAll(async () => {
    // Use a test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mcp_system_test';
    await mongoose.connect(mongoUri);
    
    // Create test project and agent
    const project = await Project.create(mockProject);
    projectId = project._id;
    
    mockAgent.projectId = projectId;
    const agent = await Agent.create(mockAgent);
    agentId = agent._id;
  });

  // Clean up database after tests
  afterAll(async () => {
    await Memory.deleteMany({});
    await Agent.deleteMany({});
    await Project.deleteMany({});
    await mongoose.connection.close();
  });

  // Test creating a memory
  test('POST /api/memory - Create a new memory', async () => {
    const memoryData = {
      agentId,
      projectId,
      messages: [mockMessage]
    };

    const response = await request(app)
      .post('/api/memory')
      .send(memoryData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.agentId.toString()).toBe(agentId.toString());
    expect(response.body.data.projectId.toString()).toBe(projectId.toString());
    expect(response.body.data.messages.length).toBe(1);
    expect(response.body.data.messages[0].role).toBe(mockMessage.role);
    expect(response.body.data.messages[0].content).toBe(mockMessage.content);

    // Save memory ID for later tests
    memoryId = response.body.data._id;
  });

  // Test getting memory for an agent
  test('GET /api/memory/:agentId - Get memory for an agent', async () => {
    const response = await request(app)
      .get(`/api/memory/${agentId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.agentId.toString()).toBe(agentId.toString());
    expect(response.body.data.messages.length).toBe(1);
  });

  // Test adding a message to memory
  test('POST /api/memory/:agentId/messages - Add message to memory', async () => {
    const newMessage = {
      role: 'assistant',
      content: 'This is a response message'
    };

    const response = await request(app)
      .post(`/api/memory/${agentId}/messages`)
      .send(newMessage)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.messages.length).toBe(2);
    expect(response.body.data.messages[1].role).toBe(newMessage.role);
    expect(response.body.data.messages[1].content).toBe(newMessage.content);
  });

  // Test updating memory summary
  test('POST /api/memory/:agentId/summary - Update memory summary', async () => {
    const summaryData = {
      summary: 'This is a test summary of the conversation'
    };

    const response = await request(app)
      .post(`/api/memory/${agentId}/summary`)
      .send(summaryData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.summary).toBe(summaryData.summary);
  });

  // Test adding memory anchors
  test('POST /api/memory/:agentId/anchors - Add memory anchors', async () => {
    const anchorsData = {
      anchors: ['Project goal: Create a website', 'Tech stack: React, Node.js']
    };

    const response = await request(app)
      .post(`/api/memory/${agentId}/anchors`)
      .send(anchorsData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.anchors.length).toBe(2);
    expect(response.body.data.anchors).toContain(anchorsData.anchors[0]);
    expect(response.body.data.anchors).toContain(anchorsData.anchors[1]);
  });

  // Test clearing memory messages
  test('DELETE /api/memory/:agentId/messages - Clear memory messages', async () => {
    const response = await request(app)
      .delete(`/api/memory/${agentId}/messages`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.messages.length).toBe(0);
    // Summary and anchors should still exist
    expect(response.body.data.summary).toBeTruthy();
    expect(response.body.data.anchors.length).toBe(2);
  });
});
