'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, 
  Inbox, 
  CalendarPlus, 
  MessageCircle,
  Users, 
  MousePointerClick, 
  Swords, 
  Target,
  FileText, 
  Settings, 
  LogOut, 
  Command,
  Bot,
  Bell
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import styles from './layout.module.css';

const navGroups = [
  {
    title: 'Main Menu',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/inbox', label: 'Inbox', icon: Inbox },
      { href: '/dashboard/content', label: 'Schedule Post', icon: CalendarPlus },
      { href: '/dashboard/community', label: 'Community', icon: MessageCircle },
    ]
  },
  {
    title: 'Analytics',
    items: [
      { href: '/dashboard/audience', label: 'Audience Insights', icon: Users },
      { href: '/dashboard/conversions', label: 'Conversion Tracking', icon: MousePointerClick },
      { href: '/dashboard/competitors', label: 'Competitor Analysis', icon: Swords },
    ]
  },
  {
    title: 'Other',
    items: [
      { href: '/dashboard/campaigns', label: 'Campaigns', icon: Target },
      { href: '/dashboard/autopilot', label: 'Autopilot Insights', icon: Bot },
      { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
    ]
  }
];

const bottomItems = [
  { href: '/dashboard/reports', label: 'Reports Center', icon: FileText },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
  };

  return (
    <aside className={styles.sidebar} data-testid="sidebar">
      {/* Logo */}
      <div className={styles.logo}>
        <div style={{ background: 'var(--color-primary)', color: '#fff', padding: 4, borderRadius: 8, display: 'flex', alignItems: 'center' }}>
          <Command size={20} />
        </div>
        <span>Metrica</span>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <div className={styles.navGroup}>{group.title}</div>
            {group.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        {bottomItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
              style={{ marginBottom: 4 }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button className={styles.logoutBtn} onClick={logout} data-testid="nav-logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
