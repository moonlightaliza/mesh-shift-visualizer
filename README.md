# Mesh Circular Shift Visualizer

An interactive web application that simulates and visualizes **circular q-shift** on a 2D mesh topology — a fundamental operation in parallel computing.

## 🔗 Live Deployment
 https://mesh-shift-visualizer.netlify.app/

## 🧠 What It Does

In parallel computing, a **circular q-shift** moves data from node `i` to node `(i + q) mod p`. On a 2D mesh, this is implemented in two efficient stages:

- **Stage 1 — Row Shift:** each node shifts within its row by `q mod √p` positions
- **Stage 2 — Column Shift:** each node shifts within its column by `⌊q/√p⌋` positions

This is more efficient than a naive ring shift, which requires `min{q, p−q}` steps.

## 🚀 Running Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/mesh-shift-visualizer.git
cd mesh-shift-visualizer

# Install dependencies (just a static server)
npm install

# Start the app
npm start

# Open http://localhost:3000 in your browser
```

Or simply open `public/index.html` directly in your browser — no build step needed!

## 📁 Project Structure

```
mesh-shift-visualizer/
├── public/
│   └── index.html          ← complete app (React via CDN)
├── src/
│   ├── components/
│   │   ├── MeshGrid.*      ← grid rendering + animation
│   │   ├── ControlPanel.*  ← user inputs
│   │   └── ComplexityPanel.* ← analysis panel
│   ├── utils/
│   │   └── shiftLogic.js   ← pure shift algorithm (testable)
│   ├── App.*
│   └── index.js
├── README.md
└── package.json
```




## ✨ Features

- **Interactive Controls:** Enter any valid `p` (4–64, perfect square) and `q` (1 to p−1) with live validation
- **√p × √p Mesh Grid:** Visual grid showing all node indices and data values
- **Step-by-Step Animation:** Animated Stage 1 (row shift) and Stage 2 (column shift) with highlighted nodes
- **Before/After States:** Side-by-side comparison of initial → Stage 1 → Final state
- **Complexity Panel:** Real-time comparison of Mesh steps vs Ring steps with formulas and bar chart
- **Speed Control:** Slow / Medium / Fast animation speeds
- **Reference Table:** Pre-computed comparisons for p=16,64 with q=3,5,7

## 📐 Algorithm

For p nodes arranged in a √p × √p mesh:

```
rowShift = q mod √p
colShift = ⌊q / √p⌋

meshSteps = rowShift + colShift
ringSteps = min{q, p−q}

meshSteps ≤ ringSteps  (mesh is always at least as efficient)
```

### Worked Example: p=16, q=5
- √p = 4
- Row shift = 5 mod 4 = **1**
- Col shift = ⌊5/4⌋ = **1**
- Mesh steps = 1 + 1 = **2**
- Ring steps = min{5, 11} = **5**
- **Mesh is 60% faster!**