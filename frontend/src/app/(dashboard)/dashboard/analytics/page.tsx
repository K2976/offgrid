'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Globe, Search } from 'lucide-react';
import { Tabs, StatCard, Card, Button, Input, Select } from '@/components/ui/ui-components';
import { formatNumber } from '@/lib/utils';
import { useAnalyticsStore } from '@/stores/analytics-store';
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
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const { websiteAudit, fetchWebsiteAudit, isLoading, error } = useAnalyticsStore();

  const runAudit = async () => {
    if (!websiteUrl.trim()) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_website_url', websiteUrl.trim());
    }
    await fetchWebsiteAudit(websiteUrl.trim(), strategy);
  };

  useEffect(() => {
    const loadUrl = async () => {
      // Try to load from user profile first
      try {
        const { default: api } = await import('@/lib/api');
        const res = await api.get('/auth/me');
        if (res.data?.website_url) {
          setWebsiteUrl(res.data.website_url);
          return;
        }
      } catch {
        // fallback to localStorage
      }
      if (typeof window !== 'undefined') {
        const preferred = localStorage.getItem('preferred_website_url');
        if (preferred) {
          setWebsiteUrl(preferred);
        }
      }
    };
    loadUrl();
  }, []);


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
          <>
            <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                <Globe size={18} style={{ display: 'inline', marginRight: 8 }} />Website Audit (Google PageSpeed)
              </h3>
              <div className={styles.responsiveFormGrid}>
                <Input
                  label="Website URL"
                  placeholder="https://yourwebsite.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
                <Select
                  label="Strategy"
                  options={[
                    { value: 'mobile', label: 'Mobile' },
                    { value: 'desktop', label: 'Desktop' },
                  ]}
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value as 'mobile' | 'desktop')}
                />
                <Button onClick={runAudit} isLoading={isLoading} style={{ height: 44 }}>Run Audit</Button>
              </div>
              {error && <p style={{ marginTop: 'var(--spacing-sm)', color: 'var(--color-danger)' }}>{error}</p>}
            </Card>

            {websiteAudit && (
              <>
                <div className={styles.dashGrid}>
                  <StatCard label="Performance" value={`${websiteAudit.scores.performance}/100`} trend={websiteAudit.scores.performance >= 70 ? 'up' : 'down'} icon={<Globe size={18} />} />
                  <StatCard label="SEO" value={`${websiteAudit.scores.seo}/100`} trend={websiteAudit.scores.seo >= 70 ? 'up' : 'down'} />
                  <StatCard label="Accessibility" value={`${websiteAudit.scores.accessibility}/100`} trend={websiteAudit.scores.accessibility >= 70 ? 'up' : 'down'} />
                  <StatCard label="Best Practices" value={`${websiteAudit.scores.best_practices}/100`} trend={websiteAudit.scores.best_practices >= 70 ? 'up' : 'down'} />
                </div>

                <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Website Profile & Traffic Source</h3>
                  <p style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Domain: <strong>{websiteAudit.site_profile.hostname}</strong>
                  </p>
                  <p style={{ marginBottom: 'var(--spacing-sm)', color: websiteAudit.site_profile.google_analytics_connected ? 'var(--color-success)' : 'var(--color-warning)', fontSize: 'var(--font-size-sm)' }}>
                    {websiteAudit.site_profile.google_analytics_connected
                      ? 'Google Analytics connected. Live traffic is shown below.'
                      : websiteAudit.site_profile.google_analytics_note || 'Google Analytics is not connected for this website.'}
                  </p>
                </Card>

                {websiteAudit.api_coverage && (
                  <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>API Coverage</h3>
                    <div className={styles.responsiveTwoCol}>
                      {Object.entries(websiteAudit.api_coverage).map(([apiName, active]) => (
                        <div key={apiName} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                          <span style={{ fontSize: 'var(--font-size-sm)' }}>{apiName}</span>
                          <span style={{ fontSize: 'var(--font-size-sm)', color: active ? 'var(--color-success)' : 'var(--text-secondary)' }}>
                            {active ? 'active' : 'not connected'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {websiteAudit.traffic && (
                  <>
                    <div className={styles.dashGrid} style={{ marginTop: 'var(--spacing-lg)' }}>
                      <StatCard label="Users (30d)" value={formatNumber(websiteAudit.traffic.totals.users)} trend="up" />
                      <StatCard label="Sessions" value={formatNumber(websiteAudit.traffic.totals.sessions)} trend="up" />
                      <StatCard label="Page Views" value={formatNumber(websiteAudit.traffic.totals.page_views)} trend="up" />
                      <StatCard label="Conversions" value={formatNumber(websiteAudit.traffic.totals.conversions)} trend="up" />
                    </div>

                    <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Channel Traffic</h3>
                      <div className={styles.tableWrap}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)', minWidth: 640 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                            <th style={{ textAlign: 'left', padding: '10px 12px' }}>Channel</th>
                            <th style={{ textAlign: 'right', padding: '10px 12px' }}>Sessions</th>
                            <th style={{ textAlign: 'right', padding: '10px 12px' }}>Users</th>
                            <th style={{ textAlign: 'right', padding: '10px 12px' }}>Conversions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {websiteAudit.traffic.channels.map((row) => (
                            <tr key={row.channel} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 500 }}>{row.channel}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatNumber(row.sessions)}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatNumber(row.users)}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatNumber(row.conversions)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </Card>

                    <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Top Pages</h3>
                      <div className={styles.tableWrap}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)', minWidth: 640 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                            <th style={{ textAlign: 'left', padding: '10px 12px' }}>Path</th>
                            <th style={{ textAlign: 'right', padding: '10px 12px' }}>Views</th>
                            <th style={{ textAlign: 'right', padding: '10px 12px' }}>Users</th>
                            <th style={{ textAlign: 'right', padding: '10px 12px' }}>Entrances</th>
                          </tr>
                        </thead>
                        <tbody>
                          {websiteAudit.traffic.top_pages.map((row) => (
                            <tr key={row.path} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 500 }}>{row.path}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatNumber(row.views)}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatNumber(row.users)}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatNumber(row.entrances)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </Card>

                    {websiteAudit.traffic.daily.length > 0 && (
                      <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Daily Traffic (Last 30 Days)</h3>
                        <div className={styles.tableWrap}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)', minWidth: 640 }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                              <th style={{ textAlign: 'left', padding: '10px 12px' }}>Date</th>
                              <th style={{ textAlign: 'right', padding: '10px 12px' }}>Sessions</th>
                              <th style={{ textAlign: 'right', padding: '10px 12px' }}>Users</th>
                              <th style={{ textAlign: 'right', padding: '10px 12px' }}>Page Views</th>
                            </tr>
                          </thead>
                          <tbody>
                            {websiteAudit.traffic.daily.map((row) => (
                              <tr key={row.date} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{row.date}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatNumber(row.sessions)}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatNumber(row.users)}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatNumber(row.page_views)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      </Card>
                    )}
                  </>
                )}

                {websiteAudit.performance_details && (
                  <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Performance Details</h3>
                    <div className={styles.tableWrap}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)', minWidth: 640 }}>
                      <tbody>
                        {Object.entries(websiteAudit.performance_details).map(([key, value]) => (
                          <tr key={key} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 500 }}>{value?.title || key}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>{value?.value || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </Card>
                )}

                {websiteAudit.opportunities && websiteAudit.opportunities.length > 0 && (
                  <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Top Opportunities</h3>
                    {websiteAudit.opportunities.map((opp) => (
                      <div key={opp.id} style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <p style={{ fontWeight: 600 }}>{opp.title}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{opp.impact || 'Potential impact available'}</p>
                      </div>
                    ))}
                  </Card>
                )}

                {websiteAudit.diagnostics && websiteAudit.diagnostics.length > 0 && (
                  <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Diagnostics</h3>
                    {websiteAudit.diagnostics.map((diag) => (
                      <div key={diag.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <span>{diag.title}</span>
                        <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>{diag.score ?? '-'} / 100</span>
                      </div>
                    ))}
                  </Card>
                )}

                <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Core Web Vitals</h3>
                  <div className={styles.tableWrap}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)', minWidth: 640 }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}><td style={{ padding: '10px 12px' }}>First Contentful Paint</td><td style={{ padding: '10px 12px', textAlign: 'right' }}>{websiteAudit.core_web_vitals.fcp || 'N/A'}</td></tr>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}><td style={{ padding: '10px 12px' }}>Largest Contentful Paint</td><td style={{ padding: '10px 12px', textAlign: 'right' }}>{websiteAudit.core_web_vitals.lcp || 'N/A'}</td></tr>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}><td style={{ padding: '10px 12px' }}>Total Blocking Time</td><td style={{ padding: '10px 12px', textAlign: 'right' }}>{websiteAudit.core_web_vitals.tbt || 'N/A'}</td></tr>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}><td style={{ padding: '10px 12px' }}>Cumulative Layout Shift</td><td style={{ padding: '10px 12px', textAlign: 'right' }}>{websiteAudit.core_web_vitals.cls || 'N/A'}</td></tr>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}><td style={{ padding: '10px 12px' }}>Speed Index</td><td style={{ padding: '10px 12px', textAlign: 'right' }}>{websiteAudit.core_web_vitals.speed_index || 'N/A'}</td></tr>
                      <tr><td style={{ padding: '10px 12px' }}>Time To Interactive</td><td style={{ padding: '10px 12px', textAlign: 'right' }}>{websiteAudit.core_web_vitals.tti || 'N/A'}</td></tr>
                    </tbody>
                  </table>
                  </div>
                </Card>
              </>
            )}
          </>
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
