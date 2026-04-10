'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Link2, Unlink, CreditCard, Shield, Building, User, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/stores/auth-store';

const integrations = [
  { platform: 'Instagram', status: 'active', username: '@offgrid', connectedAt: 'Mar 1, 2026', icon: '📸' },
  { platform: 'LinkedIn', status: 'active', username: 'OffGrid Inc.', connectedAt: 'Mar 5, 2026', icon: '💼' },
  { platform: 'Google Analytics', status: 'disconnected', username: '', connectedAt: '', icon: '📊' },
  { platform: 'Google Search Console', status: 'disconnected', username: '', connectedAt: '', icon: '🔍' },
  { platform: 'Facebook Ads', status: 'active', username: 'OffGrid', connectedAt: 'Mar 10, 2026', icon: '📘' },
  { platform: 'Twitter/X', status: 'disconnected', username: '', connectedAt: '', icon: '🐦' },
];

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  return (
    <div>
      <Header title="Settings" subtitle="Manage your workspace and preferences" />

      <div className="mt-6 px-8 pb-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="h-11 border-white/[0.08] bg-white/[0.03] p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-brand-500 data-[state=active]:text-white">
              <Building className="mr-2 h-4 w-4" /> Business Profile
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-brand-500 data-[state=active]:text-white">
              <Link2 className="mr-2 h-4 w-4" /> Integrations
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-brand-500 data-[state=active]:text-white">
              <CreditCard className="mr-2 h-4 w-4" /> Billing
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-brand-500 data-[state=active]:text-white">
              <Shield className="mr-2 h-4 w-4" /> Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card className="border-white/[0.06] bg-surface-100">
              <CardHeader><CardTitle className="text-white">Business Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-xl font-bold text-white">
                    {user?.name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user?.name || 'OffGrid'}</p>
                    <p className="text-sm text-zinc-500">{user?.email || 'team@offgrid.io'}</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label className="text-zinc-300">Business Name</Label><Input defaultValue="OffGrid Inc." className="border-white/[0.1] bg-white/[0.04] text-white" /></div>
                  <div className="space-y-2"><Label className="text-zinc-300">Industry</Label><Input defaultValue="Marketing Technology" className="border-white/[0.1] bg-white/[0.04] text-white" /></div>
                  <div className="space-y-2"><Label className="text-zinc-300">Website</Label><Input defaultValue="https://offgrid.io" className="border-white/[0.1] bg-white/[0.04] text-white" /></div>
                  <div className="space-y-2"><Label className="text-zinc-300">Location</Label><Input defaultValue="San Francisco, CA" className="border-white/[0.1] bg-white/[0.04] text-white" /></div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="flex items-center gap-2 text-sm font-medium text-zinc-300"><Bell className="h-4 w-4" /> Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Email notifications', desc: 'Receive alerts and reports via email', state: emailNotif, set: setEmailNotif },
                      { label: 'Push notifications', desc: 'Browser push for real-time alerts', state: pushNotif, set: setPushNotif },
                      { label: 'Weekly digest', desc: 'Summary of performance every Monday', state: weeklyReport, set: setWeeklyReport },
                    ].map((n) => (
                      <div key={n.label} className="flex items-center justify-between rounded-lg bg-white/[0.02] p-3">
                        <div>
                          <p className="text-sm font-medium text-zinc-200">{n.label}</p>
                          <p className="text-xs text-zinc-600">{n.desc}</p>
                        </div>
                        <Switch checked={n.state} onCheckedChange={n.set} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="mt-6 space-y-4">
            {integrations.map((int) => (
              <Card key={int.platform} className="border-white/[0.06] bg-surface-100">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{int.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{int.platform}</p>
                      {int.username && <p className="text-sm text-zinc-500">{int.username}</p>}
                      {int.connectedAt && <p className="text-xs text-zinc-600">Connected {int.connectedAt}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={int.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'}>
                      {int.status === 'active' ? 'Connected' : 'Disconnected'}
                    </Badge>
                    <Button size="sm" variant={int.status === 'active' ? 'outline' : 'default'} className={int.status === 'active' ? 'border-white/[0.1] text-zinc-300' : 'bg-brand-500 text-white'}>
                      {int.status === 'active' ? <><Unlink className="mr-1.5 h-3.5 w-3.5" /> Disconnect</> : <><Link2 className="mr-1.5 h-3.5 w-3.5" /> Connect</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="mt-6 space-y-6">
            <Card className="border-white/[0.06] bg-surface-100">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Pro Plan</h3>
                    <p className="text-sm text-zinc-500">$49/month · Billed monthly</p>
                  </div>
                  <Badge className="bg-brand-500/20 text-brand-400 border-brand-500/30">Active</Badge>
                </div>
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-white/[0.03] p-4">
                    <p className="text-xs text-zinc-500">AI Generations</p>
                    <p className="mt-1 text-xl font-bold text-white">247 <span className="text-sm font-normal text-zinc-500">/ 500</span></p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-4">
                    <p className="text-xs text-zinc-500">Active Campaigns</p>
                    <p className="mt-1 text-xl font-bold text-white">7 <span className="text-sm font-normal text-zinc-500">/ 20</span></p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-4">
                    <p className="text-xs text-zinc-500">Team Members</p>
                    <p className="mt-1 text-xl font-bold text-white">3 <span className="text-sm font-normal text-zinc-500">/ 10</span></p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-white/[0.1] text-zinc-300">Manage Subscription</Button>
                  <Button variant="outline" className="border-white/[0.1] text-zinc-300">Update Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy" className="mt-6 space-y-6">
            <Card className="border-white/[0.06] bg-surface-100">
              <CardHeader><CardTitle className="text-white">Privacy & Data</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-white/[0.03] p-4">
                  <h4 className="mb-1 text-sm font-medium text-zinc-200">Data Retention</h4>
                  <p className="text-xs text-zinc-500">Your analytics data is retained for 12 months. Campaign data is retained indefinitely.</p>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-4">
                  <h4 className="mb-1 text-sm font-medium text-zinc-200">Export Your Data</h4>
                  <p className="mb-3 text-xs text-zinc-500">Download a complete copy of your account data including campaigns, analytics, and content.</p>
                  <Button size="sm" variant="outline" className="border-white/[0.1] text-zinc-300">Request Export</Button>
                </div>
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
                  <h4 className="mb-1 text-sm font-medium text-rose-300">Delete Account</h4>
                  <p className="mb-3 text-xs text-zinc-500">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <Button size="sm" variant="outline" className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
