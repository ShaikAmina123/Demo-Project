import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAV = [
  { section: 'Main' },
  { id: '/', label: 'Dashboard', icon: 'fa-gauge-high', exact: true },
  { id: '/notifications', label: 'Notifications', icon: 'fa-bell', badge: 5 },
  { section: 'Assets' },
  { id: '/assets', label: 'All Assets', icon: 'fa-boxes-stacked' },
  { id: '/asset-groups', label: 'Asset Groups', icon: 'fa-layer-group' },
  { id: '/barcodes', label: 'Barcode Generator', icon: 'fa-barcode' },
  { id: '/depreciation', label: 'Depreciation', icon: 'fa-chart-line' },
  { section: 'Operations' },
  { id: '/work-orders', label: 'Work Orders', icon: 'fa-wrench' },
  { id: '/maintenance', label: 'Maintenance', icon: 'fa-calendar-check' },
  { id: '/check-in-out', label: 'Check-In / Out', icon: 'fa-arrow-right-arrow-left' },
  { id: '/audits', label: 'Audits', icon: 'fa-clipboard-check' },
  { section: 'Resources' },
  { id: '/documents', label: 'Documents', icon: 'fa-folder-open' },
  { id: '/media', label: 'Media Library', icon: 'fa-photo-film' },
  { id: '/forms', label: 'Predefined Forms', icon: 'fa-file-lines' },
  { id: '/reports', label: 'Reports', icon: 'fa-chart-bar' },
  { section: 'Administration' },
  { id: '/licenses', label: 'Licenses', icon: 'fa-file-contract' },
  { id: '/users', label: 'Users & Access', icon: 'fa-users-gear' },
  { section: 'Settings' },
  { id: '/settings/company', label: 'Company Settings', icon: 'fa-building' },
  { id: '/settings/groups', label: 'Group Settings', icon: 'fa-sliders' },
  { id: '/settings/user-templates', label: 'User Templates', icon: 'fa-id-card' },
  { id: '/settings/notifications', label: 'Notification Rules', icon: 'fa-bell-concierge' },
  { id: '/settings/automated-reports', label: 'Automated Reports', icon: 'fa-robot' },
  { id: '/settings/change-logs', label: 'Change Logs', icon: 'fa-clock-rotate-left' },
  { id: '/settings/api', label: 'API Config', icon: 'fa-code' },
  { id: '/settings/integrations', label: 'Integrations', icon: 'fa-puzzle-piece' },
  { section: 'Help' },
  { id: '/support', label: 'Support', icon: 'fa-life-ring' },
  { id: '/tutorials', label: 'Tutorials', icon: 'fa-graduation-cap' },
];

export default function Layout() {
  const [mobOpen, setMobOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.id;
    return location.pathname === item.id || location.pathname.startsWith(item.id + '/');
  };

  const handleNav = (path) => {
    navigate(path);
    setMobOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="layout">
      <div className={`mob-overlay ${mobOpen ? 'show' : ''}`} onClick={() => setMobOpen(false)} />

      <aside className={`sidebar ${mobOpen ? 'open' : ''}`}>
        <div className="sidebar-brand" onClick={() => handleNav('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">GN</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span className="brand-name">Global Neochain</span>
            <span className="brand-sub">Asset Platform</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item, i) =>
            item.section ? (
              <div key={`s-${i}`} className="nav-section">{item.section}</div>
            ) : (
              <div
                key={item.id}
                className={`nav-item ${isActive(item) ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleNav(item.id)}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    marginLeft: 'auto', background: 'var(--gn-danger)', color: '#fff',
                    fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10,
                    minWidth: 18, textAlign: 'center'
                  }}>{item.badge}</span>
                )}
              </div>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{initials}</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{user?.role} &bull; {user?.dept}</div>
            </div>
            <button className="btn-ghost" onClick={handleLogout} title="Logout"
              style={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer', background: 'none', border: 'none', padding: 6, borderRadius: 4 }}>
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      <header className="topbar">
        <div className="topbar-left">
          <button className="mob-toggle" onClick={() => setMobOpen(!mobOpen)} style={{ cursor: 'pointer' }}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <div className="topbar-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input placeholder="Search assets, work orders..." />
          </div>
        </div>
        <div className="topbar-right">
          <button className="btn-ghost" title="Notifications" onClick={() => handleNav('/notifications')} style={{ cursor: 'pointer', position: 'relative' }}>
            <i className="fa-solid fa-bell"></i>
            <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: 'var(--gn-danger)', borderRadius: '50%', border: '2px solid var(--gn-surface)' }}></span>
          </button>
          <button className="btn-ghost" title="Settings" onClick={() => handleNav('/settings/company')} style={{ cursor: 'pointer' }}>
            <i className="fa-solid fa-gear"></i>
          </button>
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 11 }}>{initials}</div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
