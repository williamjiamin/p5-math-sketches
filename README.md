# RippaMathCore

Interactive math visualizations built with [p5.js](https://p5js.org/), designed for teaching number lines, coordinates, angles, and more.

## Live Demo

**https://williamjiamin.github.io/RippaMathCore/**

## Sketches

| # | Sketch | Description |
|---|--------|-------------|
| 1 | The Number Line | Basic number line display |
| 2 | Interaction Line | Interactive number line with dragging |
| 3 | Make Your Own Shape | Shape creation on the number line |
| 4 | Challenge | Number line challenge exercises |
| 5 | Negative | Negative numbers on the number line |
| 6 | Zoom | Zoom in/out on the number line |
| 7 | Decimal | Decimals on the number line |
| 8 | Absolute Value | Absolute value with profile pics |
| 9 | Distance Between | Distance between two points |
| 10 | Distance Between Calculation | Animated distance calculation with bar subtraction |
| 11 | Coordinate | Interactive coordinate plane |
| 12 | Coordinate Practice | Coordinate plotting exercises |
| 13 | 3D Coordinate | 3D coordinate system visualization |
| 14 | 3D Coordinate Free Movement | Free-roam 3D coordinate explorer |
| 15 | Angle | Interactive angle explorer with types |
| 16 | Angle Complementary and Supplementary | Complementary & supplementary angles with random generation and animation |
| 17 | Angle of Polygons | Sum of interior angles via triangle decomposition with animation |

## How to Run

### Option 1: Open directly in browser

1. Open `index.html` in your browser.
2. Pick a sketch from the dropdown.
3. Pick a p5.js version (default `1.11.11`).

> Note: Some browsers block local file loading (`file://` protocol). If sketches don't load, use Option 2.

### Option 2: Local HTTP server (recommended)

Run one of these from this folder, then open `http://localhost:8000`:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code
# Install "Live Server" extension, then right-click index.html -> "Open with Live Server"
```

## Project Structure

```
.
├── index.html              # Sketch launcher – dropdown to pick and run any sketch
├── runner.html              # Loads p5.js + the selected sketch inside an iframe
├── sketches-list.js         # Auto-generated sketch list (loaded by index.html via <script> tag)
├── sketches.json            # Auto-generated sketch list (JSON format, for other tools)
├── assets/
│   ├── me.png               # "Rippa" profile picture
│   └── kid.png              # "Eon" profile picture
├── assets-data.js           # Auto-generated base64 data URLs for profile pics
├── 1.The Number Line.js     # Sketch files (numbered)
├── 2.Interaction Line.js
├── ...
├── 10.Distance Between Calculation.js
├── update-sketches.js       # Node script to regenerate sketches-list.js + sketches.json
├── build-assets-data.js     # Node script to regenerate assets-data.js
└── README.md
```

## Adding a New Sketch

1. Create a new `.js` file in this folder following the naming pattern: `11.My New Sketch.js`
2. Regenerate the sketch list so `index.html` picks it up:

```bash
node update-sketches.js
```

3. Refresh `index.html` in your browser — the new sketch appears in the dropdown.

### Auto-watch mode

If you don't want to re-run the command every time, use watch mode — it detects new/removed `.js` files and regenerates `sketches.json` automatically:

```bash
node update-sketches.js --watch
```

Leave it running in a terminal while you work.

## Rebuilding Asset Data

If you change the profile pictures in `assets/`, regenerate the base64 data:

```bash
node build-assets-data.js
```

This does two things:
- Writes `assets-data.js` (loaded by `runner.html` so profile pics work in the canvas).
- Injects inline base64 fallbacks into sketch files that have the `ASSET_FALLBACKS_START` / `ASSET_FALLBACKS_END` markers (for environments like the p5canvas VS Code extension where external asset loading isn't available).

## How the Launcher Works

When `index.html` loads, it reads the sketch list from `sketches-list.js` (loaded via a `<script>` tag). This works on both `file://` (double-click to open) and `http://` (local server) -- no `fetch()` needed.

If `sketches-list.js` is missing, it falls back to a hardcoded list inside `index.html`.

## Deployment

All sketches are deployed automatically via GitHub Actions on every push to `master`.

## Mobile Workflow (Coding & Testing from Your Phone)

### Testing Sketches on Phone
Just open **https://williamjiamin.github.io/RippaMathCore/** in your phone's browser. Pick a sketch from the dropdown and it runs instantly — no install needed.

### Editing Code from Phone
You have several options, from easiest to most powerful:

1. **github.dev (VS Code in browser)**
   - Go to your repo: `https://github.com/williamjiamin/RippaMathCore`
   - Press the `.` key (period) or change `github.com` to `github.dev` in the URL
   - Opens a full VS Code editor in your browser — works on phone!
   - Commit changes directly from the editor

2. **GitHub Codespaces (full cloud dev environment)**
   - Go to your repo on GitHub
   - Click **Code** → **Codespaces** → **Create codespace on master**
   - Gives you a full VS Code with terminal in the cloud
   - Free tier: 120 core-hours/month

3. **GitHub Mobile App**
   - Install from App Store / Play Store
   - Browse files, make quick edits, commit, review issues & PRs
   - Best for small/quick fixes

4. **Cursor Web**
   - Go to **https://www.cursor.com** and sign in
   - Open your repo for AI-assisted editing with agent mode

### Workflow: Edit → Push → Test
1. Edit code using any method above
2. Commit & push to `master`
3. GitHub Actions auto-deploys (takes ~30 seconds)
4. Refresh the GitHub Pages URL on your phone to see changes

## Requirements

- A modern browser (Chrome, Firefox, Edge, Safari).
- [Node.js](https://nodejs.org/) (only needed for running `update-sketches.js` and `build-assets-data.js`).
