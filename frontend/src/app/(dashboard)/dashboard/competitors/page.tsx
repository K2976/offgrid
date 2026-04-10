'use client';

import React, { useState } from 'react';
import { Swords, Plus, Trash2, Eye } from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui/ui-components';
import styles from '../../dashboard.module.css';

const mockCompetitors = [
  { id: '1', name: 'CompetitorX', platforms: { instagram: '@competitorx', website: 'https://competitorx.com' }, auto_detected: false, tracking_since: '2026-03-01' },
  { id: '2', name: 'MarketGuru', platforms: { instagram: '@marketguru', linkedin: 'company/marketguru' }, auto_detected: true, tracking_since: '2026-03-15' },
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

export default function CompetitorsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newHandle, setNewHandle] = useState('');

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h1 className={styles.pageTitle}>Competitors</h1>
        <Button onClick={() => setShowAdd(!showAdd)} data-testid="add-competitor-button">
          <Plus size={16} /> Add Competitor
        </Button>
      </div>

      {showAdd && (
        <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-end' }}>
            <Input label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="CompetitorX" data-testid="add-competitor-name-input" />
            <Input label="Instagram Handle" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} placeholder="@handle" data-testid="add-competitor-handle-input" />
            <Button data-testid="add-competitor-submit" onClick={() => { setShowAdd(false); setNewName(''); setNewHandle(''); }}>Track</Button>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {mockCompetitors.map((c) => (
          <Card key={c.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Swords size={16} color="var(--color-primary-light)" />
                  <strong style={{ fontSize: 'var(--font-size-lg)' }}>{c.name}</strong>
                  {c.auto_detected && <Badge color="info">AUTO</Badge>}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 4 }}>
                  {Object.entries(c.platforms).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedId(c.id); }}><Eye size={14} /> Analyze</Button>
                <Button variant="ghost" size="sm"><Trash2 size={14} /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedId && (
        <Card style={{ marginTop: 'var(--spacing-xl)' }} glow>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-md)' }}>
            ⚔️ Analysis: {mockAnalysis.competitor}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{mockAnalysis.metrics.posting_frequency}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Posts/Week</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-success)' }}>{mockAnalysis.metrics.avg_engagement_rate}%</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Engagement</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-accent)' }}>{mockAnalysis.metrics.follower_growth}%</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Growth</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{mockAnalysis.campaigns_detected.length}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Campaigns</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <h4 style={{ color: 'var(--color-warning)', marginBottom: 'var(--spacing-sm)' }}>🧠 Why They&apos;re Winning</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.7 }}>{mockAnalysis.why_winning}</p>
          </div>

          <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>⚡ Counter Strategies</h4>
          {mockAnalysis.counter_strategies.map((s, i) => (
            <div key={i} style={{ padding: 'var(--spacing-md)', borderLeft: `3px solid ${s.priority === 'high' ? 'var(--color-danger)' : 'var(--color-warning)'}`, background: 'var(--bg-surface-raised)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', marginBottom: 'var(--spacing-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Badge color={s.priority === 'high' ? 'danger' : 'warning'}>{s.priority}</Badge>
                <strong style={{ fontSize: 'var(--font-size-sm)' }}>{s.strategy}</strong>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>{s.reasoning}</p>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
