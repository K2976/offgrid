'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Bookmark, Clock, Wand2, Hash, MessageSquare, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';

const TONES = ['Professional', 'Casual', 'Gen-Z', 'Luxury', 'Humorous', 'Inspirational'];
const PLATFORMS_LIST = ['Instagram', 'LinkedIn', 'Twitter/X', 'Facebook', 'YouTube', 'Email'];

const mockGenerated = {
  post: `🚀 Transform your marketing game with AI-powered insights!\n\nStop guessing. Start growing. Our intelligent platform analyzes your performance data in real-time and tells you exactly what to do next.\n\n✅ Smart content suggestions\n✅ Optimal posting times\n✅ Competitor analysis\n✅ ROI tracking\n\nThe future of marketing isn't just digital — it's intelligent. 🧠\n\nReady to 10x your results?`,
  caption: 'AI-powered marketing that actually works. From strategy to execution, let data drive your growth. 📈',
  hashtags: ['#AIMarketing', '#DigitalMarketing', '#GrowthHacking', '#MarketingAI', '#ContentStrategy', '#SocialMediaMarketing', '#StartupMarketing', '#MarTech'],
  bestTime: 'Today at 8:00 PM',
};

export default function ContentAIPage() {
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Professional');
  const [businessType, setBusinessType] = useState('SaaS Product');
  const [generated, setGenerated] = useState<typeof mockGenerated | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setGenerated(mockGenerated);
    setGenerating(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div>
      <Header title="Content AI" subtitle="Generate marketing content with AI" />

      <div className="mt-6 px-8 pb-8">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          
          {/* Left — Config Panel */}
          <div className="space-y-4">
            <Card className="border-white/[0.06] bg-surface-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wand2 className="h-5 w-5 text-violet-400" />
                  Content Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Business Type</Label>
                  <Input
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="e.g. SaaS, E-commerce"
                    className="border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-300">Target Audience</Label>
                  <Input
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Marketing professionals, 25-40"
                    className="border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-300">Platform</Label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS_LIST.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          platform === p
                            ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30'
                            : 'bg-white/[0.04] text-zinc-400 ring-1 ring-white/[0.06] hover:bg-white/[0.08]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-300">Tone</Label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          tone === t
                            ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30'
                            : 'bg-white/[0.04] text-zinc-400 ring-1 ring-white/[0.06] hover:bg-white/[0.08]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-violet-500 to-brand-500 text-white shadow-lg shadow-violet-500/20"
                >
                  {generating ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Generating...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Best Time Badge */}
            {generated && (
              <div className="animate-fade-in flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <Clock className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-emerald-300">Best time to post</p>
                  <p className="text-xs text-emerald-400/70">{generated.bestTime}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right — Output Panel */}
          <div className="space-y-4">
            {!generated && !generating && (
              <div className="flex h-[500px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-surface-100/50">
                <div className="animate-float mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                  <Sparkles className="h-8 w-8 text-violet-400" />
                </div>
                <p className="text-lg font-semibold text-zinc-300">Ready to create</p>
                <p className="mt-1 max-w-xs text-center text-sm text-zinc-600">
                  Configure your preferences and hit Generate to create AI-powered marketing content
                </p>
              </div>
            )}

            {generating && (
              <div className="flex h-[500px] flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-surface-100">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-3 border-violet-500/30 border-t-violet-500" />
                <p className="text-sm text-zinc-400">AI is crafting your content...</p>
              </div>
            )}

            {generated && !generating && (
              <div className="animate-slide-right space-y-4">
                {/* Post */}
                <Card className="border-white/[0.06] bg-surface-100">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <FileText className="h-4 w-4 text-brand-400" /> Post
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generated.post, 'post')} className="h-8 text-zinc-400 hover:text-white">
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        {copied === 'post' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 text-sm leading-relaxed text-zinc-300">
                      {generated.post}
                    </div>
                  </CardContent>
                </Card>

                {/* Caption */}
                <Card className="border-white/[0.06] bg-surface-100">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <MessageSquare className="h-4 w-4 text-violet-400" /> Caption
                    </CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generated.caption, 'caption')} className="h-8 text-zinc-400 hover:text-white">
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      {copied === 'caption' ? 'Copied!' : 'Copy'}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-300">{generated.caption}</p>
                  </CardContent>
                </Card>

                {/* Hashtags */}
                <Card className="border-white/[0.06] bg-surface-100">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Hash className="h-4 w-4 text-emerald-400" /> Hashtags
                    </CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generated.hashtags.join(' '), 'hashtags')} className="h-8 text-zinc-400 hover:text-white">
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      {copied === 'hashtags' ? 'Copied!' : 'Copy'}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {generated.hashtags.map((h) => (
                        <span key={h} className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
                          {h}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={handleGenerate} variant="outline" className="border-white/[0.1] text-zinc-300 hover:bg-white/[0.04]">
                    <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                  </Button>
                  <Button variant="outline" className="border-white/[0.1] text-zinc-300 hover:bg-white/[0.04]">
                    <Bookmark className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
