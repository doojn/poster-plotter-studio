/**
 * Poster Plotter Studio - Workshop Server
 * Standalone, zero-dependency Node.js server for running pen plotter workshops.
 * Features:
 *   - Auto-discovers local Wi-Fi IP and hostname (http://192.168.x.x:8080)
 *   - Generates ASCII terminal QR code + SVG QR code for projectors & screens
 *   - Serves static studio web app to participant laptops, phones & iPads
 *   - Standardized Workshop Queue API (receives designs, auto-generates OpenBuilds G-code)
 *   - Stores all jobs with standardized naming in poster_plotter_studio/workshop_jobs/
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFile } = require('child_process');

const PORT = process.env.PORT || 8080;
const STUDIO_DIR = __dirname;
const JOBS_DIR = path.join(STUDIO_DIR, 'workshop_jobs');
const CONFIG_FILE = path.join(STUDIO_DIR, 'workshop_config.json');
const FEEDBACK_FILE = path.join(STUDIO_DIR, 'workshop_feedback.json');

// Deterministic / Secure 10-char hex hash for participant privacy & NFC URLs
function generatePosterHash(name = "", jobId = "") {
  return crypto.createHash('sha256')
    .update(`${jobId}_${name}_${Date.now()}_${Math.random()}_workshop_plotter`)
    .digest('hex')
    .slice(0, 10);
}

// Obfuscate name for public / GitHub Pages privacy (e.g. "Sarah Al-Bawardi" -> "Sarah A. (S***)")
function obfuscateName(name = "") {
  const clean = (name || "").trim();
  if (!clean) return "Anonymous Maker";
  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    const first = parts[0];
    if (first.length <= 2) return first + "***";
    return first[0] + "***" + first.slice(-1);
  }
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0].toUpperCase() + ".";
  return `${first} ${lastInitial} (${first[0]}***)`;
}

// Clean participant name for folder & file naming (e.g. "Sarah" or "Sarah_K")
function getSafePersonName(name = "") {
  if (!name || !name.trim()) return "Maker";
  return name.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, "") || "Maker";
}

if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true });

// Load or initialize workshop machine configuration
let workshopConfig = {
  lockedForWorkshop: true,
  paperSize: "a5",
  paperOrientation: "portrait",
  marginMm: 12,
  maxPensAllowed: 3,
  markerType: "chunky",
  machineProfile: "OpenBuilds ACRO (Servo PWM)",
  jigOffsetX: 0,
  jigOffsetY: 0,
  feedrateDraw: 3000,
  feedrateTravel: 6000
};

if (fs.existsSync(CONFIG_FILE)) {
  try {
    workshopConfig = { ...workshopConfig, ...JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) };
  } catch (e) {}
}

// In-Memory Job Queue (also persisted to disk in JOBS_DIR)
let jobQueue = [];
let jobCounter = 1;

// Load existing jobs from disk
function loadJobsFromDisk() {
  jobQueue = [];
  try {
    const files = fs.readdirSync(JOBS_DIR).filter(f => f.endsWith('.json'));
    files.sort();
    const seen = new Set();
    files.forEach(f => {
      try {
        const job = JSON.parse(fs.readFileSync(path.join(JOBS_DIR, f), 'utf8'));
        const key = job.hash || job.id;
        if (key && !seen.has(key)) {
          seen.add(key);
          if (job.id) seen.add(job.id);
          jobQueue.push(job);
          const match = job.id && job.id.match(/JOB-(\d+)/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num >= jobCounter) jobCounter = num + 1;
          }
        }
      } catch (e) {}
    });
  } catch (e) {}
}
loadJobsFromDisk();
 
// Workshop Participant Feedback & Q&A
let feedbackList = [];
function loadFeedbackFromDisk() {
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      feedbackList = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    }
  } catch (e) {
    feedbackList = [];
  }
}
loadFeedbackFromDisk();

function saveFeedbackToDisk() {
  try {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbackList, null, 2), 'utf8');
  } catch (e) {}
}

// Find Local Network IP (Wi-Fi)
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// --- SELF-CONTAINED QR CODE GENERATOR (Pure JS, Zero Dependencies) ---
const GF = new Uint8Array(512);
const LOG = new Uint8Array(256);
let _x = 1;
for (let i = 0; i < 255; i++) {
  GF[i] = _x;
  GF[i + 255] = _x;
  LOG[_x] = i;
  _x <<= 1;
  if (_x & 256) _x ^= 285;
}
function gfMul(a, b) {
  return (a === 0 || b === 0) ? 0 : GF[LOG[a] + LOG[b]];
}
function rsPoly(numEc) {
  let poly = [1];
  for (let i = 0; i < numEc; i++) {
    const next = new Array(poly.length + 1).fill(0);
    const root = GF[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], root);
    }
    poly = next;
  }
  return poly;
}
function rsCompute(data, numEc) {
  const gen = rsPoly(numEc);
  const res = new Uint8Array(numEc);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ res[0];
    for (let j = 0; j < numEc - 1; j++) {
      res[j] = res[j + 1] ^ gfMul(gen[j + 1], factor);
    }
    res[numEc - 1] = gfMul(gen[numEc], factor);
  }
  return res;
}

// Generate QR Code Matrix for URL (Version 3: 29x29, ECC Level L: 55 data bytes, 15 ec bytes)
function generateQRMatrix(text) {
  const size = 29; // Version 3
  const matrix = Array.from({ length: size }, () => new Int8Array(size).fill(-1));

  // Finder pattern
  function putFinder(r, c) {
    for (let y = -1; y <= 7; y++) {
      for (let x = -1; x <= 7; x++) {
        const py = r + y, px = c + x;
        if (py >= 0 && py < size && px >= 0 && px < size) {
          const isEdge = (y === -1 || y === 7 || x === -1 || x === 7);
          const isOuter = (y === 0 || y === 6 || x === 0 || x === 6);
          const isCenter = (y >= 2 && y <= 4 && x >= 2 && x <= 4);
          matrix[py][px] = (isEdge || !isOuter || isCenter) ? (isEdge ? 0 : 1) : 0;
        }
      }
    }
  }
  putFinder(0, 0);
  putFinder(0, size - 7);
  putFinder(size - 7, 0);

  // Alignment pattern at (22, 22)
  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) {
      const isEdge = Math.abs(y) === 2 || Math.abs(x) === 2;
      const isCenter = y === 0 && x === 0;
      matrix[22 + y][22 + x] = (isEdge || isCenter) ? 1 : 0;
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === -1) matrix[6][i] = (i % 2 === 0) ? 1 : 0;
    if (matrix[i][6] === -1) matrix[i][6] = (i % 2 === 0) ? 1 : 0;
  }
  // Dark module
  matrix[size - 8][8] = 1;

  // Format info area reserved
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === -1) matrix[8][i] = 0;
    if (matrix[i][8] === -1) matrix[i][8] = 0;
  }
  for (let i = size - 8; i < size; i++) {
    if (matrix[8][i] === -1) matrix[8][i] = 0;
    if (matrix[i][8] === -1) matrix[i][8] = 0;
  }

  // Encode data into bits: Byte Mode (0100) + 8-bit length + raw bytes
  const bytes = Buffer.from(text, 'utf8');
  let bitStr = "0100"; // Byte mode
  bitStr += bytes.length.toString(2).padStart(8, '0');
  for (let b of bytes) bitStr += b.toString(2).padStart(8, '0');
  // Terminator
  bitStr += "0000";
  // Pad to byte boundary
  while (bitStr.length % 8 !== 0) bitStr += "0";

  // Total capacity for V3-L is 55 data bytes
  const dataBytes = [];
  for (let i = 0; i < bitStr.length; i += 8) {
    dataBytes.push(parseInt(bitStr.substr(i, 8), 2));
  }
  const padPatterns = [0xEC, 0x11];
  let padIdx = 0;
  while (dataBytes.length < 55) {
    dataBytes.push(padPatterns[padIdx++ % 2]);
  }

  // Compute 15 ECC bytes
  const ecBytes = rsCompute(new Uint8Array(dataBytes), 15);
  const totalCodewords = [...dataBytes, ...ecBytes];

  // Convert all codewords to bit stream
  let streamBits = "";
  for (let b of totalCodewords) streamBits += b.toString(2).padStart(8, '0');
  while (streamBits.length < 70 * 8) streamBits += "0";

  // Place bits in 2-column zig-zag from right to left
  let bitIdx = 0;
  let upwards = true;
  for (let c = size - 1; c > 0; c -= 2) {
    if (c === 6) c--; // Skip vertical timing pattern column
    const rows = [];
    if (upwards) {
      for (let r = size - 1; r >= 0; r--) rows.push(r);
    } else {
      for (let r = 0; r < size; r++) rows.push(r);
    }
    for (let r of rows) {
      for (let colOffset of [0, 1]) {
        const xPos = c - colOffset;
        if (matrix[r][xPos] === -1) {
          const bitVal = bitIdx < streamBits.length ? streamBits[bitIdx++] === '1' : 0;
          // Apply standard Mask 0: (row + col) % 2 === 0
          const mask = ((r + xPos) % 2 === 0);
          matrix[r][xPos] = (bitVal ^ mask) ? 1 : 0;
        }
      }
    }
    upwards = !upwards;
  }

  // Place Format info (Mask 0, Level L: 0b111011111000100)
  const fmtBits = "111011111000100";
  // Around top-left
  const tlCoords = [
    [8,0], [8,1], [8,2], [8,3], [8,4], [8,5], [8,7], [8,8],
    [7,8], [5,8], [4,8], [3,8], [2,8], [1,8], [0,8]
  ];
  for (let i = 0; i < 15; i++) {
    matrix[tlCoords[i][0]][tlCoords[i][1]] = fmtBits[i] === '1' ? 1 : 0;
  }
  // Bottom-left and Top-right splits
  for (let i = 0; i < 7; i++) {
    matrix[size - 1 - i][8] = fmtBits[i] === '1' ? 1 : 0;
  }
  for (let i = 0; i < 8; i++) {
    matrix[8][size - 8 + i] = fmtBits[7 + i] === '1' ? 1 : 0;
  }

  return matrix;
}

// Convert QR Matrix to ANSI half-block string for terminal display
function qrToTerminal(matrix) {
  const pad = 2;
  const size = matrix.length;
  const fullSize = size + pad * 2;
  const full = Array.from({ length: fullSize }, () => new Uint8Array(fullSize).fill(0));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      full[r + pad][c + pad] = matrix[r][c] === 1 ? 1 : 0;
    }
  }

  let out = "";
  for (let r = 0; r < fullSize; r += 2) {
    let rowStr = "  ";
    for (let c = 0; c < fullSize; c++) {
      const top = full[r][c];
      const bot = r + 1 < fullSize ? full[r + 1][c] : 0;
      if (top && bot) rowStr += "█";
      else if (top && !bot) rowStr += "▀";
      else if (!top && bot) rowStr += "▄";
      else rowStr += " ";
    }
    out += rowStr + "\n";
  }
  return out;
}

// Convert QR Matrix to SVG
function qrToSvg(matrix, sizePx = 240) {
  const pad = 2;
  const n = matrix.length;
  const total = n + pad * 2;
  let pathD = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === 1) {
        pathD += `M${c + pad},${r + pad}h1v1h-1z `;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${sizePx}" height="${sizePx}">
    <rect width="${total}" height="${total}" fill="#ffffff"/>
    <path d="${pathD}" fill="#0f172a"/>
  </svg>`;
}

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.ico': 'image/x-icon',
  '.gcode': 'text/plain; charset=utf-8',
  '.nc': 'text/plain; charset=utf-8'
};

// HTTP Server
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // --- API: Workshop Info & QR ---
  if (req.method === 'GET' && pathname === '/api/workshop/info') {
    const localIp = getLocalIP();
    const localUrl = `http://${localIp}:${PORT}`;
    const mdnsUrl = `http://${os.hostname()}:${PORT}`;
    let qrSvg = "";
    try {
      const m = generateQRMatrix(localUrl);
      qrSvg = qrToSvg(m, 260);
    } catch (e) {}

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      hostname: os.hostname(),
      port: PORT,
      localIp,
      localUrl,
      mdnsUrl,
      qrSvg,
      activeJobs: jobQueue.filter(j => j.status !== 'completed').length,
      completedJobs: jobQueue.filter(j => j.status === 'completed').length,
      config: workshopConfig
    }));
    return;
  }

  // --- API: Get Workshop Machine Config ---
  if (req.method === 'GET' && pathname === '/api/workshop/config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(workshopConfig));
    return;
  }

  // --- API: Update Workshop Machine Config (Instructor Only) ---
  if (req.method === 'POST' && pathname === '/api/workshop/config') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        workshopConfig = { ...workshopConfig, ...update };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(workshopConfig, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, config: workshopConfig }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // --- API: Get Workshop Job Queue ---
  if (req.method === 'GET' && pathname === '/api/workshop/queue') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(jobQueue));
    return;
  }

  // --- API: Get Feedback & Questions ---
  if (req.method === 'GET' && pathname === '/api/workshop/feedback') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ feedback: feedbackList }));
    return;
  }

  // --- API: Submit Feedback / Question ---
  if (req.method === 'POST' && pathname === '/api/workshop/feedback') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const item = {
          id: `FB-${Date.now()}`,
          name: (payload.name || "Anonymous Participant").trim() || "Anonymous Participant",
          type: payload.type === 'question' ? 'question' : 'thoughts',
          message: (payload.message || "").trim(),
          submittedAt: new Date().toISOString()
        };
        if (!item.message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Message cannot be empty" }));
        }
        feedbackList.unshift(item);
        saveFeedbackToDisk();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, item }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // --- API: Clear Feedback Messages (Operator only) ---
  if (req.method === 'POST' && pathname === '/api/workshop/feedback/clear') {
    feedbackList = [];
    saveFeedbackToDisk();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // --- NFC REDIRECT: /p/:hash -> /viewer.html?id=:hash ---
  if (req.method === 'GET' && pathname.startsWith('/p/')) {
    const hash = pathname.replace('/p/', '').trim();
    res.writeHead(302, { 'Location': `/viewer.html?id=${encodeURIComponent(hash)}` });
    res.end();
    return;
  }

  // --- API: Submit New Poster Design (Participant or Instructor) ---
  if (req.method === 'POST' && pathname === '/api/workshop/submit') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const jobId = `JOB-${String(jobCounter++).padStart(2, '0')}`;
        const participant = payload.participantName || "Anonymous";
        const hash = payload.hash || generatePosterHash(participant, jobId);
        const paper = payload.paperSize || "A4";
        const obfName = obfuscateName(participant);

        const job = {
          id: jobId,
          hash: hash,
          participantName: participant,
          obfuscatedName: obfName,
          submittedAt: new Date().toISOString(),
          status: "queued", // "queued" | "plotting" | "completed" | "cancelled"
          paperSize: paper,
          paperOrientation: payload.paperOrientation || "landscape",
          paperWidthMm: payload.paperWidthMm || 203,
          paperHeightMm: payload.paperHeightMm || 152,
          markerType: payload.markerType || "chunky",
          penCount: payload.penCount || 1,
          penNames: payload.penNames || ["Primary Pen"],
          penColors: payload.penColors || ["#111111"],
          timeFormatted: payload.timeFormatted || "4m 00s",
          penLifts: payload.penLifts ?? 0,
          drawDistMeters: payload.drawDistMeters || "0m",
          gcodeFilename: `${hash}_OpenBuilds.gcode`,
          svgFilename: `${hash}_Calibrated.svg`,
          splitFiles: [],
          paths: payload.paths || null
        };

        const safePerson = getSafePersonName(participant);
        const personDir = path.join(JOBS_DIR, safePerson);
        if (!fs.existsSync(personDir)) fs.mkdirSync(personDir, { recursive: true });

        job.personFolder = safePerson;
        job.personDir = personDir;

        // 1. Write individual split color files: color_personName.gcode (e.g. Black_Sarah.gcode)
        if (Array.isArray(payload.splitFiles)) {
          job.splitFiles = payload.splitFiles.map((split, i) => {
            const splitFn = split.filename || `Pen${i + 1}_${safePerson}.gcode`;
            if (split.gcode) {
              // Write directly inside the person's directory
              fs.writeFileSync(path.join(personDir, splitFn), split.gcode, 'utf8');
              // Also write to root of JOBS_DIR for fast flat lookup
              fs.writeFileSync(path.join(JOBS_DIR, splitFn), split.gcode, 'utf8');
              fs.writeFileSync(path.join(JOBS_DIR, `${hash}_Pen${i + 1}.gcode`), split.gcode, 'utf8');
            }
            return {
              name: split.name || `Pen ${i + 1}`,
              colorName: split.colorName || split.name || `Pen ${i + 1}`,
              filename: splitFn,
              relPath: `${safePerson}/${splitFn}`
            };
          });
        }

        // 1b. Write wide (+28%) split color files for operator
        if (Array.isArray(payload.wideSplitFiles)) {
          job.wideSplitFiles = payload.wideSplitFiles.map((wsplit, i) => {
            const wideFn = `Wide_${wsplit.filename || `Pen${i + 1}_${safePerson}.gcode`}`;
            if (wsplit.gcode) {
              fs.writeFileSync(path.join(personDir, wideFn), wsplit.gcode, 'utf8');
              fs.writeFileSync(path.join(JOBS_DIR, wideFn), wsplit.gcode, 'utf8');
            }
            return {
              name: wsplit.name || `Pen ${i + 1}`,
              colorName: wsplit.colorName || wsplit.name || `Pen ${i + 1}`,
              filename: wideFn,
              relPath: `${safePerson}/${wideFn}`
            };
          });
        }

        // 2. Write combined G-code file: All_Colors_personName.gcode
        const combinedFn = `All_Colors_${safePerson}.gcode`;
        if (payload.gcode) {
          fs.writeFileSync(path.join(personDir, combinedFn), payload.gcode, 'utf8');
          fs.writeFileSync(path.join(JOBS_DIR, combinedFn), payload.gcode, 'utf8');
          fs.writeFileSync(path.join(JOBS_DIR, `${hash}_OpenBuilds.gcode`), payload.gcode, 'utf8');
        }
        job.gcodeFilename = combinedFn;

        // 2b. Write wide combined G-code file
        const wideCombinedFn = `Wide_All_Colors_${safePerson}.gcode`;
        if (payload.wideGcode) {
          fs.writeFileSync(path.join(personDir, wideCombinedFn), payload.wideGcode, 'utf8');
          fs.writeFileSync(path.join(JOBS_DIR, wideCombinedFn), payload.wideGcode, 'utf8');
        }
        job.wideGcodeFilename = wideCombinedFn;

        // 3. Write calibrated SVG: Calibrated_personName.svg
        const svgFn = `Calibrated_${safePerson}.svg`;
        if (payload.svg) {
          fs.writeFileSync(path.join(personDir, svgFn), payload.svg, 'utf8');
          fs.writeFileSync(path.join(JOBS_DIR, svgFn), payload.svg, 'utf8');
          fs.writeFileSync(path.join(JOBS_DIR, `${hash}_Calibrated.svg`), payload.svg, 'utf8');
        }
        job.svgFilename = svgFn;

        // 3b. Write wide calibrated SVG
        const wideSvgFn = `Wide_Calibrated_${safePerson}.svg`;
        if (payload.wideSvg) {
          fs.writeFileSync(path.join(personDir, wideSvgFn), payload.wideSvg, 'utf8');
          fs.writeFileSync(path.join(JOBS_DIR, wideSvgFn), payload.wideSvg, 'utf8');
        }
        job.wideSvgFilename = wideSvgFn;

        // 4. Save metadata json inside person's folder AND in JOBS_DIR
        fs.writeFileSync(path.join(personDir, `job_${hash}.json`), JSON.stringify(job, null, 2), 'utf8');
        fs.writeFileSync(path.join(JOBS_DIR, `${hash}.json`), JSON.stringify(job, null, 2), 'utf8');

        // Add to active queue
        jobQueue.push(job);

        const localIp = getLocalIP();
        const nfcUrl = `http://${localIp}:${PORT}/p/${hash}`;
        const viewerUrl = `http://${localIp}:${PORT}/viewer.html?id=${hash}`;

        console.log(`\n📥 NEW JOB: [${jobId}] [Hash: ${hash}] from ${participant} (${paper}, ${job.penCount} pens, est ${job.timeFormatted})`);
        console.log(`   🏷️  NFC Souvenir URL: ${nfcUrl}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          jobId,
          hash,
          nfcUrl,
          viewerUrl,
          queuePosition: jobQueue.filter(j => j.status === 'queued').length,
          message: `Job ${jobId} added to the plotter queue!`
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // --- API: Get Job by Hash or ID ---
  if (req.method === 'GET' && pathname.startsWith('/api/workshop/job/') && !pathname.endsWith('/status')) {
    const idOrHash = pathname.replace('/api/workshop/job/', '').trim();
    const job = jobQueue.find(j => j.hash === idOrHash || j.id === idOrHash);
    if (job) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(job));
    } else {
      const diskPath = path.join(JOBS_DIR, `${idOrHash}.json`);
      if (fs.existsSync(diskPath)) {
        try {
          const diskJob = JSON.parse(fs.readFileSync(diskPath, 'utf8'));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(diskJob));
          return;
        } catch (e) {}
      }
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Job not found" }));
    }
    return;
  }

  // --- API: Update Job Status ---
  if (req.method === 'POST' && pathname.startsWith('/api/workshop/job/') && pathname.endsWith('/status')) {
    const parts = pathname.split('/');
    const jobIdOrHash = parts[4];
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { status } = JSON.parse(body);
        const job = jobQueue.find(j => j.id === jobIdOrHash || j.hash === jobIdOrHash);
        if (job) {
          job.status = status;
          // Update hashed json file on disk
          const hashPath = path.join(JOBS_DIR, `${job.hash}.json`);
          if (fs.existsSync(hashPath)) {
            fs.writeFileSync(hashPath, JSON.stringify(job, null, 2), 'utf8');
          }
          console.log(`✓ Job ${job.id} (${job.hash}) updated to: ${status.toUpperCase()}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, job }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Job not found" }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // --- API: Download Person Folder as ZIP ---
  if (req.method === 'GET' && ((pathname.startsWith('/api/workshop/job/') && pathname.endsWith('/zip')) || pathname.startsWith('/api/workshop/zip/'))) {
    const parts = pathname.split('/');
    const jobIdOrPerson = pathname.startsWith('/api/workshop/zip/') ? parts[4] : parts[4];
    const job = jobQueue.find(j => j.id === jobIdOrPerson || j.hash === jobIdOrPerson || j.personFolder === jobIdOrPerson);

    const safePerson = job?.personFolder || getSafePersonName(job?.participantName || jobIdOrPerson);
    const personDir = path.join(JOBS_DIR, safePerson);

    if (!fs.existsSync(personDir)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Folder for ${safePerson} not found on disk` }));
      return;
    }

    const zipFilename = `${safePerson}.zip`;
    const tempZip = path.join(os.tmpdir(), `${safePerson}_${Date.now()}.zip`);

    execFile('/usr/bin/zip', ['-r', '-j', tempZip, personDir], (err) => {
      if (!err && fs.existsSync(tempZip)) {
        res.writeHead(200, {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${zipFilename}"`
        });
        const stream = fs.createReadStream(tempZip);
        stream.pipe(res);
        stream.on('end', () => {
          try { fs.unlinkSync(tempZip); } catch(e){}
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Failed to generate zip", details: err ? err.message : "Unknown error" }));
      }
    });
    return;
  }

  // --- API: Download Job G-Code, SVG, or Split Files ---
  if (req.method === 'GET' && pathname.startsWith('/api/workshop/download/')) {
    const rawPath = decodeURIComponent(pathname.replace('/api/workshop/download/', ''));
    const safeRel = path.normalize(rawPath).replace(/^(\.\.[\/\\])+/, '');
    
    // Check in root JOBS_DIR or in person subdirectory
    let filepath = path.join(JOBS_DIR, safeRel);
    if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) {
      const baseFn = path.basename(safeRel);
      try {
        const subdirs = fs.readdirSync(JOBS_DIR).filter(f => fs.statSync(path.join(JOBS_DIR, f)).isDirectory());
        for (const d of subdirs) {
          const candidate = path.join(JOBS_DIR, d, baseFn);
          if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            filepath = candidate;
            break;
          }
        }
      } catch(e) {}
    }

    if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
      const filename = path.basename(filepath);
      const ext = path.extname(filepath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`
      });
      fs.createReadStream(filepath).pipe(res);
      return;
    } else {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(STUDIO_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIP();
  const localUrl = `http://${localIp}:${PORT}`;
  const mdnsUrl = `http://${os.hostname()}:${PORT}`;

  let qrAscii = "";
  try {
    const matrix = generateQRMatrix(localUrl);
    qrAscii = qrToTerminal(matrix);
  } catch (e) {}

  console.log("\n==================================================================");
  console.log("   🖋️  POSTER PLOTTER STUDIO - WORKSHOP CONTROLLER IS LIVE!   ");
  console.log("==================================================================");
  console.log(`\n📱 Direct Wi-Fi Access for Participants (Phones, iPads, Laptops):`);
  console.log(`   👉 \x1b[1m\x1b[36m${localUrl}\x1b[0m`);
  console.log(`   👉 \x1b[32m${mdnsUrl}\x1b[0m (macOS & iOS)\n`);
  console.log("📲 Scan QR Code with Phone / iPad Camera to open instantly:\n");
  if (qrAscii) console.log(qrAscii);
  console.log("⚙️  Standardized Machine Profile: OpenBuilds CONTROL (Bottom-Left Origin)");
  console.log(`📂 Saved Job Files Location:     ${JOBS_DIR}`);
  console.log("==================================================================\n");
});
