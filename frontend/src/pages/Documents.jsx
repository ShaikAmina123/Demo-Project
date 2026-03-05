import { useState } from 'react';

const FOLDERS = [
  { id: 'policies', name: 'Policies & Procedures', icon: 'fa-gavel', color: '#4F6BED', count: 8 },
  { id: 'manuals', name: 'Equipment Manuals', icon: 'fa-book', color: '#10B981', count: 15 },
  { id: 'contracts', name: 'Contracts & Agreements', icon: 'fa-file-signature', color: '#8B5CF6', count: 6 },
  { id: 'warranties', name: 'Warranties & Certificates', icon: 'fa-shield', color: '#F59E0B', count: 12 },
  { id: 'sops', name: 'Standard Operating Procedures', icon: 'fa-list-check', color: '#3B82F6', count: 9 },
  { id: 'insurance', name: 'Insurance Documents', icon: 'fa-umbrella', color: '#EC4899', count: 4 },
];

const DOCUMENTS = [
  { id: 1, name: 'IT Asset Management Policy v3.2', folder: 'policies', type: 'pdf', size: '1.2 MB', updated: 'Feb 22, 2026', by: 'Admin', status: 'current', version: '3.2' },
  { id: 2, name: 'Asset Disposal & Recycling Policy', folder: 'policies', type: 'pdf', size: '890 KB', updated: 'Feb 15, 2026', by: 'Admin', status: 'current', version: '2.1' },
  { id: 3, name: 'Dell XPS 15 Service Manual', folder: 'manuals', type: 'pdf', size: '8.5 MB', updated: 'Jan 10, 2026', by: 'Sarah Chen', status: 'current', version: '1.0' },
  { id: 4, name: 'Caterpillar C15 Maintenance Guide', folder: 'manuals', type: 'pdf', size: '15.2 MB', updated: 'Dec 5, 2025', by: 'Tom Bradley', status: 'current', version: '2.0' },
  { id: 5, name: 'Cisco SmartNet Agreement', folder: 'contracts', type: 'pdf', size: '2.1 MB', updated: 'Feb 1, 2026', by: 'Admin', status: 'current', version: '1.0' },
  { id: 6, name: 'Microsoft EA License Agreement', folder: 'contracts', type: 'pdf', size: '3.4 MB', updated: 'Jan 15, 2026', by: 'Admin', status: 'current', version: '4.0' },
  { id: 7, name: 'Dell ProSupport Warranty Certificate', folder: 'warranties', type: 'pdf', size: '340 KB', updated: 'Jan 20, 2026', by: 'Sarah Chen', status: 'expiring', version: '1.0' },
  { id: 8, name: 'HVAC Maintenance SOP', folder: 'sops', type: 'pdf', size: '1.8 MB', updated: 'Feb 10, 2026', by: 'Mike Torres', status: 'current', version: '2.3' },
  { id: 9, name: 'Vehicle Pre-Trip Inspection SOP', folder: 'sops', type: 'pdf', size: '920 KB', updated: 'Feb 8, 2026', by: 'Tom Bradley', status: 'current', version: '1.5' },
  { id: 10, name: 'Equipment Checkout Procedure', folder: 'sops', type: 'pdf', size: '450 KB', updated: 'Feb 5, 2026', by: 'Admin', status: 'current', version: '3.0' },
  { id: 11, name: 'Fleet Insurance Policy - 2026', folder: 'insurance', type: 'pdf', size: '4.2 MB', updated: 'Jan 5, 2026', by: 'Jake Miller', status: 'current', version: '1.0' },
  { id: 12, name: 'Carrier HVAC Extended Warranty', folder: 'warranties', type: 'pdf', size: '560 KB', updated: 'Dec 20, 2025', by: 'Mike Torres', status: 'current', version: '1.0' },
  { id: 13, name: 'Data Center Access Policy', folder: 'policies', type: 'pdf', size: '670 KB', updated: 'Nov 30, 2025', by: 'Admin', status: 'review', version: '1.8' },
  { id: 14, name: 'Forklift Operation Manual', folder: 'manuals', type: 'pdf', size: '6.3 MB', updated: 'Nov 15, 2025', by: 'Jake Miller', status: 'current', version: '1.0' },
];

