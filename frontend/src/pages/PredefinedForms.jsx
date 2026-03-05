import { useState } from 'react';

const FORM_TEMPLATES = [
  { id: 1, name: 'Asset Receiving Form', icon: 'fa-inbox', color: '#4F6BED', category: 'intake', desc: 'Record new asset arrivals with vendor, PO, condition assessment',
    fields: ['Receiving Date', 'PO Number', 'Vendor Name', 'Asset Name', 'Serial Number', 'Quantity', 'Condition on Arrival', 'Received By', 'Storage Location', 'Notes/Discrepancies', 'Photo Upload'] },
  { id: 2, name: 'Asset Disposal Form', icon: 'fa-trash-can', color: '#EF4444', category: 'disposal', desc: 'Authorize and document asset disposal or decommission',
    fields: ['Asset Tag', 'Asset Name', 'Reason for Disposal', 'Disposal Method', 'Estimated Residual Value', 'Data Wiped (Y/N)', 'Approved By', 'Disposal Date', 'Certificate of Destruction', 'Environmental Compliance'] },
  { id: 3, name: 'Transfer Request Form', icon: 'fa-arrow-right-arrow-left', color: '#3B82F6', category: 'transfer', desc: 'Request asset transfer between departments or locations',
    fields: ['Asset Tag', 'Asset Name', 'From Department', 'From Location', 'To Department', 'To Location', 'Transfer Reason', 'Requested By', 'Approved By', 'Transfer Date', 'Condition at Transfer'] },
  { id: 4, name: 'Maintenance Request', icon: 'fa-wrench', color: '#F59E0B', category: 'maintenance', desc: 'Submit maintenance or repair request for an asset',
    fields: ['Asset Tag', 'Asset Name', 'Issue Description', 'Priority Level', 'Reported By', 'Date Reported', 'Location', 'Preferred Service Window', 'Estimated Downtime', 'Attachments'] },
  { id: 5, name: 'IT Equipment Request', icon: 'fa-laptop', color: '#8B5CF6', category: 'request', desc: 'Request new IT equipment for employee onboarding or replacement',
    fields: ['Requester Name', 'Department', 'Manager Approval', 'Equipment Type', 'Specifications', 'Business Justification', 'Urgency', 'Budget Code', 'Delivery Location', 'Setup Requirements'] },
  { id: 6, name: 'Vehicle Inspection', icon: 'fa-car', color: '#10B981', category: 'inspection', desc: 'Pre/post-trip vehicle inspection checklist',
    fields: ['Vehicle ID', 'Driver Name', 'Inspection Type', 'Odometer Reading', 'Tires Condition', 'Brakes Condition', 'Fluids Level', 'Lights Working', 'Body Damage', 'Interior Condition', 'Fuel Level', 'Comments'] },
  { id: 7, name: 'Incident Report', icon: 'fa-triangle-exclamation', color: '#EF4444', category: 'incident', desc: 'Document asset damage, theft, or loss incidents',
    fields: ['Incident Date', 'Asset Tag', 'Asset Name', 'Incident Type', 'Description', 'Location', 'Reported By', 'Witnesses', 'Estimated Damage Cost', 'Police Report #', 'Photos', 'Follow-up Actions'] },
  { id: 8, name: 'Warranty Claim Form', icon: 'fa-shield', color: '#14B8A6', category: 'warranty', desc: 'File warranty claims with vendors for defective assets',
    fields: ['Asset Tag', 'Asset Name', 'Vendor', 'Warranty Expiry', 'Issue Description', 'Date Issue Discovered', 'Claim Type', 'Supporting Documents', 'Contact Person', 'Resolution Requested'] },
];

const CATEGORIES = [
  { key: 'all', label: 'All Forms' },
  { key: 'intake', label: 'Intake' },
  { key: 'disposal', label: 'Disposal' },
  { key: 'transfer', label: 'Transfer' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'request', label: 'Requests' },
  { key: 'inspection', label: 'Inspection' },
  { key: 'incident', label: 'Incident' },
  { key: 'warranty', label: 'Warranty' },
];

const SUBMISSIONS = [
  { id: 1, form: 'Asset Receiving Form', submittedBy: 'Sarah Chen', date: 'Feb 24, 2026', status: 'approved' },
  { id: 2, form: 'Transfer Request Form', submittedBy: 'Mike Torres', date: 'Feb 23, 2026', status: 'pending' },
  { id: 3, form: 'Maintenance Request', submittedBy: 'Amy Ross', date: 'Feb 22, 2026', status: 'approved' },
  { id: 4, form: 'IT Equipment Request', submittedBy: 'Jake Miller', date: 'Feb 21, 2026', status: 'rejected' },
  { id: 5, form: 'Vehicle Inspection', submittedBy: 'Tom Bradley', date: 'Feb 20, 2026', status: 'approved' },
  { id: 6, form: 'Incident Report', submittedBy: 'Lisa Park', date: 'Feb 19, 2026', status: 'pending' },
];

