import { useState, useEffect, useRef } from 'react';
import { assets as assetsApi } from '../services/api';

const LABEL_TEMPLATES = [
  { id: 'standard', name: 'Standard Label', w: 200, h: 100, desc: '2" × 1" — Asset tag + barcode + name' },
  { id: 'small', name: 'Small Tag', w: 150, h: 60, desc: '1.5" × 0.6" — Asset tag + barcode only' },
  { id: 'qr', name: 'QR Code Label', w: 150, h: 150, desc: '1.5" × 1.5" — QR code + asset tag' },
  { id: 'full', name: 'Full Detail Label', w: 250, h: 130, desc: '2.5" × 1.3" — All details + barcode' },
];

function drawBarcode(canvas, text, w, h) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = w; canvas.height = h;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
  // Simple Code128-style visual barcode
  const chars = text.split('');
  const barW = Math.max(1, Math.floor((w - 20) / (chars.length * 11 + 35)));
  let x = 10;
  ctx.fillStyle = '#000';
  // Start pattern
  [2,1,1,2,3,2].forEach(b => { ctx.fillRect(x, 8, barW * b, h - 24); x += barW * (b + 1); });
  chars.forEach(ch => {
    const code = ch.charCodeAt(0);
    const bits = [((code >> 5) & 3) + 1, ((code >> 3) & 3) + 1, ((code >> 1) & 3) + 1, (code & 1) + 1];
    bits.forEach((b, i) => { if (i % 2 === 0) ctx.fillRect(x, 8, barW * b, h - 24); x += barW * b; });
  });
  // Stop
  [2,3,1,1,2].forEach((b, i) => { if (i % 2 === 0) ctx.fillRect(x, 8, barW * b, h - 24); x += barW * (b + 1); });
  ctx.font = '10px monospace'; ctx.textAlign = 'center';
  ctx.fillText(text, w / 2, h - 4);
}

function drawQR(canvas, text, size) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = size; canvas.height = size;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#000';
  const grid = 25, cell = Math.floor((size - 20) / grid);
  const ox = Math.floor((size - grid * cell) / 2), oy = ox;
  // Finder patterns
  const drawFinder = (sx, sy) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))
        ctx.fillRect(ox + (sx + c) * cell, oy + (sy + r) * cell, cell, cell);
    }
  };
  drawFinder(0, 0); drawFinder(grid - 7, 0); drawFinder(0, grid - 7);
  // Data modules (seeded from text)
  for (let r = 0; r < grid; r++) for (let c = 0; c < grid; c++) {
    if ((r < 8 && c < 8) || (r < 8 && c >= grid - 8) || (r >= grid - 8 && c < 8)) continue;
    const seed = (text.charCodeAt((r * grid + c) % text.length) * (r + 1) * (c + 1)) % 7;
    if (seed < 3) ctx.fillRect(ox + c * cell, oy + r * cell, cell, cell);
  }
  ctx.font = '9px monospace'; ctx.textAlign = 'center';
  ctx.fillText(text, size / 2, size - 2);
}

