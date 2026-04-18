// ComplexityPanel.jsx — Real-time complexity analysis panel
import { computeShift, meshSteps, ringSteps } from '../utils/ShiftLogic';

const TABLE_ROWS = [
  { p: 16, q: 3 }, { p: 16, q: 5 }, { p: 16, q: 7 },
  { p: 64, q: 3 }, { p: 64, q: 5 }, { p: 64, q: 7 },
];

/**
 * ComplexityPanel shows:
 * - Row shift, col shift, and total mesh communication steps
 * - Formula: Ring steps = min{q, p−q}  vs  Mesh steps = (q mod √p) + ⌊q/√p⌋
 * - Bar chart comparison (Mesh vs Ring)
 * - Reference table for p=16,64 with q=3,5,7
 */
export function ComplexityPanel({ p, q }) {
  const { rowShift, colShift, sqrtP } = computeShift(p, q);
  const mesh = meshSteps(p, q);
  const ring = ringSteps(p, q);
  const maxSteps = Math.max(mesh, ring, 1);
  const saving = ring > 0 ? (((ring - mesh) / ring) * 100).toFixed(0) : 0;

  return (
    <div className="panel complexity-panel">
      <div className="panel-title">COMPLEXITY ANALYSIS</div>

      {/* Shift amounts */}
      <div className="shifts-row">
        <div className="shift-badge">
          <div className="shift-badge-label">ROW SHIFT</div>
          <div className="shift-badge-val">{rowShift}</div>
          <div className="shift-badge-sub">q mod √p = {q} mod {sqrtP}</div>
        </div>
        <div className="shift-badge">
          <div className="shift-badge-label">COL SHIFT</div>
          <div className="shift-badge-val">{colShift}</div>
          <div className="shift-badge-sub">⌊q/√p⌋ = ⌊{q}/{sqrtP}⌋</div>
        </div>
        <div className="shift-badge">
          <div className="shift-badge-label">TOTAL STEPS</div>
          <div className="shift-badge-val" style={{ color: 'var(--green)' }}>{mesh}</div>
          <div className="shift-badge-sub">{rowShift} + {colShift}</div>
        </div>
      </div>

      {/* Formula cards */}
      <div className="formula-row">
        <div className="formula-card winner">
          <div className="formula-title">MESH STEPS</div>
          <div className="formula-steps mesh-color">{mesh}</div>
          <div className="formula-detail">(q mod √p) + ⌊q/√p⌋</div>
          <div className="formula-detail">= {rowShift} + {colShift}</div>
          <span className="winner-badge">✓ FASTER</span>
        </div>
        <div className="formula-card">
          <div className="formula-title">RING STEPS</div>
          <div className="formula-steps ring-color">{ring}</div>
          <div className="formula-detail">min{'{q, p−q}'}</div>
          <div className="formula-detail">= min{'{' + q + ', ' + (p - q) + '}'}</div>
          {saving > 0 && (
            <div className="formula-detail" style={{ color: 'var(--red)', marginTop: 6 }}>
              {saving}% slower
            </div>
          )}
        </div>
      </div>

      {/* Bar chart */}
      <div className="bar-chart">
        <div className="bar-row">
          <div className="bar-label">MESH</div>
          <div className="bar-track">
            <div className="bar-fill bar-mesh" style={{ width: `${(mesh / maxSteps) * 100}%` }}>
              {mesh}
            </div>
          </div>
        </div>
        <div className="bar-row">
          <div className="bar-label">RING</div>
          <div className="bar-track">
            <div className="bar-fill bar-ring" style={{ width: `${(ring / maxSteps) * 100}%` }}>
              {ring}
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Reference table */}
      <div className="panel-title" style={{ marginBottom: 12 }}>REFERENCE TABLE</div>
      <table className="comp-table">
        <thead>
          <tr>
            <th>p</th><th>q</th><th>√p</th>
            <th>Mesh</th><th>Ring</th><th>Savings</th>
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map(({ p: tp, q: tq }) => {
            const tm = meshSteps(tp, tq);
            const tr = ringSteps(tp, tq);
            const ts = tr > 0 ? `${(((tr - tm) / tr) * 100).toFixed(0)}%` : '—';
            return (
              <tr key={`${tp}-${tq}`}>
                <td>{tp}</td><td>{tq}</td><td>{Math.sqrt(tp)}</td>
                <td className="mesh-val">{tm}</td>
                <td className="ring-val">{tr}</td>
                <td className="better">{ts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}