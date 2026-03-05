import { useState } from 'react';

const GROUPS = [
  { id: 1, name: 'IT Equipment', icon: 'fa-laptop', color: '#4F6BED', subcategories: ['Laptops & Desktops', 'Monitors & Peripherals', 'Network Equipment', 'Printers & Scanners', 'Servers'], customFields: ['MAC Address', 'IP Address', 'OS Version', 'RAM (GB)', 'Storage (GB)'], depMethod: 'straight-line', depLife: 5, requireApproval: true, autoTag: true },
  { id: 2, name: 'Facilities', icon: 'fa-building', color: '#00B8A9', subcategories: ['HVAC Systems', 'Furniture', 'Elevators', 'Fire Safety', 'Electrical'], customFields: ['Floor/Zone', 'Installation Date', 'Warranty Provider', 'Service Contract #'], depMethod: 'straight-line', depLife: 15, requireApproval: true, autoTag: true },
  { id: 3, name: 'Fleet & Vehicles', icon: 'fa-truck', color: '#F7931E', subcategories: ['Vehicles', 'Heavy Equipment', 'Forklifts', 'Trailers'], customFields: ['VIN', 'License Plate', 'Mileage', 'Fuel Type', 'Insurance Policy #'], depMethod: 'declining-balance', depLife: 8, requireApproval: true, autoTag: true },
  { id: 4, name: 'Contracts & Licenses', icon: 'fa-file-contract', color: '#8B5CF6', subcategories: ['Software Licenses', 'Vendor Contracts', 'Warranties', 'Service Agreements'], customFields: ['License Key', 'Seats/Qty', 'Renewal Date', 'Vendor Contact'], depMethod: 'none', depLife: 0, requireApproval: false, autoTag: false },
  { id: 5, name: 'Inventory', icon: 'fa-boxes-stacked', color: '#EF4444', subcategories: ['Consumables', 'Spare Parts', 'Safety Equipment', 'Office Supplies'], customFields: ['Reorder Level', 'Min Stock', 'Bin Location', 'Unit of Measure'], depMethod: 'none', depLife: 0, requireApproval: false, autoTag: true },
];

export default function GroupSettings() {
  const [selected, setSelected] = useState(GROUPS[0]);
  const [editModal, setEditModal] = useState(false);
  const [newField, setNewField] = useState('');
  const [newSubcat, setNewSubcat] = useState('');
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <>
      <div className="page-header">
        <div><h1>Group Settings</h1><p>Configure asset groups, custom fields, and workflows</p></div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={save}>
            {saved ? <><i className="fa-solid fa-check"></i> Saved!</> : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Group List */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div className="card" style={{ padding: 8 }}>
            {GROUPS.map(g => (
              <div key={g.id} onClick={() => setSelected(g)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                background: selected.id === g.id ? 'rgba(79,107,237,0.08)' : 'transparent',
                border: selected.id === g.id ? '1px solid var(--gn-accent)' : '1px solid transparent',
                marginBottom: 2, transition: 'all 0.15s'
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${g.color}15`, color: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                  <i className={`fa-solid ${g.icon}`}></i>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gn-text-muted)' }}>{g.subcategories.length} subcategories</div>
                </div>
              </div>
            ))}
            <button className="btn btn-sm btn-ghost" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>
              <i className="fa-solid fa-plus"></i> Add Group
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${selected.color}15`, color: selected.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                <i className={`fa-solid ${selected.icon}`}></i>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</h2>
                <div style={{ fontSize: 13, color: 'var(--gn-text-muted)' }}>{selected.subcategories.length} subcategories &bull; {selected.customFields.length} custom fields</div>
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setEditModal(true)}><i className="fa-solid fa-pen"></i> Edit</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Subcategories */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Subcategories</h3>
              {selected.subcategories.map((sc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gn-border-light)' }}>
                  <span style={{ fontSize: 13 }}>{sc}</span>
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--gn-danger)', padding: 4 }}><i className="fa-solid fa-xmark"></i></button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input className="form-control" placeholder="New subcategory..." value={newSubcat} onChange={e => setNewSubcat(e.target.value)} style={{ flex: 1, marginBottom: 0 }} />
                <button className="btn btn-sm btn-primary" onClick={() => setNewSubcat('')}><i className="fa-solid fa-plus"></i></button>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Custom Fields</h3>
              {selected.customFields.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gn-border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fa-solid fa-grip-vertical" style={{ color: 'var(--gn-text-muted)', fontSize: 11 }}></i>
                    <span style={{ fontSize: 13 }}>{f}</span>
                  </div>
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--gn-danger)', padding: 4 }}><i className="fa-solid fa-xmark"></i></button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input className="form-control" placeholder="New field name..." value={newField} onChange={e => setNewField(e.target.value)} style={{ flex: 1, marginBottom: 0 }} />
                <button className="btn btn-sm btn-primary" onClick={() => setNewField('')}><i className="fa-solid fa-plus"></i></button>
              </div>
            </div>

            {/* Depreciation */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Depreciation Defaults</h3>
              <div className="form-group"><label>Method</label>
                <select className="form-control" defaultValue={selected.depMethod}>
                  <option value="straight-line">Straight-Line</option><option value="declining-balance">Declining Balance</option><option value="sum-of-years">Sum of Years' Digits</option><option value="none">None (Non-depreciable)</option>
                </select>
              </div>
              {selected.depLife > 0 && (
                <div className="form-group"><label>Default Useful Life (years)</label><input className="form-control" type="number" defaultValue={selected.depLife} /></div>
              )}
            </div>

            {/* Workflow Rules */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Workflow Rules</h3>
              {[
                ['Require approval for checkout', selected.requireApproval],
                ['Auto-generate asset tags', selected.autoTag],
                ['Require photos on check-in', true],
                ['Enable maintenance scheduling', true],
                ['Track depreciation', selected.depMethod !== 'none'],
              ].map(([label, val], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--gn-border-light)' : 'none' }}>
                  <span style={{ fontSize: 13 }}>{label}</span>
                  <div onClick={() => {}} style={{
                    width: 40, height: 22, borderRadius: 11, cursor: 'pointer', padding: 2, transition: 'background 0.2s',
                    background: val ? 'var(--gn-accent)' : 'var(--gn-border)',
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'transform 0.2s', transform: val ? 'translateX(18px)' : 'translateX(0)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
