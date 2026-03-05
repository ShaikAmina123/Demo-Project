import { useState } from 'react';

const SCHEDULES = [
  { id: 1, name: 'Monthly Asset Summary', type: 'asset-summary', freq: 'Monthly', day: '1st', time: '08:00', format: 'PDF', recipients: 'admin@neochain.com, cfo@neochain.com', filters: { group: 'All', status: 'All' }, lastRun: 'Feb 1, 2026', nextRun: 'Mar 1, 2026', enabled: true },
  { id: 2, name: 'Weekly Maintenance Digest', type: 'maintenance', freq: 'Weekly', day: 'Monday', time: '09:00', format: 'PDF', recipients: 'ops@neochain.com', filters: { priority: 'All', type: 'All' }, lastRun: 'Feb 24, 2026', nextRun: 'Mar 3, 2026', enabled: true },
  { id: 3, name: 'Quarterly Depreciation', type: 'depreciation', freq: 'Quarterly', day: '1st', time: '08:00', format: 'Excel', recipients: 'finance@neochain.com, cfo@neochain.com', filters: { method: 'All' }, lastRun: 'Jan 1, 2026', nextRun: 'Apr 1, 2026', enabled: true },
  { id: 4, name: 'Daily Overdue Checkout Alert', type: 'checkout', freq: 'Daily', day: null, time: '07:00', format: 'PDF', recipients: 'admin@neochain.com', filters: { status: 'Overdue' }, lastRun: 'Feb 25, 2026', nextRun: 'Feb 27, 2026', enabled: true },
  { id: 5, name: 'Monthly License Compliance', type: 'license', freq: 'Monthly', day: '15th', time: '10:00', format: 'PDF', recipients: 'it@neochain.com, legal@neochain.com', filters: {}, lastRun: 'Feb 15, 2026', nextRun: 'Mar 15, 2026', enabled: true },
  { id: 6, name: 'Weekly Cost Analysis', type: 'cost', freq: 'Weekly', day: 'Friday', time: '16:00', format: 'Excel', recipients: 'finance@neochain.com', filters: { group: 'All' }, lastRun: 'Feb 21, 2026', nextRun: 'Feb 28, 2026', enabled: false },
];

const REPORT_TYPES = [
  { id: 'asset-summary', name: 'Asset Summary', icon: 'fa-boxes-stacked', color: '#4F6BED' },
  { id: 'maintenance', name: 'Maintenance', icon: 'fa-wrench', color: '#F59E0B' },
  { id: 'depreciation', name: 'Depreciation', icon: 'fa-chart-line', color: '#8B5CF6' },
  { id: 'checkout', name: 'Check-In/Out', icon: 'fa-arrow-right-arrow-left', color: '#3B82F6' },
  { id: 'license', name: 'License Compliance', icon: 'fa-file-contract', color: '#10B981' },
  { id: 'cost', name: 'Cost Analysis', icon: 'fa-dollar-sign', color: '#EF4444' },
  { id: 'audit', name: 'Audit Trail', icon: 'fa-clipboard-check', color: '#EC4899' },
];

const HISTORY = [
  { id: 1, schedule: 'Monthly Asset Summary', date: 'Feb 1, 2026 08:00', status: 'delivered', recipients: 2, size: '2.4 MB' },
  { id: 2, schedule: 'Weekly Maintenance Digest', date: 'Feb 24, 2026 09:00', status: 'delivered', recipients: 1, size: '890 KB' },
  { id: 3, schedule: 'Daily Overdue Checkout Alert', date: 'Feb 25, 2026 07:00', status: 'delivered', recipients: 1, size: '340 KB' },
  { id: 4, schedule: 'Quarterly Depreciation', date: 'Jan 1, 2026 08:00', status: 'delivered', recipients: 2, size: '1.8 MB' },
  { id: 5, schedule: 'Monthly License Compliance', date: 'Feb 15, 2026 10:00', status: 'failed', recipients: 0, size: '—' },
  { id: 6, schedule: 'Weekly Maintenance Digest', date: 'Feb 17, 2026 09:00', status: 'delivered', recipients: 1, size: '780 KB' },
];

