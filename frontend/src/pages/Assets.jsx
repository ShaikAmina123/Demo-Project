import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';

const stb = (s) => { const m={active:'green',available:'blue',maintenance:'orange',checked_out:'purple',retired:'gray',disposed:'red',excellent:'green',good:'blue',fair:'orange',poor:'red'}; return <span className={`badge ${m[s]||'gray'}`}>{(s||'').replace(/_/g,' ')}</span>; };
const empty = { asset_tag:'',name:'',serial:'',make:'',model:'',category:'',subcategory:'assets',status:'active',condition_val:'good',location:'',department:'',purchase_cost:'',purchase_date:'',warranty_exp:'',vendor:'',po_number:'',invoice:'',notes:'' };

export default function Assets() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({...empty});
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();
  const toast = useToast();

  const load = () => {
    setLoading(true);
    assets.list({ search, status:statusFilter, limit:100 }).then(r=>setData(r.data.data||[])).catch(()=>toast?.('Failed to load','error')).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[search,statusFilter]);

  const openCreate = () => { setEditing(null); setForm({...empty}); setShowForm(true); };
  const openEdit = (e,a) => {
    e.stopPropagation();
    setEditing(a);
    setForm({ asset_tag:a.asset_tag||'',name:a.name||'',serial:a.serial||'',make:a.make||'',model:a.model||'',category:a.category||'',subcategory:a.subcategory||'assets',status:a.status||'active',condition_val:a.condition_val||'good',location:a.location||'',department:a.department||'',purchase_cost:a.purchase_cost||'',purchase_date:a.purchase_date||'',warranty_exp:a.warranty_exp||'',vendor:a.vendor||'',po_number:a.po_number||'',invoice:a.invoice||'',notes:a.notes||'' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.asset_tag||!form.name) return toast?.('Tag and Name required','error');
    setSaving(true);
    try {
      if (editing) { await assets.update(editing.id, form); toast?.('Asset updated!'); }
      else { await assets.create(form); toast?.('Asset created!'); }
      setShowForm(false); load();
    } catch(err) { toast?.(err.response?.data?.error||'Failed','error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await assets.delete(deleting.id); toast?.('Asset deleted'); setDeleting(null); load(); }
    catch(err) { toast?.(err.response?.data?.error||'Failed','error'); }
  };

  const subcats = [{v:'assets',l:'IT Equipment'},{v:'monitors',l:'Monitors'},{v:'network',l:'Network'},{v:'printers',l:'Printers'},{v:'vehicles',l:'Vehicles'},{v:'heavy-eq',l:'Heavy Equipment'},{v:'hvac',l:'HVAC / Facilities'},{v:'furniture',l:'Furniture'},{v:'consumables',l:'Consumables'},{v:'spares',l:'Spare Parts'}];
  const statuses = ['active','available','maintenance','checked_out','retired','disposed'];
  const conditions = ['excellent','good','fair','poor'];
  const F = (label,name,type) => <div className="form-group"><label>{label}</label><input className="form-input" type={type||'text'} value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})} /></div>;
  const S = (label,name,opts) => <div className="form-group"><label>{label}</label><select className="form-input" value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})}>{opts.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}</select></div>;

  return (
    <>
      <div className="page-header">
        <div><h1>Assets</h1><p>{data.length} total assets</p></div>
        <button className="btn btn-primary" onClick={openCreate}><i className="fa-solid fa-plus"></i> New Asset</button>
      </div>
      <div className="card">
        <div className="toolbar">
          <div className="toolbar-search"><i className="fa-solid fa-magnifying-glass"></i><input placeholder="Search name, tag, serial..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
          {['',  ...statuses.slice(0,5)].map(s=><span key={s} className={`filter-chip ${statusFilter===s?'active':''}`} onClick={()=>setStatusFilter(s)}>{s||'All'}</span>)}
        </div>
        <div className="table-wrap">
          {loading ? <div className="loading"><div className="spinner"></div></div> :
          <table><thead><tr><th>Tag</th><th>Name</th><th>Serial</th><th>Make</th><th>Status</th><th>Location</th><th>Cost</th><th>Condition</th><th style={{width:100}}>Actions</th></tr></thead><tbody>
            {data.length===0 ? <tr><td colSpan={9} style={{textAlign:'center',padding:40,color:'var(--gn-text-muted)'}}>No assets found</td></tr> :
            data.map(a=>(
              <tr key={a.id} style={{cursor:'pointer'}} onClick={()=>nav(`/assets/${a.id}`)}>
                <td className="font-mono text-sm" style={{color:'var(--gn-accent)',fontWeight:600}}>{a.asset_tag}</td>
                <td style={{fontWeight:500}}>{a.name}</td>
                <td className="text-muted text-sm">{a.serial||'—'}</td>
                <td>{a.make||'—'}</td>
                <td>{stb(a.status)}</td>
                <td className="text-sm">{a.location||'—'}</td>
                <td className="text-right">{a.purchase_cost?'$'+Number(a.purchase_cost).toLocaleString():'—'}</td>
                <td>{stb(a.condition_val)}</td>
                <td onClick={e=>e.stopPropagation()}>
                  <div style={{display:'flex',gap:4}}>
                    <button className="btn btn-sm btn-secondary" onClick={e=>openEdit(e,a)} title="Edit"><i className="fa-solid fa-pen"></i></button>
                    <button className="btn btn-sm btn-danger" onClick={()=>setDeleting(a)} title="Delete"><i className="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table>}
        </div>
      </div>

      {showForm && <Modal title={editing?'Edit Asset':'Create Asset'} large onClose={()=>setShowForm(false)}
        footer={<><button className="btn btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':editing?'Update':'Create'}</button></>}>
        <div className="form-row">{F('Asset Tag *','asset_tag')}{F('Name *','name')}</div>
        <div className="form-row">{F('Serial','serial')}{F('Make','make')}</div>
        <div className="form-row">{F('Model','model')}{F('Category','category')}</div>
        <div className="form-row">{S('Subcategory','subcategory',subcats)}{S('Status','status',statuses)}</div>
        <div className="form-row">{S('Condition','condition_val',conditions)}{F('Location','location')}</div>
        <div className="form-row">{F('Department','department')}{F('Vendor','vendor')}</div>
        <div className="form-row">{F('Purchase Cost ($)','purchase_cost','number')}{F('Purchase Date','purchase_date','date')}</div>
        <div className="form-row">{F('Warranty Expiry','warranty_exp','date')}{F('PO Number','po_number')}</div>
        <div className="form-group"><label>Notes</label><textarea className="form-input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3}/></div>
      </Modal>}

      {deleting && <Modal title="Delete Asset" onClose={()=>setDeleting(null)}
        footer={<><button className="btn btn-secondary" onClick={()=>setDeleting(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}><i className="fa-solid fa-trash"></i> Delete</button></>}>
        <p>Are you sure you want to delete <strong>{deleting.name}</strong> ({deleting.asset_tag})?</p>
        <p style={{color:'var(--gn-text-muted)',marginTop:8,fontSize:13}}>This action can be undone by an administrator.</p>
      </Modal>}
    </>
  );
}
