import { useState } from 'react';

const LOGS = [
  { id: 1, time: 'Feb 26, 2026 10:23 AM', user: 'Sarah Chen', action: 'checkout', entity: 'Asset', target: 'Dell XPS 15 9530 (GN-00001)', details: 'Checked out to Sarah Chen, due Mar 5, 2026', ip: '192.168.1.45' },
  { id: 2, time: 'Feb 26, 2026 09:15 AM', user: 'Admin', action: 'update', entity: 'Work Order', target: 'WO-1087', details: 'Status changed: open → completed', ip: '192.168.1.10' },
  { id: 3, time: 'Feb 25, 2026 04:30 PM', user: 'Mike Torres', action: 'create', entity: 'Asset', target: 'HP LaserJet Pro M404 (GN-00492)', details: 'New asset created in IT Equipment group', ip: '192.168.1.72' },
  { id: 4, time: 'Feb 25, 2026 02:10 PM', user: 'Admin', action: 'update', entity: 'License', target: 'Microsoft Office 365 E3', details: 'Seats changed: 200 → 250. Cost: $36,000 → $45,000/yr', ip: '192.168.1.10' },
  { id: 5, time: 'Feb 25, 2026 11:45 AM', user: 'Tom Bradley', action: 'checkin', entity: 'Asset', target: 'Toyota Hilux 2025 (GN-00480)', details: 'Returned in Good condition to Fleet — Austin', ip: '10.0.0.33' },
  { id: 6, time: 'Feb 24, 2026 03:20 PM', user: 'Amy Ross', action: 'create', entity: 'Work Order', target: 'WO-1088', details: 'Emergency: Server room cooling failure', ip: '192.168.1.55' },
  { id: 7, time: 'Feb 24, 2026 10:00 AM', user: 'System', action: 'alert', entity: 'License', target: 'Microsoft 365 E3', details: 'Auto-alert: License expiring in 5 days', ip: 'system' },
  { id: 8, time: 'Feb 24, 2026 09:30 AM', user: 'Jake Miller', action: 'delete', entity: 'Asset', target: 'Old Monitor (GN-00015)', details: 'Asset disposed and removed from inventory', ip: '192.168.1.88' },
  { id: 9, time: 'Feb 23, 2026 04:45 PM', user: 'Admin', action: 'update', entity: 'User', target: 'Lisa Park', details: 'Role changed: User → Manager', ip: '192.168.1.10' },
  { id: 10, time: 'Feb 23, 2026 11:20 AM', user: 'Sarah Chen', action: 'create', entity: 'Audit', target: 'IT Equipment Spot Check', details: 'New audit started for IT Equipment group', ip: '192.168.1.45' },
  { id: 11, time: 'Feb 22, 2026 02:15 PM', user: 'Admin', action: 'update', entity: 'Settings', target: 'Company Settings', details: 'Fiscal year start changed: January → April', ip: '192.168.1.10' },
  { id: 12, time: 'Feb 22, 2026 09:00 AM', user: 'System', action: 'alert', entity: 'Asset', target: 'Epson Projector X41 (GN-00399)', details: 'Auto-alert: Checkout overdue by 2 days', ip: 'system' },
];

const actionColors = { create: '#10B981', update: '#3B82F6', delete: '#EF4444', checkout: '#8B5CF6', checkin: '#14B8A6', alert: '#F59E0B' };
const actionIcons = { create: 'fa-plus', update: 'fa-pen', delete: 'fa-trash', checkout: 'fa-arrow-right', checkin: 'fa-arrow-left', alert: 'fa-bell' };

export default function ChangeLogs() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [detail, setDetail] = useState(null);

  const filtered = LOGS.filter(l => {
    if (actionFilter !== 'all' && l.action !== actionFilter) return false;
    if (entityFilter !== 'all' && l.entity !== entityFilter) return false;
    if (search && !l.target.toLowerCase().includes(search.toLowerCase()) && !l.user.toLowerCase().includes(search.toLowerCase()) && !l.details.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="page-header">
        <div><h1>Change Logs</h1><p>Complete audit trail of all system activity</p></div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><i className="fa-solid fa-file-arrow-down"></i> Export Logs</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="form-control" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260, marginBottom: 0 }} />
        <select className="form-control" value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={{ width: 160, marginBottom: 0 }}>
          <option value="all">All Actions</option><option value="create">Create</option><option value="update">Update</option><option value="delete">Delete</option><option value="checkout">Checkout</option><option value="checkin">Check-in</option><option value="alert">Alert</option>
        </select>
        <select className="form-control" value={entityFilter} onChange={e => setEntityFilter(e.target.value)} style={{ width: 160, marginBottom: 0 }}>
          <option value="all">All Entities</option><option value="Asset">Assets</option><option value="Work Order">Work Orders</option><option value="License">Licenses</option><option value="User">Users</option><option value="Audit">Audits</option><option value="Settings">Settings</option>
        </select>
        <span style={{ fontSize: 13, color: 'var(--gn-text-muted)' }}>{filtered.length} entries</span>
      </div>

      {/* Log Timeline */}
      <div className="card">
        {filtered.map((l, i) => (
          <div key={l.id} onClick={() => setDetail(l)} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 20px', cursor: 'pointer',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--gn-border-light)' : 'none',
            transition: 'background 0.1s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,107,237,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: `${actionColors[l.action] || '#666'}15`, color: actionColors[l.action] || '#666',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12
            }}>
              <i className={`fa-solid ${actionIcons[l.action] || 'fa-circle'}`}></i>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{l.user}</span>
                <span className={`badge`} style={{ fontSize: 9, background: `${actionColors[l.action]}15`, color: actionColors[l.action] }}>{l.action}</span>
                <span style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>{l.entity}</span>
              </div>
              <div style={{ fontSize: 13, marginBottom: 2 }}>{l.target}</div>
              <div style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>{l.details}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--gn-text-muted)', whiteSpace: 'nowrap' }}>{l.time}</div>
            </div>
          </div>
        ))}
      </div>

      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header"><h2>Log Entry Details</h2><button className="modal-close" onClick={() => setDetail(null)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[['Timestamp', detail.time], ['User', detail.user], ['Action', detail.action], ['Entity', detail.entity], ['Target', detail.target], ['IP Address', detail.ip]].map(([l, v], i) => (
                  <div key={i} style={{ padding: 10, background: 'var(--gn-surface-alt)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--gn-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: 12, background: 'var(--gn-surface-alt)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--gn-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Details</div>
                <div style={{ fontSize: 13 }}>{detail.details}</div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDetail(null)}>Close</button></div>
          </div>
        </div>
      )}
    </>
  );
}
