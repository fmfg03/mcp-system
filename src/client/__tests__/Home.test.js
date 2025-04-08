import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';

// Mock component wrapper
const HomeWrapper = () => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
);

// Mock projects data
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
  }
];

// Mock useState implementation
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));

describe('Home Component', () => {
  beforeEach(() => {
    // Reset useState mock
    React.useState.mockReset();
    
    // Mock useState for projects
    React.useState
      .mockReturnValueOnce([mockProjects, jest.fn()]) // projects state
      .mockReturnValueOnce([false, jest.fn()]) // isLoading state
      .mockReturnValueOnce([false, jest.fn()]) // showNewProjectModal state
      .mockReturnValueOnce([{ // newProject state
        name: '',
        description: '',
        type: 'static',
        techStack: {
          css: 'Tailwind',
          javascript: 'Vanilla JS'
        }
      }, jest.fn()]);
  });

  test('renders projects heading', () => {
    render(<HomeWrapper />);
    const headingElement = screen.getByText(/Projects/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders New Project button', () => {
    render(<HomeWrapper />);
    const buttonElement = screen.getByText(/New Project/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders project cards for each project', () => {
    render(<HomeWrapper />);
    
    // Check if project names are rendered
    expect(screen.getByText('Company Website')).toBeInTheDocument();
    expect(screen.getByText('E-commerce Store')).toBeInTheDocument();
    
    // Check if project descriptions are rendered
    expect(screen.getByText('A corporate website with about, services, and contact pages')).toBeInTheDocument();
    expect(screen.getByText('Online store with product catalog and checkout')).toBeInTheDocument();
    
    // Check if project statuses are rendered
    expect(screen.getByText('in progress')).toBeInTheDocument();
    expect(screen.getByText('planning')).toBeInTheDocument();
  });

  test('project cards link to correct project pages', () => {
    render(<HomeWrapper />);
    
    // Get all project links
    const projectLinks = screen.getAllByRole('link');
    
    // Check if links have correct hrefs
    expect(projectLinks[0]).toHaveAttribute('href', '/project/1');
    expect(projectLinks[1]).toHaveAttribute('href', '/project/2');
  });
});

// Test for empty state
describe('Home Component with no projects', () => {
  beforeEach(() => {
    // Reset useState mock
    React.useState.mockReset();
    
    // Mock useState for empty projects
    React.useState
      .mockReturnValueOnce([[], jest.fn()]) // empty projects state
      .mockReturnValueOnce([false, jest.fn()]) // isLoading state
      .mockReturnValueOnce([false, jest.fn()]) // showNewProjectModal state
      .mockReturnValueOnce([{ // newProject state
        name: '',
        description: '',
        type: 'static',
        techStack: {
          css: 'Tailwind',
          javascript: 'Vanilla JS'
        }
      }, jest.fn()]);
  });

  test('renders empty state message when no projects', () => {
    render(<HomeWrapper />);
    
    const emptyStateMessage = screen.getByText(/No projects yet/i);
    expect(emptyStateMessage).toBeInTheDocument();
    
    const createButton = screen.getByText(/Create Project/i);
    expect(createButton).toBeInTheDocument();
  });
});

// Test for loading state
describe('Home Component in loading state', () => {
  beforeEach(() => {
    // Reset useState mock
    React.useState.mockReset();
    
    // Mock useState for loading state
    React.useState
      .mockReturnValueOnce([[], jest.fn()]) // empty projects state
      .mockReturnValueOnce([true, jest.fn()]) // isLoading = true
      .mockReturnValueOnce([false, jest.fn()]) // showNewProjectModal state
      .mockReturnValueOnce([{ // newProject state
        name: '',
        description: '',
        type: 'static',
        techStack: {
          css: 'Tailwind',
          javascript: 'Vanilla JS'
        }
      }, jest.fn()]);
  });

  test('renders loading state when isLoading is true', () => {
    render(<HomeWrapper />);
    
    const loadingMessage = screen.getByText(/Loading projects/i);
    expect(loadingMessage).toBeInTheDocument();
  });
});
