'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Sparkles, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const trafficData = [
  { date: 'Apr 1', visits: 3200, organic: 2100, paid: 1100 },
  { date: 'Apr 2', visits: 3800, organic: 2400, paid: 1400 },
  { date: 'Apr 3', visits: 4100, organic: 2800, paid: 1300 },
  { date: 'Apr 4', visits: 3600, organic: 2200, paid: 1400 },
  { date: 'Apr 5', visits: 5200, organic: 3600, paid: 1600 },
  { date: 'Apr 6', visits: 4800, organic: 3200, paid: 1600 },
  { date: 'Apr 7', visits: 4200, organic: 2800, paid: 1400 },
];

const conversionData = [
  { date: 'Apr 1', conversions: 42, rate: 3.2 },
  { date: 'Apr 2', conversions: 55, rate: 3.8 },
  { date: 'Apr 3', conversions: 48, rate: 3.5 },
  { date: 'Apr 4', conversions: 62, rate: 4.1 },
  { date: 'Apr 5', conversions: 78, rate: 4.5 },
  { date: 'Apr 6', conversions: 65, rate: 4.0 },
  { date: 'Apr 7', conversions: 71, rate: 4.3 },
];

const engagementData = [
  { date: 'Apr 1', rate: 4.2, likes: 820, comments: 145 },
  { date: 'Apr 2', rate: 3.8, likes: 690, comments: 120 },
  { date: 'Apr 3', rate: 5.1, likes: 1050, comments: 210 },
  { date: 'Apr 4', rate: 4.5, likes: 880, comments: 175 },
  { date: 'Apr 5', rate: 6.2, likes: 1200, comments: 280 },
  { date: 'Apr 6', rate: 5.0, likes: 950, comments: 195 },
  { date: 'Apr 7', rate: 5.5, likes: 1080, comments: 230 },
];

const insights = [
  { title: 'CTR improved by 23%', desc: 'Your click-through rate jumped after switching to shorter subject lines in email campaigns.', impact: 'positive' },
  { title: 'Drop-off at checkout page', desc: '38% of users leave at the checkout step. Consider simplifying the form or adding trust signals.', impact: 'negative' },
  { title: 'Instagram Reels outperforming', desc: 'Reels generate 3.2x more reach than static images. Increase video content allocation.', impact: 'positive' },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [platform, setPlatform] = useState('all');

  const tooltipStyle = { background: '#1f1f23', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fafafa', fontSize: 13 };

  return (
    <div>
      <Header title="Analytics" subtitle="Track your marketing performance" />

      <div className="mt-6 space-y-6 px-8 pb-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-white/[0.08] bg-white/[0.03] p-1">
            {['7d', '30d', '90d', '1y'].map((d) => (
              <button key={d} onClick={() => setDateRange(d)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${dateRange === d ? 'bg-brand-500 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
                {d === '7d' ? '7 Days' : d === '30d' ? '30 Days' : d === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-white/[0.08] bg-white/[0.03] p-1">
            {['all', 'instagram', 'google', 'linkedin', 'email'].map((p) => (
              <button key={p} onClick={() => setPlatform(p)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all ${platform === p ? 'bg-brand-500 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Traffic */}
          <Card className="border-white/[0.06] bg-surface-100 xl:col-span-1">
            <CardHeader><CardTitle className="text-white">Traffic</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="visits" stroke="#3b82f6" fillOpacity={1} fill="url(#tGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Conversions */}
          <Card className="border-white/[0.06] bg-surface-100">
            <CardHeader><CardTitle className="text-white">Conversions</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="conversions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Engagement */}
          <Card className="border-white/[0.06] bg-surface-100">
            <CardHeader><CardTitle className="text-white">Engagement Rate</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="ai-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">AI Insights</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {insights.map((insight, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-surface-0/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  {insight.impact === 'positive' ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-rose-400" />
                  )}
                  <span className="text-sm font-semibold text-zinc-200">{insight.title}</span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-500">{insight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
