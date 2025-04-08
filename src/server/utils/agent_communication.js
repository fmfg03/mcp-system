/**
 * Agent Communication Interface
 * Handles communication between LLM agents (Claude and ChatGPT)
 */

const agentService = require('../services/agent_service');
const memoryService = require('../services/memory_service');
const llmService = require('../services/llm_service');
const promptTemplates = require('../utils/prompt_templates');

class AgentCommunicationInterface {
  /**
   * Send a message to an agent and get a response
   * @param {string} agentId - Agent ID
   * @param {string} message - User message
   * @returns {Promise} - Promise resolving to the agent response
   */
  async sendMessageToAgent(agentId, message) {
    try {
      // Get agent details
      const agentResult = await agentService.getAgent(agentId);
      if (!agentResult.success) {
        return agentResult;
      }
      const agent = agentResult.data;
      
      // Add user message to memory
      await memoryService.addMessage(agentId, agent.projectId, 'user', message);
      
      // Get formatted messages for LLM request
      const messagesResult = await memoryService.getFormattedMessages(agentId, agent.projectId);
      if (!messagesResult.success) {
        return messagesResult;
      }
      
      // Send request to LLM
      const llmResponse = await llmService.sendRequest(agent, messagesResult.data);
      if (!llmResponse.success) {
        return llmResponse;
      }
      
      // Add assistant response to memory
      await memoryService.addMessage(agentId, agent.projectId, 'assistant', llmResponse.message);
      
      return {
        success: true,
        data: {
          agentId: agent._id,
          agentName: agent.name,
          role: agent.role,
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
  
  /**
   * Switch agent roles and notify both agents
   * @param {string} projectId - Project ID
   * @returns {Promise} - Promise resolving to the updated agents
   */
  async switchAgentRoles(projectId) {
    try {
      // Get project agents
      const agentsResult = await agentService.getProjectAgents(projectId);
      if (!agentsResult.success) {
        return agentsResult;
      }
      const agents = agentsResult.data;
      
      if (agents.length !== 2) {
        return {
          success: false,
          error: 'Project must have exactly two agents to switch roles'
        };
      }
      
      // Store original roles
      const originalRoles = agents.map(agent => ({
        id: agent._id,
        name: agent.name,
        role: agent.role
      }));
      
      // Switch roles for both agents
      for (const agent of agents) {
        await agentService.switchAgentRole(agent._id);
      }
      
      // Get updated agents
      const updatedAgentsResult = await agentService.getProjectAgents(projectId);
      if (!updatedAgentsResult.success) {
        return updatedAgentsResult;
      }
      const updatedAgents = updatedAgentsResult.data;
      
      // Notify each agent of their role change
      for (const agent of updatedAgents) {
        const originalRole = originalRoles.find(r => r.id.toString() === agent._id.toString()).role;
        const roleChangeMessage = promptTemplates.getRoleSwitchingPrompt(originalRole, agent.role);
        
        await memoryService.addMessage(agent._id, projectId, 'system', roleChangeMessage);
      }
      
      return {
        success: true,
        data: {
          agents: updatedAgents,
          message: 'Agent roles switched successfully'
        }
      };
    } catch (error) {
      console.error('Error switching agent roles:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get the current builder and judge agents for a project
   * @param {string} projectId - Project ID
   * @returns {Promise} - Promise resolving to the builder and judge agents
   */
  async getProjectAgentsByRole(projectId) {
    try {
      // Get project agents
      const agentsResult = await agentService.getProjectAgents(projectId);
      if (!agentsResult.success) {
        return agentsResult;
      }
      const agents = agentsResult.data;
      
      if (agents.length !== 2) {
        return {
          success: false,
          error: 'Project must have exactly two agents'
        };
      }
      
      // Find builder and judge
      const builder = agents.find(agent => agent.role === 'Builder');
      const judge = agents.find(agent => agent.role === 'Judge');
      
      if (!builder || !judge) {
        return {
          success: false,
          error: 'Could not find both Builder and Judge agents'
        };
      }
      
      return {
        success: true,
        data: {
          builder,
          judge
        }
      };
    } catch (error) {
      console.error('Error getting project agents by role:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Facilitate a conversation between builder and judge
   * @param {string} projectId - Project ID
   * @param {string} userMessage - Initial user message
   * @returns {Promise} - Promise resolving to the conversation results
   */
  async facilitateAgentConversation(projectId, userMessage) {
    try {
      // Get builder and judge agents
      const agentsResult = await this.getProjectAgentsByRole(projectId);
      if (!agentsResult.success) {
        return agentsResult;
      }
      const { builder, judge } = agentsResult.data;
      
      // Send initial message to builder
      const builderResponse = await this.sendMessageToAgent(builder._id, userMessage);
      if (!builderResponse.success) {
        return builderResponse;
      }
      
      // Send builder's response to judge
      const judgePrompt = `Please review and critique the following proposal from the Builder:\n\n${builderResponse.data.message}`;
      const judgeResponse = await this.sendMessageToAgent(judge._id, judgePrompt);
      if (!judgeResponse.success) {
        return judgeResponse;
      }
      
      return {
        success: true,
        data: {
          builder: {
            id: builder._id,
            name: builder.name,
            message: builderResponse.data.message
          },
          judge: {
            id: judge._id,
            name: judge.name,
            message: judgeResponse.data.message
          }
        }
      };
    } catch (error) {
      console.error('Error facilitating agent conversation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new AgentCommunicationInterface();
