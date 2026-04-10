'use client';

import React, { useEffect, useState } from 'react';
import { Swords, Plus, Trash2, Eye, BarChart2, Activity, ExternalLink } from 'lucide-react';
import { Card, Button, Badge, EmptyState } from '@/components/ui/ui-components';
import { useCompetitorStore } from '@/stores/app-stores';
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

export default function CompetitorsPage() {
  const { competitors, selectedAnalysis, isLoading, fetchAll, add, remove, fetchAnalysis } = useCompetitorStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newHandle, setNewHandle] = useState('');

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const comparisonData = [
    { metric: 'Engagement', You: 3.4, Competitor: selectedAnalysis?.metrics?.avg_engagement_rate || 0 },
    { metric: 'Growth (%)', You: 2.1, Competitor: selectedAnalysis?.metrics?.follower_growth || 0 },
    { metric: 'Posts/Wk', You: 2.5, Competitor: selectedAnalysis?.metrics?.posting_frequency || 0 },
  ];

  const onTrack = async () => {
    if (!newName.trim()) {
      return;
    }
    await add(newName.trim(), { instagram: newHandle.trim() });
    await fetchAll();
    setShowAdd(false);
    setNewName('');
    setNewHandle('');
  };

  const onSelect = async (id: string) => {
    setSelectedId(id);
    await fetchAnalysis(id);
  };

  const onDelete = async (id: string) => {
    await remove(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
    await fetchAll();
  };

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
            <Button data-testid="add-competitor-submit" onClick={onTrack}>
              Track
            </Button>
          </div>
        </Card>
      )}

      {/* Competitors List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        {!competitors.length && !isLoading && (
          <Card>
            <EmptyState
              icon={<Swords size={18} />}
              title="No competitors tracked"
              description="Add your first competitor to unlock analysis and strategy recommendations."
            />
          </Card>
        )}

        {competitors.map((c) => (
          <Card 
            key={c.id} 
            style={{ 
              cursor: 'pointer', 
              border: selectedId === c.id ? '2px solid var(--color-primary)' : '1px solid var(--border-default)' 
            }} 
            onClick={() => onSelect(c.id)}
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
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); void onSelect(c.id); }}><Eye size={16} /></Button>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); void onDelete(c.id); }}><Trash2 size={16} /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis Section (shown when a competitor is clicked) */}
      {selectedId && selectedAnalysis && (
        <Card style={{ marginTop: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--border-default)' }}>
             <BarChart2 size={24} color="var(--color-primary)" />
             <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
               Analysis vs {selectedAnalysis.competitor}
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
                   Intel: Why {selectedAnalysis.competitor} is Winning
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {selectedAnalysis.why_winning}
                </p>
              </div>

              <div>
                <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-md)', fontWeight: 600 }}>⚡ Recommended Counter Strategies</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {selectedAnalysis.counter_strategies.map((s, i) => (
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

              {!!selectedAnalysis.wikipedia_summary && (
                <div style={{ background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', border: '1px solid var(--border-default)' }}>
                  <h4 style={{ marginBottom: 8, fontSize: 'var(--font-size-md)', fontWeight: 600 }}>Public context source</h4>
                  <p style={{ marginBottom: 8, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {selectedAnalysis.wikipedia_summary}
                  </p>
                  <a href={selectedAnalysis.wikipedia_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)' }}>
                    View on Wikipedia <ExternalLink size={14} />
                  </a>
                </div>
              )}

              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>
                Analysis may use public information sources, including Wikipedia.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
