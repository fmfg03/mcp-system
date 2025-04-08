/**
 * LLM Service
 * Handles communication with LLM providers (OpenAI and Anthropic)
 */
const openaiIntegration = require('../integrations/openai_integration');
const anthropicIntegration = require('../integrations/anthropic_integration');

class LLMService {
  /**
   * Send a request to the appropriate LLM provider based on agent configuration
   * @param {Object} agent - Agent configuration object
   * @param {Array} messages - Array of message objects with role and content
   * @returns {Promise} - Promise resolving to the API response
   */
  async sendRequest(agent, messages) {
    try {
      if (agent.provider === 'OpenAI') {
        return await openaiIntegration.sendChatRequest(
          agent.model,
          messages,
          {
            temperature: agent.temperature,
            max_tokens: agent.maxTokens
          }
        );
      } else if (agent.provider === 'Anthropic') {
        return await anthropicIntegration.sendChatRequest(
          agent.model,
          messages,
          {
            temperature: agent.temperature,
            max_tokens: agent.maxTokens
          }
        );
      } else {
        return {
          success: false,
          error: `Unsupported provider: ${agent.provider}`
        };
      }
    } catch (error) {
      console.error('Error in LLM service:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get available models for a provider
   * @param {string} provider - Provider name (OpenAI or Anthropic)
   * @returns {Promise} - Promise resolving to the list of models
   */
  async getAvailableModels(provider) {
    try {
      if (provider === 'OpenAI') {
        return await openaiIntegration.getAvailableModels();
      } else if (provider === 'Anthropic') {
        return await anthropicIntegration.getAvailableModels();
      } else {
        return {
          success: false,
          error: `Unsupported provider: ${provider}`
        };
      }
    } catch (error) {
      console.error('Error getting available models:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Validate API keys for all providers
   * @returns {Promise} - Promise resolving to validation results
   */
  async validateApiKeys() {
    try {
      const openaiResult = await openaiIntegration.validateApiKey();
      const anthropicResult = await anthropicIntegration.validateApiKey();
      
      return {
        success: true,
        data: {
          openai: openaiResult,
          anthropic: anthropicResult
        }
      };
    } catch (error) {
      console.error('Error validating API keys:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new LLMService();
