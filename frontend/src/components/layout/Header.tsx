'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAlertStore } from '@/stores/app-stores';
import styles from './layout.module.css';

export function Header({ title }: { title: string }) {
  const unreadCount = useAlertStore((s) => s.unreadCount);

  return (
    <header className={styles.header} data-testid="header">
      <div className={styles.headerLeft}>
        <h1 className={styles.headerTitle}>{title}</h1>
        <div className={styles.searchContainer}>
          <Search size={16} color="var(--text-tertiary)" />
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder="Search campaigns & analytics..." 
            data-testid="global-search-input"
          />
        </div>
      </div>
      
      <div className={styles.headerActions}>
        <button className={styles.alertBell} data-testid="header-alert-bell">
          <Bell size={20} />
          {unreadCount > 0 && <span className={styles.alertBadge}>{unreadCount}</span>}
        </button>
        <div className={styles.userProfile}>
          JD
        </div>
      </div>
    </header>
  );
}
