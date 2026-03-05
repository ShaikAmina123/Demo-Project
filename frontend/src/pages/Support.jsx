import { useState } from 'react';

const TICKETS = [
  { id: 'TKT-1042', subject: 'Unable to generate barcode labels for fleet assets', category: 'Bug', priority: 'high', status: 'open', created: 'Feb 25, 2026', assignee: 'Support Team', lastUpdate: '2 hours ago' },
  { id: 'TKT-1041', subject: 'Request: Bulk import CSV template for IT assets', category: 'Feature Request', priority: 'medium', status: 'in_progress', created: 'Feb 24, 2026', assignee: 'Dev Team', lastUpdate: '1 day ago' },
  { id: 'TKT-1040', subject: 'Depreciation calculation showing incorrect values for DDB method', category: 'Bug', priority: 'high', status: 'in_progress', created: 'Feb 22, 2026', assignee: 'Support Team', lastUpdate: '2 days ago' },
  { id: 'TKT-1039', subject: 'How to set up automated license renewal reminders?', category: 'Question', priority: 'low', status: 'resolved', created: 'Feb 20, 2026', assignee: 'Support Team', lastUpdate: 'Feb 21, 2026' },
  { id: 'TKT-1038', subject: 'SSO integration with Okta not redirecting correctly', category: 'Bug', priority: 'urgent', status: 'resolved', created: 'Feb 18, 2026', assignee: 'Dev Team', lastUpdate: 'Feb 19, 2026' },
  { id: 'TKT-1037', subject: 'Need additional custom fields for vehicle inspection forms', category: 'Feature Request', priority: 'medium', status: 'resolved', created: 'Feb 15, 2026', assignee: 'Product Team', lastUpdate: 'Feb 17, 2026' },
];

const FAQ = [
  { q: 'How do I add assets in bulk?', a: 'Go to All Assets → click "Import CSV". Download the template, fill in your data, and upload. The system validates and creates all assets at once. Supports up to 5,000 rows per import.' },
  { q: 'How does depreciation calculation work?', a: 'Navigate to Depreciation page. The system supports Straight-Line and Declining Balance methods. Default method is configured per Asset Group in Group Settings. You can override per asset.' },
  { q: 'Can I customize the asset tag format?', a: 'Yes! Go to Settings → Company Settings → Asset Tags tab. Configure the prefix (e.g. GN-), number of digits, and the next sequential number.' },
  { q: 'How do I set up automated reports?', a: 'Go to Settings → Automated Reports → click "New Schedule". Choose report type, frequency, format, and email recipients. Reports are generated and emailed automatically.' },
  { q: 'What user roles are available?', a: 'There are 4 system roles: Administrator (full access), Manager (create/edit/approve), Technician (operations focused), and Viewer (read-only). Custom templates can be created in Settings → User Templates.' },
  { q: 'How do I connect third-party integrations?', a: 'Go to Settings → Integrations. Click "Connect" on the desired service. Follow the OAuth flow to authorize. Once connected, configure sync settings and feature toggles.' },
  { q: 'Can I track warranty expiration?', a: 'Yes. Warranties can be tracked via the Licenses page or by adding warranty dates to individual assets. Set up Notification Rules in Settings to get expiry alerts 30/60/90 days before.' },
  { q: 'How do I run a physical audit?', a: 'Go to Audits → Create New Audit. Choose audit type (Full, Spot Check, Cycle Count), select the asset group and location, then start counting. The system tracks accuracy automatically.' },
];

const CONTACT = [
  { method: 'Email Support', value: 'support@neochain.com', icon: 'fa-envelope', color: '#3B82F6', desc: 'Response within 4 business hours' },
  { method: 'Phone', value: '+1 (512) 555-0199', icon: 'fa-phone', color: '#10B981', desc: 'Mon-Fri 8AM-6PM CST' },
  { method: 'Live Chat', value: 'Available', icon: 'fa-comments', color: '#8B5CF6', desc: 'Mon-Fri 9AM-5PM CST' },
  { method: 'Emergency', value: '+1 (512) 555-0911', icon: 'fa-triangle-exclamation', color: '#EF4444', desc: '24/7 for critical system issues' },
];

const priorityColors = { urgent: '#EF4444', high: '#F59E0B', medium: '#3B82F6', low: '#64748B' };
const statusColors = { open: 'blue', in_progress: 'orange', resolved: 'green', closed: 'gray' };

