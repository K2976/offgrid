'use client';

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Link2, Unlink, Bot, Globe, User, Save, CheckCircle } from 'lucide-react';
import { Card, Button, Badge, Input, Select } from '@/components/ui/ui-components';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';
import styles from '../../dashboard.module.css';

const mockIntegrations = [
  { platform: 'Instagram', status: 'active', platform_username: '@offgrid', connected_at: '2026-03-01' },
  { platform: 'LinkedIn', status: 'active', platform_username: 'OffGrid Inc.', connected_at: '2026-03-05' },
  { platform: 'Google Analytics', status: 'disconnected', platform_username: undefined, connected_at: undefined },
  { platform: 'Google Search Console', status: 'disconnected', platform_username: undefined, connected_at: undefined },
];

export default function SettingsPage() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const user = useAuthStore((s) => s.user);

  const [mode, setMode] = useState('general');
  const [goals, setGoals] = useState('growth');
  const [autopilot, setAutopilot] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Load profile on mount to get website_url from backend
  useEffect(() => {
    const load = async () => {
      const profile = await fetchMe();
      if (profile?.website_url) {
        setWebsiteUrl(profile.website_url);
      }
      setProfileLoaded(true);
    };
    load();
  }, [fetchMe]);

  const saveWebsiteProfile = async () => {
    if (!websiteUrl.trim()) return;
    setSaving(true);
    setSavedMsg('');
    try {
      await api.patch('/settings/website-url', { website_url: websiteUrl.trim() });
      // Also update localStorage for analytics page to use immediately
      localStorage.setItem('preferred_website_url', websiteUrl.trim());
      setSavedMsg('Website URL saved successfully. Analytics dashboard will use this URL.');
      // Refresh user profile
      await fetchMe();
    } catch {
      setSavedMsg('Failed to save website URL. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
      </div>

      {/* User Profile */}
      <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>
          <User size={18} color="var(--color-primary-light)" /> Profile
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Name</label>
            <div style={{ padding: '10px 12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
              {user?.name || '—'}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Email</label>
            <div style={{ padding: '10px 12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
              {user?.email || '—'}
            </div>
          </div>
        </div>
      </Card>

      {/* Website Profile — saves to backend */}
      <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>
          <Globe size={18} color="var(--color-primary-light)" /> Website Profile
        </h3>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          Set your primary website URL. The dashboard and analytics pages will use this to run PageSpeed audits and show performance data.
        </p>
        <Input
          label="Primary Website URL"
          placeholder="https://yourwebsite.com"
          value={websiteUrl}
          onChange={(e) => { setWebsiteUrl(e.target.value); setSavedMsg(''); }}
          data-testid="settings-website-url-input"
        />
        <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <Button onClick={saveWebsiteProfile} isLoading={saving} data-testid="settings-save-website-button">
            <Save size={14} style={{ marginRight: 6 }} /> Save Website URL
          </Button>
          {savedMsg && (
            <span style={{ fontSize: 'var(--font-size-sm)', color: savedMsg.includes('Failed') ? 'var(--color-danger)' : 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {!savedMsg.includes('Failed') && <CheckCircle size={14} />}
              {savedMsg}
            </span>
          )}
        </div>
      </Card>

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
    </div>
  );
}
