# 🖋️ Poster Plotter Studio · استوديو رسم الملصقات بالبلوتر

An interactive, beginner-friendly web application designed specifically for **Poster-to-Plotter Generative Art Workshops**.

Participants bring their preexisting posters, graphic design artwork, photos, or typography, plug them into contemporary experimental generative algorithms, watch their artwork turn into machine-ready vector paths with an interactive pen plotter simulator, and export clean SVGs for physical plotting on machines like the **AxiDraw**, **iDraw**, or **CNC plotters**.

---

## 🌟 Why This Studio Was Created

In traditional workshops, participants either had to code from scratch or were overwhelmed by walls of complex technical parameters.

**Poster Plotter Studio solves this with a beginner-first approach:**
1. **Bring Your Own Poster**: Works directly with whatever artwork participants brought (JPG, PNG, WebP) or 5 built-in contemporary design templates (Swiss Typography, Classical Marble Sculpture, Botanical Riso, Cyber Club Poster, Brutalist Architecture).
2. **The 3-Step Creative Journey**:
   - **Step 1: Upload or Choose Poster**
   - **Step 2: Pick Contemporary Generative Style** (Big visual cards with live style icons and tags)
   - **Step 3: Quick Vibe Presets & 3 Intuitive Sliders** (Gentle by default, deep customization on demand)
3. **Interactive Virtual Plotter Simulator**: Watch the simulated pen carriage travel across the page, drawing ink line-by-line with authentic pen-up air jumps before going to the physical machine.
4. **Hardware-Safe Metrics**: Live AxiDraw time estimation (`⏱️ ~8m 20s`), pen lifts counter (`⚡ 12 lifts` or `⚡ 0 lifts`), and total drawn meters (`📏 14.5m`).
5. **Bilingual Support (English & العربية)**: Seamless one-click toggle between English and Arabic with native RTL layout for workshops in Saudi Arabia and the MENA region.

---

## 🎨 The 8 Contemporary Pinterest-Inspired Algorithms

Inspired by contemporary generative art, kinetic poster design, and viral pen plotter trends:

| # | Algorithm | Aesthetic Vibe | Key Plotter Highlight |
|---|---|---|---|
| 1 | **🗺️ Topographic Isolines** | Contemporary Swiss / Cartographic | True 2D omnidirectional continuous contour loops and saddles wrapping 360° around poster forms. |
| 2 | **🌐 3D Wireframe Mesh** | Architectural CAD / Retro-Futuristic | **100% Interconnected Lattice!** A continuous 3D perspective wireframe grid that extrudes poster depth into an architectural landscape with near-zero pen lifts. |
| 3 | **➰ Continuous Single-Line (TSP)** | The Plotter Holy Grail | **Zero Pen Lifts!** The pen drops once and draws the entire poster in one single continuous looping thread. |
| 4 | **🏔️ Pulsar 3D Waves** | Joy Division / Relief Elevation | Horizontal scanlines with **authentic 3D hidden-line occlusion**—foreground peaks obscure background valleys. |
| 5 | **🧬 Bio-Labyrinth Meanders** | Organic / Alan Turing | Reaction-diffusion fingerprint corridors that contract and dilate with poster tones. |
| 6 | **📐 Brutalist Swiss Hatch** | Bauhaus / Architectural Blueprint | Clean dual-angle cross-hatching. Can split into **Layer 1 (45°)** and **Layer 2 (-45°)** for two-color plotting! |
| 7 | **🎯 Op-Art Concentric Moiré** | Kinetic / Optical Illusion | Expanding hypnotic concentric ripples and radial spokes modulated by poster shadows. |
| 8 | **📟 Cyber Glitch Matrix** | Techno / Contemporary Brutalism | PWM pulse-width digital scanlines and micro-vector typography glyphs. |

---

## 🚀 Instant Deployment to GitHub Pages

This project is a **zero-build, pure client-side static web application** (HTML5 + CSS3 + Vanilla ES6 JS). There are no Node.js dependencies, no build steps, and no backend servers required.

### Host it for your workshop participants in 60 seconds:
1. Push this folder to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Launch Poster Plotter Studio"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. On GitHub, navigate to **Settings > Pages**.
3. Under **Branch**, select `main` and root `/`.
4. Click **Save**. Your workshop web app is live in seconds at:
   `https://<your-username>.github.io/<your-repo-name>/`
