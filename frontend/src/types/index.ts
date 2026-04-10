/* ============================================
   TypeScript Interfaces — OffGrid AI Marketing Copilot
   ============================================ */

// --- User Roles ---
export type UserRole = 'company' | 'freelancer';
export type BusinessType = 'product' | 'service' | 'event';

// --- Auth ---
export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company_name?: string;
}

export interface FreelancerRegisterRequest {
  name: string;
  email: string;
  password: string;
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
}

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  access_token: string;
  refresh_token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_name?: string;
  onboarding_complete: boolean;
  avatar?: string;
}

// --- Onboarding ---
export interface ProductInfo {
  productName: string;
  category: string;
  targetAudience: string;
  priceRange: string;
  usp: string;
}

export interface ServiceInfo {
  serviceType: string;
  targetAudience: string;
  location: string;
  pricingModel: string;
  keyBenefits: string;
}

export interface EventInfo {
  eventName: string;
  eventType: string;
  location: string;
  date: string;
  targetAudience: string;
}

export interface MarketingPreferences {
  budgetRange: string;
  platforms: string[];
  goal: 'awareness' | 'sales' | 'engagement';
}

export interface OnboardingData {
  businessType: BusinessType;
  businessInfo: ProductInfo | ServiceInfo | EventInfo;
  marketingPreferences: MarketingPreferences;
}

// --- Campaigns ---
export interface Campaign {
  id: string;
  name: string;
  platform: string;
  budget: number;
  status: 'active' | 'paused' | 'completed' | 'draft';
  performance: number;
  goal: string;
  startDate: string;
  endDate: string;
}

// --- Content AI ---
export interface GeneratedContent {
  id: string;
  post: string;
  caption: string;
  hashtags: string[];
  bestTimeToPost: string;
  platform: string;
}

export interface ContentGenerateRequest {
  businessType: string;
  audience: string;
  platform: string;
  tone: string;
}

// --- Analytics ---
export interface AnalyticsData {
  traffic: { date: string; visits: number; organic: number; paid: number }[];
  conversions: { date: string; conversions: number; rate: number }[];
  engagement: { date: string; likes: number; shares: number; comments: number }[];
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'problem' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

// --- Billboards ---
export interface Billboard {
  id: string;
  name: string;
  lat: number;
  lng: number;
  areaType: string;
  nearbyPlaces: string[];
  aiScore: number;
  recommendation: string;
  monthlyRate: number;
  size: string;
  city: string;
}

// --- Audience / CRM ---
export interface AudienceSegment {
  id: string;
  name: string;
  count: number;
  type: 'new' | 'returning' | 'inactive';
  description: string;
}

export interface AudienceContact {
  id: string;
  name: string;
  email: string;
  segment: string;
  lastActive: string;
  totalSpend: number;
}

// --- Freelancers ---
export interface Freelancer {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  rating: number;
  hourlyRate: number;
  completedProjects: number;
  availability: 'available' | 'busy' | 'unavailable';
  earnings: number;
}

export interface FreelancerCampaign {
  id: string;
  campaignName: string;
  client: string;
  status: 'active' | 'completed' | 'pending';
  referralLink: string;
  conversions: number;
  earnings: number;
}

// --- Settings ---
export interface Integration {
  platform: string;
  status: 'active' | 'disconnected';
  username?: string;
  connectedAt?: string;
  icon: string;
}

// --- Activity ---
export interface Activity {
  id: string;
  action: string;
  timestamp: string;
  type: 'campaign' | 'content' | 'analytics' | 'system';
}
