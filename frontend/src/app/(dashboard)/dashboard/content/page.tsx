'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  List, 
  Plus, 
  MoreVertical,
  Filter,
  Search,
  Camera,
  Globe,
  Sparkles
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/ui-components';
import styles from '../../dashboard.module.css';

const mockContent = [
  { 
    id: '1', 
    content: '🚀 Something big is coming next Monday...', 
    platform: 'Instagram', 
    status: 'Scheduled', 
    date: '2026-04-13', 
    time: '19:00',
  },
  { 
    id: '2', 
    content: 'The future of marketing is AI. Here is why...', 
    platform: 'LinkedIn', 
    status: 'Published', 
    date: '2026-04-09', 
    time: '10:30',
  },
  { 
    id: '3', 
    content: '5 Tips for Better Engagement 2026', 
    platform: 'Instagram', 
    status: 'Draft', 
    date: '2026-04-15', 
    time: '18:00',
  },
];

export default function ContentPlanner() {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Schedule Post</h1>
          <p className={styles.pageSubtitle}>Manage your social media calendar and upcoming content.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface-raised)', borderRadius: 8, padding: 4, border: '1px solid var(--border-default)' }}>
            <button 
              style={{ background: view === 'list' ? '#fff' : 'transparent', border: 'none', padding: '6px 12px', borderRadius: 4, boxShadow: view === 'list' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', color: view === 'list' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              onClick={() => setView('list')}
            >
              <List size={16} />
            </button>
            <button 
              style={{ background: view === 'calendar' ? '#fff' : 'transparent', border: 'none', padding: '6px 12px', borderRadius: 4, boxShadow: view === 'calendar' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', color: view === 'calendar' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon size={16} />
            </button>
          </div>
          <Button>
            <Plus size={16} /> Schedule
          </Button>
        </div>
      </div>

      {/* AI Content Generator Panel */}
      <Card style={{ marginBottom: 'var(--spacing-xl)', border: '1px solid var(--color-primary-light)', background: 'var(--bg-surface)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
          <Sparkles size={18} color="var(--color-primary)" />
          AI Content Engine
        </h3>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>Generate multi-platform optimized content instantly from a single prompt.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: 'var(--spacing-xl)' }}>
           {/* Generator Input */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <select style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-strong)', outline: 'none', background: 'var(--bg-base)', fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-sm)' }}>
                <option>Platform: All</option>
                <option>LinkedIn Only</option>
                <option>Instagram Only</option>
              </select>
              <select style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-strong)', outline: 'none', background: 'var(--bg-base)', fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-sm)' }}>
                <option>Tone: Professional</option>
                <option>Tone: Engaging</option>
                <option>Tone: Conversational</option>
              </select>
              <Button style={{ marginTop: 'auto' }}>
                <Sparkles size={16} /> Generate Post
              </Button>
           </div>
           {/* Prompt Area */}
           <div>
              <textarea 
                placeholder="What is this post about? E.g., 'Announcing our new feature AI-Copilot that saves 10 hours a week.'"
                style={{ 
                  width: '100%', minHeight: 120, padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-strong)', 
                  outline: 'none', background: 'var(--bg-base)', fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-sm)', resize: 'vertical'
                }} 
              />
           </div>
        </div>
      </Card>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-md)', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-raised)' }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-tertiary)' }} />
            <input type="text" placeholder="Filter content..." style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-strong)', borderRadius: 6, outline: 'none' }} />
          </div>
          <Button variant="secondary" size="md">
            <Filter size={14} /> Filter
          </Button>
        </div>

        {view === 'list' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
              <thead style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                <tr>
                  <th style={{ padding: 'var(--spacing-md)', fontWeight: 500 }}>Content</th>
                  <th style={{ padding: 'var(--spacing-md)', fontWeight: 500 }}>Platform</th>
                  <th style={{ padding: 'var(--spacing-md)', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: 'var(--spacing-md)', fontWeight: 500 }}>Scheduled For</th>
                  <th style={{ padding: 'var(--spacing-md)', fontWeight: 500 }}></th>
                </tr>
              </thead>
              <tbody>
                {mockContent.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: '#fff' }}>
                    <td style={{ padding: 'var(--spacing-md)', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
                      {item.content}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                         {item.platform === 'Instagram' ? <Camera size={14} color="#E1306C" /> : <Globe size={14} color="#0077B5" />}
                         {item.platform}
                       </div>
                    </td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      <Badge color={item.status === 'Published' ? 'success' : item.status === 'Scheduled' ? 'primary' : 'info'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      <div style={{ fontWeight: 500 }}>{item.date}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.time}</div>
                    </td>
                    <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>
                      <Button variant="ghost" size="sm" style={{ padding: 6 }}>
                        <MoreVertical size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <CalendarIcon size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
            <p>Calendar View Selected</p>
            <p style={{ fontSize: 'var(--font-size-xs)' }}>Visual timeline representation of your scheduled posts.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
