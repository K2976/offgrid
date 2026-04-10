'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types';

const SKILLS = ['Marketing', 'SEO', 'Google Ads', 'Social Media', 'Content Writing', 'Email Marketing', 'Video Production', 'Branding', 'Analytics', 'PR'];
const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: '🌱 Beginner', desc: '0-2 years' },
  { value: 'intermediate', label: '⚡ Intermediate', desc: '2-5 years' },
  { value: 'expert', label: '🏆 Expert', desc: '5+ years' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { registerCompany, registerFreelancer } = useAuthStore();
  const [role, setRole] = useState<UserRole>('company');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shared fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Freelancer fields
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState('intermediate');

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill].slice(0, 6)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'company') {
        await registerCompany(name, email, password);
        router.push('/onboarding');
      } else {
        await registerFreelancer(name, email, password, skills, experience);
        router.push('/dashboard');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-0 p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px] animate-float" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-500/10 blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-[560px] animate-fade-in-up">
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-100/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl lg:p-10">
          
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">OffGrid</span>
          </div>

          <h1 className="mb-1 text-2xl font-bold text-white">Get started</h1>
          <p className="mb-6 text-sm text-zinc-500">Create your AI marketing workspace</p>

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
                {r === 'company' ? '🏢 I am a Company' : '👤 I am a Freelancer'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="h-11 border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-600 focus:border-brand-500/60"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="h-11 border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-600 focus:border-brand-500/60"
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
                className="h-11 border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-600 focus:border-brand-500/60"
              />
            </div>

            {/* Freelancer-only fields */}
            {role === 'freelancer' && (
              <div className="animate-fade-in space-y-5 pt-2">
                <div className="space-y-3">
                  <Label className="text-zinc-300">Skills <span className="text-zinc-600">(pick up to 6)</span></Label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => {
                      const selected = skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                            selected
                              ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30'
                              : 'bg-white/[0.04] text-zinc-400 ring-1 ring-white/[0.08] hover:bg-white/[0.08]'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-zinc-300">Experience Level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => setExperience(lvl.value)}
                        className={`rounded-xl border p-3 text-center transition-all ${
                          experience === lvl.value
                            ? 'border-brand-500/40 bg-brand-500/10 text-white'
                            : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.15]'
                        }`}
                      >
                        <div className="text-sm font-medium">{lvl.label}</div>
                        <div className="mt-0.5 text-[11px] text-zinc-500">{lvl.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-400">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all hover:from-brand-600 hover:to-brand-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {role === 'company' ? 'Continue to Setup' : 'Create Account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
