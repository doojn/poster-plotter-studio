/**
 * Contemporary Algorithmic Generators for Pen Plotter Poster Art
 * Turns raster posters (luminance/contrast/edges) into clean vector paths.
 */

// Simple deterministic PRNG & Simplex Noise
class PseudoRandom {
  constructor(seed = 12345) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }
  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
}

// Simplex Noise (2D)
class SimplexNoise {
  constructor(seed = 42) {
    this.p = new Uint8Array(512);
    const rng = new PseudoRandom(seed);
    const perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      const t = perm[i];
      perm[i] = perm[j];
      perm[j] = t;
    }
    for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255];
  }
  noise2D(xin, yin) {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    let s = (xin + yin) * F2;
    let i = Math.floor(xin + s);
    let j = Math.floor(yin + s);
    let t = (i + j) * G2;
    let X0 = i - t;
    let Y0 = j - t;
    let x0 = xin - X0;
    let y0 = yin - Y0;
    let i1 = x0 > y0 ? 1 : 0;
    let j1 = x0 > y0 ? 0 : 1;
    let x1 = x0 - i1 + G2;
    let y1 = y0 - j1 + G2;
    let x2 = x0 - 1.0 + 2.0 * G2;
    let y2 = y0 - 1.0 + 2.0 * G2;
    let ii = i & 255;
    let jj = j & 255;
    let gi0 = this.p[ii + this.p[jj]] % 8;
    let gi1 = this.p[ii + i1 + this.p[jj + j1]] % 8;
    let gi2 = this.p[ii + 1 + this.p[jj + 1]] % 8;
    
    const grad = (g, x, y) => {
      const h = g & 7;
      const u = h < 4 ? x : y;
      const v = h < 4 ? y : x;
      return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
    };

    let n0, n1, n2;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0.0;
    else {
      t0 *= t0;
      n0 = t0 * t0 * grad(gi0, x0, y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0.0;
    else {
      t1 *= t1;
      n1 = t1 * t1 * grad(gi1, x1, y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0.0;
    else {
      t2 *= t2;
      n2 = t2 * t2 * grad(gi2, x2, y2);
    }
    return 70.0 * (n0 + n1 + n2);
  }
}

// Global-safe TSP wrapper
function optimizePathsTSP(paths, maxWeldMm = 5.5) {
  if (typeof window !== "undefined" && window.optimizePathsTSP) {
    return window.optimizePathsTSP(paths, maxWeldMm);
  }
  return paths || [];
}

/**
 * Image Luminance Matrix Processor
 */
class PosterGrid {
  constructor(img, widthMm, heightMm, marginMm, contrast = 1.0, brightness = 0.0, invert = false) {
    this.widthMm = widthMm;
    this.heightMm = heightMm;
    this.marginMm = marginMm;
    this.drawW = widthMm - 2 * marginMm;
    this.drawH = heightMm - 2 * marginMm;
    this.contrast = contrast;
    this.brightness = brightness;
    this.invert = invert;

    // Off-screen canvas to extract pixel luminance
    const resW = 320;
    const resH = Math.round(resW * (this.drawH / this.drawW));
    this.cols = resW;
    this.rows = resH;

    const offCanvas = document.createElement("canvas");
    offCanvas.width = resW;
    offCanvas.height = resH;
    const ctx = offCanvas.getContext("2d");

    // Scale & fit image into drawing area
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, resW, resH);

    // Compute aspect cover
    const imgRatio = img.width / img.height;
    const targetRatio = resW / resH;
    let sW, sH, sX, sY;
    if (imgRatio > targetRatio) {
      sH = img.height;
      sW = img.height * targetRatio;
      sX = (img.width - sW) / 2;
      sY = 0;
    } else {
      sW = img.width;
      sH = img.width / targetRatio;
      sX = 0;
      sY = (img.height - sH) / 2;
    }

    ctx.drawImage(img, sX, sY, sW, sH, 0, 0, resW, resH);
    const imgData = ctx.getImageData(0, 0, resW, resH).data;

    // Compute normalized luminance grid and RGB channels
    this.lum = new Float32Array(resW * resH);
    this.rChan = new Float32Array(resW * resH);
    this.gChan = new Float32Array(resW * resH);
    this.bChan = new Float32Array(resW * resH);

    for (let y = 0; y < resH; y++) {
      for (let x = 0; x < resW; x++) {
        const idx = (y * resW + x) * 4;
        const r = (imgData[idx] || 0) / 255.0;
        const g = (imgData[idx + 1] || 0) / 255.0;
        const b = (imgData[idx + 2] || 0) / 255.0;

        const pIdx = y * resW + x;
        this.rChan[pIdx] = r;
        this.gChan[pIdx] = g;
        this.bChan[pIdx] = b;

        // Standard Rec. 709 luminance (0 = black, 255 = white)
        let l = (0.2126 * r + 0.7152 * g + 0.0722 * b);

        // Apply brightness
        l = Math.max(0, Math.min(1, l + this.brightness / 100));

        // Apply contrast
        l = Math.max(0, Math.min(1, (l - 0.5) * this.contrast + 0.5));

        // Invert to "darkness / ink density" (0 = white/no ink, 1 = black/dense ink)
        let darkness = 1.0 - l;
        if (this.invert) {
          darkness = 1.0 - darkness;
        }
        this.lum[pIdx] = darkness;
      }
    }
  }

  // Bilinear sampling at coordinate in mm
  getDarkness(xMm, yMm) {
    const rx = (xMm - this.marginMm) / this.drawW;
    const ry = (yMm - this.marginMm) / this.drawH;
    if (rx < 0 || rx > 1 || ry < 0 || ry > 1) return 0;

    const gx = rx * (this.cols - 1);
    const gy = ry * (this.rows - 1);
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const x1 = Math.min(this.cols - 1, x0 + 1);
    const y1 = Math.min(this.rows - 1, y0 + 1);
    const fx = gx - x0;
    const fy = gy - y0;

    const v00 = this.lum[y0 * this.cols + x0];
    const v10 = this.lum[y0 * this.cols + x1];
    const v01 = this.lum[y1 * this.cols + x0];
    const v11 = this.lum[y1 * this.cols + x1];

    const top = v00 * (1 - fx) + v10 * fx;
    const bot = v01 * (1 - fx) + v11 * fx;
    return top * (1 - fy) + bot * fy;
  }

  // Bilinear sampling of RGB channels [0..1]
  getRGB(xMm, yMm) {
    const rx = (xMm - this.marginMm) / this.drawW;
    const ry = (yMm - this.marginMm) / this.drawH;
    if (rx < 0 || rx > 1 || ry < 0 || ry > 1) return { r: 1, g: 1, b: 1 };

    const gx = rx * (this.cols - 1);
    const gy = ry * (this.rows - 1);
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const x1 = Math.min(this.cols - 1, x0 + 1);
    const y1 = Math.min(this.rows - 1, y0 + 1);
    const fx = gx - x0;
    const fy = gy - y0;

    const sample = (arr) => {
      const top = arr[y0 * this.cols + x0] * (1 - fx) + arr[y0 * this.cols + x1] * fx;
      const bot = arr[y1 * this.cols + x0] * (1 - fx) + arr[y1 * this.cols + x1] * fx;
      return top * (1 - fy) + bot * fy;
    };

    return {
      r: sample(this.rChan),
      g: sample(this.gChan),
      b: sample(this.bChan)
    };
  }

  // Returns CMY ink density components (0..1)
  getCMY(xMm, yMm) {
    const rgb = this.getRGB(xMm, yMm);
    return {
      c: Math.max(0, 1 - rgb.r),
      m: Math.max(0, 1 - rgb.g),
      y: Math.max(0, 1 - rgb.b)
    };
  }

  // Classifies coordinate into color layer index: 0, 1, or 2
  // Tone 1 (Layer 1 / Index 0): Shadows / Black (darkness >= 0.55)
  // Tone 2 (Layer 2 / Index 1): Midtones / Grey (0.22 <= darkness < 0.55)
  // Tone 3 (Layer 3 / Index 2): Highlights / White (0.06 <= darkness < 0.22)
  getColorLayer(xMm, yMm, numColors = 3) {
    if (numColors <= 1) return 0;
    const dark = this.getDarkness(xMm, yMm);

    if (numColors === 2) {
      return dark >= 0.40 ? 0 : 1;
    } else {
      // 3 Tones from Black to Grey to White
      if (dark >= 0.55) return 0; // Tone 1: Deep Black / Shadows
      if (dark >= 0.22) return 1; // Tone 2: Midtones / Grey
      return 2;                   // Tone 3: Highlights / White
    }
  }

  // Helper returning 3-tone classification
  getToneClassification(xMm, yMm) {
    const dark = this.getDarkness(xMm, yMm);
    if (dark < 0.06) return { tone: 0, name: "paper" };
    if (dark >= 0.55) return { tone: 1, name: "black" };
    if (dark >= 0.22) return { tone: 2, name: "grey" };
    return { tone: 3, name: "white" };
  }

  // Image gradient vector (dDark/dx, dDark/dy)
  getGradient(xMm, yMm) {
    const delta = 0.5;
    const dx = (this.getDarkness(xMm + delta, yMm) - this.getDarkness(xMm - delta, yMm)) / (2 * delta);
    const dy = (this.getDarkness(xMm, yMm + delta) - this.getDarkness(xMm, yMm - delta)) / (2 * delta);
    return { dx, dy };
  }
}

window.PosterGrid = PosterGrid;

/**
 * 8 CONTEMPORARY ALGORITHM IMPLEMENTATIONS
 */
window.POSTER_ALGORITHMS = {
  // 1. TRUE 2D INTERCONNECTED TOPOGRAPHIC ISOCLINES
  // Fully omnidirectional, continuous 2D contour rings and saddles where the entire poster's
  // mass distribution, edge energy, and coupled harmonic potential field shape every single curve.
  topography: {
    id: "topography",
    name: "Topographic Isolines",
    nameAr: "خطوط كنتورية تضاريسية متفاعلة (2D)",
    badge: "Museum Grade · True 2D",
    desc: "Harmonically coupled 2D contour loops and saddles wrapping 360° around poster forms like genuine high-end topographic cartography.",
    descAr: "حلقات كنتورية كاملة بجميع الاتجاهات تلتف 360 درجة حول عناصر الملصق والتايبوغرافي كخرائط تضاريسية سويسرية فائقة الدقة.",
    icon: "🗺️",
    dualPenAvailable: true,
    generate: (grid, opts) => {
      // Step resolution for smooth continuous field
      const stepMm = 1.0;
      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;

      const cols = Math.floor((xMax - xMin) / stepMm) + 1;
      const rows = Math.floor((yMax - yMin) / stepMm) + 1;

      // 1. Global Field Construction: Everything Influences Everything
      const field = new Float32Array(cols * rows);
      const simplex = new SimplexNoise(opts.seed || 42);
      const noiseScale = 0.014;

      // Calculate global center of gravity of the poster
      let totalMass = 0, sumX = 0, sumY = 0;
      for (let r = 0; r < rows; r += 4) {
        const y = yMin + r * stepMm;
        for (let c = 0; c < cols; c += 4) {
          const x = xMin + c * stepMm;
          const d = grid.getDarkness(x, y);
          sumX += x * d;
          sumY += y * d;
          totalMass += d;
        }
      }
      const cx = totalMass > 0.05 ? sumX / totalMass : (xMin + xMax) / 2;
      const cy = totalMass > 0.05 ? sumY / totalMass : (yMin + yMax) / 2;
      const maxR = Math.hypot(xMax - cx, yMax - cy);

      // Build coupled harmonic potential field
      for (let r = 0; r < rows; r++) {
        const y = yMin + r * stepMm;
        for (let c = 0; c < cols; c++) {
          const x = xMin + c * stepMm;
          const dark = grid.getDarkness(x, y);
          const grad = grid.getGradient(x, y);
          const gradMag = Math.hypot(grad.dx, grad.dy);

          // Force 1: Global Dome Tension (pulls the whole composition into one unified landscape)
          const distC = Math.hypot(x - cx, y - cy) / maxR;
          const globalDome = Math.cos(distC * Math.PI * 0.5) * 0.12;

          // Force 2: Anisotropic Flow Curl Noise (curves flow along poster typography & contours)
          let nx = x * noiseScale;
          let ny = y * noiseScale;
          if (gradMag > 0.04) {
            const ang = Math.atan2(grad.dy, grad.dx) + Math.PI / 2;
            nx += Math.cos(ang) * 0.35;
            ny += Math.sin(ang) * 0.35;
          }
          const n = (simplex.noise2D(nx, ny) + 0.5 * simplex.noise2D(nx * 2, ny * 2)) * 0.18;

          // Force 3: Edge Ridge Accent (makes text, logos, and features pop with crisp elevation)
          const depthMultiplier = 0.6 + (opts.depth / 50) * 0.7;
          const elevation = (dark * 0.72 * depthMultiplier) + (gradMag * 0.38) + globalDome + n * (opts.intensity / 50);
          field[r * cols + c] = Math.max(0, Math.min(1, elevation));
        }
      }

      // Diffusion passes to guarantee silky, continuous, interconnected isocurves
      const blurred = new Float32Array(cols * rows);
      for (let pass = 0; pass < 2; pass++) {
        for (let r = 1; r < rows - 1; r++) {
          for (let c = 1; c < cols - 1; c++) {
            blurred[r * cols + c] = (
              field[(r-1)*cols + (c-1)] + field[(r-1)*cols + c]*2 + field[(r-1)*cols + (c+1)] +
              field[r*cols + (c-1)]*2   + field[r*cols + c]*4     + field[r*cols + (c+1)]*2 +
              field[(r+1)*cols + (c-1)] + field[(r+1)*cols + c]*2 + field[(r+1)*cols + (c+1)]
            ) / 16;
          }
        }
        field.set(blurred);
      }

      // 2. High-Precision Subpixel Isocurve Extraction (Linear-time graph tracing)
      const scale = opts.nibScale || 1.0;
      const isA5 = (opts.paperSize === "a5" || grid.widthMm <= 160);
      const maxLevels = isA5 ? 20 : 34;
      const levelsCount = Math.max(8, Math.floor((12 + (opts.density / 100) * (maxLevels - 12)) / (scale > 1 ? Math.sqrt(scale) : 1.0)));
      const pathsLayer1 = [];
      const pathsLayer2 = [];
      const pathsLayer3 = [];

      for (let l = 1; l <= levelsCount; l++) {
        // Cosine-distributed elevation thresholds (clusters gracefully in contrast areas)
        const normLevel = l / (levelsCount + 1);
        const threshold = 0.5 - 0.5 * Math.cos(normLevel * Math.PI);

        // Trace continuous open curves and closed 360° loops
        const levelPaths = traceIsolines(field, cols, rows, threshold, xMin, yMin, stepMm);
        const isMajorIndex = l % 3 === 0;

        levelPaths.forEach(rawPath => {
          // Filter out tiny noisy specks (< 12mm) to ensure confident plotter pen strokes
          let lenMm = 0;
          for (let i = 0; i < rawPath.length - 1; i++) {
            lenMm += Math.hypot(rawPath[i+1][0] - rawPath[i][0], rawPath[i+1][1] - rawPath[i][1]);
          }
          if (lenMm < 12) return;

          // Apply buttery Chaikin subdivision for luxury print curves
          const smoothed = chaikinSmoothPoints(rawPath, 2);

          if (opts.numColors === 3) {
            // 3-color elevation tiering: Valleys (Layer 1) -> Mid-slopes (Layer 2) -> Summits (Layer 3)
            if (l <= levelsCount / 3) pathsLayer1.push(smoothed);
            else if (l <= (levelsCount * 2) / 3) pathsLayer2.push(smoothed);
            else pathsLayer3.push(smoothed);
          } else if (opts.dualPen || opts.numColors === 2) {
            // Major Index Contours (Layer 1) vs Minor Intermediate Contours (Layer 2)
            if (isMajorIndex) pathsLayer1.push(smoothed);
            else pathsLayer2.push(smoothed);
          } else {
            pathsLayer1.push(smoothed);
          }
        });
      }

      return {
        layer1: optimizePathsTSP(pathsLayer1, 2.0),
        layer2: optimizePathsTSP(pathsLayer2, 2.0),
        layer3: optimizePathsTSP(pathsLayer3, 2.0)
      };
    }
  },

  // 2. ISOMETRIC 3D WIREFRAME MESH (Architectural CAD Terrain)
  // Fully connected continuous lattice: intersecting longitudinal and latitudinal lines
  // drape over the poster in 3D perspective space, extruding shadows and typography upward into
  // an architectural wireframe landscape with near-zero pen lifts.
  flowlines: {
    id: "flowlines",
    name: "3D Wireframe Mesh",
    nameAr: "شبكة فراغية ثلاثية الأبعاد (وايرفريم)",
    badge: "Architectural · CAD",
    desc: "Fully connected 3D perspective grid mesh that extrudes poster depth into a retro-futuristic architectural CAD landscape.",
    descAr: "شبكة سلكية فراغية متصلة بالكامل تجسم عناصر الملصق والتايبوغرافي في مشهد هندسي ثلاثي الأبعاد.",
    icon: "🌐",
    dualPenAvailable: true,
    generate: (grid, opts) => {
      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;
      const drawW = xMax - xMin;
      const drawH = yMax - yMin;

      // Density controls grid density (scaled for nib tip width)
      const scale = opts.nibScale || 1.0;
      const isA5 = (opts.paperSize === "a5" || grid.widthMm <= 160);
      const maxCols = isA5 ? 46 : 80;
      const maxRows = isA5 ? 60 : 110;
      const cols = Math.max(14, Math.floor((22 + (opts.density / 100) * (maxCols - 22)) / (scale > 1 ? Math.sqrt(scale) : 1.0)));
      const rows = Math.max(18, Math.floor((28 + (opts.density / 100) * (maxRows - 28)) / (scale > 1 ? Math.sqrt(scale) : 1.0)));

      const xStep = drawW / (cols - 1);
      const yStep = drawH / (rows - 1);

      // Max 3D elevation peak extrusion
      const maxZ = 5.0 + (opts.intensity / 100) * 20.0;
      const depthPow = 1.4 - (opts.depth / 100) * 0.6;

      // 1. Build 3D Projected Coordinate Mesh: mesh[r][c] = [projX, projY]
      const mesh = [];
      for (let r = 0; r < rows; r++) {
        const row = [];
        const baseY = yMin + r * yStep;
        for (let c = 0; c < cols; c++) {
          const baseX = xMin + c * xStep;
          const dark = grid.getDarkness(baseX, baseY);

          // 3D elevation displacement upwards
          const z = Math.pow(dark, depthPow) * maxZ;
          const projX = baseX;
          const projY = Math.max(grid.marginMm * 0.5, baseY - z * 0.85);

          row.push([projX, projY]);
        }
        mesh.push(row);
      }

      // 2. Generate Fully Connected Continuous Serpentine Paths
      // Horizontal Weave: Sweeps across the sheet, looping smoothly at margins (zero pen lifts!)
      const hPoints = [];
      for (let r = 0; r < rows; r++) {
        const rowPts = mesh[r];
        if (r % 2 === 0) {
          for (let c = 0; c < cols; c++) hPoints.push(rowPts[c]);
        } else {
          for (let c = cols - 1; c >= 0; c--) hPoints.push(rowPts[c]);
        }
      }

      // Vertical Ribs: Sweeps top-to-bottom, looping smoothly across columns
      const vPoints = [];
      for (let c = 0; c < cols; c++) {
        if (c % 2 === 0) {
          for (let r = 0; r < rows; r++) vPoints.push(mesh[r][c]);
        } else {
          for (let r = rows - 1; r >= 0; r--) vPoints.push(mesh[r][c]);
        }
      }

      // Smooth continuous curves
      const horizontalPath = chaikinSmoothPoints(hPoints, 1);
      const verticalPath = chaikinSmoothPoints(vPoints, 1);

      if (opts.numColors === 3) {
        // Layer 1: Horizontal terrain profiles (Pen 1)
        // Layer 2: Vertical perspective ribs (Pen 2)
        // Layer 3: Architectural crest peaks & elevation summits (Pen 3)
        const peakRibs = [];
        for (let r = 0; r < rows; r += 2) {
          const rowPts = mesh[r];
          let elevated = [];
          for (let c = 0; c < cols; c++) {
            const dark = grid.getDarkness(rowPts[c][0], yMin + r * yStep);
            if (dark > 0.45) elevated.push(rowPts[c]);
            else {
              if (elevated.length >= 2) peakRibs.push(chaikinSmoothPoints(elevated, 1));
              elevated = [];
            }
          }
          if (elevated.length >= 2) peakRibs.push(chaikinSmoothPoints(elevated, 1));
        }
        return {
          layer1: [horizontalPath],
          layer2: [verticalPath],
          layer3: peakRibs
        };
      } else if (opts.dualPen || opts.numColors === 2) {
        // Layer 1 = Horizontal terrain profiles (Pen 1)
        // Layer 2 = Vertical perspective ribs (Pen 2)
        return {
          layer1: [horizontalPath],
          layer2: [verticalPath],
          layer3: []
        };
      } else {
        // Single pen draws the entire interconnected 3D wireframe mesh
        return {
          layer1: [horizontalPath, verticalPath],
          layer2: [],
          layer3: []
        };
      }
    }
  },

  // 3. RISOGRAPH SCREEN BLOCKS (Multi-Color Optical Screen Plates)
  // Decomposes poster into 2 or 3 distinct color separation plates (e.g. Shadows, Midtones, Accent)
  // Each plate is hatched at classic print screen angles (15° for Pen 1, 75° for Pen 2, 45° for Pen 3).
  riso_blocks: {
    id: "riso_blocks",
    name: "Risograph Screen Blocks",
    nameAr: "طباعة ريزوغراف شبكية (كتل ألوان)",
    badge: "Multi-Color · Risograph",
    desc: "2 or 3 color separation plates hatched at classic print angles (15°, 75°, 45°) for authentic optical color mixing.",
    descAr: "يقسم الملصق إلى طبقتين أو ثلاث طبقات لونية بزوايا شبكية (15°، 75°، 45°) لتندمج الألوان كطباعة الريزوغراف والحريرية.",
    icon: "🖨️",
    dualPenAvailable: true,
    supports3Colors: true,
    generate: (grid, opts) => {
      const numColors = opts.numColors || (opts.dualPen ? 2 : 1);
      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;
      const drawW = xMax - xMin;
      const drawH = yMax - yMin;

      const scale = opts.nibScale || 1.0;
      const spacing = (3.6 - (opts.density / 100) * 2.2) * scale; // scaled for nib tip
      const sampleStep = Math.max(0.8, 0.8 * Math.sqrt(scale));
      const diag = Math.hypot(drawW, drawH);
      const cx = (xMin + xMax) / 2;
      const cy = (yMin + yMax) / 2;

      const generatePlate = (angleDeg, filterFn) => {
        const rad = (angleDeg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const paths = [];

        const numLines = Math.floor(diag / spacing);
        for (let l = -numLines; l <= numLines; l++) {
          const offset = l * spacing;
          const lx0 = cx + offset * -sin - (diag / 2) * cos;
          const ly0 = cy + offset * cos - (diag / 2) * sin;

          let inDash = false;
          let currentDash = [];

          for (let s = 0; s <= diag; s += sampleStep) {
            const px = lx0 + s * cos;
            const py = ly0 + s * sin;

            if (px < xMin || px > xMax || py < yMin || py > yMax) {
              if (inDash && currentDash.length >= 2) {
                paths.push(currentDash);
                currentDash = [];
                inDash = false;
              }
              continue;
            }

            const dark = grid.getDarkness(px, py);
            const rgb = grid.getRGB(px, py);
            const cmy = grid.getCMY(px, py);

            if (filterFn(dark, rgb, cmy, px, py)) {
              inDash = true;
              currentDash.push([px, py]);
            } else {
              if (inDash && currentDash.length >= 2) {
                paths.push(currentDash);
                currentDash = [];
                inDash = false;
              }
            }
          }

          if (inDash && currentDash.length >= 2) {
            paths.push(currentDash);
          }
        }
        return optimizePathsTSP(paths);
      };

      if (numColors === 1) {
        return {
          layer1: generatePlate(45, (dark) => dark > 0.18),
          layer2: [],
          layer3: []
        };
      } else if (numColors === 2) {
        // 2 Colors (Duotone Riso):
        const l1 = generatePlate(15, (dark) => dark > 0.40);
        const l2 = generatePlate(75, (dark, rgb) => {
          const sat = Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b);
          return (dark > 0.16 && dark <= 0.72) || (sat > 0.22 && dark > 0.12);
        });
        return { layer1: l1, layer2: l2, layer3: [] };
      } else {
        // 3 Colors (Tritone Riso: Tone 1 Shadows, Tone 2 Midtones, Tone 3 Highlights)
        const l1 = generatePlate(15, (dark) => dark >= 0.52);
        const l2 = generatePlate(75, (dark) => dark >= 0.22 && dark < 0.52);
        const l3 = generatePlate(45, (dark) => dark >= 0.06 && dark < 0.22);
        return { layer1: l1, layer2: l2, layer3: l3 };
      }
    }
  },

  // 4. BAUHAUS GEOMETRIC COLOR BLOCKS
  // Decomposes poster into clean architectural rectangular graphic blocks (Mondrian/Bauhaus style),
  // filled with dense continuous serpentine hatches across 2 or 3 distinct pen layers.
  bauhaus_blocks: {
    id: "bauhaus_blocks",
    name: "Bauhaus Geometric Blocks",
    nameAr: "كتل باوهاوس الهندسية (ألوان معمارية)",
    badge: "Constructivist · Graphic",
    desc: "Partitions poster into bold geometric blocks (Mondrian/Bauhaus style), filled with continuous serpentine hatches in 2 or 3 pen layers.",
    descAr: "يحول الملصق إلى كتل هندسية مستطيلة ودائرية جريئة مستوحاة من مدرسة الباوهاوس، معبأة بخطوط متصلة في طبقتين أو ثلاث طبقات لونية.",
    icon: "🎨",
    dualPenAvailable: true,
    supports3Colors: true,
    generate: (grid, opts) => {
      const numColors = opts.numColors || (opts.dualPen ? 2 : 1);
      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;
      const drawW = xMax - xMin;
      const drawH = yMax - yMin;

      const layer1 = [];
      const layer2 = [];
      const layer3 = [];

      const scale = opts.nibScale || 1.0;
      const isA5 = (opts.paperSize === "a5" || grid.widthMm <= 160);
      const gridCols = Math.max(5, Math.floor((8 + (opts.density / 100) * (isA5 ? 10 : 16)) / (scale > 1 ? Math.sqrt(scale) : 1.0)));
      const gridRows = Math.max(7, Math.floor((10 + (opts.density / 100) * (isA5 ? 14 : 22)) / (scale > 1 ? Math.sqrt(scale) : 1.0)));
      const cellW = drawW / gridCols;
      const cellH = drawH / gridRows;
      const hatchSpacing = (isA5 ? (1.7 - (opts.density / 100) * 0.45) : (1.3 - (opts.density / 100) * 0.45)) * scale;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const bx0 = xMin + c * cellW;
          const by0 = yMin + r * cellH;
          const bx1 = bx0 + cellW;
          const by1 = by0 + cellH;
          const bcx = (bx0 + bx1) / 2;
          const bcy = (by0 + by1) / 2;

          const dark = grid.getDarkness(bcx, bcy);
          if (dark < 0.12) continue; // Paper whitespace

          let targetLayer = 1;
          if (numColors === 2) {
            targetLayer = grid.getColorLayer(bcx, bcy, 2) === 0 ? 1 : 2;
          } else if (numColors === 3) {
            const cl = grid.getColorLayer(bcx, bcy, 3);
            targetLayer = cl === 0 ? 1 : (cl === 1 ? 2 : 3);
          }

          const pad = 0.35;
          const x0 = bx0 + pad, x1 = bx1 - pad;
          const y0 = by0 + pad, y1 = by1 - pad;
          const blockPath = [];

          if (targetLayer === 1) {
            // Horizontal serpentine lines (0°)
            const numLines = Math.floor((y1 - y0) / hatchSpacing);
            for (let i = 0; i <= numLines; i++) {
              const y = y0 + i * hatchSpacing;
              if (i % 2 === 0) blockPath.push([x0, y], [x1, y]);
              else blockPath.push([x1, y], [x0, y]);
            }
          } else if (targetLayer === 2) {
            // Diagonal 45° serpentine lines
            const diagDist = (x1 - x0) + (y1 - y0);
            const numLines = Math.floor(diagDist / hatchSpacing);
            let dir = false;
            for (let i = 0; i <= numLines; i++) {
              const d = i * hatchSpacing;
              const pts = [];
              if (y0 + d >= y0 && y0 + d <= y1) pts.push([x0, y0 + d]);
              if (y0 + d - (x1 - x0) >= y0 && y0 + d - (x1 - x0) <= y1) pts.push([x1, y0 + d - (x1 - x0)]);
              if (x0 + d >= x0 && x0 + d <= x1) pts.push([x0 + d, y0]);
              if (x0 + d - (y1 - y0) >= x0 && x0 + d - (y1 - y0) <= x1) pts.push([x0 + d - (y1 - y0), y1]);

              if (pts.length >= 2) {
                if (dir) blockPath.push(pts[0], pts[1]);
                else blockPath.push(pts[1], pts[0]);
                dir = !dir;
              }
            }
          } else {
            // Vertical serpentine lines (90°)
            const numLines = Math.floor((x1 - x0) / hatchSpacing);
            for (let i = 0; i <= numLines; i++) {
              const x = x0 + i * hatchSpacing;
              if (i % 2 === 0) blockPath.push([x, y0], [x, y1]);
              else blockPath.push([x, y1], [x, y0]);
            }
          }

          if (blockPath.length >= 2) {
            if (targetLayer === 1) layer1.push(blockPath);
            else if (targetLayer === 2) layer2.push(blockPath);
            else layer3.push(blockPath);
          }
        }
      }

      return {
        layer1: optimizePathsTSP(layer1),
        layer2: optimizePathsTSP(layer2),
        layer3: optimizePathsTSP(layer3)
      };
    }
  },

  // 5. CHROMATIC VORONOI MOSAIC (Cellular Stained Glass Blocks)
  // Partitions poster into organic polygonal cells clustered into 2 or 3 pen color families.
  // Each cell is drawn with concentric contour shrink-in rings.
  chroma_voronoi: {
    id: "chroma_voronoi",
    name: "Chromatic Voronoi Mosaic",
    nameAr: "فسيفساء فورونوي اللونية",
    badge: "Cellular · Stained Glass",
    desc: "Adaptive cellular mosaic decomposing poster into organic polygonal color tiles partitioned across 2 or 3 pen inks with concentric contour fills.",
    descAr: "فسيفساء هندسية متكيفة تقسم الملصق إلى خلايا مضلعة ملونة موزعة بين قلمين أو ثلاثة أقلام بتدرجات متحدة المركز.",
    icon: "🧩",
    dualPenAvailable: true,
    supports3Colors: true,
    generate: (grid, opts) => {
      const numColors = opts.numColors || (opts.dualPen ? 2 : 1);
      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;
      const drawW = xMax - xMin;
      const drawH = yMax - yMin;

      const layer1 = [];
      const layer2 = [];
      const layer3 = [];

      const prng = new PseudoRandom(opts.seed || 101);
      const scale = opts.nibScale || 1.0;
      const totalSites = Math.max(32, Math.floor((100 + (opts.density / 100) * 220) / (scale > 1 ? scale : 1.0)));
      const sites = [];

      let attempts = 0;
      while (sites.length < totalSites && attempts < totalSites * 20) {
        attempts++;
        const rx = xMin + prng.next() * drawW;
        const ry = yMin + prng.next() * drawH;
        const dark = grid.getDarkness(rx, ry);
        const grad = grid.getGradient(rx, ry);
        const edge = Math.hypot(grad.dx, grad.dy);

        const prob = Math.max(0.12, dark * 0.7 + edge * 0.3);
        if (prng.next() < prob) {
          sites.push({ x: rx, y: ry, dark });
        }
      }

      const sampleStep = 2.2 * (scale > 1 ? Math.sqrt(scale) : 1.0);
      const sCols = Math.floor(drawW / sampleStep) + 1;
      const sRows = Math.floor(drawH / sampleStep) + 1;
      const cellPoints = Array.from({ length: sites.length }, () => []);

      for (let r = 0; r < sRows; r++) {
        const py = yMin + r * sampleStep;
        for (let c = 0; c < sCols; c++) {
          const px = xMin + c * sampleStep;
          let minDist = Infinity;
          let bestIdx = 0;
          for (let s = 0; s < sites.length; s++) {
            const dx = px - sites[s].x;
            const dy = py - sites[s].y;
            const d = dx * dx + dy * dy;
            if (d < minDist) {
              minDist = d;
              bestIdx = s;
            }
          }
          cellPoints[bestIdx].push([px, py]);
        }
      }

      for (let s = 0; s < sites.length; s++) {
        const pts = cellPoints[s];
        if (!pts || pts.length < 4) continue;
        const sx = sites[s].x;
        const sy = sites[s].y;
        const dark = grid.getDarkness(sx, sy);
        if (dark < 0.14) continue;

        let targetLayer = 1;
        if (numColors === 2) {
          targetLayer = grid.getColorLayer(sx, sy, 2) === 0 ? 1 : 2;
        } else if (numColors === 3) {
          const cl = grid.getColorLayer(sx, sy, 3);
          targetLayer = cl === 0 ? 1 : (cl === 1 ? 2 : 3);
        }

        const numTurns = Math.max(1, Math.floor(1 + dark * 2.5));
        const avgR = Math.sqrt(pts.length * (sampleStep * sampleStep) / Math.PI);
        const spiral = [];
        const numVerts = numTurns * 12;

        // Continuous outward spiral per cell (zero pen lifts within the cell)
        for (let v = 0; v <= numVerts; v++) {
          const t = v / numVerts;
          const r = (0.15 + t * 0.85) * avgR * 0.85;
          const th = t * numTurns * Math.PI * 2;
          const px = sx + Math.cos(th) * r;
          const py = sy + Math.sin(th) * r;
          if (px >= xMin && px <= xMax && py >= yMin && py <= yMax) {
            spiral.push([px, py]);
          }
        }

        if (spiral.length >= 3) {
          if (targetLayer === 1) layer1.push(spiral);
          else if (targetLayer === 2) layer2.push(spiral);
          else layer3.push(spiral);
        }
      }

      const weldTol = Math.max(14.0, sampleStep * 5.0);
      return {
        layer1: optimizePathsTSP(layer1, weldTol),
        layer2: optimizePathsTSP(layer2, weldTol),
        layer3: optimizePathsTSP(layer3, weldTol)
      };
    }
  },

  // 6. WATERCOLOR CONTOUR WASHES (Glazed Multi-Tone Bands for Chunky Markers)
  watercolor_wash: {
    id: "watercolor_wash",
    name: "Watercolor Contour Washes",
    nameAr: "تدرجات ألوان مائية عريضة",
    badge: "Chunky Markers · Multi-Color",
    desc: "Bold, wide painterly contour wash ribbons. Sweeping organic strokes create glazed multi-tone washes perfect for chunky markers.",
    descAr: "شرائط كنتورية عريضة انسيابية كضربات فرشاة الألوان المائية الغنية، مصممة للماركرات العريضة لتنتج تدرجات وتداخلات لونية مميزة.",
    icon: "🖌️",
    dualPenAvailable: true,
    supports3Colors: true,
    isWatercolorStyle: true,
    generate: (grid, opts) => {
      const numColors = opts.numColors || (opts.dualPen ? 2 : 1);
      const scale = opts.nibScale || 3.5;
      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;
      const drawW = xMax - xMin;
      const drawH = yMax - yMin;

      const layer1 = [];
      const layer2 = [];
      const layer3 = [];

      // Base band count: 12 to 24 wide painterly wash bands
      const bandCount = Math.max(8, Math.floor((12 + (opts.density / 100) * 14) / Math.sqrt(scale / 2.5)));
      const simplex = new SimplexNoise(opts.seed || 777);

      // Spacing between parallel passes within each wash band (4mm to 7mm for chunky markers)
      const passSpacing = Math.max(2.4, (3.8 - (opts.density / 100) * 1.4) * (scale / 2.5));
      const stepInterval = Math.max(1.2, 1.2 * Math.sqrt(scale / 2.5));

      for (let b = 0; b < bandCount; b++) {
        const normB = (b + 0.5) / bandCount;
        const targetDarkMin = normB * 0.75;
        const targetDarkMax = targetDarkMin + (1.2 / bandCount);

        const baseY = yMin + normB * drawH;
        let targetLayer = layer1;
        if (numColors === 2) {
          targetLayer = normB > 0.48 ? layer1 : layer2;
        } else if (numColors === 3) {
          if (normB > 0.65) targetLayer = layer1;
          else if (normB > 0.32) targetLayer = layer2;
          else targetLayer = layer3;
        }

        const passesInBand = Math.max(2, Math.floor(drawH / (bandCount * passSpacing)));
        for (let p = 0; p < passesInBand; p++) {
          const passY = baseY - (passesInBand * passSpacing) / 2 + p * passSpacing;
          if (passY < yMin || passY > yMax) continue;

          const currentStroke = [];
          const leftToRight = (b + p) % 2 === 0;
          const xStart = leftToRight ? xMin : xMax;
          const stepX = leftToRight ? stepInterval : -stepInterval;
          const numSteps = Math.floor(drawW / stepInterval);

          let inStroke = false;

          for (let s = 0; s <= numSteps; s++) {
            const px = xStart + s * stepX;
            if (px < xMin || px > xMax) continue;

            const fluidWobble = simplex.noise2D(px * 0.015, passY * 0.015) * 4.0 * (opts.intensity / 50);
            const py = Math.max(yMin, Math.min(yMax, passY + fluidWobble));

            const dark = grid.getDarkness(px, py);
            const belongs = dark >= 0.15 && (dark >= targetDarkMin * 0.8 && dark <= targetDarkMax * 1.3);

            if (belongs) {
              inStroke = true;
              currentStroke.push([px, py]);
            } else {
              if (inStroke && currentStroke.length >= 3) {
                targetLayer.push(currentStroke.slice());
                currentStroke.length = 0;
                inStroke = false;
              }
            }
          }

          if (inStroke && currentStroke.length >= 3) {
            targetLayer.push(currentStroke);
          }
        }
      }

      const optTSP = (typeof optimizePathsTSP !== "undefined") ? optimizePathsTSP :
                     ((typeof window !== "undefined" && window.optimizePathsTSP) ? window.optimizePathsTSP : (p => p));

      return {
        layer1: optTSP(layer1),
        layer2: optTSP(layer2),
        layer3: optTSP(layer3)
      };
    }
  },

  // 7. BRUTALIST MARKER BLOCKS (Architectural Sweeps for Broad Tips)
  chunky_blocks: {
    id: "chunky_blocks",
    name: "Brutalist Marker Blocks",
    nameAr: "كتل الماركر الجريئة",
    badge: "Chunky Markers · Bold Graphic",
    desc: "Bold, chunky architectural marker sweeps (4-8mm spacing). High-impact brutalist poster aesthetic tailored for broad tips.",
    descAr: "كتل هندسية ضخمة بضربات ماركر عريضة وقوية (مسافات 4-8 مم)، تمنح الملصق طابعاً بيانياً وتجريدياً فائق الجرأة.",
    icon: "🖍️",
    dualPenAvailable: true,
    supports3Colors: true,
    isWatercolorStyle: true,
    generate: (grid, opts) => {
      const numColors = opts.numColors || (opts.dualPen ? 2 : 1);
      const scale = opts.nibScale || 3.5;
      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;
      const drawW = xMax - xMin;
      const drawH = yMax - yMin;

      const layer1 = [];
      const layer2 = [];
      const layer3 = [];

      const cellSizeMm = Math.max(10, (18 - (opts.density / 100) * 6) * Math.sqrt(scale / 2.5));
      const cols = Math.floor(drawW / cellSizeMm);
      const rows = Math.floor(drawH / cellSizeMm);
      const cellW = drawW / cols;
      const cellH = drawH / rows;

      const strokeSpacing = Math.max(2.8, (4.5 - (opts.density / 100) * 1.5) * (scale / 2.5));

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx0 = xMin + c * cellW;
          const by0 = yMin + r * cellH;
          const bx1 = bx0 + cellW;
          const by1 = by0 + cellH;
          const bcx = (bx0 + bx1) / 2;
          const bcy = (by0 + by1) / 2;

          const dark = grid.getDarkness(bcx, bcy);
          if (dark < 0.12) continue;

          const rgb = grid.getRGB(bcx, bcy);
          const warm = rgb.r - rgb.b;

          let targetList = layer1;
          let angleDeg = 45;

          if (numColors === 1) {
            targetList = layer1;
            angleDeg = dark > 0.55 ? 45 : (dark > 0.3 ? -45 : 0);
          } else if (numColors === 2) {
            if (dark > 0.52) {
              targetList = layer1;
              angleDeg = 45;
            } else {
              targetList = layer2;
              angleDeg = -45;
            }
          } else {
            if (dark > 0.58) {
              targetList = layer1;
              angleDeg = 45;
            } else if (warm > 0.12 || (dark < 0.35 && (c + r) % 3 === 0)) {
              targetList = layer3;
              angleDeg = 90;
            } else {
              targetList = layer2;
              angleDeg = -45;
            }
          }

          const pad = 0.5;
          const x0 = bx0 + pad, x1 = bx1 - pad;
          const y0 = by0 + pad, y1 = by1 - pad;
          const blockPath = [];

          if (angleDeg === 0) {
            const nLines = Math.floor((y1 - y0) / strokeSpacing);
            for (let i = 0; i <= nLines; i++) {
              const y = y0 + i * strokeSpacing;
              if (i % 2 === 0) blockPath.push([x0, y], [x1, y]);
              else blockPath.push([x1, y], [x0, y]);
            }
          } else if (angleDeg === 90) {
            const nLines = Math.floor((x1 - x0) / strokeSpacing);
            for (let i = 0; i <= nLines; i++) {
              const x = x0 + i * strokeSpacing;
              if (i % 2 === 0) blockPath.push([x, y0], [x, y1]);
              else blockPath.push([x, y1], [x, y0]);
            }
          } else if (angleDeg === 45) {
            const diagDist = (x1 - x0) + (y1 - y0);
            const nLines = Math.floor(diagDist / strokeSpacing);
            let dir = false;
            for (let i = 0; i <= nLines; i++) {
              const d = i * strokeSpacing;
              let sx = x0 + d, sy = y0;
              let ex = x0, ey = y0 + d;
              if (sx > x1) { sy += (sx - x1); sx = x1; }
              if (ey > y1) { ex += (ey - y1); ey = y1; }
              if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1 && ex >= x0 && ex <= x1 && ey >= y0 && ey <= y1) {
                if (Math.hypot(ex - sx, ey - sy) > 1.2) {
                  if (dir) blockPath.push([sx, sy], [ex, ey]);
                  else blockPath.push([ex, ey], [sx, sy]);
                  dir = !dir;
                }
              }
            }
          } else {
            const diagDist = (x1 - x0) + (y1 - y0);
            const nLines = Math.floor(diagDist / strokeSpacing);
            let dir = false;
            for (let i = 0; i <= nLines; i++) {
              const d = i * strokeSpacing;
              let sx = x1 - d, sy = y0;
              let ex = x1, ey = y0 + d;
              if (sx < x0) { sy += (x0 - sx); sx = x0; }
              if (ey > y1) { ex -= (ey - y1); ey = y1; }
              if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1 && ex >= x0 && ex <= x1 && ey >= y0 && ey <= y1) {
                if (Math.hypot(ex - sx, ey - sy) > 1.2) {
                  if (dir) blockPath.push([sx, sy], [ex, ey]);
                  else blockPath.push([ex, ey], [sx, sy]);
                  dir = !dir;
                }
              }
            }
          }

          if (blockPath.length >= 2) {
            targetList.push(blockPath);
          }
        }
      }

      const optTSP = (typeof optimizePathsTSP !== "undefined") ? optimizePathsTSP :
                     ((typeof window !== "undefined" && window.optimizePathsTSP) ? window.optimizePathsTSP : (p => p));

      const weldTol = Math.max(9.0, cellW * 0.95);
      return {
        layer1: optTSP(layer1, weldTol),
        layer2: optTSP(layer2, weldTol),
        layer3: optTSP(layer3, weldTol)
      };
    }
  },

  // 8. FLUID WATERCOLOR RIBBONS (Continuous Serpentine Tracks)
  fluid_ribbons: {
    id: "fluid_ribbons",
    name: "Fluid Watercolor Ribbons",
    nameAr: "شرائط انسيابية عريضة",
    badge: "Chunky Markers · Fluid Dynamic",
    desc: "Broad, undulating continuous ribbons weaving across poster forms. Sweeping 3-6mm tracks with organic curl-noise deflection.",
    descAr: "شرائط مائية انسيابية متصلة تتدفق بسلاسة عبر مساحات الملصق بمسارات عريضة (3-6 مم) وتعرجات انسيابية ديناميكية.",
    icon: "🌊",
    dualPenAvailable: true,
    supports3Colors: true,
    isWatercolorStyle: true,
    generate: (grid, opts) => {
      const numColors = opts.numColors || (opts.dualPen ? 2 : 1);
      const scale = opts.nibScale || 3.5;
      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;
      const drawW = xMax - xMin;
      const drawH = yMax - yMin;

      const layer1 = [];
      const layer2 = [];
      const layer3 = [];

      const ribbonCount = Math.max(8, Math.floor((14 + (opts.density / 100) * 16) / Math.sqrt(scale / 2.0)));
      const ribbonSpacing = drawH / ribbonCount;
      const trackGap = Math.max(2.2, 3.2 * (scale / 2.5));
      const simplex = new SimplexNoise(opts.seed || 888);

      for (let r = 0; r < ribbonCount; r++) {
        const startY = yMin + (r + 0.5) * ribbonSpacing;
        const numTracks = 2 + (r % 2);

        let targetList = layer1;
        if (numColors === 2) {
          targetList = r % 2 === 0 ? layer1 : layer2;
        } else if (numColors === 3) {
          const mod = r % 3;
          targetList = mod === 0 ? layer1 : (mod === 1 ? layer2 : layer3);
        }

        const stepMm = Math.max(1.5, 2.0 * Math.sqrt(scale / 2.5));
        const totalSteps = Math.floor(drawW / stepMm);

        for (let t = 0; t < numTracks; t++) {
          const trackOffset = (t - (numTracks - 1) / 2) * trackGap;
          const track = [];
          const leftToRight = t % 2 === 0;
          const x0 = leftToRight ? xMin : xMax;
          const dir = leftToRight ? 1 : -1;

          for (let s = 0; s <= totalSteps; s++) {
            const px = x0 + s * stepMm * dir;
            if (px < xMin || px > xMax) continue;

            const dark = grid.getDarkness(px, startY);
            const grad = grid.getGradient(px, startY);

            const nScale = 0.008;
            const curl = simplex.noise2D(px * nScale, startY * nScale) * 18.0 * (opts.intensity / 50);
            const gradDeflect = grad.dy * 12.0;

            const py = startY + trackOffset + curl + gradDeflect;
            if (py >= yMin && py <= yMax) {
              track.push([px, py]);
            }
          }

          if (track.length >= 4) {
            targetList.push(track);
          }
        }
      }

      const optTSP = (typeof optimizePathsTSP !== "undefined") ? optimizePathsTSP :
                     ((typeof window !== "undefined" && window.optimizePathsTSP) ? window.optimizePathsTSP : (p => p));

      return {
        layer1: optTSP(layer1),
        layer2: optTSP(layer2),
        layer3: optTSP(layer3)
      };
    }
  },

  // 6. CONTINUOUS JORDAN SINGLE-LINE TSP (Zero Pen Lifts!)
  tsp_singleline: {
    id: "tsp_singleline",
    name: "Continuous Single-Line",
    nameAr: "خط متصل لا ينقطع (بدون رفع القلم)",
    badge: "Plotter Holy Grail · 0 Lifts",
    desc: "Draws the entire poster in ONE continuous unbroken line. The pen drops once and never lifts!",
    descAr: "يرسم كامل الملصق بخط واحد متصل تماماً دون رفع القلم ولا مرة واحدة حتى النهاية!",
    icon: "➰",
    dualPenAvailable: false,
    generate: (grid, opts) => {
      const scale = opts.nibScale || 1.0;
      // Calibrated for A5: max 750 points ensures plot never exceeds ~24m (~8 mins max at highest settings!)
      const pointCount = Math.max(100, Math.floor((220 + (opts.density / 100) * 530) / (scale > 1 ? scale : 1.0)));
      const prng = new PseudoRandom(opts.seed || 333);
      const points = [];

      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;

      // Rejection sampling based on poster darkness
      let attempts = 0;
      while (points.length < pointCount && attempts < pointCount * 25) {
        attempts++;
        const rx = xMin + prng.next() * (xMax - xMin);
        const ry = yMin + prng.next() * (yMax - yMin);
        const dark = grid.getDarkness(rx, ry);

        // Density probability
        const prob = Math.pow(dark, 1.2 - (opts.depth / 100) * 0.6);
        if (prng.next() < prob) {
          points.push({ x: rx, y: ry });
        }
      }

      if (points.length < 10) {
        return { layer1: [], layer2: [] };
      }

      // Fast Nearest Neighbor TSP tour
      const tour = [points[0]];
      const visited = new Uint8Array(points.length);
      visited[0] = 1;
      let currIdx = 0;

      for (let step = 1; step < points.length; step++) {
        let bestDist = Infinity;
        let bestIdx = -1;
        const p1 = points[currIdx];

        // Search window to maintain high speed
        const stride = points.length > 1000 ? 2 : 1;
        for (let i = 1; i < points.length; i += stride) {
          if (!visited[i]) {
            const p2 = points[i];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const d = dx * dx + dy * dy;
            if (d < bestDist) {
              bestDist = d;
              bestIdx = i;
            }
          }
        }

        if (bestIdx === -1) {
          for (let i = 1; i < points.length; i++) {
            if (!visited[i]) {
              bestIdx = i;
              break;
            }
          }
        }

        visited[bestIdx] = 1;
        tour.push(points[bestIdx]);
        currIdx = bestIdx;
      }

      // Format as a single continuous polyline
      const singlePath = tour.map(p => [p.x, p.y]);
      // Close the loop cleanly
      singlePath.push([tour[0].x, tour[0].y]);

      return { layer1: [singlePath], layer2: [] };
    }
  },

  // 4. KINETIC WAVE RASTER (Joy Division / Pulsar 3D Mountain Scanlines)
  wave_raster: {
    id: "wave_raster",
    name: "Pulsar 3D Waves",
    nameAr: "موجات تضاريس ثلاثية الأبعاد (بولسار)",
    badge: "Iconic Design",
    desc: "Joy Division style scanlines with wave amplitude and ripple frequency modulated by poster tones.",
    descAr: "موجات أفقية كلاسيكية تتموج وتتفاعل بارتفاعها وترددها حسب تباين وظلال الملصق.",
    icon: "🏔️",
    dualPenAvailable: true,
    generate: (grid, opts) => {
      const scale = opts.nibScale || 1.0;
      const isA5 = (opts.paperSize === "a5" || (grid.widthMm <= 220 && grid.heightMm <= 160) || grid.widthMm <= 160);
      const maxLines = isA5 ? 75 : 125;
      const lineCount = Math.max(16, Math.floor((28 + (opts.density / 100) * (maxLines - 28)) / (scale > 1 ? scale : 1.0)));
      const maxAmpMm = (1.0 + (opts.intensity / 100) * 5.0) * (scale > 1 ? Math.min(1.6, Math.sqrt(scale)) : 1.0);
      const pathsLayer1 = [];
      const pathsLayer2 = [];
      const pathsLayer3 = [];

      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;

      const yStep = (yMax - yMin) / (lineCount - 1);
      const xStep = 0.6 * (scale > 1 ? Math.sqrt(scale) : 1.0); // sampling interval in mm
      const xSamples = Math.floor((xMax - xMin) / xStep) + 1;

      for (let i = 0; i < lineCount; i++) {
        const baseY = yMin + i * yStep;
        const line = [];
        let lineDark = 0;
        const forward = (i % 2 === 0);

        for (let s = 0; s < xSamples; s++) {
          const sampleIdx = forward ? s : (xSamples - 1 - s);
          const x = xMin + sampleIdx * xStep;
          const dark = grid.getDarkness(x, baseY);
          lineDark += dark;

          // Wave displacement upwards with subtle frequency ripple
          const ripple = Math.sin(sampleIdx * 0.45) * 0.3;
          const lift = Math.pow(dark, 1.3) * maxAmpMm * (1.0 + ripple);
          const y = baseY - lift;

          line.push([x, Math.max(grid.marginMm, y)]);
        }

        const avgDark = lineDark / Math.max(1, xSamples);
        let targetList = pathsLayer1;
        if (opts.numColors === 3) {
          if (avgDark >= 0.42) targetList = pathsLayer1;      // Tone 1: Shadows
          else if (avgDark >= 0.18) targetList = pathsLayer2; // Tone 2: Midtones
          else targetList = pathsLayer3;                      // Tone 3: Highlights
        } else if (opts.dualPen || opts.numColors === 2) {
          targetList = (i % 2 === 1) ? pathsLayer2 : pathsLayer1;
        }

        if (line.length >= 2) {
          if (targetList.length > 0) {
            const prev = targetList[targetList.length - 1];
            const prevEnd = prev[prev.length - 1];
            const d = Math.hypot(line[0][0] - prevEnd[0], line[0][1] - prevEnd[1]);
            if (d <= yStep * 2.5) {
              prev.push(...line);
              continue;
            }
          }
          targetList.push(line);
        }
      }

      return {
        layer1: optimizePathsTSP(pathsLayer1, 2.0),
        layer2: optimizePathsTSP(pathsLayer2, 2.0),
        layer3: optimizePathsTSP(pathsLayer3, 2.0)
      };
    }
  },

  // 5. BIO-LABYRINTH & TURING MEANDERS
  reaction_labyrinth: {
    id: "reaction_labyrinth",
    name: "Bio-Labyrinth Meanders",
    nameAr: "متاهة حيوية متعرجة",
    badge: "Organic · Turing",
    desc: "Fingerprint-like reaction-diffusion labyrinths that expand and contract with poster depth.",
    descAr: "ممرات متعرجة عضوية كبصمة الأصبع تضيق وتتسع حسب عمق وتفاصيل الملصق.",
    icon: "🧬",
    dualPenAvailable: true,
    generate: (grid, opts) => {
      const pathsLayer1 = [];
      const pathsLayer2 = [];
      const pathsLayer3 = [];
      // Sized to produce optimal arcs scaled for nib tip
      const scale = opts.nibScale || 1.0;
      const stepGrid = (3.6 - (opts.density / 100) * 1.6) * (scale > 1 ? scale : 1.0);
      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;

      const cols = Math.floor((xMax - xMin) / stepGrid);
      const rows = Math.floor((yMax - yMin) / stepGrid);
      const simplex = new SimplexNoise(opts.seed || 555);

      // Truchet / Meander arcs modulated by poster tone
      for (let r = 0; r < rows; r++) {
        const y = yMin + r * stepGrid;
        for (let c = 0; c < cols; c++) {
          const x = xMin + c * stepGrid;
          const dark = grid.getDarkness(x + stepGrid / 2, y + stepGrid / 2);
          if (dark < 0.08) continue; // skip pure whites

          const n = simplex.noise2D(c * 0.18, r * 0.18);
          const orientation = (n + dark * 0.7) > 0.15 ? 1 : 0;
          let target = pathsLayer1;
          if (opts.numColors === 3) {
            if (dark >= 0.52) target = pathsLayer1;      // Tone 1: Shadows
            else if (dark >= 0.22) target = pathsLayer2; // Tone 2: Midtones
            else target = pathsLayer3;                   // Tone 3: Highlights
          } else if (opts.dualPen || opts.numColors === 2) {
            target = ((c + r) % 2 === 0) ? pathsLayer2 : pathsLayer1;
          }

          // Draw dual diagonal meandering quarter-arcs
          const arcPoints = 5;
          const arc1 = [];
          const arc2 = [];

          if (orientation === 0) {
            // Arcs from top-left and bottom-right
            for (let a = 0; a <= arcPoints; a++) {
              const th = (a / arcPoints) * (Math.PI / 2);
              arc1.push([x + (stepGrid / 2) * Math.cos(th), y + (stepGrid / 2) * Math.sin(th)]);
              arc2.push([
                x + stepGrid - (stepGrid / 2) * Math.cos(th),
                y + stepGrid - (stepGrid / 2) * Math.sin(th)
              ]);
            }
          } else {
            // Arcs from top-right and bottom-left
            for (let a = 0; a <= arcPoints; a++) {
              const th = (a / arcPoints) * (Math.PI / 2);
              arc1.push([
                x + stepGrid - (stepGrid / 2) * Math.sin(th),
                y + (stepGrid / 2) * Math.cos(th)
              ]);
              arc2.push([
                x + (stepGrid / 2) * Math.sin(th),
                y + stepGrid - (stepGrid / 2) * Math.cos(th)
              ]);
            }
          }

          target.push(arc1);
          target.push(arc2);
        }
      }

      const weldTol = Math.max(14.0, stepGrid * 5.0);
      return {
        layer1: optimizePathsTSP(pathsLayer1, weldTol),
        layer2: optimizePathsTSP(pathsLayer2, weldTol),
        layer3: optimizePathsTSP(pathsLayer3, weldTol)
      };
    }
  },

  // 6. BRUTALIST SWISS CROSS-HATCH (Multi-Angle & Dual Pen Ready)
  swiss_hatch: {
    id: "swiss_hatch",
    name: "Brutalist Swiss Hatch",
    nameAr: "تظليل شبكي سويسري بروتاليزم",
    badge: "Architectural Precision",
    desc: "Rigorous Swiss modernist cross-hatching. Layer 1 plots at 45°, Layer 2 at -45° with an accent pen.",
    descAr: "تظليل شبكي هندسي دقيق مستوحى من المدرسة السويسرية، مع فصل ألوان طبقتين بزاوية 45° و -45°.",
    icon: "📐",
    dualPenAvailable: true,
    generate: (grid, opts) => {
      const pathsLayer1 = [];
      const pathsLayer2 = [];
      const pathsLayer3 = [];
      const scale = opts.nibScale || 1.0;
      const isA5 = (opts.paperSize === "a5" || grid.widthMm <= 160);
      const spacing = (isA5 ? (4.2 - (opts.density / 100) * 1.9) : (3.5 - (opts.density / 100) * 2.2)) * (scale > 1 ? scale : 1.0); // mm between hatch lines
      const sampleStep = 0.8 * (scale > 1 ? Math.sqrt(scale) : 1.0);

      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;
      const diag = Math.sqrt((xMax - xMin) ** 2 + (yMax - yMin) ** 2);

      // Generate hatch lines for an angle
      const generateAngleHatch = (angleDeg, thresholdMin, targetLayer) => {
        const rad = (angleDeg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const cx = (xMin + xMax) / 2;
        const cy = (yMin + yMax) / 2;

        const numLines = Math.floor(diag / spacing);
        for (let l = -numLines; l <= numLines; l++) {
          const offset = l * spacing;
          // Line perpendicular to angle
          const lx0 = cx + offset * -sin - (diag / 2) * cos;
          const ly0 = cy + offset * cos - (diag / 2) * sin;

          let inDash = false;
          let currentDash = [];
          let gapCount = 0;

          // Alternate direction for continuous serpentine toolpaths
          const reverse = Math.abs(l) % 2 === 1;
          const sStart = reverse ? diag : 0;
          const sEnd = reverse ? 0 : diag;
          const sStep = reverse ? -sampleStep : sampleStep;

          for (let s = sStart; reverse ? s >= sEnd : s <= sEnd; s += sStep) {
            const px = lx0 + s * cos;
            const py = ly0 + s * sin;

            if (px < xMin || px > xMax || py < yMin || py > yMax) {
              if (inDash && currentDash.length >= 2) {
                targetLayer.push(currentDash);
                currentDash = [];
                inDash = false;
              }
              gapCount = 0;
              continue;
            }

            const dark = grid.getDarkness(px, py);
            if (dark >= thresholdMin) {
              inDash = true;
              currentDash.push([px, py]);
              gapCount = 0;
            } else {
              if (inDash) {
                gapCount++;
                if (gapCount * Math.abs(sStep) <= 6.0) {
                  // Bridge small gap on paper without servo lift
                  currentDash.push([px, py]);
                } else {
                  if (currentDash.length >= 2) {
                    targetLayer.push(currentDash);
                  }
                  currentDash = [];
                  inDash = false;
                  gapCount = 0;
                }
              }
            }
          }

          if (inDash && currentDash.length >= 2) {
            targetLayer.push(currentDash);
          }
        }
      };

      if (opts.numColors === 3) {
        // 3-Color Trio:
        // Layer 1: 45° primary hatch for light-to-midtones (Pen 1)
        generateAngleHatch(45, 0.18, pathsLayer1);
        // Layer 2: -45° cross-hatch for deep shadow regions (Pen 2)
        generateAngleHatch(-45, 0.45, pathsLayer2);
        // Layer 3: 0° horizontal accent line hatches for extreme darks & typography (Pen 3)
        generateAngleHatch(0, 0.70, pathsLayer3);
        const weldTol = Math.max(6.0, spacing * 2.5);
        return {
          layer1: optimizePathsTSP(pathsLayer1, weldTol),
          layer2: optimizePathsTSP(pathsLayer2, weldTol),
          layer3: optimizePathsTSP(pathsLayer3, weldTol)
        };
      } else {
        // Layer 1: 45° primary hatch for light-to-midtones
        generateAngleHatch(45, 0.18, pathsLayer1);

        // Layer 2: -45° cross-hatch for deep shadow regions
        const shadowThreshold = 0.45 - (opts.depth / 100) * 0.15;
        const targetLayer2 = (opts.dualPen || opts.numColors === 2) ? pathsLayer2 : pathsLayer1;
        generateAngleHatch(-45, shadowThreshold, targetLayer2);

        const weldTol = Math.max(6.0, spacing * 2.5);
        return {
          layer1: optimizePathsTSP(pathsLayer1, weldTol),
          layer2: optimizePathsTSP(pathsLayer2, weldTol),
          layer3: []
        };
      }
    }
  },

  // 7. OP-ART CONCENTRIC MOIRÉ
  opart_moire: {
    id: "opart_moire",
    name: "Op-Art Concentric Moiré",
    nameAr: "موجات بصرية دائرية (أوب آرت)",
    badge: "Hypnotic Optical Art",
    desc: "Kinetic concentric rings warped and modulated by poster light and shadow.",
    descAr: "حلقات دائرية بصرية متموجة تنضغط وتتسع بأسلوب فن الخداع البصري الكينتيكي.",
    icon: "🎯",
    dualPenAvailable: true,
    generate: (grid, opts) => {
      const pathsLayer1 = [];
      const pathsLayer2 = [];
      const pathsLayer3 = [];
      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;

      const cx = (xMin + xMax) / 2;
      const cy = (yMin + yMax) / 2;
      const maxR = Math.sqrt((xMax - cx) ** 2 + (yMax - cy) ** 2);
      const scale = opts.nibScale || 1.0;
      const isA5 = (opts.paperSize === "a5" || grid.widthMm <= 160);
      const ringCount = Math.max(12, Math.floor((22 + (opts.density / 100) * (isA5 ? 38 : 85)) / (scale > 1 ? scale : 1.0)));
      const rStep = maxR / ringCount;
      const ampMax = 1.0 + (opts.intensity / 100) * 4.0;

      for (let r = 1; r <= ringCount; r++) {
        const baseR = r * rStep;
        const ptsCount = Math.max(36, Math.floor(baseR * 3));
        const ring = [];
        let targetList = pathsLayer1;
        if (opts.numColors === 3) {
          if (r % 3 === 0) targetList = pathsLayer1;      // Tone 1
          else if (r % 3 === 1) targetList = pathsLayer2; // Tone 2
          else targetList = pathsLayer3;                  // Tone 3
        } else if (opts.dualPen || opts.numColors === 2) {
          targetList = (r % 2 === 1) ? pathsLayer2 : pathsLayer1;
        }

        for (let p = 0; p <= ptsCount; p++) {
          const theta = (p / ptsCount) * Math.PI * 2;
          const probeX = cx + Math.cos(theta) * baseR;
          const probeY = cy + Math.sin(theta) * baseR;

          let radiusMod = baseR;
          if (probeX >= xMin && probeX <= xMax && probeY >= yMin && probeY <= yMax) {
            const dark = grid.getDarkness(probeX, probeY);
            // Ripple wobble based on darkness
            radiusMod += Math.sin(theta * 8) * dark * ampMax;
          }

          const rx = cx + Math.cos(theta) * radiusMod;
          const ry = cy + Math.sin(theta) * radiusMod;

          // Clip to paper margin
          if (rx >= xMin && rx <= xMax && ry >= yMin && ry <= yMax) {
            ring.push([rx, ry]);
          }
        }

        if (ring.length >= 6) {
          targetList.push(ring);
        }
      }

      return {
        layer1: optimizePathsTSP(pathsLayer1, 2.5),
        layer2: optimizePathsTSP(pathsLayer2, 2.5),
        layer3: optimizePathsTSP(pathsLayer3, 2.5)
      };
    }
  },

  // 8. CYBERNETIC GLITCH & ASCII MATRIX
  cyber_glitch: {
    id: "cyber_glitch",
    name: "Cyber Glitch Matrix",
    nameAr: "مصفوفة الغليتش الرقمي المعاصر",
    badge: "Contemporary Brutalist",
    desc: "PWM pulse scanlines and micro-vector glyphs that materialize your poster in digital code.",
    descAr: "نبضات رقمية ورموز تايبوغرافية دقيقة تعيد تشكيل الملصق بجماليات التكنو المعاصرة.",
    icon: "📟",
    dualPenAvailable: true,
    generate: (grid, opts) => {
      const pathsLayer1 = [];
      const pathsLayer2 = [];
      const pathsLayer3 = [];
      const scale = opts.nibScale || 1.0;
      const isA5 = (opts.paperSize === "a5" || grid.widthMm <= 160);
      const lineCount = Math.max(18, Math.floor((36 + (opts.density / 100) * (isA5 ? 54 : 90)) / (scale > 1 ? scale : 1.0)));

      const xMin = grid.marginMm;
      const xMax = grid.widthMm - grid.marginMm;
      const yMin = grid.marginMm;
      const yMax = grid.heightMm - grid.marginMm;

      const yStep = (yMax - yMin) / (lineCount - 1);
      const xStep = 1.2 * (scale > 1 ? Math.sqrt(scale) : 1.0);
      const prng = new PseudoRandom(opts.seed || 999);

      for (let i = 0; i < lineCount; i++) {
        const y = yMin + i * yStep;
        let currentPulse = [];
        let targetList = pathsLayer1;
        if (opts.numColors === 3) {
          if (i % 3 === 0) targetList = pathsLayer1;      // Tone 1
          else if (i % 3 === 1) targetList = pathsLayer2; // Tone 2
          else targetList = pathsLayer3;                  // Tone 3
        } else if (opts.dualPen || opts.numColors === 2) {
          targetList = (i % 2 === 1) ? pathsLayer2 : pathsLayer1;
        }

        const reverse = i % 2 === 1;
        const xStart = reverse ? xMax : xMin;
        const xEnd = reverse ? xMin : xMax;
        const stepX = reverse ? -xStep : xStep;

        for (let x = xStart; reverse ? x >= xEnd : x <= xEnd; x += stepX) {
          const dark = grid.getDarkness(x, y);

          if (dark > 0.2) {
            // Pulse active!
            const glitchOffset = prng.next() < 0.08 ? (prng.next() - 0.5) * 1.5 : 0;
            currentPulse.push([x, y + glitchOffset]);

            // In deep shadows, draw micro tick accents as a continuous vertical spike (ZERO pen lifts!)
            if (dark > 0.65 && prng.next() < 0.25) {
              const tickH = 0.8 + dark * 1.2;
              currentPulse.push([x, y - tickH / 2]);
              currentPulse.push([x, y + tickH / 2]);
              currentPulse.push([x, y + glitchOffset]);
            }
          } else {
            if (currentPulse.length >= 2) {
              targetList.push(currentPulse);
              currentPulse = [];
            }
          }
        }

        if (currentPulse.length >= 2) {
          targetList.push(currentPulse);
        }
      }

      return {
        layer1: optimizePathsTSP(pathsLayer1, 2.5),
        layer2: optimizePathsTSP(pathsLayer2, 2.5),
        layer3: optimizePathsTSP(pathsLayer3, 2.5)
      };
    }
  }
};