export default function Documents() {
  const [activeFolder, setActiveFolder] = useState(null);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);

  const docs = activeFolder
    ? DOCUMENTS.filter(d => d.folder === activeFolder)
    : search ? DOCUMENTS.filter(d => d.name.toLowerCase().includes(search.toLowerCase())) : DOCUMENTS;

  const folderName = FOLDERS.find(f => f.id === activeFolder)?.name;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Documents</h1>
          <p>{DOCUMENTS.length} documents across {FOLDERS.length} folders</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setUploadModal(true)}><i className="fa-solid fa-plus"></i> Upload Document</button>
        </div>
      </div>

      {/* Folder Cards */}
      {!activeFolder && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
          {FOLDERS.map(f => (
            <div key={f.id} className="card" onClick={() => setActiveFolder(f.id)}
              style={{ cursor: 'pointer', transition: 'transform 0.15s', padding: 20 }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}15`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  <i className={`fa-solid ${f.icon}`}></i>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>{f.count} documents</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Breadcrumb for folder view */}
      {activeFolder && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13 }}>
          <button onClick={() => setActiveFolder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gn-accent)', fontFamily: 'inherit', fontWeight: 500 }}>
            <i className="fa-solid fa-folder" style={{ marginRight: 4 }}></i> All Folders
          </button>
          <i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--gn-text-muted)' }}></i>
          <span style={{ fontWeight: 600 }}>{folderName}</span>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input className="form-control" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400, marginBottom: 0 }} />
      </div>

      {/* Documents Table */}
      <div className="card">
        <div className="table-wrap"><table><thead><tr><th></th><th>Document Name</th><th>Folder</th><th>Version</th><th>Size</th><th>Updated</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {docs.map(d => (
            <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => setDetail(d)}>
              <td><div style={{ width: 32, height: 32, borderRadius: 6, background: '#EF444415', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}><i className="fa-solid fa-file-pdf"></i></div></td>
              <td style={{ fontWeight: 500 }}>{d.name}</td>
              <td className="text-sm text-muted">{FOLDERS.find(f => f.id === d.folder)?.name}</td>
              <td className="font-mono text-sm">v{d.version}</td>
              <td className="text-sm">{d.size}</td>
              <td className="text-sm text-muted">{d.updated}</td>
              <td>
                <span className={`badge ${d.status === 'current' ? 'green' : d.status === 'expiring' ? 'orange' : 'blue'}`}>
                  {d.status}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-sm btn-primary"><i className="fa-solid fa-download"></i></button>
                  <button className="btn btn-sm btn-secondary"><i className="fa-solid fa-eye"></i></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody></table></div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header"><h2>Document Details</h2><button className="modal-close" onClick={() => setDetail(null)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: '#EF444415', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <i className="fa-solid fa-file-pdf"></i>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{detail.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>Version {detail.version}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[['Folder', FOLDERS.find(f => f.id === detail.folder)?.name], ['Size', detail.size], ['Updated', detail.updated], ['Updated By', detail.by], ['Status', detail.status], ['Type', detail.type.toUpperCase()]].map(([l, v], i) => (
                  <div key={i} style={{ padding: 10, background: 'var(--gn-surface-alt)', borderRadius: 8, border: '1px solid var(--gn-border-light)' }}>
                    <div style={{ fontSize: 11, color: 'var(--gn-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>Close</button>
              <button className="btn btn-primary"><i className="fa-solid fa-download"></i> Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="modal-overlay" onClick={() => setUploadModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header"><h2>Upload Document</h2><button className="modal-close" onClick={() => setUploadModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div style={{ border: '2px dashed var(--gn-border)', borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 16 }}>
                <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 32, color: 'var(--gn-text-muted)', marginBottom: 8, display: 'block' }}></i>
                <p style={{ fontWeight: 500, marginBottom: 8 }}>Drag & drop or browse</p>
                <input type="file" style={{ display: 'block', margin: '0 auto' }} />
              </div>
              <div className="form-group"><label>Folder</label>
                <select className="form-control">{FOLDERS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
              </div>
              <div className="form-group"><label>Document Name</label><input className="form-control" placeholder="Enter document name..." /></div>
              <div className="form-group"><label>Version</label><input className="form-control" placeholder="e.g. 1.0" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setUploadModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setUploadModal(false); alert('Document uploaded!'); }}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
