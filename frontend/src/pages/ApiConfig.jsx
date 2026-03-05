import { useState } from 'react';

const API_KEYS = [
  { id: 1, name: 'Production — ERP Sync', key: 'gn_prod_k8x2m...f9a3', prefix: 'gn_prod_', created: 'Jan 5, 2026', lastUsed: 'Feb 26, 2026 09:12', requests: '12,456', status: 'active', scopes: ['assets:read', 'assets:write', 'work-orders:read'] },
  { id: 2, name: 'Mobile App — Field Techs', key: 'gn_mob_p3y7n...k2d8', prefix: 'gn_mob_', created: 'Feb 1, 2026', lastUsed: 'Feb 26, 2026 08:45', requests: '3,218', status: 'active', scopes: ['assets:read', 'work-orders:read', 'work-orders:write', 'checkouts:write'] },
  { id: 3, name: 'Reporting Dashboard', key: 'gn_rpt_m1a9q...j5b2', prefix: 'gn_rpt_', created: 'Dec 15, 2025', lastUsed: 'Feb 25, 2026', requests: '8,921', status: 'active', scopes: ['assets:read', 'reports:read', 'dashboard:read'] },
  { id: 4, name: 'Legacy Import Script', key: 'gn_dev_x4k8w...r7e1', prefix: 'gn_dev_', created: 'Nov 10, 2025', lastUsed: 'Jan 2, 2026', requests: '456', status: 'inactive', scopes: ['assets:write'] },
];

const WEBHOOKS = [
  { id: 1, url: 'https://erp.neochain.com/api/webhooks/assets', events: ['asset.created', 'asset.updated', 'asset.deleted'], status: 'active', lastTriggered: 'Feb 26, 2026', successRate: '99.2%' },
  { id: 2, url: 'https://slack.com/api/incoming-webhooks/T03B...', events: ['work-order.overdue', 'checkout.overdue'], status: 'active', lastTriggered: 'Feb 25, 2026', successRate: '100%' },
  { id: 3, url: 'https://monitoring.neochain.com/hooks/gn', events: ['system.error', 'audit.completed'], status: 'active', lastTriggered: 'Feb 24, 2026', successRate: '98.5%' },
];

const SCOPES = ['assets:read', 'assets:write', 'work-orders:read', 'work-orders:write', 'checkouts:read', 'checkouts:write', 'users:read', 'users:write', 'licenses:read', 'licenses:write', 'reports:read', 'dashboard:read', 'audits:read', 'audits:write'];

