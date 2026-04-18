// ControlPanel.jsx — User input controls
import { useState } from 'react';
import { computeShift } from '../utils/ShiftLogic';

const PERFECT_SQUARES = [4, 9, 16, 25, 36, 49, 64];

/**
 * ControlPanel provides:
 * - p selector (perfect squares 4–64)
 * - q input with range slider (1 to p-1)
 * - Animation control buttons (auto, step, reset)
 * - Speed selector
 * - Stage progress indicators
 */
export function ControlPanel({
  p, q, onP, onQ,
  onAnimate, onReset, onStep,
  isAnimating, stage,
  speed, onSpeed
}) {
  const [pErr, setPErr] = useState('');
  const [qErr, setQErr] = useState('');
  const { rowShift, colShift, sqrtP } = computeShift(p, q);

  function handleP(v) {
    const n = parseInt(v);
    if (isNaN(n)) { setPErr('Enter a number'); return; }
    if (!PERFECT_SQUARES.includes(n)) { setPErr('Must be a perfect square (4,9,16,25,36,49,64)'); return; }
    if (n < 4 || n > 64) { setPErr('Must be between 4 and 64'); return; }
    setPErr('');
    onP(n);
  }

  function handleQ(v) {
    const n = parseInt(v);
    if (isNaN(n)) { setQErr('Enter a number'); return; }
    if (n < 1 || n >= p) { setQErr(`Must be between 1 and ${p - 1}`); return; }
    setQErr('');
    onQ(n);
  }

  const stageStatus = (s) => {
    if (stage > s) return 'done';
    if (stage === s) return 'active';
    return 'idle';
  };

  return (
    <div className="panel control-panel">
      <div className="panel-title">CONTROLS</div>

      {/* p input */}
      <div className="input-group">
        <div className="input-label">
          <span>Nodes (p)</span>
          <span className="input-badge">{sqrtP}×{sqrtP} mesh</span>
        </div>
        <input
          type="number"
          className={`input-field${pErr ? ' error' : ''}`}
          value={p}
          onChange={e => handleP(e.target.value)}
          min={4} max={64}
        />
        <div className="range-row" style={{ marginTop: 8 }}>
          {PERFECT_SQUARES.map(ps => (
            <button key={ps} onClick={() => handleP(ps)}
              style={{
                padding: '3px 6px',
                background: p === ps ? 'var(--accent)' : 'var(--surface2)',
                border: '1px solid var(--border)', borderRadius: 4,
                color: p === ps ? '#000' : 'var(--text-muted)',
                fontFamily: 'Space Mono, monospace', fontSize: 10,
                cursor: 'pointer', fontWeight: p === ps ? 700 : 400
              }}
            >{ps}</button>
          ))}
        </div>
        {pErr && <div className="error-msg">{pErr}</div>}
      </div>

      {/* q input */}
      <div className="input-group">
        <div className="input-label">
          <span>Shift Amount (q)</span>
          <span className="input-badge">1 – {p - 1}</span>
        </div>
        <input
          type="number"
          className={`input-field${qErr ? ' error' : ''}`}
          value={q}
          onChange={e => handleQ(e.target.value)}
          min={1} max={p - 1}
        />
        <div className="range-row" style={{ marginTop: 8 }}>
          <input
            type="range" min={1} max={p - 1} value={q}
            onChange={e => handleQ(e.target.value)}
            style={{ flex: 1 }}
          />
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'var(--accent)', width: 24 }}>{q}</span>
        </div>
        {qErr && <div className="error-msg">{qErr}</div>}
      </div>

      <div className="divider" />

      {/* Stage indicators */}
      <div className="stage-indicator">
        <div className={`stage-pill ${stageStatus(1)}`}>STAGE 1</div>
        <div className={`stage-pill ${stageStatus(2)}`}>STAGE 2</div>
        <div className={`stage-pill ${stage === 3 ? 'done' : 'idle'}`}>DONE</div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(stage / 3) * 100}%` }} />
      </div>

      {/* Speed */}
      <div className="speed-row">
        <span className="speed-label">SPEED:</span>
        <div className="speed-options">
          {[['SLOW', 1200], ['MED', 700], ['FAST', 300]].map(([label, ms]) => (
            <button key={label} className={`speed-btn${speed === ms ? ' active' : ''}`}
              onClick={() => onSpeed(ms)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <button className="btn btn-primary" onClick={onAnimate} disabled={isAnimating}>
        {isAnimating ? '▶ ANIMATING...' : '▶ AUTO ANIMATE'}
      </button>

      <div className="step-buttons">
        <button className="btn btn-secondary" onClick={() => onStep(1)}
          disabled={isAnimating || stage >= 1}>STAGE 1</button>
        <button className="btn btn-secondary" onClick={() => onStep(2)}
          disabled={isAnimating || stage < 1 || stage >= 2}>STAGE 2</button>
      </div>

      <button className="btn btn-secondary" onClick={onReset} style={{ marginTop: 0 }}>
        ↺ RESET
      </button>
    </div>
  );
}