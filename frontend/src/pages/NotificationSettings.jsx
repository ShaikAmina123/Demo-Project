import { useState } from 'react';

const RULES = [
  { id: 1, name: 'Overdue Checkout Alert', event: 'checkout_overdue', channel: ['email', 'inapp'], recipients: 'Asset Owner, Admin', delay: '0 hours', enabled: true, desc: 'Triggered when an asset is not returned by the due date' },
  { id: 2, name: 'License Expiry Warning', event: 'license_expiring', channel: ['email', 'inapp'], recipients: 'Admin, License Manager', delay: '30 days before', enabled: true, desc: 'Alert before a license or contract expires' },
  { id: 3, name: 'Maintenance Due Reminder', event: 'maintenance_due', channel: ['email'], recipients: 'Assigned Technician', delay: '3 days before', enabled: true, desc: 'Remind assigned person before scheduled maintenance' },
  { id: 4, name: 'Work Order Overdue', event: 'wo_overdue', channel: ['email', 'inapp', 'slack'], recipients: 'Assignee, Manager', delay: '0 hours', enabled: true, desc: 'Alert when a work order passes its due date' },
  { id: 5, name: 'Low Inventory Alert', event: 'low_inventory', channel: ['email', 'inapp'], recipients: 'Inventory Manager', delay: 'Immediate', enabled: true, desc: 'Triggered when consumable stock falls below reorder level' },
  { id: 6, name: 'Warranty Expiry Warning', event: 'warranty_expiring', channel: ['email'], recipients: 'Admin', delay: '60 days before', enabled: true, desc: 'Alert before asset warranty expires' },
  { id: 7, name: 'Audit Completion', event: 'audit_completed', channel: ['email', 'inapp'], recipients: 'Admin, Audit Manager', delay: 'Immediate', enabled: true, desc: 'Notification when an audit is completed with results' },
  { id: 8, name: 'Asset Status Change', event: 'asset_status_change', channel: ['inapp'], recipients: 'Asset Owner', delay: 'Immediate', enabled: false, desc: 'Notify owner when asset status changes (active/maintenance/retired)' },
  { id: 9, name: 'New Asset Created', event: 'asset_created', channel: ['inapp'], recipients: 'Group Manager', delay: 'Immediate', enabled: false, desc: 'Notify group manager when a new asset is added to their group' },
  { id: 10, name: 'Daily Digest', event: 'daily_digest', channel: ['email'], recipients: 'Admin', delay: '8:00 AM daily', enabled: true, desc: 'Daily summary of all activity, pending items, and alerts' },
];

const CHANNELS = [
  { id: 'email', name: 'Email', icon: 'fa-envelope', color: '#3B82F6', configured: true },
  { id: 'inapp', name: 'In-App', icon: 'fa-bell', color: '#10B981', configured: true },
  { id: 'slack', name: 'Slack', icon: 'fa-hashtag', color: '#E01E5A', configured: true },
  { id: 'sms', name: 'SMS', icon: 'fa-comment-sms', color: '#8B5CF6', configured: false },
  { id: 'webhook', name: 'Webhook', icon: 'fa-globe', color: '#F59E0B', configured: false },
];

