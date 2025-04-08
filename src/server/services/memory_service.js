/**
 * Memory Service
 * Handles memory management for agents
 */
const Memory = require('../models/memory');
const Agent = require('../models/agent');
const tokenManager = require('../utils/token_manager');
const summarizer = require('../utils/summarizer');
const promptTemplates = require('../utils/prompt_templates');
const config = process.env.NODE_ENV === 'production' 
  ? require('../config/production')
  : require('../config/development');

class MemoryService {
  /**
   * Initialize memory for an agent
   * @param {string} agentId - Agent ID
   * @param {string} projectId - Project ID
   * @returns {Promise} - Promise resolving to the initialized memory
   */
  async initializeMemory(agentId, projectId) {
    try {
      // Check if memory already exists
      let memory = await Memory.findOne({ agentId, projectId });
      
      if (memory) {
        return {
          success: true,
          data: memory
        };
      }
      
      // Create new memory
      memory = new Memory({
        agentId,
        projectId,
        messages: [],
        summary: '',
        tokenCount: 0,
        anchors: []
      });
      
      const savedMemory = await memory.save();
      
      return {
        success: true,
        data: savedMemory
      };
    } catch (error) {
      console.error('Error initializing memory:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get memory for an agent
   * @param {string} agentId - Agent ID
   * @param {string} projectId - Project ID
   * @returns {Promise} - Promise resolving to the memory
   */
  async getMemory(agentId, projectId) {
    try {
      let memory = await Memory.findOne({ agentId, projectId });
      
      if (!memory) {
        // Initialize memory if it doesn't exist
        return this.initializeMemory(agentId, projectId);
      }
      
      return {
        success: true,
        data: memory
      };
    } catch (error) {
      console.error('Error getting memory:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Add a message to memory
   * @param {string} agentId - Agent ID
   * @param {string} projectId - Project ID
   * @param {string} role - Message role (system, user, assistant)
   * @param {string} content - Message content
   * @returns {Promise} - Promise resolving to the updated memory
   */
  async addMessage(agentId, projectId, role, content) {
    try {
      let memory = await Memory.findOne({ agentId, projectId });
      
      if (!memory) {
        // Initialize memory if it doesn't exist
        const initResult = await this.initializeMemory(agentId, projectId);
        if (!initResult.success) {
          return initResult;
        }
        memory = initResult.data;
      }
      
      // Add new message
      memory.messages.push({
        role,
        content,
        timestamp: new Date()
      });
      
      // Update token count using token manager
      const newMessageTokens = tokenManager.estimateMessageTokens({role, content});
      memory.tokenCount += newMessageTokens;
      
      // Get agent for context window size
      const agent = await Agent.findById(agentId);
      if (!agent) {
        return {
          success: false,
          error: 'Agent not found'
        };
      }
      
      // Check if summarization is needed based on message count threshold
      // or if token count exceeds the maximum allowed tokens
      if (memory.messages.length >= config.memory.summarizationThreshold || 
          memory.tokenCount > (agent.contextWindow * 0.75)) { // Use 75% of context window as threshold
        await this.summarizeMemory(agentId, projectId);
      }
      
      await memory.save();
      
      return {
        success: true,
        data: memory
      };
    } catch (error) {
      console.error('Error adding message to memory:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Summarize memory to reduce token count
   * @param {string} agentId - Agent ID
   * @param {string} projectId - Project ID
   * @returns {Promise} - Promise resolving to the updated memory
   */
  async summarizeMemory(agentId, projectId) {
    try {
      let memory = await Memory.findOne({ agentId, projectId });
      
      if (!memory) {
        return {
          success: false,
          error: 'Memory not found'
        };
      }
      
      // If there are no messages to summarize, return
      if (memory.messages.length <= 2) {
        return {
          success: true,
          data: memory
        };
      }
      
      // Get the agent for LLM summarization
      const agent = await Agent.findById(agentId);
      if (!agent) {
        return {
          success: false,
          error: 'Agent not found'
        };
      }
      
      // Keep the most recent messages (last 2)
      const recentMessages = memory.messages.slice(-2);
      
      // Create a summary of older messages using the summarizer
      const oldMessages = memory.messages.slice(0, -2);
      const summaryResult = await summarizer.summarizeConversation(oldMessages, agent);
      
      if (!summaryResult.success) {
        return {
          success: false,
          error: summaryResult.error || 'Failed to summarize conversation'
        };
      }
      
      // If there's an existing summary, merge it with the new summary
      let newSummary = summaryResult.summary;
      if (memory.summary) {
        const mergeResult = await summarizer.mergeSummaries(memory.summary, newSummary, agent);
        if (mergeResult.success) {
          newSummary = mergeResult.summary;
        }
      }
      
      // Update summary
      memory.summary = newSummary;
      memory.summaryTimestamp = new Date();
      
      // Replace messages with recent ones
      memory.messages = recentMessages;
      
      // Recalculate token count using token manager
      const summaryTokens = tokenManager.estimateTokenCount(memory.summary);
      const messagesTokens = tokenManager.estimateMessagesTokens(memory.messages);
      
      memory.tokenCount = summaryTokens + messagesTokens;
      
      await memory.save();
      
      return {
        success: true,
        data: memory
      };
    } catch (error) {
      console.error('Error summarizing memory:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Add or update a memory anchor
   * @param {string} agentId - Agent ID
   * @param {string} projectId - Project ID
   * @param {string} key - Anchor key
   * @param {string} value - Anchor value
   * @returns {Promise} - Promise resolving to the updated memory
   */
  async setAnchor(agentId, projectId, key, value) {
    try {
      let memory = await Memory.findOne({ agentId, projectId });
      
      if (!memory) {
        // Initialize memory if it doesn't exist
        const initResult = await this.initializeMemory(agentId, projectId);
        if (!initResult.success) {
          return initResult;
        }
        memory = initResult.data;
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
      
      return {
        success: true,
        data: memory
      };
    } catch (error) {
      console.error('Error setting memory anchor:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Clear memory messages but keep anchors
   * @param {string} agentId - Agent ID
   * @param {string} projectId - Project ID
   * @returns {Promise} - Promise resolving to the updated memory
   */
  async clearMemory(agentId, projectId) {
    try {
      let memory = await Memory.findOne({ agentId, projectId });
      
      if (!memory) {
        return {
          success: false,
          error: 'Memory not found'
        };
      }
      
      // Clear messages but keep anchors
      memory.messages = [];
      memory.summary = '';
      memory.summaryTimestamp = null;
      memory.tokenCount = 0;
      
      await memory.save();
      
      return {
        success: true,
        data: memory
      };
    } catch (error) {
      console.error('Error clearing memory:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new MemoryService();

/**
 * Get formatted messages for LLM request
 * @param {string} agentId - Agent ID
 * @param {string} projectId - Project ID
 * @returns {Promise} - Promise resolving to formatted messages
 */
async getFormattedMessages(agentId, projectId) {
  try {
    const memory = await Memory.findOne({ agentId, projectId });
    
    if (!memory) {
      return {
        success: false,
        error: 'Memory not found'
      };
    }
    
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return {
        success: false,
        error: 'Agent not found'
      };
    }
    
    // Start with the system prompt
    const formattedMessages = [
      { role: 'system', content: agent.systemPrompt }
    ];
    
    // Add memory anchors if they exist
    if (memory.anchors && memory.anchors.length > 0) {
      const anchorPrompt = promptTemplates.getMemoryAnchorPrompt(memory.anchors);
      if (anchorPrompt) {
        formattedMessages.push({ role: 'system', content: anchorPrompt });
      }
    }
    
    // Add summary if it exists
    if (memory.summary) {
      formattedMessages.push({
        role: 'system',
        content: `Previous conversation summary:\n${memory.summary}`
      });
    }
    
    // Add messages
    memory.messages.forEach(msg => {
      formattedMessages.push({
        role: msg.role,
        content: msg.content
      });
    });
    
    return {
      success: true,
      data: formattedMessages
    };
  } catch (error) {
    console.error('Error getting formatted messages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
