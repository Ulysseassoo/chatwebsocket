import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let currentToken: string | null = null;
let isDisconnected = false;

export function getSocket(): Socket {
  const token = localStorage.getItem('token') || '';
  
  if (isDisconnected || (socket && !socket.connected)) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    currentToken = null;
    isDisconnected = false;
  }
  
  if (!socket || token !== currentToken) {
    if (socket) {
      socket.disconnect();
    }
    currentToken = token;
    socket = io('http://localhost:4000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io client disconnect') {
        isDisconnected = true;
      }
    });
  }
  
  return socket;
} 