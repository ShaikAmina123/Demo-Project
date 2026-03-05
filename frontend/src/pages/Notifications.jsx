import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_NOTIFS = [
  { id: 1, type: 'overdue', icon: 'fa-clock', color: '#EF4444', title: 'Overdue Return', msg: 'Epson Projector X41 (GN-00399) was due Feb 12. Checked out to Amy Ross.', time: '2 hours ago', read: false, link: '/check-in-out', actionLabel: 'Check In' },
  { id: 2, type: 'maintenance', icon: 'fa-wrench', color: '#F59E0B', title: 'Maintenance Due', msg: 'Caterpillar C15 Generator #4 — Annual service scheduled for Feb 20.', time: '5 hours ago', read: false, link: '/work-orders', actionLabel: 'View WO' },
  { id: 3, type: 'expiring', icon: 'fa-file-contract', color: '#3B82F6', title: 'License Expiring', msg: 'Microsoft Office 365 E3 (250 seats) expires Mar 1, 2026. Renewal needed.', time: 'Yesterday', read: false, link: '/licenses', actionLabel: 'Renew' },
  { id: 4, type: 'audit', icon: 'fa-clipboard-check', color: '#10B981', title: 'Audit In Progress', msg: 'IT Equipment Spot Check — 2,847 of 4,496 assets counted (63%). Floor 3 remaining.', time: 'Yesterday', read: false, link: '/audits', actionLabel: 'Continue' },
  { id: 5, type: 'overdue', icon: 'fa-fire', color: '#EF4444', title: 'Overdue Work Order', msg: 'WO-1086: Fire Alarm Inspection was due Feb 18. Assigned to SafeGuard Fire.', time: 'Today', read: false, link: '/work-orders', actionLabel: 'View' },
  { id: 6, type: 'expiring', icon: 'fa-clock', color: '#F59E0B', title: 'License Expiring', msg: 'Salesforce CRM Enterprise (100 seats) expires Apr 1. Renewal quote received.', time: 'Feb 13', read: true, link: '/licenses', actionLabel: 'Review' },
  { id: 7, type: 'asset', icon: 'fa-laptop', color: '#6366F1', title: 'Asset Status Change', msg: 'Dell OptiPlex 7090 (GN-00470) moved to Maintenance. SSD replacement scheduled.', time: 'Feb 12', read: true, link: '/assets', actionLabel: 'View' },
  { id: 8, type: 'checkout', icon: 'fa-arrow-right', color: '#3B82F6', title: 'New Checkout', msg: 'Mike Torres checked out Toyota Hilux 2025 (GN-00480) to Field — Austin.', time: 'Feb 14', read: true, link: '/check-in-out', actionLabel: 'View' },
  { id: 9, type: 'warranty', icon: 'fa-shield', color: '#F59E0B', title: 'Warranty Expiring', msg: 'Cisco SmartNet (Network Equipment) expires Jun 1, 2026. Renewal needed.', time: 'Feb 10', read: true, link: '/assets', actionLabel: 'Renew' },
  { id: 10, type: 'system', icon: 'fa-gear', color: '#64748B', title: 'System Update', msg: 'Platform v2.4.1 deployed — includes barcode scanning improvements and bulk import fix.', time: 'Feb 8', read: true, link: null, actionLabel: null },
  { id: 11, type: 'maintenance', icon: 'fa-wrench', color: '#F59E0B', title: 'Maintenance Complete', msg: 'WO-1083: Server room UPS battery test completed successfully. All systems nominal.', time: 'Feb 7', read: true, link: '/work-orders', actionLabel: 'View' },
  { id: 12, type: 'overdue', icon: 'fa-clock', color: '#EF4444', title: 'Overdue Return', msg: 'Canon EOS R5 Camera (GN-00372) was due Feb 8. Checked out to Marketing.', time: 'Feb 9', read: true, link: '/check-in-out', actionLabel: 'Check In' },
];

const FILTERS = [
  { key: 'all', label: 'All', icon: 'fa-bell' },
  { key: 'unread', label: 'Unread', icon: 'fa-circle' },
  { key: 'overdue', label: 'Overdue', icon: 'fa-clock' },
  { key: 'maintenance', label: 'Maintenance', icon: 'fa-wrench' },
  { key: 'expiring', label: 'Expiring', icon: 'fa-file-contract' },
  { key: 'asset', label: 'Assets', icon: 'fa-laptop' },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFS);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAction = (notif) => {
    markRead(notif.id);
    if (notif.link) navigate(notif.link);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}</p>
        </div>
        <div className="page-header-actions">
          {unreadCount > 0 && (
            <button className="btn btn-secondary" onClick={markAllRead}>
              <i className="fa-solid fa-check-double"></i> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              border: `1px solid ${filter === f.key ? 'var(--gn-accent)' : 'var(--gn-border)'}`,
              background: filter === f.key ? 'rgba(79,107,237,0.08)' : 'var(--gn-surface)',
              color: filter === f.key ? 'var(--gn-accent)' : 'var(--gn-text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease'
            }}
          >
            <i className={`fa-solid ${f.icon}`} style={{ fontSize: 11 }}></i>
            {f.label}
            {f.key === 'unread' && unreadCount > 0 && (
              <span style={{ background: 'var(--gn-danger)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10, marginLeft: 2 }}>{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="card">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--gn-text-muted)' }}>
            <i className="fa-solid fa-bell-slash" style={{ fontSize: 32, marginBottom: 12, display: 'block' }}></i>
            <p>No notifications{filter !== 'all' ? ` for "${filter}"` : ''}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((n, i) => (
              <div
                key={n.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--gn-border-light)' : 'none',
                  background: n.read ? 'transparent' : 'rgba(79,107,237,0.03)',
                  transition: 'background 0.15s ease'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: `${n.color}15`, color: n.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
                }}>
                  <i className={`fa-solid ${n.icon}`}></i>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gn-text)' }}>{n.title}</span>
                    {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gn-accent)', flexShrink: 0 }}></span>}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gn-text-secondary)', lineHeight: 1.5, margin: 0 }}>{n.msg}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>{n.time}</span>
                    {n.actionLabel && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAction(n)}
                        style={{ padding: '3px 10px', fontSize: 11 }}
                      >
                        {n.actionLabel}
                      </button>
                    )}
                    {!n.read && (
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => markRead(n.id)}
                        style={{ padding: '3px 8px', fontSize: 11 }}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => dismiss(n.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    color: 'var(--gn-text-muted)', fontSize: 13, flexShrink: 0, borderRadius: 4,
                    transition: 'color 0.15s'
                  }}
                  title="Dismiss"
                  onMouseEnter={e => e.target.style.color = 'var(--gn-danger)'}
                  onMouseLeave={e => e.target.style.color = 'var(--gn-text-muted)'}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
