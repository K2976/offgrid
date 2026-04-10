'use client';

import React from 'react';
import { 
  Users, 
  MousePointerClick, 
  BarChart2, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, Badge, StatCard } from '@/components/ui/ui-components';
import { formatNumber, formatPercent } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from '../dashboard.module.css';

const kpis = [
  { label: 'Web Visits', value: '45.2K', change: '12%', trend: 'up' as const },
  { label: 'Conversion Rate', value: '3.4%', change: '0.2%', trend: 'up' as const },
  { label: 'Campaign Clicks', value: '12.1K', change: '4%', trend: 'down' as const },
  { label: 'Engagement', value: '8.2%', change: '1.4%', trend: 'up' as const },
];

const analyticsData = [
  { day: 'Mon', organic: 4000, referral: 2400, direct: 2400 },
  { day: 'Tue', organic: 3000, referral: 1398, direct: 2210 },
  { day: 'Wed', organic: 2000, referral: 9800, direct: 2290 },
  { day: 'Thu', organic: 2780, referral: 3908, direct: 2000 },
  { day: 'Fri', organic: 1890, referral: 4800, direct: 2181 },
  { day: 'Sat', organic: 2390, referral: 3800, direct: 2500 },
  { day: 'Sun', organic: 3490, referral: 4300, direct: 2100 },
];

const trafficTable = [
  { channel: 'Google', sessions: 24500, time: '02:14', rate: '4.2%', progress: 85 },
  { channel: 'Facebook', sessions: 12300, time: '01:45', rate: '2.8%', progress: 45 },
  { channel: 'Direct', sessions: 8400, time: '03:10', rate: '5.1%', progress: 30 },
  { channel: 'Email', sessions: 5200, time: '04:20', rate: '6.4%', progress: 20 },
];

export default function DashboardPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back, here is what is happening today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.pageGrid} style={{ marginBottom: 'var(--spacing-xl)' }}>
        {kpis.map((k) => (
          <StatCard 
            key={k.label} 
            label={k.label} 
            value={k.value} 
            change={k.change} 
            trend={k.trend} 
          />
        ))}
      </div>

      {/* Web Analytics Chart */}
      <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xl)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Web Analytics</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-md)' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>124.5K</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Page Views</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>02:14</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Avg. Visit Duration</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <Badge color="primary">Organic</Badge>
            <Badge color="info">Referral</Badge>
            <Badge color="warning">Direct</Badge>
          </div>
        </div>

        <div style={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)' }} 
              />
              <Line type="monotone" dataKey="organic" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="referral" stroke="var(--color-accent)" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="direct" stroke="var(--color-warning)" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Traffic + Channel Data */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)' }}>
        {/* Left: Traffic Table */}
        <Card>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>Traffic Sources</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
              <thead style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
                <tr>
                  <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Channel</th>
                  <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Sessions</th>
                  <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Traffic %</th>
                  <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Avg. Time</th>
                  <th style={{ paddingBottom: 'var(--spacing-md)', fontWeight: 500 }}>Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {trafficTable.map((row) => (
                  <tr key={row.channel} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--spacing-md) 0', fontWeight: 500 }}>{row.channel}</td>
                    <td style={{ padding: 'var(--spacing-md) 0' }}>{formatNumber(row.sessions)}</td>
                    <td style={{ padding: 'var(--spacing-md) 0', width: 140 }}>
                      <div style={{ width: '100%', height: 6, background: 'var(--bg-surface-raised)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${row.progress}%`, height: '100%', background: 'var(--color-primary)' }} />
                      </div>
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0' }}>{row.time}</td>
                    <td style={{ padding: 'var(--spacing-md) 0' }}>{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: Top Channels Card */}
        <Card>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Top Channels</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>50.4K</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>Total Visitors</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {trafficTable.slice(0, 3).map((row, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginBottom: 4 }}>
                    <span style={{ fontWeight: 500 }}>{row.channel}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{formatNumber(row.sessions)}</span>
                  </div>
                  <div style={{ width: '100%', height: 8, background: 'var(--bg-surface-raised)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${row.progress}%`, 
                      height: '100%', 
                      background: idx === 0 ? 'var(--color-primary)' : idx === 1 ? 'var(--color-accent)' : 'var(--color-success)' 
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Autopilot Insights */}
      <Card style={{ marginTop: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
             Autopilot Insights
          </h3>
          <Badge color="success">Live</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
           <div style={{ background: 'var(--bg-surface-raised)', padding: 'var(--spacing-md)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
             <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Action Recommended</h4>
             <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Publish your scheduled LinkedIn article. Reach today is tracking 12% higher than average.</p>
           </div>
           <div style={{ background: 'var(--bg-surface-raised)', padding: 'var(--spacing-md)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
             <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Engagement Alert</h4>
             <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>You have 3 unread high-priority DMs on Instagram from potential leads.</p>
           </div>
           <div style={{ background: 'var(--bg-surface-raised)', padding: 'var(--spacing-md)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
             <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Content Idea</h4>
             <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Based on trending topics in your sector, consider a post about "Remote Work Tools".</p>
           </div>
        </div>
      </Card>
    </div>
  );
}
