// Pure shift algorithm (testable, no UI dependencies)

export function computeShift(p, q) {
  const sqrtP = Math.sqrt(p);
  const rowShift = q % sqrtP;
  const colShift = Math.floor(q / sqrtP);
  return { rowShift, colShift, sqrtP };
}

export function buildInitialData(p) {
  // Each node i starts with data value i
  return Array.from({ length: p }, (_, i) => i);
}

export function applyRowShift(data, p, rowShift) {
  const sqrtP = Math.sqrt(p);
  const result = [...data];
  for (let row = 0; row < sqrtP; row++) {
    const rowStart = row * sqrtP;
    const rowData = data.slice(rowStart, rowStart + sqrtP);
    for (let col = 0; col < sqrtP; col++) {
      const srcCol = ((col - rowShift) % sqrtP + sqrtP) % sqrtP;
      result[rowStart + col] = rowData[srcCol];
    }
  }
  return result;
}

export function applyColShift(data, p, colShift) {
  const sqrtP = Math.sqrt(p);
  const result = [...data];
  for (let col = 0; col < sqrtP; col++) {
    for (let row = 0; row < sqrtP; row++) {
      const srcRow = ((row - colShift) % sqrtP + sqrtP) % sqrtP;
      result[row * sqrtP + col] = data[srcRow * sqrtP + col];
    }
  }
  return result;
}

export function getArrows(p, q, stage) {
  const sqrtP = Math.sqrt(p);
  const { rowShift, colShift } = computeShift(p, q);
  const arrows = [];

  if (stage === 1) {
    // Row shift arrows
    for (let row = 0; row < sqrtP; row++) {
      for (let col = 0; col < sqrtP; col++) {
        const destCol = (col + rowShift) % sqrtP;
        arrows.push({
          fromRow: row, fromCol: col,
          toRow: row, toCol: destCol,
          wrap: destCol < col
        });
      }
    }
  } else if (stage === 2) {
    // Column shift arrows
    for (let row = 0; row < sqrtP; row++) {
      for (let col = 0; col < sqrtP; col++) {
        const destRow = (row + colShift) % sqrtP;
        arrows.push({
          fromRow: row, fromCol: col,
          toRow: destRow, toCol: col,
          wrap: destRow < row
        });
      }
    }
  }
  return arrows;
}

export function meshSteps(p, q) {
  const sqrtP = Math.sqrt(p);
  return (q % sqrtP) + Math.floor(q / sqrtP);
}

export function ringSteps(p, q) {
  return Math.min(q, p - q);
}