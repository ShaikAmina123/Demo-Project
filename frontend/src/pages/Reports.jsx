import { useState } from 'react';

const REPORT_TYPES = [
  { id: 'asset-summary', name: 'Asset Summary Report', icon: 'fa-boxes-stacked', color: '#4F6BED', desc: 'Complete overview of all assets by group, status, and location', fields: ['dateRange', 'group', 'status'] },
  { id: 'depreciation', name: 'Depreciation Report', icon: 'fa-chart-line', color: '#8B5CF6', desc: 'Asset depreciation schedules, book values, and accumulated depreciation', fields: ['dateRange', 'method'] },
  { id: 'maintenance', name: 'Maintenance Report', icon: 'fa-wrench', color: '#F59E0B', desc: 'Work order history, costs, downtime, and preventive schedule', fields: ['dateRange', 'type', 'priority'] },
  { id: 'checkout', name: 'Check-In/Out Report', icon: 'fa-arrow-right-arrow-left', color: '#3B82F6', desc: 'Asset checkout history, overdue items, and utilization rates', fields: ['dateRange', 'status'] },
  { id: 'license', name: 'License Compliance', icon: 'fa-file-contract', color: '#10B981', desc: 'License utilization, expiry tracking, and compliance status', fields: ['dateRange'] },
  { id: 'audit', name: 'Audit Trail Report', icon: 'fa-clipboard-check', color: '#EC4899', desc: 'Complete audit history with accuracy metrics and discrepancies', fields: ['dateRange'] },
  { id: 'cost', name: 'Cost Analysis', icon: 'fa-dollar-sign', color: '#EF4444', desc: 'Total cost of ownership, maintenance spend, and budget analysis', fields: ['dateRange', 'group'] },
  { id: 'custom', name: 'Custom Report', icon: 'fa-sliders', color: '#64748B', desc: 'Build a custom report with selected fields and filters', fields: ['dateRange', 'group', 'status', 'type'] },
];

const RECENT_REPORTS = [
  { id: 1, name: 'Asset Summary — Q4 2025', type: 'Asset Summary Report', date: 'Feb 20, 2026', size: '2.4 MB', format: 'PDF', status: 'ready' },
  { id: 2, name: 'Depreciation Schedule FY2025', type: 'Depreciation Report', date: 'Feb 18, 2026', size: '1.8 MB', format: 'Excel', status: 'ready' },
  { id: 3, name: 'Maintenance Costs Jan 2026', type: 'Maintenance Report', date: 'Feb 15, 2026', size: '890 KB', format: 'PDF', status: 'ready' },
  { id: 4, name: 'License Compliance Check', type: 'License Compliance', date: 'Feb 12, 2026', size: '1.1 MB', format: 'PDF', status: 'ready' },
  { id: 5, name: 'Full Audit Trail — Feb 2026', type: 'Audit Trail Report', date: 'Feb 10, 2026', size: '3.2 MB', format: 'Excel', status: 'ready' },
];

const SCHEDULED = [
  { id: 1, name: 'Monthly Asset Summary', freq: 'Monthly', next: 'Mar 1, 2026', format: 'PDF', recipients: 'admin@neochain.com' },
  { id: 2, name: 'Weekly Maintenance Digest', freq: 'Weekly', next: 'Mar 3, 2026', format: 'PDF', recipients: 'ops@neochain.com' },
  { id: 3, name: 'Quarterly Depreciation', freq: 'Quarterly', next: 'Apr 1, 2026', format: 'Excel', recipients: 'finance@neochain.com' },
];

