'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BarChart3, Swords, PenTool,
  Bell, FileText, Bot, Settings, LogOut, Zap,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import styles from './layout.module.css';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/competitors', label: 'Competitors', icon: Swords },
  { href: '/dashboard/content', label: 'Content', icon: PenTool },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/autopilot', label: 'Autopilot', icon: Bot },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className={styles.sidebar} data-testid="sidebar">
      {/* Logo */}
      <div className={styles.logo}>
        <Zap size={24} />
        <span className="gradient-text">OffGrid</span>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn} onClick={logout} data-testid="nav-logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
