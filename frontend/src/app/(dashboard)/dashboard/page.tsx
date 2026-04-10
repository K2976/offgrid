'use client';

import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Target,
  BarChart2,
  PieChart,
  Megaphone,
  Download,
  Activity,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Search,
  Users
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/ui-components';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import styles from '../dashboard.module.css';

const trafficData = [
  { name: 'Mon', organic: 4000, paid: 2400 },
  { name: 'Tue', organic: 3000, paid: 1398 },
  { name: 'Wed', organic: 2000, paid: 9800 },
  { name: 'Thu', organic: 2780, paid: 3908 },
  { name: 'Fri', organic: 1890, paid: 4800 },
  { name: 'Sat', organic: 2390, paid: 3800 },
  { name: 'Sun', organic: 3490, paid: 4300 },
];

export default function Dashboard() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: '24px', fontWeight: 600 }}>Channel dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Button variant="ghost" size="sm" style={{ border: '1px solid var(--border-default)', borderRadius: '50%', width: 40, height: 40, padding: 0 }}><Activity size={18} /></Button>
          <Button variant="ghost" size="sm" style={{ border: '1px solid var(--border-default)', borderRadius: '50%', width: 40, height: 40, padding: 0 }}><Download size={18} /></Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(350px, 1.2fr)', gap: 'var(--spacing-lg)' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          {/* Latest Video Performance (Mapped to Latest Campaign) */}
          <Card style={{ padding: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Latest campaign performance</h2>
            <div style={{ background: '#000', borderRadius: 8, padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(45deg, rgba(62,166,255,0.1), transparent)', zIndex: 0 }} />
               <div style={{ position: 'relative', zIndex: 1, padding: 'var(--spacing-md)' }}>
                  <Sparkles size={24} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
                  <h3 style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-xl)' }}>LogCipher</h3>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>P.S - Artificial Intelligence based Log Investigation</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)', marginTop: 8 }}>LogCipher | P.S - AI based Log Investigation Framework for Next-Generation Cyber...</p>
               </div>
            </div>
            
            <div style={{ borderBottom: '1px solid var(--border-default)', marginBottom: 'var(--spacing-md)', paddingBottom: 'var(--spacing-md)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: 8, color: 'var(--text-secondary)' }}>
                 <span>First 85 days 1 hour</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                 <span>Views</span>
                 <span style={{ fontWeight: 600 }}>7</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                 <span>Impressions click-through rate</span>
                 <span style={{ fontWeight: 600 }}>2.7%</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 'var(--font-size-sm)' }}>
                 <span>Average view duration</span>
                 <span style={{ fontWeight: 600 }}>1:31</span>
               </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <Button variant="secondary" size="sm" style={{ flex: 1, borderRadius: 20 }}>GO TO VIDEO ANALYTICS</Button>
              <Button variant="secondary" size="sm" style={{ flex: 1, borderRadius: 20 }}>SEE COMMENTS (0)</Button>
            </div>
          </Card>

          {/* Create Post Prompt */}
          <Card style={{ padding: 'var(--spacing-xl)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px dashed var(--border-strong)' }}>
            <div style={{ width: 80, height: 80, background: 'var(--bg-surface-raised)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-md)', position: 'relative' }}>
              <Megaphone size={32} color="var(--color-accent)" />
              <div style={{ position: 'absolute', right: -10, top: 0, width: 24, height: 24, background: '#fff', borderRadius: '50%', border: '2px solid var(--bg-surface)' }} />
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', maxWidth: 200, lineHeight: 1.6 }}>
               Create your first post to start a conversation and get feedback from your community.
            </p>
            <Button variant="secondary" style={{ borderRadius: 20, background: '#fff', color: '#000', fontWeight: 600 }}>Create post</Button>
          </Card>

        </div>


        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          {/* Channel Analytics */}
          <Card style={{ padding: 'var(--spacing-lg)' }}>
             <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: '24px' }}>Channel analytics</h2>
             <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-default)', paddingBottom: '24px' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Current subscribers</div>
                <div style={{ fontSize: '48px', fontWeight: 400, marginTop: '8px' }}>1</div>
             </div>

             <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Summary</h3>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Last 28 days</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                   <span>Views</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>0 <span style={{ color: 'var(--text-tertiary)' }}>—</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                   <span>Watch time (hours)</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>0.0 <span style={{ color: 'var(--text-tertiary)' }}>—</span></span>
                </div>
             </div>

             <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Top content</h3>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Last 48 hours · Views</div>
                {/* Traffic Recharts substitution for top content */}
                <div style={{ height: 120, width: '100%', marginTop: 8 }}>
                   <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: 'none', borderRadius: 4, color: '#fff' }} />
                      <Area type="monotone" dataKey="organic" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorO)" />
                    </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <Button variant="secondary" size="md" style={{ borderRadius: 20, width: 'max-content' }}>GO TO CHANNEL ANALYTICS</Button>
          </Card>

          {/* What's new in Studio */}
          <Card style={{ padding: 'var(--spacing-lg)' }}>
             <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: '24px' }}>What's new in Studio</h2>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <a href="#" style={{ paddingTop: '8px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                   Increasing Shorts length
                </a>
                <a href="#" style={{ paddingTop: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                   Expansion of channel permissions
                </a>
                <a href="#" style={{ paddingTop: '16px', paddingBottom: '16px', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                   Upcoming changes to Community Guidelines warnings
                </a>
             </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
