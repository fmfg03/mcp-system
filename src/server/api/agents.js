const express = require('express');
const router = express.Router();
const Agent = require('../models/agent');

/**
 * GET /api/agents
 * Get all agents for a project
 */
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }
    
    const agents = await Agent.find({ projectId });
    
    return res.status(200).json({
      success: true,
      data: agents
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * GET /api/agents/:id
 * Get a specific agent by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * POST /api/agents
 * Create a new agent
 */
router.post('/', async (req, res) => {
  try {
    const { name, role, provider, model, systemPrompt, contextWindow, maxTokens, temperature, projectId } = req.body;
    
    // Validate required fields
    if (!name || !role || !provider || !model || !systemPrompt || !contextWindow || !maxTokens || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const newAgent = new Agent({
      name,
      role,
      provider,
      model,
      systemPrompt,
      contextWindow,
      maxTokens,
      temperature: temperature || 0.7,
      projectId
    });
    
    const savedAgent = await newAgent.save();
    
    return res.status(201).json({
      success: true,
      data: savedAgent
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * PUT /api/agents/:id
 * Update an existing agent
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, role, provider, model, systemPrompt, contextWindow, maxTokens, temperature } = req.body;
    
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    // Update fields if provided
    if (name) agent.name = name;
    if (role) agent.role = role;
    if (provider) agent.provider = provider;
    if (model) agent.model = model;
    if (systemPrompt) agent.systemPrompt = systemPrompt;
    if (contextWindow) agent.contextWindow = contextWindow;
    if (maxTokens) agent.maxTokens = maxTokens;
    if (temperature !== undefined) agent.temperature = temperature;
    
    const updatedAgent = await agent.save();
    
    return res.status(200).json({
      success: true,
      data: updatedAgent
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * DELETE /api/agents/:id
 * Delete an agent
 */
router.delete('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    await agent.remove();
    
    return res.status(200).json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * POST /api/agents/:id/switch-role
 * Switch the role of an agent
 */
router.post('/:id/switch-role', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    // Toggle role between Builder and Judge
    agent.role = agent.role === 'Builder' ? 'Judge' : 'Builder';
    
    const updatedAgent = await agent.save();
    
    return res.status(200).json({
      success: true,
      data: updatedAgent
    });
  } catch (error) {
    console.error('Error switching agent role:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
