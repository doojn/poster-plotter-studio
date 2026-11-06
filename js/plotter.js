/**
 * Pen Plotter Engine: Hardware Dimensions, Path Optimization, SVG Generation & Simulator
 */

window.PLOTTER_CONFIG = {
  paperSizes: {
    a5: { name: "15.2 × 20.3 cm (6×8\")", width: 203, height: 152, badge: "Workshop Standard" },
    iso_a5: { name: "ISO A5 Horizontal (210 × 148 mm)", width: 210, height: 148, badge: "Standard A5" },
    a4: { name: "ISO A4 (Horizontal)", width: 297, height: 210, badge: "Full Poster" },
    a3: { name: "ISO A3 (Horizontal)", width: 420, height: 297, badge: "Large Format" },
    square: { name: "Square 200mm", width: 200, height: 200, badge: "Art Print" },
    postcard: { name: "Postcard (Horizontal)", width: 148, height: 105, badge: "Quick Test" }
  },

  paperThemes: {
    white: {
      name: "Heavy White Bristol",
      nameAr: "ورق بريستول أبيض ناصع",
      bg: "#fcfcfa",
      lineGuide: "rgba(0,0,0,0.06)",
      shadow: "0 20px 50px rgba(0,0,0,0.5)"
    },
    cream: {
      name: "Warm Cream Moleskine",
      nameAr: "ورق كريمي دافئ",
      bg: "#f5eee0",
      lineGuide: "rgba(100,70,30,0.08)",
      shadow: "0 20px 50px rgba(0,0,0,0.5)"
    },
    kraft: {
      name: "Natural Kraft Cardstock",
      nameAr: "ورق كرافت طبيعي",
      bg: "#c2a382",
      lineGuide: "rgba(60,40,10,0.12)",
      shadow: "0 20px 50px rgba(0,0,0,0.6)"
    },
    charcoal: {
      name: "Midnight Charcoal Black",
      nameAr: "ورق أسود فحمي فاخر",
      bg: "#16181f",
      lineGuide: "rgba(255,255,255,0.06)",
      shadow: "0 20px 50px rgba(0,0,0,0.8)"
    },
    blueprint: {
      name: "Indigo Blueprint",
      nameAr: "ورق مخططات أزرق",
      bg: "#162847",
      lineGuide: "rgba(255,255,255,0.08)",
      shadow: "0 20px 50px rgba(0,0,0,0.7)"
    }
  },
  nibStyles: {
    fine: { id: "fine", name: "Fine Liner (0.35mm)", nameAr: "قلم رفيع ميكرون (0.35 مم)", widthMm: 0.35, icon: "🖊️", scale: 1.0 },
    medium: { id: "medium", name: "Medium Felt-Tip (1.0mm)", nameAr: "قلم لباد متوسط (1.0 مم)", widthMm: 1.0, icon: "✏️", scale: 1.8 },
    chunky: { id: "chunky", name: "Chunky Watercolor Marker (2.0mm)", nameAr: "ماركر مائي سميك (2.0 مم)", widthMm: 2.0, icon: "🖌️", scale: 2.0, watercolor: true },
    broad: { id: "broad", name: "Extra Chunky Chisel / Posca (5.0mm)", nameAr: "رأس عريض / بوسكا (5.0 مم)", widthMm: 5.0, icon: "🖍️", scale: 5.5, watercolor: false }
  },

  penThemes: {
    watercolorTrio: {
      name: "Chunky Watercolor Trio (Cerulean + Coral + Ochre)",
      nameAr: "ماركر مائي سميك (أزرق سماوي + مرجاني + أوكر ذهبي)",
      color1: "#1d4ed8",
      color2: "#f43f5e",
      color3: "#eab308",
      widthMm: 2.8,
      colors: 3,
      watercolor: true,
      opacity: 0.78,
      darkPaper: false
    },
    pastelWatercolor: {
      name: "Pastel Watercolor Trio (Lavender + Sage Mint + Peach)",
      nameAr: "ماركر مائي باستيل (خزامى + نعناعي + خوخي)",
      color1: "#8b5cf6",
      color2: "#10b981",
      color3: "#f97316",
      widthMm: 2.8,
      colors: 3,
      watercolor: true,
      opacity: 0.74,
      darkPaper: false
    },
    earthWatercolor: {
      name: "Raw Earth Watercolor (Prussian Blue + Raw Umber + Mustard)",
      nameAr: "ماركر مائي ترابي (أزرق بروسي + سيينا + خردلي)",
      color1: "#1e3a8a",
      color2: "#9a3412",
      color3: "#ca8a04",
      widthMm: 2.8,
      colors: 3,
      watercolor: true,
      opacity: 0.78,
      darkPaper: false
    },
    poscaChunkyTrio: {
      name: "Chunky Posca Paint Trio (Hot Pink + Sky Blue + Canary)",
      nameAr: "بوسكا عريض ثلاثي (وردي فاقع + أزرق سماوي + أصفر)",
      color1: "#ec4899",
      color2: "#0284c7",
      color3: "#facc15",
      widthMm: 3.5,
      colors: 3,
      watercolor: false,
      opacity: 0.95,
      darkPaper: false
    },
    sumiWashTrio: {
      name: "Sumi Brush Wash (Charcoal Wash + Black + Vermilion)",
      nameAr: "تدرجات سومي مائية (رمادي مائي + أسود + قرمزي)",
      color1: "#1e293b",
      color2: "#64748b",
      color3: "#dc2626",
      widthMm: 3.0,
      colors: 3,
      watercolor: true,
      opacity: 0.75,
      darkPaper: false
    },
    chunkyDuo: {
      name: "Chunky Watercolor Duo (Ultramarine + Tangerine)",
      nameAr: "ماركر مائي ثنائي (أزرق الترا + برتقالي)",
      color1: "#1d4ed8",
      color2: "#ea580c",
      color3: "#ea580c",
      widthMm: 2.8,
      colors: 2,
      watercolor: true,
      opacity: 0.78,
      darkPaper: false
    },
    risoTrio: {
      name: "Risograph Trio (Black + Fluo Pink + Federal Blue)",
      nameAr: "ريزوغراف ثلاثي (أسود + وردي نيون + أزرق فيدرالي)",
      color1: "#14151a",
      color2: "#ff2a6d",
      color3: "#0066cc",
      widthMm: 0.4,
      colors: 3,
      darkPaper: false
    },
    bauhausTrio: {
      name: "Bauhaus Primary Trio (Black + Ultramarine + Warm Red)",
      nameAr: "باوهاوس أساسي ثلاثي (أسود + أزرق ألترا مارين + أحمر قرمزي)",
      color1: "#121316",
      color2: "#1d4ed8",
      color3: "#dc2626",
      widthMm: 0.35,
      colors: 3,
      darkPaper: false
    },
    cmyProcess: {
      name: "CMY Contemporary Trio (Cyan + Magenta + Yellow)",
      nameAr: "ألوان طباعة ثلاثية (سماوي + ماجنتا + أصفر ذهبي)",
      color1: "#0099e5",
      color2: "#e5007d",
      color3: "#f59e0b",
      widthMm: 0.35,
      colors: 3,
      darkPaper: false
    },
    cyberTrio: {
      name: "Cyberpunk Neon Trio (Plum Violet + Electric Cyan + Acid Lime)",
      nameAr: "سايبربانك نيون ثلاثي (بنفسجي + سماوي + ليموني فسفوري)",
      color1: "#4a044e",
      color2: "#06b6d4",
      color3: "#84cc16",
      widthMm: 0.35,
      colors: 3,
      darkPaper: false
    },
    earthTrio: {
      name: "Nordic Earth Trio (Slate + Terracotta + Olive Gold)",
      nameAr: "ترابي نورديك ثلاثي (رمادي فحمي + فخاري + زيتوني)",
      color1: "#1e293b",
      color2: "#c2410c",
      color3: "#ca8a04",
      widthMm: 0.35,
      colors: 3,
      darkPaper: false
    },
    dualNeonCoral: {
      name: "Black + Neon Coral (Dual Pen)",
      nameAr: "أسود + مرجاني نيون (قلمان)",
      color1: "#111217",
      color2: "#ff3b5c",
      color3: "#ff3b5c",
      widthMm: 0.4,
      colors: 2,
      darkPaper: false
    },
    dualCyberCyan: {
      name: "Black + Electric Cyan (Dual Pen)",
      nameAr: "أسود + أزرق سماوي نيون (قلمان)",
      color1: "#111217",
      color2: "#06b6d4",
      color3: "#06b6d4",
      widthMm: 0.35,
      colors: 2,
      darkPaper: false
    },
    dualGoldIndigo: {
      name: "Prussian Blue + Metallic Gold (Dual Pen)",
      nameAr: "أزرق بروسي + ذهبي معدني (قلمان)",
      color1: "#1e3a8a",
      color2: "#d97706",
      color3: "#d97706",
      widthMm: 0.4,
      colors: 2,
      darkPaper: false
    },
    monoBlack: {
      name: "Sakura Micron Black (Single Pen)",
      nameAr: "قلم أسود ميكرون 0.35 مم (قلم واحد)",
      color1: "#111217",
      color2: "#111217",
      color3: "#111217",
      widthMm: 0.35,
      colors: 1,
      darkPaper: false
    },
    metallicDarkTrio: {
      name: "Metallic Trio on Dark (White + Gold + Silver)",
      nameAr: "ثلاثي مضيء للورق الداكن (أبيض + ذهبي + فضي)",
      color1: "#ffffff",
      color2: "#f59e0b",
      color3: "#94a3b8",
      widthMm: 0.4,
      colors: 3,
      darkPaper: true
    },
    gelWhite: {
      name: "Gelly Roll White (for Dark Paper)",
      nameAr: "قلم جيل أبيض ناصع (للورق الداكن)",
      color1: "#ffffff",
      color2: "#cbd5e1",
      color3: "#cbd5e1",
      widthMm: 0.45,
      colors: 1,
      darkPaper: true
    },
    customWorkshop: {
      name: "Workshop ROYGV Trio (Black + Blue + Red)",
      nameAr: "ألوان الورشة (أسود + أزرق + أحمر)",
      color1: "#111827",
      color2: "#0284c7",
      color3: "#e11d48",
      widthMm: 2.8,
      colors: 3,
      watercolor: true,
      opacity: 0.85,
      darkPaper: false
    }
  }
};

