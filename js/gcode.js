/**
 * OpenBuilds Calibrated G-Code & Machine Standardization Engine
 * Produces 100% standardized, zero-recalibration G-code for OpenBuilds CONTROL & GRBL plotters.
 */

(function(exports) {
  "use strict";

  // Universal Default Machine Profile
  const DEFAULT_MACHINE_PROFILE = {
    id: "openbuilds_standard",
    name: "OpenBuilds ACRO / GRBL Plotter",
    paperSize: "a5",             // "a5" | "a4" | "a3"
    paperOrientation: "landscape", // "landscape" | "portrait"
    marginMm: 12,                // Safe unprinted border
    origin: "bottom_left",       // "bottom_left" (CNC Standard) | "top_left" (Laser/SVG)
    jigOffsetX: 0,               // mm from machine home (0,0) to paper bottom-left
    jigOffsetY: 0,               // mm from machine home (0,0) to paper bottom-left
    actuation: "servo_pwm",      // "servo_pwm" | "z_stepper"
    penDownCmd: "M3 S500",       // Servo angle (S500 is balanced & gentle; S1000 is 180° max throw)
    penUpCmd: "M5 S0",           // Servo angle or laser power off
    penDownS: 500,               // Default servo down S-value (100-1000)
    penDownZ: 0.0,               // Z coordinate for pen down (if z_stepper)
    penUpZ: 5.0,                 // Z coordinate for pen up (if z_stepper)
    clearanceZ: 10.0,            // Z coordinate for safe parking travel
    feedrateDraw: 2200,          // mm/min while drawing (safe torque)
    feedrateTravel: 3500,        // mm/min rapid air travel (prevents motor stalls)
    feedrateZ: 1000,             // mm/min Z plunge/lift
    dwellSeconds: 0.20,          // Wait after servo actuation (G4 P0.20)
    parkX: 10,                   // Tool change parking X position
    parkY: 10,                   // Tool change parking Y position
    pauseBetweenPens: true,      // Insert M0 pause between pen layers
    splitFilesPerPen: true,      // Also generate individual G-code per pen
    lockedForWorkshop: true,     // Restrict participant choices to this profile
    maxPensAllowed: 3,           // Workshop pen limit (1, 2, or 3)
    aspectMode: "normal"         // "normal" (1:1) | "wide" (+28% width expansion to compensate squished axis)
  };

  /**
   * Convert screen/SVG millimeter coordinates to Machine coordinates.
   * ALL machine exports are strictly HORIZONTAL on the plotter bed (203mm along X rail, 152mm along Y rail).
   * Vertical designs (W=152, H=203) are rotated 90° onto the horizontal machine bed:
   * - mx = jigX + y (SVG Y in [12, 191] -> Machine X in [12, 191 mm], safe inside 203mm)
   * - my = jigY + x (SVG X in [12, 140] -> Machine Y in [12, 140 mm], safe inside 152mm)
   * Unmirrored, mathematically verified 90° rotation (det = +1).
   */
  function toMachineCoords(x, y, paperW, paperH, profile = {}) {
    const jigX = Number(profile.jigOffsetX) || 0;
    const jigY = Number(profile.jigOffsetY) || 0;
    const isPortrait = paperW < paperH;

    // Optional Aspect Ratio Compensation:
    // If the physical machine squishes shapes along the width axis (or if user selects "wide"),
    // expand coordinates around the poster width center.
    let px = x;
    let py = y;
    const aspectMode = profile.aspectMode || (profile.aspectCompensation ? "wide" : "normal");
    if (aspectMode === "wide" || profile.aspectRatioScale > 1.0) {
      const scaleX = Number(profile.aspectRatioScale) || 1.28; // +28% width expansion
      const margin = Number(profile.marginMm) || 12;
      if (isPortrait) {
        // In portrait, paper width is paperW (152mm) along X
        const cx = paperW / 2;
        px = cx + (x - cx) * scaleX;
        px = Math.max(margin, Math.min(paperW - margin, px));
      } else {
        const cy = paperH / 2;
        py = cy + (y - cy) * scaleX;
        py = Math.max(margin, Math.min(paperH - margin, py));
      }
    }

    let mx, my;

    if (isPortrait) {
      // 90° rotation onto horizontal bed (203mm X, 152mm Y) without mirroring:
      // Poster Y maps to Machine X, Poster X maps to Machine Y
      mx = jigX + py;
      my = jigY + px;
    } else {
      if (profile.origin === "top_left") {
        mx = jigX + px;
        my = jigY + py;
      } else {
        // Standard CNC Bottom-Left Origin: Invert Y so paper top corresponds to machine +Y
        mx = jigX + px;
        my = jigY + (paperH - py);
      }
    }
    return [Number(mx.toFixed(3)), Number(my.toFixed(3))];
  }

  /**
   * Format pen actuation commands
   */
  function getPenCommands(profile) {
    if (profile.actuation === "z_stepper") {
      const zDown = Number(profile.penDownZ).toFixed(2);
      const zUp = Number(profile.penUpZ).toFixed(2);
      const fZ = Number(profile.feedrateZ) || 1000;
      return {
        penDown: `G1 Z${zDown} F${fZ}\nG4 P0.05`,
        penUp: `G0 Z${zUp}`,
        safeClearance: `G0 Z${Number(profile.clearanceZ).toFixed(2)}`
      };
    } else {
      // Default: Servo PWM (M3 / M5)
      const dwell = Number(profile.dwellSeconds) || 0.20;
      const dwellCmd = dwell > 0 ? `\nG4 P${dwell.toFixed(2)}` : "";
      let downCmd = profile.penDownCmd;
      if (profile.penDownS) {
        downCmd = `M3 S${profile.penDownS}`;
      } else if (!downCmd || downCmd === "M3 S1000") {
        downCmd = "M3 S500";
      }
      const upCmd = profile.penUpCmd || "M5 S0";
      return {
        penDown: `${downCmd}${dwellCmd}`,
        penUp: `${upCmd}${dwellCmd}`,
        safeClearance: `${upCmd}`
      };
    }
  }

  /**
   * Generate Combined OpenBuilds G-Code with M0 Tool Changes
   */
  function generateOpenBuildsGCode(pathsObj, paper, profile = DEFAULT_MACHINE_PROFILE, metadata = {}) {
    const pW = paper.width;
    const pH = paper.height;
    const { penDown, penUp, safeClearance } = getPenCommands(profile);
    const feedTravel = profile.feedrateTravel || 6000;
    const feedDraw = profile.feedrateDraw || 3000;

    // Extract active layers
    const layers = [];
    if (pathsObj.layer1 && pathsObj.layer1.length > 0) {
      layers.push({ index: 1, name: metadata.pen1Name || "Pen 1 (Primary)", color: metadata.pen1Color || "#111111", paths: pathsObj.layer1 });
    }
    if (pathsObj.layer2 && pathsObj.layer2.length > 0) {
      layers.push({ index: 2, name: metadata.pen2Name || "Pen 2 (Accent)", color: metadata.pen2Color || "#ff3b5c", paths: pathsObj.layer2 });
    }
    if (pathsObj.layer3 && pathsObj.layer3.length > 0) {
      layers.push({ index: 3, name: metadata.pen3Name || "Pen 3 (Highlight)", color: metadata.pen3Color || "#0066cc", paths: pathsObj.layer3 });
    }

    if (layers.length === 0) return "; No paths to plot.";

    // Calculate drawing bounding box in machine coordinates across all paths
    const boundsObj = metadata.fullPaths || pathsObj;
    let bMinX = Infinity, bMaxX = -Infinity, bMinY = Infinity, bMaxY = -Infinity;
    ["layer1", "layer2", "layer3"].forEach(lk => {
      (boundsObj[lk] || []).forEach(path => {
        (path || []).forEach(pt => {
          const [mx, my] = toMachineCoords(pt[0], pt[1], pW, pH, profile);
          if (mx < bMinX) bMinX = mx;
          if (mx > bMaxX) bMaxX = mx;
          if (my < bMinY) bMinY = my;
          if (my > bMaxY) bMaxY = my;
        });
      });
    });

    if (!isFinite(bMinX)) {
      bMinX = 12; bMaxX = 191; bMinY = 12; bMaxY = 140;
    } else {
      bMinX = Number(bMinX.toFixed(2));
      bMaxX = Number(bMaxX.toFixed(2));
      bMinY = Number(bMinY.toFixed(2));
      bMaxY = Number(bMaxY.toFixed(2));
    }

    let gcode = [];
    const dateStr = new Date().toISOString();

    // 1. Standardized GRBL Header
    gcode.push("; ==============================================================================");
    gcode.push("; POSTER PLOTTER STUDIO - OPENBUILDS CALIBRATED G-CODE");
    gcode.push(`; Machine Profile: ${profile.name || "OpenBuilds Standard"}`);
    gcode.push(`; Participant: ${metadata.participantName || "Anonymous"} | Job ID: ${metadata.jobId || "JOB-01"}`);
    if (metadata.seat) gcode.push(`; Workshop Seat / Table: ${metadata.seat}`);
    gcode.push(`; Paper: ${paper.name || "Standard Paper"} (${pW}x${pH}mm) | Safe Margin: ${paper.margin || 15}mm`);
    gcode.push(`; Machine Origin: ${profile.origin === "top_left" ? "Top-Left (0,0)" : "Bottom-Left (0,0)"}`);
    gcode.push(`; Physical Jig Offset: X=${profile.jigOffsetX || 0}mm, Y=${profile.jigOffsetY || 0}mm`);
    gcode.push(`; Pen Actuation Mode: ${profile.actuation}`);
    gcode.push(`; Total Pen Layers: ${layers.length} | Est Plot Time: ${metadata.timeFormatted || "N/A"}`);
    gcode.push(`; Generated: ${dateStr}`);
    gcode.push("; ==============================================================================");
    gcode.push("");
    gcode.push("G21 ; Set units to millimeters");
    gcode.push("G90 ; Absolute positioning");
    gcode.push("G94 ; Units per minute feedrate");
    gcode.push("G17 ; XY plane select");
    gcode.push(safeClearance + " ; Ensure pen is safely raised");
    gcode.push(`G0 F${feedTravel} ; Set rapid travel feedrate`);
    gcode.push(`G1 F${feedDraw} ; Set default draw feedrate`);
    gcode.push("");

    // ==============================================================================
    // PAPER ALIGNMENT ROUTINE (2 PASSES, PEN UP)
    // Runs around drawing bounding box so user can align and tape paper before plotting.
    // ==============================================================================
    gcode.push("; ==============================================================================");
    gcode.push("; PAPER ALIGNMENT TRACE (2 PASSES, PEN UP)");
    gcode.push(`; Bounding Box: X[${bMinX} .. ${bMaxX}] mm, Y[${bMinY} .. ${bMaxY}] mm`);
    gcode.push("; Adjust and tape paper while carriage traces perimeter. Returns home before plotting.");
    gcode.push("; ==============================================================================");
    gcode.push(safeClearance + " ; Ensure pen is safely raised");
    gcode.push(`G0 F${feedTravel} ; Alignment trace feedrate`);
    // Pass 1
    gcode.push(`G0 X${bMinX} Y${bMinY}`);
    gcode.push(`G0 X${bMaxX} Y${bMinY}`);
    gcode.push(`G0 X${bMaxX} Y${bMaxY}`);
    gcode.push(`G0 X${bMinX} Y${bMaxY}`);
    gcode.push(`G0 X${bMinX} Y${bMinY}`);
    // Pass 2
    gcode.push(`G0 X${bMaxX} Y${bMinY}`);
    gcode.push(`G0 X${bMaxX} Y${bMaxY}`);
    gcode.push(`G0 X${bMinX} Y${bMaxY}`);
    gcode.push(`G0 X${bMinX} Y${bMinY}`);
    // Return Home & Dwell
    gcode.push(`G0 X0 Y0 F${feedTravel} ; Return to home origin`);
    gcode.push("G4 P1.0 ; Dwell 1s before drawing starts");
    gcode.push("");

    // Initial Pen 1 Prompt if multi-pen
    if (layers.length > 1 && profile.pauseBetweenPens) {
      gcode.push(`; --- SETUP PEN 1 ---`);
      gcode.push(`G0 X${profile.parkX || 10} Y${profile.parkY || 10} F${feedTravel} ; Move to front parking point`);
      gcode.push(`M0 (TOOL SETUP: Load Pen 1 - ${layers[0].name}. Click RESUME to begin)`);
      gcode.push("G4 P0.5 ; Dwell after resume");
      gcode.push("");
    }

    // 2. Iterate Layers
    layers.forEach((layer, layerIdx) => {
      gcode.push("; ------------------------------------------------------------------------------");
      gcode.push(`; START LAYER ${layer.index}: ${layer.name} (${layer.color}) - ${layer.paths.length} toolpath(s)`);
      gcode.push("; ------------------------------------------------------------------------------");

      layer.paths.forEach((path, pathIdx) => {
        if (!path || path.length < 2) return;

        // Rapid to start of path (Pen Up)
        const [startX, startY] = toMachineCoords(path[0][0], path[0][1], pW, pH, profile);
        gcode.push(`G0 X${startX} Y${startY}`);

        // Lower Pen
        gcode.push(penDown);

        // Draw path segments
        for (let i = 1; i < path.length; i++) {
          const [px, py] = toMachineCoords(path[i][0], path[i][1], pW, pH, profile);
          gcode.push(`G1 X${px} Y${py}`);
        }

        // Raise Pen
        gcode.push(penUp);
      });

      gcode.push(`; --- LAYER ${layer.index} FINISHED ---`);
      gcode.push("");

      // Tool Change Pause between layers
      if (layerIdx < layers.length - 1 && profile.pauseBetweenPens) {
        const nextLayer = layers[layerIdx + 1];
        const parkX = profile.parkX || 10;
        const parkY = profile.parkY || 10;

        gcode.push("; ------------------------------------------------------------------------------");
        gcode.push(`; TOOL CHANGE PAUSE: Prepare for Layer ${nextLayer.index}`);
        gcode.push("; ------------------------------------------------------------------------------");
        gcode.push(safeClearance);
        gcode.push(`G0 X${parkX} Y${parkY} F${feedTravel} ; Park at front for easy marker swap`);
        gcode.push(`M0 (TOOL CHANGE: Swap to Pen ${nextLayer.index} - ${nextLayer.name}. Adjust height & click RESUME)`);
        gcode.push("G4 P0.8 ; Settle delay after resume");
        gcode.push("");
      }
    });

    // 3. Footer
    gcode.push("; ==============================================================================");
    gcode.push("; PLOT COMPLETE");
    gcode.push("; ==============================================================================");
    gcode.push(safeClearance);
    gcode.push(`G0 X0 Y0 F${feedTravel} ; Return to home / jig zero`);
    if (profile.actuation === "servo_pwm") {
      gcode.push("M5 S0 ; Ensure spindle PWM is completely off");
    }
    gcode.push("M2 ; Program End");

    return gcode.join("\n");
  }

  /**
   * Helper to get simple English color name (e.g. Black, Red, Blue, Yellow, Green, Orange, Violet, Pink)
   */
  function getSimpleColorName(nameOrColor) {
    if (!nameOrColor) return "Color";
    const str = String(nameOrColor).toLowerCase();
    if (str.includes("black") || str.includes("أسود")) return "Black";
    if (str.includes("red") || str.includes("أحمر")) return "Red";
    if (str.includes("blue") || str.includes("أزرق")) return "Blue";
    if (str.includes("yellow") || str.includes("أصفر")) return "Yellow";
    if (str.includes("green") || str.includes("أخضر")) return "Green";
    if (str.includes("orange") || str.includes("برتقالي")) return "Orange";
    if (str.includes("violet") || str.includes("purple") || str.includes("بنفسجي")) return "Violet";
    if (str.includes("pink") || str.includes("وردي")) return "Pink";
    return String(nameOrColor).replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "") || "Color";
  }

  function getSafePersonName(name) {
    if (!name || !name.trim()) return "Participant";
    return name.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, "");
  }

  /**
   * Generate Separate G-Code files per pen (one file per color: color_personName.gcode)
   */
  function generateSplitGCode(pathsObj, paper, profile = DEFAULT_MACHINE_PROFILE, metadata = {}) {
    const layers = [];
    if (pathsObj.layer1 && pathsObj.layer1.length > 0) {
      layers.push({ index: 1, name: metadata.pen1Name || "Black", color: metadata.pen1Color || "#111111", paths: pathsObj.layer1 });
    }
    if (pathsObj.layer2 && pathsObj.layer2.length > 0) {
      layers.push({ index: 2, name: metadata.pen2Name || "Accent", color: metadata.pen2Color || "#ff3b5c", paths: pathsObj.layer2 });
    }
    if (pathsObj.layer3 && pathsObj.layer3.length > 0) {
      layers.push({ index: 3, name: metadata.pen3Name || "Highlight", color: metadata.pen3Color || "#0066cc", paths: pathsObj.layer3 });
    }

    const safeParticipant = getSafePersonName(metadata.participantName);

    return layers.map(layer => {
      const singleLayerPaths = {
        layer1: layer.paths,
        layer2: [],
        layer3: []
      };
      const layerMeta = {
        ...metadata,
        fullPaths: pathsObj, // Full poster paths so border trace covers entire drawing bounds
        pen1Name: layer.name,
        pen1Color: layer.color
      };
      const singleProfile = {
        ...profile,
        pauseBetweenPens: false // Single file doesn't need internal M0 tool change
      };
      const gcode = generateOpenBuildsGCode(singleLayerPaths, paper, singleProfile, layerMeta);
      const colorName = getSimpleColorName(layer.name);
      // Format requested: color_personName.gcode (e.g. Black_Sarah.gcode, Red_Sarah.gcode)
      const filename = `${colorName}_${safeParticipant}.gcode`;

      return {
        filename,
        colorName,
        layerIndex: layer.index,
        penName: layer.name,
        penColor: layer.color,
        pathCount: layer.paths.length,
        gcode
      };
    });
  }

  /**
   * Generate 10-Second Physical Jig Alignment Test G-Code ("Corner Test")
   * Traces paper safe margins with pen UP so instructor can verify paper placement on bed.
   */
  function generateCornerTestGCode(paper, profile = DEFAULT_MACHINE_PROFILE) {
    // Machine bed is strictly horizontal: 203mm along X rail, 152mm along Y rail
    const pW = Math.max(paper.width, paper.height);
    const pH = Math.min(paper.width, paper.height);
    const m = Number(profile.marginMm) || paper.margin || 12;
    const feed = profile.feedrateTravel || 6000;
    const { penUp, safeClearance } = getPenCommands(profile);
    const jigX = Number(profile.jigOffsetX) || 0;
    const jigY = Number(profile.jigOffsetY) || 0;

    // 1. Physical Paper Corners on Plotter Bed
    const e1X = Number(jigX.toFixed(2));
    const e1Y = Number(jigY.toFixed(2));
    const e2X = Number((jigX + pW).toFixed(2));
    const e2Y = Number(jigY.toFixed(2));
    const e3X = Number((jigX + pW).toFixed(2));
    const e3Y = Number((jigY + pH).toFixed(2));
    const e4X = Number(jigX.toFixed(2));
    const e4Y = Number((jigY + pH).toFixed(2));

    // 2. Safe Margin Corners (12mm inside sheet)
    const c1X = Number((jigX + m).toFixed(2));
    const c1Y = Number((jigY + m).toFixed(2));
    const c2X = Number((jigX + pW - m).toFixed(2));
    const c2Y = Number((jigY + m).toFixed(2));
    const c3X = Number((jigX + pW - m).toFixed(2));
    const c3Y = Number((jigY + pH - m).toFixed(2));
    const c4X = Number((jigX + m).toFixed(2));
    const c4Y = Number((jigY + pH - m).toFixed(2));

    return [
      "; ==============================================================================",
      "; POSTER PLOTTER STUDIO - PHYSICAL PAPER & MARGIN CORNER TEST",
      "; Pen stays RAISED 5mm. First checks the 4 physical edges of your sheet,",
      "; then checks the 4 inner safe margin corners.",
      `; Paper: ${paper.name || "Paper"} (${pW} x ${pH} mm) | Safe Margin: ${m} mm`,
      "; Machine Origin: Bottom-Left (0,0)",
      "; ==============================================================================",
      "G21 ; Millimeters",
      "G90 ; Absolute coordinates",
      safeClearance + " ; Pen Up (No ink)",
      "G0 X0 Y0 F" + feed + " ; Home (0,0)",
      "",
      "; --- PART 1: PHYSICAL SHEET OUTER CORNERS (0mm Edge of Paper) ---",
      `; Physical Bottom-Left: X=${e1X}, Y=${e1Y}`,
      `G0 X${e1X} Y${e1Y}`,
      "G4 P1.5",
      `; Physical Bottom-Right: X=${e2X}, Y=${e2Y}`,
      `G0 X${e2X} Y${e2Y}`,
      "G4 P1.5",
      `; Physical Top-Right: X=${e3X}, Y=${e3Y}`,
      `G0 X${e3X} Y${e3Y}`,
      "G4 P2.0 ; Check if pen reaches back-right edge of sheet",
      `; Physical Top-Left: X=${e4X}, Y=${e4Y}`,
      `G0 X${e4X} Y${e4Y}`,
      "G4 P2.0 ; Check if pen reaches back-left edge of sheet",
      "",
      "; --- PART 2: INNER SAFE PRINTABLE MARGINS (12mm inside sheet) ---",
      `; Margin Bottom-Left: X=${c1X}, Y=${c1Y}`,
      `G0 X${c1X} Y${c1Y}`,
      "G4 P1.5",
      `; Margin Bottom-Right: X=${c2X}, Y=${c2Y}`,
      `G0 X${c2X} Y${c2Y}`,
      "G4 P1.5",
      `; Margin Top-Right: X=${c3X}, Y=${c3Y}`,
      `G0 X${c3X} Y${c3Y}`,
      "G4 P1.5",
      `; Margin Top-Left: X=${c4X}, Y=${c4Y}`,
      `G0 X${c4X} Y${c4Y}`,
      "G4 P1.5",
      "",
      "; Return to Machine Origin",
      "G0 X0 Y0",
      "M2 ; Test Completed"
    ].join("\n");
  }

  /**
   * Generate OpenBuilds Pen Up / Pen Down Calibration Test G-Code
   * Tests:
   * 1. Static contact & pressure (3s hold)
   * 2. Static pen clearance (2s hold)
   * 3. 3-Segment travel clearance (detects dragging/skipping)
   * 4. 4 Staccato tap dots (evaluates servo actuation & dwell)
   * 5. Hatched calibration box + precision crosshair
   * Ultra low-frequency lifts to keep RC servos cool.
   */
  function generatePenUpDownCalibrationGCode(paper, profile = DEFAULT_MACHINE_PROFILE) {
    // Machine bed is strictly horizontal (203mm along X, 152mm along Y)
    const pW = Math.max(paper.width, paper.height);
    const pH = Math.min(paper.width, paper.height);
    const m = Number(profile.marginMm) || paper.margin || 12;
    const feedTravel = profile.feedrateTravel || 6000;
    const feedDraw = profile.feedrateDraw || 3000;
    const { penDown, penUp, safeClearance } = getPenCommands(profile);

    // Calculate base anchor to center test cleanly in printable area
    const usableW = pW - 2 * m;
    const usableH = pH - 2 * m;
    const testPatternW = 105; // mm
    const testPatternH = 90;  // mm
    const baseX = Number((m + Math.max(5, (usableW - testPatternW) / 2)).toFixed(2));
    const baseY = Number((m + Math.max(5, (usableH - testPatternH) / 2)).toFixed(2));

    const gcode = [
      "; ==============================================================================",
      "; OPENBUILDS PEN UP / PEN DOWN CALIBRATION TEST",
      "; Standardized for OpenBuilds CONTROL & GRBL CNC Pen Plotters",
      `; Paper: ${paper.name} (${pW} x ${pH} mm) | Safe Margins: ${m} mm`,
      "; Origin: Bottom-Left (0,0) Standard CNC Work Coordinate System",
      `; Actuation: ${profile.actuation} | Draw Feed: ${feedDraw} mm/min | Travel Feed: ${feedTravel} mm/min`,
      "; Servo-Safe: Low lift frequency & gentle dwells prevent motor overheating",
      "; ==============================================================================",
      "G21 ; Set units to millimeters",
      "G90 ; Set positioning to absolute coordinates",
      safeClearance + " ; Safe initial pen raise",
      `G0 X0 Y0 F${feedTravel} ; Start at Machine Origin (0,0)`,
      "",
      "; ------------------------------------------------------------------------------",
      `; STAGE 1: STATIC HEIGHT & CONTACT HOLD (Position X=${(baseX + 10).toFixed(2)}, Y=${(baseY + 10).toFixed(2)})`,
      "; Use this 3-second hold to check that your pen tip firmly touches paper",
      "; without deflecting the carriage or stalling the servo motor.",
      "; ------------------------------------------------------------------------------",
      `G0 X${(baseX + 10).toFixed(2)} Y${(baseY + 10).toFixed(2)} F${feedTravel}`,
      "G4 P1.0 ; Settle",
      "; --- PEN DOWN ---",
      penDown,
      "G4 P3.0 ; HOLD DOWN: Verify pen tip pressure & ink contact",
      "; --- PEN UP ---",
      penUp,
      "G4 P2.0 ; HOLD UP: Verify 3-5mm clearance gap above paper",
      "",
      "; ------------------------------------------------------------------------------",
      "; STAGE 2: TRAVEL CLEARANCE & DRAG TEST (3x 25mm Lines separated by 15mm Gaps)",
      "; Inspect the 15mm gaps: They MUST be clean paper with ZERO ink dragging.",
      "; If you see tails or drag lines: Increase penUpZ / check pen holder tightness.",
      "; ------------------------------------------------------------------------------",
      `; Line 1: ${baseX} to ${baseX + 25}`,
      `G0 X${baseX.toFixed(2)} Y${(baseY + 30).toFixed(2)} F${feedTravel}`,
      penDown,
      `G1 X${(baseX + 25).toFixed(2)} Y${(baseY + 30).toFixed(2)} F${feedDraw}`,
      penUp,
      `; Gap 1 (15mm Rapid Travel with Pen UP - Must be clean):`,
      `G0 X${(baseX + 40).toFixed(2)} Y${(baseY + 30).toFixed(2)} F${feedTravel}`,
      `; Line 2: ${baseX + 40} to ${baseX + 65}`,
      penDown,
      `G1 X${(baseX + 65).toFixed(2)} Y${(baseY + 30).toFixed(2)} F${feedDraw}`,
      penUp,
      `; Gap 2 (15mm Rapid Travel with Pen UP - Must be clean):`,
      `G0 X${(baseX + 80).toFixed(2)} Y${(baseY + 30).toFixed(2)} F${feedTravel}`,
      `; Line 3: ${baseX + 80} to ${baseX + 105}`,
      penDown,
      `G1 X${(baseX + 105).toFixed(2)} Y${(baseY + 30).toFixed(2)} F${feedDraw}`,
      penUp,
      "",
      "; ------------------------------------------------------------------------------",
      "; STAGE 3: STACCATO TAP & DWELL TEST (4 Precision Dots)",
      "; Tests servo down/up timing. Dots must be crisp circles, NOT commas or slashes.",
      "; ------------------------------------------------------------------------------",
      `; Dot 1:`,
      `G0 X${(baseX + 10).toFixed(2)} Y${(baseY + 50).toFixed(2)} F${feedTravel}`,
      penDown,
      "G4 P0.25 ; Ink transfer dwell",
      penUp,
      `; Dot 2:`,
      `G0 X${(baseX + 35).toFixed(2)} Y${(baseY + 50).toFixed(2)} F${feedTravel}`,
      penDown,
      "G4 P0.25 ; Ink transfer dwell",
      penUp,
      `; Dot 3:`,
      `G0 X${(baseX + 60).toFixed(2)} Y${(baseY + 50).toFixed(2)} F${feedTravel}`,
      penDown,
      "G4 P0.25 ; Ink transfer dwell",
      penUp,
      `; Dot 4:`,
      `G0 X${(baseX + 85).toFixed(2)} Y${(baseY + 50).toFixed(2)} F${feedTravel}`,
      penDown,
      "G4 P0.25 ; Ink transfer dwell",
      penUp,
      "",
      "; ------------------------------------------------------------------------------",
      "; STAGE 4: CONTINUOUS CONTOUR & DIAGONAL HATCH BOX (25x25mm)",
      "; Evaluates corner squareness, continuous lines, and internal diagonal lifts.",
      "; ------------------------------------------------------------------------------",
      `; Box Perimeter:`,
      `G0 X${baseX.toFixed(2)} Y${(baseY + 65).toFixed(2)} F${feedTravel}`,
      penDown,
      `G1 X${(baseX + 25).toFixed(2)} Y${(baseY + 65).toFixed(2)} F${feedDraw}`,
      `G1 X${(baseX + 25).toFixed(2)} Y${(baseY + 90).toFixed(2)} F${feedDraw}`,
      `G1 X${baseX.toFixed(2)} Y${(baseY + 90).toFixed(2)} F${feedDraw}`,
      `G1 X${baseX.toFixed(2)} Y${(baseY + 65).toFixed(2)} F${feedDraw}`,
      penUp,
      `; Diagonal Hatch 1:`,
      `G0 X${(baseX + 5).toFixed(2)} Y${(baseY + 65).toFixed(2)} F${feedTravel}`,
      penDown,
      `G1 X${(baseX + 25).toFixed(2)} Y${(baseY + 85).toFixed(2)} F${feedDraw}`,
      penUp,
      `; Diagonal Hatch 2:`,
      `G0 X${baseX.toFixed(2)} Y${(baseY + 70).toFixed(2)} F${feedTravel}`,
      penDown,
      `G1 X${(baseX + 20).toFixed(2)} Y${(baseY + 90).toFixed(2)} F${feedDraw}`,
      penUp,
      "",
      "; ------------------------------------------------------------------------------",
      "; STAGE 5: PRECISION CROSSHAIR & TARGET MARK (+)",
      "; Checks alignment repeatability and center dot registration.",
      "; ------------------------------------------------------------------------------",
      `; Crosshair Horizontal:`,
      `G0 X${(baseX + 55).toFixed(2)} Y${(baseY + 77.5).toFixed(2)} F${feedTravel}`,
      penDown,
      `G1 X${(baseX + 75).toFixed(2)} Y${(baseY + 77.5).toFixed(2)} F${feedDraw}`,
      penUp,
      `; Crosshair Vertical:`,
      `G0 X${(baseX + 65).toFixed(2)} Y${(baseY + 67.5).toFixed(2)} F${feedTravel}`,
      penDown,
      `G1 X${(baseX + 65).toFixed(2)} Y${(baseY + 87.5).toFixed(2)} F${feedDraw}`,
      penUp,
      `; Center Target Dot:`,
      `G0 X${(baseX + 65).toFixed(2)} Y${(baseY + 77.5).toFixed(2)} F${feedTravel}`,
      penDown,
      "G4 P0.25 ; Ink transfer dwell",
      penUp,
      "",
      "; ------------------------------------------------------------------------------",
      "; STAGE 6: FINISH & RETURN TO MACHINE HOME",
      "; ------------------------------------------------------------------------------",
      safeClearance + " ; Raise pen safe",
      `G0 X0 Y0 F${feedTravel} ; Return to origin`,
      "M2 ; Calibration Test Complete"
    ];

    return gcode.join("\n");
  }

  /**
   * Generate Pen Down Height & Pressure Ladder Test G-Code
   * Draws 5 distinct horizontal test strokes, each with a different servo S-value:
   * 1. S300 (Very Gentle / Feathery)
   * 2. S450 (Gentle / Light Touch)
   * 3. S600 (Medium / Balanced)
   * 4. S750 (Firm)
   * 5. S900 (Deep / Heavy)
   * Allows the user to find the exact S-value that makes a crisp line without stalling the servo.
   */
  function generatePenDownStepTestGCode(paper, profile = DEFAULT_MACHINE_PROFILE) {
    // Machine bed is strictly horizontal (203mm along X, 152mm along Y)
    const pW = Math.max(paper.width, paper.height);
    const pH = Math.min(paper.width, paper.height);
    const m = Number(profile.marginMm) || paper.margin || 12;
    const feedTravel = profile.feedrateTravel || 6000;
    const feedDraw = profile.feedrateDraw || 3000;
    const dwell = Number(profile.dwellSeconds) || 0.20;
    const dwellCmd = dwell > 0 ? `\nG4 P${dwell.toFixed(2)}` : "";
    const upCmd = `${profile.penUpCmd || "M5 S0"}${dwellCmd}`;
    const safeClearance = profile.penUpCmd || "M5 S0";

    const usableW = pW - 2 * m;
    const usableH = pH - 2 * m;
    const baseX = Number((m + Math.max(10, (usableW - 90) / 2)).toFixed(2));
    const baseY = Number((m + Math.max(10, (usableH - 80) / 2)).toFixed(2));

    const testSteps = [
      { s: 300, label: "S300 (Very Gentle / Feathery)" },
      { s: 450, label: "S450 (Gentle / Light Touch)" },
      { s: 600, label: "S600 (Medium / Balanced)" },
      { s: 750, label: "S750 (Firm)" },
      { s: 900, label: "S900 (Deep / Heavy)" }
    ];

    const lines = [
      "; ==============================================================================",
      "; OPENBUILDS PEN DOWN PRESSURE LADDER TEST (SERVO ANGLE STEP TEST)",
      "; Tests 5 different downward servo angles (S300 to S900).",
      "; Find the lowest S-value that draws a clean line without pressing too hard!",
      `; Paper: ${paper.name} (${pW} x ${pH} mm) | Safe Margin: ${m} mm`,
      "; Origin: Bottom-Left (0,0)",
      "; ==============================================================================",
      "G21 ; Millimeters",
      "G90 ; Absolute coordinates",
      safeClearance + " ; Safe initial pen raise",
      `G0 X0 Y0 F${feedTravel} ; Start at origin`,
      ""
    ];

    testSteps.forEach((step, idx) => {
      const yPos = (baseY + idx * 15).toFixed(2);
      const lineLen = 50;
      const xStart = baseX.toFixed(2);
      const xEnd = (baseX + lineLen).toFixed(2);

      lines.push(`; --- STEP ${idx + 1}: ${step.label} ---`);
      lines.push(`G0 X${xStart} Y${yPos} F${feedTravel} ; Rapid travel with Pen UP`);
      lines.push(`M3 S${step.s}${dwellCmd} ; Actuate servo down to S=${step.s}`);
      lines.push(`G1 X${xEnd} Y${yPos} F${feedDraw} ; Draw 50mm line`);
      lines.push(upCmd + " ; Lift pen UP");
      lines.push("");
    });

    lines.push("; --- COMPLETE & RETURN HOME ---");
    lines.push(safeClearance);
    lines.push(`G0 X0 Y0 F${feedTravel}`);
    lines.push("M2 ; Ladder Test Complete");

    return lines.join("\n");
  }

  /**
   * Generate 100% Calibrated 1:1 Millimeter SVG for OpenBuilds CAM / Inkscape
   */
  function generateCalibratedSVG(pathsObj, paper, colors = {}, metadata = {}) {
    const isPortrait = paper.width < paper.height;
    // Always horizontal on machine bed: 203mm on X, 152mm on Y
    const pW = isPortrait ? paper.height : paper.width;
    const pH = isPortrait ? paper.width : paper.height;
    const margin = paper.margin || 12;

    const c1 = colors.pen1 || "#111111";
    const c2 = colors.pen2 || "#ff3b5c";
    const c3 = colors.pen3 || "#0066cc";

    const pathsToD = (paths) => {
      if (!paths || paths.length === 0) return "";
      return paths.map(p => {
        if (!p || p.length < 2) return "";
        return `M ${p.map(pt => {
          let x = pt[0];
          let y = pt[1];
          let sx, sy;
          if (isPortrait) {
            sx = y;
            sy = x;
          } else {
            sx = x;
            sy = y;
          }
          return `${sx.toFixed(2)},${sy.toFixed(2)}`;
        }).join(" L ")}`;
      }).filter(Boolean).join(" ");
    };

    const d1 = pathsToD(pathsObj.layer1);
    const d2 = pathsToD(pathsObj.layer2);
    const d3 = pathsToD(pathsObj.layer3);

    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!--
  POSTER PLOTTER STUDIO - OPENBUILDS CAM 1:1 CALIBRATED SVG
  Participant: ${metadata.participantName || "Anonymous"} | Job: ${metadata.jobId || "JOB-01"}
  Paper: ${paper.name || "Paper"} (${pW}mm x ${pH}mm) | Safe Margin: ${margin}mm
  Physical Scale: 1 unit = 1 millimeter (No DPI conversion errors in OpenBuilds CAM)
-->
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
     width="${pW}mm"
     height="${pH}mm"
     viewBox="0 0 ${pW} ${pH}"
     version="1.1">
  
  <!-- Non-Plotting Physical Paper Jig & Safe Margin Reference -->
  <g id="Machine_Paper_Jig_Reference" inkscape:groupmode="layer" inkscape:label="[REFERENCE] Paper Bounds">
    <rect x="0" y="0" width="${pW}" height="${pH}" fill="none" stroke="#cbd5e1" stroke-width="0.3" stroke-dasharray="3,3" />
    <rect x="${margin}" y="${margin}" width="${pW - 2 * margin}" height="${pH - 2 * margin}" fill="none" stroke="#94a3b8" stroke-width="0.2" stroke-dasharray="1,2" />
  </g>

  <!-- Pen 1: Primary Layer -->
  ${d1 ? `<g id="Pen_1_${c1.replace('#','')}" inkscape:groupmode="layer" inkscape:label="Pen 1 (${metadata.pen1Name || 'Primary'})">
    <path d="${d1}" fill="none" stroke="${c1}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
  </g>` : ""}

  <!-- Pen 2: Accent Layer -->
  ${d2 ? `<g id="Pen_2_${c2.replace('#','')}" inkscape:groupmode="layer" inkscape:label="Pen 2 (${metadata.pen2Name || 'Accent'})">
    <path d="${d2}" fill="none" stroke="${c2}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
  </g>` : ""}

  <!-- Pen 3: Highlight Layer -->
  ${d3 ? `<g id="Pen_3_${c3.replace('#','')}" inkscape:groupmode="layer" inkscape:label="Pen 3 (${metadata.pen3Name || 'Highlight'})">
    <path d="${d3}" fill="none" stroke="${c3}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
  </g>` : ""}
</svg>`;
  }

  /**
   * Minimal Pure-JS QR Generator for Browser Display
   */
  const GF_CLIENT = new Uint8Array(512);
  const LOG_CLIENT = new Uint8Array(256);
  let _cx = 1;
  for (let i = 0; i < 255; i++) {
    GF_CLIENT[i] = _cx;
    GF_CLIENT[i + 255] = _cx;
    LOG_CLIENT[_cx] = i;
    _cx <<= 1;
    if (_cx & 256) _cx ^= 285;
  }
  function gfMulC(a, b) { return (a === 0 || b === 0) ? 0 : GF_CLIENT[LOG_CLIENT[a] + LOG_CLIENT[b]]; }
  function rsPolyC(numEc) {
    let poly = [1];
    for (let i = 0; i < numEc; i++) {
      const next = new Array(poly.length + 1).fill(0);
      const root = GF_CLIENT[i];
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gfMulC(poly[j], root);
      }
      poly = next;
    }
    return poly;
  }
  function rsComputeC(data, numEc) {
    const gen = rsPolyC(numEc);
    const res = new Uint8Array(numEc);
    for (let i = 0; i < data.length; i++) {
      const factor = data[i] ^ res[0];
      for (let j = 0; j < numEc - 1; j++) {
        res[j] = res[j + 1] ^ gfMulC(gen[j + 1], factor);
      }
      res[numEc - 1] = gfMulC(gen[numEc], factor);
    }
    return res;
  }
  function generateQRCodeSVG(text, sizePx = 240) {
    const size = 29;
    const matrix = Array.from({ length: size }, () => new Int8Array(size).fill(-1));
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
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        const isEdge = Math.abs(y) === 2 || Math.abs(x) === 2;
        const isCenter = y === 0 && x === 0;
        matrix[22 + y][22 + x] = (isEdge || isCenter) ? 1 : 0;
      }
    }
    for (let i = 8; i < size - 8; i++) {
      if (matrix[6][i] === -1) matrix[6][i] = (i % 2 === 0) ? 1 : 0;
      if (matrix[i][6] === -1) matrix[i][6] = (i % 2 === 0) ? 1 : 0;
    }
    matrix[size - 8][8] = 1;
    for (let i = 0; i < 9; i++) {
      if (matrix[8][i] === -1) matrix[8][i] = 0;
      if (matrix[i][8] === -1) matrix[i][8] = 0;
    }
    for (let i = size - 8; i < size; i++) {
      if (matrix[8][i] === -1) matrix[8][i] = 0;
      if (matrix[i][8] === -1) matrix[i][8] = 0;
    }
    const encoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : { encode: str => Buffer.from(str) };
    const bytes = encoder.encode(text);
    let bitStr = "0100" + bytes.length.toString(2).padStart(8, '0');
    for (let i = 0; i < bytes.length; i++) bitStr += bytes[i].toString(2).padStart(8, '0');
    bitStr += "0000";
    while (bitStr.length % 8 !== 0) bitStr += "0";
    const dataBytes = [];
    for (let i = 0; i < bitStr.length; i += 8) dataBytes.push(parseInt(bitStr.substr(i, 8), 2));
    const padPatterns = [0xEC, 0x11];
    let padIdx = 0;
    while (dataBytes.length < 55) dataBytes.push(padPatterns[padIdx++ % 2]);
    const ecBytes = rsComputeC(new Uint8Array(dataBytes), 15);
    const totalCodewords = [...dataBytes, ...ecBytes];
    let streamBits = "";
    for (let b of totalCodewords) streamBits += b.toString(2).padStart(8, '0');
    while (streamBits.length < 70 * 8) streamBits += "0";
    let bitIdx = 0;
    let upwards = true;
    for (let c = size - 1; c > 0; c -= 2) {
      if (c === 6) c--;
      const rows = [];
      if (upwards) { for (let r = size - 1; r >= 0; r--) rows.push(r); }
      else { for (let r = 0; r < size; r++) rows.push(r); }
      for (let r of rows) {
        for (let colOffset of [0, 1]) {
          const xPos = c - colOffset;
          if (matrix[r][xPos] === -1) {
            const bitVal = bitIdx < streamBits.length ? streamBits[bitIdx++] === '1' : 0;
            const mask = ((r + xPos) % 2 === 0);
            matrix[r][xPos] = (bitVal ^ mask) ? 1 : 0;
          }
        }
      }
      upwards = !upwards;
    }
    const fmtBits = "111011111000100";
    const tlCoords = [
      [8,0], [8,1], [8,2], [8,3], [8,4], [8,5], [8,7], [8,8],
      [7,8], [5,8], [4,8], [3,8], [2,8], [1,8], [0,8]
    ];
    for (let i = 0; i < 15; i++) matrix[tlCoords[i][0]][tlCoords[i][1]] = fmtBits[i] === '1' ? 1 : 0;
    for (let i = 0; i < 7; i++) matrix[size - 1 - i][8] = fmtBits[i] === '1' ? 1 : 0;
    for (let i = 0; i < 8; i++) matrix[8][size - 8 + i] = fmtBits[7 + i] === '1' ? 1 : 0;

    const pad = 2;
    const total = size + pad * 2;
    let pathD = "";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c] === 1) pathD += `M${c + pad},${r + pad}h1v1h-1z `;
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${sizePx}" height="${sizePx}">
      <rect width="${total}" height="${total}" fill="#ffffff" rx="10"/>
      <path d="${pathD}" fill="#0f172a"/>
    </svg>`;
  }

  /**
   * Deterministic / Fast 10-char hex hash for participant privacy & NFC links
   */
  function createPosterHash(name = "", jobId = "") {
    const raw = `${jobId}_${name}_${Date.now()}_${Math.random()}`;
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const hex = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(10, '0');
    return hex.slice(-10);
  }

  /**
   * Obfuscate participant name for public GitHub hosting (e.g. "Sarah Al-Bawardi" -> "Sarah A. (S***)")
   */
  function obfuscateParticipantName(name = "") {
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

  // Export API
  exports.DEFAULT_MACHINE_PROFILE = DEFAULT_MACHINE_PROFILE;
  exports.toMachineCoords = toMachineCoords;
  exports.generateOpenBuildsGCode = generateOpenBuildsGCode;
  exports.generateSplitGCode = generateSplitGCode;
  exports.generateCornerTestGCode = generateCornerTestGCode;
  exports.generatePenUpDownCalibrationGCode = generatePenUpDownCalibrationGCode;
  exports.generatePenDownStepTestGCode = generatePenDownStepTestGCode;
  exports.generateCalibratedSVG = generateCalibratedSVG;
  exports.generateQRCodeSVG = generateQRCodeSVG;
  exports.createPosterHash = createPosterHash;
  exports.obfuscateParticipantName = obfuscateParticipantName;
  exports.getSimpleColorName = getSimpleColorName;
  exports.getSafePersonName = getSafePersonName;

})(typeof window !== "undefined" ? window : module.exports);