export default function ApiConfig() {
  const [tab, setTab] = useState('keys');
  const [createKeyModal, setCreateKeyModal] = useState(false);
  const [createWebhookModal, setCreateWebhookModal] = useState(false);
  const [form, setForm] = useState({ name: '', scopes: [], rateLimit: '1000' });
  const [whForm, setWhForm] = useState({ url: '', events: [] });

  return (
    <>
      <div className="page-header">
        <div><h1>API Configuration</h1><p>Manage API keys, webhooks, and rate limits</p></div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => window.open('/api/docs', '_blank')}><i className="fa-solid fa-book"></i> API Docs</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', marginBottom: 20 }}>
        {[
          { l: 'Active Keys', v: API_KEYS.filter(k => k.status === 'active').length, icon: 'fa-key', color: 'green' },
          { l: 'Total Requests (MTD)', v: '24,595', icon: 'fa-arrow-up-right-dots', color: 'blue' },
          { l: 'Active Webhooks', v: WEBHOOKS.filter(w => w.status === 'active').length, icon: 'fa-globe', color: 'purple' },
          { l: 'Rate Limit', v: '1,000/hr', icon: 'fa-gauge', color: 'orange' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
            <div><div className="stat-label">{s.l}</div><div className="stat-value">{s.v}</div></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid var(--gn-border-light)' }}>
        {[['keys', 'API Keys'], ['webhooks', 'Webhooks'], ['limits', 'Rate Limits']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: 'none', borderBottom: `2px solid ${tab === k ? 'var(--gn-accent)' : 'transparent'}`, color: tab === k ? 'var(--gn-accent)' : 'var(--gn-text-muted)', marginBottom: -2 }}>{l}</button>
        ))}
      </div>

      {tab === 'keys' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button className="btn btn-primary" onClick={() => setCreateKeyModal(true)}><i className="fa-solid fa-plus"></i> Generate Key</button>
          </div>
          <div className="card">
            {API_KEYS.map((k, i) => (
              <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < API_KEYS.length - 1 ? '1px solid var(--gn-border-light)' : 'none', opacity: k.status === 'active' ? 1 : 0.5 }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: k.status === 'active' ? '#10B98115' : '#94A3B815', color: k.status === 'active' ? '#10B981' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-key"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{k.name}</div>
                  <div className="font-mono" style={{ fontSize: 12, color: 'var(--gn-text-muted)', marginBottom: 4 }}>{k.key}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {k.scopes.slice(0, 4).map(s => <span key={s} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--gn-surface-alt)', color: 'var(--gn-text-muted)' }}>{s}</span>)}
                    {k.scopes.length > 4 && <span style={{ fontSize: 10, color: 'var(--gn-text-muted)' }}>+{k.scopes.length - 4}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--gn-text-muted)' }}>
                  <div>{k.requests} requests</div>
                  <div>Last: {k.lastUsed}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-sm btn-secondary"><i className="fa-solid fa-copy"></i></button>
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--gn-danger)' }}><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'webhooks' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button className="btn btn-primary" onClick={() => setCreateWebhookModal(true)}><i className="fa-solid fa-plus"></i> Add Webhook</button>
          </div>
          <div className="card">
            {WEBHOOKS.map((w, i) => (
              <div key={w.id} style={{ padding: '16px 20px', borderBottom: i < WEBHOOKS.length - 1 ? '1px solid var(--gn-border-light)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span className={`badge ${w.status === 'active' ? 'green' : 'gray'}`}>{w.status}</span>
                  <span className="font-mono text-sm" style={{ flex: 1 }}>{w.url}</span>
                  <span style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>Success: {w.successRate}</span>
                  <button className="btn btn-sm btn-secondary"><i className="fa-solid fa-pen"></i></button>
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--gn-danger)' }}><i className="fa-solid fa-trash"></i></button>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {w.events.map(e => <span key={e} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: '#4F6BED15', color: '#4F6BED', fontWeight: 500 }}>{e}</span>)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'limits' && (
        <div className="card" style={{ padding: 24, maxWidth: 600 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Rate Limit Configuration</h3>
          <div className="form-group"><label>Global Rate Limit (requests/hour)</label><input className="form-control" type="number" defaultValue="1000" /></div>
          <div className="form-group"><label>Per-Key Rate Limit (requests/hour)</label><input className="form-control" type="number" defaultValue="500" /></div>
          <div className="form-group"><label>Burst Limit (requests/second)</label><input className="form-control" type="number" defaultValue="50" /></div>
          <div className="form-group"><label>Rate Limit Response</label>
            <select className="form-control"><option>429 Too Many Requests + Retry-After header</option><option>Queue and retry</option><option>Throttle (slow down)</option></select>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 8 }}>Save Limits</button>
        </div>
      )}

      {createKeyModal && (
        <div className="modal-overlay" onClick={() => setCreateKeyModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header"><h2>Generate API Key</h2><button className="modal-close" onClick={() => setCreateKeyModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Key Name</label><input className="form-control" placeholder="e.g. Production ERP Integration" /></div>
              <div className="form-group"><label>Scopes</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                  {SCOPES.map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: 4, cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--gn-accent)' }} />{s}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>Rate Limit Override (optional)</label><input className="form-control" type="number" placeholder="Default: 500/hr" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setCreateKeyModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setCreateKeyModal(false); alert('API key generated!'); }}>Generate Key</button>
            </div>
          </div>
        </div>
      )}

      {createWebhookModal && (
        <div className="modal-overlay" onClick={() => setCreateWebhookModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header"><h2>Add Webhook</h2><button className="modal-close" onClick={() => setCreateWebhookModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Endpoint URL</label><input className="form-control" placeholder="https://your-app.com/webhooks/neochain" /></div>
              <div className="form-group"><label>Events</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                  {['asset.created', 'asset.updated', 'asset.deleted', 'work-order.created', 'work-order.overdue', 'checkout.created', 'checkout.overdue', 'license.expiring', 'audit.completed', 'system.error'].map(e => (
                    <label key={e} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: 4, cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--gn-accent)' }} />{e}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>Secret (for signature verification)</label><input className="form-control" placeholder="whsec_..." /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setCreateWebhookModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setCreateWebhookModal(false); alert('Webhook created!'); }}>Create Webhook</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
