import { useEffect, useRef, useState } from 'react';
import { Message, ChatState } from '@/types/chat';
import { getSocket } from '@/lib/socket';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    connected: false,
    error: null,
  });

  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const initializedRef = useRef(false);
  const messageIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    setState((prev) => ({
      ...prev,
        connected: false,
        error: null,
    }));
    messageIdsRef.current.clear();
    initializedRef.current = false;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    socketRef.current = getSocket();

    socketRef.current.on('connect', () => {
      setState(prev => ({ ...prev, connected: true, error: null }));
    });

    socketRef.current.on('connect_error', (error) => {
      setState(prev => ({ ...prev, connected: false, error: error.message }));
    });

    socketRef.current.on('message', (message: Message) => {
      if (!messageIdsRef.current.has(message.id)) {
        messageIdsRef.current.add(message.id);
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      initializedRef.current = false;
      messageIdsRef.current.clear();
    };
  }, []);

  const sendMessage = (content: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message', { content });
    }
  };

  return {
    ...state,
    sendMessage,
  };
}; 