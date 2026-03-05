import { useState } from 'react';

const INTEGRATIONS = [
  { id: 1, name: 'Microsoft 365', icon: 'fa-microsoft', iconType: 'fab', color: '#0078D4', category: 'productivity', desc: 'Sync users from Azure AD, integrate with Teams for notifications, and connect to SharePoint for document management.', status: 'connected', connectedAt: 'Jan 5, 2026', syncedItems: '127 users, 450 docs', features: ['Azure AD User Sync', 'Teams Notifications', 'SharePoint Documents', 'Outlook Calendar'] },
  { id: 2, name: 'Slack', icon: 'fa-slack', iconType: 'fab', color: '#E01E5A', category: 'communication', desc: 'Send real-time alerts and notifications to Slack channels. Supports work order updates, overdue alerts, and daily digests.', status: 'connected', connectedAt: 'Jan 12, 2026', syncedItems: '3 channels', features: ['Channel Notifications', 'Slash Commands', 'Interactive Messages', 'Daily Digest Bot'] },
  { id: 3, name: 'QuickBooks', icon: 'fa-calculator', iconType: 'fas', color: '#2CA01C', category: 'finance', desc: 'Sync asset purchases, depreciation entries, and maintenance costs with QuickBooks for seamless accounting.', status: 'connected', connectedAt: 'Feb 1, 2026', syncedItems: '71 assets synced', features: ['Asset Purchase Sync', 'Depreciation Journals', 'Maintenance Cost Tracking', 'Vendor Management'] },
  { id: 4, name: 'Jira', icon: 'fa-jira', iconType: 'fab', color: '#0052CC', category: 'project', desc: 'Link work orders to Jira tickets. Automatically create issues for maintenance tasks and track resolution.', status: 'disconnected', connectedAt: null, syncedItems: null, features: ['Issue Creation', 'Bi-directional Sync', 'Status Mapping', 'Sprint Integration'] },
  { id: 5, name: 'Salesforce', icon: 'fa-salesforce', iconType: 'fab', color: '#00A1E0', category: 'crm', desc: 'Connect customer assets, manage warranties through cases, and sync contract data with Salesforce CRM.', status: 'disconnected', connectedAt: null, syncedItems: null, features: ['Asset-to-Account Mapping', 'Case Integration', 'Contract Sync', 'Custom Object Mapping'] },
  { id: 6, name: 'Google Workspace', icon: 'fa-google', iconType: 'fab', color: '#4285F4', category: 'productivity', desc: 'Sync users from Google Directory, integrate with Google Drive for documents, and Calendar for maintenance scheduling.', status: 'disconnected', connectedAt: null, syncedItems: null, features: ['Directory Sync', 'Drive Integration', 'Calendar Events', 'Gmail Notifications'] },
  { id: 7, name: 'ServiceNow', icon: 'fa-snowflake', iconType: 'fas', color: '#81B5A1', category: 'itsm', desc: 'Integrate with ServiceNow ITSM for incident management, change requests, and CMDB synchronization.', status: 'disconnected', connectedAt: null, syncedItems: null, features: ['CMDB Sync', 'Incident Integration', 'Change Management', 'Asset Discovery'] },
  { id: 8, name: 'Power BI', icon: 'fa-chart-pie', iconType: 'fas', color: '#F2C811', category: 'analytics', desc: 'Push asset data to Power BI for advanced analytics, custom dashboards, and executive reporting.', status: 'connected', connectedAt: 'Feb 10, 2026', syncedItems: '3 datasets', features: ['Real-time Data Feed', 'Custom Datasets', 'Embedded Reports', 'Scheduled Refresh'] },
  { id: 9, name: 'Okta', icon: 'fa-shield-halved', iconType: 'fas', color: '#007DC1', category: 'identity', desc: 'Single sign-on (SSO) and user provisioning through Okta. SCIM support for automated user lifecycle.', status: 'disconnected', connectedAt: null, syncedItems: null, features: ['SSO (SAML/OIDC)', 'SCIM Provisioning', 'MFA Policies', 'Group Mapping'] },
];

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'communication', label: 'Communication' },
  { key: 'finance', label: 'Finance' },
  { key: 'project', label: 'Project Mgmt' },
  { key: 'crm', label: 'CRM' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'identity', label: 'Identity' },
  { key: 'itsm', label: 'ITSM' },
];