export default function PredefinedForms() {
  const [tab, setTab] = useState('templates');
  const [category, setCategory] = useState('all');
  const [preview, setPreview] = useState(null);
  const [fillForm, setFillForm] = useState(null);
  const [formValues, setFormValues] = useState({});

  const filtered = category === 'all' ? FORM_TEMPLATES : FORM_TEMPLATES.filter(f => f.category === category);

  const handleSubmitForm = () => {
    alert('Form submitted successfully!');
    setFillForm(null);
    setFormValues({});
  };

  return (
    <>
      <div className="page-header">
        <div><h1>Predefined Forms</h1><p>{FORM_TEMPLATES.length} form templates available</p></div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid var(--gn-border-light)' }}>
        {[['templates', 'Form Templates'], ['submissions', 'Recent Submissions']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit',
            background: 'none', borderBottom: `2px solid ${tab === k ? 'var(--gn-accent)' : 'transparent'}`,
            color: tab === k ? 'var(--gn-accent)' : 'var(--gn-text-muted)', marginBottom: -2
          }}>{l}</button>
        ))}
      </div>

      {tab === 'templates' && (
        <>
          {/* Category Chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setCategory(c.key)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${category === c.key ? 'var(--gn-accent)' : 'var(--gn-border)'}`,
                background: category === c.key ? 'rgba(79,107,237,0.08)' : 'var(--gn-surface)',
                color: category === c.key ? 'var(--gn-accent)' : 'var(--gn-text-secondary)', transition: 'all 0.15s'
              }}>{c.label}</button>
            ))}
          </div>

          {/* Form Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {filtered.map(f => (
              <div key={f.id} className="card" style={{ overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: f.color }}></div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: `${f.color}15`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      <i className={`fa-solid ${f.icon}`}></i>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600 }}>{f.name}</h3>
                      <span style={{ fontSize: 11, color: 'var(--gn-text-muted)' }}>{f.fields.length} fields</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', lineHeight: 1.5, marginBottom: 14 }}>{f.desc}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-primary" onClick={() => { setFillForm(f); setFormValues({}); }}>
                      <i className="fa-solid fa-pen-to-square"></i> Fill Form
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setPreview(f)}>
                      <i className="fa-solid fa-eye"></i> Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Submissions Tab */}
      {tab === 'submissions' && (
        <div className="card">
          <div className="table-wrap"><table><thead><tr><th>Form</th><th>Submitted By</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            {SUBMISSIONS.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.form}</td>
                <td>{s.submittedBy}</td>
                <td className="text-sm text-muted">{s.date}</td>
                <td><span className={`badge ${s.status === 'approved' ? 'green' : s.status === 'pending' ? 'orange' : 'red'}`}>{s.status}</span></td>
                <td><button className="btn btn-sm btn-secondary"><i className="fa-solid fa-eye"></i> View</button></td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header"><h2>{preview.name}</h2><button className="modal-close" onClick={() => setPreview(null)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', marginBottom: 16 }}>{preview.desc}</p>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gn-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Form Fields ({preview.fields.length})</div>
              {preview.fields.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--gn-border-light)' }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--gn-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--gn-text-muted)' }}>{i + 1}</span>
                  <span style={{ fontSize: 13 }}>{f}</span>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setPreview(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setPreview(null); setFillForm(preview); setFormValues({}); }}>Fill This Form</button>
            </div>
          </div>
        </div>
      )}

      {/* Fill Form Modal */}
      {fillForm && (
        <div className="modal-overlay" onClick={() => setFillForm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${fillForm.color}15`, color: fillForm.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                  <i className={`fa-solid ${fillForm.icon}`}></i>
                </div>
                <h2>{fillForm.name}</h2>
              </div>
              <button className="modal-close" onClick={() => setFillForm(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body" style={{ maxHeight: 500, overflowY: 'auto' }}>
              {fillForm.fields.map((f, i) => (
                <div key={i} className="form-group">
                  <label>{f}</label>
                  {f.toLowerCase().includes('description') || f.toLowerCase().includes('comment') || f.toLowerCase().includes('notes') || f.toLowerCase().includes('justification') || f.toLowerCase().includes('actions') ? (
                    <textarea className="form-control" rows={3} value={formValues[f] || ''} onChange={e => setFormValues({ ...formValues, [f]: e.target.value })} placeholder={`Enter ${f.toLowerCase()}...`} />
                  ) : f.toLowerCase().includes('date') ? (
                    <input type="date" className="form-control" value={formValues[f] || ''} onChange={e => setFormValues({ ...formValues, [f]: e.target.value })} />
                  ) : f.toLowerCase().includes('(y/n)') ? (
                    <select className="form-control" value={formValues[f] || ''} onChange={e => setFormValues({ ...formValues, [f]: e.target.value })}>
                      <option value="">Select...</option><option>Yes</option><option>No</option>
                    </select>
                  ) : f.toLowerCase().includes('type') || f.toLowerCase().includes('method') || f.toLowerCase().includes('level') || f.toLowerCase().includes('urgency') || f.toLowerCase().includes('condition') ? (
                    <select className="form-control" value={formValues[f] || ''} onChange={e => setFormValues({ ...formValues, [f]: e.target.value })}>
                      <option value="">Select...</option><option>Option 1</option><option>Option 2</option><option>Option 3</option>
                    </select>
                  ) : f.toLowerCase().includes('photo') || f.toLowerCase().includes('upload') || f.toLowerCase().includes('attachment') || f.toLowerCase().includes('document') || f.toLowerCase().includes('certificate') ? (
                    <input type="file" className="form-control" style={{ padding: 8 }} />
                  ) : (
                    <input className="form-control" value={formValues[f] || ''} onChange={e => setFormValues({ ...formValues, [f]: e.target.value })} placeholder={`Enter ${f.toLowerCase()}...`} />
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setFillForm(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmitForm}><i className="fa-solid fa-paper-plane"></i> Submit Form</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
