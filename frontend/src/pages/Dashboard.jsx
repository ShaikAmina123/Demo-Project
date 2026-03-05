import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboard } from '../services/api';

const stb = (s) => { const m = { active: 'green', maintenance: 'orange', checked_out: 'blue', retired: 'gray', open: 'blue', in_progress: 'orange', completed: 'green', scheduled: 'purple', overdue: 'red' }; return <span className={`badge ${m[s] || 'gray'}`}>{(s || '').replace(/_/g, ' ')}</span>; };
const prb = (p) => { const m = { urgent: 'red', high: 'orange', medium: 'blue', low: 'gray' }; return <span className={`badge ${m[p] || 'gray'}`}>{p}</span>; };
const fmt = (n) => typeof n === 'number' ? n.toLocaleString() : n;
const money = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function Donut({ segments, size = 160 }) {
  const r = size / 2 - 12, cx = size / 2, cy = size / 2;
  const total = segments.reduce((s, g) => s + g.v, 0);
  let angle = -90;
  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      {segments.map((seg, i) => {
        const pct = (seg.v / total) * 360;
        const start = angle; angle += pct;
        const s1 = (Math.PI / 180) * start, e1 = (Math.PI / 180) * (start + pct - 0.5);
        const large = pct > 180 ? 1 : 0;
        const d = `M${cx + r * Math.cos(s1)},${cy + r * Math.sin(s1)} A${r},${r} 0 ${large} 1 ${cx + r * Math.cos(e1)},${cy + r * Math.sin(e1)}`;
        return <path key={i} d={d} fill="none" stroke={seg.c} strokeWidth="20" strokeLinecap="round" />;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--gn-text)">{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="var(--gn-text-muted)">Total Assets</text>
    </svg>
  );
}

function BarChart({ data, height = 180 }) {
  const max = Math.max(...data.map(d => d.v), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 4, color: 'var(--gn-text-muted)' }}>{d.v}</div>
          <div style={{
            height: `${(d.v / max) * (height - 40)}px`, borderRadius: '4px 4px 0 0',
            background: d.current ? 'var(--gn-accent, #4F6BED)' : 'rgba(79,107,237,0.2)',
            transition: 'height 0.4s ease', minHeight: 4
          }}></div>
          <div style={{ fontSize: 10, color: 'var(--gn-text-muted)', marginTop: 4, fontWeight: d.current ? 700 : 400 }}>{d.l}</div>
        </div>
      ))}
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: 'Check In/Out', icon: 'fa-arrow-right-arrow-left', path: '/check-in-out', color: '#3B82F6' },
  { label: 'New Asset', icon: 'fa-plus-circle', path: '/assets', color: '#10B981' },
  { label: 'Work Order', icon: 'fa-wrench', path: '/work-orders', color: '#F59E0B' },
  { label: 'Run Audit', icon: 'fa-clipboard-check', path: '/audits', color: '#8B5CF6' },
  { label: 'Barcodes', icon: 'fa-barcode', path: '/barcodes', color: '#EC4899' },
  { label: 'Reports', icon: 'fa-chart-bar', path: '/reports', color: '#EF4444' },
];

