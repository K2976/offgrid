'use client';

import React from 'react';
import { Bell, AlertTriangle, TrendingDown, Swords } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui/ui-components';
import { formatDateTime } from '@/lib/utils';
import styles from '../../dashboard.module.css';

const mockAlerts = [
  {
    id: '1', type: 'engagement_drop' as const, severity: 'high' as const,
    title: 'Instagram engagement dropped 35% in 24h',
    message: 'Your last 3 posts averaged 2.1% engagement vs your 30d average of 4.7%. This is a significant drop.',
    suggested_action: 'Post a high-engagement format (reel/carousel) within the next 4 hours.',
    created_at: '2026-04-10T08:00:00Z', read: false,
  },
  {
    id: '2', type: 'competitor_activity' as const, severity: 'medium' as const,
    title: 'CompetitorX launched a new campaign',
    message: 'CompetitorX posted 4 coordinated posts in the last 12 hours with #SpringSale. Average engagement: 7.2%.',
    suggested_action: 'Consider launching a counter-campaign highlighting your unique features.',
    created_at: '2026-04-09T14:30:00Z', read: false,
  },
  {
    id: '3', type: 'spike' as const, severity: 'low' as const,
    title: 'Traffic spike detected on landing page',
    message: 'Your landing page received 3x normal traffic in the last 6 hours. Primary source: organic search.',
    suggested_action: 'Run a retargeting campaign to capture this audience.',
    created_at: '2026-04-09T10:00:00Z', read: true,
  },
];

const iconMap = {
  engagement_drop: <TrendingDown size={18} />,
  spike: <TrendingDown size={18} style={{ transform: 'rotate(180deg)' }} />,
  competitor_activity: <Swords size={18} />,
  custom_rule: <Bell size={18} />,
};

const severityMap = { critical: 'danger', high: 'danger', medium: 'warning', low: 'info' } as const;

export default function AlertsPage() {
  return (
    <div>
      <div className={styles.sectionHeader}>
        <h1 className={styles.pageTitle}>Alerts</h1>
        <Badge color="danger">{mockAlerts.filter((a) => !a.read).length} unread</Badge>
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {mockAlerts.map((alert) => (
          <Card
            key={alert.id}
            className={!alert.read ? 'fade-in' : ''}
            style={{
              borderLeft: `4px solid ${['high', 'critical'].includes(alert.severity) ? 'var(--color-danger)' : alert.severity === 'medium' ? 'var(--color-warning)' : 'var(--color-info)'}`,
              opacity: alert.read ? 0.7 : 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                <span style={{ color: alert.severity === 'high' ? 'var(--color-danger)' : 'var(--text-secondary)' }}>
                  {iconMap[alert.type]}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <strong style={{ fontSize: 'var(--font-size-md)' }}>{alert.title}</strong>
                    <Badge color={severityMap[alert.severity]}>{alert.severity}</Badge>
                    {!alert.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 4 }}>{alert.message}</p>
                </div>
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                {formatDateTime(alert.created_at)}
              </span>
            </div>
            {alert.suggested_action && (
              <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--color-primary-glow)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <AlertTriangle size={14} color="var(--color-primary-light)" />
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-light)' }}>{alert.suggested_action}</span>
              </div>
            )}
            <div style={{ marginTop: 'var(--spacing-sm)', display: 'flex', justifyContent: 'flex-end' }}>
              {!alert.read && <Button variant="ghost" size="sm" data-testid={`alert-mark-read-${alert.id}`}>Mark as read</Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
