'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Link2, Unlink, Bot } from 'lucide-react';
import { Card, Button, Badge, Input, Select } from '@/components/ui/ui-components';
import styles from '../../dashboard.module.css';

const mockIntegrations = [
  { platform: 'Instagram', status: 'active', platform_username: '@offgrid', connected_at: '2026-03-01' },
  { platform: 'LinkedIn', status: 'active', platform_username: 'OffGrid Inc.', connected_at: '2026-03-05' },
  { platform: 'Google Analytics', status: 'disconnected', platform_username: undefined, connected_at: undefined },
  { platform: 'Google Search Console', status: 'disconnected', platform_username: undefined, connected_at: undefined },
];

export default function SettingsPage() {
  const [mode, setMode] = useState('general');
  const [goals, setGoals] = useState('growth');
  const [autopilot, setAutopilot] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const saveWebsiteProfile = () => {
    if (!websiteUrl.trim()) return;
    localStorage.setItem('preferred_website_url', websiteUrl.trim());
    setSavedMsg('Website profile saved. Analytics dashboard will use this URL.');
  };

  React.useEffect(() => {
    const preferred = localStorage.getItem('preferred_website_url');
    if (preferred) {
      setWebsiteUrl(preferred);
    }
  }, []);

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
      </div>

      {/* Workspace Config */}
      <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>
          <SettingsIcon size={18} color="var(--color-primary-light)" /> Workspace Configuration
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <Select label="Mode" value={mode} onChange={(e) => setMode(e.target.value)} options={[{ value: 'general', label: '🟢 General Mode' }, { value: 'custom', label: '🔵 Custom Mode' }]} data-testid="settings-mode-select" />
          <Select label="Primary Goal" value={goals} onChange={(e) => setGoals(e.target.value)} options={[{ value: 'growth', label: 'Growth' }, { value: 'engagement', label: 'Engagement' }, { value: 'traffic', label: 'Traffic' }]} data-testid="settings-goal-select" />
        </div>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <Input label="Telegram Chat ID" placeholder="Paste your Telegram chat ID for alerts" data-testid="settings-telegram-input" />
        </div>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <Input label="Notification Email" placeholder="alerts@company.com" data-testid="settings-email-input" />
        </div>
        <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'flex-end' }}>
          <Button data-testid="settings-save-button">Save Settings</Button>
        </div>
      </Card>

      {/* Autopilot Toggle */}
      <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Bot size={18} color="var(--color-primary-light)" />
            <div>
              <strong>Autopilot Mode</strong>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Daily AI briefing with actions, content ideas, and competitor insights</p>
            </div>
          </div>
          <Button
            variant={autopilot ? 'primary' : 'secondary'}
            onClick={() => setAutopilot(!autopilot)}
            data-testid="settings-autopilot-toggle"
          >
            {autopilot ? 'ON' : 'OFF'}
          </Button>
        </div>
      </Card>

      {/* Integrations */}
      <Card>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>
          <Link2 size={18} color="var(--color-primary-light)" /> Platform Integrations
        </h3>
        <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
          {mockIntegrations.map((int) => (
            <div
              key={int.platform}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-md)', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)' }}
            >
              <div>
                <strong>{int.platform}</strong>
                {int.platform_username && (
                  <span style={{ marginLeft: 'var(--spacing-sm)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{int.platform_username}</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Badge color={int.status === 'active' ? 'success' : 'warning'}>{int.status}</Badge>
                <Button variant="ghost" size="sm" data-testid={`settings-integration-${int.platform.toLowerCase().replace(/\s/g, '-')}`}>
                  {int.status === 'active' ? <><Unlink size={14} /> Disconnect</> : <><Link2 size={14} /> Connect</>}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginTop: 'var(--spacing-xl)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>
          <Link2 size={18} color="var(--color-primary-light)" /> Website Profile
        </h3>
        <Input
          label="Primary Website URL"
          placeholder="https://yourwebsite.com"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />
        <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={saveWebsiteProfile}>Save Website URL</Button>
        </div>
        {savedMsg && <p style={{ marginTop: 'var(--spacing-sm)', color: 'var(--color-success)' }}>{savedMsg}</p>}
      </Card>
    </div>
  );
}
