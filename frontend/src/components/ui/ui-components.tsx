'use client';

import React from 'react';
import styles from './ui.module.css';

/* ─── Card ─── */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  onClick?: () => void;
}
export function Card({ children, className = '', style, glow, onClick }: CardProps) {
  return (
    <div
      className={`${styles.card} ${glow ? styles.cardGlow : ''} ${className}`}
      style={style}
      onClick={onClick}
      data-testid="card"
    >
      {children}
    </div>
  );
}

/* ─── Stat Card ─── */
interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}
export function StatCard({ label, value, change, trend, icon }: StatCardProps) {
  return (
    <div className={styles.statCard} data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={styles.statHeader}>
        <span className={styles.statLabel}>{label}</span>
        {icon && <span className={styles.statIcon}>{icon}</span>}
      </div>
      <div className={styles.statValue}>{value}</div>
      {change && (
        <div
          className={`${styles.statChange} ${trend === 'up' ? styles.trendUp : trend === 'down' ? styles.trendDown : ''}`}
        >
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
        </div>
      )}
    </div>
  );
}

/* ─── Button ─── */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
export function Button({ children, variant = 'primary', size = 'md', isLoading, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[`btn-${variant}`]} ${styles[`btn-${size}`]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className={styles.spinner} /> : children}
    </button>
  );
}

/* ─── Badge ─── */
interface BadgeProps {
  children: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}
export function Badge({ children, color = 'primary' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[`badge-${color}`]}`}>{children}</span>;
}

/* ─── Input ─── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <input className={`${styles.input} ${error ? styles.inputError : ''} ${className}`} {...props} />
      {error && <span className={styles.inputErrorText}>{error}</span>}
    </div>
  );
}

/* ─── Select ─── */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}
export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <select className={`${styles.select} ${className}`} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── Textarea ─── */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <textarea className={`${styles.textarea} ${className}`} {...props} />
    </div>
  );
}

/* ─── Empty State ─── */
export function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}

/* ─── Skeleton Loader ─── */
export function Skeleton({ width, height }: { width?: string; height?: string }) {
  return <div className="skeleton" style={{ width: width || '100%', height: height || '20px' }} />;
}

/* ─── Tabs ─── */
interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}
export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className={styles.tabs} data-testid="tabs">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`${styles.tab} ${active === t.id ? styles.tabActive : ''}`}
          onClick={() => onChange(t.id)}
          data-testid={`tab-${t.id}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
