import { create } from 'zustand';
import api from '@/lib/api';
import type { AIAnalysis, AIAnalyzeRequest, AutopilotBrief, Alert, Competitor, CompetitorAnalysis, GeneratedContent, GenerateContentRequest, Report } from '@/types';

/* --- AI Store --- */
interface AIState {
  analysis: AIAnalysis | null;
  isAnalyzing: boolean;
  analyze: (req: AIAnalyzeRequest) => Promise<void>;
}
export const useAIStore = create<AIState>((set) => ({
  analysis: null,
  isAnalyzing: false,
  analyze: async (req) => {
    set({ isAnalyzing: true });
    try {
      const res = await api.post<AIAnalysis>('/ai/analyze', req);
      set({ analysis: res.data, isAnalyzing: false });
    } catch { set({ isAnalyzing: false }); }
  },
}));

/* --- Competitor Store --- */
interface CompetitorState {
  competitors: Competitor[];
  selectedAnalysis: CompetitorAnalysis | null;
  isLoading: boolean;
  fetchAll: () => Promise<void>;
  add: (name: string, platforms: Record<string, string>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  fetchAnalysis: (id: string) => Promise<void>;
}
export const useCompetitorStore = create<CompetitorState>((set) => ({
  competitors: [],
  selectedAnalysis: null,
  isLoading: false,
  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/competitors');
      set({ competitors: res.data.competitors, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  add: async (name, platforms) => {
    await api.post('/competitors', { name, platforms });
  },
  remove: async (id) => {
    await api.delete(`/competitors/${id}`);
  },
  fetchAnalysis: async (id) => {
    set({ isLoading: true });
    try {
      const res = await api.get<CompetitorAnalysis>(`/competitors/${id}/analysis`);
      set({ selectedAnalysis: res.data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
}));

/* --- Content Store --- */
interface ContentState {
  generated: GeneratedContent[];
  isGenerating: boolean;
  generate: (req: GenerateContentRequest) => Promise<void>;
}
export const useContentStore = create<ContentState>((set) => ({
  generated: [],
  isGenerating: false,
  generate: async (req) => {
    set({ isGenerating: true });
    try {
      const res = await api.post('/content/generate', req);
      set({ generated: res.data.generated, isGenerating: false });
    } catch { set({ isGenerating: false }); }
  },
}));

/* --- Alert Store --- */
interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  isLoading: boolean;
  fetchAlerts: (status?: string) => Promise<void>;
  markRead: (id: string) => Promise<void>;
}
export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  unreadCount: 0,
  isLoading: false,
  fetchAlerts: async (status = 'all') => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/alerts?status=${status}&limit=50`);
      const alerts: Alert[] = res.data.alerts;
      set({ alerts, unreadCount: alerts.filter((a) => !a.read).length, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  markRead: async (id) => {
    await api.patch(`/alerts/${id}/read`);
    set({
      alerts: get().alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
      unreadCount: Math.max(0, get().unreadCount - 1),
    });
  },
}));

/* --- Autopilot Store --- */
interface AutopilotState {
  today: AutopilotBrief | null;
  isLoading: boolean;
  fetchToday: () => Promise<void>;
}
export const useAutopilotStore = create<AutopilotState>((set) => ({
  today: null,
  isLoading: false,
  fetchToday: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get<AutopilotBrief>('/autopilot/today');
      set({ today: res.data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
}));

/* --- Report Store --- */
interface ReportState {
  reports: Report[];
  isLoading: boolean;
  fetchReports: () => Promise<void>;
  generateReport: (start: string, end: string) => Promise<void>;
}
export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  isLoading: false,
  fetchReports: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/reports?limit=20');
      set({ reports: res.data.reports || res.data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  generateReport: async (start, end) => {
    await api.post('/reports/generate', { period_start: start, period_end: end });
  },
}));
