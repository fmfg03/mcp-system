/**
 * Development environment configuration for MCP System
 * Extends and overrides default configuration
 */
const defaultConfig = require('./default');

module.exports = {
  ...defaultConfig,
  server: {
    ...defaultConfig.server,
    port: 3000,
    environment: 'development',
  },
  database: {
    ...defaultConfig.database,
    uri: 'mongodb://localhost:27017/mcp_system_dev',
  },
  logging: {
    ...defaultConfig.logging,
    level: 'debug',
  },
  // Development-specific settings
  devTools: {
    enableHotReload: true,
    enableDebugLogs: true,
    mockLLMResponses: false, // Set to true to use mock LLM responses during development
  }
};
