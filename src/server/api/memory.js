const express = require('express');
const router = express.Router();
const Memory = require('../models/memory');

/**
 * GET /api/memory
 * Get memory for a specific agent and project
 */
router.get('/', async (req, res) => {
  try {
    const { agentId, projectId } = req.query;
    
    if (!agentId || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Agent ID and Project ID are required'
      });
    }
    
    let memory = await Memory.findOne({ agentId, projectId });
    
    // If memory doesn't exist, create a new one
    if (!memory) {
      memory = new Memory({
        agentId,
        projectId,
        messages: [],
        summary: '',
        tokenCount: 0,
        anchors: []
      });
      
      await memory.save();
    }
    
    return res.status(200).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Error fetching memory:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * POST /api/memory/message
 * Add a new message to memory
 */
router.post('/message', async (req, res) => {
  try {
    const { agentId, projectId, role, content } = req.body;
    
    if (!agentId || !projectId || !role || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    let memory = await Memory.findOne({ agentId, projectId });
    
    // If memory doesn't exist, create a new one
    if (!memory) {
      memory = new Memory({
        agentId,
        projectId,
        messages: [],
        summary: '',
        tokenCount: 0,
        anchors: []
      });
    }
    
    // Add new message
    memory.messages.push({
      role,
      content,
      timestamp: new Date()
    });
    
    // Update token count (simplified estimation)
    const estimatedTokens = Math.ceil(content.length / 4);
    memory.tokenCount += estimatedTokens;
    
    await memory.save();
    
    return res.status(201).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Error adding message to memory:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * POST /api/memory/summary
 * Update memory summary
 */
router.post('/summary', async (req, res) => {
  try {
    const { agentId, projectId, summary } = req.body;
    
    if (!agentId || !projectId || !summary) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    let memory = await Memory.findOne({ agentId, projectId });
    
    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found'
      });
    }
    
    memory.summary = summary;
    memory.summaryTimestamp = new Date();
    
    await memory.save();
    
    return res.status(200).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Error updating memory summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * POST /api/memory/anchor
 * Add or update a memory anchor
 */
router.post('/anchor', async (req, res) => {
  try {
    const { agentId, projectId, key, value } = req.body;
    
    if (!agentId || !projectId || !key || !value) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    let memory = await Memory.findOne({ agentId, projectId });
    
    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found'
      });
    }
    
    // Check if anchor with this key already exists
    const existingAnchorIndex = memory.anchors.findIndex(anchor => anchor.key === key);
    
    if (existingAnchorIndex !== -1) {
      // Update existing anchor
      memory.anchors[existingAnchorIndex].value = value;
    } else {
      // Add new anchor
      memory.anchors.push({ key, value });
    }
    
    await memory.save();
    
    return res.status(200).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Error adding/updating memory anchor:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * DELETE /api/memory/clear
 * Clear memory for an agent and project
 */
router.delete('/clear', async (req, res) => {
  try {
    const { agentId, projectId } = req.query;
    
    if (!agentId || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Agent ID and Project ID are required'
      });
    }
    
    let memory = await Memory.findOne({ agentId, projectId });
    
    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found'
      });
    }
    
    // Clear messages but keep anchors
    memory.messages = [];
    memory.summary = '';
    memory.summaryTimestamp = null;
    memory.tokenCount = 0;
    
    await memory.save();
    
    return res.status(200).json({
      success: true,
      message: 'Memory cleared successfully',
      data: memory
    });
  } catch (error) {
    console.error('Error clearing memory:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