export default function Barcodes() {
  const [assetList, setAssetList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [template, setTemplate] = useState('standard');
  const [search, setSearch] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    assetsApi.list({ limit: 200 }).then(r => {
      const resp = r.data;
      setAssetList(resp.data || resp.assets || (Array.isArray(resp) ? resp : []));
    }).catch(() => {});
  }, []);

  const filtered = assetList.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.asset_tag?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setGenerated(false);
  };

  const selectAll = () => {
    const ids = filtered.map(a => a.id);
    setSelected(prev => prev.length === ids.length ? [] : ids);
    setGenerated(false);
  };

  const generate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 800);
  };

  const selectedAssets = assetList.filter(a => selected.includes(a.id));
  const tmpl = LABEL_TEMPLATES.find(t => t.id === template);

  return (
    <>
      <div className="page-header">
        <div><h1>Barcode Generator</h1><p>Generate and print barcode/QR labels for assets</p></div>
        <div className="page-header-actions">
          {generated && selectedAssets.length > 0 && (
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <i className="fa-solid fa-print"></i> Print Labels
            </button>
          )}
          <button className="btn btn-primary" onClick={generate} disabled={selected.length === 0 || generating}>
            <i className="fa-solid fa-barcode"></i> {generating ? 'Generating...' : `Generate (${selected.length})`}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: Asset Selection */}
        <div className="card">
          <div className="card-header"><h3>Select Assets</h3>
            <button className="btn btn-sm btn-ghost" onClick={selectAll}>{selected.length === filtered.length ? 'Deselect All' : 'Select All'}</button>
          </div>
          <div style={{ padding: '0 16px 12px' }}>
            <input className="form-control" placeholder="Search assets..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 0 }} />
          </div>
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--gn-text-muted)' }}>No assets found</div>
            ) : filtered.map(a => (
              <div key={a.id} onClick={() => toggleSelect(a.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer',
                borderBottom: '1px solid var(--gn-border-light)', background: selected.includes(a.id) ? 'rgba(79,107,237,0.05)' : 'transparent'
              }}>
                <input type="checkbox" checked={selected.includes(a.id)} readOnly style={{ accentColor: 'var(--gn-accent)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                  <div className="font-mono text-sm" style={{ color: 'var(--gn-text-muted)' }}>{a.asset_tag}</div>
                </div>
                <span className={`badge ${a.status === 'active' ? 'green' : a.status === 'maintenance' ? 'orange' : 'gray'}`} style={{ fontSize: 10 }}>
                  {(a.status || '').replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Template & Preview */}
        <div>
          {/* Template Selection */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><h3>Label Template</h3></div>
            <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {LABEL_TEMPLATES.map(t => (
                <div key={t.id} onClick={() => { setTemplate(t.id); setGenerated(false); }} style={{
                  padding: 12, borderRadius: 8, cursor: 'pointer', border: `2px solid ${template === t.id ? 'var(--gn-accent)' : 'var(--gn-border-light)'}`,
                  background: template === t.id ? 'rgba(79,107,237,0.05)' : 'transparent', transition: 'all 0.15s'
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gn-text-muted)' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="card">
            <div className="card-header"><h3>Preview</h3>
              {generated && <span className="badge green">Generated</span>}
            </div>
            <div ref={previewRef} style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 12, minHeight: 200, alignItems: 'flex-start' }}>
              {!generated ? (
                <div style={{ textAlign: 'center', width: '100%', padding: 40, color: 'var(--gn-text-muted)' }}>
                  <i className="fa-solid fa-barcode" style={{ fontSize: 40, marginBottom: 12, display: 'block', opacity: 0.3 }}></i>
                  <p>{selected.length === 0 ? 'Select assets and click Generate' : `${selected.length} asset(s) selected — click Generate`}</p>
                </div>
              ) : selectedAssets.map(a => (
                <div key={a.id} style={{
                  border: '1px dashed var(--gn-border)', borderRadius: 6, padding: 10, background: '#fff',
                  width: tmpl.w, minHeight: tmpl.h, display: 'flex', flexDirection: 'column', alignItems: template === 'qr' ? 'center' : 'flex-start'
                }}>
                  {template === 'qr' ? (
                    <>
                      <canvas ref={el => el && drawQR(el, a.asset_tag || 'GN-00000', 110)} style={{ marginBottom: 4 }} />
                      <div style={{ fontSize: 9, fontWeight: 700, fontFamily: 'monospace', textAlign: 'center' }}>{a.asset_tag}</div>
                      <div style={{ fontSize: 8, color: '#666', textAlign: 'center' }}>{a.name?.slice(0, 24)}</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 8, fontWeight: 700, color: '#333', marginBottom: 2 }}>GLOBAL NEOCHAIN</div>
                      <canvas ref={el => el && drawBarcode(el, a.asset_tag || 'GN-00000', tmpl.w - 20, template === 'small' ? 30 : 40)} />
                      {template !== 'small' && <div style={{ fontSize: 9, fontWeight: 500, marginTop: 2 }}>{a.name?.slice(0, 30)}</div>}
                      {template === 'full' && (
                        <div style={{ fontSize: 8, color: '#666', marginTop: 1 }}>
                          {a.serial && <span>S/N: {a.serial} </span>}
                          {a.location && <span>• {a.location}</span>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
