import { useState } from 'react';

const MOCK_MEDIA = [
  { id: 1, name: 'Dell XPS 15 - Front.jpg', type: 'image', size: '2.4 MB', uploaded: 'Feb 24, 2026', by: 'Sarah Chen', asset: 'Dell XPS 15 9530', tag: 'GN-00001', mime: 'image/jpeg', dims: '3840 × 2160' },
  { id: 2, name: 'Server Room Layout.pdf', type: 'document', size: '5.1 MB', uploaded: 'Feb 22, 2026', by: 'Admin', asset: null, tag: null, mime: 'application/pdf', dims: null },
  { id: 3, name: 'Caterpillar C15 - Service Manual.pdf', type: 'document', size: '12.8 MB', uploaded: 'Feb 20, 2026', by: 'Tom Bradley', asset: 'Caterpillar C15 Generator', tag: 'GN-00410', mime: 'application/pdf', dims: null },
  { id: 4, name: 'HVAC Unit B - Damage Photo.jpg', type: 'image', size: '1.8 MB', uploaded: 'Feb 19, 2026', by: 'Mike Torres', asset: 'Carrier HVAC Unit B', tag: 'GN-00350', mime: 'image/jpeg', dims: '2048 × 1536' },
  { id: 5, name: 'Office Floor Plan.png', type: 'image', size: '3.2 MB', uploaded: 'Feb 18, 2026', by: 'Admin', asset: null, tag: null, mime: 'image/png', dims: '4096 × 2304' },
  { id: 6, name: 'Toyota Hilux - Insurance.pdf', type: 'document', size: '890 KB', uploaded: 'Feb 17, 2026', by: 'Jake Miller', asset: 'Toyota Hilux 2025', tag: 'GN-00480', mime: 'application/pdf', dims: null },
  { id: 7, name: 'Warehouse Inventory Photo.jpg', type: 'image', size: '4.5 MB', uploaded: 'Feb 16, 2026', by: 'Lisa Park', asset: null, tag: null, mime: 'image/jpeg', dims: '4000 × 3000' },
  { id: 8, name: 'Network Topology Diagram.png', type: 'image', size: '1.2 MB', uploaded: 'Feb 15, 2026', by: 'Sarah Chen', asset: null, tag: null, mime: 'image/png', dims: '2560 × 1440' },
  { id: 9, name: 'Epson Projector Warranty.pdf', type: 'document', size: '340 KB', uploaded: 'Feb 14, 2026', by: 'Amy Ross', asset: 'Epson Projector X41', tag: 'GN-00399', mime: 'application/pdf', dims: null },
  { id: 10, name: 'Fire Extinguisher Inspection.jpg', type: 'image', size: '950 KB', uploaded: 'Feb 13, 2026', by: 'Tom Bradley', asset: null, tag: null, mime: 'image/jpeg', dims: '1920 × 1080' },
  { id: 11, name: 'Cisco Switch Config Backup.txt', type: 'document', size: '45 KB', uploaded: 'Feb 12, 2026', by: 'Sarah Chen', asset: 'Cisco SG350 Switch', tag: 'GN-00120', mime: 'text/plain', dims: null },
  { id: 12, name: 'Forklift Maintenance Log.xlsx', type: 'document', size: '780 KB', uploaded: 'Feb 10, 2026', by: 'Jake Miller', asset: 'Toyota Forklift 8FGU25', tag: 'GN-00440', mime: 'application/xlsx', dims: null },
];

const typeIcon = (m) => {
  if (m.mime?.startsWith('image/')) return { icon: 'fa-image', color: '#4F6BED', bg: '#4F6BED15' };
  if (m.mime?.includes('pdf')) return { icon: 'fa-file-pdf', color: '#EF4444', bg: '#EF444415' };
  if (m.mime?.includes('xlsx') || m.mime?.includes('xls')) return { icon: 'fa-file-excel', color: '#10B981', bg: '#10B98115' };
  return { icon: 'fa-file', color: '#64748B', bg: '#64748B15' };
};