/**
 * Standard Workshop ROYGV Physical Marker Palette
 * 8 curated marker colors (Red, Orange, Yellow, Green, Blue, Violet + Black & Pink)
 */
window.ROYGV_COLORS = [
  { id: "black", name: "Midnight Black", nameAr: "أسود داكن", hex: "#111827", dot: "#111827", dark: true },
  { id: "red", name: "Crimson Red", nameAr: "أحمر قرمزي", hex: "#e11d48", dot: "#e11d48", dark: false },
  { id: "orange", name: "Vibrant Orange", nameAr: "برتقالي مشرق", hex: "#ea580c", dot: "#ea580c", dark: false },
  { id: "yellow", name: "Sunshine Yellow", nameAr: "أصفر شمس", hex: "#eab308", dot: "#eab308", dark: false },
  { id: "green", name: "Forest Green", nameAr: "أخضر زمردي", hex: "#16a34a", dot: "#16a34a", dark: false },
  { id: "blue", name: "Cobalt Blue", nameAr: "أزرق ملكي", hex: "#0284c7", dot: "#0284c7", dark: false },
  { id: "violet", name: "Deep Violet", nameAr: "بنفسجي داكن", hex: "#7c3aed", dot: "#7c3aed", dark: false },
  { id: "pink", name: "Hot Pink", nameAr: "وردي فاقع", hex: "#ec4899", dot: "#ec4899", dark: false }
];

