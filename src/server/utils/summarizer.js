/**
 * Summarizer Utility
 * Handles conversation summarization for memory optimization
 */

const llmService = require('../services/llm_service');

class Summarizer {
  /**
   * Create a summary of conversation messages
   * @param {Array} messages - Array of message objects to summarize
   * @param {Object} agent - Agent object with provider and model information
   * @returns {Promise} - Promise resolving to the summary
   */
  async summarizeConversation(messages, agent) {
    try {
      if (!messages || messages.length === 0) {
        return {
          success: true,
          summary: ''
        };
      }

      // Prepare the conversation text for summarization
      const conversationText = messages.map(msg => 
        `${msg.role.toUpperCase()}: ${msg.content}`
      ).join('\n\n');

      // Create a system prompt for summarization
      const systemPrompt = `You are an AI assistant tasked with creating concise, information-dense summaries of conversations. 
Summarize the following conversation in a way that preserves all key information, decisions, and context.
Focus on capturing the most important points that would be needed for future reference.
The summary should be comprehensive but significantly shorter than the original conversation.`;

      // Create a user message with the conversation to summarize
      const userMessage = `Please summarize this conversation:\n\n${conversationText}`;

      // Prepare messages for LLM request
      const summaryMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];

      // Use the LLM service to generate a summary
      const llmResponse = await llmService.sendRequest(agent, summaryMessages);

      if (!llmResponse.success) {
        return {
          success: false,
          error: llmResponse.error || 'Failed to generate summary'
        };
      }

      return {
        success: true,
        summary: llmResponse.message
      };
    } catch (error) {
      console.error('Error summarizing conversation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Merge a new summary with an existing summary
   * @param {string} existingSummary - Existing summary text
   * @param {string} newSummary - New summary text to merge
   * @param {Object} agent - Agent object with provider and model information
   * @returns {Promise} - Promise resolving to the merged summary
   */
  async mergeSummaries(existingSummary, newSummary, agent) {
    try {
      if (!existingSummary) return { success: true, summary: newSummary };
      if (!newSummary) return { success: true, summary: existingSummary };

      // Create a system prompt for merging summaries
      const systemPrompt = `You are an AI assistant tasked with merging two summaries into a single coherent summary.
The first summary contains older information, and the second summary contains newer information.
Create a comprehensive merged summary that preserves all key information from both summaries without redundancy.
The merged summary should be concise and well-organized.`;

      // Create a user message with the summaries to merge
      const userMessage = `Please merge these two summaries into one comprehensive summary:

OLDER SUMMARY:
${existingSummary}

NEWER SUMMARY:
${newSummary}`;

      // Prepare messages for LLM request
      const mergeMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];

      // Use the LLM service to generate a merged summary
      const llmResponse = await llmService.sendRequest(agent, mergeMessages);

      if (!llmResponse.success) {
        return {
          success: false,
          error: llmResponse.error || 'Failed to merge summaries'
        };
      }

      return {
        success: true,
        summary: llmResponse.message
      };
    } catch (error) {
      console.error('Error merging summaries:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new Summarizer();
