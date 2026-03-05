import { useState } from 'react';

const SCHEDULES = [
  { id: 1, asset: 'Carrier HVAC Unit A', tag: 'GN-00340', type: 'preventive', task: 'Filter Replacement & Coil Cleaning', freq: 'Monthly', lastDone: 'Feb 1, 2026', nextDue: 'Mar 1, 2026', assignee: 'BuildTech Services', cost: 450, status: 'scheduled' },
  { id: 2, asset: 'Caterpillar C15 Generator #1', tag: 'GN-00410', type: 'preventive', task: 'Annual Service & Load Test', freq: 'Annually', lastDone: 'Mar 15, 2025', nextDue: 'Mar 15, 2026', assignee: 'PowerGen Inc', cost: 3200, status: 'scheduled' },
  { id: 3, asset: 'Toyota Hilux 2025', tag: 'GN-00480', type: 'preventive', task: 'Oil Change & Tire Rotation', freq: 'Every 5000 mi', lastDone: 'Jan 20, 2026', nextDue: 'Mar 20, 2026', assignee: 'Fleet Garage', cost: 180, status: 'scheduled' },
  { id: 4, asset: 'Cisco SG350 Switch', tag: 'GN-00120', type: 'preventive', task: 'Firmware Update & Config Backup', freq: 'Quarterly', lastDone: 'Jan 5, 2026', nextDue: 'Apr 5, 2026', assignee: 'IT Team', cost: 0, status: 'scheduled' },
  { id: 5, asset: 'Epson Projector X41', tag: 'GN-00399', type: 'corrective', task: 'Lamp Replacement', freq: 'As needed', lastDone: null, nextDue: 'Feb 28, 2026', assignee: 'AV Support', cost: 280, status: 'overdue' },
  { id: 6, asset: 'Elevator Shaft B', tag: 'GN-00355', type: 'inspection', task: 'Annual Safety Inspection', freq: 'Annually', lastDone: 'Feb 20, 2025', nextDue: 'Feb 20, 2026', assignee: 'SafeGuard Inc', cost: 1500, status: 'overdue' },
  { id: 7, asset: 'Fire Alarm System', tag: 'GN-00360', type: 'inspection', task: 'Fire Alarm Testing', freq: 'Semi-annually', lastDone: 'Aug 15, 2025', nextDue: 'Feb 15, 2026', assignee: 'SafeGuard Fire', cost: 800, status: 'overdue' },
  { id: 8, asset: 'UPS Battery Bank', tag: 'GN-00365', type: 'preventive', task: 'Battery Health Test', freq: 'Quarterly', lastDone: 'Feb 10, 2026', nextDue: 'May 10, 2026', assignee: 'IT Team', cost: 0, status: 'completed' },
];

const LOG = [
  { id: 1, date: 'Feb 20, 2026', asset: 'UPS Battery Bank', tag: 'GN-00365', task: 'Battery Health Test', tech: 'IT Team', duration: '2h', cost: 0, result: 'pass', notes: 'All cells within tolerance. Next test May 10.' },
  { id: 2, date: 'Feb 15, 2026', asset: 'Carrier HVAC Unit B', tag: 'GN-00345', task: 'Emergency Compressor Repair', tech: 'BuildTech Services', duration: '6h', cost: 2800, result: 'repaired', notes: 'Compressor replaced. 1-year warranty on part.' },
  { id: 3, date: 'Feb 10, 2026', asset: 'Dell OptiPlex 7090', tag: 'GN-00470', task: 'SSD Replacement', tech: 'IT Team', duration: '45min', cost: 120, result: 'repaired', notes: 'Replaced 256GB with 1TB NVMe. Data migrated.' },
  { id: 4, date: 'Feb 5, 2026', asset: 'Toyota Forklift 8FGU25', tag: 'GN-00440', task: 'Hydraulic Fluid Change', tech: 'Fleet Garage', duration: '3h', cost: 350, result: 'pass', notes: 'All hydraulics functioning normally.' },
  { id: 5, date: 'Feb 1, 2026', asset: 'Carrier HVAC Unit A', tag: 'GN-00340', task: 'Filter Replacement', tech: 'BuildTech Services', duration: '1h', cost: 450, result: 'pass', notes: 'Filters replaced. Coils cleaned.' },
  { id: 6, date: 'Jan 25, 2026', asset: 'Canon EOS R5', tag: 'GN-00372', task: 'Sensor Cleaning', tech: 'AV Support', duration: '30min', cost: 75, result: 'pass', notes: 'Sensor and lens mount cleaned.' },
];

