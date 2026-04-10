'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';

const campaigns = [
  { id: '1', name: 'Summer Boost 2026', platform: 'Instagram', budget: 5000, status: 'active' as const, performance: 85, goal: 'Awareness', startDate: 'Jun 1', endDate: 'Aug 31' },
  { id: '2', name: 'SEO Content Push', platform: 'SEO', budget: 3200, status: 'active' as const, performance: 72, goal: 'Traffic', startDate: 'May 1', endDate: 'Jul 31' },
  { id: '3', name: 'LinkedIn Thought Leader', platform: 'LinkedIn', budget: 1800, status: 'active' as const, performance: 64, goal: 'Engagement', startDate: 'Apr 1', endDate: 'Jun 30' },
  { id: '4', name: 'Google Ads Retarget', platform: 'Google Ads', budget: 8500, status: 'paused' as const, performance: 45, goal: 'Sales', startDate: 'Mar 1', endDate: 'May 31' },
  { id: '5', name: 'Product Launch Blast', platform: 'Multi-platform', budget: 12000, status: 'draft' as const, performance: 0, goal: 'Awareness', startDate: 'Jul 1', endDate: 'Jul 31' },
  { id: '6', name: 'Spring Email Series', platform: 'Email', budget: 600, status: 'completed' as const, performance: 92, goal: 'Sales', startDate: 'Mar 1', endDate: 'Apr 15' },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  paused: { label: 'Paused', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  completed: { label: 'Completed', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  draft: { label: 'Draft', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
};

export default function CampaignsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [open, setOpen] = useState(false);

  const filtered = campaigns.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <Header title="Campaigns" subtitle="Manage and monitor your marketing campaigns" />

      <div className="mt-6 space-y-6 px-8 pb-8">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-72 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
              />
            </div>
            <div className="flex gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] p-1">
              {['all', 'active', 'paused', 'completed', 'draft'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                    filterStatus === s
                      ? 'bg-brand-500 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
                <Plus className="mr-2 h-4 w-4" /> Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/[0.1] bg-surface-100 text-white sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2"><Label className="text-zinc-300">Campaign Name</Label><Input placeholder="e.g. Summer Product Launch" className="border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-600" /></div>
                <div className="space-y-2"><Label className="text-zinc-300">Goal</Label>
                  <select className="flex h-10 w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-3 text-sm text-white outline-none">
                    <option value="awareness">Brand Awareness</option>
                    <option value="traffic">Drive Traffic</option>
                    <option value="sales">Increase Sales</option>
                    <option value="engagement">Boost Engagement</option>
                  </select>
                </div>
                <div className="space-y-2"><Label className="text-zinc-300">Budget ($)</Label><Input type="number" placeholder="5000" className="border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-600" /></div>
                <div className="space-y-2"><Label className="text-zinc-300">Platform</Label>
                  <select className="flex h-10 w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-3 text-sm text-white outline-none">
                    <option>Instagram</option><option>Google Ads</option><option>LinkedIn</option><option>Facebook</option><option>SEO</option><option>Email</option><option>Multi-platform</option>
                  </select>
                </div>
                <Button onClick={() => setOpen(false)} className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white">
                  Create Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card className="border-white/[0.06] bg-surface-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Campaign</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Platform</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Budget</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Performance</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Schedule</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-xs text-zinc-500">{c.goal}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{c.platform}</td>
                    <td className="px-6 py-4 font-medium text-zinc-300">${c.budget.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusConfig[c.status].color}`}>
                        {statusConfig[c.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all"
                            style={{ width: `${c.performance}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500">{c.performance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">{c.startDate} — {c.endDate}</td>
                    <td className="px-6 py-4">
                      <button className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
