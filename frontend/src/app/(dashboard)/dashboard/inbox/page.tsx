'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import { Card, Button } from '@/components/ui/ui-components';
import { useRouter } from 'next/navigation';
import styles from '../../dashboard.module.css';

export default function InboxRedirectPage() {
  const router = useRouter();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: '24px', fontWeight: 600 }}>Unified Inbox</h1>
          <p className={styles.pageSubtitle}>All your multi-platform messages routed to one location.</p>
        </div>
      </div>
      <Card className="emptyState" style={{ marginTop: 'var(--spacing-xl)' }}>
        <Inbox size={48} className="emptyIcon" />
        <h3 style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Message Routing Configuration</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
           Your integrated inbox is currently active under the Community panel for tracking audience sediment.
        </p>
        <Button onClick={() => router.push('/dashboard/community')}>
           Go to Community Inbox
        </Button>
      </Card>
    </div>
  );
}
