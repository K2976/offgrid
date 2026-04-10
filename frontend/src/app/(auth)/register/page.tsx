'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap } from 'lucide-react';
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
      router.push('/dashboard');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <Zap size={32} />
          <span className="gradient-text">OffGrid</span>
        </div>
        <h1 className={styles.authTitle}>Get started</h1>
        <p className={styles.authSubtitle}>Create your AI marketing workspace</p>

        <form onSubmit={handleSubmit} className={styles.authForm} data-testid="register-form">
          <Input label="Full Name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Kartik" required data-testid="register-form-name-input" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" required data-testid="register-form-email-input" />
          <Input label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="••••••••" required data-testid="register-form-password-input" />
          <Input label="Company Name (optional)" value={form.company_name} onChange={(e) => update('company_name', e.target.value)} placeholder="OffGrid Inc." data-testid="register-form-company-input" />
          {error && <p className={styles.authError}>{error}</p>}
          <Button type="submit" isLoading={loading} data-testid="register-form-submit-button" style={{ width: '100%' }}>
            Create Account
          </Button>
        </form>

        <p className={styles.authLink}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