export default function Support() {
  const [tab, setTab] = useState('tickets');
  const [filter, setFilter] = useState('all');
  const [faqOpen, setFaqOpen] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ subject: '', category: 'Bug', priority: 'medium', description: '' });

  const filtered = filter === 'all' ? TICKETS : TICKETS.filter(t => t.status === filter);

  return (
    <>
      <div className="page-header">
        <div><h1>Support</h1><p>Get help, submit tickets, and browse FAQs</p></div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setCreateModal(true)}><i className="fa-solid fa-plus"></i> New Ticket</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', marginBottom: 20 }}>
        {[
          { l: 'Open Tickets', v: TICKETS.filter(t => t.status === 'open').length, icon: 'fa-ticket', color: 'blue' },
          { l: 'In Progress', v: TICKETS.filter(t => t.status === 'in_progress').length, icon: 'fa-spinner', color: 'orange' },
          { l: 'Resolved', v: TICKETS.filter(t => t.status === 'resolved').length, icon: 'fa-circle-check', color: 'green' },
          { l: 'Avg Response', v: '3.2h', icon: 'fa-clock', color: 'purple' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
            <div><div className="stat-label">{s.l}</div><div className="stat-value">{s.v}</div></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid var(--gn-border-light)' }}>
        {[['tickets', 'My Tickets'], ['faq', 'FAQ'], ['contact', 'Contact Us']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit',
            background: 'none', borderBottom: `2px solid ${tab === k ? 'var(--gn-accent)' : 'transparent'}`,
            color: tab === k ? 'var(--gn-accent)' : 'var(--gn-text-muted)', marginBottom: -2
          }}>{l}</button>
        ))}
      </div>

      {/* Tickets Tab */}
      {tab === 'tickets' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['all', 'All'], ['open', 'Open'], ['in_progress', 'In Progress'], ['resolved', 'Resolved']].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${filter === k ? 'var(--gn-accent)' : 'var(--gn-border)'}`,
                background: filter === k ? 'rgba(79,107,237,0.08)' : 'var(--gn-surface)',
                color: filter === k ? 'var(--gn-accent)' : 'var(--gn-text-secondary)'
              }}>{l}</button>
            ))}
          </div>
          <div className="card">
            <div className="table-wrap"><table><thead><tr><th>Ticket</th><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Assigned</th><th>Updated</th></tr></thead><tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-sm" style={{ fontWeight: 600 }}>{t.id}</td>
                  <td style={{ fontWeight: 500, maxWidth: 280 }}>{t.subject}</td>
                  <td><span className={`badge ${t.category === 'Bug' ? 'red' : t.category === 'Feature Request' ? 'purple' : 'blue'}`}>{t.category}</span></td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: priorityColors[t.priority] }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: priorityColors[t.priority] }}></span>{t.priority}
                  </span></td>
                  <td><span className={`badge ${statusColors[t.status]}`}>{t.status.replace(/_/g, ' ')}</span></td>
                  <td className="text-sm">{t.assignee}</td>
                  <td className="text-sm text-muted">{t.lastUpdate}</td>
                </tr>
              ))}
            </tbody></table></div>
          </div>
        </>
      )}

      {/* FAQ Tab */}
      {tab === 'faq' && (
        <div style={{ maxWidth: 800 }}>
          <div style={{ marginBottom: 16 }}>
            <input className="form-control" placeholder="Search FAQs..." style={{ maxWidth: 400, marginBottom: 0 }} />
          </div>
          {FAQ.map((f, i) => (
            <div key={i} className="card" style={{ marginBottom: 8, cursor: 'pointer', overflow: 'hidden' }} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(79,107,237,0.08)', color: 'var(--gn-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>?</div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{f.q}</span>
                </div>
                <i className={`fa-solid fa-chevron-${faqOpen === i ? 'up' : 'down'}`} style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}></i>
              </div>
              {faqOpen === i && (
                <div style={{ padding: '0 20px 16px 60px', fontSize: 13, color: 'var(--gn-text-secondary)', lineHeight: 1.6 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact Tab */}
      {tab === 'contact' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {CONTACT.map((c, i) => (
            <div key={i} className="card" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${c.color}15`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>
                <i className={`fa-solid ${c.icon}`}></i>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{c.method}</h3>
              <div style={{ fontSize: 15, fontWeight: 600, color: c.color, marginBottom: 6 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: 'var(--gn-text-muted)' }}>{c.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* Create Ticket Modal */}
      {createModal && (
        <div className="modal-overlay" onClick={() => setCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header"><h2>Submit Support Ticket</h2><button className="modal-close" onClick={() => setCreateModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Subject</label><input className="form-control" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Brief description of the issue..." /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group"><label>Category</label>
                  <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Bug</option><option>Feature Request</option><option>Question</option><option>Account Issue</option><option>Data Issue</option>
                  </select>
                </div>
                <div className="form-group"><label>Priority</label>
                  <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Description</label>
                <textarea className="form-control" rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail. Include steps to reproduce if it's a bug..." />
              </div>
              <div className="form-group"><label>Attachments (optional)</label>
                <input type="file" multiple style={{ display: 'block' }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setCreateModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setCreateModal(false); alert('Ticket submitted!'); }}><i className="fa-solid fa-paper-plane"></i> Submit Ticket</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
