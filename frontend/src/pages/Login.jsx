import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@globalneochain.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach server. Is the backend running on port 3001?');
      } else {
        setError(err.response?.data?.error || 'Login failed');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">GN</div>
          <div>
            <div style={{ fontWeight:700, fontSize:18 }}>Global Neochain</div>
            <div style={{ fontSize:11, color:'var(--gn-text-muted)' }}>Asset Management Platform</div>
          </div>
        </div>
        <h1>Welcome back</h1>
        <p>Sign in to manage your assets</p>
        {error && <div className="login-error"><i className="fa-solid fa-circle-exclamation"></i> {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width:'100%', justifyContent:'center', padding:'11px', marginTop:8, fontSize:14 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:20, fontSize:12, color:'var(--gn-text-muted)' }}>
          Demo: admin@globalneochain.com / admin123
        </p>
      </div>
    </div>
  );
}
