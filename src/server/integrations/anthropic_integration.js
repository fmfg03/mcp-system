/**
 * Anthropic API Integration
 * Handles communication with Anthropic API for Claude agent
 */

const axios = require('axios');
const config = process.env.NODE_ENV === 'production' 
  ? require('../config/production')
  : require('../config/development');

class AnthropicIntegration {
  /**
   * Send a request to Anthropic API
   * @param {string} model - The model to use (e.g., claude-3-opus)
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Additional options for the request
   * @returns {Promise} - Promise resolving to the API response
   */
  async sendChatRequest(model, messages, options = {}) {
    try {
      const defaultOptions = {
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1
      };
      
      const requestOptions = { ...defaultOptions, ...options };
      
      // Extract system message if present
      const systemMessage = messages.find(msg => msg.role === 'system');
      const systemPrompt = systemMessage ? systemMessage.content : '';
      
      // Filter out system messages for Anthropic format
      const userMessages = messages.filter(msg => msg.role !== 'system');
      
      // Convert to Anthropic format
      const anthropicMessages = userMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));
      
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: model || config.llm.anthropic.defaultModel,
          messages: anthropicMessages,
          system: systemPrompt,
          temperature: requestOptions.temperature,
          max_tokens: requestOptions.max_tokens,
          top_p: requestOptions.top_p
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.llm.anthropic.apiKey,
            'anthropic-version': '2023-06-01'
          },
          timeout: config.llm.anthropic.timeout
        }
      );
      
      return {
        success: true,
        data: response.data,
        message: response.data.content[0].text,
        usage: {
          prompt_tokens: response.data.usage?.input_tokens || 0,
          completion_tokens: response.data.usage?.output_tokens || 0,
          total_tokens: (response.data.usage?.input_tokens || 0) + (response.data.usage?.output_tokens || 0)
        },
        model: response.data.model
      };
    } catch (error) {
      console.error('Anthropic API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
  
  /**
   * Get available models from Anthropic
   * @returns {Promise} - Promise resolving to the list of models
   */
  async getAvailableModels() {
    // Anthropic doesn't have a models endpoint, so we return hardcoded values
    const models = [
      { id: 'claude-3-opus', name: 'Claude 3 Opus', context_length: 200000 },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', context_length: 180000 },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', context_length: 150000 },
      { id: 'claude-2', name: 'Claude 2', context_length: 100000 }
    ];
    
    return {
      success: true,
      data: models
    };
  }
  
  /**
   * Validate API key by making a simple request
   * @returns {Promise} - Promise resolving to validation result
   */
  async validateApiKey() {
    try {
      // Make a minimal request to validate the API key
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: config.llm.anthropic.defaultModel,
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.llm.anthropic.apiKey,
            'anthropic-version': '2023-06-01'
          },
          timeout: 5000 // Short timeout for validation
        }
      );
      
      return {
        success: true,
        message: 'Anthropic API key is valid'
      };
    } catch (error) {
      console.error('Anthropic API key validation error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Invalid API key'
      };
    }
  }
}

module.exports = new AnthropicIntegration();
