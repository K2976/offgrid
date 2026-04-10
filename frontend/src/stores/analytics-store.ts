import { create } from 'zustand';
import api from '@/lib/api';
import type { AnalyticsOverview, SocialAnalytics, WebsiteAnalytics, SEOAnalytics, WebsiteAudit } from '@/types';

interface AnalyticsState {
  overview: AnalyticsOverview | null;
  social: SocialAnalytics | null;
  website: WebsiteAnalytics | null;
  seo: SEOAnalytics | null;
  websiteAudit: WebsiteAudit | null;
  period: string;
  isLoading: boolean;
  error: string | null;
  setPeriod: (period: string) => void;
  fetchOverview: () => Promise<void>;
  fetchSocial: (platform?: string) => Promise<void>;
  fetchWebsite: () => Promise<void>;
  fetchSEO: () => Promise<void>;
  fetchWebsiteAudit: (url: string, strategy?: 'mobile' | 'desktop') => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  overview: null,
  social: null,
  website: null,
  seo: null,
  websiteAudit: null,
  period: '30d',
  isLoading: false,
  error: null,

  setPeriod: (period) => set({ period }),

  fetchOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<AnalyticsOverview>(`/analytics/overview?period=${get().period}`);
      set({ overview: res.data, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch overview', isLoading: false });
    }
  },

  fetchSocial: async (platform = 'instagram') => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<SocialAnalytics>(`/analytics/social?platform=${platform}&period=${get().period}`);
      set({ social: res.data, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch social data', isLoading: false });
    }
  },

  fetchWebsite: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<WebsiteAnalytics>(`/analytics/website?period=${get().period}`);
      set({ website: res.data, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch website data', isLoading: false });
    }
  },

  fetchSEO: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<SEOAnalytics>(`/analytics/seo?period=${get().period}`);
      set({ seo: res.data, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch SEO data', isLoading: false });
    }
  },

  fetchWebsiteAudit: async (url, strategy = 'mobile') => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<WebsiteAudit>('/analytics/website-audit', { url, strategy });
      set({ websiteAudit: res.data, isLoading: false });
    } catch {
      set({ error: 'Failed to run website audit. Check URL and try again.', isLoading: false });
    }
  },
}));
