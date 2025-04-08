import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../utils/SocketContext';

// Components for the Project page
function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [agents, setAgents] = useState({ builder: null, judge: null });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Get socket from context
  const socketContext = useSocket();
  const socket = socketContext?.socket;
  const isConnected = socketContext?.isConnected;

  // Mock project data for UI development
  const mockProject = {
    _id: id,
    name: 'Company Website',
    description: 'A corporate website with about, services, and contact pages',
    type: 'static',
    status: 'in_progress',
    techStack: {
      frontend: 'HTML/CSS/JS',
      css: 'Tailwind',
      javascript: 'Vanilla JS',
      backend: 'None',
      database: 'None',
      cms: 'None'
    },
    structure: {
      pages: ['Home', 'About', 'Services', 'Contact'],
      components: ['Header', 'Footer', 'Navigation', 'Hero']
    },
    createdAt: new Date('2025-03-15').toISOString()
  };

  // Mock agents data
  const mockAgents = {
    builder: {
      _id: 'builder-123',
      name: 'Claude',
      role: 'Builder',
      provider: 'Anthropic',
      model: 'claude-3-opus'
    },
    judge: {
      _id: 'judge-456',
      name: 'ChatGPT',
      role: 'Judge',
      provider: 'OpenAI',
      model: 'gpt-4'
    }
  };

  // Get socket from context
  const { socket, isConnected } = useSocket();
  
  // Initialize socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Join project room
    socket.emit('join:project', id);

    // Socket event listeners
    const handleAgentResponseWrapper = (data) => handleAgentResponse(data);
    const handleRolesSwitchedWrapper = (data) => handleRolesSwitched(data);
    const handleConversationCompletedWrapper = (data) => handleConversationCompleted(data);
    const handleErrorWrapper = (data) => handleError(data);
    
    socket.on('agent:response', handleAgentResponseWrapper);
    socket.on('roles:switched', handleRolesSwitchedWrapper);
    socket.on('conversation:completed', handleConversationCompletedWrapper);
    socket.on('error', handleErrorWrapper);

    return () => {
      socket.off('agent:response', handleAgentResponseWrapper);
      socket.off('roles:switched', handleRolesSwitchedWrapper);
      socket.off('conversation:completed', handleConversationCompletedWrapper);
      socket.off('error', handleErrorWrapper);
    };
  }, [socket, id]);

  // Simulate loading project and agents data
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    setTimeout(() => {
      setProject(mockProject);
      setAgents(mockAgents);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle agent response
  const handleAgentResponse = (data) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'assistant',
      content: data.message,
      agent: data.agentName,
      agentRole: data.role
    }]);
    setIsProcessing(false);
  };

  // Handle roles switched
  const handleRolesSwitched = (data) => {
    const updatedAgents = {
      builder: data.agents.find(agent => agent.role === 'Builder'),
      judge: data.agents.find(agent => agent.role === 'Judge')
    };
    setAgents(updatedAgents);
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'system',
      content: 'Agent roles have been switched.'
    }]);
    setIsProcessing(false);
  };

  // Handle conversation completed
  const handleConversationCompleted = (data) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() - 1,
        role: 'assistant',
        content: data.builder.message,
        agent: agents.builder.name,
        agentRole: 'Builder'
      },
      {
        id: Date.now(),
        role: 'assistant',
        content: data.judge.message,
        agent: agents.judge.name,
        agentRole: 'Judge'
      }
    ]);
    setIsProcessing(false);
  };

  // Handle error
  const handleError = (error) => {
    console.error('Socket error:', error);
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'system',
      content: `Error: ${error.message}`
    }]);
    setIsProcessing(false);
  };

  // Send message to agent
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing || !socket || !isConnected) return;

    const newMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsProcessing(true);

    // Send to builder agent
    if (agents.builder) {
      socket.emit('agent:message', {
        agentId: agents.builder._id,
        message: inputMessage
      });
    }
  };

  // Start a conversation between builder and judge
  const startConversation = () => {
    if (!inputMessage.trim() || isProcessing || !socket || !isConnected) return;

    const newMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsProcessing(true);

    socket.emit('conversation:start', {
      projectId: id,
      message: inputMessage
    });
  };

  // Switch agent roles
  const switchRoles = () => {
    if (isProcessing || !socket || !isConnected) return;
    setIsProcessing(true);

    socket.emit('agent:switch_roles', {
      projectId: id
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">
          Loading project<span className="loading-dots"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-card p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
            project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {project.status.replace('_', ' ')}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="font-semibold text-gray-700 mb-2">Tech Stack</h2>
            <ul className="text-sm text-gray-600">
              <li><span className="font-medium">CSS:</span> {project.techStack.css}</li>
              <li><span className="font-medium">JavaScript:</span> {project.techStack.javascript}</li>
              <li><span className="font-medium">Type:</span> {project.type} website</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="font-semibold text-gray-700 mb-2">Structure</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <p className="font-medium">Pages:</p>
                <ul className="list-disc list-inside">
                  {project.structure.pages.map((page, index) => (
                    <li key={index}>{page}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium">Components:</p>
                <ul className="list-disc list-inside">
                  {project.structure.components.map((component, index) => (
                    <li key={index}>{component}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Agents</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">{agents.builder.name}</h3>
                  <span className="role-builder text-xs px-2 py-1 rounded-full">Builder</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Provider: {agents.builder.provider}</p>
                <p className="text-sm text-gray-600">Model: {agents.builder.model}</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">{agents.judge.name}</h3>
                  <span className="role-judge text-xs px-2 py-1 rounded-full">Judge</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Provider: {agents.judge.provider}</p>
                <p className="text-sm text-gray-600">Model: {agents.judge.model}</p>
              </div>
              <button
                onClick={switchRoles}
                disabled={isProcessing}
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Switch Roles
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-card flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Conversation</h2>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">
                    No messages yet. Start a conversation with the agents.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border ${
                      message.role === 'user' ? 'message-user' :
                      message.role === 'assistant' ? 'message-assistant' :
                      'message-system'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-800">
                        {message.role === 'user' ? 'You' :
                         message.role === 'assistant' ? `${message.agent} (${message.agentRole})` :
                         'System'}
                      </span>
                      {message.role === 'assistant' && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          message.agentRole === 'Builder' ? 'role-builder' : 'role-judge'
                        }`}>
                          {message.agentRole}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))
              )}
              {isProcessing && (
                <div className="p-4 rounded-lg border message-system">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">Processing</span>
                  </div>
                  <p className="text-gray-700">
                    Agents are thinking<span className="loading-dots"></span>
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isProcessing}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isProcessing}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send to Builder
                </button>
                <button
                  type="button"
                  onClick={startConversation}
                  disabled={!inputMessage.trim() || isProcessing}
                  className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send to Both
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
