import { create } from 'zustand';
import type { User } from '@/types';
import { secureDelete, secureGet, secureSet } from '@/services/storage';
import { API_URL } from '@/utils/constants';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; token: string; user: User }>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  restore: async () => {
    const token = await secureGet('token');
    const userJson = await secureGet('user');
    if (token && userJson) {
      set({ user: JSON.parse(userJson) as User, token, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(err.message ?? 'Login failed');
    }
    const data = (await res.json()) as { user: User; token: string };
    await secureSet('token', JSON.stringify(data.token));
    await secureSet('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return { success: true, token: data.token, user: data.user };
  },

  logout: async () => {
    await secureDelete('token');
    await secureDelete('user');
    set({ user: null, token: null });
  },
}));
