'use client';

import React from 'react';
import {
  TrendingUp, TrendingDown, Eye, MousePointerClick, BarChart3, Megaphone,
  Sparkles, ArrowRight, Clock, Zap, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Header } from '@/components/layout/Header';

const stats = [
  { label: 'Engagement', value: '12.8K', change: '+14.2%', trend: 'up', icon: TrendingUp, color: 'text-emerald-400' },
  { label: 'Total Visits', value: '48.2K', change: '+8.7%', trend: 'up', icon: Eye, color: 'text-blue-400' },
  { label: 'Conversions', value: '3,420', change: '+2.4%', trend: 'up', icon: MousePointerClick, color: 'text-violet-400' },
  { label: 'Active Campaigns', value: '7', change: '+2', trend: 'up', icon: Megaphone, color: 'text-amber-400' },
];

const trafficData = [
  { name: 'Mon', organic: 4200, paid: 2800, engagement: 320 },
  { name: 'Tue', organic: 3800, paid: 2200, engagement: 280 },
  { name: 'Wed', organic: 5100, paid: 3400, engagement: 450 },
  { name: 'Thu', organic: 4700, paid: 3100, engagement: 390 },
  { name: 'Fri', organic: 5800, paid: 4200, engagement: 520 },
  { name: 'Sat', organic: 4300, paid: 2900, engagement: 350 },
  { name: 'Sun', organic: 4900, paid: 3600, engagement: 420 },
];

const engagementData = [
  { name: 'Mon', likes: 820, shares: 230, comments: 145 },
  { name: 'Tue', likes: 690, shares: 180, comments: 120 },
  { name: 'Wed', likes: 1050, shares: 340, comments: 210 },
  { name: 'Thu', likes: 880, shares: 260, comments: 175 },
  { name: 'Fri', likes: 1200, shares: 410, comments: 280 },
  { name: 'Sat', likes: 750, shares: 200, comments: 130 },
  { name: 'Sun', likes: 960, shares: 320, comments: 195 },
];

const aiInsights = [
  { title: 'Reels performing 2x better', desc: 'Short-form video content is generating 2x more engagement than static posts this week.', type: 'opportunity' },
  { title: 'Instagram reach declining', desc: 'Your Instagram reach dropped 18% — consider boosting top posts or changing posting schedule.', type: 'problem' },
  { title: 'SEO keyword opportunity', desc: '"AI marketing tool" moved to position #8. With minor optimization, you can hit top 5.', type: 'trend' },
];

const suggestedActions = [
  { action: 'Post at 8 PM for max engagement', reasoning: 'Your audience is 40% more active between 7-9 PM', priority: 'high' },
  { action: 'Increase Reels budget by 15%', reasoning: 'ROI on Reels is 2.3x higher than static posts', priority: 'high' },
  { action: 'A/B test email subject lines', reasoning: 'Open rates dropped 5% — test shorter subjects', priority: 'medium' },
  { action: 'Respond to 12 comments', reasoning: 'Engagement replies boost algorithm ranking', priority: 'low' },
];

const recentActivity = [
  { action: 'Campaign "Summer Boost" went live', timestamp: '2 hours ago', type: 'campaign' },
  { action: 'AI generated 5 new post ideas', timestamp: '4 hours ago', type: 'content' },
  { action: 'Analytics report ready for download', timestamp: '6 hours ago', type: 'analytics' },
  { action: 'New freelancer application received', timestamp: '1 day ago', type: 'system' },
];

export default function DashboardPage() {
  return (
    <div>
      <Header title="Dashboard" subtitle="Your marketing command center" />

      <div className="mt-6 space-y-6 px-8 pb-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-surface-100 p-5 transition-all hover:border-white/[0.12] hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">{stat.label}</span>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="mt-2 text-3xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">{stat.change}</span>
                <span className="text-zinc-600">vs last week</span>
              </div>
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500/5 to-transparent transition-all group-hover:from-brand-500/10" />
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="ai-card animate-pulse-glow rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">AI Insights</h2>
            <Badge className="ml-2 bg-violet-500/20 text-violet-300 border-violet-500/30">Live</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-surface-0/50 p-4 transition-all hover:border-white/[0.12]">
                <div className="mb-1 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    insight.type === 'opportunity' ? 'bg-emerald-400' :
                    insight.type === 'problem' ? 'bg-rose-400' : 'bg-amber-400'
                  }`} />
                  <span className="text-sm font-semibold text-zinc-200">{insight.title}</span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-500">{insight.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Actions */}
        <Card className="border-white/[0.06] bg-surface-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-amber-400" />
              Suggested Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedActions.map((action, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-all hover:bg-white/[0.04]">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    action.priority === 'high' ? 'bg-rose-500/20 text-rose-400' :
                    action.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-200">{action.action}</p>
                    <p className="text-xs text-zinc-500">{action.reasoning}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/[0.06] bg-surface-100">
            <CardHeader>
              <CardTitle className="text-white">Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#1f1f23', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fafafa', fontSize: 13 }} />
                    <Area type="monotone" dataKey="organic" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrg)" strokeWidth={2} />
                    <Area type="monotone" dataKey="paid" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPaid)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Organic</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> Paid</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/[0.06] bg-surface-100">
            <CardHeader>
              <CardTitle className="text-white">Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#1f1f23', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fafafa', fontSize: 13 }} />
                    <Bar dataKey="likes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="shares" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="comments" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Likes</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> Shares</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Comments</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-white/[0.06] bg-surface-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-zinc-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/[0.02]">
                  <div className={`h-2 w-2 rounded-full ${
                    item.type === 'campaign' ? 'bg-blue-400' :
                    item.type === 'content' ? 'bg-violet-400' :
                    item.type === 'analytics' ? 'bg-emerald-400' : 'bg-zinc-500'
                  }`} />
                  <span className="flex-1 text-sm text-zinc-300">{item.action}</span>
                  <span className="text-xs text-zinc-600">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
