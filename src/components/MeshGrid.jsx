// MeshGrid.js — Grid rendering + animation component
// Used in the main app via public/index.html (React CDN build)

/**
 * MeshGrid renders a √p × √p grid of nodes.
 * Each node shows its index and current data value.
 * animatingNodes: array of node indices currently being highlighted.
 * stage: 0=initial, 1=after row shift, 2=after col shift (final)
 */
export function MeshGrid({ data, sqrtP, animatingNodes, stage }) {
  const nodeSize = sqrtP <= 4 ? 64 : sqrtP <= 6 ? 52 : 40;
  const gap = 8;

  return (
    <div className="mesh-container">
      <div className="mesh-grid-wrapper">
        <div
          className="mesh-grid"
          style={{
            gridTemplateColumns: `repeat(${sqrtP}, ${nodeSize}px)`,
            gap: `${gap}px`
          }}
        >
          {data.map((val, i) => {
            const isAnim = animatingNodes.includes(i);
            const isDone = stage === 3;
            return (
              <div
                key={i}
                className={`mesh-node${isAnim ? ' animating' : ''}${isDone ? ' done-anim' : ''}`}
                style={{ width: nodeSize, height: nodeSize }}
              >
                <div className="node-index">n{i}</div>
                <div className="node-value">{val}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * MiniGrid renders a compact version of the mesh for state panels.
 * changedIndices: which nodes changed (highlighted in accent color).
 */
export function MiniGrid({ data, sqrtP, changedIndices = [] }) {
  return (
    <div
      className="mini-grid"
      style={{ gridTemplateColumns: `repeat(${sqrtP}, 1fr)` }}
    >
      {data.map((val, i) => (
        <div
          key={i}
          className={`mini-node${changedIndices.includes(i) ? ' changed' : ''}`}
        >
          {val}
        </div>
      ))}
    </div>
  );
}