'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className={styles.landing}>
      <div className={styles.landingContent}>
        <Zap size={48} color="var(--color-primary-light)" />
        <h1 className="gradient-text" style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800 }}>
          OffGrid
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
          AI Marketing Co-Pilot
        </p>
      </div>
    </div>
  );
}
