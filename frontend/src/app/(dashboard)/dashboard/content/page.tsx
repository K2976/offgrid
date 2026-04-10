'use client';

import React, { useState } from 'react';
import { PenTool, Copy, Sparkles } from 'lucide-react';
import { Card, Button, Input, Select, Textarea, Badge } from '@/components/ui/ui-components';
import styles from '../../dashboard.module.css';

const mockGenerated = [
  { id: '1', content: '🚀 Something big is coming...\n\nNext Monday, we\'re unveiling a game-changing AI feature that will transform how you approach marketing. Stay tuned. 👀\n\n#AI #MarketingAutomation #Innovation #OffGrid', hashtags: ['#AI', '#MarketingAutomation', '#Innovation'], estimated_engagement: 'high', platform_optimized: true },
  { id: '2', content: 'The future of marketing isn\'t about working harder — it\'s about working smarter. 🧠\n\nOur new AI co-pilot analyzes your data, spots opportunities, and tells you exactly what to do next.\n\nReady to 10x your results? Link in bio. ⚡', hashtags: ['#AIMarketing', '#GrowthHacking'], estimated_engagement: 'above_average', platform_optimized: true },
];

export default function ContentPage() {
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('professional');
  const [type, setType] = useState('caption');
  const [topic, setTopic] = useState('');
  const [generated, setGenerated] = useState(mockGenerated);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h1 className={styles.pageTitle}>Content Engine</h1>
      </div>

      {/* Generation Form */}
      <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>
          <Sparkles size={18} color="var(--color-primary-light)" /> Generate Content
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
          <Select label="Platform" value={platform} onChange={(e) => setPlatform(e.target.value)} options={[{ value: 'instagram', label: 'Instagram' }, { value: 'linkedin', label: 'LinkedIn' }]} data-testid="content-platform-select" />
          <Select label="Tone" value={tone} onChange={(e) => setTone(e.target.value)} options={[{ value: 'professional', label: 'Professional' }, { value: 'genz', label: 'Gen Z' }, { value: 'luxury', label: 'Luxury' }, { value: 'casual', label: 'Casual' }]} data-testid="content-tone-select" />
          <Select label="Type" value={type} onChange={(e) => setType(e.target.value)} options={[{ value: 'caption', label: 'Caption' }, { value: 'post_idea', label: 'Post Idea' }, { value: 'campaign', label: 'Campaign' }]} data-testid="content-type-select" />
        </div>
        <Textarea label="Topic / Context" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Describe what you want to promote or talk about..." data-testid="content-topic-textarea" />
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <Button onClick={handleGenerate} isLoading={loading} data-testid="content-generate-button">
            <PenTool size={16} /> Generate
          </Button>
        </div>
      </Card>

      {/* Generated Content */}
      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {generated.map((item) => (
          <Card key={item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <Badge color={item.estimated_engagement === 'high' ? 'success' : 'info'}>{item.estimated_engagement}</Badge>
                {item.platform_optimized && <Badge color="primary">optimized</Badge>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(item.content)} data-testid={`content-copy-${item.id}`}>
                <Copy size={14} /> Copy
              </Button>
            </div>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7, color: 'var(--text-primary)' }}>{item.content}</pre>
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap', marginTop: 'var(--spacing-sm)' }}>
              {item.hashtags.map((h) => (
                <span key={h} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-light)' }}>{h}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
