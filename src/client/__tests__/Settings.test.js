import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Settings from '../pages/Settings';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Settings Component', () => {
  beforeEach(() => {
    // Clear localStorage mock
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test('renders settings page title', () => {
    render(<Settings />);
    const titleElement = screen.getByText(/Settings/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders API Keys section', () => {
    render(<Settings />);
    const apiKeysTitle = screen.getByText(/API Keys/i);
    expect(apiKeysTitle).toBeInTheDocument();
  });

  test('renders OpenAI and Anthropic API key inputs', () => {
    render(<Settings />);
    const openaiLabel = screen.getByLabelText(/OpenAI API Key/i);
    const anthropicLabel = screen.getByLabelText(/Anthropic API Key/i);
    
    expect(openaiLabel).toBeInTheDocument();
    expect(anthropicLabel).toBeInTheDocument();
  });

  test('loads API keys from localStorage on mount', () => {
    // Set mock values in localStorage
    localStorageMock.getItem.mockReturnValueOnce('test-openai-key');
    localStorageMock.getItem.mockReturnValueOnce('test-anthropic-key');
    
    render(<Settings />);
    
    // Check if localStorage.getItem was called with correct keys
    expect(localStorageMock.getItem).toHaveBeenCalledWith('openai_api_key');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('anthropic_api_key');
  });

  test('saves API keys to localStorage when Save Keys button is clicked', () => {
    render(<Settings />);
    
    // Fill in API key inputs
    const openaiInput = screen.getByLabelText(/OpenAI API Key/i);
    const anthropicInput = screen.getByLabelText(/Anthropic API Key/i);
    
    fireEvent.change(openaiInput, { target: { value: 'new-openai-key' } });
    fireEvent.change(anthropicInput, { target: { value: 'new-anthropic-key' } });
    
    // Click Save Keys button
    const saveButton = screen.getByText(/Save Keys/i);
    fireEvent.click(saveButton);
    
    // Check if localStorage.setItem was called with correct values
    expect(localStorageMock.setItem).toHaveBeenCalledWith('openai_api_key', 'new-openai-key');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('anthropic_api_key', 'new-anthropic-key');
  });

  test('displays success message after saving API keys', () => {
    render(<Settings />);
    
    // Fill in API key inputs
    const openaiInput = screen.getByLabelText(/OpenAI API Key/i);
    const anthropicInput = screen.getByLabelText(/Anthropic API Key/i);
    
    fireEvent.change(openaiInput, { target: { value: 'new-openai-key' } });
    fireEvent.change(anthropicInput, { target: { value: 'new-anthropic-key' } });
    
    // Click Save Keys button
    const saveButton = screen.getByText(/Save Keys/i);
    fireEvent.click(saveButton);
    
    // Check if success message is displayed
    const successMessage = screen.getByText(/API keys saved successfully/i);
    expect(successMessage).toBeInTheDocument();
  });

  test('renders System Information section', () => {
    render(<Settings />);
    const systemInfoTitle = screen.getByText(/System Information/i);
    expect(systemInfoTitle).toBeInTheDocument();
  });

  test('displays version information', () => {
    render(<Settings />);
    const versionInfo = screen.getByText(/MCP System v1.0.0/i);
    expect(versionInfo).toBeInTheDocument();
  });
});
