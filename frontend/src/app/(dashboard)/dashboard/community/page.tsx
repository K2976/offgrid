'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Globe, 
  Share2, 
  Send,
  User,
  MoreHorizontal
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/ui-components';
import styles from '../../dashboard.module.css';

const mockMessages = [
  { id: '1', user: 'Alex Rivers', text: 'Great post! Do you ship to Australia?', platform: 'Instagram', time: '12m ago', status: 'Unread', sentiment: 'Positive' },
  { id: '2', user: 'TechDaily', text: 'Interested in a collaboration for 2026.', platform: 'LinkedIn', time: '1h ago', status: 'Read', sentiment: 'Neutral' },
  { id: '3', user: 'Sarah Jenkins', text: 'The last update seems to have a bug.', platform: 'Instagram', time: '3h ago', status: 'Read', sentiment: 'Negative' },
];

export default function InboxManager() {
  const [selected, setSelected] = useState(mockMessages[0]);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Inbox</h1>
          <p className={styles.pageSubtitle}>Unified inbox across all your channels.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--spacing-xl)', height: '70vh' }}>
        {/* Inbox Sidebar */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--border-default)' }}>
              <div style={{ position: 'relative' }}>
                 <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: 12, top: 10 }} />
                 <input 
                   type="text" 
                   placeholder="Search messages..." 
                   style={{ 
                     width: '100%', padding: '8px 12px 8px 36px', 
                     background: 'var(--bg-surface-raised)', border: '1px solid var(--border-strong)', 
                     borderRadius: '6px', color: 'var(--text-primary)', outline: 'none'
                   }} 
                 />
              </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {mockMessages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => setSelected(msg)}
                style={{ 
                  cursor: 'pointer',
                  borderLeft: selected.id === msg.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                  padding: 'var(--spacing-md)',
                  background: selected.id === msg.id ? 'var(--bg-base)' : 'var(--bg-surface)',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: selected.id === msg.id ? 600 : 500, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{msg.user}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{msg.time}</span>
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {msg.text}
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 8, alignItems: 'center' }}>
                  {msg.platform === 'Instagram' ? <Share2 size={12} color="var(--text-tertiary)" /> : <Globe size={12} color="var(--text-tertiary)" />}
                  <Badge color={msg.sentiment === 'Positive' ? 'success' : msg.sentiment === 'Negative' ? 'danger' : 'info'}>
                    {msg.sentiment}
                  </Badge>
                  {msg.status === 'Unread' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', marginLeft: 'auto' }} />}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Message Details */}
        <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', padding: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
               <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <User size={20} color="var(--color-primary)" />
               </div>
               <div>
                 <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)', color: 'var(--text-primary)' }}>{selected.user}</div>
                 <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>via {selected.platform}</div>
               </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <Button variant="secondary" size="sm">Resolve</Button>
              <Button variant="ghost" size="sm" style={{ padding: '4px' }}>
                <MoreHorizontal size={18} />
              </Button>
            </div>
          </div>

          <div style={{ flex: 1, padding: 'var(--spacing-lg)', overflowY: 'auto' }}>
            <div style={{ color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
              <div style={{ background: 'var(--bg-base)', padding: 'var(--spacing-md)', borderRadius: '12px 12px 12px 0', display: 'inline-block', maxWidth: '80%', border: '1px solid var(--border-default)' }}>
                {selected.text}
              </div>
              <div style={{ marginTop: 'var(--spacing-xs)', fontSize: '11px', color: 'var(--text-tertiary)' }}>{selected.time}</div>
            </div>
          </div>

          <div style={{ padding: 'var(--spacing-lg)', borderTop: '1px solid var(--border-default)', background: 'var(--bg-base)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>✨ AI Suggested Replies:</p>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              <Badge color="primary" style={{ cursor: 'pointer', background: 'var(--bg-surface)', border: '1px solid var(--color-primary-glow)' }}>Yes, we do! Check our bio.</Badge>
              <Badge color="primary" style={{ cursor: 'pointer', background: 'var(--bg-surface)', border: '1px solid var(--color-primary-glow)' }}>All details r on our website.</Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
               <textarea 
                 placeholder={`Reply to ${selected.user}...`} 
                 style={{ 
                   width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', 
                   borderRadius: '8px', padding: 'var(--spacing-md)', color: 'var(--text-primary)', 
                   minHeight: 80, outline: 'none', fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-sm)',
                   boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                 }} 
               />
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Button variant="ghost" size="sm">
                   <MoreHorizontal size={16} /> Options
                 </Button>
                 <Button>
                   <Send size={14} /> Send
                 </Button>
               </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
