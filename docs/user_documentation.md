# MCP System User Documentation

## Introduction

Welcome to the MCP (Multi-Client Protocol) System! This platform enables collaborative website development using Claude and ChatGPT as autonomous agents. One agent acts as the Builder, generating code and design solutions, while the other acts as the Judge, evaluating and critiquing the Builder's work.

This documentation will guide you through setting up and using the MCP System.

## Getting Started

### System Requirements

- Node.js v20 or later
- MongoDB (running locally or accessible via connection string)
- Redis (running locally or accessible via connection string)
- API keys for OpenAI and Anthropic

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/mcp-system.git
   cd mcp-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mcp_system
   REDIS_URL=redis://localhost:6379
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   SESSION_SECRET=your_session_secret
   ```

4. Set up the database:
   ```
   node scripts/setup-db.js
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Access the application at http://localhost:3000

### Deployment

To deploy the MCP System to a production environment:

1. Run the deployment script:
   ```
   ./deploy.sh
   ```

2. Follow the prompts to configure your production environment.

## Using the MCP System

### Creating a Project

1. From the home page, click the "New Project" button.
2. Fill in the project details:
   - Project Name: A descriptive name for your website project
   - Description: Brief overview of the website's purpose
   - Website Type: Choose between static or dynamic
   - CSS Framework: Select your preferred CSS framework
   - JavaScript Framework: Select your preferred JavaScript framework
3. Click "Create Project" to initialize your new project.

### Interacting with Agents

Once your project is created, you'll be taken to the project page where you can interact with the agents:

1. **Sending Messages to the Builder**: Type your message in the input field and click "Send to Builder". The Builder agent (Claude or ChatGPT) will respond with suggestions, code, or design ideas.

2. **Getting Feedback from the Judge**: After the Builder responds, you can send the response to the Judge by clicking "Send to Both". The Judge will evaluate the Builder's response and provide feedback.

3. **Switching Roles**: Click the "Switch Roles" button to swap the Builder and Judge roles between Claude and ChatGPT.

### Managing API Keys

To update your API keys:

1. Navigate to the Settings page by clicking "Settings" in the navigation bar.
2. Enter your OpenAI and Anthropic API keys in the respective fields.
3. Click "Validate Keys" to verify they are working correctly.
4. Click "Save Keys" to store your API keys.

## Project Structure

The MCP System organizes website projects with the following structure:

- **Pages**: Define the main pages of your website
- **Components**: Reusable UI elements across pages
- **Assets**: Images, fonts, and other static files
- **Styles**: CSS or styling framework files
- **Scripts**: JavaScript functionality

## Best Practices

For the best experience with the MCP System:

1. **Be Specific**: Provide clear, detailed instructions to the Builder agent.
2. **Iterate Gradually**: Build your website in small, incremental steps.
3. **Switch Roles Regularly**: Alternate between Claude and ChatGPT as Builder to get different perspectives.
4. **Save Important Outputs**: Copy significant code or design suggestions to external files.
5. **Provide Context**: When continuing a conversation after a break, summarize previous decisions.

## Troubleshooting

### Common Issues

- **API Key Errors**: Ensure your OpenAI and Anthropic API keys are valid and have sufficient credits.
- **Connection Issues**: Verify that MongoDB and Redis are running.
- **Agent Not Responding**: Check your internet connection and API key status.

### Getting Help

If you encounter issues not covered in this documentation, please:

1. Check the GitHub repository issues section
2. Join our community Discord server
3. Contact support at support@mcp-system.com

## Conclusion

The MCP System provides a powerful platform for collaborative website development with AI assistance. By leveraging the strengths of different LLM agents, you can create better websites more efficiently than working with a single AI assistant.

Happy building!
