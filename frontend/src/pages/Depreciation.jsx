import { useState } from 'react';

const ASSETS_DEPRECIATION = [
  { id: 1, tag: 'GN-00001', name: 'Dell XPS 15 9530', group: 'IT Equipment', purchaseDate: '2024-06-15', purchaseCost: 2499, salvage: 250, usefulLife: 5, method: 'straight-line' },
  { id: 2, tag: 'GN-00010', name: 'HP EliteDisplay E273', group: 'IT Equipment', purchaseDate: '2024-03-20', purchaseCost: 449, salvage: 50, usefulLife: 5, method: 'straight-line' },
  { id: 3, tag: 'GN-00340', name: 'Carrier HVAC Unit A', group: 'Facilities', purchaseDate: '2022-01-10', purchaseCost: 28000, salvage: 3000, usefulLife: 15, method: 'straight-line' },
  { id: 4, tag: 'GN-00410', name: 'Caterpillar C15 Generator #1', group: 'Fleet', purchaseDate: '2021-07-01', purchaseCost: 85000, salvage: 10000, usefulLife: 20, method: 'straight-line' },
  { id: 5, tag: 'GN-00440', name: 'Toyota Forklift 8FGU25', group: 'Fleet', purchaseDate: '2023-09-01', purchaseCost: 32000, salvage: 5000, usefulLife: 10, method: 'declining-balance' },
  { id: 6, tag: 'GN-00480', name: 'Toyota Hilux 2025', group: 'Fleet', purchaseDate: '2025-01-15', purchaseCost: 45000, salvage: 12000, usefulLife: 8, method: 'declining-balance' },
  { id: 7, tag: 'GN-00120', name: 'Cisco SG350 Switch', group: 'IT Equipment', purchaseDate: '2023-06-01', purchaseCost: 1200, salvage: 100, usefulLife: 7, method: 'straight-line' },
  { id: 8, tag: 'GN-00350', name: 'Herman Miller Aeron Chairs (x20)', group: 'Facilities', purchaseDate: '2023-03-15', purchaseCost: 28000, salvage: 4000, usefulLife: 12, method: 'straight-line' },
  { id: 9, tag: 'GN-00355', name: 'Elevator System - Shaft B', group: 'Facilities', purchaseDate: '2019-06-01', purchaseCost: 120000, salvage: 15000, usefulLife: 25, method: 'straight-line' },
  { id: 10, tag: 'GN-00399', name: 'Epson Projector X41', group: 'IT Equipment', purchaseDate: '2024-01-10', purchaseCost: 1899, salvage: 200, usefulLife: 5, method: 'straight-line' },
];

function calcDepreciation(asset) {
  const now = new Date('2026-02-26');
  const purchased = new Date(asset.purchaseDate);
  const yearsElapsed = Math.max(0, (now - purchased) / (365.25 * 24 * 60 * 60 * 1000));
  const depreciableAmount = asset.purchaseCost - asset.salvage;

  let accumulated, annual;
  if (asset.method === 'straight-line') {
    annual = depreciableAmount / asset.usefulLife;
    accumulated = Math.min(depreciableAmount, annual * yearsElapsed);
  } else {
    // Double declining balance
    const rate = 2 / asset.usefulLife;
    accumulated = 0;
    let bookVal = asset.purchaseCost;
    for (let y = 0; y < Math.floor(yearsElapsed); y++) {
      const dep = Math.max(0, bookVal * rate);
      if (bookVal - dep < asset.salvage) { accumulated += bookVal - asset.salvage; bookVal = asset.salvage; break; }
      accumulated += dep; bookVal -= dep;
    }
    // Partial year
    const partial = yearsElapsed - Math.floor(yearsElapsed);
    if (bookVal > asset.salvage) {
      const partialDep = Math.min(bookVal * rate * partial, bookVal - asset.salvage);
      accumulated += partialDep;
    }
    annual = asset.purchaseCost * (2 / asset.usefulLife);
  }

  const bookValue = Math.max(asset.salvage, asset.purchaseCost - accumulated);
  const pctDepreciated = (accumulated / depreciableAmount) * 100;
  const remainingLife = Math.max(0, asset.usefulLife - yearsElapsed);

  return { accumulated, bookValue, annual, pctDepreciated: Math.min(100, pctDepreciated), remainingLife, yearsElapsed };
}

