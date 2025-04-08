import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SocketProvider, useSocket } from '../utils/SocketContext';

// Mock socket.io-client
jest.mock('socket.io-client', () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    id: 'mock-socket-id'
  };
  return {
    io: jest.fn(() => mockSocket)
  };
});

// Test component that uses the socket context
const TestComponent = () => {
  const { socket, isConnected } = useSocket();
  return (
    <div>
      <div data-testid="connection-status">
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <button 
        data-testid="emit-button" 
        onClick={() => socket.emit('test-event', { data: 'test' })}
      >
        Emit Event
      </button>
    </div>
  );
};

describe('SocketContext', () => {
  test('provides socket and connection status to children', () => {
    render(
      <SocketProvider>
        <TestComponent />
      </SocketProvider>
    );
    
    // Initially disconnected
    expect(screen.getByTestId('connection-status')).toHaveTextContent('Disconnected');
  });
  
  test('emits events when requested', () => {
    render(
      <SocketProvider>
        <TestComponent />
      </SocketProvider>
    );
    
    // Get the socket from the mock
    const mockSocket = require('socket.io-client').io();
    
    // Click the emit button
    fireEvent.click(screen.getByTestId('emit-button'));
    
    // Check if emit was called with correct arguments
    expect(mockSocket.emit).toHaveBeenCalledWith('test-event', { data: 'test' });
  });
  
  test('sets up event listeners on mount', () => {
    render(
      <SocketProvider>
        <TestComponent />
      </SocketProvider>
    );
    
    // Get the socket from the mock
    const mockSocket = require('socket.io-client').io();
    
    // Check if event listeners were set up
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
  });
  
  test('disconnects socket on unmount', () => {
    const { unmount } = render(
      <SocketProvider>
        <TestComponent />
      </SocketProvider>
    );
    
    // Get the socket from the mock
    const mockSocket = require('socket.io-client').io();
    
    // Unmount the component
    unmount();
    
    // Check if disconnect was called
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
  
  test('updates connection status when socket connects', () => {
    render(
      <SocketProvider>
        <TestComponent />
      </SocketProvider>
    );
    
    // Get the socket from the mock
    const mockSocket = require('socket.io-client').io();
    
    // Find the connect callback
    const connectCallback = mockSocket.on.mock.calls.find(call => call[0] === 'connect')[1];
    
    // Call the connect callback
    connectCallback();
    
    // Check if connection status was updated
    expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected');
  });
});
