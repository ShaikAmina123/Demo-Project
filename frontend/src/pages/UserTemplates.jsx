import { useState } from 'react';

const TEMPLATES = [
  { id: 1, name: 'Administrator', icon: 'fa-shield-halved', color: '#EF4444', desc: 'Full system access including settings, user management, and data deletion', users: 2, isSystem: true,
    permissions: { assets: 'full', workOrders: 'full', checkouts: 'full', audits: 'full', licenses: 'full', users: 'full', reports: 'full', settings: 'full', forms: 'full', media: 'full', documents: 'full', maintenance: 'full', depreciation: 'full', barcodes: 'full', apiConfig: 'full' }},
  { id: 2, name: 'Manager', icon: 'fa-user-tie', color: '#8B5CF6', desc: 'Create, edit, approve. Cannot manage users or change system settings', users: 5, isSystem: true,
    permissions: { assets: 'full', workOrders: 'full', checkouts: 'full', audits: 'full', licenses: 'view', users: 'none', reports: 'full', settings: 'none', forms: 'full', media: 'full', documents: 'full', maintenance: 'full', depreciation: 'view', barcodes: 'full', apiConfig: 'none' }},
  { id: 3, name: 'Technician', icon: 'fa-wrench', color: '#F59E0B', desc: 'Work orders, maintenance, check-in/out. Read-only access to other modules', users: 8, isSystem: true,
    permissions: { assets: 'view', workOrders: 'full', checkouts: 'full', audits: 'edit', licenses: 'none', users: 'none', reports: 'view', settings: 'none', forms: 'edit', media: 'edit', documents: 'view', maintenance: 'full', depreciation: 'none', barcodes: 'full', apiConfig: 'none' }},
  { id: 4, name: 'Viewer', icon: 'fa-eye', color: '#64748B', desc: 'Read-only access across all modules. Cannot create or modify records', users: 12, isSystem: true,
    permissions: { assets: 'view', workOrders: 'view', checkouts: 'view', audits: 'view', licenses: 'view', users: 'none', reports: 'view', settings: 'none', forms: 'view', media: 'view', documents: 'view', maintenance: 'view', depreciation: 'view', barcodes: 'none', apiConfig: 'none' }},
  { id: 5, name: 'Fleet Manager', icon: 'fa-truck', color: '#10B981', desc: 'Custom template for fleet and vehicle management team', users: 3, isSystem: false,
    permissions: { assets: 'edit', workOrders: 'full', checkouts: 'full', audits: 'edit', licenses: 'view', users: 'none', reports: 'full', settings: 'none', forms: 'full', media: 'full', documents: 'edit', maintenance: 'full', depreciation: 'view', barcodes: 'full', apiConfig: 'none' }},
];

const MODULES = [
  { key: 'assets', label: 'Assets', icon: 'fa-boxes-stacked' },
  { key: 'workOrders', label: 'Work Orders', icon: 'fa-wrench' },
  { key: 'checkouts', label: 'Check-In/Out', icon: 'fa-arrow-right-arrow-left' },
  { key: 'maintenance', label: 'Maintenance', icon: 'fa-calendar-check' },
  { key: 'audits', label: 'Audits', icon: 'fa-clipboard-check' },
  { key: 'licenses', label: 'Licenses', icon: 'fa-file-contract' },
  { key: 'reports', label: 'Reports', icon: 'fa-chart-bar' },
  { key: 'forms', label: 'Forms', icon: 'fa-file-lines' },
  { key: 'documents', label: 'Documents', icon: 'fa-folder-open' },
  { key: 'media', label: 'Media', icon: 'fa-photo-film' },
  { key: 'depreciation', label: 'Depreciation', icon: 'fa-chart-line' },
  { key: 'barcodes', label: 'Barcodes', icon: 'fa-barcode' },
  { key: 'users', label: 'Users', icon: 'fa-users-gear' },
  { key: 'settings', label: 'Settings', icon: 'fa-gear' },
  { key: 'apiConfig', label: 'API Config', icon: 'fa-code' },
];

const permColor = { full: '#10B981', edit: '#3B82F6', view: '#F59E0B', none: '#94A3B8' };
const permLabel = { full: 'Full Access', edit: 'Create & Edit', view: 'View Only', none: 'No Access' };

export default function UserTemplates() {
  const [selected, setSelected] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ name: '', desc: '', icon: 'fa-user', color: '#4F6BED' });

  return (
    <>
      <div className="page-header">
        <div><h1>User Templates</h1><p>Role-based permission templates for quick user provisioning</p></div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setCreateModal(true)}><i className="fa-solid fa-plus"></i> New Template</button>
        </div>
      </div>

      {/* Template Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14, marginBottom: 24 }}>
        {TEMPLATES.map(t => (
          <div key={t.id} className="card" onClick={() => setSelected(t)} style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'transform 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: t.color }}></div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${t.color}15`, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  <i className={`fa-solid ${t.icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>{t.name}</h3>
                    {t.isSystem && <span className="badge gray" style={{ fontSize: 9 }}>System</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>{t.users} users assigned</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', lineHeight: 1.5, marginBottom: 12 }}>{t.desc}</p>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {Object.entries(t.permissions).filter(([,v]) => v !== 'none').slice(0, 6).map(([k, v]) => (
                  <span key={k} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${permColor[v]}15`, color: permColor[v], fontWeight: 500 }}>
                    {MODULES.find(m => m.key === k)?.label}
                  </span>
                ))}
                {Object.values(t.permissions).filter(v => v !== 'none').length > 6 && (
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'var(--gn-surface-alt)', color: 'var(--gn-text-muted)' }}>
                    +{Object.values(t.permissions).filter(v => v !== 'none').length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${selected.color}15`, color: selected.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fa-solid ${selected.icon}`}></i>
                </div>
                <h2>{selected.name}</h2>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', marginBottom: 20 }}>{selected.desc}</p>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gn-text-muted)' }}>Module Permissions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {MODULES.map(m => {
                  const perm = selected.permissions[m.key] || 'none';
                  return (
                    <div key={m.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--gn-border-light)', background: perm === 'none' ? 'var(--gn-surface-alt)' : 'transparent' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className={`fa-solid ${m.icon}`} style={{ fontSize: 12, color: 'var(--gn-text-muted)', width: 16 }}></i>
                        <span style={{ fontSize: 13, opacity: perm === 'none' ? 0.5 : 1 }}>{m.label}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: permColor[perm] }}>{permLabel[perm]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              {!selected.isSystem && <button className="btn btn-primary"><i className="fa-solid fa-pen"></i> Edit Template</button>}
              <button className="btn btn-primary"><i className="fa-solid fa-copy"></i> Duplicate</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {createModal && (
        <div className="modal-overlay" onClick={() => setCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header"><h2>New User Template</h2><button className="modal-close" onClick={() => setCreateModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Template Name</label><input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. IT Support" /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" rows={2} value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="Describe the role and access level..." /></div>
              <div className="form-group"><label>Base Permissions From</label>
                <select className="form-control"><option value="">Start from scratch</option>{TEMPLATES.map(t => <option key={t.id} value={t.id}>Clone from: {t.name}</option>)}</select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setCreateModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setCreateModal(false); alert('Template created!'); }}>Create Template</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
