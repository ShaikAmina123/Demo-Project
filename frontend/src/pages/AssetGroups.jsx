import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetGroups } from '../services/api';

const ICONS = [
  { v: 'fa-laptop', l: 'Laptop' },
  { v: 'fa-building', l: 'Building' },
  { v: 'fa-truck', l: 'Truck' },
  { v: 'fa-file-contract', l: 'Contract' },
  { v: 'fa-boxes-stacked', l: 'Boxes' },
  { v: 'fa-server', l: 'Server' },
  { v: 'fa-print', l: 'Printer' },
  { v: 'fa-desktop', l: 'Desktop' },
  { v: 'fa-network-wired', l: 'Network' },
  { v: 'fa-couch', l: 'Furniture' },
  { v: 'fa-car', l: 'Vehicle' },
  { v: 'fa-tools', l: 'Tools' },
  { v: 'fa-warehouse', l: 'Warehouse' },
  { v: 'fa-shield-halved', l: 'Security' },
  { v: 'fa-bolt', l: 'Electrical' },
  { v: 'fa-fire-extinguisher', l: 'Safety' },
];

const COLORS = ['#4F6BED', '#00B8A9', '#F7931E', '#8B5CF6', '#EF4444', '#EC4899', '#14B8A6', '#F59E0B', '#6366F1', '#10B981'];

