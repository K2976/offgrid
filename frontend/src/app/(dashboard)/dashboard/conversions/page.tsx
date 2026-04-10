'use client';

import React from 'react';
import { MousePointerClick } from 'lucide-react';
import { Card } from '@/components/ui/ui-components';
import styles from '../../dashboard.module.css';

export default function ConversionsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: '24px', fontWeight: 600 }}>Conversion Tracking</h1>
          <p className={styles.pageSubtitle}>Monitor goals, sales, and lead generation events.</p>
        </div>
      </div>
      <Card className="emptyState" style={{ marginTop: 'var(--spacing-xl)' }}>
        <MousePointerClick size={48} className="emptyIcon" />
        <h3 style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>No Conversions Logged</h3>
        <p style={{ color: 'var(--text-secondary)' }}>You haven't set up any conversion events or pixels yet. Link your campaigns to start tracking ROI.</p>
      </Card>
    </div>
  );
}
