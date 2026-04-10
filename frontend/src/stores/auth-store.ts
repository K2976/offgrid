import { create } from 'zustand';
import api from '@/lib/api';
import type { AuthResponse, LoginRequest, RegisterRequest, UserProfile } from '@/types';

interface AuthState {
  user: { id: string; email: string; name: string } | null;
  onboardingComplete: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  fetchMe: () => Promise<UserProfile | null>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  onboardingComplete: false,
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

    const profile = await api.get<UserProfile>('/auth/me');
    set({ onboardingComplete: profile.data.onboarding_complete });
  },

  register: async (data) => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    set({
      user: { id: res.data.id, email: res.data.email, name: res.data.name },
      onboardingComplete: false,
      isAuthenticated: true,
    });
  },

  fetchMe: async () => {
    try {
      const res = await api.get<UserProfile>('/auth/me');
      set({
        user: { id: res.data.id, email: res.data.email, name: res.data.name },
        onboardingComplete: res.data.onboarding_complete,
        isAuthenticated: true,
      });
      return res.data;
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, onboardingComplete: false, isAuthenticated: false });
    window.location.href = '/login';
  },

  hydrate: async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const res = await api.get<UserProfile>('/auth/me');
        set({
          user: { id: res.data.id, email: res.data.email, name: res.data.name },
          onboardingComplete: res.data.onboarding_complete,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, onboardingComplete: false, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