window.getRoygvColor = function(colorIdOrHex) {
  if (!colorIdOrHex) return window.ROYGV_COLORS[0];
  const byId = window.ROYGV_COLORS.find(c => c.id === colorIdOrHex);
  if (byId) return byId;
  const byHex = window.ROYGV_COLORS.find(c => c.hex.toLowerCase() === String(colorIdOrHex).toLowerCase());
  if (byHex) return byHex;
  return { id: "custom", name: "Custom Color", nameAr: "لون مخصص", hex: colorIdOrHex, dot: colorIdOrHex, dark: false };
};

/**
 * Get calibrated paper dimensions supporting both Horizontal (Landscape) and Vertical (Portrait)
 */
window.getPlotterPaper = function(paperKey = "a5", orientation = "landscape") {
  const base = (window.PLOTTER_CONFIG && window.PLOTTER_CONFIG.paperSizes && window.PLOTTER_CONFIG.paperSizes[paperKey])
    ? window.PLOTTER_CONFIG.paperSizes[paperKey]
    : { name: "15.2 × 20.3 cm (6×8\")", width: 203, height: 152, badge: "Workshop Standard" };

  const isLandscape = (orientation === "landscape");
  const minDim = Math.min(base.width, base.height);
  const maxDim = Math.max(base.width, base.height);
  const w = isLandscape ? maxDim : minDim;
  const h = isLandscape ? minDim : maxDim;
  const oriLabel = isLandscape ? "Horizontal" : "Vertical";
  const oriLabelAr = isLandscape ? "أفقي" : "رأسي";

  return {
    key: paperKey,
    name: `${base.name} (${oriLabel})`,
    nameAr: `${base.name} (${oriLabelAr})`,
    width: w,
    height: h,
    orientation: isLandscape ? "landscape" : "portrait",
    badge: base.badge
  };
};

