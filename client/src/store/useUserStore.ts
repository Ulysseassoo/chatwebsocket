import { create } from 'zustand';
import { handleApiAuthError } from '@/utils/handleApiAuthError';

interface User {
  id: number;
  username: string;
  color?: string;
  profilePhoto?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ user: null });
        return;
      }

      const response = await fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (handleApiAuthError(response)) return;

      if (!response.ok) {
        set({ user: null });
        return;
      }

      const user = await response.json();
      set({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ user: null });
    }
  },
})); 