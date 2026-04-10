import { create } from 'zustand';
import api from '@/lib/api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

interface AuthState {
  user: { id: string; email: string; name: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (data) => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    set({
      user: { id: res.data.id, email: res.data.email, name: res.data.name },
      isAuthenticated: true,
    });
  },

  register: async (data) => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    set({
      user: { id: res.data.id, email: res.data.email, name: res.data.name },
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
    window.location.href = '/login';
  },

  hydrate: () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      set({ isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
