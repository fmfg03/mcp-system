const { TokenManager } = require('../src/server/utils/token_manager');
const { Summarizer } = require('../src/server/utils/summarizer');
const promptTemplates = require('../src/server/utils/prompt_templates');

describe('Token Manager', () => {
  const tokenManager = new TokenManager();

  test('counts tokens correctly for short text', () => {
    const text = 'This is a short test message.';
    const count = tokenManager.countTokens(text);
    
    // Token count will vary by model, but should be roughly 7-8 tokens
    expect(count).toBeGreaterThanOrEqual(5);
    expect(count).toBeLessThanOrEqual(10);
  });

  test('counts tokens correctly for longer text', () => {
    const text = 'This is a longer test message with multiple sentences. It should have significantly more tokens than the short message. The token count should be proportional to the length of the text.';
    const count = tokenManager.countTokens(text);
    
    // Should have more tokens than the short message
    expect(count).toBeGreaterThanOrEqual(30);
  });

  test('truncates messages to fit within token limit', () => {
    // Create an array of messages
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Tell me about the history of artificial intelligence.' },
      { role: 'assistant', content: 'Artificial intelligence (AI) has roots in ancient history with myths and stories about artificial beings endowed with intelligence. However, the field of AI as we know it today began in the mid-20th century.' }
    ];
    
    // Truncate to a very small token limit
    const truncated = tokenManager.truncateMessages(messages, 20);
    
    // Should have fewer messages or shorter content
    expect(truncated.length).toBeLessThanOrEqual(messages.length);
    
    // Total token count should be less than or equal to the limit
    const totalTokens = truncated.reduce((sum, msg) => sum + tokenManager.countTokens(msg.content), 0);
    expect(totalTokens).toBeLessThanOrEqual(20);
  });

  test('prioritizes keeping system messages when truncating', () => {
    // Create an array of messages with a system message
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Tell me about the history of artificial intelligence.' },
      { role: 'assistant', content: 'Artificial intelligence has a long history...' }
    ];
    
    // Truncate to a small token limit
    const truncated = tokenManager.truncateMessages(messages, 15);
    
    // System message should still be present
    const systemMessage = truncated.find(msg => msg.role === 'system');
    expect(systemMessage).toBeDefined();
  });
});

describe('Prompt Templates', () => {
  test('getMemoryAnchorPrompt formats anchors correctly', () => {
    const anchors = [
      'Project goal: Create a website',
      'Tech stack: React, Node.js'
    ];
    
    const prompt = promptTemplates.getMemoryAnchorPrompt(anchors);
    
    // Should contain all anchors
    expect(prompt).toContain('Project goal: Create a website');
    expect(prompt).toContain('Tech stack: React, Node.js');
    
    // Should have appropriate formatting
    expect(prompt).toContain('MEMORY ANCHORS');
  });

  test('getRoleSwitchingPrompt formats role switch message correctly', () => {
    const oldRole = 'Builder';
    const newRole = 'Judge';
    
    const prompt = promptTemplates.getRoleSwitchingPrompt(oldRole, newRole);
    
    // Should mention both roles
    expect(prompt).toContain('Builder');
    expect(prompt).toContain('Judge');
    
    // Should indicate a role change
    expect(prompt).toContain('role has been changed');
  });

  test('returns empty string for getMemoryAnchorPrompt with empty anchors', () => {
    const prompt = promptTemplates.getMemoryAnchorPrompt([]);
    expect(prompt).toBe('');
  });
});

// Note: Summarizer tests would typically involve mocking the LLM service
// This is a simplified version that tests the interface without actual LLM calls
describe('Summarizer', () => {
  const summarizer = new Summarizer();
  const mockLLMService = {
    sendRequest: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('summarizeConversation calls LLM service with correct parameters', async () => {
    // Mock successful response
    mockLLMService.sendRequest.mockResolvedValue({
      success: true,
      message: 'This is a summary of the conversation.'
    });
    
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' }
    ];
    
    await summarizer.summarizeConversation(messages, mockLLMService);
    
    // Should call LLM service
    expect(mockLLMService.sendRequest).toHaveBeenCalled();
    
    // First argument should be an agent config
    const agentArg = mockLLMService.sendRequest.mock.calls[0][0];
    expect(agentArg).toHaveProperty('provider');
    expect(agentArg).toHaveProperty('model');
    
    // Second argument should be messages array with a system prompt
    const messagesArg = mockLLMService.sendRequest.mock.calls[0][1];
    expect(Array.isArray(messagesArg)).toBe(true);
    expect(messagesArg[0].role).toBe('system');
    expect(messagesArg[0].content).toContain('summarize');
  });
  
  test('handles LLM service errors gracefully', async () => {
    // Mock error response
    mockLLMService.sendRequest.mockResolvedValue({
      success: false,
      error: 'API error'
    });
    
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' }
    ];
    
    const result = await summarizer.summarizeConversation(messages, mockLLMService);
    
    // Should return null on error
    expect(result).toBeNull();
  });
});