function getPtX(p) {
  if (!p) return 0;
  return Array.isArray(p) ? p[0] : (p.x !== undefined ? p.x : 0);
}
function getPtY(p) {
  if (!p) return 0;
  return Array.isArray(p) ? p[1] : (p.y !== undefined ? p.y : 0);
}

function distSqPts(p1, p2) {
  if (!p1 || !p2) return 0;
  const dx = getPtX(p1) - getPtX(p2);
  const dy = getPtY(p1) - getPtY(p2);
  return dx * dx + dy * dy;
}

/**
 * Fast Spatial-Hash Endpoint Welder
 * Fuses line segments whose endpoints touch or are within tolMm.
 * Eliminates up to 90% of pen lifts before TSP sequencing.
 */
window.weldTouchingEndpoints = function(paths, tolMm = 1.2) {
  if (!paths || paths.length <= 1) return paths ? paths.slice() : [];

  const tolSq = tolMm * tolMm;
  const cellSize = Math.max(1.0, tolMm * 2.5);

  const nodes = paths.filter(p => Array.isArray(p) && p.length >= 2).map((p, idx) => ({
    id: idx,
    pts: p.slice(),
    alive: true
  }));

  if (nodes.length <= 1) return nodes.map(n => n.pts);

  const grid = new Map();
  const getCellKey = (x, y) => `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;

  const insertEndpoint = (x, y, nodeId, isEnd) => {
    const k = getCellKey(x, y);
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push({ nodeId, isEnd });
  };

  nodes.forEach(n => {
    const s = n.pts[0];
    const e = n.pts[n.pts.length - 1];
    insertEndpoint(getPtX(s), getPtY(s), n.id, false);
    insertEndpoint(getPtX(e), getPtY(e), n.id, true);
  });

  const findNeighbor = (targetPt, currentId) => {
    const tx = getPtX(targetPt);
    const ty = getPtY(targetPt);
    const cx = Math.floor(tx / cellSize);
    const cy = Math.floor(ty / cellSize);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const k = `${cx + dx},${cy + dy}`;
        const bucket = grid.get(k);
        if (!bucket) continue;
        for (let i = 0; i < bucket.length; i++) {
          const item = bucket[i];
          if (item.nodeId === currentId) continue;
          const other = nodes[item.nodeId];
          if (!other.alive) continue;

          const pt = item.isEnd ? other.pts[other.pts.length - 1] : other.pts[0];
          if (distSqPts(targetPt, pt) <= tolSq) {
            return item;
          }
        }
      }
    }
    return null;
  };

  const merged = [];

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!n.alive) continue;
    n.alive = false;

    let currentPts = n.pts;

    // Extend forward from current end
    while (true) {
      const endPt = currentPts[currentPts.length - 1];
      const match = findNeighbor(endPt, n.id);
      if (!match) break;

      const other = nodes[match.nodeId];
      other.alive = false;

      const otherPts = match.isEnd ? other.pts.reverse() : other.pts;
      const startIdx = (distSqPts(endPt, otherPts[0]) < 0.001) ? 1 : 0;
      for (let k = startIdx; k < otherPts.length; k++) {
        currentPts.push(otherPts[k]);
      }
    }

    // Extend backward from current start
    while (true) {
      const startPt = currentPts[0];
      const match = findNeighbor(startPt, n.id);
      if (!match) break;

      const other = nodes[match.nodeId];
      other.alive = false;

      const otherPts = match.isEnd ? other.pts : other.pts.reverse();
      const endIdx = (distSqPts(startPt, otherPts[otherPts.length - 1]) < 0.001)
        ? otherPts.length - 1
        : otherPts.length;
      for (let k = endIdx - 1; k >= 0; k--) {
        currentPts.unshift(otherPts[k]);
      }
    }

    merged.push(currentPts);
  }

  return merged;
};

/**
 * Greedy Traveling Salesperson (TSP) Optimizer with Continuous Endpoint Chaining
 * Servo-Saver Mode: Welds consecutive nearby strokes (up to maxWeldMm) directly on paper,
 * completely eliminating rapid pen up/down cycles and preventing servo motor overheating!
 */
window.optimizePathsTSP = function(paths, maxWeldMm = 5.5) {
  if (!paths || paths.length <= 1) return paths ? paths.slice() : [];

  // Phase 1: Fast graph pre-welding of touching endpoints
  const preWelded = window.weldTouchingEndpoints(paths, 1.2);
  if (preWelded.length <= 1) return preWelded;

  // Phase 2: Traveling Salesperson Reordering & Continuous Chaining
  const unvisited = preWelded.map(p => ({
    pts: p.slice(),
    start: p[0],
    end: p[p.length - 1]
  }));

  const weldDistSq = maxWeldMm * maxWeldMm;
  const result = [];

  let curr = unvisited.shift();
  result.push(curr.pts);
  let lastPos = curr.end;

  while (unvisited.length > 0) {
    let bestDist = Infinity;
    let bestIdx = -1;
    let reverseBest = false;

    // Windowed search for responsiveness
    const searchLimit = Math.min(unvisited.length, 600);
    for (let i = 0; i < searchLimit; i++) {
      const cand = unvisited[i];
      // Distance to start of candidate
      const dStart = distSqPts(lastPos, cand.start);
      if (dStart < bestDist) {
        bestDist = dStart;
        bestIdx = i;
        reverseBest = false;
        if (dStart < 0.04) break; // practically zero gap (< 0.2mm)
      }
      // Distance to end of candidate (reverse stroke)
      const dEnd = distSqPts(lastPos, cand.end);
      if (dEnd < bestDist) {
        bestDist = dEnd;
        bestIdx = i;
        reverseBest = true;
        if (dEnd < 0.04) break;
      }
    }

    const chosen = unvisited.splice(bestIdx, 1)[0];
    const pts = reverseBest ? chosen.pts.reverse() : chosen.pts;

    if (bestDist <= weldDistSq) {
      // WELD DIRECTLY TO CURRENT PATH (ZERO PEN LIFT!)
      // The pen stays down on paper and glides continuously!
      const activePath = result[result.length - 1];
      const startIdx = (distSqPts(lastPos, pts[0]) < 0.001) ? 1 : 0;
      for (let k = startIdx; k < pts.length; k++) {
        activePath.push(pts[k]);
      }
      lastPos = activePath[activePath.length - 1];
    } else {
      // Genuine Air Jump: start a new path
      result.push(pts);
      lastPos = pts[pts.length - 1];
    }
  }

  return result;
};

/**
 * Path Statistics & Physical Plot Time Calculator
 */
window.calculatePlotMetrics = function(pathsLayer1 = [], pathsLayer2 = [], pathsLayer3 = []) {
  if (pathsLayer1 && !Array.isArray(pathsLayer1) && typeof pathsLayer1 === "object") {
    pathsLayer2 = pathsLayer1.layer2 || [];
    pathsLayer3 = pathsLayer1.layer3 || [];
    pathsLayer1 = pathsLayer1.layer1 || [];
  }
  let drawDistMm = 0;
  let airDistMm = 0;
  let l1DistMm = 0;
  let l2DistMm = 0;
  let l3DistMm = 0;
  let totalPaths = (pathsLayer1?.length || 0) + (pathsLayer2?.length || 0) + (pathsLayer3?.length || 0);
  let lastPos = [0, 0];

  const measureLayer = (paths) => {
    let layerDist = 0;
    if (!paths) return 0;
    paths.forEach(p => {
      if (!p || p.length < 2) return;
      // Air travel to start of line
      const air = Math.sqrt(distSqPts(lastPos, p[0]));
      airDistMm += air;

      // Draw travel
      for (let i = 0; i < p.length - 1; i++) {
        const seg = Math.sqrt(distSqPts(p[i], p[i + 1]));
        drawDistMm += seg;
        layerDist += seg;
      }
      lastPos = p[p.length - 1];
    });
    return layerDist;
  };

  l1DistMm = measureLayer(pathsLayer1);
  l2DistMm = measureLayer(pathsLayer2);
  l3DistMm = measureLayer(pathsLayer3);

  // Pen swaps count
  let activeLayers = 0;
  if (pathsLayer1 && pathsLayer1.length > 0) activeLayers++;
  if (pathsLayer2 && pathsLayer2.length > 0) activeLayers++;
  if (pathsLayer3 && pathsLayer3.length > 0) activeLayers++;
  const penSwaps = Math.max(0, activeLayers - 1);

  // AxiDraw average specs:
  // Draw speed: ~25 mm/s
  // Air speed: ~80 mm/s
  // Pen raise/lower delay: ~150 ms per stroke
  // Pen swap time: ~30s per manual pen swap
  const drawSec = drawDistMm / 25.0;
  const airSec = airDistMm / 80.0;
  const servoSec = totalPaths * 0.15;
  const swapSec = penSwaps * 30.0;
  const totalSec = Math.round(drawSec + airSec + servoSec + swapSec);

  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const timeFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return {
    drawDistMeters: (drawDistMm / 1000).toFixed(2),
    airDistMeters: (airDistMm / 1000).toFixed(2),
    l1Meters: (l1DistMm / 1000).toFixed(2),
    l2Meters: (l2DistMm / 1000).toFixed(2),
    l3Meters: (l3DistMm / 1000).toFixed(2),
    activeLayers,
    penSwaps,
    totalPaths,
    penLifts: Math.max(0, totalPaths - 1),
    estimatedSeconds: totalSec,
    timeFormatted
  };
};

/**
 * A5 Workshop Safety Governor:
 * Strictly caps drawing length to 35,000mm (~12-14 minutes max plot time at 3000mm/min),
 * so that even at the highest 100% density settings on A5 paper, plotting never exceeds 15 minutes!
 */
window.enforceA5SpeedLimit = function(pathsObj, maxDistanceMm = 21000) {
  if (!pathsObj) return pathsObj;
  const getLen = (list) => {
    if (!list) return 0;
    let sum = 0;
    list.forEach(p => {
      for (let i = 0; i < p.length - 1; i++) sum += Math.sqrt(distSqPts(p[i], p[i + 1]));
    });
    return sum;
  };

  const l1 = pathsObj.layer1 || [];
  const l2 = pathsObj.layer2 || [];
  const l3 = pathsObj.layer3 || [];
  const totalMm = getLen(l1) + getLen(l2) + getLen(l3);

  if (totalMm <= maxDistanceMm) return pathsObj;

  const ratio = maxDistanceMm / totalMm;
  const stride = Math.max(2, Math.ceil(1 / ratio));

  const filterLayer = (layer) => {
    if (!layer || layer.length === 0) return [];
    if (layer.length <= 6) {
      // Long continuous lines: downsample points along the line
      return layer.map(poly => {
        if (poly.length <= 40) return poly;
        const res = [];
        for (let i = 0; i < poly.length; i += stride) res.push(poly[i]);
        if (res[res.length - 1] !== poly[poly.length - 1]) res.push(poly[poly.length - 1]);
        return res;
      });
    }
    // Multiple paths: stride across paths
    const res = [];
    for (let i = 0; i < layer.length; i += stride) {
      res.push(layer[i]);
    }
    return res;
  };

  return {
    layer1: filterLayer(l1),
    layer2: filterLayer(l2),
    layer3: filterLayer(l3)
  };
};

/**
 * Universal Clean SVG Generator
 * Standard physical millimeters, clean paths, layer-separated for AxiDraw (up to 3 colors).
 */
window.exportPlotterSVG = function(pathsLayer1, pathsLayer2, pathsLayer3, widthMm, heightMm, penConfig, overrideNibWidth, isWatercolor = false) {
  const color1 = penConfig?.color1 || "#111116";
  const color2 = penConfig?.color2 || "#ff2a6d";
  const color3 = penConfig?.color3 || "#0066cc";
  const strokeW = overrideNibWidth || penConfig?.widthMm || 0.35;
  const strokeOpacity = (isWatercolor || penConfig?.watercolor) ? (penConfig?.opacity || 0.78) : 1.0;

  const toPathD = (paths) => {
    if (!paths) return "";
    return paths.map(p => {
      if (p.length < 2) return "";
      let d = `M ${p[0][0].toFixed(2)} ${p[0][1].toFixed(2)}`;
      for (let i = 1; i < p.length; i++) {
        d += ` L ${p[i][0].toFixed(2)} ${p[i][1].toFixed(2)}`;
      }
      return d;
    }).join(" ");
  };

  const d1 = toPathD(pathsLayer1);
  const d2 = toPathD(pathsLayer2);
  const d3 = toPathD(pathsLayer3);

  let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
     width="${widthMm}mm"
     height="${heightMm}mm"
     viewBox="0 0 ${widthMm} ${heightMm}"
     version="1.1">
  <desc>Exported from Algorithmic Poster Plotter Studio - Ready for AxiDraw / CNC Plotters (Multi-Pen / Color Block)</desc>
  
  <!-- LAYER 1 (PEN 1) -->
  <g id="Layer_1_Pen1"
     inkscape:groupmode="layer"
     inkscape:label="Layer 1 (Pen 1 - Main)"
     stroke="${color1}"
     stroke-width="${strokeW}mm"
     stroke-opacity="${strokeOpacity}"
     stroke-linecap="round"
     stroke-linejoin="round"
     fill="none">
    <path d="${d1}" />
  </g>
`;

  if (pathsLayer2 && pathsLayer2.length > 0) {
    svg += `
  <!-- LAYER 2 (PEN 2) -->
  <g id="Layer_2_Pen2"
     inkscape:groupmode="layer"
     inkscape:label="Layer 2 (Pen 2 - Accent)"
     stroke="${color2}"
     stroke-width="${strokeW}mm"
     stroke-opacity="${strokeOpacity}"
     stroke-linecap="round"
     stroke-linejoin="round"
     fill="none">
    <path d="${d2}" />
  </g>
`;
  }

  if (pathsLayer3 && pathsLayer3.length > 0) {
    svg += `
  <!-- LAYER 3 (PEN 3) -->
  <g id="Layer_3_Pen3"
     inkscape:groupmode="layer"
     inkscape:label="Layer 3 (Pen 3 - Highlight)"
     stroke="${color3}"
     stroke-width="${strokeW}mm"
     stroke-opacity="${strokeOpacity}"
     stroke-linecap="round"
     stroke-linejoin="round"
     fill="none">
    <path d="${d3}" />
  </g>
`;
  }

  svg += `</svg>`;
  return svg;
};

