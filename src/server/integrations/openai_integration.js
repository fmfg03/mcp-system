/**
 * OpenAI API Integration
 * Handles communication with OpenAI API for ChatGPT agent
 */

const axios = require('axios');
const config = process.env.NODE_ENV === 'production' 
  ? require('../config/production')
  : require('../config/development');

class OpenAIIntegration {
  /**
   * Send a request to OpenAI API
   * @param {string} model - The model to use (e.g., gpt-4)
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Additional options for the request
   * @returns {Promise} - Promise resolving to the API response
   */
  async sendChatRequest(model, messages, options = {}) {
    try {
      const defaultOptions = {
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      };
      
      const requestOptions = { ...defaultOptions, ...options };
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: model || config.llm.openai.defaultModel,
          messages,
          temperature: requestOptions.temperature,
          max_tokens: requestOptions.max_tokens,
          top_p: requestOptions.top_p,
          frequency_penalty: requestOptions.frequency_penalty,
          presence_penalty: requestOptions.presence_penalty
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.llm.openai.apiKey}`
          },
          timeout: config.llm.openai.timeout
        }
      );
      
      return {
        success: true,
        data: response.data,
        message: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: response.data.model
      };
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
  
  /**
   * Get available models from OpenAI API
   * @returns {Promise} - Promise resolving to the list of models
   */
  async getAvailableModels() {
    try {
      const response = await axios.get(
        'https://api.openai.com/v1/models',
        {
          headers: {
            'Authorization': `Bearer ${config.llm.openai.apiKey}`
          },
          timeout: config.llm.openai.timeout
        }
      );
      
      // Filter for chat models only
      const chatModels = response.data.data.filter(model => 
        model.id.includes('gpt')
      );
      
      return {
        success: true,
        data: chatModels
      };
    } catch (error) {
      console.error('Error fetching OpenAI models:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
  
  /**
   * Validate API key by making a simple request
   * @returns {Promise} - Promise resolving to validation result
   */
  async validateApiKey() {
    try {
      const response = await axios.get(
        'https://api.openai.com/v1/models',
        {
          headers: {
            'Authorization': `Bearer ${config.llm.openai.apiKey}`
          },
          timeout: 5000 // Short timeout for validation
        }
      );
      
      return {
        success: true,
        message: 'OpenAI API key is valid'
      };
    } catch (error) {
      console.error('OpenAI API key validation error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Invalid API key'
      };
    }
  }
}

module.exports = new OpenAIIntegration();