const ACTIVITY = [
  { msg: 'Sarah Chen checked out Dell XPS 15 (GN-00001)', time: '2 hours ago', color: '#3B82F6', icon: 'fa-arrow-right' },
  { msg: 'WO-1087: HVAC Filter Replacement completed', time: '4 hours ago', color: '#10B981', icon: 'fa-circle-check' },
  { msg: 'New asset added: HP LaserJet Pro M404 (GN-00492)', time: '6 hours ago', color: '#8B5CF6', icon: 'fa-plus' },
  { msg: 'License expiring: Microsoft 365 E3 in 3 days', time: 'Yesterday', color: '#F59E0B', icon: 'fa-clock' },
  { msg: 'Audit completed: IT Equipment Spot Check — 97% accuracy', time: 'Yesterday', color: '#10B981', icon: 'fa-clipboard-check' },
  { msg: 'Mike Torres returned Toyota Hilux 2025 (GN-00480)', time: '2 days ago', color: '#3B82F6', icon: 'fa-arrow-left' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => { dashboard.get().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!data) return <div className="empty"><p>Failed to load dashboard</p></div>;
  const s = data.stats;

  const donutData = [
    { v: s.activeAssets || 45, c: '#10B981', l: 'Active' },
    { v: s.maintenanceAssets || 8, c: '#F59E0B', l: 'Maintenance' },
    { v: s.checkedOutAssets || 12, c: '#3B82F6', l: 'Checked Out' },
    { v: Math.max(0, (s.totalAssets || 71) - (s.activeAssets || 0) - (s.maintenanceAssets || 0) - (s.checkedOutAssets || 0)) || 6, c: '#94A3B8', l: 'Other' },
  ];

  const barData = [
    { l: 'Sep', v: 34 }, { l: 'Oct', v: 42 }, { l: 'Nov', v: 28 }, { l: 'Dec', v: 55 },
    { l: 'Jan', v: 48 }, { l: 'Feb', v: 63, current: true },
  ];

  return (
    <>
      <div className="page-header">
        <div><h1>Dashboard</h1><p>Overview of your asset management platform</p></div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => nav('/reports')}><i className="fa-solid fa-chart-bar"></i> Reports</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        {QUICK_ACTIONS.map((a, i) => (
          <div key={i} onClick={() => nav(a.path)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
            background: 'var(--gn-surface)', border: '1px solid var(--gn-border-light)', transition: 'transform 0.15s, box-shadow 0.15s'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `${a.color}15`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              <i className={`fa-solid ${a.icon}`}></i>
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon blue"><i className="fa-solid fa-boxes-stacked"></i></div><div><div className="stat-label">Total Assets</div><div className="stat-value">{fmt(s.totalAssets)}</div></div></div>
        <div className="stat-card"><div className="stat-icon green"><i className="fa-solid fa-circle-check"></i></div><div><div className="stat-label">Active</div><div className="stat-value">{fmt(s.activeAssets)}</div></div></div>
        <div className="stat-card"><div className="stat-icon orange"><i className="fa-solid fa-wrench"></i></div><div><div className="stat-label">Maintenance</div><div className="stat-value">{fmt(s.maintenanceAssets)}</div></div></div>
        <div className="stat-card"><div className="stat-icon purple"><i className="fa-solid fa-arrow-right-arrow-left"></i></div><div><div className="stat-label">Checked Out</div><div className="stat-value">{fmt(s.checkedOutAssets)}</div></div></div>
        <div className="stat-card"><div className="stat-icon red"><i className="fa-solid fa-triangle-exclamation"></i></div><div><div className="stat-label">Open WOs</div><div className="stat-value">{fmt(s.openWOs)}</div></div></div>
        <div className="stat-card"><div className="stat-icon teal"><i className="fa-solid fa-dollar-sign"></i></div><div><div className="stat-label">Total Value</div><div className="stat-value">{money(s.totalValue)}</div></div></div>
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="card-header"><h3>Asset Distribution</h3></div>
          <div style={{ padding: 20 }}>
            <Donut segments={donutData} size={170} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
              {donutData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.c }}></span>
                  <span style={{ color: 'var(--gn-text-muted)' }}>{d.l}</span>
                  <span style={{ fontWeight: 700 }}>{d.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Monthly Activity</h3></div>
          <div style={{ padding: 20 }}>
            <BarChart data={barData} height={200} />
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--gn-text-muted)' }}>Asset transactions per month</div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="card-header"><h3>Recent Assets</h3><button className="btn btn-sm btn-secondary" onClick={() => nav('/assets')}>View All</button></div>
          <div className="table-wrap"><table><thead><tr><th>Tag</th><th>Name</th><th>Status</th><th>Added</th></tr></thead><tbody>
            {(data.recentAssets || []).map(a => (
              <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => nav(`/assets/${a.id}`)}>
                <td className="font-mono text-sm">{a.asset_tag}</td><td>{a.name}</td><td>{stb(a.status)}</td>
                <td className="text-muted text-sm">{new Date(a.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Open Work Orders</h3><button className="btn btn-sm btn-secondary" onClick={() => nav('/work-orders')}>View All</button></div>
          <div className="table-wrap"><table><thead><tr><th>WO #</th><th>Title</th><th>Priority</th><th>Status</th></tr></thead><tbody>
            {(data.recentWOs || []).map(w => (
              <tr key={w.id}><td className="font-mono text-sm">{w.wo_number}</td><td>{w.title?.substring(0, 30)}</td><td>{prb(w.priority)}</td><td>{stb(w.status)}</td></tr>
            ))}
          </tbody></table></div>
        </div>
      </div>

      {/* Activity + Categories */}
      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="card-header"><h3>Recent Activity</h3></div>
          <div style={{ padding: 16 }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--gn-border-light)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: `${a.color}15`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                  <i className={`fa-solid ${a.icon}`}></i>
                </div>
                <div><div style={{ fontSize: 13, lineHeight: 1.4 }}>{a.msg}</div><div style={{ fontSize: 11, color: 'var(--gn-text-muted)', marginTop: 2 }}>{a.time}</div></div>
              </div>
            ))}
          </div>
        </div>
        {data.assetsByGroup?.length > 0 && (
          <div className="card">
            <div className="card-header"><h3>Assets by Category</h3></div>
            <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {data.assetsByGroup.map((g, i) => (
                <div key={i} style={{ background: 'var(--gn-surface-alt)', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--gn-border-light)', cursor: 'pointer' }} onClick={() => nav('/assets')}>
                  <div style={{ fontSize: 12, color: 'var(--gn-text-muted)', marginBottom: 2 }}>{(g.subcategory || 'other').replace(/-/g, ' ')}</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{g.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
