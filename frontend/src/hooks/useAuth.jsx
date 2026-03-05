import { useState, useEffect, createContext, useContext } from 'react';
import { auth as authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gn_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gn_token');
    if (token) {
      authApi.me().then(r => {
        setUser(r.data);
        localStorage.setItem('gn_user', JSON.stringify(r.data));
      }).catch(() => {
        localStorage.removeItem('gn_token');
        localStorage.removeItem('gn_user');
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('gn_token', res.data.token);
    localStorage.setItem('gn_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('gn_token');
    localStorage.removeItem('gn_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