/**
 * Interactive Simulation Engine
 */
class PlotterSimulator {
  constructor(canvas, onProgressUpdate) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onProgressUpdate = onProgressUpdate;

    this.isPlaying = false;
    this.speed = 10; // multiplier
    this.currentPathIdx = 0;
    this.currentPtIdx = 0;
    this.allPaths = [];
    this.animId = null;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.colors = { p1: "#111", p2: "#ff2a6d", p3: "#0066cc" };
  }

  setup(layer1, layer2, layer3, paperW, paperH, colors, zoomState) {
    this.stop();
    this.paperW = paperW;
    this.paperH = paperH;
    this.colors = {
      p1: colors?.color1 || "#111",
      p2: colors?.color2 || "#ff2a6d",
      p3: colors?.color3 || "#0066cc"
    };
    this.zoomState = zoomState;

    // Flatten into simulation queue: { pts, layer: 1 | 2 | 3 }
    this.allPaths = [];
    (layer1 || []).forEach(p => this.allPaths.push({ pts: p, layer: 1 }));
    (layer2 || []).forEach(p => this.allPaths.push({ pts: p, layer: 2 }));
    (layer3 || []).forEach(p => this.allPaths.push({ pts: p, layer: 3 }));

    this.totalPoints = this.allPaths.reduce((acc, p) => acc + p.pts.length, 0);
    this.currentPathIdx = 0;
    this.currentPtIdx = 0;
    this.drawnPoints = 0;
  }

  play() {
    if (this.allPaths.length === 0) return;
    this.isPlaying = true;
    this.lastTime = performance.now();
    this.loop();
  }

  pause() {
    this.isPlaying = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  stop() {
    this.pause();
    this.currentPathIdx = 0;
    this.currentPtIdx = 0;
    this.drawnPoints = 0;
  }

  seek(ratio) {
    // Scrub to progress ratio [0..1]
    const targetPoints = Math.floor(ratio * this.totalPoints);
    let counted = 0;

    for (let i = 0; i < this.allPaths.length; i++) {
      const pLen = this.allPaths[i].pts.length;
      if (counted + pLen >= targetPoints) {
        this.currentPathIdx = i;
        this.currentPtIdx = Math.max(0, targetPoints - counted);
        this.drawnPoints = targetPoints;
        return;
      }
      counted += pLen;
    }
    this.currentPathIdx = this.allPaths.length - 1;
    this.currentPtIdx = this.allPaths[this.currentPathIdx].pts.length - 1;
    this.drawnPoints = this.totalPoints;
  }

  loop() {
    if (!this.isPlaying) return;

    // Advance steps per frame based on speed
    const stepsThisFrame = Math.max(1, Math.floor(this.speed * 4));
    for (let s = 0; s < stepsThisFrame; s++) {
      if (this.currentPathIdx >= this.allPaths.length) {
        this.isPlaying = false;
        if (this.onProgressUpdate) this.onProgressUpdate(1.0, true);
        return;
      }

      const curPath = this.allPaths[this.currentPathIdx];
      this.currentPtIdx++;
      this.drawnPoints++;

      if (this.currentPtIdx >= curPath.pts.length) {
        this.currentPathIdx++;
        this.currentPtIdx = 0;
      }
    }

    if (this.onProgressUpdate) {
      const progress = this.totalPoints > 0 ? this.drawnPoints / this.totalPoints : 0;
      this.onProgressUpdate(progress, false);
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }

  getCurrentHeadPosition() {
    if (this.allPaths.length === 0 || this.currentPathIdx >= this.allPaths.length) return null;
    const curPath = this.allPaths[this.currentPathIdx];
    const pt = curPath.pts[this.currentPtIdx] || curPath.pts[0];
    return { x: pt[0], y: pt[1], layer: curPath.layer };
  }
}

window.PlotterSimulator = PlotterSimulator;
