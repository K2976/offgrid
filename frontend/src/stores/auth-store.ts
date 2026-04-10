import { create } from 'zustand';
import type { UserRole } from '@/types';

interface AuthState {
  user: { id: string; email: string; name: string; role: UserRole } | null;
  onboardingComplete: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  registerCompany: (name: string, email: string, password: string) => Promise<void>;
  registerFreelancer: (name: string, email: string, password: string, skills: string[], experienceLevel: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  onboardingComplete: false,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password, role) => {
    // Mock login — simulate API delay
    await new Promise((r) => setTimeout(r, 800));
    const mockUser = {
      id: 'usr_' + Math.random().toString(36).slice(2, 10),
      email,
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      role,
    };
    localStorage.setItem('og_user', JSON.stringify(mockUser));
    localStorage.setItem('og_onboarding', role === 'freelancer' ? 'true' : 'false');
    set({
      user: mockUser,
      onboardingComplete: role === 'freelancer',
      isAuthenticated: true,
    });
  },

  registerCompany: async (name, email, password) => {
    await new Promise((r) => setTimeout(r, 800));
    const mockUser = { id: 'usr_' + Math.random().toString(36).slice(2, 10), email, name, role: 'company' as UserRole };
    localStorage.setItem('og_user', JSON.stringify(mockUser));
    localStorage.setItem('og_onboarding', 'false');
    set({ user: mockUser, onboardingComplete: false, isAuthenticated: true });
  },

  registerFreelancer: async (name, email, password, skills, experienceLevel) => {
    await new Promise((r) => setTimeout(r, 800));
    const mockUser = { id: 'usr_' + Math.random().toString(36).slice(2, 10), email, name, role: 'freelancer' as UserRole };
    localStorage.setItem('og_user', JSON.stringify(mockUser));
    localStorage.setItem('og_onboarding', 'true');
    set({ user: mockUser, onboardingComplete: true, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('og_user');
    localStorage.removeItem('og_onboarding');
    set({ user: null, onboardingComplete: false, isAuthenticated: false });
    window.location.href = '/login';
  },

  hydrate: () => {
    try {
      const raw = localStorage.getItem('og_user');
      if (raw) {
        const user = JSON.parse(raw);
        const onboarding = localStorage.getItem('og_onboarding') === 'true';
        set({ user, onboardingComplete: onboarding, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
