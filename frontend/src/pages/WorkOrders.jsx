import { useState, useEffect } from 'react';
import { workOrders } from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';

const stb = (s) => { const m={open:'blue',in_progress:'orange',on_hold:'gray',completed:'green',cancelled:'red'}; return <span className={`badge ${m[s]||'gray'}`}>{(s||'').replace(/_/g,' ')}</span>; };
const prb = (p) => { const m={urgent:'red',high:'orange',medium:'blue',low:'gray'}; return <span className={`badge ${m[p]||'gray'}`}>{p}</span>; };
const empty = { title:'',type:'corrective',priority:'medium',status:'open',description:'',due_date:'',estimated_cost:'',parts_needed:'',notes:'' };

export default function WorkOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({...empty});
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = () => { workOrders.list({status:tab||undefined}).then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[tab]);

  const openCreate = () => { setEditing(null); setForm({...empty}); setShowForm(true); };
  const openEdit = (wo) => {
    setEditing(wo);
    setForm({ title:wo.title||'',type:wo.type||'corrective',priority:wo.priority||'medium',status:wo.status||'open',description:wo.description||'',due_date:wo.due_date||'',estimated_cost:wo.estimated_cost||'',parts_needed:wo.parts_needed||'',notes:wo.notes||'' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title) return toast?.('Title required','error');
    setSaving(true);
    try {
      if (editing) { await workOrders.update(editing.id, form); toast?.('Work order updated!'); }
      else { await workOrders.create(form); toast?.('Work order created!'); }
      setShowForm(false); load();
    } catch(e) { toast?.(e.response?.data?.error||'Failed','error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await workOrders.delete(deleting.id); toast?.('Work order deleted'); setDeleting(null); load(); }
    catch(e) { toast?.(e.response?.data?.error||'Failed','error'); }
  };

  const quickStatus = async (wo, newStatus) => {
    try { await workOrders.update(wo.id, { status: newStatus }); toast?.(`Marked ${newStatus.replace(/_/g,' ')}`); load(); }
    catch(e) { toast?.('Failed','error'); }
  };

  const tabs = [['','All'],['open','Open'],['in_progress','In Progress'],['completed','Completed'],['cancelled','Cancelled']];
  const types = ['preventive','corrective','emergency','inspection','replacement'];
  const priorities = ['low','medium','high','urgent'];
  const allStatuses = ['open','in_progress','on_hold','completed','cancelled'];
  const F = (l,n,t) => <div className="form-group"><label>{l}</label><input className="form-input" type={t||'text'} value={form[n]} onChange={e=>setForm({...form,[n]:e.target.value})}/></div>;
  const S = (l,n,o) => <div className="form-group"><label>{l}</label><select className="form-input" value={form[n]} onChange={e=>setForm({...form,[n]:e.target.value})}>{o.map(v=><option key={v} value={v}>{v.replace(/_/g,' ')}</option>)}</select></div>;

  return (
    <>
      <div className="page-header">
        <div><h1>Work Orders</h1><p>{data.length} work orders</p></div>
        <button className="btn btn-primary" onClick={openCreate}><i className="fa-solid fa-plus"></i> New Work Order</button>
      </div>
      <div className="card">
        <div className="tabs">{tabs.map(([v,l])=><div key={v} className={`tab ${tab===v?'active':''}`} onClick={()=>setTab(v)}>{l}</div>)}</div>
        <div className="table-wrap">
          {loading ? <div className="loading"><div className="spinner"></div></div> :
          <table><thead><tr><th>WO #</th><th>Title</th><th>Type</th><th>Priority</th><th>Status</th><th>Asset</th><th>Due</th><th>Est. Cost</th><th style={{width:140}}>Actions</th></tr></thead><tbody>
            {data.length===0 ? <tr><td colSpan={9} style={{textAlign:'center',padding:40,color:'var(--gn-text-muted)'}}>No work orders</td></tr> :
            data.map(w=>(
              <tr key={w.id}>
                <td className="font-mono text-sm" style={{color:'var(--gn-accent)',fontWeight:600}}>{w.wo_number}</td>
                <td style={{fontWeight:500}}>{w.title}</td>
                <td><span className="badge gray">{w.type}</span></td>
                <td>{prb(w.priority)}</td>
                <td>{stb(w.status)}</td>
                <td className="text-sm">{w.Asset?.name||'—'}</td>
                <td className="text-sm">{w.due_date||'—'}</td>
                <td className="text-right">{w.estimated_cost?'$'+Number(w.estimated_cost).toLocaleString():'—'}</td>
                <td>
                  <div style={{display:'flex',gap:4}}>
                    {w.status==='open' && <button className="btn btn-sm btn-primary" onClick={()=>quickStatus(w,'in_progress')} title="Start">▶</button>}
                    {w.status==='in_progress' && <button className="btn btn-sm btn-primary" onClick={()=>quickStatus(w,'completed')} title="Complete">✓</button>}
                    <button className="btn btn-sm btn-secondary" onClick={()=>openEdit(w)} title="Edit"><i className="fa-solid fa-pen"></i></button>
                    <button className="btn btn-sm btn-danger" onClick={()=>setDeleting(w)} title="Delete"><i className="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table>}
        </div>
      </div>

      {showForm && <Modal title={editing?'Edit Work Order':'New Work Order'} onClose={()=>setShowForm(false)}
        footer={<><button className="btn btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':editing?'Update':'Create'}</button></>}>
        {F('Title *','title')}
        <div className="form-row">{S('Type','type',types)}{S('Priority','priority',priorities)}</div>
        {editing && <div className="form-row">{S('Status','status',allStatuses)}<div></div></div>}
        <div className="form-row">{F('Due Date','due_date','date')}{F('Estimated Cost ($)','estimated_cost','number')}</div>
        <div className="form-group"><label>Parts Needed</label><input className="form-input" value={form.parts_needed} onChange={e=>setForm({...form,parts_needed:e.target.value})}/></div>
        <div className="form-group"><label>Description</label><textarea className="form-input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3}/></div>
        <div className="form-group"><label>Notes</label><textarea className="form-input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2}/></div>
      </Modal>}

      {deleting && <Modal title="Delete Work Order" onClose={()=>setDeleting(null)}
        footer={<><button className="btn btn-secondary" onClick={()=>setDeleting(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}><i className="fa-solid fa-trash"></i> Delete</button></>}>
        <p>Delete <strong>{deleting.wo_number} — {deleting.title}</strong>?</p>
      </Modal>}
    </>
  );
}
