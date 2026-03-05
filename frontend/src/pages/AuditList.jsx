import { useState, useEffect } from 'react';
import { audits } from '../services/api';

const stb = (s) => { const m = { scheduled: 'purple', in_progress: 'orange', completed: 'green', cancelled: 'gray' }; return <span className={`badge ${m[s] || 'gray'}`}>{(s || '').replace(/_/g, ' ')}</span>; };

export default function AuditList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'full', status: 'scheduled', start_date: '', end_date: '', assets_counted: '', accuracy: '', findings: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    setError(null);
    audits.list()
      .then(r => {
        const d = r.data;
        setData(Array.isArray(d) ? d : d.data || d.audits || []);
      })
      .catch(err => {
        console.error('Audits load error:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load audits');
        setData([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setSelected(null);
    setForm({ name: '', type: 'full', status: 'scheduled', start_date: '', end_date: '', assets_counted: '', accuracy: '', findings: '', notes: '' });
    setModal('create');
  };

  const openEdit = (a) => {
    setSelected(a);
    setForm({
      name: a.name || '', type: a.type || 'full', status: a.status || 'scheduled',
      start_date: a.start_date || '', end_date: a.end_date || '',
      assets_counted: a.assets_counted || '', accuracy: a.accuracy || '',
      findings: a.findings || '', notes: a.notes || ''
    });
    setModal('edit');
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Audit name is required');
    setSaving(true);
    try {
      if (modal === 'edit' && selected) {
        await audits.update(selected.id, form);
      } else {
        await audits.create(form);
      }
      setModal(null);
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to save audit');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await audits.delete(selected.id);
      setModal(null);
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to delete');
    }
  };

  const quickStatus = async (a, status) => {
    try {
      await audits.update(a.id, { status });
      load();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const filtered = filter === 'all' ? data : data.filter(a => a.status === filter);
  const completedCount = data.filter(a => a.status === 'completed').length;
  const inProgressCount = data.filter(a => a.status === 'in_progress').length;
  const scheduledCount = data.filter(a => a.status === 'scheduled').length;
  const avgAccuracy = data.filter(a => a.accuracy).length > 0
    ? (data.filter(a => a.accuracy).reduce((s, a) => s + parseFloat(a.accuracy || 0), 0) / data.filter(a => a.accuracy).length).toFixed(1)
    : '—';

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <>
      <div className="page-header">
        <div><h1>Audits</h1><p>{data.length} audits total</p></div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openCreate}><i className="fa-solid fa-plus"></i> New Audit</button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span><i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 8 }}></i>{error}</span>
          <button className="btn btn-sm btn-secondary" onClick={load}>Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { l: 'Completed', v: completedCount, icon: 'fa-circle-check', color: 'green' },
          { l: 'In Progress', v: inProgressCount, icon: 'fa-spinner', color: 'orange' },
          { l: 'Scheduled', v: scheduledCount, icon: 'fa-calendar', color: 'purple' },
          { l: 'Avg Accuracy', v: avgAccuracy === '—' ? '—' : avgAccuracy + '%', icon: 'fa-bullseye', color: 'blue' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
            <div><div className="stat-label">{s.l}</div><div className="stat-value">{s.v}</div></div>
          </div>
        ))}
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['all', 'All'], ['scheduled', 'Scheduled'], ['in_progress', 'In Progress'], ['completed', 'Completed'], ['cancelled', 'Cancelled']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            border: `1px solid ${filter === k ? 'var(--gn-accent)' : 'var(--gn-border)'}`,
            background: filter === k ? 'rgba(79,107,237,0.08)' : 'var(--gn-surface)',
            color: filter === k ? 'var(--gn-accent)' : 'var(--gn-text-secondary)'
          }}>{l}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table><thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Start</th><th>End</th><th>Counted</th><th>Accuracy</th><th>Assignee</th><th style={{ width: 150 }}>Actions</th></tr></thead><tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--gn-text-muted)' }}>
                <i className="fa-solid fa-clipboard-check" style={{ fontSize: 28, marginBottom: 8, display: 'block', opacity: 0.3 }}></i>
                {data.length === 0 ? 'No audits yet. Click "New Audit" to create one.' : 'No audits match this filter.'}
              </td></tr>
            ) : filtered.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 500 }}>{a.name}</td>
                <td><span className="badge gray">{(a.type || '').replace(/_/g, ' ')}</span></td>
                <td>{stb(a.status)}</td>
                <td className="text-sm">{a.start_date || '—'}</td>
                <td className="text-sm">{a.end_date || '—'}</td>
                <td>{a.assets_counted || 0}</td>
                <td>{a.accuracy ? a.accuracy + '%' : '—'}</td>
                <td className="text-sm">{a.assignee?.name || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {a.status === 'scheduled' && <button className="btn btn-sm btn-primary" onClick={() => quickStatus(a, 'in_progress')} title="Start">▶</button>}
                    {a.status === 'in_progress' && <button className="btn btn-sm btn-primary" onClick={() => quickStatus(a, 'completed')} title="Complete">✓</button>}
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(a)} title="Edit"><i className="fa-solid fa-pen"></i></button>
                    <button className="btn btn-sm btn-danger" onClick={() => { setSelected(a); setModal('delete'); }} title="Delete"><i className="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h2>{modal === 'create' ? 'New Audit' : 'Edit Audit'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Audit Name *</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Q1 2026 Full Inventory" />
              </div>
              <div className="form-row">
                <div className="form-group"><label>Type</label>
                  <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="full">Full Inventory</option><option value="spot_check">Spot Check</option><option value="cycle_count">Cycle Count</option><option value="compliance">Compliance</option>
                  </select>
                </div>
                {modal === 'edit' && (
                  <div className="form-group"><label>Status</label>
                    <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="scheduled">Scheduled</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group"><label>Start Date</label><input type="date" className="form-control" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></div>
                <div className="form-group"><label>End Date</label><input type="date" className="form-control" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} /></div>
              </div>
              {modal === 'edit' && (
                <>
                  <div className="form-row">
                    <div className="form-group"><label>Assets Counted</label><input type="number" className="form-control" value={form.assets_counted} onChange={e => setForm({ ...form, assets_counted: e.target.value })} /></div>
                    <div className="form-group"><label>Accuracy (%)</label><input type="number" className="form-control" value={form.accuracy} onChange={e => setForm({ ...form, accuracy: e.target.value })} /></div>
                  </div>
                  <div className="form-group"><label>Findings</label><textarea className="form-control" value={form.findings} onChange={e => setForm({ ...form, findings: e.target.value })} rows={3} placeholder="Audit findings and discrepancies..." /></div>
                </>
              )}
              <div className="form-group"><label>Notes</label><textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Additional notes..." /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : modal === 'create' ? 'Create Audit' : 'Update Audit'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal === 'delete' && selected && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header"><h2>Delete Audit</h2><button className="modal-close" onClick={() => setModal(null)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                <i className="fa-solid fa-trash"></i>
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Delete "{selected.name}"?</p>
              <p style={{ fontSize: 13, color: 'var(--gn-text-muted)' }}>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}><i className="fa-solid fa-trash"></i> Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
