'use client';

import React, { useState } from 'react';
import { 
  Filter,
  Search,
  Globe,
  MoreVertical,
  Plus,
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/ui-components';
import styles from '../../dashboard.module.css';

const mockContent = [
  { id: '1', video: 'LogCipher | P.S - AI based Log Investigation Framework for Next-Generation...', visibility: 'Public', restrictions: 'None', date: 'Jan 15, 2026', views: '8', comments: '0', likes: '-' },
  { id: '2', video: 'AI Marketing Draft - Draft Campaign Video and Ad Copy #221', visibility: 'Draft', restrictions: 'None', date: '-', views: '-', comments: '-', likes: '-' },
];

const mockIdeas = [
  { title: 'NeuroSync | Mapping Cognitive Patterns for Real-Time Intent Detection in Digital Forensic...', color: '#6A2A35' },
  { title: 'VoidVault | Zero-Knowledge Proof Architectures for Secure Multi-Cloud Evidence Storage and...', color: '#6A2A35' },
  { title: 'GhostProtocol | Autonomous Threat Hunting via Decentralized Peer-to-Peer Neural Defense Me...', color: '#6A2A35' },
  { title: 'QuantumSieve | Post-Quantum Cryptographic Analysis for Identifying Encrypted Malware...', color: '#6A2A35' },
  { title: 'BioKey | Behavioral Biometric Fingerprinting for Authenticating High-Value Transactional Integrit...', color: '#6A2A35' },
  { title: 'DeepTrace | Reconstructing Volatile Memory Artifacts Using Generative Adversarial Networks...', color: '#6A2A35' }
];

export default function ContentPlanner() {
  const [activeTab, setActiveTab] = useState<'Inspiration' | 'Posts' | 'Promotions'>('Inspiration');

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: '24px', fontWeight: 600 }}>Channel content</h1>
        </div>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: 'var(--spacing-md)', borderBottom: '1px solid var(--border-default)', marginBottom: 'var(--spacing-lg)', overflowX: 'auto' }}>
         <button onClick={() => setActiveTab('Inspiration')} style={{ background: 'transparent', border: 'none', color: activeTab === 'Inspiration' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'Inspiration' ? 600 : 500, padding: '12px 16px', borderBottom: activeTab === 'Inspiration' ? '3px solid var(--text-primary)' : '3px solid transparent', cursor: 'pointer', fontSize: 'var(--font-size-md)' }}>
           Inspiration
         </button>
         <button onClick={() => setActiveTab('Posts')} style={{ background: 'transparent', border: 'none', color: activeTab === 'Posts' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'Posts' ? 600 : 500, padding: '12px 16px', borderBottom: activeTab === 'Posts' ? '3px solid var(--text-primary)' : '3px solid transparent', cursor: 'pointer', fontSize: 'var(--font-size-md)' }}>
           Videos
         </button>
         <button onClick={() => setActiveTab('Promotions')} style={{ background: 'transparent', border: 'none', color: activeTab === 'Promotions' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'Promotions' ? 600 : 500, padding: '12px 16px', borderBottom: activeTab === 'Promotions' ? '3px solid var(--text-primary)' : '3px solid transparent', cursor: 'pointer', fontSize: 'var(--font-size-md)' }}>
           Promotions
         </button>
      </div>

      {activeTab === 'Posts' && (
        <Card style={{ padding: 0, overflow: 'hidden', border: 'none', borderRadius: 0, background: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 'var(--spacing-md) 0', borderBottom: '1px solid var(--border-default)' }}>
            <Filter size={20} color="var(--text-secondary)" />
            <input type="text" placeholder="Filter" style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 'var(--font-size-md)' }} />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
              <thead style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                <tr>
                  <th style={{ padding: '16px 8px', width: '40px' }}><input type="checkbox" /></th>
                  <th style={{ padding: '16px 8px', fontWeight: 500, width: '400px' }}>Video</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Visibility</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Restrictions</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Date &darr;</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500, textAlign: 'right' }}>Views</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500, textAlign: 'right' }}>Comments</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500, textAlign: 'right' }}>Likes (vs. dislikes)</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text-primary)' }}>
                {mockContent.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px 8px' }}><input type="checkbox" /></td>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                         <div style={{ width: 120, height: 68, background: '#1c1c1c', borderRadius: 4, position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Play size={24} color="#555" />
                           <span style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.8)', fontSize: '10px', padding: '2px 4px', borderRadius: 2 }}>0:30</span>
                         </div>
                         <div>
                           <div style={{ fontWeight: 500, fontSize: '13px', lineHeight: 1.4, marginBottom: 4 }}>{item.video}</div>
                           <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cyber Security Innovation Challenge Team - Log...</div>
                         </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {item.visibility === 'Public' ? <Globe size={16} color="var(--color-success)" /> : <span style={{ width: 16, height: 16, border: '1px solid var(--text-secondary)' }} />}
                        {item.visibility}
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px' }}>{item.restrictions}</td>
                    <td style={{ padding: '16px 8px' }}>
                       {item.date !== '-' ? (
                         <>
                           <div>{item.date}</div>
                           <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Published</div>
                         </>
                       ) : <div style={{ color: 'var(--text-secondary)' }}>-</div>}
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>{item.views}</td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>{item.comments}</td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>{item.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'Inspiration' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: 'var(--spacing-xl)' }}>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
             <h2 style={{ fontSize: '28px', fontWeight: 600 }}>Spark your next great idea</h2>
             <Button variant="secondary" style={{ borderRadius: 20, background: 'var(--bg-surface-raised)', border: 'none', display: 'flex', gap: 6, color: 'var(--text-primary)' }}>
               <Bookmark size={16} /> View saved
             </Button>
           </div>

           {/* Search Input Box */}
           <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '24px', padding: '8px 8px 8px 24px', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <input 
                type="text" 
                placeholder="Try a topic, theme or a question" 
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '16px' }}
              />
              <Button style={{ borderRadius: 20, background: 'var(--bg-surface-overlay)', color: 'var(--text-tertiary)' }}>Explore ideas</Button>
           </div>

           {/* Idea Pills */}
           <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '32px', overflowX: 'auto', paddingBottom: 8 }}>
             <Button variant="ghost" style={{ borderRadius: '50%', width: 40, height: 40, padding: 0, background: 'var(--bg-surface-raised)', flexShrink: 0 }}><Plus size={20} /></Button>
             <div style={{ padding: '8px 16px', background: 'var(--bg-surface-raised)', borderRadius: 20, whiteSpace: 'nowrap', fontSize: '14px', cursor: 'pointer' }}>Cybersecurity Frameworks</div>
             <div style={{ padding: '8px 16px', background: 'var(--bg-surface-raised)', borderRadius: 20, whiteSpace: 'nowrap', fontSize: '14px', cursor: 'pointer' }}>Artificial Intelligence Research</div>
             <div style={{ padding: '8px 16px', background: 'var(--bg-surface-raised)', borderRadius: 20, whiteSpace: 'nowrap', fontSize: '14px', cursor: 'pointer' }}>Digital Forensics</div>
             <div style={{ padding: '8px 16px', background: 'var(--bg-surface-raised)', borderRadius: 20, whiteSpace: 'nowrap', fontSize: '14px', cursor: 'pointer' }}>Log Analysis Systems</div>
             <Button variant="ghost" style={{ borderRadius: '50%', width: 40, height: 40, padding: 0, flexShrink: 0 }}><ChevronRight size={20} /></Button>
             <Button variant="ghost" style={{ borderRadius: '50%', width: 40, height: 40, padding: 0, flexShrink: 0 }}><MoreVertical size={20} /></Button>
           </div>
           
           <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '32px', paddingLeft: 8 }}>
             AI can make mistakes. Please double check. Use discretion before you create or use ideas. <a href="#" style={{ color: 'var(--color-primary)' }}>Learn more</a>
           </p>

           {/* Exploring ideas section */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f1f1f1', fontWeight: 600 }}>
                 <Sparkles size={16} color="#d364ff" /> Exploring ideas for you
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '13px' }}>
                   <ChevronLeft size={16} /> 1 / 1 <ChevronRight size={16} />
                 </div>
                 <SlidersHorizontal size={16} color="var(--text-primary)" />
              </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {mockIdeas.map((idea, idx) => (
                 <div key={idx} style={{ background: '#1c1c1c', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', height: 280 }}>
                    <div style={{ background: idea.color, height: '140px', width: '100%' }}></div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                       <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                         {idea.title}
                       </h3>
                    </div>
                 </div>
              ))}
           </div>

        </div>
      )}

      {activeTab === 'Promotions' && (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <p>Promotions module features load identically to Video lists.</p>
        </div>
      )}
    </div>
  );
}