export default function AutomatedReports() {
  const [tab, setTab] = useState('schedules');
  const [schedules, setSchedules] = useState(SCHEDULES);
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'asset-summary', freq: 'Monthly', day: '1st', time: '08:00', format: 'PDF', recipients: '' });

  const toggle = (id) => setSchedules(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));

  return (
    <>
      <div className="page-header">
        <div><h1>Automated Reports</h1><p>{schedules.filter(s => s.enabled).length} active schedules</p></div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setCreateModal(true)}><i className="fa-solid fa-plus"></i> New Schedule</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid var(--gn-border-light)' }}>
        {[['schedules', 'Schedules'], ['history', 'Delivery History']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: 'none', borderBottom: `2px solid ${tab === k ? 'var(--gn-accent)' : 'transparent'}`, color: tab === k ? 'var(--gn-accent)' : 'var(--gn-text-muted)', marginBottom: -2 }}>{l}</button>
        ))}
      </div>

      {tab === 'schedules' && (
        <div className="card">
          {schedules.map((s, i) => {
            const rt = REPORT_TYPES.find(r => r.id === s.type);
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderBottom: i < schedules.length - 1 ? '1px solid var(--gn-border-light)' : 'none', opacity: s.enabled ? 1 : 0.5 }}>
                <div onClick={() => toggle(s.id)} style={{ width: 40, height: 22, borderRadius: 11, cursor: 'pointer', padding: 2, background: s.enabled ? 'var(--gn-accent)' : 'var(--gn-border)', flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', transform: s.enabled ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.2s' }}></div>
                </div>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: `${rt?.color || '#666'}15`, color: rt?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`fa-solid ${rt?.icon || 'fa-file'}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--gn-text-muted)', flexWrap: 'wrap' }}>
                    <span><i className="fa-solid fa-clock" style={{ marginRight: 4 }}></i>{s.freq}{s.day ? `, ${s.day}` : ''} at {s.time}</span>
                    <span><i className="fa-solid fa-file" style={{ marginRight: 4 }}></i>{s.format}</span>
                    <span><i className="fa-solid fa-envelope" style={{ marginRight: 4 }}></i>{s.recipients.split(',').length} recipient(s)</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>Next run</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.nextRun}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-sm btn-secondary" title="Run Now"><i className="fa-solid fa-play"></i></button>
                  <button className="btn btn-sm btn-secondary" title="Edit"><i className="fa-solid fa-pen"></i></button>
                  <button className="btn btn-sm btn-ghost" title="Delete" style={{ color: 'var(--gn-danger)' }}><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'history' && (
        <div className="card">
          <div className="table-wrap"><table><thead><tr><th>Schedule</th><th>Date</th><th>Status</th><th>Recipients</th><th>Size</th><th>Actions</th></tr></thead><tbody>
            {HISTORY.map(h => (
              <tr key={h.id}>
                <td style={{ fontWeight: 500 }}>{h.schedule}</td>
                <td className="text-sm">{h.date}</td>
                <td><span className={`badge ${h.status === 'delivered' ? 'green' : 'red'}`}>{h.status}</span></td>
                <td className="text-sm">{h.recipients}</td>
                <td className="text-sm">{h.size}</td>
                <td><button className="btn btn-sm btn-secondary" disabled={h.status === 'failed'}><i className="fa-solid fa-download"></i></button></td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {createModal && (
        <div className="modal-overlay" onClick={() => setCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header"><h2>New Report Schedule</h2><button className="modal-close" onClick={() => setCreateModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Schedule Name</label><input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Monthly Fleet Report" /></div>
              <div className="form-group"><label>Report Type</label>
                <select className="form-control" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  {REPORT_TYPES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group"><label>Frequency</label>
                  <select className="form-control" value={form.freq} onChange={e => setForm({...form, freq: e.target.value})}>
                    <option>Daily</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option>
                  </select>
                </div>
                <div className="form-group"><label>Time</label><input type="time" className="form-control" value={form.time} onChange={e => setForm({...form, time: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Format</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['PDF', 'Excel', 'CSV'].map(f => (
                    <button key={f} onClick={() => setForm({...form, format: f})} style={{ padding: '8px 18px', borderRadius: 6, border: `1px solid ${form.format === f ? 'var(--gn-accent)' : 'var(--gn-border)'}`, background: form.format === f ? 'rgba(79,107,237,0.08)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', color: form.format === f ? 'var(--gn-accent)' : 'var(--gn-text-secondary)', fontWeight: 500, fontSize: 13 }}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>Email Recipients</label><input className="form-control" value={form.recipients} onChange={e => setForm({...form, recipients: e.target.value})} placeholder="email1@company.com, email2@company.com" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setCreateModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setCreateModal(false); alert('Schedule created!'); }}>Create Schedule</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
