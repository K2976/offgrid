'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { useAlertStore } from '@/stores/app-stores';
import styles from './layout.module.css';

export function Header({ title }: { title: string }) {
  const unreadCount = useAlertStore((s) => s.unreadCount);

  return (
    <header className={styles.header} data-testid="header">
      <h1 className={styles.headerTitle}>{title}</h1>
      <div className={styles.headerActions}>
        <button className={styles.alertBell} data-testid="header-alert-bell">
          <Bell size={20} />
          {unreadCount > 0 && <span className={styles.alertBadge}>{unreadCount}</span>}
        </button>
      </div>
    </header>
  );
}
