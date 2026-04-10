'use client';

import React from 'react';
import { 
  Eye, 
  MousePointerClick, 
  Target, 
  TrendingUp,
  Plus
} from 'lucide-react';
import { Card, Badge, StatCard, Button } from '@/components/ui/ui-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import styles from '../../dashboard.module.css';

const stats = [
  { label: 'Impressions', value: '1.2M', change: '8%', trend: 'up' as const, icon: <Eye size={18} /> },
  { label: 'Clicks', value: '45.2K', change: '12%', trend: 'up' as const, icon: <MousePointerClick size={18} /> },
  { label: 'Conversions', value: '3,420', change: '2.4%', trend: 'up' as const, icon: <Target size={18} /> },
  { label: 'Conversion Rate', value: '7.5%', change: '0.8%', trend: 'down' as const, icon: <TrendingUp size={18} /> },
];

const barData = [
  { name: '18-24', male: 4000, female: 2400 },
  { name: '25-34', male: 3000, female: 1398 },
  { name: '35-44', male: 2000, female: 9800 },
  { name: '45-54', male: 2780, female: 3908 },
  { name: '55+', male: 1890, female: 4800 },
];

const pieData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 300 },
];
const COLORS = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-success)'];

const tableData = [
  { name: 'Summer Campaign', objective: 'Brand Awareness', status: 'Active', budget: '$5,000', schedule: 'Jun 1 - Aug 31', performance: 85 },
  { name: 'Retargeting UI Kit', objective: 'Conversions', status: 'Planned', budget: '$1,200', schedule: 'Sep 1 - Sep 30', performance: 0 },
  { name: 'Spring Promo', objective: 'Lead Gen', status: 'Expired', budget: '$3,400', schedule: 'Mar 1 - May 31', performance: 92 },
];

export default function CampaignsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Campaigns</h1>
          <p className={styles.pageSubtitle}>Monitor and manage your active ad campaigns.</p>
        </div>
        <Button>
          <Plus size={16} /> New Campaign
        </Button>
      </div>

      {/* Top Stats */}
      <div className={styles.pageGrid} style={{ marginBottom: 'var(--spacing-xl)' }}>
        {stats.map((s) => (
          <StatCard 
            key={s.label} 
            label={s.label} 
            value={s.value} 
            change={s.change} 
            trend={s.trend}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Charts Box */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
        <Card>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>Audience Segment</h3>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'var(--bg-surface-raised)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="male" stackId="a" fill="var(--color-primary)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="female" stackId="a" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>Demographics</h3>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
             {pieData.map((entry, index) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-xs)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[index] }} />
                  {entry.name}
                </div>
             ))}
          </div>
        </Card>
      </div>

      {/* Campaign Table */}
      <Card>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>All Campaigns</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
            <thead style={{ color: 'var(--text-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-default)' }}>
              <tr>
                <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Campaign Name</th>
                <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Objective</th>
                <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Status</th>
                <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Budget</th>
                <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Schedule</th>
                <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: 'var(--spacing-md) 0', fontWeight: 500, color: 'var(--text-primary)' }}>{row.name}</td>
                  <td style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)' }}>{row.objective}</td>
                  <td style={{ padding: 'var(--spacing-md) 0' }}>
                    <Badge color={row.status === 'Active' ? 'success' : row.status === 'Planned' ? 'info' : 'warning'}>
                      {row.status}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)' }}>{row.budget}</td>
                  <td style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)' }}>{row.schedule}</td>
                  <td style={{ padding: 'var(--spacing-md) 0', width: 120 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                       <div style={{ width: '100%', height: 6, background: 'var(--bg-surface-raised)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${row.performance}%`, height: '100%', background: 'var(--color-primary)' }} />
                       </div>
                       <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{row.performance}%</span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
