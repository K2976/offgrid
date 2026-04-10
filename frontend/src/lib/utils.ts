import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function formatPercent(num: number): string {
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function trendIcon(trend: 'rising' | 'stable' | 'declining'): string {
  const map = { rising: '↑', stable: '→', declining: '↓' };
  return map[trend] || '→';
}

export function severityColor(severity: string): string {
  const map: Record<string, string> = {
    critical: 'var(--color-danger)',
    high: '#E17055',
    medium: 'var(--color-warning)',
    low: 'var(--color-info)',
  };
  return map[severity] || 'var(--text-secondary)';
}

export function priorityColor(priority: string): string {
  const map: Record<string, string> = {
    high: 'var(--color-danger)',
    medium: 'var(--color-warning)',
    low: 'var(--color-success)',
  };
  return map[priority] || 'var(--text-secondary)';
}
