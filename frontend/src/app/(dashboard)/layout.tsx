'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import styles from '@/components/layout/layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className={styles.shell}>
        <div className={styles.shellContent}>
          {children}
        </div>
      </main>
    </>
  );
}