5. Share the link with your workshop attendees—they can open it on Mac, Windows, Linux, iPad, or Chromebook without installing anything!

### Running Locally (Offline)
- Simply double-click `index.html` in Chrome, Safari, Firefox, or Edge.
- Or use any simple local server:
  ```bash
  python3 -m http.server 8080
  # or
  npx serve .
  ```

---

## 🛠️ Plotter Hardware & Machine Setup Guide

### 1. Paper Formats Supported
- **ISO A5 (148 × 210 mm)**: Standard workshop size (fits AxiDraw V3 / SE A4).
- **ISO A4 (210 × 297 mm)**: Full poster format.
- **ISO A3 (297 × 420 mm)**: Large format prints.
- **Square (200 × 200 mm)**: Record sleeve / art print format.
- **Postcard (105 × 148 mm)**: Ultra-fast 3-minute test prints.

### 2. Paper Stocks & Pen Pairings
- **Heavy White Bristol (250–300 gsm)**: Pairs with Sakura Pigma Micron 0.35mm / 0.5mm black ink.
- **Midnight Charcoal Black**: Pairs with Sakura Gelly Roll 08/10 White or Metallic Gold.
- **Natural Kraft Cardstock**: Pairs with dark brown fountain pen ink or white gel.
- **Warm Cream Moleskine**: Pairs with Sepia or Prussian Blue archival ink.
- **Indigo Blueprint**: Pairs with white opaque pigment pens.

### 3. Plotting Workflow on the Machine (AxiDraw / Inkscape)
1. In Poster Plotter Studio, click **📥 Download Plotter SVG**.
2. Open the downloaded `.svg` file in **Inkscape**.
3. Notice that the paths are already clean, dimensioned in millimeters, without fills, and organized into:
   - `Layer 1 (Main Pen)`
   - `Layer 2 (Accent Pen)` (if Dual-Pen mode was used)
4. Go to **Extensions > AxiDraw Control > Plot**:
   - For single pen: Click **Apply**.
   - For dual pen: Select Layer 1, plot with Pen A. Swap pen in clamp, select Layer 2, and plot with Pen B!

---

## 🎓 Recommended Workshop Lesson Outline (90–120 Minutes)

### Phase 1: Welcome & Mechanical Demo (15 min)
- Introduce the pen plotter (X/Y stepper gantry + servo pen-lifter).
- Explain vectors vs pixels: pixels are raster grids, plotters require mathematical lines.
- Show a physical drawing test on paper.

### Phase 2: Ingesting the Posters (15 min)
- Attendees drag and drop the poster they brought (or pick a built-in sample).
- Discuss contrast and lighting: plotters draw in monochrome lines, so high-contrast graphic posters produce the crispest results.

### Phase 3: Exploring the 8 Contemporary Algorithms (25 min)
- Attendees test different styles on their poster (Topographic Isolines, Fluid Streamlines, Continuous Single-Line, Joy Division Waves, etc.).
- Try the 4 Quick Vibe Presets (**⚡ Fast**, **🎯 Contemporary**, **🏛️ Dense**, **🎨 Dual-Pen**).
- Introduce the **Seed** button (🎲): explain how deterministic pseudo-randomness works in generative art.

### Phase 4: Simulating & Optimizing (15 min)
- Click **▶️ Watch Plotter Draw** to preview the physical pen path in real-time.
- Check the **Time Estimate** and **Pen Lifts** counter.
- If plotting time is too long for a shared machine queue, drag **Detail Density** down slightly to hit a ~5-8 minute sweet spot!

### Phase 5: The Physical Plotting Queue (45 min)
- Participants download their machine-ready SVGs.
- Each attendee takes turns loading their file onto the machine and watching their poster drawn line-by-line onto real paper!

---

## 📁 Repository File Structure

```text
poster_plotter_studio/
├── index.html          # Main workshop web application
├── styles.css          # Responsive dark studio UI + RTL Arabic support
├── js/
│   ├── samples.js      # Built-in procedural aesthetic poster templates
│   ├── algorithms.js   # 8 contemporary Pinterest-inspired algorithms
│   ├── plotter.js      # Hardware dimensions, TSP optimizer, SVG export, simulator
│   └── app.js          # 3-step controller, pan/zoom, bilingual engine
└── README.md           # Workshop curriculum and hardware guide
```

---

Crafted with ❤️ for Njood Albawardi's Creative Plotter Workshops.