/**
 * Utility: Link segment soup into long continuous polylines
 */
function linkSegments(segments, tolerance = 1.0) {
  if (!segments || segments.length === 0) return [];
  const tolSq = tolerance * tolerance;
  const paths = [];
  const remaining = segments.slice();

  while (remaining.length > 0) {
    const seg = remaining.pop();
    let path = [seg[0], seg[1]];
    let extended = true;

    while (extended) {
      extended = false;
      const pTail = path[path.length - 1];
      const pHead = path[0];

      for (let i = remaining.length - 1; i >= 0; i--) {
        const s = remaining[i];
        // Connect to tail
        const dTailStart = distSq(pTail, s[0]);
        const dTailEnd = distSq(pTail, s[1]);
        if (dTailStart < tolSq) {
          path.push(s[1]);
          remaining.splice(i, 1);
          extended = true;
          break;
        } else if (dTailEnd < tolSq) {
          path.push(s[0]);
          remaining.splice(i, 1);
          extended = true;
          break;
        }

        // Connect to head
        const dHeadStart = distSq(pHead, s[0]);
        const dHeadEnd = distSq(pHead, s[1]);
        if (dHeadEnd < tolSq) {
          path.unshift(s[0]);
          remaining.splice(i, 1);
          extended = true;
          break;
        } else if (dHeadStart < tolSq) {
          path.unshift(s[1]);
          remaining.splice(i, 1);
          extended = true;
          break;
        }
      }
    }
    paths.push(path);
  }
  return paths;
}

