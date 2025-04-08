/**
 * Agent Service
 * Handles agent management and communication
 */
const Agent = require('../models/agent');
const Memory = require('../models/memory');
const llmService = require('./llm_service');
const memoryService = require('./memory_service');

class AgentService {
  /**
   * Create a new agent
   * @param {Object} agentData - Agent configuration data
   * @returns {Promise} - Promise resolving to the created agent
   */
  async createAgent(agentData) {
    try {
      const newAgent = new Agent(agentData);
      const savedAgent = await newAgent.save();
      
      // Initialize memory for the new agent
      await memoryService.initializeMemory(savedAgent._id, agentData.projectId);
      
      return {
        success: true,
        data: savedAgent
      };
    } catch (error) {
      console.error('Error creating agent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get an agent by ID
   * @param {string} agentId - Agent ID
   * @returns {Promise} - Promise resolving to the agent
   */
  async getAgent(agentId) {
    try {
      const agent = await Agent.findById(agentId);
      
      if (!agent) {
        return {
          success: false,
          error: 'Agent not found'
        };
      }
      
      return {
        success: true,
        data: agent
      };
    } catch (error) {
      console.error('Error getting agent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get all agents for a project
   * @param {string} projectId - Project ID
   * @returns {Promise} - Promise resolving to an array of agents
   */
  async getProjectAgents(projectId) {
    try {
      const agents = await Agent.find({ projectId });
      
      return {
        success: true,
        data: agents
      };
    } catch (error) {
      console.error('Error getting project agents:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Update an agent
   * @param {string} agentId - Agent ID
   * @param {Object} updateData - Data to update
   * @returns {Promise} - Promise resolving to the updated agent
   */
  async updateAgent(agentId, updateData) {
    try {
      const agent = await Agent.findById(agentId);
      
      if (!agent) {
        return {
          success: false,
          error: 'Agent not found'
        };
      }
      
      // Update fields
      Object.keys(updateData).forEach(key => {
        if (key in agent) {
          agent[key] = updateData[key];
        }
      });
      
      const updatedAgent = await agent.save();
      
      return {
        success: true,
        data: updatedAgent
      };
    } catch (error) {
      console.error('Error updating agent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Switch agent role
   * @param {string} agentId - Agent ID
   * @returns {Promise} - Promise resolving to the updated agent
   */
  async switchAgentRole(agentId) {
    try {
      const agent = await Agent.findById(agentId);
      
      if (!agent) {
        return {
          success: false,
          error: 'Agent not found'
        };
      }
      
      // Toggle role between Builder and Judge
      agent.role = agent.role === 'Builder' ? 'Judge' : 'Builder';
      
      const updatedAgent = await agent.save();
      
      return {
        success: true,
        data: updatedAgent
      };
    } catch (error) {
      console.error('Error switching agent role:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Delete an agent
   * @param {string} agentId - Agent ID
   * @returns {Promise} - Promise resolving to success status
   */
  async deleteAgent(agentId) {
    try {
      const agent = await Agent.findById(agentId);
      
      if (!agent) {
        return {
          success: false,
          error: 'Agent not found'
        };
      }
      
      await Agent.deleteOne({ _id: agentId });
      
      // Delete associated memory
      await Memory.deleteOne({ agentId });
      
      return {
        success: true,
        message: 'Agent deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting agent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Send a message to an agent and get a response
   * @param {string} agentId - Agent ID
   * @param {string} message - User message
   * @returns {Promise} - Promise resolving to the agent response
   */
  async sendMessage(agentId, message) {
    try {
      const agent = await Agent.findById(agentId);
      
      if (!agent) {
        return {
          success: false,
          error: 'Agent not found'
        };
      }
      
      // Get agent memory
      const memoryResult = await memoryService.getMemory(agentId, agent.projectId);
      
      if (!memoryResult.success) {
        return memoryResult;
      }
      
      const memory = memoryResult.data;
      
      // Add user message to memory
      await memoryService.addMessage(agentId, agent.projectId, 'user', message);
      
      // Prepare messages for LLM request
      const messages = [
        { role: 'system', content: agent.systemPrompt },
        ...memory.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];
      
      // Send request to LLM
      const llmResponse = await llmService.sendRequest(agent, messages);
      
      if (!llmResponse.success) {
        return llmResponse;
      }
      
      // Add assistant response to memory
      await memoryService.addMessage(agentId, agent.projectId, 'assistant', llmResponse.message);
      
      return {
        success: true,
        data: {
          message: llmResponse.message,
          usage: llmResponse.usage
        }
      };
    } catch (error) {
      console.error('Error sending message to agent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new AgentService();
