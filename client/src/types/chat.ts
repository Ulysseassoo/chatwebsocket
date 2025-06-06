export interface Message {
  id: number;
  content: string;
  type: 'system' | 'message';
  senderId: number;
  sender: {
    id: number;
    username: string;
    color?: string;
    profilePhoto?: string;
  };
  createdAt: string;
}

export interface ChatState {
  messages: Message[];
  connected: boolean;
  error: string | null;
} 