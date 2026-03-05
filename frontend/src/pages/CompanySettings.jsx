import { useState } from 'react';

export default function CompanySettings() {
  const [tab, setTab] = useState('company');
  const [form, setForm] = useState({
    name: 'Global Neochain Corp', domain: 'neochain.com', industry: 'Technology & Manufacturing',
    address: '1200 Innovation Drive, Suite 400', city: 'Austin', state: 'TX', zip: '78701', country: 'United States',
    phone: '+1 (512) 555-0199', email: 'admin@neochain.com', website: 'https://www.neochain.com',
    taxId: '84-2938475', fiscalStart: '01', currency: 'USD', timezone: 'America/Chicago',
    dateFormat: 'MM/DD/YYYY', tagPrefix: 'GN-', tagDigits: '5', tagNext: '00493',
    logo: null, primaryColor: '#4F6BED', accentColor: '#10B981'
  });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const u = (k, v) => setForm({ ...form, [k]: v });

  const tabs = [
    ['company', 'Company Info', 'fa-building'],
    ['localization', 'Localization', 'fa-globe'],
    ['asset-tags', 'Asset Tags', 'fa-hashtag'],
    ['branding', 'Branding', 'fa-palette'],
  ];

  return (
    <>
      <div className="page-header">
        <div><h1>Company Settings</h1><p>Manage your organization profile and preferences</p></div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={save}>
            {saved ? <><i className="fa-solid fa-check"></i> Saved!</> : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Tabs Sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          {tabs.map(([k, l, ic]) => (
            <div key={k} onClick={() => setTab(k)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 4,
              background: tab === k ? 'rgba(79,107,237,0.08)' : 'transparent', color: tab === k ? 'var(--gn-accent)' : 'var(--gn-text-secondary)',
              fontWeight: tab === k ? 600 : 400, fontSize: 13, transition: 'all 0.15s'
            }}>
              <i className={`fa-solid ${ic}`} style={{ width: 16, textAlign: 'center' }}></i>{l}
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {tab === 'company' && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Company Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label>Company Name</label><input className="form-control" value={form.name} onChange={e => u('name', e.target.value)} /></div>
                <div className="form-group"><label>Domain</label><input className="form-control" value={form.domain} onChange={e => u('domain', e.target.value)} /></div>
                <div className="form-group"><label>Industry</label><input className="form-control" value={form.industry} onChange={e => u('industry', e.target.value)} /></div>
                <div className="form-group"><label>Tax ID / EIN</label><input className="form-control" value={form.taxId} onChange={e => u('taxId', e.target.value)} /></div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Address</label><input className="form-control" value={form.address} onChange={e => u('address', e.target.value)} /></div>
                <div className="form-group"><label>City</label><input className="form-control" value={form.city} onChange={e => u('city', e.target.value)} /></div>
                <div className="form-group"><label>State</label><input className="form-control" value={form.state} onChange={e => u('state', e.target.value)} /></div>
                <div className="form-group"><label>ZIP</label><input className="form-control" value={form.zip} onChange={e => u('zip', e.target.value)} /></div>
                <div className="form-group"><label>Country</label><input className="form-control" value={form.country} onChange={e => u('country', e.target.value)} /></div>
                <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e => u('phone', e.target.value)} /></div>
                <div className="form-group"><label>Email</label><input className="form-control" value={form.email} onChange={e => u('email', e.target.value)} /></div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Website</label><input className="form-control" value={form.website} onChange={e => u('website', e.target.value)} /></div>
              </div>
            </div>
          )}

          {tab === 'localization' && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Localization & Format</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label>Currency</label>
                  <select className="form-control" value={form.currency} onChange={e => u('currency', e.target.value)}>
                    <option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — British Pound</option><option value="INR">INR — Indian Rupee</option><option value="JPY">JPY — Japanese Yen</option><option value="CAD">CAD — Canadian Dollar</option><option value="AUD">AUD — Australian Dollar</option>
                  </select>
                </div>
                <div className="form-group"><label>Timezone</label>
                  <select className="form-control" value={form.timezone} onChange={e => u('timezone', e.target.value)}>
                    <option>America/New_York</option><option>America/Chicago</option><option>America/Denver</option><option>America/Los_Angeles</option><option>Europe/London</option><option>Europe/Berlin</option><option>Asia/Tokyo</option><option>Asia/Kolkata</option>
                  </select>
                </div>
                <div className="form-group"><label>Date Format</label>
                  <select className="form-control" value={form.dateFormat} onChange={e => u('dateFormat', e.target.value)}>
                    <option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option><option>DD-MMM-YYYY</option>
                  </select>
                </div>
                <div className="form-group"><label>Fiscal Year Start</label>
                  <select className="form-control" value={form.fiscalStart} onChange={e => u('fiscalStart', e.target.value)}>
                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m,i) => <option key={i} value={String(i+1).padStart(2,'0')}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === 'asset-tags' && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Asset Tag Configuration</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label>Tag Prefix</label><input className="form-control font-mono" value={form.tagPrefix} onChange={e => u('tagPrefix', e.target.value)} /></div>
                <div className="form-group"><label>Number Digits</label>
                  <select className="form-control" value={form.tagDigits} onChange={e => u('tagDigits', e.target.value)}>
                    <option value="4">4 digits (0001)</option><option value="5">5 digits (00001)</option><option value="6">6 digits (000001)</option>
                  </select>
                </div>
                <div className="form-group"><label>Next Tag Number</label><input className="form-control font-mono" value={form.tagNext} onChange={e => u('tagNext', e.target.value)} /></div>
              </div>
              <div style={{ marginTop: 16, padding: 16, background: 'var(--gn-surface-alt)', borderRadius: 8, border: '1px solid var(--gn-border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--gn-text-muted)', marginBottom: 4 }}>Preview: Next asset tag</div>
                <div className="font-mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--gn-accent)' }}>{form.tagPrefix}{form.tagNext}</div>
              </div>
            </div>
          )}

          {tab === 'branding' && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Branding</h3>
              <div className="form-group"><label>Company Logo</label>
                <div style={{ border: '2px dashed var(--gn-border)', borderRadius: 10, padding: 32, textAlign: 'center' }}>
                  <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 28, color: 'var(--gn-text-muted)', marginBottom: 8, display: 'block' }}></i>
                  <p style={{ fontSize: 13, color: 'var(--gn-text-muted)', marginBottom: 8 }}>Upload logo (PNG, SVG, max 2MB)</p>
                  <input type="file" accept="image/*" style={{ display: 'block', margin: '0 auto' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <div className="form-group"><label>Primary Color</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={form.primaryColor} onChange={e => u('primaryColor', e.target.value)} style={{ width: 40, height: 36, border: 'none', cursor: 'pointer' }} />
                    <input className="form-control font-mono" value={form.primaryColor} onChange={e => u('primaryColor', e.target.value)} style={{ flex: 1 }} />
                  </div>
                </div>
                <div className="form-group"><label>Accent Color</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={form.accentColor} onChange={e => u('accentColor', e.target.value)} style={{ width: 40, height: 36, border: 'none', cursor: 'pointer' }} />
                    <input className="form-control font-mono" value={form.accentColor} onChange={e => u('accentColor', e.target.value)} style={{ flex: 1 }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
