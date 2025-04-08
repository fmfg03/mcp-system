import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    type: 'static',
    techStack: {
      css: 'Tailwind',
      javascript: 'Vanilla JS'
    }
  });

  // Mock projects for UI development
  const mockProjects = [
    {
      _id: '1',
      name: 'Company Website',
      description: 'A corporate website with about, services, and contact pages',
      type: 'static',
      status: 'in_progress',
      createdAt: new Date('2025-03-15').toISOString()
    },
    {
      _id: '2',
      name: 'E-commerce Store',
      description: 'Online store with product catalog and checkout',
      type: 'dynamic',
      status: 'planning',
      createdAt: new Date('2025-04-01').toISOString()
    },
    {
      _id: '3',
      name: 'Personal Blog',
      description: 'Blog with articles and comments',
      type: 'static',
      status: 'completed',
      createdAt: new Date('2025-02-20').toISOString()
    }
  ];

  // Simulate loading projects from API
  React.useEffect(() => {
    // In a real implementation, this would fetch from the API
    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value
    });
  };

  const handleTechStackChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      techStack: {
        ...newProject.techStack,
        [name]: value
      }
    });
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    // In a real implementation, this would send to the API
    const newProjectWithId = {
      ...newProject,
      _id: Date.now().toString(),
      status: 'planning',
      createdAt: new Date().toISOString()
    };
    setProjects([newProjectWithId, ...projects]);
    setShowNewProjectModal(false);
    setNewProject({
      name: '',
      description: '',
      type: 'static',
      techStack: {
        css: 'Tailwind',
        javascript: 'Vanilla JS'
      }
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-all"
        >
          New Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">
            Loading projects<span className="loading-dots"></span>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No projects yet</h2>
          <p className="text-gray-600 mb-6">
            Create your first project to start building with Claude and ChatGPT.
          </p>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md transition-all"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              to={`/project/${project._id}`}
              key={project._id}
              className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{project.type} website</span>
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Create New Project</h2>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProject.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                  Website Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={newProject.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="static">Static Website</option>
                  <option value="dynamic">Dynamic Website</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="css">
                    CSS Framework
                  </label>
                  <select
                    id="css"
                    name="css"
                    value={newProject.techStack.css}
                    onChange={handleTechStackChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Tailwind">Tailwind CSS</option>
                    <option value="SCSS">SCSS</option>
                    <option value="CSS">Plain CSS</option>
                    <option value="Bootstrap">Bootstrap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="javascript">
                    JavaScript Framework
                  </label>
                  <select
                    id="javascript"
                    name="javascript"
                    value={newProject.techStack.javascript}
                    onChange={handleTechStackChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Vanilla JS">Vanilla JS</option>
                    <option value="Alpine.js">Alpine.js</option>
                    <option value="React">React</option>
                    <option value="Vue">Vue</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="mr-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-all"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