const money = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 });

export default function Maintenance() {
  const [tab, setTab] = useState('schedules');
  const [filter, setFilter] = useState('all');
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ asset: '', task: '', type: 'preventive', freq: 'Monthly', assignee: '', cost: '', nextDue: '' });

  const filteredSchedules = filter === 'all' ? SCHEDULES
    : filter === 'overdue' ? SCHEDULES.filter(s => s.status === 'overdue')
    : SCHEDULES.filter(s => s.type === filter);

  const overdueCount = SCHEDULES.filter(s => s.status === 'overdue').length;
  const scheduledCount = SCHEDULES.filter(s => s.status === 'scheduled').length;
  const monthCost = LOG.reduce((s, l) => s + (l.cost || 0), 0);
  const avgDuration = LOG.length > 0 ? (LOG.reduce((s, l) => {
    const h = parseFloat(l.duration) * (l.duration.includes('min') ? 1/60 : 1);
    return s + h;
  }, 0) / LOG.length).toFixed(1) : 0;

  return (
    <>
      <div className="page-header">
        <div><h1>Maintenance</h1><p>Schedules, logs, and preventive maintenance tracking</p></div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setCreateModal(true)}><i className="fa-solid fa-plus"></i> New Schedule</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { l: 'Scheduled', v: scheduledCount, icon: 'fa-calendar-check', color: 'blue' },
          { l: 'Overdue', v: overdueCount, icon: 'fa-clock', color: 'red' },
          { l: 'MTD Cost', v: money(monthCost), icon: 'fa-dollar-sign', color: 'green' },
          { l: 'Avg Duration', v: `${avgDuration}h`, icon: 'fa-stopwatch', color: 'purple' },
          { l: 'Completed (MTD)', v: LOG.length, icon: 'fa-circle-check', color: 'teal' },
          { l: 'Pass Rate', v: `${Math.round((LOG.filter(l => l.result === 'pass').length / LOG.length) * 100)}%`, icon: 'fa-chart-simple', color: 'orange' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
            <div><div className="stat-label">{s.l}</div><div className="stat-value">{s.v}</div></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid var(--gn-border-light)' }}>
        {[['schedules', 'Maintenance Schedules'], ['log', 'Maintenance Log'], ['calendar', 'Calendar View']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit',
            background: 'none', borderBottom: `2px solid ${tab === k ? 'var(--gn-accent)' : 'transparent'}`,
            color: tab === k ? 'var(--gn-accent)' : 'var(--gn-text-muted)', marginBottom: -2
          }}>{l}</button>
        ))}
      </div>

      {/* Schedules Tab */}
      {tab === 'schedules' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[['all', 'All'], ['overdue', `Overdue (${overdueCount})`], ['preventive', 'Preventive'], ['corrective', 'Corrective'], ['inspection', 'Inspection']].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${filter === k ? (k === 'overdue' ? '#EF4444' : 'var(--gn-accent)') : 'var(--gn-border)'}`,
                background: filter === k ? (k === 'overdue' ? '#EF444410' : 'rgba(79,107,237,0.08)') : 'var(--gn-surface)',
                color: filter === k ? (k === 'overdue' ? '#EF4444' : 'var(--gn-accent)') : 'var(--gn-text-secondary)'
              }}>{l}</button>
            ))}
          </div>
          <div className="card">
            <div className="table-wrap"><table><thead><tr><th>Asset</th><th>Task</th><th>Type</th><th>Frequency</th><th>Last Done</th><th>Next Due</th><th>Assignee</th><th>Cost</th><th>Status</th></tr></thead><tbody>
              {filteredSchedules.map(s => (
                <tr key={s.id}>
                  <td><div><div style={{ fontWeight: 500, fontSize: 13 }}>{s.asset}</div><div className="font-mono text-sm" style={{ color: 'var(--gn-text-muted)' }}>{s.tag}</div></div></td>
                  <td style={{ fontSize: 13 }}>{s.task}</td>
                  <td><span className={`badge ${s.type === 'preventive' ? 'blue' : s.type === 'corrective' ? 'orange' : 'purple'}`}>{s.type}</span></td>
                  <td className="text-sm">{s.freq}</td>
                  <td className="text-sm text-muted">{s.lastDone || '—'}</td>
                  <td className="text-sm" style={{ fontWeight: s.status === 'overdue' ? 600 : 400, color: s.status === 'overdue' ? '#EF4444' : undefined }}>{s.nextDue}</td>
                  <td className="text-sm">{s.assignee}</td>
                  <td className="text-sm">{money(s.cost)}</td>
                  <td><span className={`badge ${s.status === 'scheduled' ? 'blue' : s.status === 'overdue' ? 'red' : 'green'}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody></table></div>
          </div>
        </>
      )}

      {/* Log Tab */}
      {tab === 'log' && (
        <div className="card">
          <div className="table-wrap"><table><thead><tr><th>Date</th><th>Asset</th><th>Task</th><th>Technician</th><th>Duration</th><th>Cost</th><th>Result</th><th>Notes</th></tr></thead><tbody>
            {LOG.map(l => (
              <tr key={l.id}>
                <td className="text-sm">{l.date}</td>
                <td><div><div style={{ fontWeight: 500, fontSize: 13 }}>{l.asset}</div><div className="font-mono text-sm" style={{ color: 'var(--gn-text-muted)' }}>{l.tag}</div></div></td>
                <td style={{ fontSize: 13 }}>{l.task}</td>
                <td className="text-sm">{l.tech}</td>
                <td className="text-sm">{l.duration}</td>
                <td className="text-sm">{money(l.cost)}</td>
                <td><span className={`badge ${l.result === 'pass' ? 'green' : 'orange'}`}>{l.result}</span></td>
                <td className="text-sm text-muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.notes}</td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {/* Calendar Tab */}
      {tab === 'calendar' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--gn-text-muted)', padding: 8, textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 5; // Feb 2026 starts on Sun=0 → offset
              const d = day + 1;
              const isValid = d >= 1 && d <= 28;
              const isToday = d === 26;
              const events = isValid ? SCHEDULES.filter(s => {
                const due = new Date(s.nextDue);
                return due.getMonth() === 1 && due.getDate() === d;
              }) : [];
              return (
                <div key={i} style={{
                  minHeight: 70, padding: 6, borderRadius: 6,
                  border: isToday ? '2px solid var(--gn-accent)' : '1px solid var(--gn-border-light)',
                  background: isValid ? 'var(--gn-surface)' : 'var(--gn-surface-alt)', opacity: isValid ? 1 : 0.3
                }}>
                  {isValid && <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--gn-accent)' : 'var(--gn-text-muted)', marginBottom: 4 }}>{d}</div>}
                  {events.map(e => (
                    <div key={e.id} style={{
                      fontSize: 9, padding: '2px 4px', borderRadius: 3, marginBottom: 2, fontWeight: 500,
                      background: e.status === 'overdue' ? '#EF444420' : '#4F6BED15',
                      color: e.status === 'overdue' ? '#EF4444' : '#4F6BED',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>{e.task?.slice(0, 18)}</div>
                  ))}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 12, color: 'var(--gn-text-muted)' }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: '#4F6BED15', border: '1px solid #4F6BED', marginRight: 4 }}></span>Scheduled</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: '#EF444420', border: '1px solid #EF4444', marginRight: 4 }}></span>Overdue</span>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {createModal && (
        <div className="modal-overlay" onClick={() => setCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header"><h2>New Maintenance Schedule</h2><button className="modal-close" onClick={() => setCreateModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Asset</label><input className="form-control" placeholder="Search asset..." value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })} /></div>
              <div className="form-group"><label>Maintenance Task</label><input className="form-control" placeholder="e.g. Oil Change & Filter Replacement" value={form.task} onChange={e => setForm({ ...form, task: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group"><label>Type</label>
                  <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="preventive">Preventive</option><option value="corrective">Corrective</option><option value="inspection">Inspection</option><option value="calibration">Calibration</option>
                  </select>
                </div>
                <div className="form-group"><label>Frequency</label>
                  <select className="form-control" value={form.freq} onChange={e => setForm({ ...form, freq: e.target.value })}>
                    <option>Weekly</option><option>Monthly</option><option>Quarterly</option><option>Semi-annually</option><option>Annually</option><option>As needed</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group"><label>Assigned To</label><input className="form-control" placeholder="Technician or vendor" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} /></div>
                <div className="form-group"><label>Estimated Cost</label><input className="form-control" type="number" placeholder="0" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Next Due Date</label><input type="date" className="form-control" value={form.nextDue} onChange={e => setForm({ ...form, nextDue: e.target.value })} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setCreateModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setCreateModal(false); alert('Maintenance schedule created!'); }}>Create Schedule</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
