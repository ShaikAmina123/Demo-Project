import { useState, useEffect } from 'react';
import { users } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';

const roleBadge = (r) => { const m={admin:'red',manager:'orange',user:'blue',viewer:'gray'}; return <span className={`badge ${m[r]||'gray'}`}>{r}</span>; };
const stb = (s) => { const m={active:'green',inactive:'gray',suspended:'red'}; return <span className={`badge ${m[s]||'gray'}`}>{s}</span>; };
const empty = { name:'',email:'',password:'Welcome123!',role:'user',dept:'',phone:'',status:'active' };

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({...empty});
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const load = () => { users.list({search:search||undefined}).then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[search]);

  const openCreate = () => { setEditing(null); setForm({...empty}); setShowForm(true); };
  const openEdit = (u) => {
    setEditing(u);
    setForm({ name:u.name||'',email:u.email||'',password:'',role:u.role||'user',dept:u.dept||'',phone:u.phone||'',status:u.status||'active' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name||!form.email) return toast?.('Name & email required','error');
    setSaving(true);
    try {
      const payload = {...form};
      if (editing && !payload.password) delete payload.password; // don't send empty password on edit
      if (editing) { await users.update(editing.id, payload); toast?.('User updated!'); }
      else { await users.create(payload); toast?.('User created!'); }
      setShowForm(false); load();
    } catch(e) { toast?.(e.response?.data?.error||'Failed','error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (deleting.id === currentUser?.id) return toast?.("You can't delete yourself",'error');
    try { await users.delete(deleting.id); toast?.('User deleted'); setDeleting(null); load(); }
    catch(e) { toast?.(e.response?.data?.error||'Failed','error'); }
  };

  const F = (l,n,t) => <div className="form-group"><label>{l}</label><input className="form-input" type={t||'text'} value={form[n]} onChange={e=>setForm({...form,[n]:e.target.value})}/></div>;

  return (
    <>
      <div className="page-header">
        <div><h1>Users & Access</h1><p>{data.length} users</p></div>
        <button className="btn btn-primary" onClick={openCreate}><i className="fa-solid fa-plus"></i> Add User</button>
      </div>
      <div className="card">
        <div className="toolbar">
          <div className="toolbar-search"><i className="fa-solid fa-magnifying-glass"></i><input placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
        </div>
        <div className="table-wrap">
          {loading ? <div className="loading"><div className="spinner"></div></div> :
          <table><thead><tr><th></th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Phone</th><th>Status</th><th>Last Login</th><th style={{width:100}}>Actions</th></tr></thead><tbody>
            {data.map(u=>(
              <tr key={u.id}>
                <td><div className="avatar" style={{width:30,height:30,fontSize:11}}>{u.name?.split(' ').map(n=>n[0]).join('')}</div></td>
                <td style={{fontWeight:500}}>{u.name} {u.id===currentUser?.id && <span className="text-sm text-muted">(you)</span>}</td>
                <td className="text-sm">{u.email}</td>
                <td>{roleBadge(u.role)}</td>
                <td>{u.dept||'—'}</td>
                <td className="text-sm">{u.phone||'—'}</td>
                <td>{stb(u.status)}</td>
                <td className="text-sm text-muted">{u.last_login?new Date(u.last_login).toLocaleString():'Never'}</td>
                <td>
                  <div style={{display:'flex',gap:4}}>
                    <button className="btn btn-sm btn-secondary" onClick={()=>openEdit(u)}><i className="fa-solid fa-pen"></i></button>
                    {u.id!==currentUser?.id && <button className="btn btn-sm btn-danger" onClick={()=>setDeleting(u)}><i className="fa-solid fa-trash"></i></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table>}
        </div>
      </div>

      {showForm && <Modal title={editing?'Edit User':'Add User'} onClose={()=>setShowForm(false)}
        footer={<><button className="btn btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':editing?'Update':'Create User'}</button></>}>
        <div className="form-row">{F('Full Name *','name')}{F('Email *','email','email')}</div>
        <div className="form-row">
          <div className="form-group"><label>Role</label><select className="form-input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            <option value="admin">Admin</option><option value="manager">Manager</option><option value="user">User</option><option value="viewer">Viewer</option>
          </select></div>
          <div className="form-group"><label>Department</label><input className="form-input" value={form.dept} onChange={e=>setForm({...form,dept:e.target.value})}/></div>
        </div>
        <div className="form-row">
          {F('Phone','phone','tel')}
          {editing ? (
            <div className="form-group"><label>Status</label><select className="form-input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              <option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option>
            </select></div>
          ) : <div></div>}
        </div>
        <div className="form-group">
          <label>{editing ? 'New Password (leave blank to keep current)' : 'Temporary Password'}</label>
          <input className="form-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder={editing?'Leave blank to keep current':'Welcome123!'} />
        </div>
      </Modal>}

      {deleting && <Modal title="Delete User" onClose={()=>setDeleting(null)}
        footer={<><button className="btn btn-secondary" onClick={()=>setDeleting(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}><i className="fa-solid fa-trash"></i> Delete</button></>}>
        <p>Delete <strong>{deleting.name}</strong> ({deleting.email})?</p>
        <p style={{color:'var(--gn-text-muted)',marginTop:8,fontSize:13}}>This will remove their access to the platform.</p>
      </Modal>}
    </>
  );
}
