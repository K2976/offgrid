'use client';

import React, { useEffect, useState } from 'react';
import {
  Globe,
  Zap,
  Activity,
  Download,
  TrendingUp,
  TrendingDown,
  Gauge,
  Clock,
  MousePointerClick,
  LayoutGrid,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { Card, Button, Badge, StatCard, Input } from '@/components/ui/ui-components';
import { useAuthStore } from '@/stores/auth-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import styles from '../dashboard.module.css';

function ScoreRing({ score, label, size = 80 }: { score: number; label: string; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? '#2ba640' : score >= 50 ? '#fbc02d' : '#ff4e45';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" style={{ fill: '#f1f1f1', fontSize: size * 0.25, fontWeight: 700 }}>
          {score}
        </text>
      </svg>
      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

function CWVItem({ label, value, good }: { label: string; value: string | undefined; good?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: good === false ? 'var(--color-warning)' : 'var(--text-primary)' }}>
        {value || '—'}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const user = useAuthStore((s) => s.user);
  const { websiteAudit, fetchWebsiteAudit, isLoading: auditLoading, error: auditError } = useAnalyticsStore();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [hasUrl, setHasUrl] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const init = async () => {
      const profile = await fetchMe();
      if (profile?.website_url) {
        setWebsiteUrl(profile.website_url);
        setHasUrl(true);
        // Auto-run audit on load if user has a saved website
        await fetchWebsiteAudit(profile.website_url, 'mobile');
      }
      setInitialLoad(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runQuickAudit = async () => {
    if (!websiteUrl.trim()) return;
    await fetchWebsiteAudit(websiteUrl.trim(), 'mobile');
  };

  const auditData = websiteAudit;
  const hasAudit = !!auditData;

  // Build mini chart from daily traffic if available
  const dailyData = auditData?.traffic?.daily?.map((d) => ({
    name: d.date.slice(-2),
    sessions: d.sessions,
    users: d.users,
  })) || [];

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: '24px', fontWeight: 600 }}>
            Channel dashboard
          </h1>
          {user && (
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
              Welcome back, {user.name}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Button variant="ghost" size="sm" style={{ border: '1px solid var(--border-default)', borderRadius: '50%', width: 40, height: 40, padding: 0 }}>
            <Activity size={18} />
          </Button>
          <Button variant="ghost" size="sm" style={{ border: '1px solid var(--border-default)', borderRadius: '50%', width: 40, height: 40, padding: 0 }}>
            <Download size={18} />
          </Button>
        </div>
      </div>

      {/* Website URL Setup Banner (if no URL set) */}
      {!hasUrl && !initialLoad && (
        <Card style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)', border: '1px solid var(--color-primary)', background: 'rgba(62,166,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--spacing-md)' }}>
            <Globe size={24} color="var(--color-primary)" />
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>Set up your website analytics</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Enter your website URL below to see PageSpeed scores, Core Web Vitals, and performance data.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="https://yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
            <Button onClick={runQuickAudit} isLoading={auditLoading} style={{ height: 44 }}>
              Analyze
            </Button>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(350px, 1.2fr)', gap: 'var(--spacing-lg)' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

          {/* PageSpeed Scores */}
          <Card style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>
                <Gauge size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
                Website Performance
              </h2>
              {hasUrl && (
                <Button variant="ghost" size="sm" onClick={runQuickAudit} isLoading={auditLoading} style={{ fontSize: 'var(--font-size-xs)' }}>
                  Refresh
                </Button>
              )}
            </div>

            {auditLoading && !hasAudit && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-2xl)', color: 'var(--text-secondary)', gap: 8 }}>
                <Loader2 size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                Analyzing website...
              </div>
            )}

            {auditError && !hasAudit && (
              <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--color-warning)' }}>
                <AlertCircle size={20} style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 'var(--font-size-sm)' }}>{auditError}</p>
              </div>
            )}

            {hasAudit && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 'var(--spacing-lg)' }}>
                  <ScoreRing score={auditData.scores.performance} label="Performance" />
                  <ScoreRing score={auditData.scores.seo} label="SEO" />
                  <ScoreRing score={auditData.scores.accessibility} label="Access." />
                  <ScoreRing score={auditData.scores.best_practices} label="Best Prac." />
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--spacing-md)' }}>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    {auditData.site_profile.hostname} · {auditData.strategy} · {auditData.fetched_at?.slice(0, 10)}
                  </p>
                </div>
              </>
            )}

            {!hasAudit && !auditLoading && !auditError && hasUrl && (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--text-secondary)' }}>
                <Globe size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                <p style={{ fontSize: 'var(--font-size-sm)' }}>Click Refresh to run a PageSpeed audit</p>
              </div>
            )}
          </Card>

          {/* Core Web Vitals */}
          {hasAudit && auditData.core_web_vitals && (
            <Card style={{ padding: 'var(--spacing-lg)' }}>
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                <Activity size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
                Core Web Vitals
              </h2>
              <CWVItem label="First Contentful Paint" value={auditData.core_web_vitals.fcp} />
              <CWVItem label="Largest Contentful Paint" value={auditData.core_web_vitals.lcp} />
              <CWVItem label="Total Blocking Time" value={auditData.core_web_vitals.tbt} />
              <CWVItem label="Cumulative Layout Shift" value={auditData.core_web_vitals.cls} />
              <CWVItem label="Speed Index" value={auditData.core_web_vitals.speed_index} />
              <CWVItem label="Time to Interactive" value={auditData.core_web_vitals.tti} />
            </Card>
          )}

          {/* Top Opportunities */}
          {hasAudit && auditData.opportunities && auditData.opportunities.length > 0 && (
            <Card style={{ padding: 'var(--spacing-lg)' }}>
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                <Sparkles size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
                Top Opportunities
              </h2>
              {auditData.opportunities.slice(0, 5).map((opp) => (
                <div key={opp.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{opp.title}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>{opp.impact || 'Potential impact available'}</p>
                </div>
              ))}
            </Card>
          )}

          {/* Quick Actions */}
          {!hasAudit && !auditLoading && (
            <Card style={{ padding: 'var(--spacing-lg)' }}>
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <Link href="/dashboard/analytics" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                  <BarChart3 size={16} color="var(--color-primary)" /> Run Website Audit <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }} />
                </Link>
                <Link href="/dashboard/competitors" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                  <Search size={16} color="var(--color-primary)" /> Analyze Competitors <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }} />
                </Link>
                <Link href="/dashboard/settings" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                  <Globe size={16} color="var(--color-primary)" /> Configure Website URL <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }} />
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

          {/* Channel Analytics / Traffic Overview */}
          <Card style={{ padding: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: '24px' }}>Channel analytics</h2>

            {hasAudit && auditData.traffic ? (
              <>
                {/* GA4 Traffic Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>Users (30d)</div>
                    <div style={{ fontSize: '32px', fontWeight: 400, marginTop: 4 }}>{auditData.traffic.totals.users.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>Sessions</div>
                    <div style={{ fontSize: '32px', fontWeight: 400, marginTop: 4 }}>{auditData.traffic.totals.sessions.toLocaleString()}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Summary</h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Last 30 days</div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                    <span>Page Views</span>
                    <span style={{ fontWeight: 600 }}>{auditData.traffic.totals.page_views.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                    <span>Bounce Rate</span>
                    <span style={{ fontWeight: 600 }}>{auditData.traffic.totals.bounce_rate}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                    <span>Engagement Rate</span>
                    <span style={{ fontWeight: 600 }}>{auditData.traffic.totals.engagement_rate}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 'var(--font-size-sm)' }}>
                    <span>Conversions</span>
                    <span style={{ fontWeight: 600 }}>{auditData.traffic.totals.conversions}</span>
                  </div>
                </div>

                {/* Daily Traffic Chart */}
                {dailyData.length > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Daily Traffic</h3>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Sessions · Last 30 days</div>
                    <div style={{ height: 120, width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyData}>
                          <defs>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                          <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: 'none', borderRadius: 4, color: '#fff' }} />
                          <Area type="monotone" dataKey="sessions" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorSessions)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <Button variant="secondary" size="md" style={{ borderRadius: 20, width: 'max-content' }}>
                  <Link href="/dashboard/analytics" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                    GO TO FULL ANALYTICS
                  </Link>
                </Button>
              </>
            ) : hasAudit ? (
              <>
                {/* No GA4 — show PageSpeed-based site info */}
                <div style={{ marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--border-default)', paddingBottom: '24px' }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Website</div>
                  <div style={{ fontSize: '20px', fontWeight: 500, marginTop: '4px' }}>{auditData.site_profile.hostname}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: auditData.site_profile.google_analytics_connected ? 'var(--color-success)' : 'var(--color-warning)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {auditData.site_profile.google_analytics_connected ? (
                      <><CheckCircle2 size={12} /> Google Analytics connected</>
                    ) : (
                      <><AlertCircle size={12} /> {auditData.site_profile.google_analytics_note || 'GA4 not configured'}</>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Performance Summary</h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>From PageSpeed Insights</div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                    <span>Performance Score</span>
                    <span style={{ fontWeight: 600 }}>{auditData.scores.performance}/100</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                    <span>SEO Score</span>
                    <span style={{ fontWeight: 600 }}>{auditData.scores.seo}/100</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                    <span>Accessibility</span>
                    <span style={{ fontWeight: 600 }}>{auditData.scores.accessibility}/100</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 'var(--font-size-sm)' }}>
                    <span>Best Practices</span>
                    <span style={{ fontWeight: 600 }}>{auditData.scores.best_practices}/100</span>
                  </div>
                </div>

                <Button variant="secondary" size="md" style={{ borderRadius: 20, width: 'max-content' }}>
                  <Link href="/dashboard/analytics" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                    GO TO FULL ANALYTICS
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-default)', paddingBottom: '24px' }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Website analytics</div>
                  <div style={{ fontSize: '48px', fontWeight: 400, marginTop: '8px', color: 'var(--text-tertiary)' }}>—</div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Summary</h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>No data yet</div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                    <span>Performance</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                    <span>SEO</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 'var(--font-size-sm)' }}>
                    <span>Accessibility</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                  </div>
                </div>

                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-md)' }}>
                  {hasUrl ? 'Loading analytics...' : 'Set your website URL in Settings to see real data here.'}
                </p>

                <Button variant="secondary" size="md" style={{ borderRadius: 20, width: 'max-content' }}>
                  <Link href="/dashboard/settings" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                    CONFIGURE WEBSITE
                  </Link>
                </Button>
              </>
            )}
          </Card>

          {/* API Coverage */}
          {hasAudit && auditData.api_coverage && (
            <Card style={{ padding: 'var(--spacing-lg)' }}>
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>API Coverage</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xs)' }}>
                {Object.entries(auditData.api_coverage).map(([apiName, active]) => (
                  <div key={apiName} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{apiName.replace(/_/g, ' ')}</span>
                    <span style={{ color: active ? 'var(--color-success)' : 'var(--text-tertiary)', fontWeight: 500 }}>
                      {active ? '● active' : '○'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Diagnostics */}
          {hasAudit && auditData.diagnostics && auditData.diagnostics.length > 0 && (
            <Card style={{ padding: 'var(--spacing-lg)' }}>
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Diagnostics</h2>
              {auditData.diagnostics.slice(0, 6).map((diag) => (
                <div key={diag.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                  <span>{diag.title}</span>
                  <span style={{ color: (diag.score ?? 0) < 50 ? 'var(--color-danger)' : 'var(--color-warning)', fontWeight: 600 }}>{diag.score ?? '-'}/100</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
