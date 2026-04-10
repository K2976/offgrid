'use client';

import React from 'react';
import { Bot, Users, TrendingUp, Eye, MousePointerClick, BarChart3 } from 'lucide-react';
import { StatCard } from '@/components/ui/ui-components';
import { formatNumber, formatPercent } from '@/lib/utils';
import styles from '../dashboard.module.css';

/* ── Mock data (replace with store calls when backend is live) ── */
const mockOverview = {
  social: { total_followers: 12540, follower_growth: 3.2, avg_engagement_rate: 4.7, total_reach: 89000, total_impressions: 145000 },
  website: { total_visits: 23400, bounce_rate: 42.1, conversions: 312, conversion_rate: 1.33 },
  seo: { avg_position: 14.3, top_keywords_count: 45, position_change: -2.1 },
};
const mockAutopilot = {
  top_actions: [
    { priority: 1, action: 'Post a carousel on Instagram about your new feature — weekends get 68% more reach.', reasoning: 'Weekend engagement is 2x higher.' },
    { priority: 2, action: 'Respond to 12 unanswered DMs from the last 48 hours.', reasoning: 'Quick response improves sentiment.' },
    { priority: 3, action: 'Boost your top-performing reel from last week with $50 budget.', reasoning: 'It already has strong organic momentum.' },
  ],
  content_idea: { platform: 'Instagram', idea: 'Behind-the-scenes look at your team using AI tools', tone: 'casual' },
  competitor_insight: { competitor: 'CompetitorX', insight: 'They launched a Spring Sale campaign (8 posts, 7.2% avg engagement).', counter_action: 'Run a counter-campaign highlighting your unique AI advantage.' },
};

const engagementData = [
  { date: 'Apr 1', rate: 4.2 }, { date: 'Apr 2', rate: 4.5 }, { date: 'Apr 3', rate: 3.8 },
  { date: 'Apr 4', rate: 5.1 }, { date: 'Apr 5', rate: 5.4 }, { date: 'Apr 6', rate: 4.9 },
  { date: 'Apr 7', rate: 5.2 }, { date: 'Apr 8', rate: 4.7 }, { date: 'Apr 9', rate: 5.0 },
  { date: 'Apr 10', rate: 5.5 },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className={styles.sectionHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
      </div>

      {/* Autopilot Hero */}
      <div className={styles.heroCard} data-testid="autopilot-hero">
        <div className={styles.heroTitle}>
          <Bot size={24} color="var(--color-primary-light)" />
          <span className="gradient-text">Autopilot Brief — Today</span>
        </div>
        <ul className={styles.actionsList}>
          {mockAutopilot.top_actions.map((a) => (
            <li key={a.priority} className={styles.actionItem}>
              <span className={styles.actionNum}>{a.priority}</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>{a.action}</strong>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)', marginTop: 4 }}>{a.reasoning}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.insightRow}>
          <div className={styles.insightCard}>
            <div className={styles.insightLabel}>💡 Content Idea</div>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>{mockAutopilot.content_idea.idea}</p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
              {mockAutopilot.content_idea.platform} · {mockAutopilot.content_idea.tone}
            </p>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightLabel}>⚔️ Competitor Intel</div>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>{mockAutopilot.competitor_insight.insight}</p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', marginTop: 4 }}>
              ↳ {mockAutopilot.competitor_insight.counter_action}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className={styles.dashGrid} style={{ marginTop: 'var(--spacing-xl)' }}>
        <StatCard label="Followers" value={formatNumber(mockOverview.social.total_followers)} change={formatPercent(mockOverview.social.follower_growth)} trend="up" icon={<Users size={18} />} />
        <StatCard label="Engagement" value={`${mockOverview.social.avg_engagement_rate}%`} change="+0.3% vs last week" trend="up" icon={<TrendingUp size={18} />} />
        <StatCard label="Reach" value={formatNumber(mockOverview.social.total_reach)} change="+12% from last period" trend="up" icon={<Eye size={18} />} />
        <StatCard label="Conversions" value={mockOverview.website.conversions.toString()} change={`${mockOverview.website.conversion_rate}% rate`} trend="up" icon={<MousePointerClick size={18} />} />
      </div>

      {/* Engagement Trend Chart */}
      <div className={styles.chartSection} data-testid="engagement-chart">
        <div className={styles.chartTitle}>
          <BarChart3 size={18} style={{ display: 'inline', marginRight: 8 }} />
          Engagement Rate Trend (10 days)
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 200 }}>
          {engagementData.map((d) => (
            <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{d.rate}%</span>
              <div
                style={{
                  width: '100%',
                  height: `${(d.rate / 6) * 160}px`,
                  background: `linear-gradient(180deg, var(--color-primary), var(--color-primary-dark))`,
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  transition: 'height 0.3s ease',
                }}
              />
              <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{d.date.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
