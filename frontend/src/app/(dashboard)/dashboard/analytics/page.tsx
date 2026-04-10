'use client';

import React, { useState } from 'react';
import { BarChart3, Globe, Search } from 'lucide-react';
import { Tabs, StatCard, Card } from '@/components/ui/ui-components';
import { formatNumber } from '@/lib/utils';
import styles from '../../dashboard.module.css';

const socialMock = {
  followers: { current: 8500, change: 320, growth_pct: 3.9 },
  engagement: { rate: 5.1, likes: 4200, comments: 680, shares: 190 },
  reach: { total: 67000, avg_per_post: 3350 },
  top_posts: [
    { id: '1', content_preview: '🚀 Excited to announce our new AI feature...', engagement_score: 8.7, posted_at: '2026-04-08' },
    { id: '2', content_preview: 'Behind the scenes at OffGrid HQ 🎬', engagement_score: 7.2, posted_at: '2026-04-05' },
  ],
};

const seoMock = [
  { keyword: 'ai marketing tool', position: 8, change: -3, impressions: 1200, clicks: 89, ctr: 7.4 },
  { keyword: 'marketing automation', position: 12, change: 2, impressions: 3400, clicks: 156, ctr: 4.6 },
  { keyword: 'social media analytics', position: 15, change: -1, impressions: 2100, clicks: 98, ctr: 4.7 },
  { keyword: 'competitor analysis tool', position: 6, change: -5, impressions: 890, clicks: 112, ctr: 12.6 },
];

export default function AnalyticsPage() {
  const [tab, setTab] = useState('social');

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h1 className={styles.pageTitle}>Analytics</h1>
      </div>

      <Tabs
        tabs={[
          { id: 'social', label: '📱 Social Media' },
          { id: 'website', label: '🌐 Website' },
          { id: 'seo', label: '🔍 SEO' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div style={{ marginTop: 'var(--spacing-xl)' }}>
        {tab === 'social' && (
          <>
            <div className={styles.dashGrid}>
              <StatCard label="Followers" value={formatNumber(socialMock.followers.current)} change={`+${socialMock.followers.change}`} trend="up" />
              <StatCard label="Engagement Rate" value={`${socialMock.engagement.rate}%`} trend="up" />
              <StatCard label="Total Reach" value={formatNumber(socialMock.reach.total)} trend="up" />
              <StatCard label="Avg Reach/Post" value={formatNumber(socialMock.reach.avg_per_post)} trend="up" />
            </div>
            <Card>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                <BarChart3 size={18} style={{ display: 'inline', marginRight: 8 }} />Top Performing Posts
              </h3>
              {socialMock.top_posts.map((p) => (
                <div key={p.id} style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)' }}>{p.content_preview}</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{p.engagement_score}</span>
                </div>
              ))}
            </Card>
          </>
        )}

        {tab === 'website' && (
          <div className={styles.dashGrid}>
            <StatCard label="Total Visits" value={formatNumber(23400)} change="+8% vs last period" trend="up" icon={<Globe size={18} />} />
            <StatCard label="Bounce Rate" value="42.1%" change="-2.3%" trend="up" />
            <StatCard label="Conversions" value="312" change="+1.33% rate" trend="up" />
            <StatCard label="Avg Session" value="3m 5s" change="+12s" trend="up" />
          </div>
        )}

        {tab === 'seo' && (
          <Card>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
              <Search size={18} style={{ display: 'inline', marginRight: 8 }} />Keyword Rankings
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Keyword</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px' }}>Position</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px' }}>Change</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px' }}>Impressions</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px' }}>Clicks</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px' }}>CTR</th>
                </tr>
              </thead>
              <tbody>
                {seoMock.map((k) => (
                  <tr key={k.keyword} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{k.keyword}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>#{k.position}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: k.change < 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {k.change < 0 ? `↑${Math.abs(k.change)}` : `↓${k.change}`}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatNumber(k.impressions)}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>{k.clicks}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>{k.ctr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
