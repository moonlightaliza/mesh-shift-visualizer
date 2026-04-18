// App.jsx — Root application component
import { useState, useEffect, useMemo } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { MeshGrid, MiniGrid } from './components/MeshGrid';
import { ComplexityPanel } from './components/ComplexityPanel';
import {
  computeShift, buildInitialData,
  applyRowShift, applyColShift
} from './utils/ShiftLogic';

export default function App() {
  const [p, setP] = useState(16);
  const [q, setQ] = useState(5);
  const [stage, setStage] = useState(0);  // 0=initial, 1=after row, 2=after col
  const [isAnimating, setIsAnimating] = useState(false);
  const [animNodes, setAnimNodes] = useState([]);
  const [speed, setSpeed] = useState(700);
  const [toast, setToast] = useState('');

  const { rowShift, colShift, sqrtP } = useMemo(() => computeShift(p, q), [p, q]);
  const initialData = useMemo(() => buildInitialData(p), [p]);
  const afterRowData = useMemo(() => applyRowShift(initialData, p, rowShift), [initialData, p, rowShift]);
  const afterColData = useMemo(() => applyColShift(afterRowData, p, colShift), [afterRowData, p, colShift]);

  const currentData = stage === 0 ? initialData : stage === 1 ? afterRowData : afterColData;

  useEffect(() => { reset(); }, [p, q]);

  function reset() {
    setStage(0);
    setAnimNodes([]);
    setIsAnimating(false);
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function runStage(s) {
    if (s === 1) {
      setIsAnimating(true);
      for (let row = 0; row < sqrtP; row++) {
        const rowNodes = Array.from({ length: sqrtP }, (_, col) => row * sqrtP + col);
        setAnimNodes(rowNodes);
        await sleep(speed / sqrtP + 100);
      }
      setAnimNodes([]);
      setStage(1);
      setIsAnimating(false);
      showToast(`Stage 1 complete: row shift by ${rowShift}`);
    } else if (s === 2) {
      setIsAnimating(true);
      for (let col = 0; col < sqrtP; col++) {
        const colNodes = Array.from({ length: sqrtP }, (_, row) => row * sqrtP + col);
        setAnimNodes(colNodes);
        await sleep(speed / sqrtP + 100);
      }
      setAnimNodes([]);
      setStage(2);
      setIsAnimating(false);
      showToast(`Stage 2 complete: col shift by ${colShift} — Shift done!`);
    }
  }

  async function autoAnimate() {
    if (isAnimating) return;
    reset();
    await sleep(300);
    await runStage(1);
    await sleep(400);
    await runStage(2);
  }

  const changedAfterRow = initialData.reduce((acc, v, i) => {
    if (afterRowData[i] !== v) acc.push(i); return acc;
  }, []);
  const changedFinal = afterRowData.reduce((acc, v, i) => {
    if (afterColData[i] !== v) acc.push(i); return acc;
  }, []);

  return (
    <div className="app">
      <div className="header">
        <div className="header-tag">⬡ PARALLEL COMPUTING VISUALIZER</div>
        <h1>Mesh Circular Shift</h1>
        <p>Interactive 2-stage visualization of circular q-shift on a √p × √p mesh topology</p>
      </div>

      <div className="main-grid">
        <ControlPanel
          p={p} q={q} onP={setP} onQ={setQ}
          onAnimate={autoAnimate} onReset={reset} onStep={runStage}
          isAnimating={isAnimating} stage={stage}
          speed={speed} onSpeed={setSpeed}
        />

        <div>
          <div className="states-row">
            <div className="state-panel">
              <div className="state-label">INITIAL STATE</div>
              <MiniGrid data={initialData} sqrtP={sqrtP} />
            </div>
            <div className="state-panel">
              <div className={`state-label${stage >= 1 ? ' active-label' : ''}`}>
                AFTER STAGE 1 (row +{rowShift})
              </div>
              <MiniGrid data={afterRowData} sqrtP={sqrtP}
                changedIndices={stage >= 1 ? changedAfterRow : []} />
            </div>
            <div className="state-panel">
              <div className={`state-label${stage >= 2 ? ' done-label' : ''}`}>
                FINAL STATE (col +{colShift})
              </div>
              <MiniGrid data={afterColData} sqrtP={sqrtP}
                changedIndices={stage >= 2 ? changedFinal : []} />
            </div>
          </div>

          <div className="viz-panel">
            <div className="panel-title">
              {stage === 0 ? 'INITIAL — NODE DATA' :
               stage === 1 ? `STAGE 1 COMPLETE — ROW SHIFT BY ${rowShift}` :
               `COMPLETE — q=${q} CIRCULAR SHIFT DONE`}
            </div>
            <MeshGrid data={currentData} sqrtP={sqrtP}
              animatingNodes={animNodes} stage={stage} />
          </div>

          <ComplexityPanel p={p} q={q} />
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}