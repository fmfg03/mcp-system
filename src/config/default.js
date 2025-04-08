/**
 * Default configuration for MCP System
 */
module.exports = {
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: process.env.CORS_ORIGINS || '*',
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mcp_system',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
  llm: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4',
      timeout: 60000,
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      defaultModel: process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-opus',
      timeout: 60000,
    },
  },
  memory: {
    maxTokens: 8000,
    summarizationThreshold: 10, // Number of turns before summarization
    summaryMaxTokens: 2000,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined',
  },
};
