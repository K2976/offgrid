'use client';

import React, { useState } from 'react';
import { Upload, Users, UserPlus, UserMinus, Sparkles, Download, MessageSquare, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';

const segments = [
  { name: 'New Customers', count: 1240, type: 'new' as const, description: 'First-time buyers in the last 30 days', icon: UserPlus, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { name: 'Returning', count: 3680, type: 'returning' as const, description: 'Customers with 2+ purchases', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Inactive', count: 890, type: 'inactive' as const, description: 'No activity in last 60 days', icon: UserMinus, color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

const contacts = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', segment: 'Returning', lastActive: '2 days ago', totalSpend: 1250 },
  { id: '2', name: 'Mike Chen', email: 'mike@startup.io', segment: 'New', lastActive: '1 day ago', totalSpend: 89 },
  { id: '3', name: 'Emily Davis', email: 'emily@corp.com', segment: 'Returning', lastActive: '5 days ago', totalSpend: 3400 },
  { id: '4', name: 'Alex Kumar', email: 'alex@design.co', segment: 'Inactive', lastActive: '45 days ago', totalSpend: 620 },
  { id: '5', name: 'Lisa Park', email: 'lisa@agency.com', segment: 'New', lastActive: 'Today', totalSpend: 150 },
  { id: '6', name: 'James Wilson', email: 'james@brand.com', segment: 'Inactive', lastActive: '62 days ago', totalSpend: 275 },
];

const aiSuggestions = [
  { title: 'Win back inactive users', desc: 'Send a personalized "We miss you" email with a 15% discount code to the 890 inactive users.', action: 'Generate Email' },
  { title: 'Reward loyal customers', desc: 'Your top 50 returning customers spent $2K+ each. Offer exclusive early access to new products.', action: 'Create Campaign' },
  { title: 'Nurture new customers', desc: 'New buyers have a 40% chance of returning within 30 days with a follow-up email sequence.', action: 'Setup Sequence' },
];

export default function AudiencePage() {
  const [csvUploaded, setCsvUploaded] = useState(false);

  return (
    <div>
      <Header title="Audience / CRM" subtitle="Understand and engage your customer segments" />

      <div className="mt-6 space-y-6 px-8 pb-8">
        {/* Upload + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/[0.12] bg-white/[0.02] px-4 py-2.5 text-sm text-zinc-400 transition-all hover:border-brand-500/30 hover:bg-brand-500/5 hover:text-brand-300">
            <Upload className="h-4 w-4" />
            Upload CSV
            <input type="file" accept=".csv" className="hidden" onChange={() => setCsvUploaded(true)} />
          </label>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/[0.1] text-zinc-300 hover:bg-white/[0.04]">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button variant="outline" className="border-white/[0.1] text-zinc-300 hover:bg-white/[0.04]">
              <MessageSquare className="mr-2 h-4 w-4" /> Generate Message
            </Button>
          </div>
        </div>

        {/* Segments */}
        <div className="grid gap-4 md:grid-cols-3">
          {segments.map((seg) => (
            <Card key={seg.name} className="border-white/[0.06] bg-surface-100 transition-all hover:border-white/[0.12]">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${seg.bg}`}>
                    <seg.icon className={`h-5 w-5 ${seg.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{seg.count.toLocaleString()}</p>
                    <p className="text-sm text-zinc-500">{seg.name}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-600">{seg.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Suggestions */}
        <div className="ai-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">AI Re-engagement Ideas</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {aiSuggestions.map((sug, i) => (
              <div key={i} className="flex flex-col justify-between rounded-lg border border-white/[0.06] bg-surface-0/50 p-4">
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-zinc-200">{sug.title}</h3>
                  <p className="text-xs leading-relaxed text-zinc-500">{sug.desc}</p>
                </div>
                <Button size="sm" variant="ghost" className="mt-3 w-fit text-brand-400 hover:text-brand-300">
                  {sug.action} →
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Contacts Table */}
        <Card className="overflow-hidden border-white/[0.06] bg-surface-100">
          <CardHeader>
            <CardTitle className="text-white">Contacts</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Segment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Last Active</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Total Spend</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-3 font-medium text-white">{c.name}</td>
                    <td className="px-6 py-3 text-zinc-400">{c.email}</td>
                    <td className="px-6 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.segment === 'New' ? 'bg-emerald-500/20 text-emerald-400' :
                        c.segment === 'Returning' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>{c.segment}</span>
                    </td>
                    <td className="px-6 py-3 text-zinc-500">{c.lastActive}</td>
                    <td className="px-6 py-3 text-right font-medium text-zinc-300">${c.totalSpend.toLocaleString()}</td>
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
