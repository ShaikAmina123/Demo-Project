import { useState, useEffect } from 'react';
import { licenses } from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';

const stb = (s) => { const m={active:'green',expiring:'orange',expired:'red',cancelled:'gray'}; return <span className={`badge ${m[s]||'gray'}`}>{s}</span>; };
const empty = { name:'',vendor:'',seats:1,assigned:0,cost:'',expiry:'',status:'active',license_key:'',notes:'' };

export default function Licenses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({...empty});
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = () => { licenses.list().then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[]);

  const openCreate = () => { setEditing(null); setForm({...empty}); setShowForm(true); };
  const openEdit = (l) => {
    setEditing(l);
    setForm({ name:l.name||'',vendor:l.vendor||'',seats:l.seats||1,assigned:l.assigned||0,cost:l.cost||'',expiry:l.expiry||'',status:l.status||'active',license_key:l.license_key||'',notes:l.notes||'' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) return toast?.('Name required','error');
    setSaving(true);
    try {
      if (editing) { await licenses.update(editing.id, form); toast?.('License updated!'); }
      else { await licenses.create(form); toast?.('License created!'); }
      setShowForm(false); load();
    } catch(e) { toast?.(e.response?.data?.error||'Failed','error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await licenses.delete(deleting.id); toast?.('License deleted'); setDeleting(null); load(); }
    catch(e) { toast?.(e.response?.data?.error||'Failed','error'); }
  };

  const F = (l,n,t) => <div className="form-group"><label>{l}</label><input className="form-input" type={t||'text'} value={form[n]} onChange={e=>setForm({...form,[n]:e.target.value})}/></div>;

  return (
    <>
      <div className="page-header">
        <div><h1>Licenses</h1><p>{data.length} licenses</p></div>
        <button className="btn btn-primary" onClick={openCreate}><i className="fa-solid fa-plus"></i> Add License</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          {loading ? <div className="loading"><div className="spinner"></div></div> :
          <table><thead><tr><th>Software</th><th>Vendor</th><th>Seats</th><th>Used</th><th>Utilization</th><th>Cost</th><th>Expiry</th><th>Status</th><th style={{width:100}}>Actions</th></tr></thead><tbody>
            {data.map(l=>{
              const pct = l.seats?Math.round(l.assigned/l.seats*100):0;
              return (
                <tr key={l.id}>
                  <td style={{fontWeight:500}}>{l.name}</td>
                  <td>{l.vendor||'—'}</td>
                  <td>{l.seats}</td>
                  <td>{l.assigned}</td>
                  <td><div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{background:'var(--gn-border-light)',borderRadius:3,height:6,width:80,overflow:'hidden'}}><div style={{background:pct>90?'var(--gn-danger)':pct>70?'var(--gn-warning)':'var(--gn-accent)',height:'100%',width:pct+'%'}}></div></div>
                    <span className="text-sm">{pct}%</span>
                  </div></td>
                  <td className="text-right">{l.cost?'$'+Number(l.cost).toLocaleString():'—'}</td>
                  <td className="text-sm">{l.expiry||'—'}</td>
                  <td>{stb(l.status)}</td>
                  <td>
                    <div style={{display:'flex',gap:4}}>
                      <button className="btn btn-sm btn-secondary" onClick={()=>openEdit(l)}><i className="fa-solid fa-pen"></i></button>
                      <button className="btn btn-sm btn-danger" onClick={()=>setDeleting(l)}><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody></table>}
        </div>
      </div>

      {showForm && <Modal title={editing?'Edit License':'Add License'} onClose={()=>setShowForm(false)}
        footer={<><button className="btn btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':editing?'Update':'Add'}</button></>}>
        {F('Software Name *','name')}
        <div className="form-row">{F('Vendor','vendor')}{F('Total Seats','seats','number')}</div>
        <div className="form-row">{F('Assigned Seats','assigned','number')}{F('Annual Cost ($)','cost','number')}</div>
        <div className="form-row">
          {F('Expiry Date','expiry','date')}
          <div className="form-group"><label>Status</label><select className="form-input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
            <option value="active">Active</option><option value="expiring">Expiring</option><option value="expired">Expired</option><option value="cancelled">Cancelled</option>
          </select></div>
        </div>
        {F('License Key','license_key')}
        <div className="form-group"><label>Notes</label><textarea className="form-input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2}/></div>
      </Modal>}

      {deleting && <Modal title="Delete License" onClose={()=>setDeleting(null)}
        footer={<><button className="btn btn-secondary" onClick={()=>setDeleting(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}><i className="fa-solid fa-trash"></i> Delete</button></>}>
        <p>Delete <strong>{deleting.name}</strong>?</p>
      </Modal>}
    </>
  );
}
