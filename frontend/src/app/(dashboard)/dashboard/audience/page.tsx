'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/ui-components';
import styles from '../../dashboard.module.css';

export default function AudiencePage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: '24px', fontWeight: 600 }}>Audience Insights</h1>
          <p className={styles.pageSubtitle}>Deep dive into your demographics and audience behavior.</p>
        </div>
      </div>
      <Card className="emptyState" style={{ marginTop: 'var(--spacing-xl)' }}>
        <Users size={48} className="emptyIcon" />
        <h3 style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Coming Soon</h3>
        <p style={{ color: 'var(--text-secondary)' }}>We are gathering deep analytical data about your audience. Check back later!</p>
      </Card>
    </div>
  );
}
