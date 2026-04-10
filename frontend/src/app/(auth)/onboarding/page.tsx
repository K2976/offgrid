'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Package, Briefcase, PartyPopper, ArrowRight, ArrowLeft, Check, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth-store';
import type { BusinessType } from '@/types';

const BUSINESS_TYPES = [
  { type: 'product' as BusinessType, icon: Package, title: 'Product', desc: 'Physical or digital products', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
  { type: 'service' as BusinessType, icon: Briefcase, title: 'Service', desc: 'Professional services & consulting', color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30' },
  { type: 'event' as BusinessType, icon: PartyPopper, title: 'Event', desc: 'Events, conferences & meetups', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
];

const PLATFORMS = ['Instagram', 'SEO', 'Google Ads', 'Facebook', 'LinkedIn', 'Offline', 'YouTube', 'Twitter/X'];
const GOALS = [
  { value: 'awareness', emoji: '📢', title: 'Brand Awareness', desc: 'Get seen by more people' },
  { value: 'sales', emoji: '💰', title: 'Drive Sales', desc: 'Increase revenue & conversions' },
  { value: 'engagement', emoji: '💬', title: 'Boost Engagement', desc: 'Build community & interaction' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);

  // Step 2 — Product
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [usp, setUsp] = useState('');

  // Step 2 — Service
  const [serviceType, setServiceType] = useState('');
  const [serviceAudience, setServiceAudience] = useState('');
  const [location, setLocation] = useState('');
  const [pricingModel, setPricingModel] = useState('');
  const [keyBenefits, setKeyBenefits] = useState('');

  // Step 2 — Event
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventAudience, setEventAudience] = useState('');

  // Step 3
  const [budget, setBudget] = useState('$1,000 - $5,000');
  const [platforms, setPlatforms] = useState<string[]>(['Instagram']);
  const [goal, setGoal] = useState('awareness');

  const togglePlatform = (p: string) => {
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  };

  const canProceed = () => {
    if (step === 1) return !!businessType;
    if (step === 2) {
      if (businessType === 'product') return productName && category;
      if (businessType === 'service') return serviceType && serviceAudience;
      if (businessType === 'event') return eventName && eventType;
    }
    if (step === 3) return platforms.length > 0 && goal;
    return false;
  };

  const handleFinish = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    localStorage.setItem('og_onboarding', 'true');
    useAuthStore.setState({ onboardingComplete: true });
    router.push('/dashboard');
  };

  const inputCls = 'h-11 border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-600 focus:border-brand-500/60';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-0 p-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-brand-500/8 blur-[150px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-500/8 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[640px]">
        {/* Progress Bar */}
        <div className="mb-6 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                s < step ? 'bg-brand-500 text-white' :
                s === step ? 'bg-brand-500/20 text-brand-400 ring-2 ring-brand-500/40' :
                'bg-white/[0.06] text-zinc-600'
              }`}>
                {s < step ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`h-[2px] flex-1 rounded-full transition-all ${s < step ? 'bg-brand-500' : 'bg-white/[0.08]'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-100/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl lg:p-10">
          
          {/* Step 1 — Business Type */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="mb-2 flex items-center gap-2 text-brand-400">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">Step 1 of 3</span>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">What&apos;s your business type?</h1>
              <p className="mb-8 text-sm text-zinc-500">This helps us tailor your marketing strategy</p>

              <div className="grid gap-4">
                {BUSINESS_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => setBusinessType(bt.type)}
                    className={`group flex items-center gap-4 rounded-xl border p-5 text-left transition-all ${
                      businessType === bt.type
                        ? `bg-gradient-to-r ${bt.color} ${bt.border} shadow-lg`
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${
                      businessType === bt.type ? `bg-gradient-to-r ${bt.color}` : 'bg-white/[0.06]'
                    }`}>
                      <bt.icon className={`h-6 w-6 ${businessType === bt.type ? 'text-white' : 'text-zinc-400'}`} />
                    </div>
                    <div>
                      <p className={`text-lg font-semibold ${businessType === bt.type ? 'text-white' : 'text-zinc-200'}`}>{bt.title}</p>
                      <p className="text-sm text-zinc-500">{bt.desc}</p>
                    </div>
                    {businessType === bt.type && (
                      <div className="ml-auto">
                        <Check className="h-5 w-5 text-brand-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Business Info */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="mb-2 flex items-center gap-2 text-brand-400">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">Step 2 of 3</span>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">
                Tell us about your {businessType}
              </h1>
              <p className="mb-6 text-sm text-zinc-500">Help us understand your business better</p>

              <div className="flex flex-col gap-4">
                {businessType === 'product' && (
                  <>
                    <div className="space-y-2"><Label className="text-zinc-300">Product Name</Label><Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Smart Fitness Tracker" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Health & Wellness" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Target Audience</Label><Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. Fitness enthusiasts, 25-40" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Price Range</Label><Input value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="e.g. $49 - $199" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Unique Selling Point</Label><Input value={usp} onChange={(e) => setUsp(e.target.value)} placeholder="What makes it different?" className={inputCls} /></div>
                  </>
                )}
                {businessType === 'service' && (
                  <>
                    <div className="space-y-2"><Label className="text-zinc-300">Service Type</Label><Input value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="e.g. Digital Marketing Consulting" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Target Audience</Label><Input value={serviceAudience} onChange={(e) => setServiceAudience(e.target.value)} placeholder="e.g. SMBs, Startups" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Location (City)</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. New York" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Pricing Model</Label><Input value={pricingModel} onChange={(e) => setPricingModel(e.target.value)} placeholder="e.g. Monthly retainer, Per project" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Key Benefits</Label><Input value={keyBenefits} onChange={(e) => setKeyBenefits(e.target.value)} placeholder="e.g. 3x ROI, dedicated support" className={inputCls} /></div>
                  </>
                )}
                {businessType === 'event' && (
                  <>
                    <div className="space-y-2"><Label className="text-zinc-300">Event Name</Label><Input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. AI Marketing Summit 2026" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Event Type</Label><Input value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="e.g. Conference, Workshop" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Location</Label><Input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="e.g. San Francisco, CA" className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Date</Label><Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inputCls} /></div>
                    <div className="space-y-2"><Label className="text-zinc-300">Target Audience</Label><Input value={eventAudience} onChange={(e) => setEventAudience(e.target.value)} placeholder="e.g. Marketing professionals" className={inputCls} /></div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 3 — Marketing Preferences */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="mb-2 flex items-center gap-2 text-brand-400">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">Step 3 of 3</span>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">Marketing Preferences</h1>
              <p className="mb-6 text-sm text-zinc-500">Help us build your initial strategy</p>

              <div className="flex flex-col gap-6">
                {/* Budget */}
                <div className="space-y-3">
                  <Label className="text-zinc-300">Monthly Budget</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Under $1,000', '$1,000 - $5,000', '$5,000 - $20,000', '$20,000+'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBudget(b)}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                          budget === b
                            ? 'border-brand-500/40 bg-brand-500/10 text-white'
                            : 'border-white/[0.08] text-zinc-400 hover:border-white/[0.15]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                <div className="space-y-3">
                  <Label className="text-zinc-300">Preferred Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => {
                      const selected = platforms.includes(p);
                      return (
                        <button
                          key={p}
                          onClick={() => togglePlatform(p)}
                          className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all ${
                            selected
                              ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30'
                              : 'bg-white/[0.04] text-zinc-400 ring-1 ring-white/[0.08] hover:bg-white/[0.08]'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" />}
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Goal */}
                <div className="space-y-3">
                  <Label className="text-zinc-300">Primary Goal</Label>
                  <div className="grid gap-3">
                    {GOALS.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setGoal(g.value)}
                        className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                          goal === g.value
                            ? 'border-brand-500/40 bg-brand-500/10'
                            : 'border-white/[0.08] hover:border-white/[0.15]'
                        }`}
                      >
                        <span className="text-2xl">{g.emoji}</span>
                        <div>
                          <p className={`text-sm font-semibold ${goal === g.value ? 'text-white' : 'text-zinc-300'}`}>{g.title}</p>
                          <p className="text-xs text-zinc-500">{g.desc}</p>
                        </div>
                        {goal === g.value && <Check className="ml-auto h-4 w-4 text-brand-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="border-white/[0.1] bg-transparent text-zinc-300 hover:bg-white/[0.04]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 disabled:opacity-40"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={loading || !canProceed()}
                className="bg-gradient-to-r from-violet-500 to-brand-500 text-white shadow-lg shadow-violet-500/25 disabled:opacity-40"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating...
                  </div>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" /> Generate Initial Strategy
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
