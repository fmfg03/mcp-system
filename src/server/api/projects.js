const express = require('express');
const router = express.Router();
const Project = require('../models/project');

/**
 * GET /api/projects
 * Get all projects
 */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * GET /api/projects/:id
 * Get a specific project by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * POST /api/projects
 * Create a new project
 */
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      type, 
      techStack, 
      structure 
    } = req.body;
    
    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }
    
    const newProject = new Project({
      name,
      description,
      type: type || 'static',
      techStack: techStack || {
        frontend: 'HTML/CSS/JS',
        css: 'Tailwind',
        javascript: 'Vanilla JS',
        backend: 'None',
        database: 'None',
        cms: 'None'
      },
      structure: structure || {
        pages: ['Home', 'About', 'Services', 'Contact'],
        components: ['Header', 'Footer', 'Navigation', 'Hero']
      },
      fileStructure: {},
      status: 'planning'
    });
    
    const savedProject = await newProject.save();
    
    return res.status(201).json({
      success: true,
      data: savedProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * PUT /api/projects/:id
 * Update an existing project
 */
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      type, 
      techStack, 
      structure,
      fileStructure,
      status,
      deploymentInfo
    } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Update fields if provided
    if (name) project.name = name;
    if (description) project.description = description;
    if (type) project.type = type;
    if (techStack) project.techStack = { ...project.techStack, ...techStack };
    if (structure) project.structure = { ...project.structure, ...structure };
    if (fileStructure) project.fileStructure = fileStructure;
    if (status) project.status = status;
    if (deploymentInfo) project.deploymentInfo = deploymentInfo;
    
    const updatedProject = await project.save();
    
    return res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    await Project.deleteOne({ _id: req.params.id });
    
    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * POST /api/projects/:id/update-status
 * Update project status
 */
router.post('/:id/update-status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    project.status = status;
    
    const updatedProject = await project.save();
    
    return res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
