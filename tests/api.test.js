const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server/server');
const Agent = require('../src/server/models/agent');
const Project = require('../src/server/models/project');

// Mock data
const mockProject = {
  name: 'Test Project',
  description: 'A test project for API testing',
  type: 'static',
  techStack: {
    frontend: 'HTML/CSS/JS',
    css: 'Tailwind',
    javascript: 'Vanilla JS'
  }
};

const mockAgent = {
  name: 'Claude',
  role: 'Builder',
  provider: 'Anthropic',
  model: 'claude-3-opus',
  systemPrompt: 'You are a builder agent',
  contextWindow: 100000,
  maxTokens: 4000,
  temperature: 0.7
};

describe('Project API Endpoints', () => {
  let projectId;

  // Connect to test database before tests
  beforeAll(async () => {
    // Use a test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mcp_system_test';
    await mongoose.connect(mongoUri);
  });

  // Clean up database after tests
  afterAll(async () => {
    await Project.deleteMany({});
    await Agent.deleteMany({});
    await mongoose.connection.close();
  });

  // Test creating a project
  test('POST /api/projects - Create a new project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send(mockProject)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(mockProject.name);
    expect(response.body.data.description).toBe(mockProject.description);
    expect(response.body.data.type).toBe(mockProject.type);

    // Save project ID for later tests
    projectId = response.body.data._id;
  });

  // Test getting all projects
  test('GET /api/projects - Get all projects', async () => {
    const response = await request(app)
      .get('/api/projects')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // Test getting a specific project
  test('GET /api/projects/:id - Get a specific project', async () => {
    const response = await request(app)
      .get(`/api/projects/${projectId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(projectId);
    expect(response.body.data.name).toBe(mockProject.name);
  });

  // Test updating a project
  test('PUT /api/projects/:id - Update a project', async () => {
    const updatedData = {
      name: 'Updated Project Name',
      status: 'in_progress'
    };

    const response = await request(app)
      .put(`/api/projects/${projectId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(updatedData.name);
    expect(response.body.data.status).toBe(updatedData.status);
  });

  // Test updating project status
  test('POST /api/projects/:id/update-status - Update project status', async () => {
    const response = await request(app)
      .post(`/api/projects/${projectId}/update-status`)
      .send({ status: 'completed' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('completed');
  });
});

describe('Agent API Endpoints', () => {
  let projectId;
  let agentId;

  // Set up test data
  beforeAll(async () => {
    // Create a test project
    const project = await Project.create(mockProject);
    projectId = project._id;
    
    // Add project ID to mock agent
    mockAgent.projectId = projectId;
  });

  // Clean up after tests
  afterAll(async () => {
    await Project.deleteMany({});
    await Agent.deleteMany({});
  });

  // Test creating an agent
  test('POST /api/agents - Create a new agent', async () => {
    const response = await request(app)
      .post('/api/agents')
      .send(mockAgent)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(mockAgent.name);
    expect(response.body.data.role).toBe(mockAgent.role);
    expect(response.body.data.provider).toBe(mockAgent.provider);
    expect(response.body.data.projectId.toString()).toBe(projectId.toString());

    // Save agent ID for later tests
    agentId = response.body.data._id;
  });

  // Test getting agents for a project
  test('GET /api/agents - Get agents for a project', async () => {
    const response = await request(app)
      .get('/api/agents')
      .query({ projectId: projectId.toString() })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // Test getting a specific agent
  test('GET /api/agents/:id - Get a specific agent', async () => {
    const response = await request(app)
      .get(`/api/agents/${agentId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(agentId);
    expect(response.body.data.name).toBe(mockAgent.name);
  });

  // Test updating an agent
  test('PUT /api/agents/:id - Update an agent', async () => {
    const updatedData = {
      temperature: 0.8,
      maxTokens: 2000
    };

    const response = await request(app)
      .put(`/api/agents/${agentId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.temperature).toBe(updatedData.temperature);
    expect(response.body.data.maxTokens).toBe(updatedData.maxTokens);
  });

  // Test switching agent role
  test('POST /api/agents/:id/switch-role - Switch agent role', async () => {
    const response = await request(app)
      .post(`/api/agents/${agentId}/switch-role`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.role).toBe('Judge'); // Should switch from Builder to Judge
  });
});
