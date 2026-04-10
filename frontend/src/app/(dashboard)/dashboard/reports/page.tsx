'use client';

import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/ui-components';
import { formatDate } from '@/lib/utils';
import styles from '../../dashboard.module.css';

const mockReports = [
  { id: '1', period: { start: '2026-04-01', end: '2026-04-07' }, generated_at: '2026-04-08T00:05:00Z', download_url: '#', summary: { total_reach: 89000, engagement_rate: 4.7, top_insight: 'Weekend posts outperform weekdays by 68%' } },
  { id: '2', period: { start: '2026-03-25', end: '2026-03-31' }, generated_at: '2026-04-01T00:05:00Z', download_url: '#', summary: { total_reach: 76000, engagement_rate: 4.3, top_insight: 'Competitor launched spring campaign' } },
  { id: '3', period: { start: '2026-03-18', end: '2026-03-24' }, generated_at: '2026-03-25T00:05:00Z', download_url: '#', summary: { total_reach: 82000, engagement_rate: 4.5, top_insight: 'Carousel posts drove 2x more saves' } },
];

export default function ReportsPage() {
  return (
    <div>
      <div className={styles.sectionHeader}>
        <h1 className={styles.pageTitle}>Weekly Reports</h1>
        <Button data-testid="generate-report-button">
          <FileText size={16} /> Generate Report
        </Button>
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {mockReports.map((r) => (
          <Card key={r.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 4 }}>
                  <Calendar size={16} color="var(--color-primary-light)" />
                  <strong>{formatDate(r.period.start)} — {formatDate(r.period.end)}</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Generated {formatDate(r.generated_at)}
                </p>
              </div>
              <Button variant="secondary" size="sm" data-testid={`report-download-${r.id}`}>
                <Download size={14} /> PDF
              </Button>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Reach</span>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{(r.summary.total_reach / 1000).toFixed(0)}K</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Engagement</span>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-success)' }}>{r.summary.engagement_rate}%</div>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Top Insight</span>
                <div style={{ fontSize: 'var(--font-size-sm)' }}>{r.summary.top_insight}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
