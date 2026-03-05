import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';

const stb = (s) => { const m={active:'green',available:'blue',maintenance:'orange',checked_out:'purple',retired:'gray',disposed:'red',excellent:'green',good:'blue',fair:'orange',poor:'red'}; return <span className={`badge ${m[s]||'gray'}`}>{(s||'').replace(/_/g,' ')}</span>; };

export default function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const nav = useNavigate();
  const toast = useToast();

  const load = () => { assets.get(id).then(r=>{setAsset(r.data);setForm(r.data);}).catch(()=>toast?.('Asset not found','error')).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await assets.update(id, form);
      toast?.('Asset updated!');
      setEditing(false);
      load();
    } catch(err) { toast?.(err.response?.data?.error||'Failed','error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await assets.delete(id); toast?.('Asset deleted'); nav('/assets'); }
    catch(err) { toast?.(err.response?.data?.error||'Failed','error'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!asset) return <div className="empty"><i className="fa-solid fa-box-open"></i><p>Asset not found</p></div>;

  const field = (label,val) => <div style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:600,color:'var(--gn-text-muted)',textTransform:'uppercase',letterSpacing:0.5,marginBottom:3}}>{label}</div><div style={{fontSize:14}}>{val||'—'}</div></div>;
  const editField = (label,name,type) => <div className="form-group"><label>{label}</label><input className="form-input" type={type||'text'} value={form[name]||''} onChange={e=>setForm({...form,[name]:e.target.value})} /></div>;
  const editSelect = (label,name,opts) => <div className="form-group"><label>{label}</label><select className="form-input" value={form[name]||''} onChange={e=>setForm({...form,[name]:e.target.value})}>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select></div>;

  return (
    <>
      <div className="page-header">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button className="btn btn-ghost" onClick={()=>nav('/assets')}><i className="fa-solid fa-arrow-left"></i></button>
          <div><h1>{asset.name}</h1><p className="font-mono">{asset.asset_tag}</p></div>
        </div>
        <div style={{display:'flex',gap:8}}>
          {!editing ? (
            <>
              <button className="btn btn-primary" onClick={()=>{setForm({...asset});setEditing(true);}}><i className="fa-solid fa-pen"></i> Edit</button>
              <button className="btn btn-danger" onClick={()=>setShowDelete(true)}><i className="fa-solid fa-trash"></i> Delete</button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={()=>setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save Changes'}</button>
            </>
          )}
        </div>
      </div>

      {!editing ? (
        <div className="grid-2">
          <div className="card"><div className="card-header"><h3>General</h3></div><div className="card-body"><div className="grid-2">
            {field('Asset Tag', <span className="font-mono" style={{color:'var(--gn-accent)',fontWeight:600}}>{asset.asset_tag}</span>)}
            {field('Status', stb(asset.status))}
            {field('Name', asset.name)}
            {field('Condition', stb(asset.condition_val))}
            {field('Make', asset.make)}
            {field('Model', asset.model)}
            {field('Serial', <span className="font-mono">{asset.serial}</span>)}
            {field('Category', `${asset.category||''} / ${asset.subcategory||''}`)}
          </div></div></div>
          <div className="card"><div className="card-header"><h3>Location & Assignment</h3></div><div className="card-body"><div className="grid-2">
            {field('Location', asset.location)}
            {field('Department', asset.department)}
            {field('Assigned To', asset.assignedUser?.name || 'Unassigned')}
            {field('Group', asset.AssetGroup?.name)}
          </div></div></div>
          <div className="card"><div className="card-header"><h3>Financial</h3></div><div className="card-body"><div className="grid-2">
            {field('Purchase Cost', asset.purchase_cost?'$'+Number(asset.purchase_cost).toLocaleString():'—')}
            {field('Salvage Value', asset.salvage_value?'$'+Number(asset.salvage_value).toLocaleString():'—')}
            {field('Purchase Date', asset.purchase_date)}
            {field('Useful Life', asset.useful_life_months?asset.useful_life_months+' months':'—')}
            {field('Vendor', asset.vendor)}
            {field('PO Number', asset.po_number)}
            {field('Invoice', asset.invoice)}
            {field('Warranty Exp.', asset.warranty_exp)}
          </div></div></div>
          <div className="card"><div className="card-header"><h3>Notes</h3></div><div className="card-body">
            <p style={{color:asset.notes?'var(--gn-text)':'var(--gn-text-muted)'}}>{asset.notes||'No notes'}</p>
          </div></div>
        </div>
      ) : (
        <div className="grid-2">
          <div className="card"><div className="card-header"><h3>General</h3></div><div className="card-body">
            <div className="form-row">{editField('Asset Tag','asset_tag')}{editField('Name','name')}</div>
            <div className="form-row">{editField('Serial','serial')}{editField('Make','make')}</div>
            <div className="form-row">{editField('Model','model')}{editField('Category','category')}</div>
            <div className="form-row">{editSelect('Status','status',['active','available','maintenance','checked_out','retired','disposed'])}{editSelect('Condition','condition_val',['excellent','good','fair','poor'])}</div>
          </div></div>
          <div className="card"><div className="card-header"><h3>Location & Assignment</h3></div><div className="card-body">
            <div className="form-row">{editField('Location','location')}{editField('Department','department')}</div>
          </div></div>
          <div className="card"><div className="card-header"><h3>Financial</h3></div><div className="card-body">
            <div className="form-row">{editField('Purchase Cost','purchase_cost','number')}{editField('Purchase Date','purchase_date','date')}</div>
            <div className="form-row">{editField('Warranty Expiry','warranty_exp','date')}{editField('Vendor','vendor')}</div>
            <div className="form-row">{editField('PO Number','po_number')}{editField('Invoice','invoice')}</div>
          </div></div>
          <div className="card"><div className="card-header"><h3>Notes</h3></div><div className="card-body">
            <textarea className="form-input" value={form.notes||''} onChange={e=>setForm({...form,notes:e.target.value})} rows={4}/>
          </div></div>
        </div>
      )}

      {showDelete && <Modal title="Delete Asset" onClose={()=>setShowDelete(false)}
        footer={<><button className="btn btn-secondary" onClick={()=>setShowDelete(false)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}><i className="fa-solid fa-trash"></i> Delete</button></>}>
        <p>Are you sure you want to delete <strong>{asset.name}</strong> ({asset.asset_tag})?</p>
      </Modal>}
    </>
  );
}