export default function Reports() {
  const [tab, setTab] = useState('generate');
  const [selectedType, setSelectedType] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ dateFrom: '2026-01-01', dateTo: '2026-02-26', group: 'all', status: 'all', format: 'pdf', email: '' });
  const [scheduleModal, setScheduleModal] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setSelectedType(null); alert('Report generated successfully! It would appear in your Recent Reports.'); }, 1500);
  };

  return (
    <>
      <div className="page-header">
        <div><h1>Reports</h1><p>Generate, schedule, and download reports</p></div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => setScheduleModal(true)}><i className="fa-solid fa-clock"></i> Schedule Report</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid var(--gn-border-light)', paddingBottom: 0 }}>
        {[['generate', 'Generate'], ['recent', 'Recent Reports'], ['scheduled', 'Scheduled']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit',
            background: 'none', borderBottom: `2px solid ${tab === k ? 'var(--gn-accent)' : 'transparent'}`,
            color: tab === k ? 'var(--gn-accent)' : 'var(--gn-text-muted)', marginBottom: -2, transition: 'all 0.15s'
          }}>{l}</button>
        ))}
      </div>

      {/* Generate Tab */}
      {tab === 'generate' && !selectedType && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {REPORT_TYPES.map(r => (
            <div key={r.id} className="card" onClick={() => setSelectedType(r)} style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', overflow: 'hidden', position: 'relative' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: r.color }}></div>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${r.color}15`, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    <i className={`fa-solid ${r.icon}`}></i>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{r.name}</h3>
                </div>
                <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', lineHeight: 1.5, margin: 0 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Form */}
      {tab === 'generate' && selectedType && (
        <div className="card" style={{ maxWidth: 600 }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${selectedType.color}15`, color: selectedType.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fa-solid ${selectedType.icon}`}></i>
              </div>
              <h3>{selectedType.name}</h3>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={() => setSelectedType(null)}>← Back</button>
          </div>
          <div className="card-body" style={{ padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group"><label>Date From</label><input type="date" className="form-control" value={form.dateFrom} onChange={e => setForm({ ...form, dateFrom: e.target.value })} /></div>
              <div className="form-group"><label>Date To</label><input type="date" className="form-control" value={form.dateTo} onChange={e => setForm({ ...form, dateTo: e.target.value })} /></div>
            </div>
            {selectedType.fields.includes('group') && (
              <div className="form-group"><label>Asset Group</label>
                <select className="form-control" value={form.group} onChange={e => setForm({ ...form, group: e.target.value })}>
                  <option value="all">All Groups</option><option value="it">IT Equipment</option><option value="fac">Facilities</option><option value="fleet">Fleet</option><option value="inv">Inventory</option>
                </select>
              </div>
            )}
            {selectedType.fields.includes('status') && (
              <div className="form-group"><label>Status Filter</label>
                <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="all">All Statuses</option><option value="active">Active</option><option value="maintenance">Maintenance</option><option value="retired">Retired</option>
                </select>
              </div>
            )}
            <div className="form-group"><label>Output Format</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['pdf', 'excel', 'csv'].map(f => (
                  <button key={f} onClick={() => setForm({ ...form, format: f })} style={{
                    padding: '8px 18px', borderRadius: 6, border: `1px solid ${form.format === f ? 'var(--gn-accent)' : 'var(--gn-border)'}`,
                    background: form.format === f ? 'rgba(79,107,237,0.08)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                    color: form.format === f ? 'var(--gn-accent)' : 'var(--gn-text-secondary)', fontWeight: 500, fontSize: 13, textTransform: 'uppercase'
                  }}>{f}</button>
                ))}
              </div>
            </div>
            <div className="form-group"><label>Email To (optional)</label><input className="form-control" placeholder="email@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                {generating ? <><i className="fa-solid fa-spinner fa-spin"></i> Generating...</> : <><i className="fa-solid fa-file-arrow-down"></i> Generate Report</>}
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedType(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Reports */}
      {tab === 'recent' && (
        <div className="card">
          <div className="table-wrap"><table><thead><tr><th>Report Name</th><th>Type</th><th>Generated</th><th>Size</th><th>Format</th><th>Actions</th></tr></thead><tbody>
            {RECENT_REPORTS.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td className="text-sm text-muted">{r.type}</td>
                <td className="text-sm text-muted">{r.date}</td>
                <td className="text-sm">{r.size}</td>
                <td><span className={`badge ${r.format === 'PDF' ? 'red' : 'green'}`}>{r.format}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-primary"><i className="fa-solid fa-download"></i> Download</button>
                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--gn-danger)' }}><i className="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {/* Scheduled */}
      {tab === 'scheduled' && (
        <div className="card">
          <div className="table-wrap"><table><thead><tr><th>Report</th><th>Frequency</th><th>Next Run</th><th>Format</th><th>Recipients</th><th>Actions</th></tr></thead><tbody>
            {SCHEDULED.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td><span className="badge blue">{s.freq}</span></td>
                <td className="text-sm">{s.next}</td>
                <td className="text-sm">{s.format}</td>
                <td className="text-sm text-muted">{s.recipients}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-secondary"><i className="fa-solid fa-pen"></i></button>
                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--gn-danger)' }}><i className="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModal && (
        <div className="modal-overlay" onClick={() => setScheduleModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header"><h2>Schedule Report</h2><button className="modal-close" onClick={() => setScheduleModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Report Type</label>
                <select className="form-control">{REPORT_TYPES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
              </div>
              <div className="form-group"><label>Frequency</label>
                <select className="form-control"><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option></select>
              </div>
              <div className="form-group"><label>Format</label>
                <select className="form-control"><option>PDF</option><option>Excel</option><option>CSV</option></select>
              </div>
              <div className="form-group"><label>Email Recipients</label><input className="form-control" placeholder="email@company.com, email2@company.com" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setScheduleModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setScheduleModal(false); alert('Schedule created!'); }}>Create Schedule</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
