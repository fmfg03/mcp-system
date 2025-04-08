import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock component wrapper
const NavbarWrapper = () => (
  <BrowserRouter>
    <Navbar />
  </BrowserRouter>
);

describe('Navbar Component', () => {
  test('renders the MCP System title', () => {
    render(<NavbarWrapper />);
    const titleElement = screen.getByText(/MCP System/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<NavbarWrapper />);
    const homeLink = screen.getByText(/Home/i);
    const settingsLink = screen.getByText(/Settings/i);
    const githubLink = screen.getByText(/GitHub/i);
    
    expect(homeLink).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
  });

  test('navigation links have correct hrefs', () => {
    render(<NavbarWrapper />);
    const homeLink = screen.getByText(/Home/i);
    const settingsLink = screen.getByText(/Settings/i);
    const githubLink = screen.getByText(/GitHub/i);
    
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    expect(settingsLink.closest('a')).toHaveAttribute('href', '/settings');
    expect(githubLink.closest('a')).toHaveAttribute('href', 'https://github.com/your-username/mcp-system');
  });

  test('GitHub link opens in new tab', () => {
    render(<NavbarWrapper />);
    const githubLink = screen.getByText(/GitHub/i).closest('a');
    
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
