'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bot, ChartNoAxesCombined, ShieldCheck, Zap } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Button, Input } from '@/components/ui/ui-components';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      const profile = await fetchMe();
      router.push(profile?.onboarding_complete ? '/dashboard' : '/onboarding');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

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
            OffGrid blends analytics, AI strategy, and competitor intelligence into one platform your team can run every day.
          </p>

          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseItem}>
              <ChartNoAxesCombined size={14} />
              <strong>Live Analytics</strong>
              Track social, website, and SEO in one place.
            </div>
            <div className={styles.showcaseItem}>
              <Bot size={14} />
              <strong>Groq + Gemini</strong>
              Provider failover for stable AI output.
            </div>
            <div className={styles.showcaseItem}>
              <ShieldCheck size={14} />
              <strong>Secure Auth</strong>
              JWT sessions with protected routes.
            </div>
          </div>
        </section>

        <section className={styles.authPanel}>
          <div className={styles.authLogo}>
            <Zap size={32} />
            <span className={styles.brandText}>OffGrid</span>
          </div>
          <h1 className={styles.authTitle}>Welcome back</h1>
          <p className={styles.authSubtitle}>Sign in to your marketing co-pilot</p>

          <form onSubmit={handleSubmit} className={styles.authForm} data-testid="login-form">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className={styles.authInput}
              data-testid="login-form-email-input"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.authInput}
              data-testid="login-form-password-input"
            />
            {error && <p className={styles.authError}>{error}</p>}
            <Button type="submit" isLoading={loading} data-testid="login-form-submit-button" style={{ width: '100%' }}>
              Sign In
            </Button>
          </form>

          <p className={styles.authLink}>
            Don&apos;t have an account? <Link href="/register">Create one</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
