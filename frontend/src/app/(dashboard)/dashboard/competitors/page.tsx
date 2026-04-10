'use client';

import React, { useState } from 'react';
import { Swords, Plus, Trash2, Eye, TrendingUp, BarChart2, Activity } from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui/ui-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import styles from '../../dashboard.module.css';

const mockCompetitors = [
  { id: '1', name: 'CompetitorX', platforms: { instagram: '@competitorx', website: 'competitorx.com' }, auto_detected: false, tracking_since: '2026-03-01' },
  { id: '2', name: 'MarketGuru', platforms: { instagram: '@marketguru', linkedin: 'marketguru' }, auto_detected: true, tracking_since: '2026-03-15' },
];

const mockAnalysis = {
  competitor: 'CompetitorX',
  metrics: { posting_frequency: 4.2, avg_engagement_rate: 6.1, follower_growth: 5.3, content_types: { reels: 45, carousels: 30, static: 25 } },
  campaigns_detected: [{ name: 'Spring Sale Campaign', detected_at: '2026-04-01', post_count: 8, avg_engagement: 7.2 }],
  why_winning: 'CompetitorX publishes 3x more Reels than you (45% vs 10%), driving 2x higher reach. Their campaign-based posting strategy creates engagement bursts that boost algorithmic visibility.',
  counter_strategies: [
    { strategy: 'Increase reel production to 4/week', reasoning: 'Reels have 2.5x higher reach than static posts', priority: 'high' },
    { strategy: 'Launch a counter-campaign around your AI features', reasoning: 'Differentiate from their discount-based strategy', priority: 'medium' },
  ],
};

const comparisonData = [
  { metric: 'Engagement', You: 3.4, Competitor: 6.1 },
  { metric: 'Growth (%)', You: 2.1, Competitor: 5.3 },
  { metric: 'Posts/Wk', You: 2.5, Competitor: 4.2 },
];

export default function CompetitorsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newHandle, setNewHandle] = useState('');

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Competitor Analysis</h1>
          <p className={styles.pageSubtitle}>Track and compare your performance against market rivals.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} data-testid="add-competitor-button">
          <Plus size={16} /> Add Competitor
        </Button>
      </div>

      {showAdd && (
        <Card style={{ marginBottom: 'var(--spacing-xl)', background: 'var(--bg-surface-raised)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Name</label>
              <input 
                value={newName} onChange={(e) => setNewName(e.target.value)} 
                placeholder="Competitor Name" 
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-strong)', outline: 'none', background: '#fff' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Instagram Handle</label>
              <input 
                value={newHandle} onChange={(e) => setNewHandle(e.target.value)} 
                placeholder="@handle" 
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-strong)', outline: 'none', background: '#fff' }}
              />
            </div>
            <Button data-testid="add-competitor-submit" onClick={() => { setShowAdd(false); setNewName(''); setNewHandle(''); }}>
              Track
            </Button>
          </div>
        </Card>
      )}

      {/* Competitors List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        {mockCompetitors.map((c) => (
          <Card 
            key={c.id} 
            style={{ 
              cursor: 'pointer', 
              border: selectedId === c.id ? '2px solid var(--color-primary)' : '1px solid var(--border-default)' 
            }} 
            onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Swords size={18} color={selectedId === c.id ? "var(--color-primary)" : "var(--text-tertiary)"} />
                  <strong style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{c.name}</strong>
                  {c.auto_detected && <Badge color="info">AUTO</Badge>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                  {Object.entries(c.platforms).map(([k, v]) => (
                    <span key={k} style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                       <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{k}:</span> {v}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedId(c.id); }}><Eye size={16} /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis Section (shown when a competitor is clicked) */}
      {selectedId && (
        <Card style={{ marginTop: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--border-default)' }}>
             <BarChart2 size={24} color="var(--color-primary)" />
             <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
               Analysis vs {mockAnalysis.competitor}
             </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
            {/* Comparison Chart */}
            <div>
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Head-to-Head Comparison</h3>
              <div style={{ height: 250, width: '100%', background: 'var(--bg-surface-raised)', borderRadius: 8, padding: 'var(--spacing-md)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-subtle)" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                    <YAxis dataKey="metric" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} width={80} />
                    <Tooltip cursor={{ fill: 'var(--border-default)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)' }} />
                    <Legend />
                    <Bar dataKey="You" fill="var(--color-accent)" radius={[0, 4, 4, 0]} barSize={12} />
                    <Bar dataKey="Competitor" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Why They're Winning & Action Alerts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div style={{ background: 'var(--color-warning-bg)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', borderLeft: '4px solid var(--color-warning)' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                   <Activity size={16} color="var(--color-warning)" />
                   Intel: Why {mockAnalysis.competitor} is Winning
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {mockAnalysis.why_winning}
                </p>
              </div>

              <div>
                <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-md)', fontWeight: 600 }}>⚡ Recommended Counter Strategies</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {mockAnalysis.counter_strategies.map((s, i) => (
                    <div key={i} style={{ padding: 'var(--spacing-md)', border: '1px solid var(--border-default)', borderLeft: `4px solid ${s.priority === 'high' ? 'var(--color-danger)' : 'var(--color-warning)'}`, background: 'var(--bg-surface-raised)', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 4 }}>
                        <Badge color={s.priority === 'high' ? 'danger' : 'warning'}>{s.priority}</Badge>
                        <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{s.strategy}</strong>
                      </div>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', paddingLeft: 60 }}>{s.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