export default function MediaLibrary() {
  const [media, setMedia] = useState(MOCK_MEDIA);
  const [view, setView] = useState('grid'); // grid | list
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);

  const filtered = media.filter(m => {
    if (filter === 'images' && m.type !== 'image') return false;
    if (filter === 'documents' && m.type !== 'document') return false;
    if (filter === 'linked' && !m.asset) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !(m.asset || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSize = media.reduce((s, m) => {
    const num = parseFloat(m.size);
    return s + (m.size.includes('MB') ? num : m.size.includes('KB') ? num / 1024 : num / 1024 / 1024);
  }, 0);

  return (
    <>
      <div className="page-header">
        <div><h1>Media Library</h1><p>{media.length} files &bull; {totalSize.toFixed(1)} MB total</p></div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setUploadModal(true)}><i className="fa-solid fa-cloud-arrow-up"></i> Upload Files</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', marginBottom: 20 }}>
        {[
          { l: 'Total Files', v: media.length, icon: 'fa-folder', color: '#4F6BED' },
          { l: 'Images', v: media.filter(m => m.type === 'image').length, icon: 'fa-image', color: '#10B981' },
          { l: 'Documents', v: media.filter(m => m.type === 'document').length, icon: 'fa-file-pdf', color: '#EF4444' },
          { l: 'Linked to Assets', v: media.filter(m => m.asset).length, icon: 'fa-link', color: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon`} style={{ background: `${s.color}15`, color: s.color }}><i className={`fa-solid ${s.icon}`}></i></div>
            <div><div className="stat-label">{s.l}</div><div className="stat-value">{s.v}</div></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['all', 'All'], ['images', 'Images'], ['documents', 'Documents'], ['linked', 'Linked to Asset']].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${filter === k ? 'var(--gn-accent)' : 'var(--gn-border)'}`,
              background: filter === k ? 'rgba(79,107,237,0.08)' : 'var(--gn-surface)',
              color: filter === k ? 'var(--gn-accent)' : 'var(--gn-text-secondary)'
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="form-control" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200, marginBottom: 0 }} />
          <button onClick={() => setView('grid')} style={{ padding: 8, border: 'none', cursor: 'pointer', background: 'none', color: view === 'grid' ? 'var(--gn-accent)' : 'var(--gn-text-muted)', fontSize: 16 }}><i className="fa-solid fa-grid-2"></i></button>
          <button onClick={() => setView('list')} style={{ padding: 8, border: 'none', cursor: 'pointer', background: 'none', color: view === 'list' ? 'var(--gn-accent)' : 'var(--gn-text-muted)', fontSize: 16 }}><i className="fa-solid fa-list"></i></button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {filtered.map(m => {
            const ti = typeIcon(m);
            return (
              <div key={m.id} className="card" onClick={() => setSelected(m)} style={{ cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ height: 120, background: ti.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: ti.color }}>
                  <i className={`fa-solid ${ti.icon}`}></i>
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gn-text-muted)' }}>{m.size} &bull; {m.uploaded}</div>
                  {m.asset && <div style={{ fontSize: 11, color: 'var(--gn-accent)', marginTop: 4 }}><i className="fa-solid fa-link" style={{ fontSize: 9, marginRight: 4 }}></i>{m.tag}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="card">
          <div className="table-wrap"><table><thead><tr><th></th><th>Name</th><th>Linked Asset</th><th>Size</th><th>Uploaded</th><th>By</th><th>Actions</th></tr></thead><tbody>
            {filtered.map(m => {
              const ti = typeIcon(m);
              return (
                <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(m)}>
                  <td><div style={{ width: 32, height: 32, borderRadius: 6, background: ti.bg, color: ti.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}><i className={`fa-solid ${ti.icon}`}></i></div></td>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td className="text-sm">{m.asset ? <span><span className="font-mono">{m.tag}</span> — {m.asset}</span> : <span className="text-muted">—</span>}</td>
                  <td className="text-sm">{m.size}</td>
                  <td className="text-sm text-muted">{m.uploaded}</td>
                  <td className="text-sm">{m.by}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-secondary"><i className="fa-solid fa-download"></i></button>
                      <button className="btn btn-sm btn-ghost" style={{ color: 'var(--gn-danger)' }} onClick={e => { e.stopPropagation(); setMedia(prev => prev.filter(x => x.id !== m.id)); }}><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody></table></div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header"><h2>File Details</h2><button className="modal-close" onClick={() => setSelected(null)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: typeIcon(selected).bg, color: typeIcon(selected).color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <i className={`fa-solid ${typeIcon(selected).icon}`}></i>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>{selected.mime}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Size', selected.size], ['Uploaded', selected.uploaded], ['By', selected.by], ['Dimensions', selected.dims || 'N/A'],
                  ['Linked Asset', selected.asset || 'None'], ['Asset Tag', selected.tag || 'N/A']].map(([l, v], i) => (
                  <div key={i} style={{ padding: 10, background: 'var(--gn-surface-alt)', borderRadius: 8, border: '1px solid var(--gn-border-light)' }}>
                    <div style={{ fontSize: 11, color: 'var(--gn-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              <button className="btn btn-primary"><i className="fa-solid fa-download"></i> Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="modal-overlay" onClick={() => setUploadModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header"><h2>Upload Files</h2><button className="modal-close" onClick={() => setUploadModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div style={{ border: '2px dashed var(--gn-border)', borderRadius: 12, padding: 40, textAlign: 'center', marginBottom: 16 }}>
                <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 36, color: 'var(--gn-text-muted)', marginBottom: 12, display: 'block' }}></i>
                <p style={{ fontWeight: 500, marginBottom: 4 }}>Drag & drop files here</p>
                <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', marginBottom: 12 }}>or click to browse</p>
                <input type="file" multiple style={{ display: 'block', margin: '0 auto' }} />
              </div>
              <div className="form-group"><label>Link to Asset (optional)</label>
                <input className="form-control" placeholder="Search asset by tag or name..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setUploadModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setUploadModal(false); alert('Files uploaded!'); }}><i className="fa-solid fa-cloud-arrow-up"></i> Upload</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