function distSq(p1, p2) {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return dx * dx + dy * dy;
}

/**
 * Chaikin's Corner Cutting algorithm for smooth organic curves
 */
function chaikinSmoothPoints(pts, iterations = 2) {
  let curr = pts;
  for (let it = 0; it < iterations; it++) {
    if (curr.length < 3) break;
    const next = [curr[0]];
    for (let i = 0; i < curr.length - 1; i++) {
      const p0 = curr[i];
      const p1 = curr[i + 1];
      next.push([0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]]);
      next.push([0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]]);
    }
    next.push(curr[curr.length - 1]);
    curr = next;
  }
  return curr;
}

/**
 * Linear-Time O(N) Subpixel Continuous Isoline & Loop Tracer
 */
function traceIsolines(vals, W, H, threshold, originX, originY, step) {
  const edges = new Map();

  function getHEdge(x, y) {
    const id = "H_" + x + "_" + y;
    if (edges.has(id)) return edges.get(id);
    const v0 = vals[y * W + x];
    const v1 = vals[y * W + (x + 1)];
    const t = (threshold - v0) / (v1 - v0 || 0.0001);
    const pt = { id, x: originX + (x + t) * step, y: originY + y * step, links: [] };
    edges.set(id, pt);
    return pt;
  }

  function getVEdge(x, y) {
    const id = "V_" + x + "_" + y;
    if (edges.has(id)) return edges.get(id);
    const v0 = vals[y * W + x];
    const v1 = vals[(y + 1) * W + x];
    const t = (threshold - v0) / (v1 - v0 || 0.0001);
    const pt = { id, x: originX + x * step, y: originY + (y + t) * step, links: [] };
    edges.set(id, pt);
    return pt;
  }

  for (let y = 0; y < H - 1; y++) {
    for (let x = 0; x < W - 1; x++) {
      const v0 = vals[y * W + x];
      const v1 = vals[y * W + (x + 1)];
      const v2 = vals[(y + 1) * W + (x + 1)];
      const v3 = vals[(y + 1) * W + x];

      let cell = 0;
      if (v0 >= threshold) cell |= 1;
      if (v1 >= threshold) cell |= 2;
      if (v2 >= threshold) cell |= 4;
      if (v3 >= threshold) cell |= 8;

      if (cell === 0 || cell === 15) continue;

      const top = () => getHEdge(x, y);
      const right = () => getVEdge(x + 1, y);
      const bottom = () => getHEdge(x, y + 1);
      const left = () => getVEdge(x, y);

      function connect(pA, pB) {
        pA.links.push(pB);
        pB.links.push(pA);
      }

      switch (cell) {
        case 1: case 14: connect(left(), top()); break;
        case 2: case 13: connect(top(), right()); break;
        case 3: case 12: connect(left(), right()); break;
        case 4: case 11: connect(right(), bottom()); break;
        case 5: connect(left(), top()); connect(right(), bottom()); break;
        case 6: case 9: connect(top(), bottom()); break;
        case 7: case 8: connect(left(), bottom()); break;
        case 10: connect(left(), bottom()); connect(top(), right()); break;
      }
    }
  }

  const visited = new Set();
  const paths = [];

  // Traverse open paths first (endpoints have degree 1)
  for (const pt of edges.values()) {
    if (pt.links.length === 1 && !visited.has(pt.id)) {
      const path = [[pt.x, pt.y]];
      visited.add(pt.id);
      let curr = pt;
      while (true) {
        const next = curr.links.find(n => !visited.has(n.id));
        if (!next) break;
        visited.add(next.id);
        path.push([next.x, next.y]);
        curr = next;
      }
      if (path.length >= 4) paths.push(path);
    }
  }

  // Traverse closed loops (degrees == 2)
  for (const pt of edges.values()) {
    if (!visited.has(pt.id)) {
      const path = [[pt.x, pt.y]];
      visited.add(pt.id);
      let curr = pt;
      while (true) {
        const next = curr.links.find(n => !visited.has(n.id));
        if (!next) break;
        visited.add(next.id);
        path.push([next.x, next.y]);
        curr = next;
      }
      if (path.length >= 6) {
        path.push([path[0][0], path[0][1]]);
        paths.push(path);
      }
    }
  }

  return paths;
}
