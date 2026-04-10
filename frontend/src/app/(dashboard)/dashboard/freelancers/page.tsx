'use client';

import React, { useState } from 'react';
import { Star, Trophy, DollarSign, BarChart3, Link2, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';

const freelancers = [
  { id: '1', name: 'Priya Sharma', avatar: 'PS', skills: ['SEO', 'Content Writing', 'Analytics'], rating: 4.9, hourlyRate: 65, completedProjects: 42, availability: 'available' as const, earnings: 18500 },
  { id: '2', name: 'Alex Rivera', avatar: 'AR', skills: ['Google Ads', 'Facebook Ads', 'PPC'], rating: 4.8, hourlyRate: 80, completedProjects: 35, availability: 'available' as const, earnings: 24000 },
  { id: '3', name: 'Jordan Lee', avatar: 'JL', skills: ['Social Media', 'Branding', 'Video'], rating: 4.7, hourlyRate: 55, completedProjects: 28, availability: 'busy' as const, earnings: 12300 },
  { id: '4', name: 'Maya Chen', avatar: 'MC', skills: ['Email Marketing', 'CRM', 'Automation'], rating: 4.9, hourlyRate: 70, completedProjects: 51, availability: 'available' as const, earnings: 31000 },
  { id: '5', name: 'Sam Williams', avatar: 'SW', skills: ['PR', 'Content Strategy', 'Branding'], rating: 4.6, hourlyRate: 60, completedProjects: 19, availability: 'unavailable' as const, earnings: 8500 },
  { id: '6', name: 'Zara Khan', avatar: 'ZK', skills: ['Video Production', 'Social Media', 'Ads'], rating: 4.8, hourlyRate: 75, completedProjects: 33, availability: 'available' as const, earnings: 21000 },
];

const myCampaigns = [
  { id: '1', campaignName: 'Summer SEO Push', client: 'TechStart Inc.', status: 'active' as const, referralLink: 'https://offgrid.io/ref/abc123', conversions: 24, earnings: 1200 },
  { id: '2', campaignName: 'LinkedIn Content', client: 'GrowthCo', status: 'active' as const, referralLink: 'https://offgrid.io/ref/def456', conversions: 18, earnings: 900 },
  { id: '3', campaignName: 'Email Retargeting', client: 'BrandX', status: 'completed' as const, referralLink: 'https://offgrid.io/ref/ghi789', conversions: 42, earnings: 2100 },
  { id: '4', campaignName: 'Google Ads Setup', client: 'StartupXYZ', status: 'pending' as const, referralLink: 'https://offgrid.io/ref/jkl012', conversions: 0, earnings: 0 },
];

const leaderboard = [
  { rank: 1, name: 'Maya Chen', conversions: 156, earnings: 31000 },
  { rank: 2, name: 'Alex Rivera', conversions: 142, earnings: 24000 },
  { rank: 3, name: 'Zara Khan', conversions: 128, earnings: 21000 },
  { rank: 4, name: 'Priya Sharma', conversions: 115, earnings: 18500 },
  { rank: 5, name: 'Jordan Lee', conversions: 89, earnings: 12300 },
];

const availabilityConfig = {
  available: { label: 'Available', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  busy: { label: 'Busy', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  unavailable: { label: 'Unavailable', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
};

export default function FreelancersPage() {
  return (
    <div>
      <Header title="Freelancers" subtitle="Browse talent and manage freelance campaigns" />

      <div className="mt-6 px-8 pb-8">
        <Tabs defaultValue="businesses" className="w-full">
          <TabsList className="h-11 border-white/[0.08] bg-white/[0.03] p-1">
            <TabsTrigger value="businesses" className="data-[state=active]:bg-brand-500 data-[state=active]:text-white">For Businesses</TabsTrigger>
            <TabsTrigger value="freelancers" className="data-[state=active]:bg-brand-500 data-[state=active]:text-white">For Freelancers</TabsTrigger>
          </TabsList>

          {/* Business Tab */}
          <TabsContent value="businesses" className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {freelancers.map((f) => (
                <Card key={f.id} className="border-white/[0.06] bg-surface-100 transition-all hover:border-white/[0.12] hover:shadow-lg">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-bold text-white">
                        {f.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{f.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-sm text-zinc-400">{f.rating}</span>
                          <span className="text-xs text-zinc-600">· {f.completedProjects} projects</span>
                        </div>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${availabilityConfig[f.availability].color}`}>
                        {availabilityConfig[f.availability].label}
                      </span>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {f.skills.map((s) => (
                        <span key={s} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-zinc-400">{s}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">${f.hourlyRate}<span className="text-sm font-normal text-zinc-500">/hr</span></span>
                      <Button size="sm" className="bg-brand-500 text-white hover:bg-brand-600">
                        Assign Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Leaderboard */}
            <Card className="border-white/[0.06] bg-surface-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5 text-amber-400" /> Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.map((entry) => (
                    <div key={entry.rank} className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-white/[0.02]">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        entry.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                        entry.rank === 2 ? 'bg-zinc-400/20 text-zinc-300' :
                        entry.rank === 3 ? 'bg-amber-700/20 text-amber-600' :
                        'bg-white/[0.06] text-zinc-500'
                      }`}>
                        #{entry.rank}
                      </span>
                      <span className="flex-1 font-medium text-zinc-200">{entry.name}</span>
                      <span className="text-sm text-zinc-500">{entry.conversions} conversions</span>
                      <span className="font-semibold text-emerald-400">${entry.earnings.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Freelancer Tab */}
          <TabsContent value="freelancers" className="mt-6 space-y-6">
            {/* Earnings Overview */}
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Total Earnings', value: '$4,200', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Active Campaigns', value: '2', icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Total Conversions', value: '84', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((s) => (
                <Card key={s.label} className="border-white/[0.06] bg-surface-100">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}>
                      <s.icon className={`h-6 w-6 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{s.value}</p>
                      <p className="text-sm text-zinc-500">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* My Campaigns */}
            <Card className="overflow-hidden border-white/[0.06] bg-surface-100">
              <CardHeader>
                <CardTitle className="text-white">My Campaigns</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Referral Link</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Conversions</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myCampaigns.map((c) => (
                      <tr key={c.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-medium text-white">{c.campaignName}</td>
                        <td className="px-6 py-3 text-zinc-400">{c.client}</td>
                        <td className="px-6 py-3">
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                            c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            c.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}>{c.status}</span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Link2 className="h-3 w-3" />
                            <span className="max-w-[160px] truncate">{c.referralLink}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right text-zinc-300">{c.conversions}</td>
                        <td className="px-6 py-3 text-right font-medium text-emerald-400">${c.earnings.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
