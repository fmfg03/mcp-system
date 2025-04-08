/**
 * Project Service
 * Handles project management for the MCP system
 */
const Project = require('../models/project');
const Agent = require('../models/agent');
const Memory = require('../models/memory');

class ProjectService {
  /**
   * Create a new project
   * @param {Object} projectData - Project configuration data
   * @returns {Promise} - Promise resolving to the created project
   */
  async createProject(projectData) {
    try {
      const newProject = new Project({
        name: projectData.name,
        description: projectData.description,
        type: projectData.type || 'static',
        techStack: projectData.techStack || {
          frontend: 'HTML/CSS/JS',
          css: 'Tailwind',
          javascript: 'Vanilla JS',
          backend: 'None',
          database: 'None',
          cms: 'None'
        },
        structure: projectData.structure || {
          pages: ['Home', 'About', 'Services', 'Contact'],
          components: ['Header', 'Footer', 'Navigation', 'Hero']
        },
        fileStructure: {},
        status: 'planning'
      });
      
      const savedProject = await newProject.save();
      
      return {
        success: true,
        data: savedProject
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get a project by ID
   * @param {string} projectId - Project ID
   * @returns {Promise} - Promise resolving to the project
   */
  async getProject(projectId) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        return {
          success: false,
          error: 'Project not found'
        };
      }
      
      return {
        success: true,
        data: project
      };
    } catch (error) {
      console.error('Error getting project:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get all projects
   * @returns {Promise} - Promise resolving to an array of projects
   */
  async getAllProjects() {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      
      return {
        success: true,
        data: projects
      };
    } catch (error) {
      console.error('Error getting all projects:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Update a project
   * @param {string} projectId - Project ID
   * @param {Object} updateData - Data to update
   * @returns {Promise} - Promise resolving to the updated project
   */
  async updateProject(projectId, updateData) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        return {
          success: false,
          error: 'Project not found'
        };
      }
      
      // Update fields
      if (updateData.name) project.name = updateData.name;
      if (updateData.description) project.description = updateData.description;
      if (updateData.type) project.type = updateData.type;
      if (updateData.techStack) project.techStack = { ...project.techStack, ...updateData.techStack };
      if (updateData.structure) project.structure = { ...project.structure, ...updateData.structure };
      if (updateData.fileStructure) project.fileStructure = updateData.fileStructure;
      if (updateData.status) project.status = updateData.status;
      if (updateData.deploymentInfo) project.deploymentInfo = updateData.deploymentInfo;
      
      const updatedProject = await project.save();
      
      return {
        success: true,
        data: updatedProject
      };
    } catch (error) {
      console.error('Error updating project:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Update project status
   * @param {string} projectId - Project ID
   * @param {string} status - New status
   * @returns {Promise} - Promise resolving to the updated project
   */
  async updateProjectStatus(projectId, status) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        return {
          success: false,
          error: 'Project not found'
        };
      }
      
      project.status = status;
      
      const updatedProject = await project.save();
      
      return {
        success: true,
        data: updatedProject
      };
    } catch (error) {
      console.error('Error updating project status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Delete a project and all associated data
   * @param {string} projectId - Project ID
   * @returns {Promise} - Promise resolving to success status
   */
  async deleteProject(projectId) {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        return {
          success: false,
          error: 'Project not found'
        };
      }
      
      // Delete project
      await Project.deleteOne({ _id: projectId });
      
      // Delete associated agents
      await Agent.deleteMany({ projectId });
      
      // Delete associated memories
      await Memory.deleteMany({ projectId });
      
      return {
        success: true,
        message: 'Project and associated data deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting project:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Initialize a new project with default agents
   * @param {string} projectId - Project ID
   * @returns {Promise} - Promise resolving to the created agents
   */
  async initializeProjectAgents(projectId) {
    try {
      // Check if project exists
      const project = await Project.findById(projectId);
      
      if (!project) {
        return {
          success: false,
          error: 'Project not found'
        };
      }
      
      // Create Claude agent (Builder)
      const claudeAgent = new Agent({
        name: 'Claude',
        role: 'Builder',
        provider: 'Anthropic',
        model: 'claude-3-opus',
        systemPrompt: `You are Claude, an AI assistant acting as the Builder in a collaborative website development project. Your role is to propose structure, code, and explain your reasoning. The website should include: ${project.structure.pages.join(', ')} pages and ${project.structure.components.join(', ')} components. The tech stack includes ${project.techStack.frontend} with ${project.techStack.css} for styling and ${project.techStack.javascript} for interactivity.`,
        contextWindow: 100000,
        maxTokens: 4000,
        temperature: 0.7,
        projectId
      });
      
      // Create ChatGPT agent (Judge)
      const chatGPTAgent = new Agent({
        name: 'ChatGPT',
        role: 'Judge',
        provider: 'OpenAI',
        model: 'gpt-4',
        systemPrompt: `You are ChatGPT, an AI assistant acting as the Judge in a collaborative website development project. Your role is to review, critique, and suggest improvements to the Builder's proposals. The website should include: ${project.structure.pages.join(', ')} pages and ${project.structure.components.join(', ')} components. The tech stack includes ${project.techStack.frontend} with ${project.techStack.css} for styling and ${project.techStack.javascript} for interactivity.`,
        contextWindow: 8000,
        maxTokens: 2000,
        temperature: 0.7,
        projectId
      });
      
      // Save agents
      const savedClaude = await claudeAgent.save();
      const savedChatGPT = await chatGPTAgent.save();
      
      // Initialize memory for both agents
      await Memory.create({
        agentId: savedClaude._id,
        projectId,
        messages: [],
        summary: '',
        tokenCount: 0,
        anchors: [
          { key: 'project_name', value: project.name },
          { key: 'project_type', value: project.type },
          { key: 'tech_stack', value: JSON.stringify(project.techStack) }
        ]
      });
      
      await Memory.create({
        agentId: savedChatGPT._id,
        projectId,
        messages: [],
        summary: '',
        tokenCount: 0,
        anchors: [
          { key: 'project_name', value: project.name },
          { key: 'project_type', value: project.type },
          { key: 'tech_stack', value: JSON.stringify(project.techStack) }
        ]
      });
      
      return {
        success: true,
        data: {
          builder: savedClaude,
          judge: savedChatGPT
        }
      };
    } catch (error) {
      console.error('Error initializing project agents:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ProjectService();
