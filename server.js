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
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFile } = require('child_process');
const QRCode = require('qrcode');

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



// Helper function to save incoming job from local POST or cloud relay
function saveIncomingJob(payload) {
  const jobId = payload.id || `JOB-${String(jobCounter++).padStart(2, '0')}`;
  const participant = payload.participantName || "Anonymous";
  const hash = payload.hash || generatePosterHash(participant, jobId);
  
  // Check if already in queue
  const existing = jobQueue.find(j => j.hash === hash || (j.participantName === participant && j.submittedAt === payload.submittedAt));
  if (existing) return { job: existing, queuePosition: jobQueue.filter(j => j.status === 'queued').length };

  const paper = payload.paperSize || "A4";
  const obfName = obfuscateName(participant);

  const job = {
    id: jobId,
    hash: hash,
    participantName: participant,
    obfuscatedName: obfName,
    submittedAt: payload.submittedAt || new Date().toISOString(),
    status: payload.status || "queued",
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

  // 1. Split files
  if (Array.isArray(payload.splitFiles)) {
    job.splitFiles = payload.splitFiles.map((split, i) => {
      const splitFn = split.filename || `Pen${i + 1}_${safePerson}.gcode`;
      if (split.gcode) {
        fs.writeFileSync(path.join(personDir, splitFn), split.gcode, 'utf8');
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

  // 1b. Wide split files
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

  // 2. Combined G-code
  const combinedFn = `All_Colors_${safePerson}.gcode`;
  if (payload.gcode) {
    fs.writeFileSync(path.join(personDir, combinedFn), payload.gcode, 'utf8');
    fs.writeFileSync(path.join(JOBS_DIR, combinedFn), payload.gcode, 'utf8');
    fs.writeFileSync(path.join(JOBS_DIR, `${hash}_OpenBuilds.gcode`), payload.gcode, 'utf8');
  }
  job.gcodeFilename = combinedFn;

  // 2b. Wide combined G-code
  const wideCombinedFn = `Wide_All_Colors_${safePerson}.gcode`;
  if (payload.wideGcode) {
    fs.writeFileSync(path.join(personDir, wideCombinedFn), payload.wideGcode, 'utf8');
    fs.writeFileSync(path.join(JOBS_DIR, wideCombinedFn), payload.wideGcode, 'utf8');
  }
  job.wideGcodeFilename = wideCombinedFn;

  // 3. Calibrated SVG
  const svgFn = `Calibrated_${safePerson}.svg`;
  if (payload.svg) {
    fs.writeFileSync(path.join(personDir, svgFn), payload.svg, 'utf8');
    fs.writeFileSync(path.join(JOBS_DIR, svgFn), payload.svg, 'utf8');
    fs.writeFileSync(path.join(JOBS_DIR, `${hash}_Calibrated.svg`), payload.svg, 'utf8');
  }
  job.svgFilename = svgFn;

  // 3b. Wide Calibrated SVG
  const wideSvgFn = `Wide_Calibrated_${safePerson}.svg`;
  if (payload.wideSvg) {
    fs.writeFileSync(path.join(personDir, wideSvgFn), payload.wideSvg, 'utf8');
    fs.writeFileSync(path.join(JOBS_DIR, wideSvgFn), payload.wideSvg, 'utf8');
  }
  job.wideSvgFilename = wideSvgFn;

  // 4. Save metadata json
  fs.writeFileSync(path.join(personDir, `job_${hash}.json`), JSON.stringify(job, null, 2), 'utf8');
  fs.writeFileSync(path.join(JOBS_DIR, `${hash}.json`), JSON.stringify(job, null, 2), 'utf8');

  jobQueue.push(job);

  const localIp = getLocalIP();
  const nfcUrl = `http://${localIp}:${PORT}/p/${hash}`;
  const viewerUrl = `http://${localIp}:${PORT}/viewer.html?id=${hash}`;

  console.log(`\n📥 NEW JOB: [${job.id}] [Hash: ${hash}] from ${participant} (${paper}, ${job.penCount} pens, est ${job.timeFormatted})`);
  console.log(`   🏷️  NFC Souvenir URL: ${nfcUrl}`);

  return {
    job,
    jobId: job.id,
    hash,
    nfcUrl,
    viewerUrl,
    queuePosition: jobQueue.filter(j => j.status === 'queued').length
  };
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
    const targetUrl = url.searchParams.get('url') || localUrl;

    QRCode.toString(targetUrl, { type: 'svg', margin: 3, width: 260 }, (err, qrSvg) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        hostname: os.hostname(),
        port: PORT,
        localIp,
        localUrl,
        targetUrl,
        mdnsUrl,
        qrSvg: qrSvg || "",
        activeJobs: jobQueue.filter(j => j.status !== 'completed').length,
        completedJobs: jobQueue.filter(j => j.status === 'completed').length,
        config: workshopConfig
      }));
    });
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
        const result = saveIncomingJob(payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          jobId: result.jobId,
          hash: result.hash,
          nfcUrl: result.nfcUrl,
          viewerUrl: result.viewerUrl,
          queuePosition: result.queuePosition,
          message: `Job ${result.jobId} added to the plotter queue!`
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

  console.log("\n==================================================================");
  console.log("   🖋️  POSTER PLOTTER STUDIO - WORKSHOP CONTROLLER IS LIVE!   ");
  console.log("==================================================================");
  console.log(`\n📱 Direct Wi-Fi Access for Participants (Phones, iPads, Laptops):`);
  console.log(`   👉 \x1b[1m\x1b[36m${localUrl}\x1b[0m`);
  console.log(`   👉 \x1b[32m${mdnsUrl}\x1b[0m (macOS & iOS)`);
  console.log(`   🌐 Cloud Bridge Relay: ACTIVE (Syncing with GitHub Pages live)`);
  console.log("⚙️  Standardized Machine Profile: OpenBuilds CONTROL (Bottom-Left Origin)");
  console.log(`📂 Saved Job Files Location:     ${JOBS_DIR}`);
  console.log("==================================================================\n");

  // --- CLOUD BRIDGE RELAY: Auto-fetch participant submissions from GitHub Pages ---
  const CLOUD_QUEUE_URL = 'https://ntfy.sh/doojn_workshop_queue_7349';
  const CLOUD_FEEDBACK_URL = 'https://ntfy.sh/doojn_workshop_feedback_7349';
  const seenCloudMessageIds = new Set();

  function pollCloudBridge() {
    // 1. Poll queue submissions
    https.get(`${CLOUD_QUEUE_URL}/json?poll=1`, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        if (!raw) return;
        const lines = raw.trim().split('\n');
        for (const line of lines) {
          try {
            const item = JSON.parse(line);
            if (item.event === 'message' && !seenCloudMessageIds.has(item.id)) {
              seenCloudMessageIds.add(item.id);
              if (item.attachment && item.attachment.url) {
                // Large payload sent as attachment
                https.get(item.attachment.url, (attRes) => {
                  let attRaw = '';
                  attRes.on('data', c => attRaw += c);
                  attRes.on('end', () => {
                    try {
                      const payload = JSON.parse(attRaw);
                      console.log(`☁️  [Cloud Bridge] Received design from GitHub Pages: ${payload.participantName || 'Anonymous'}`);
                      saveIncomingJob(payload);
                    } catch(e){}
                  });
                }).on('error', () => {});
              } else if (item.message) {
                try {
                  const payload = JSON.parse(item.message);
                  if (payload.participantName || payload.gcode || payload.paths) {
                    console.log(`☁️  [Cloud Bridge] Received design from GitHub Pages: ${payload.participantName || 'Anonymous'}`);
                    saveIncomingJob(payload);
                  }
                } catch(e){}
              }
            }
          } catch (e) {}
        }
      });
    }).on('error', () => {});

    // 2. Poll feedback & questions
    https.get(`${CLOUD_FEEDBACK_URL}/json?poll=1`, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        if (!raw) return;
        const lines = raw.trim().split('\n');
        for (const line of lines) {
          try {
            const item = JSON.parse(line);
            if (item.event === 'message' && !seenCloudMessageIds.has(item.id)) {
              seenCloudMessageIds.add(item.id);
              try {
                const fb = JSON.parse(item.message);
                if (fb.message && !feedbackList.some(f => f.timestamp === fb.timestamp && f.message === fb.message)) {
                  feedbackList.unshift(fb);
                  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbackList, null, 2), 'utf8');
                  console.log(`💬 [Cloud Bridge] Feedback from GitHub Pages: [${fb.type}] ${fb.name}: "${fb.message}"`);
                }
              } catch(e){}
            }
          } catch(e){}
        }
      });
    }).on('error', () => {});
  }

  setInterval(pollCloudBridge, 2500);
  pollCloudBridge();
});