const money = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function Depreciation() {
  const [filter, setFilter] = useState('all');
  const [method, setMethod] = useState('all');
  const [detail, setDetail] = useState(null);

  const data = ASSETS_DEPRECIATION.map(a => ({ ...a, calc: calcDepreciation(a) }));

  const filtered = data.filter(a => {
    if (filter !== 'all' && a.group !== filter) return false;
    if (method !== 'all' && a.method !== method) return false;
    return true;
  });

  const totalOriginal = data.reduce((s, a) => s + a.purchaseCost, 0);
  const totalAccum = data.reduce((s, a) => s + a.calc.accumulated, 0);
  const totalBook = data.reduce((s, a) => s + a.calc.bookValue, 0);
  const fullyDepreciated = data.filter(a => a.calc.pctDepreciated >= 99).length;

  return (
    <>
      <div className="page-header">
        <div><h1>Depreciation</h1><p>Track asset value depreciation across your portfolio</p></div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => {
            const rows = [['Asset Tag','Name','Group','Purchase Cost','Salvage','Useful Life','Method','Accumulated','Book Value','% Depreciated','Remaining Life']];
            data.forEach(a => rows.push([a.tag, a.name, a.group, a.purchaseCost, a.salvage, a.usefulLife, a.method, Math.round(a.calc.accumulated), Math.round(a.calc.bookValue), Math.round(a.calc.pctDepreciated), a.calc.remainingLife.toFixed(1)]));
            const csv = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `depreciation-schedule-${new Date().toISOString().slice(0,10)}.csv`; a.click();
            URL.revokeObjectURL(url);
          }}><i className="fa-solid fa-file-arrow-down"></i> Export Schedule</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { l: 'Original Cost', v: money(totalOriginal), icon: 'fa-receipt', color: 'blue' },
          { l: 'Accumulated Depreciation', v: money(totalAccum), icon: 'fa-chart-line', color: 'orange' },
          { l: 'Current Book Value', v: money(totalBook), icon: 'fa-sack-dollar', color: 'green' },
          { l: 'Fully Depreciated', v: `${fullyDepreciated} / ${data.length}`, icon: 'fa-circle-check', color: 'purple' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
            <div><div className="stat-label">{s.l}</div><div className="stat-value">{s.v}</div></div>
          </div>
        ))}
      </div>

      {/* Depreciation Overview Bar */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Portfolio Depreciation Overview</h3>
        <div style={{ display: 'flex', height: 28, borderRadius: 8, overflow: 'hidden', background: 'var(--gn-surface-alt)' }}>
          <div style={{ width: `${(totalAccum / totalOriginal) * 100}%`, background: '#F59E0B', transition: 'width 0.6s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff' }}>
            {Math.round((totalAccum / totalOriginal) * 100)}% Depreciated
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--gn-text-muted)' }}>
            {Math.round((totalBook / totalOriginal) * 100)}% Book Value
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 10, fontSize: 12, color: 'var(--gn-text-muted)' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: '#F59E0B', marginRight: 4 }}></span>Depreciated: {money(totalAccum)}</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: 'var(--gn-surface-alt)', border: '1px solid var(--gn-border)', marginRight: 4 }}></span>Book Value: {money(totalBook)}</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['all', 'All Groups'], ['IT Equipment', 'IT'], ['Facilities', 'Facilities'], ['Fleet', 'Fleet']].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${filter === k ? 'var(--gn-accent)' : 'var(--gn-border)'}`,
              background: filter === k ? 'rgba(79,107,237,0.08)' : 'var(--gn-surface)',
              color: filter === k ? 'var(--gn-accent)' : 'var(--gn-text-secondary)'
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['all', 'All Methods'], ['straight-line', 'Straight-Line'], ['declining-balance', 'Declining Balance']].map(([k, l]) => (
            <button key={k} onClick={() => setMethod(k)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${method === k ? '#8B5CF6' : 'var(--gn-border)'}`,
              background: method === k ? '#8B5CF610' : 'var(--gn-surface)',
              color: method === k ? '#8B5CF6' : 'var(--gn-text-secondary)'
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap"><table><thead><tr>
          <th>Asset</th><th>Purchase Cost</th><th>Salvage</th><th>Life (yr)</th><th>Method</th><th>Accumulated</th><th>Book Value</th><th>% Depreciated</th><th>Remaining</th>
        </tr></thead><tbody>
          {filtered.map(a => (
            <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => setDetail(a)}>
              <td><div><div style={{ fontWeight: 500, fontSize: 13 }}>{a.name}</div><div className="font-mono text-sm" style={{ color: 'var(--gn-text-muted)' }}>{a.tag}</div></div></td>
              <td className="text-sm">{money(a.purchaseCost)}</td>
              <td className="text-sm">{money(a.salvage)}</td>
              <td className="text-sm">{a.usefulLife}</td>
              <td><span className={`badge ${a.method === 'straight-line' ? 'blue' : 'purple'}`}>{a.method === 'straight-line' ? 'SL' : 'DB'}</span></td>
              <td className="text-sm" style={{ color: '#F59E0B', fontWeight: 600 }}>{money(a.calc.accumulated)}</td>
              <td className="text-sm" style={{ fontWeight: 600 }}>{money(a.calc.bookValue)}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--gn-surface-alt)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${a.calc.pctDepreciated}%`, height: '100%', borderRadius: 3,
                      background: a.calc.pctDepreciated > 80 ? '#EF4444' : a.calc.pctDepreciated > 50 ? '#F59E0B' : '#10B981'
                    }}></div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, width: 36 }}>{Math.round(a.calc.pctDepreciated)}%</span>
                </div>
              </td>
              <td className="text-sm">{a.calc.remainingLife.toFixed(1)} yr</td>
            </tr>
          ))}
        </tbody></table></div>
      </div>

      {/* Detail Modal with year-by-year schedule */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div className="modal-header"><h2>Depreciation Schedule</h2><button className="modal-close" onClick={() => setDetail(null)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{detail.name}</div>
                  <div className="font-mono text-sm" style={{ color: 'var(--gn-text-muted)' }}>{detail.tag} &bull; {detail.group}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                {[['Purchase Cost', money(detail.purchaseCost)], ['Salvage Value', money(detail.salvage)], ['Useful Life', `${detail.usefulLife} years`],
                  ['Method', detail.method === 'straight-line' ? 'Straight-Line' : 'Declining Balance'], ['Purchase Date', detail.purchaseDate], ['Annual Depr.', money(detail.calc.annual)]
                ].map(([l, v], i) => (
                  <div key={i} style={{ padding: 10, background: 'var(--gn-surface-alt)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--gn-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Year-by-year table */}
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Year-by-Year Schedule</h3>
              <div className="table-wrap"><table><thead><tr><th>Year</th><th>Opening Value</th><th>Depreciation</th><th>Closing Value</th></tr></thead><tbody>
                {(() => {
                  const rows = [];
                  let bookVal = detail.purchaseCost;
                  const rate = detail.method === 'straight-line' ? (detail.purchaseCost - detail.salvage) / detail.usefulLife : 2 / detail.usefulLife;
                  const startYear = new Date(detail.purchaseDate).getFullYear();
                  for (let y = 0; y < Math.min(detail.usefulLife, 10); y++) {
                    const opening = bookVal;
                    let dep;
                    if (detail.method === 'straight-line') {
                      dep = rate;
                    } else {
                      dep = bookVal * rate;
                    }
                    if (bookVal - dep < detail.salvage) dep = bookVal - detail.salvage;
                    if (dep < 0) dep = 0;
                    bookVal -= dep;
                    rows.push(
                      <tr key={y} style={{ background: startYear + y === 2026 ? 'rgba(79,107,237,0.04)' : undefined }}>
                        <td className="font-mono text-sm" style={{ fontWeight: startYear + y === 2026 ? 700 : 400 }}>{startYear + y}{startYear + y === 2026 ? ' ←' : ''}</td>
                        <td className="text-sm">{money(opening)}</td>
                        <td className="text-sm" style={{ color: '#F59E0B' }}>{money(dep)}</td>
                        <td className="text-sm" style={{ fontWeight: 600 }}>{money(bookVal)}</td>
                      </tr>
                    );
                    if (bookVal <= detail.salvage) break;
                  }
                  return rows;
                })()}
              </tbody></table></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => {
                const rows = [['Year','Opening Value','Depreciation','Closing Value']];
                let bv = detail.purchaseCost;
                const rate = detail.method === 'straight-line' ? (detail.purchaseCost - detail.salvage) / detail.usefulLife : 2 / detail.usefulLife;
                const sy = new Date(detail.purchaseDate).getFullYear();
                for (let y = 0; y < detail.usefulLife; y++) {
                  const op = bv; let dep = detail.method === 'straight-line' ? rate : bv * rate;
                  if (bv - dep < detail.salvage) dep = bv - detail.salvage; if (dep < 0) dep = 0; bv -= dep;
                  rows.push([sy + y, Math.round(op), Math.round(dep), Math.round(bv)]);
                  if (bv <= detail.salvage) break;
                }
                const csv = rows.map(r => r.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `depreciation-${detail.tag}.csv`; a.click();
                URL.revokeObjectURL(url);
              }}><i className="fa-solid fa-file-arrow-down"></i> Export</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