const money = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function AssetGroups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit' | 'delete' | 'detail'
  const [selected, setSelected] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [form, setForm] = useState({ name: '', icon: 'fa-laptop', description: '', color: '#4F6BED' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    assetGroups.list()
      .then(r => setGroups(r.data.groups || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ name: '', icon: 'fa-laptop', description: '', color: '#4F6BED' });
    setError('');
    setModal('create');
  };

  const openEdit = (g, e) => {
    e?.stopPropagation();
    setSelected(g);
    setForm({ name: g.name, icon: g.icon || 'fa-laptop', description: g.description || '', color: g.color || '#4F6BED' });
    setError('');
    setModal('edit');
  };

  const openDelete = (g, e) => {
    e?.stopPropagation();
    setSelected(g);
    setModal('delete');
  };

  const openDetail = async (g) => {
    setSelected(g);
    setDetailData(null);
    setModal('detail');
    try {
      const r = await assetGroups.get(g.id);
      setDetailData(r.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Group name is required'); return; }
    setSaving(true);
    setError('');
    try {
      if (modal === 'create') {
        await assetGroups.create(form);
      } else {
        await assetGroups.update(selected.id, form);
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await assetGroups.delete(selected.id);
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    } finally { setSaving(false); }
  };

  const totalAssets = groups.reduce((s, g) => s + (parseInt(g.dataValues?.assetCount || g.assetCount) || 0), 0);

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Asset Groups</h1>
          <p>{groups.length} groups &bull; {totalAssets} total assets</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openCreate}>
            <i className="fa-solid fa-plus"></i> New Group
          </button>
        </div>
      </div>

      {/* Group Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
        {groups.map(g => {
          const count = parseInt(g.dataValues?.assetCount || g.assetCount) || 0;
          const color = g.color || '#4F6BED';
          return (
            <div
              key={g.id}
              className="card"
              onClick={() => openDetail(g)}
              style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Color accent top bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }}></div>

              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  {/* Icon */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${color}15`, color: color, fontSize: 20
                  }}>
                    <i className={`fa-solid ${g.icon || 'fa-folder'}`}></i>
                  </div>
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-sm btn-ghost" onClick={(e) => openEdit(g, e)} title="Edit">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={(e) => openDelete(g, e)} title="Delete" style={{ color: 'var(--gn-danger)' }}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{g.name}</h3>
                {g.description && (
                  <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
                    {g.description.length > 80 ? g.description.slice(0, 80) + '…' : g.description}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--gn-border-light)' }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gn-text)' }}>{count}</div>
                    <div style={{ fontSize: 11, color: 'var(--gn-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assets</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); navigate(`/assets?group=${g.id}`); }}>
                      View Assets <i className="fa-solid fa-arrow-right" style={{ fontSize: 10, marginLeft: 4 }}></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Card */}
        <div
          className="card"
          onClick={openCreate}
          style={{
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 200, border: '2px dashed var(--gn-border)', background: 'transparent',
            transition: 'border-color 0.15s, background 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gn-accent)'; e.currentTarget.style.background = 'rgba(79,107,237,0.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gn-border)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={{ textAlign: 'center', color: 'var(--gn-text-muted)' }}>
            <i className="fa-solid fa-plus" style={{ fontSize: 24, marginBottom: 8, display: 'block' }}></i>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Add New Group</span>
          </div>
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h2>{modal === 'create' ? 'Create Asset Group' : 'Edit Asset Group'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>}

              <div className="form-group">
                <label>Group Name *</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. IT Equipment" />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Optional description..." />
              </div>

              <div className="form-group">
                <label>Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ICONS.map(ic => (
                    <button
                      key={ic.v}
                      type="button"
                      onClick={() => setForm({ ...form, icon: ic.v })}
                      title={ic.l}
                      style={{
                        width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: form.icon === ic.v ? '2px solid var(--gn-accent)' : '1px solid var(--gn-border)',
                        background: form.icon === ic.v ? 'rgba(79,107,237,0.08)' : 'var(--gn-surface)',
                        color: form.icon === ic.v ? 'var(--gn-accent)' : 'var(--gn-text-muted)',
                        cursor: 'pointer', fontSize: 16, transition: 'all 0.15s'
                      }}
                    >
                      <i className={`fa-solid ${ic.v}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      style={{
                        width: 32, height: 32, borderRadius: '50%', border: form.color === c ? '3px solid var(--gn-text)' : '2px solid transparent',
                        background: c, cursor: 'pointer', transition: 'transform 0.15s',
                        outline: form.color === c ? '2px solid var(--gn-surface)' : 'none'
                      }}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div style={{ marginTop: 16, padding: 16, background: 'var(--gn-surface-alt)', borderRadius: 10, border: '1px solid var(--gn-border-light)' }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--gn-text-muted)', letterSpacing: '0.5px', marginBottom: 8 }}>Preview</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${form.color}15`, color: form.color, fontSize: 18
                  }}>
                    <i className={`fa-solid ${form.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{form.name || 'Group Name'}</div>
                    {form.description && <div style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>{form.description.slice(0, 50)}</div>}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : modal === 'create' ? 'Create Group' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {modal === 'detail' && selected && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${selected.color || '#4F6BED'}15`, color: selected.color || '#4F6BED', fontSize: 16
                }}>
                  <i className={`fa-solid ${selected.icon || 'fa-folder'}`}></i>
                </div>
                <h2>{selected.name}</h2>
              </div>
              <button className="modal-close" onClick={() => setModal(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              {!detailData ? (
                <div className="loading" style={{ padding: 40 }}><div className="spinner"></div></div>
              ) : (
                <>
                  {selected.description && (
                    <p style={{ color: 'var(--gn-text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>{selected.description}</p>
                  )}

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
                    {[
                      { l: 'Total', v: detailData.stats.total, c: '#4F6BED' },
                      { l: 'Active', v: detailData.stats.active, c: '#10B981' },
                      { l: 'Maintenance', v: detailData.stats.maintenance, c: '#F59E0B' },
                      { l: 'Checked Out', v: detailData.stats.checkedOut, c: '#3B82F6' },
                      { l: 'Retired', v: detailData.stats.retired, c: '#64748B' },
                      { l: 'Total Value', v: money(detailData.stats.totalValue), c: '#8B5CF6' },
                    ].map((s, i) => (
                      <div key={i} style={{
                        padding: '12px 14px', borderRadius: 10, border: '1px solid var(--gn-border-light)',
                        background: 'var(--gn-surface-alt)'
                      }}>
                        <div style={{ fontSize: 11, color: 'var(--gn-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{s.l}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: s.c }}>{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Assets Table */}
                  {detailData.assets?.length > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600 }}>Assets in this Group</h3>
                        <button className="btn btn-sm btn-secondary" onClick={() => { setModal(null); navigate(`/assets?group=${selected.id}`); }}>
                          View All <i className="fa-solid fa-arrow-right" style={{ fontSize: 10, marginLeft: 4 }}></i>
                        </button>
                      </div>
                      <div className="table-wrap">
                        <table>
                          <thead>
                            <tr><th>Tag</th><th>Name</th><th>Category</th><th>Status</th><th>Location</th></tr>
                          </thead>
                          <tbody>
                            {detailData.assets.slice(0, 10).map(a => (
                              <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => { setModal(null); navigate(`/assets/${a.id}`); }}>
                                <td className="font-mono text-sm">{a.asset_tag}</td>
                                <td>{a.name}</td>
                                <td className="text-sm text-muted">{a.subcategory?.replace(/-/g, ' ') || a.category}</td>
                                <td>
                                  <span className={`badge ${
                                    a.status === 'active' ? 'green' : a.status === 'maintenance' ? 'orange' :
                                    a.status === 'checked_out' ? 'blue' : 'gray'
                                  }`}>{(a.status || '').replace(/_/g, ' ')}</span>
                                </td>
                                <td className="text-sm text-muted">{a.location}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {detailData.assets.length > 10 && (
                        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--gn-text-muted)', marginTop: 8 }}>
                          Showing 10 of {detailData.assets.length} assets
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setModal(null); navigate(`/assets?group=${selected.id}`); }}>
                <i className="fa-solid fa-boxes-stacked"></i> View All Assets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {modal === 'delete' && selected && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h2>Delete Group</h2>
              <button className="modal-close" onClick={() => setModal(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>}
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                  background: 'rgba(239,68,68,0.1)', color: '#EF4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                }}>
                  <i className="fa-solid fa-trash"></i>
                </div>
                <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Delete "{selected.name}"?</p>
                <p style={{ fontSize: 13, color: 'var(--gn-text-muted)' }}>This action cannot be undone. Groups with assets cannot be deleted.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Deleting...' : 'Delete Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
