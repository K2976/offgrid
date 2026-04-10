'use client';

import React from 'react';
import { Bot, Sparkles, Swords, PenTool, ChevronRight } from 'lucide-react';
import { Card, Badge } from '@/components/ui/ui-components';
import styles from '../../dashboard.module.css';

const mockBriefs = [
  {
    date: '2026-04-10',
    top_actions: [
      { priority: 1, action: 'Post a carousel on Instagram about your new AI feature.', reasoning: 'Weekend engagement is 2x higher than weekdays.' },
      { priority: 2, action: 'Respond to 12 unanswered DMs from last 48 hours.', reasoning: 'Quick response improves sentiment and follower retention.' },
      { priority: 3, action: 'Boost your top reel from last week with $50.', reasoning: 'It already has strong organic momentum — paid will amplify.' },
    ],
    content_idea: { platform: 'Instagram', idea: 'Behind-the-scenes look at your team using AI tools', tone: 'casual' },
    competitor_insight: { competitor: 'CompetitorX', insight: 'Launched Spring Sale campaign (8 posts, 7.2% engagement).', counter_action: 'Counter with a value-driven campaign highlighting AI features.' },
  },
  {
    date: '2026-04-09',
    top_actions: [
      { priority: 1, action: 'Publish a LinkedIn article on marketing automation trends.', reasoning: 'LinkedIn organic reach for articles is 5x higher.' },
      { priority: 2, action: 'Update your Instagram bio link to new landing page.', reasoning: 'Current link leads to outdated page.' },
      { priority: 3, action: 'Schedule 3 posts for the upcoming weekend.', reasoning: 'Weekend content consistently outperforms.' },
    ],
    content_idea: { platform: 'LinkedIn', idea: 'How AI is reshaping the marketing playbook — 5 lessons from our data', tone: 'professional' },
    competitor_insight: { competitor: 'MarketGuru', insight: 'Started posting 2x more reels per week.', counter_action: 'Increase reel production to maintain content parity.' },
  },
];

export default function AutopilotPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Autopilot Insights</h1>
          <p className={styles.pageSubtitle}>AI-driven recommendations based on your recent activity.</p>
        </div>
        <Badge color="success">Active</Badge>
      </div>

      {mockBriefs.map((brief, idx) => (
        <Card key={brief.date} style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
            <Bot size={20} color="var(--color-primary)" />
            <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>{idx === 0 ? 'Today' : 'Yesterday'}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>{brief.date}</span>
          </div>

          {/* Top 3 Actions */}
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--spacing-sm)', color: 'var(--text-secondary)' }}>
            <Sparkles size={14} /> Top 3 Actions
          </h4>
          {brief.top_actions.map((a) => (
            <div key={a.priority} style={{ display: 'flex', gap: 'var(--spacing-sm)', padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-xs)' }}>
              <span style={{ background: 'var(--color-primary)', color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 700, flexShrink: 0 }}>{a.priority}</span>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{a.action}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{a.reasoning}</div>
              </div>
            </div>
          ))}

          {/* Content Idea + Competitor Insight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
            <div style={{ background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                <PenTool size={14} /> Content Idea
              </h4>
              <p style={{ fontSize: 'var(--font-size-sm)' }}>{brief.content_idea.idea}</p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                {brief.content_idea.platform} · {brief.content_idea.tone}
              </p>
            </div>
            <div style={{ background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                <Swords size={14} /> Competitor Intel
              </h4>
              <p style={{ fontSize: 'var(--font-size-sm)' }}><strong>{brief.competitor_insight.competitor}:</strong> {brief.competitor_insight.insight}</p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', marginTop: 4 }}>
                <ChevronRight size={12} style={{ display: 'inline' }} /> {brief.competitor_insight.counter_action}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
