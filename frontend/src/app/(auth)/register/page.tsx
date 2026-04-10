'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bot, ChartNoAxesCombined, ShieldCheck, Zap } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Button, Input } from '@/components/ui/ui-components';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ name: '', email: '', password: '', company_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/onboarding');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className={styles.authPage}>
      <div className={styles.authBackgroundWall}>
        <div className={`${styles.authWallCard} ${styles.authWallCardDark}`}><span className={styles.authWallCardTitle}>OffGrid</span></div>
        <div className={`${styles.authWallCard} ${styles.authWallCardLight}`}><span className={styles.authWallCardTitle}>YOUR NAME</span></div>
        <div className={`${styles.authWallCard} ${styles.authWallCardLight}`}><span className={styles.authWallCardTitle}>YOUR NAME</span></div>
        <div className={`${styles.authWallCard} ${styles.authWallCardDark}`}><span className={styles.authWallCardTitle}>OffGrid</span></div>
        <div className={`${styles.authWallCard} ${styles.authWallCardLight}`}><span className={styles.authWallCardTitle}>YOUR NAME</span></div>
        <div className={`${styles.authWallCard} ${styles.authWallCardDark}`}><span className={styles.authWallCardTitle}>OffGrid</span></div>
      </div>

      <div className={styles.authCard}>
        <section className={styles.authShowcase}>
          <h2 className={styles.showcaseTitle}>
            Branded like a studio.
            <br />
            <span className={styles.showcaseTitleMuted}>Powered like a growth engine.</span>
          </h2>
          <p className={styles.showcaseSubtitle}>
            Set up your workspace in under a minute and start getting AI-backed growth suggestions instantly.
          </p>

          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseItem}>
              <ChartNoAxesCombined size={14} />
              <strong>Unified Insights</strong>
              Social, SEO, and website metrics in one workflow.
            </div>
            <div className={styles.showcaseItem}>
              <Bot size={14} />
              <strong>Content Copilot</strong>
              Generate campaigns and posts tailored to your goals.
            </div>
            <div className={styles.showcaseItem}>
              <ShieldCheck size={14} />
              <strong>Secure by Design</strong>
              Token-based auth with onboarding controls.
            </div>
          </div>
        </section>

        <section className={styles.authPanel}>
          <div className={styles.authLogo}>
            <Zap size={32} />
            <span className={styles.brandText}>OffGrid</span>
          </div>
          <h1 className={styles.authTitle}>Get started</h1>
          <p className={styles.authSubtitle}>Create your AI marketing workspace</p>

          <form onSubmit={handleSubmit} className={styles.authForm} data-testid="register-form">
            <Input label="Full Name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Kartik" required className={styles.authInput} data-testid="register-form-name-input" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" required className={styles.authInput} data-testid="register-form-email-input" />
            <Input label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="••••••••" required className={styles.authInput} data-testid="register-form-password-input" />
            <Input label="Company Name (optional)" value={form.company_name} onChange={(e) => update('company_name', e.target.value)} placeholder="OffGrid Inc." className={styles.authInput} data-testid="register-form-company-input" />
            {error && <p className={styles.authError}>{error}</p>}
            <Button type="submit" isLoading={loading} data-testid="register-form-submit-button" style={{ width: '100%' }}>
              Create Account
            </Button>
          </form>

          <p className={styles.authLink}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
