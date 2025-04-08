import React from 'react';
import { io } from 'socket.io-client';

// Create a context for Socket.io
const SocketContext = React.createContext(null);

// Socket.io provider component
export function SocketProvider({ children }) {
  const [socket, setSocket] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    // Create socket connection
    // In production, use the current host instead of hardcoded localhost
    const host = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000' 
      : window.location.origin;
      
    const newSocket = io(host, {
      transports: ['websocket'],
      autoConnect: true
    });

    // Set up event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Set socket in state
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

// Custom hook to use the socket
export function useSocket() {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
