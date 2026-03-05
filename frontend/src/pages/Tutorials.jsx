import { useState } from 'react';

const CATEGORIES = [
  { key: 'all', label: 'All', icon: 'fa-book' },
  { key: 'getting-started', label: 'Getting Started', icon: 'fa-rocket' },
  { key: 'assets', label: 'Asset Management', icon: 'fa-boxes-stacked' },
  { key: 'operations', label: 'Operations', icon: 'fa-gears' },
  { key: 'reports', label: 'Reports & Analytics', icon: 'fa-chart-bar' },
  { key: 'settings', label: 'Settings & Config', icon: 'fa-gear' },
  { key: 'integrations', label: 'Integrations', icon: 'fa-puzzle-piece' },
];

const TUTORIALS = [
  { id: 1, title: 'Getting Started with Global Neochain', category: 'getting-started', duration: '8 min', type: 'video', difficulty: 'beginner', desc: 'Complete walkthrough of the platform — dashboard, navigation, and key features. Perfect for new users.', steps: ['Log in and explore the Dashboard', 'Navigate the sidebar sections', 'Understand stat cards and charts', 'Use the global search', 'Access quick action shortcuts'], views: 1240, updated: 'Feb 20, 2026' },
  { id: 2, title: 'Adding Your First Asset', category: 'assets', duration: '5 min', type: 'guide', difficulty: 'beginner', desc: 'Step-by-step guide to creating an asset record with all required fields, tagging, and group assignment.', steps: ['Navigate to All Assets', 'Click "Add Asset" button', 'Fill in required fields (Name, Category, Status)', 'Assign to an Asset Group', 'Add custom fields and notes', 'Save and verify asset tag generation'], views: 892, updated: 'Feb 18, 2026' },
  { id: 3, title: 'Bulk Import Assets via CSV', category: 'assets', duration: '6 min', type: 'guide', difficulty: 'intermediate', desc: 'Learn how to import hundreds of assets at once using the CSV bulk import feature with validation.', steps: ['Download the CSV template', 'Fill in asset data following the column format', 'Navigate to All Assets → Import', 'Upload your CSV file', 'Review validation results', 'Confirm and import'], views: 654, updated: 'Feb 15, 2026' },
  { id: 4, title: 'Setting Up Asset Groups & Custom Fields', category: 'settings', duration: '7 min', type: 'video', difficulty: 'intermediate', desc: 'Configure asset groups with subcategories, custom fields, depreciation defaults, and workflow rules.', steps: ['Go to Settings → Group Settings', 'Select or create a group', 'Add subcategories', 'Define custom fields', 'Set depreciation defaults', 'Configure workflow rules'], views: 478, updated: 'Feb 12, 2026' },
  { id: 5, title: 'Creating & Managing Work Orders', category: 'operations', duration: '6 min', type: 'guide', difficulty: 'beginner', desc: 'How to create, assign, track, and complete work orders for maintenance and repairs.', steps: ['Navigate to Work Orders', 'Click "New Work Order"', 'Set type, priority, and due date', 'Assign to technician', 'Track progress (Open → In Progress → Complete)', 'Review cost and time tracking'], views: 721, updated: 'Feb 10, 2026' },
  { id: 6, title: 'Check-In / Check-Out Workflow', category: 'operations', duration: '4 min', type: 'guide', difficulty: 'beginner', desc: 'Master the asset checkout and return process with condition tracking and overdue management.', steps: ['Go to Check-In/Out page', 'Click "Check Out" and select asset', 'Set return date and location', 'Monitor active checkouts', 'Process returns with condition assessment', 'Handle overdue items'], views: 567, updated: 'Feb 8, 2026' },
  { id: 7, title: 'Running Physical Audits', category: 'operations', duration: '8 min', type: 'video', difficulty: 'intermediate', desc: 'Complete guide to planning, executing, and reporting on physical asset audits with accuracy tracking.', steps: ['Create new audit (Full, Spot Check, Cycle Count)', 'Define scope (group, location)', 'Start the audit', 'Count and scan assets', 'Reconcile discrepancies', 'Generate audit report'], views: 345, updated: 'Feb 5, 2026' },
  { id: 8, title: 'Understanding Depreciation Reports', category: 'reports', duration: '10 min', type: 'video', difficulty: 'advanced', desc: 'Deep dive into depreciation methods, year-by-year schedules, book value tracking, and export for accounting.', steps: ['Navigate to Depreciation page', 'Understand Straight-Line vs Declining Balance', 'Read the portfolio overview bar', 'Filter by group and method', 'Click asset for year-by-year schedule', 'Export for accounting integration'], views: 289, updated: 'Feb 3, 2026' },
  { id: 9, title: 'Generating & Scheduling Reports', category: 'reports', duration: '7 min', type: 'guide', difficulty: 'intermediate', desc: 'Generate on-demand reports and set up automated schedules for recurring report delivery.', steps: ['Go to Reports page', 'Choose report type', 'Configure filters and date range', 'Select output format (PDF, Excel, CSV)', 'For recurring: go to Settings → Automated Reports', 'Set frequency, time, and email recipients'], views: 412, updated: 'Jan 30, 2026' },
  { id: 10, title: 'Configuring Notification Rules', category: 'settings', duration: '5 min', type: 'guide', difficulty: 'intermediate', desc: 'Set up automated alerts for overdue items, license expiry, maintenance due dates, and more.', steps: ['Go to Settings → Notification Rules', 'Review default rules', 'Toggle rules on/off', 'Edit recipients and timing', 'Configure channels (Email, Slack, In-App)', 'Set quiet hours and batch preferences'], views: 356, updated: 'Jan 28, 2026' },
  { id: 11, title: 'API Integration Guide', category: 'integrations', duration: '12 min', type: 'guide', difficulty: 'advanced', desc: 'Connect external systems using the REST API — keys, scopes, webhooks, and rate limits.', steps: ['Go to Settings → API Config', 'Generate an API key with required scopes', 'Authenticate with Bearer token', 'Make API requests (GET, POST, PUT, DELETE)', 'Set up webhooks for real-time events', 'Monitor rate limits and usage'], views: 198, updated: 'Jan 25, 2026' },
  { id: 12, title: 'Connecting Microsoft 365 & Slack', category: 'integrations', duration: '6 min', type: 'video', difficulty: 'intermediate', desc: 'Step-by-step setup for Microsoft 365 user sync and Slack notification integration.', steps: ['Go to Settings → Integrations', 'Click Connect on Microsoft 365', 'Authorize Azure AD permissions', 'Configure user sync settings', 'Connect Slack workspace', 'Choose notification channels'], views: 267, updated: 'Jan 22, 2026' },
  { id: 13, title: 'Barcode & QR Label Printing', category: 'assets', duration: '4 min', type: 'guide', difficulty: 'beginner', desc: 'Generate and print barcode or QR code labels for your assets with customizable templates.', steps: ['Go to Barcode Generator', 'Select assets from the list', 'Choose a label template', 'Click Generate to preview', 'Review labels in preview pane', 'Print directly or export'], views: 523, updated: 'Jan 20, 2026' },
  { id: 14, title: 'User Roles & Permission Templates', category: 'settings', duration: '6 min', type: 'guide', difficulty: 'intermediate', desc: 'Understand role-based access control, create custom templates, and manage user permissions.', steps: ['Go to Settings → User Templates', 'Review system roles (Admin, Manager, Technician, Viewer)', 'View permission matrix per role', 'Create custom template', 'Assign templates to users', 'Audit access in Change Logs'], views: 312, updated: 'Jan 18, 2026' },
];