export default function Integrations() {
  const [category, setCategory] = useState('all');
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState('');

  const connected = INTEGRATIONS.filter(i => i.status === 'connected');
  const filtered = INTEGRATIONS.filter(i => {
    if (category !== 'all' && i.category !== category) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="page-header">
        <div><h1>Integrations</h1><p>{connected.length} connected, {INTEGRATIONS.length - connected.length} available</p></div>
      </div>

      {/* Connected summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {connected.map(c => (
          <div key={c.id} className="card" onClick={() => setDetail(c)} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, minWidth: 200, transition: 'transform 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${c.color}15`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              <i className={`${c.iconType === 'fab' ? 'fa-brands' : 'fa-solid'} ${c.icon}`}></i>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: '#10B981' }}><i className="fa-solid fa-circle" style={{ fontSize: 6, marginRight: 4 }}></i>Connected</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCategory(c.key)} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${category === c.key ? 'var(--gn-accent)' : 'var(--gn-border)'}`,
              background: category === c.key ? 'rgba(79,107,237,0.08)' : 'var(--gn-surface)',
              color: category === c.key ? 'var(--gn-accent)' : 'var(--gn-text-secondary)'
            }}>{c.label}</button>
          ))}
        </div>
        <input className="form-control" placeholder="Search integrations..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220, marginBottom: 0 }} />
      </div>

      {/* Integration Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {filtered.map(ig => (
          <div key={ig.id} className="card" style={{ overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: ig.color }}></div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${ig.color}15`, color: ig.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <i className={`${ig.iconType === 'fab' ? 'fa-brands' : 'fa-solid'} ${ig.icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>{ig.name}</h3>
                  <span className={`badge ${ig.status === 'connected' ? 'green' : 'gray'}`}>{ig.status === 'connected' ? 'Connected' : 'Available'}</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', lineHeight: 1.5, marginBottom: 14 }}>{ig.desc}</p>
              {ig.status === 'connected' && (
                <div style={{ fontSize: 12, color: 'var(--gn-text-muted)', marginBottom: 14 }}>
                  <span><i className="fa-solid fa-calendar" style={{ marginRight: 4 }}></i>Since {ig.connectedAt}</span>
                  {ig.syncedItems && <span style={{ marginLeft: 12 }}><i className="fa-solid fa-arrows-rotate" style={{ marginRight: 4 }}></i>{ig.syncedItems}</span>}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                {ig.status === 'connected' ? (
                  <>
                    <button className="btn btn-sm btn-secondary" onClick={() => setDetail(ig)}><i className="fa-solid fa-gear"></i> Configure</button>
                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--gn-danger)' }}><i className="fa-solid fa-link-slash"></i> Disconnect</button>
                  </>
                ) : (
                  <button className="btn btn-sm btn-primary" onClick={() => alert(`Connecting to ${ig.name}...`)}><i className="fa-solid fa-link"></i> Connect</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 550 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${detail.color}15`, color: detail.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`${detail.iconType === 'fab' ? 'fa-brands' : 'fa-solid'} ${detail.icon}`}></i>
                </div>
                <h2>{detail.name}</h2>
              </div>
              <button className="modal-close" onClick={() => setDetail(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', marginBottom: 20, lineHeight: 1.5 }}>{detail.desc}</p>
              {detail.status === 'connected' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {[['Connected Since', detail.connectedAt], ['Synced Data', detail.syncedItems || '—']].map(([l, v], i) => (
                    <div key={i} style={{ padding: 10, background: 'var(--gn-surface-alt)', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--gn-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{l}</div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Features</h3>
              {detail.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < detail.features.length - 1 ? '1px solid var(--gn-border-light)' : 'none' }}>
                  <i className="fa-solid fa-circle-check" style={{ fontSize: 12, color: detail.status === 'connected' ? '#10B981' : 'var(--gn-text-muted)' }}></i>
                  <span style={{ fontSize: 13 }}>{f}</span>
                  {detail.status === 'connected' && (
                    <div style={{ marginLeft: 'auto', width: 36, height: 20, borderRadius: 10, cursor: 'pointer', padding: 2, background: 'var(--gn-accent)' }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', transform: 'translateX(16px)' }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>Close</button>
              {detail.status === 'connected' ? (
                <button className="btn btn-primary"><i className="fa-solid fa-arrows-rotate"></i> Sync Now</button>
              ) : (
                <button className="btn btn-primary"><i className="fa-solid fa-link"></i> Connect</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
