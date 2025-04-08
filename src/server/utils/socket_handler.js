/**
 * Socket.io handler for agent communication
 * Manages real-time communication for the MCP system
 */

const agentCommunication = require('../utils/agent_communication');
const agentService = require('../services/agent_service');
const projectService = require('../services/project_service');

/**
 * Initialize Socket.io handlers
 * @param {Object} io - Socket.io server instance
 */
function initializeSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Join a project room
    socket.on('join:project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`Client ${socket.id} joined project room: ${projectId}`);
    });
    
    // Send message to agent
    socket.on('agent:message', async (data) => {
      try {
        const { agentId, message } = data;
        
        if (!agentId || !message) {
          socket.emit('error', { message: 'Agent ID and message are required' });
          return;
        }
        
        // Get agent details to determine project
        const agentResult = await agentService.getAgent(agentId);
        if (!agentResult.success) {
          socket.emit('error', { message: agentResult.error });
          return;
        }
        
        const projectId = agentResult.data.projectId;
        
        // Emit processing event
        socket.emit('agent:processing', { agentId });
        io.to(`project:${projectId}`).emit('agent:processing', { agentId });
        
        // Send message to agent
        const response = await agentCommunication.sendMessageToAgent(agentId, message);
        
        if (!response.success) {
          socket.emit('error', { message: response.error });
          return;
        }
        
        // Emit response to all clients in the project room
        socket.emit('agent:response', response.data);
        io.to(`project:${projectId}`).emit('agent:response', response.data);
      } catch (error) {
        console.error('Error handling agent message:', error);
        socket.emit('error', { message: error.message });
      }
    });
    
    // Switch agent roles
    socket.on('agent:switch_roles', async (data) => {
      try {
        const { projectId } = data;
        
        if (!projectId) {
          socket.emit('error', { message: 'Project ID is required' });
          return;
        }
        
        // Emit processing event
        socket.emit('roles:switching', { projectId });
        io.to(`project:${projectId}`).emit('roles:switching', { projectId });
        
        // Switch agent roles
        const response = await agentCommunication.switchAgentRoles(projectId);
        
        if (!response.success) {
          socket.emit('error', { message: response.error });
          return;
        }
        
        // Emit response to all clients in the project room
        socket.emit('roles:switched', response.data);
        io.to(`project:${projectId}`).emit('roles:switched', response.data);
      } catch (error) {
        console.error('Error switching agent roles:', error);
        socket.emit('error', { message: error.message });
      }
    });
    
    // Facilitate conversation between agents
    socket.on('conversation:start', async (data) => {
      try {
        const { projectId, message } = data;
        
        if (!projectId || !message) {
          socket.emit('error', { message: 'Project ID and message are required' });
          return;
        }
        
        // Emit processing event
        socket.emit('conversation:processing', { projectId });
        io.to(`project:${projectId}`).emit('conversation:processing', { projectId });
        
        // Facilitate conversation
        const response = await agentCommunication.facilitateAgentConversation(projectId, message);
        
        if (!response.success) {
          socket.emit('error', { message: response.error });
          return;
        }
        
        // Emit response to all clients in the project room
        socket.emit('conversation:completed', response.data);
        io.to(`project:${projectId}`).emit('conversation:completed', response.data);
      } catch (error) {
        console.error('Error facilitating conversation:', error);
        socket.emit('error', { message: error.message });
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = { initializeSocketHandlers };
