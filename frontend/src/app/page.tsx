'use client';

import Link from 'next/link';
import { ArrowRight, Bot, ChartNoAxesCombined, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/ui-components';
import styles from './page.module.css';

const wallCards = [
  { tone: 'dark', title: 'OffGrid' },
  { tone: 'light', title: 'YOUR NAME' },
  { tone: 'light', title: 'YOUR NAME' },
  { tone: 'dark', title: 'OffGrid' },
  { tone: 'light', title: 'YOUR NAME' },
  { tone: 'dark', title: 'OffGrid' },
];

export default function Home() {
  return (
    <div className={styles.landing}>
      <div className={styles.cardWall}>
        {wallCards.map((card, index) => (
          <div
            key={`${card.title}-${index}`}
            className={`${styles.wallCard} ${card.tone === 'dark' ? styles.wallCardDark : styles.wallCardLight}`}
          >
            <span className={styles.wallCardTitle}>{card.title}</span>
            {card.tone === 'light' && <span className={styles.wallCardMeta}>Position | Title</span>}
          </div>
        ))}
      </div>

      <div className={styles.landingContent}>
        <h1 className={styles.heroTitle}>
          Branded like a studio.
          <br />
          <span className={styles.heroHighlight}>Powered like a growth engine.</span>
        </h1>

        <p className={styles.heroSubtitle}>
          OffGrid blends analytics, AI strategy, and competitor intelligence into one platform your team can run every day.
        </p>

        <div className={styles.ctaRow}>
          <Link href="/register">
            <Button>
              Start free
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Sign in</Button>
          </Link>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <ChartNoAxesCombined size={18} />
            <h3>Live Analytics</h3>
            <p>Track social, website, and SEO metrics from one dashboard.</p>
          </div>
          <div className={styles.featureCard}>
            <Bot size={18} />
            <h3>Groq + Gemini AI</h3>
            <p>Generate insights and content with provider failover reliability.</p>
          </div>
          <div className={styles.featureCard}>
            <ShieldCheck size={18} />
            <h3>Secure Auth</h3>
            <p>JWT session flow with refresh and protected app routes.</p>
          </div>
        </div>

        <div className={styles.brandRow}>
          <Zap size={16} />
          <span>OffGrid AI Marketing Co-Pilot</span>
        </div>
      </div>
    </div>
  );
}
