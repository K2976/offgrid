'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, BarChart3, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('company');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
      router.push(role === 'freelancer' ? '/dashboard' : '/onboarding');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-0 p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-500/10 blur-[120px] animate-float" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1080px] animate-fade-in-up">
        <div className="grid overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-100/80 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.15fr_1fr]">
          
          {/* Left — Showcase */}
          <div className="hidden border-r border-white/[0.06] bg-gradient-to-br from-surface-100 to-surface-200 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <h2 className="mb-3 text-[2.5rem] font-bold leading-[1.05] tracking-tight text-white">
                Your AI<br />
                <span className="ai-gradient-text">Marketing Brain.</span>
              </h2>
              <p className="mb-8 max-w-sm text-[15px] leading-relaxed text-zinc-400">
                Generate content, track performance, and get actionable marketing suggestions — all from one intelligent dashboard.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: BarChart3, title: 'Smart Analytics', desc: 'Track every metric across all platforms' },
                  { icon: Sparkles, title: 'AI Content Engine', desc: 'Generate posts, captions, and strategies' },
                  { icon: Shield, title: 'Secure & Private', desc: 'Enterprise-grade data protection' },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10">
                      <f.icon className="h-4 w-4 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{f.title}</p>
                      <p className="text-xs text-zinc-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-8 text-xs text-zinc-600">
              Trusted by 2,400+ businesses worldwide
            </p>
          </div>

          {/* Right — Form */}
          <div className="flex flex-col justify-center p-8 lg:p-10">
            <div className="mb-8 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">OffGrid</span>
            </div>

            <h1 className="mb-1 text-2xl font-bold text-white">Welcome back</h1>
            <p className="mb-6 text-sm text-zinc-500">Sign in to your marketing copilot</p>

            {/* Role Toggle */}
            <div className="mb-6 flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
              {(['company', 'freelancer'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    role === r
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {r === 'company' ? '🏢 Company' : '👤 Freelancer'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="h-11 border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-600 focus:border-brand-500/60 focus:ring-brand-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-600 focus:border-brand-500/60 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-xs text-zinc-500 hover:text-brand-400 transition-colors">
                  Forgot password?
                </button>
              </div>

              {error && (
                <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-400">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-brand-500/40 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
