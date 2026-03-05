import { useState, useEffect } from 'react';
import { checkouts, assets as assetsApi } from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';

const stb = (s) => { const m={active:'blue',overdue:'red',returned:'green'}; return <span className={`badge ${m[s]||'gray'}`}>{(s||'').replace(/_/g,' ')}</span>; };

export default function CheckInOut() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCheckin, setShowCheckin] = useState(null);
  const [form, setForm] = useState({ asset_id:'', checked_out_to:'', due_date:'', location:'', notes:'' });
  const [checkinNote, setCheckinNote] = useState('');
  const [checkinCondition, setCheckinCondition] = useState('good');
  const [allAssets, setAllAssets] = useState([]);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = () => { checkouts.list({status:tab||undefined}).then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[tab]);

  const openCheckout = async () => {
    try { const r = await assetsApi.list({status:'active',limit:100}); setAllAssets(r.data.data||[]); } catch(e){}
    setForm({ asset_id:'', checked_out_to:'', due_date:'', location:'', notes:'' });
    setShowCheckout(true);
  };

  const handleCheckout = async () => {
    if (!form.asset_id) return toast?.('Select an asset','error');
    setSaving(true);
    try { await checkouts.create(form); toast?.('Asset checked out!'); setShowCheckout(false); load(); }
    catch(e) { toast?.(e.response?.data?.error||'Failed','error'); }
    finally { setSaving(false); }
  };

  const handleCheckin = async () => {
    setSaving(true);
    try { await checkouts.checkin(showCheckin.id, { condition_in:checkinCondition, notes:checkinNote }); toast?.('Asset checked in!'); setShowCheckin(null); load(); }
    catch(e) { toast?.(e.response?.data?.error||'Failed','error'); }
    finally { setSaving(false); }
  };

  const tabs = [['','All'],['active','Active'],['overdue','Overdue'],['returned','History']];

  return (
    <>
      <div className="page-header">
        <div><h1>Check-In / Out</h1><p>{data.length} records</p></div>
        <button className="btn btn-primary" onClick={openCheckout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Check Out Asset</button>
      </div>
      <div className="card">
        <div className="tabs">{tabs.map(([v,l])=><div key={v} className={`tab ${tab===v?'active':''}`} onClick={()=>setTab(v)}>{l}</div>)}</div>
        <div className="table-wrap">
          {loading ? <div className="loading"><div className="spinner"></div></div> :
          <table><thead><tr><th>Asset</th><th>Checked Out To</th><th>Date</th><th>Due</th><th>Returned</th><th>Status</th><th>Cond. Out</th><th>Cond. In</th><th style={{width:100}}>Action</th></tr></thead><tbody>
            {data.length===0 ? <tr><td colSpan={9} style={{textAlign:'center',padding:40,color:'var(--gn-text-muted)'}}>No records</td></tr> :
            data.map(c=>(
              <tr key={c.id}>
                <td style={{fontWeight:500}}>{c.Asset?.name||'—'}</td>
                <td>{c.checkedOutTo?.name||'—'}</td>
                <td className="text-sm">{c.checkout_date?new Date(c.checkout_date).toLocaleDateString():'—'}</td>
                <td className="text-sm">{c.due_date||'—'}</td>
                <td className="text-sm">{c.return_date?new Date(c.return_date).toLocaleDateString():'—'}</td>
                <td>{stb(c.status)}</td>
                <td className="text-sm">{c.condition_out||'—'}</td>
                <td className="text-sm">{c.condition_in||'—'}</td>
                <td>
                  {c.status!=='returned' && (
                    <button className={`btn btn-sm ${c.status==='overdue'?'btn-danger':'btn-primary'}`} onClick={()=>{setShowCheckin(c);setCheckinCondition('good');setCheckinNote('');}}>
                      <i className="fa-solid fa-arrow-right-to-bracket"></i> Check In
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody></table>}
        </div>
      </div>

      {showCheckout && <Modal title="Check Out Asset" onClose={()=>setShowCheckout(false)}
        footer={<><button className="btn btn-secondary" onClick={()=>setShowCheckout(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCheckout} disabled={saving}>{saving?'Saving...':'Check Out'}</button></>}>
        <div className="form-group"><label>Asset *</label>
          <select className="form-input" value={form.asset_id} onChange={e=>setForm({...form,asset_id:e.target.value})}>
            <option value="">— Select Asset —</option>
            {allAssets.map(a=><option key={a.id} value={a.id}>{a.asset_tag} — {a.name}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Due Date</label><input className="form-input" type="date" value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})}/></div>
          <div className="form-group"><label>Location</label><input className="form-input" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
        </div>
        <div className="form-group"><label>Notes</label><textarea className="form-input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2}/></div>
      </Modal>}

      {showCheckin && <Modal title="Check In Asset" onClose={()=>setShowCheckin(null)}
        footer={<><button className="btn btn-secondary" onClick={()=>setShowCheckin(null)}>Cancel</button><button className="btn btn-primary" onClick={handleCheckin} disabled={saving}>{saving?'Saving...':'Check In'}</button></>}>
        <p style={{marginBottom:16}}>Returning: <strong>{showCheckin.Asset?.name}</strong></p>
        <div className="form-group"><label>Condition on Return</label>
          <select className="form-input" value={checkinCondition} onChange={e=>setCheckinCondition(e.target.value)}>
            <option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option>
          </select>
        </div>
        <div className="form-group"><label>Notes</label><textarea className="form-input" value={checkinNote} onChange={e=>setCheckinNote(e.target.value)} rows={2} placeholder="Any damage or issues?"/></div>
      </Modal>}
    </>
  );
}
