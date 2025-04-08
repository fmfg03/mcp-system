/**
 * Token Manager Utility
 * Handles token counting and optimization for memory management
 */

class TokenManager {
  /**
   * Estimate token count for a string
   * This is a simplified estimation - in production, use a proper tokenizer
   * @param {string} text - Text to estimate tokens for
   * @returns {number} - Estimated token count
   */
  estimateTokenCount(text) {
    if (!text) return 0;
    
    // Simplified estimation: ~4 characters per token for English text
    // This is a rough approximation - actual tokenization varies by model
    return Math.ceil(text.length / 4);
  }

  /**
   * Estimate token count for a message object
   * @param {Object} message - Message object with role and content
   * @returns {number} - Estimated token count
   */
  estimateMessageTokens(message) {
    if (!message || !message.content) return 0;
    
    // Add tokens for role (~4 tokens) plus content
    return 4 + this.estimateTokenCount(message.content);
  }

  /**
   * Estimate token count for an array of messages
   * @param {Array} messages - Array of message objects
   * @returns {number} - Estimated total token count
   */
  estimateMessagesTokens(messages) {
    if (!messages || !messages.length) return 0;
    
    // Base overhead for the messages array (~3 tokens)
    let totalTokens = 3;
    
    // Add tokens for each message
    messages.forEach(message => {
      totalTokens += this.estimateMessageTokens(message);
    });
    
    return totalTokens;
  }

  /**
   * Determine if token count exceeds the limit
   * @param {number} tokenCount - Current token count
   * @param {number} maxTokens - Maximum allowed tokens
   * @returns {boolean} - True if token count exceeds limit
   */
  exceedsTokenLimit(tokenCount, maxTokens) {
    return tokenCount > maxTokens;
  }

  /**
   * Calculate how many messages to keep within token limit
   * @param {Array} messages - Array of message objects
   * @param {number} maxTokens - Maximum allowed tokens
   * @param {number} reservedTokens - Tokens to reserve for system prompt and new messages
   * @returns {number} - Number of most recent messages to keep
   */
  calculateMessagesToKeep(messages, maxTokens, reservedTokens = 500) {
    if (!messages || !messages.length) return 0;
    
    const availableTokens = maxTokens - reservedTokens;
    let tokenCount = 0;
    let messagesToKeep = 0;
    
    // Start from the most recent message and work backwards
    for (let i = messages.length - 1; i >= 0; i--) {
      const messageTokens = this.estimateMessageTokens(messages[i]);
      
      if (tokenCount + messageTokens <= availableTokens) {
        tokenCount += messageTokens;
        messagesToKeep++;
      } else {
        break;
      }
    }
    
    return messagesToKeep;
  }

  /**
   * Truncate messages to fit within token limit
   * @param {Array} messages - Array of message objects
   * @param {number} maxTokens - Maximum allowed tokens
   * @param {number} reservedTokens - Tokens to reserve for system prompt and new messages
   * @returns {Array} - Truncated array of messages
   */
  truncateMessages(messages, maxTokens, reservedTokens = 500) {
    if (!messages || !messages.length) return [];
    
    const messagesToKeep = this.calculateMessagesToKeep(messages, maxTokens, reservedTokens);
    
    // If we can keep all messages, return the original array
    if (messagesToKeep >= messages.length) {
      return [...messages];
    }
    
    // Otherwise, return only the most recent messages
    return messages.slice(messages.length - messagesToKeep);
  }
}

module.exports = new TokenManager();