export default function NotificationSettings() {
  const [tab, setTab] = useState('rules');
  const [rules, setRules] = useState(RULES);
  const [editRule, setEditRule] = useState(null);
  const [saved, setSaved] = useState(false);

  const toggleRule = (id) => setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <>
      <div className="page-header">
        <div><h1>Notification Settings</h1><p>Configure alert rules, channels, and delivery preferences</p></div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={save}>{saved ? <><i className="fa-solid fa-check"></i> Saved!</> : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid var(--gn-border-light)' }}>
        {[['rules', 'Alert Rules'], ['channels', 'Channels'], ['preferences', 'Preferences']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: 'none', borderBottom: `2px solid ${tab === k ? 'var(--gn-accent)' : 'transparent'}`, color: tab === k ? 'var(--gn-accent)' : 'var(--gn-text-muted)', marginBottom: -2 }}>{l}</button>
        ))}
      </div>

      {tab === 'rules' && (
        <div className="card">
          {rules.map((r, i) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: i < rules.length - 1 ? '1px solid var(--gn-border-light)' : 'none', opacity: r.enabled ? 1 : 0.5 }}>
              <div onClick={() => toggleRule(r.id)} style={{ width: 40, height: 22, borderRadius: 11, cursor: 'pointer', padding: 2, background: r.enabled ? 'var(--gn-accent)' : 'var(--gn-border)', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'transform 0.2s', transform: r.enabled ? 'translateX(18px)' : 'translateX(0)' }}></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gn-text-muted)', marginBottom: 6 }}>{r.desc}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--gn-text-muted)' }}>
                  <span><i className="fa-solid fa-users" style={{ marginRight: 4 }}></i>{r.recipients}</span>
                  <span><i className="fa-solid fa-clock" style={{ marginRight: 4 }}></i>{r.delay}</span>
                  <span style={{ display: 'flex', gap: 4 }}>{r.channel.map(c => <span key={c} className={`badge ${c === 'email' ? 'blue' : c === 'slack' ? 'red' : 'green'}`} style={{ fontSize: 9 }}>{c}</span>)}</span>
                </div>
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setEditRule(r)}><i className="fa-solid fa-pen"></i></button>
            </div>
          ))}
        </div>
      )}

      {tab === 'channels' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14 }}>
          {CHANNELS.map(c => (
            <div key={c.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${c.color}15`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  <i className={`fa-solid ${c.icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</h3>
                  <span className={`badge ${c.configured ? 'green' : 'gray'}`} style={{ fontSize: 10 }}>{c.configured ? 'Configured' : 'Not configured'}</span>
                </div>
              </div>
              <button className={`btn btn-sm ${c.configured ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%' }}>
                {c.configured ? 'Configure' : 'Set Up'}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'preferences' && (
        <div className="card" style={{ padding: 24, maxWidth: 600 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Global Preferences</h3>
          {[
            ['Quiet hours (no email notifications)', false, 'Emails held during quiet hours and sent as batch'],
            ['Batch digest instead of individual emails', false, 'Combine multiple alerts into a single email'],
            ['Include asset photos in email alerts', true, ''],
            ['Send weekly summary report', true, 'Every Monday at 9:00 AM'],
            ['Notify on system updates', true, 'Platform updates and maintenance windows'],
          ].map(([label, val, hint], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 4 ? '1px solid var(--gn-border-light)' : 'none' }}>
              <div><div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{label}</div>{hint && <div style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>{hint}</div>}</div>
              <div style={{ width: 40, height: 22, borderRadius: 11, cursor: 'pointer', padding: 2, background: val ? 'var(--gn-accent)' : 'var(--gn-border)', flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', transform: val ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.2s' }}></div>
              </div>
            </div>
          ))}
          <div className="form-group" style={{ marginTop: 20 }}><label>Quiet Hours</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="time" className="form-control" defaultValue="22:00" style={{ width: 130, marginBottom: 0 }} />
              <span style={{ color: 'var(--gn-text-muted)' }}>to</span>
              <input type="time" className="form-control" defaultValue="07:00" style={{ width: 130, marginBottom: 0 }} />
            </div>
          </div>
        </div>
      )}

      {editRule && (
        <div className="modal-overlay" onClick={() => setEditRule(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header"><h2>Edit Rule: {editRule.name}</h2><button className="modal-close" onClick={() => setEditRule(null)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Rule Name</label><input className="form-control" defaultValue={editRule.name} /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" rows={2} defaultValue={editRule.desc} /></div>
              <div className="form-group"><label>Recipients</label><input className="form-control" defaultValue={editRule.recipients} /></div>
              <div className="form-group"><label>Timing / Delay</label><input className="form-control" defaultValue={editRule.delay} /></div>
              <div className="form-group"><label>Channels</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {CHANNELS.filter(c => c.configured).map(c => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={editRule.channel.includes(c.id)} style={{ accentColor: 'var(--gn-accent)' }} />{c.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditRule(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setEditRule(null)}>Save Rule</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