const diffColor = { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' };
const typeIcon = { video: 'fa-play-circle', guide: 'fa-book-open' };

export default function Tutorials() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [difficulty, setDifficulty] = useState('all');

  const filtered = TUTORIALS.filter(t => {
    if (category !== 'all' && t.category !== category) return false;
    if (difficulty !== 'all' && t.difficulty !== difficulty) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="page-header">
        <div><h1>Tutorials</h1><p>{TUTORIALS.length} guides and video walkthroughs</p></div>
      </div>

      {/* Getting Started Banner */}
      <div className="card" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, rgba(79,107,237,0.08) 0%, rgba(16,185,129,0.06) 100%)', border: '1px solid rgba(79,107,237,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(79,107,237,0.12)', color: 'var(--gn-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>New to Global Neochain?</h2>
            <p style={{ fontSize: 14, color: 'var(--gn-text-secondary)', margin: 0 }}>Start with our Getting Started guide to learn the basics, then explore module-specific tutorials.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setDetail(TUTORIALS[0])} style={{ flexShrink: 0 }}>
            <i className="fa-solid fa-play"></i> Start Learning
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCategory(c.key)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${category === c.key ? 'var(--gn-accent)' : 'var(--gn-border)'}`,
              background: category === c.key ? 'rgba(79,107,237,0.08)' : 'var(--gn-surface)',
              color: category === c.key ? 'var(--gn-accent)' : 'var(--gn-text-secondary)'
            }}><i className={`fa-solid ${c.icon}`} style={{ fontSize: 10 }}></i>{c.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select className="form-control" value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ width: 150, marginBottom: 0 }}>
            <option value="all">All Levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
          </select>
          <input className="form-control" placeholder="Search tutorials..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220, marginBottom: 0 }} />
        </div>
      </div>

      {/* Tutorial Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {filtered.map(t => (
          <div key={t.id} className="card" onClick={() => setDetail(t)}
            style={{ cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            {/* Thumbnail */}
            <div style={{
              height: 130, background: `linear-gradient(135deg, ${diffColor[t.difficulty]}15, rgba(79,107,237,0.08))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
            }}>
              <i className={`fa-solid ${typeIcon[t.type]}`} style={{ fontSize: 36, color: 'var(--gn-accent)', opacity: 0.6 }}></i>
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', fontWeight: 600 }}>
                  <i className={`fa-solid ${typeIcon[t.type]}`} style={{ marginRight: 4, fontSize: 9 }}></i>{t.type}
                </span>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', fontWeight: 600 }}>
                  {t.duration}
                </span>
              </div>
              <span style={{
                position: 'absolute', bottom: 10, left: 10, fontSize: 10, padding: '3px 10px', borderRadius: 10,
                background: `${diffColor[t.difficulty]}20`, color: diffColor[t.difficulty], fontWeight: 600, textTransform: 'capitalize'
              }}>{t.difficulty}</span>
            </div>
            <div style={{ padding: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{t.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', lineHeight: 1.5, marginBottom: 10 }}>
                {t.desc.length > 100 ? t.desc.slice(0, 100) + '…' : t.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--gn-text-muted)' }}>
                <span><i className="fa-solid fa-eye" style={{ marginRight: 4 }}></i>{t.views.toLocaleString()} views</span>
                <span><i className="fa-solid fa-list-ol" style={{ marginRight: 4 }}></i>{t.steps.length} steps</span>
                <span style={{ marginLeft: 'auto' }}>{t.updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--gn-text-muted)' }}>
          <i className="fa-solid fa-search" style={{ fontSize: 32, marginBottom: 12, display: 'block', opacity: 0.3 }}></i>
          <p>No tutorials match your filters</p>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>{detail.title}</h2>
              <button className="modal-close" onClick={() => setDetail(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              {/* Meta */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 10, background: `${diffColor[detail.difficulty]}15`, color: diffColor[detail.difficulty], fontWeight: 600, textTransform: 'capitalize' }}>{detail.difficulty}</span>
                <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 10, background: 'var(--gn-surface-alt)', color: 'var(--gn-text-muted)', fontWeight: 500 }}>
                  <i className={`fa-solid ${typeIcon[detail.type]}`} style={{ marginRight: 4 }}></i>{detail.type === 'video' ? 'Video Tutorial' : 'Step-by-Step Guide'}
                </span>
                <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 10, background: 'var(--gn-surface-alt)', color: 'var(--gn-text-muted)', fontWeight: 500 }}>
                  <i className="fa-solid fa-clock" style={{ marginRight: 4 }}></i>{detail.duration}
                </span>
                <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 10, background: 'var(--gn-surface-alt)', color: 'var(--gn-text-muted)', fontWeight: 500 }}>
                  <i className="fa-solid fa-eye" style={{ marginRight: 4 }}></i>{detail.views.toLocaleString()} views
                </span>
              </div>

              <p style={{ fontSize: 14, color: 'var(--gn-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{detail.desc}</p>

              {/* Video placeholder */}
              {detail.type === 'video' && (
                <div style={{
                  height: 220, borderRadius: 12, marginBottom: 20,
                  background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    transition: 'transform 0.2s, background 0.2s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}>
                    <i className="fa-solid fa-play" style={{ fontSize: 22, color: '#fff', marginLeft: 3 }}></i>
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{detail.duration}</div>
                </div>
              )}

              {/* Steps */}
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
                {detail.type === 'video' ? 'What You\'ll Learn' : 'Step-by-Step Instructions'}
              </h3>
              {detail.steps.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0',
                  borderBottom: i < detail.steps.length - 1 ? '1px solid var(--gn-border-light)' : 'none'
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(79,107,237,0.08)', color: 'var(--gn-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700
                  }}>{i + 1}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, paddingTop: 3 }}>{s}</div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>Close</button>
              {detail.type === 'video' && (
                <button className="btn btn-primary"><i className="fa-solid fa-play"></i> Watch Video</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
