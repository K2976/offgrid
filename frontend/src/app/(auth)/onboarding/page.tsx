'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { Button, Input, Select } from '@/components/ui/ui-components';
import type { OnboardingRequest } from '@/types';
import styles from '../auth.module.css';

const GOAL_OPTIONS = [
  'Increase brand awareness',
  'Grow followers',
  'Improve conversion rate',
  'Increase website traffic',
  'Generate more leads',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState<OnboardingRequest>({
    workspace_name: 'My Workspace',
    mode: 'general',
    goals: ['Increase brand awareness'],
    budget_monthly: undefined,
    autopilot_enabled: true,
    autopilot_time: '08:00',
    company_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleGoal = (goal: string) => {
    setForm((prev) => {
      const exists = prev.goals.includes(goal);
      const goals = exists ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal];
      return { ...prev, goals: goals.slice(0, 5) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.patch('/settings/onboarding', {
        ...form,
        budget_monthly: form.budget_monthly || null,
        company_name: form.company_name || null,
      });
      router.push('/dashboard');
    } catch {
      setError('Could not save your profile setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard} style={{ maxWidth: 680 }}>
        <div className={styles.authLogo}>
          <Sparkles size={28} />
          <span className="gradient-text">Set up your profile</span>
        </div>
        <h1 className={styles.authTitle}>Answer a few questions</h1>
        <p className={styles.authSubtitle}>This helps OffGrid personalize analytics, content ideas, and autopilot actions.</p>

        <form onSubmit={handleSubmit} className={styles.authForm} data-testid="onboarding-form">
          <Input
            label="Workspace Name"
            value={form.workspace_name}
            onChange={(e) => setForm({ ...form, workspace_name: e.target.value })}
            required
          />

          <Input
            label="Company Name"
            value={form.company_name || ''}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            placeholder="Your company"
          />

          <Select
            label="Mode"
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value as 'general' | 'custom' })}
            options={[
              { value: 'general', label: 'General' },
              { value: 'custom', label: 'Custom' },
            ]}
          />

          <Input
            label="Monthly Budget (optional)"
            type="number"
            min={0}
            value={form.budget_monthly ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                budget_monthly: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />

          <Input
            label="Autopilot Time"
            type="time"
            value={form.autopilot_time}
            onChange={(e) => setForm({ ...form, autopilot_time: e.target.value })}
          />

          <div>
            <label className={styles.authSubtitle} style={{ display: 'block', marginBottom: 10 }}>
              Goals (pick up to 5)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {GOAL_OPTIONS.map((goal) => {
                const active = form.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    style={{
                      border: active ? '1px solid var(--color-primary)' : '1px solid var(--border-default)',
                      background: active ? 'var(--color-primary-soft)' : 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      borderRadius: 999,
                      padding: '8px 12px',
                      fontSize: 'var(--font-size-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className={styles.authError}>{error}</p>}

          <Button type="submit" isLoading={loading} style={{ width: '100%' }}>
            Complete Setup
          </Button>
        </form>
      </div>
    </div>
  );
}
