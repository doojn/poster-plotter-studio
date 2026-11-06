/**
 * Poster Maker - Interactive Custom Poster Canvas Engine
 * Allows users to add, select, drag, resize, rotate, and style shapes and typography,
 * and compiles the entire composition into multi-pen vector plotter toolpaths.
 */

(function(window) {
  'use strict';

  // Unique ID generator
  let _nextId = 1;
  function uniqueId(prefix = "elem") {
    return `${prefix}_${Date.now().toString(36)}_${_nextId++}`;
  }

  // Curated workshop color palettes (matching pen inks)
  const POSTER_PALETTES = {
    chunkyWatercolor: {
      id: "chunkyWatercolor",
      name: "Chunky Watercolor (Cerulean + Coral Rose + Ochre)",
      nameAr: "ألوان مائية عريضة (أزرق سيروليان + وردي مرجاني + مغرة)",
      bg: "#fefdfa",
      color1: "#0369a1", // Deep Cerulean
      color2: "#f43f5e", // Coral Rose
      color3: "#d97706", // Golden Ochre
      accent: "#10b981"
    },
    classicBauhaus: {
      id: "classicBauhaus",
      name: "Primary Modernist (Black + Ultramarine + Warm Red)",
      nameAr: "حداثي أساسي (أسود + أزرق ألترامارين + أحمر قرمزي)",
      bg: "#faf8f5",
      color1: "#18181b",
      color2: "#1d4ed8",
      color3: "#e11d48",
      accent: "#f59e0b"
    },
    popSorbet: {
      id: "popSorbet",
      name: "Pop Neon Sorbet (Navy + Neon Coral + Electric Cyan)",
      nameAr: "بوب نيون سوربيه (كحلي + مرجاني نيون + سماوي مشع)",
      bg: "#fcfaf7",
      color1: "#0f172a",
      color2: "#ff2a6d",
      color3: "#05d9e8",
      accent: "#facc15"
    },
    groovyMemphis: {
      id: "groovyMemphis",
      name: "Groovy Memphis (Plum + Mint + Tangerine)",
      nameAr: "غروفي ميمفيس (برقوقي + نعناعي + برتقالي)",
      bg: "#faf7f2",
      color1: "#4c1d95",
      color2: "#0d9488",
      color3: "#f97316",
      accent: "#fbbf24"
    },
    duotoneElectric: {
      id: "duotoneElectric",
      name: "Duotone Poster (Prussian Blue + Acid Tangerine)",
      nameAr: "ثنائي مشع (أزرق بروسي + برتقالي لاذع)",
      bg: "#f8fafc",
      color1: "#0f172a",
      color2: "#ea580c",
      color3: "#ea580c",
      accent: "#0ea5e9"
    }
  };

  class PosterMaker {
    constructor(widthMm = 148, heightMm = 210, marginMm = 12) {
      this.widthMm = widthMm;
      this.heightMm = heightMm;
      this.marginMm = marginMm;
      this.elements = [];
      this.selectedId = null;
      this.paletteId = "chunkyWatercolor";
      this.palette = POSTER_PALETTES.chunkyWatercolor;
      this.nibScale = 2.0;
      this.nibWidthMm = 2.0;
      this.numColors = 3;
      this.drawBorder = false; // Margin border is optional, never force border or crosshairs onto art

      // Interaction state
      this.hoveredHandle = null; // 'body' | 'rotate' | 'resize'
      this.hoveredId = null;
      this.isInteracting = false;
      this.interactionType = null; // 'move' | 'rotate' | 'resize'
      this.dragStart = { x: 0, y: 0 }; // in mm
      this.elementStart = null; // snapshot of element state at drag start

      this.loadStarterTemplate();
    }

    setPaperSize(wMm, hMm, marginMm = 12) {
      this.widthMm = wMm;
      this.heightMm = hMm;
      this.marginMm = marginMm;
    }

    setPalette(palId) {
      this.paletteId = palId;
      this.palette = POSTER_PALETTES[palId] || POSTER_PALETTES.chunkyWatercolor;
    }

    setPaletteColors(color1, color2, color3, name = "Workshop ROYGV") {
      this.palette = {
        id: "workshop_custom",
        name: name,
        color1: color1,
        color2: color2,
        color3: color3 || color2,
        accent: color2
      };
    }

    getPaletteColor(layerIdx, el = null) {
      if (el && el.customColorHex) return el.customColorHex;
      if (layerIdx === 2) return this.palette.color2;
      if (layerIdx === 3) return this.palette.color3 || this.palette.color2;
      return this.palette.color1;
    }

    setElementColor(id, colorIdOrHex, layer = null) {
      const el = this.elements.find(e => e.id === id);
      if (!el) return;
      if (layer !== null && layer !== undefined) {
        el.colorLayer = layer;
        delete el.customColorHex;
        delete el.customColorId;
      } else if (typeof colorIdOrHex === "number") {
        el.colorLayer = colorIdOrHex;
        delete el.customColorHex;
        delete el.customColorId;
      } else {
        const roygv = (window.getRoygvColor) ? window.getRoygvColor(colorIdOrHex) : null;
        if (roygv) {
          el.customColorId = roygv.id;
          el.customColorHex = roygv.hex;
          // Determine closest layer slot
          if (this.palette.color1 && this.palette.color1.toLowerCase() === roygv.hex.toLowerCase()) el.colorLayer = 1;
          else if (this.palette.color2 && this.palette.color2.toLowerCase() === roygv.hex.toLowerCase()) el.colorLayer = 2;
          else if (this.palette.color3 && this.palette.color3.toLowerCase() === roygv.hex.toLowerCase()) el.colorLayer = 3;
        } else {
          el.customColorHex = colorIdOrHex;
        }
      }
    }

    // =========================================================================
    // ELEMENT MANAGEMENT (ADD, DELETE, CLONE, ORDER)
    // =========================================================================

    addShape(type) {
      const cx = this.widthMm / 2;
      const cy = this.heightMm / 2;
      const jitterX = (Math.random() - 0.5) * 20;
      const jitterY = (Math.random() - 0.5) * 20;

      // Auto cycle layers
      const nextLayer = (this.elements.length % this.numColors) + 1;

      let el = {
        id: uniqueId(type),
        type,
        x: cx + jitterX,
        y: cy + jitterY,
        w: 50,
        h: 50,
        angle: 0,
        colorLayer: nextLayer,
        fill: true,
        text: ""
      };

      if (type === "circle") {
        el.w = 55;
        el.h = 55;
      } else if (type === "arch") {
        el.w = 48;
        el.h = 75;
      } else if (type === "rect") {
        el.w = 65;
        el.h = 45;
      } else if (type === "triangle") {
        el.w = 55;
        el.h = 55;
      } else if (type === "squiggle") {
        el.w = 70;
        el.h = 24;
      } else if (type === "pill") {
        el.w = 60;
        el.h = 30;
      } else if (type === "halfMoon") {
        el.w = 50;
        el.h = 50;
      } else if (type === "sunburst") {
        el.w = 55;
        el.h = 55;
      }

      this.elements.push(el);
      this.selectedId = el.id;
      return el;
    }

    addText(textContent = "POSTER") {
      const cx = this.widthMm / 2;
      const cy = this.heightMm / 2;
      const jitterY = (Math.random() - 0.5) * 20;

      const nextLayer = (this.elements.length % this.numColors) + 1;

      const el = {
        id: uniqueId("text"),
        type: "text",
        text: textContent,
        x: cx,
        y: cy + jitterY,
        w: 80,
        h: 22,
        angle: 0,
        colorLayer: nextLayer,
        fontSize: 16, // in mm
        fontWeight: "900",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Impact, sans-serif",
        fill: true
      };

      this.elements.push(el);
      this.selectedId = el.id;
      return el;
    }

    loadStarterTemplate() {
      const cx = this.widthMm / 2;
      const cy = this.heightMm / 2;
      const isLandscape = this.widthMm >= this.heightMm;

      if (isLandscape) {
        // Balanced Contemporary Bauhaus Layout for 203 × 152 mm (Horizontal / Landscape)
        this.elements = [
          // 1. Arch on the left side
          {
            id: uniqueId("arch"),
            type: "arch",
            x: cx - 44,
            y: cy,
            w: 56,
            h: 84,
            angle: 0,
            colorLayer: 1,
            fill: true
          },
          // 2. Solar disc overlapping arch
          {
            id: uniqueId("circle"),
            type: "circle",
            x: cx - 18,
            y: cy - 22,
            w: 42,
            h: 42,
            angle: 0,
            colorLayer: 2,
            fill: true
          },
          // 3. Main headline on the right side
          {
            id: uniqueId("text"),
            type: "text",
            text: "DESIGN",
            x: cx + 38,
            y: cy - 8,
            w: 78,
            h: 22,
            angle: 0,
            colorLayer: 1,
            fontSize: 18,
            fontWeight: "900",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Impact, sans-serif",
            fill: true
          },
          // 4. Subtitle below headline
          {
            id: uniqueId("text"),
            type: "text",
            text: "STUDIO 2026",
            x: cx + 38,
            y: cy + 10,
            w: 60,
            h: 12,
            angle: 0,
            colorLayer: 2,
            fontSize: 8.5,
            fontWeight: "700",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Impact, sans-serif",
            fill: true
          },
          // 5. Funky wavy squiggle ribbon across bottom-right
          {
            id: uniqueId("squiggle"),
            type: "squiggle",
            x: cx + 36,
            y: cy + 34,
            w: 72,
            h: 20,
            angle: -5,
            colorLayer: 3,
            fill: true
          }
        ];
      } else {
        // Vertical / Portrait Layout (e.g. standard A4/A3 vertical)
        this.elements = [
          // 1. Arch at top/center (Proportional Bauhaus Arch)
          {
            id: uniqueId("arch"),
            type: "arch",
            x: cx,
            y: cy - 22,
            w: 84,
            h: 88,
            angle: 0,
            colorLayer: 1,
            fill: true
          },
          // 2. Solar disc
          {
            id: uniqueId("circle"),
            type: "circle",
            x: cx + 22,
            y: cy - 28,
            w: 46,
            h: 46,
            angle: 0,
            colorLayer: 2,
            fill: true
          },
          // 3. Funky wavy squiggle ribbon
          {
            id: uniqueId("squiggle"),
            type: "squiggle",
            x: cx - 12,
            y: cy + 42,
            w: 75,
            h: 26,
            angle: -10,
            colorLayer: 3,
            fill: true
          },
          // 4. Main headline
          {
            id: uniqueId("text"),
            type: "text",
            text: "DESIGN",
            x: cx,
            y: cy + 70,
            w: 84,
            h: 24,
            angle: 0,
            colorLayer: 1,
            fontSize: 18,
            fontWeight: "900",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Impact, sans-serif",
            fill: true
          },
          // 5. Subtitle
          {
            id: uniqueId("text"),
            type: "text",
            text: "STUDIO 2026",
            x: cx,
            y: cy + 85,
            w: 65,
            h: 12,
            angle: 0,
            colorLayer: 2,
            fontSize: 8.5,
            fontWeight: "700",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Impact, sans-serif",
            fill: true
          }
        ];
      }

      this.selectedId = this.elements[3].id;
    }

    clear() {
      this.elements = [];
      this.selectedId = null;
    }

    getSelected() {
      if (!this.selectedId) return null;
      return this.elements.find(el => el.id === this.selectedId) || null;
    }

    select(id) {
      this.selectedId = id;
    }

    deselect() {
      this.selectedId = null;
    }

    removeSelected() {
      if (!this.selectedId) return;
      this.elements = this.elements.filter(el => el.id !== this.selectedId);
      this.selectedId = this.elements.length > 0 ? this.elements[this.elements.length - 1].id : null;
    }

    duplicateSelected() {
      const cur = this.getSelected();
      if (!cur) return;
      const copy = JSON.parse(JSON.stringify(cur));
      copy.id = uniqueId(cur.type);
      copy.x += 8;
      copy.y += 8;
      this.elements.push(copy);
      this.selectedId = copy.id;
    }

    bringForward() {
      if (!this.selectedId) return;
      const idx = this.elements.findIndex(e => e.id === this.selectedId);
      if (idx >= 0 && idx < this.elements.length - 1) {
        const item = this.elements.splice(idx, 1)[0];
        this.elements.splice(idx + 1, 0, item);
      }
    }

    sendBackward() {
      if (!this.selectedId) return;
      const idx = this.elements.findIndex(e => e.id === this.selectedId);
      if (idx > 0) {
        const item = this.elements.splice(idx, 1)[0];
        this.elements.splice(idx - 1, 0, item);
      }
    }

    // =========================================================================
    // HIT TESTING & MOUSE INTERACTION (DRAG, ROTATE, SCALE)
    // =========================================================================

    /**
     * Converts a paper mm point into local coordinates relative to an element
     */
    toLocal(el, mmX, mmY) {
      const dx = mmX - el.x;
      const dy = mmY - el.y;
      const rad = (-el.angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      return {
        x: dx * cos - dy * sin,
        y: dx * sin + dy * cos
      };
    }

    hitTest(mmX, mmY) {
      // 1. If an element is selected, test its rotation pin & resize corner first!
      const selected = this.getSelected();
      if (selected) {
        const local = this.toLocal(selected, mmX, mmY);
        const halfW = selected.w / 2;
        const halfH = selected.h / 2;

        // Rotation Pin: located 10mm above top center: (0, -halfH - 9)
        const rotPinY = -halfH - 9;
        const distRot = Math.hypot(local.x - 0, local.y - rotPinY);
        if (distRot <= 6.0) {
          return { element: selected, handle: "rotate" };
        }

        // Resize Corner: bottom right corner: (halfW, halfH)
        const distResize = Math.hypot(local.x - halfW, local.y - halfH);
        if (distResize <= 6.0) {
          return { element: selected, handle: "resize" };
        }
      }

      // 2. Test element bodies in reverse order (topmost first)
      for (let i = this.elements.length - 1; i >= 0; i--) {
        const el = this.elements[i];
        const local = this.toLocal(el, mmX, mmY);
        const halfW = el.w / 2;
        const halfH = el.h / 2;

        if (el.type === "circle") {
          const r = Math.max(el.w, el.h) / 2;
          if (Math.hypot(local.x, local.y) <= r + 2) {
            return { element: el, handle: "body" };
          }
        } else {
          if (Math.abs(local.x) <= halfW + 2 && Math.abs(local.y) <= halfH + 2) {
            return { element: el, handle: "body" };
          }
        }
      }

      return null;
    }

    startDrag(handle, element, mmX, mmY) {
      this.isInteracting = true;
      this.interactionType = handle;
      this.selectedId = element.id;
      this.dragStart = { x: mmX, y: mmY };
      this.elementStart = JSON.parse(JSON.stringify(element));
    }

    updateDrag(mmX, mmY) {
      if (!this.isInteracting || !this.elementStart) return;
      const el = this.getSelected();
      if (!el) return;

      const dx = mmX - this.dragStart.x;
      const dy = mmY - this.dragStart.y;

      if (this.interactionType === "move") {
        el.x = Math.round((this.elementStart.x + dx) * 10) / 10;
        el.y = Math.round((this.elementStart.y + dy) * 10) / 10;
      } else if (this.interactionType === "rotate") {
        // Calculate angle between element center and current mouse in paper coordinates
        const curAngleRad = Math.atan2(mmY - el.y, mmX - el.x);
        let deg = Math.round((curAngleRad * 180) / Math.PI) + 90;
        while (deg > 180) deg -= 360;
        while (deg < -180) deg += 360;
        // Snap to 15 degree increments if close
        if (Math.abs(deg % 15) < 3) {
          deg = Math.round(deg / 15) * 15;
        }
        el.angle = deg;
      } else if (this.interactionType === "resize") {
        // Compute distance from center in local space
        const local = this.toLocal(this.elementStart, mmX, mmY);
        let newW = Math.max(15, Math.abs(local.x) * 2);
        let newH = Math.max(15, Math.abs(local.y) * 2);
        if (el.type === "circle" || el.type === "sunburst") {
          const maxDim = Math.max(newW, newH);
          newW = maxDim;
          newH = maxDim;
        } else if (el.type === "text") {
          // Scaling text adjusts fontSize proportionally
          const scale = newW / (this.elementStart.w || 1);
          el.fontSize = Math.max(6, Math.min(60, Math.round(this.elementStart.fontSize * scale * 10) / 10));
          newH = el.fontSize * 1.35;
        }
        el.w = Math.round(newW * 10) / 10;
        el.h = Math.round(newH * 10) / 10;
      }
    }

    endDrag() {
      this.isInteracting = false;
      this.interactionType = null;
      this.elementStart = null;
    }

    // =========================================================================
    // GRAPHIC CANVAS RENDERING (FOR LIVE PREVIEW & SELECTION CONTROLS)
    // =========================================================================

    renderGraphic(canvas, isWatercolor = true) {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const mmToPx = W / this.widthMm;

      ctx.clearRect(0, 0, W, H);

      // 1. Paper Background
      ctx.fillStyle = this.palette.bg;
      ctx.fillRect(0, 0, W, H);

      // 2. Safe Margin Boundary
      const marginPx = this.marginMm * mmToPx;
      ctx.strokeStyle = "rgba(100, 116, 139, 0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(marginPx, marginPx, W - 2 * marginPx, H - 2 * marginPx);
      ctx.setLineDash([]);

      // 3. Render Elements
      this.elements.forEach(el => {
        ctx.save();
        ctx.translate(el.x * mmToPx, el.y * mmToPx);
        ctx.rotate((el.angle * Math.PI) / 180);

        const color = this.getPaletteColor(el.colorLayer, el);
        const wPx = el.w * mmToPx;
        const hPx = el.h * mmToPx;
        const halfW = wPx / 2;
        const halfH = hPx / 2;

        if (isWatercolor) {
          ctx.globalAlpha = 0.85;
          ctx.globalCompositeOperation = "multiply";
        }

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(2, (this.nibWidthMm || 2.8) * mmToPx * 0.8);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        this.drawShapeGraphic(ctx, el, halfW, halfH, wPx, hPx, mmToPx);

        ctx.restore();
      });

      // 4. Render Selection Box & Transformation Handles for Selected Element
      const selected = this.getSelected();
      if (selected) {
        ctx.save();
        ctx.translate(selected.x * mmToPx, selected.y * mmToPx);
        ctx.rotate((selected.angle * Math.PI) / 180);

        const wPx = selected.w * mmToPx;
        const hPx = selected.h * mmToPx;
        const halfW = wPx / 2;
        const halfH = hPx / 2;

        // Bounding Box
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(-halfW, -halfH, wPx, hPx);
        ctx.setLineDash([]);

        // Rotation Stem & Handle (above top center)
        const stemLen = 14 * (mmToPx / 3.77);
        ctx.beginPath();
        ctx.moveTo(0, -halfH);
        ctx.lineTo(0, -halfH - stemLen);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -halfH - stemLen, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 4 Corner Handles
        const cornerSize = 7;
        const corners = [
          [-halfW, -halfH],
          [halfW, -halfH],
          [-halfW, halfH],
          [halfW, halfH]
        ];
        corners.forEach(([cx, cy]) => {
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.fillRect(cx - cornerSize / 2, cy - cornerSize / 2, cornerSize, cornerSize);
          ctx.strokeRect(cx - cornerSize / 2, cy - cornerSize / 2, cornerSize, cornerSize);
        });

        ctx.restore();
      }
    }

    drawShapeGraphic(ctx, el, halfW, halfH, wPx, hPx, mmToPx) {
      if (el.type === "circle") {
        const r = Math.min(halfW, halfH);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        if (el.fill) ctx.fill();
        else ctx.stroke();

      } else if (el.type === "arch") {
        const r = halfW;
        ctx.beginPath();
        ctx.arc(0, -halfH + r, r, Math.PI, 0, false);
        ctx.lineTo(halfW, halfH);
        ctx.lineTo(-halfW, halfH);
        ctx.closePath();
        if (el.fill) ctx.fill();
        else ctx.stroke();

      } else if (el.type === "rect") {
        if (el.fill) ctx.fillRect(-halfW, -halfH, wPx, hPx);
        else ctx.strokeRect(-halfW, -halfH, wPx, hPx);

      } else if (el.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(0, -halfH);
        ctx.lineTo(halfW, halfH);
        ctx.lineTo(-halfW, halfH);
        ctx.closePath();
        if (el.fill) ctx.fill();
        else ctx.stroke();

      } else if (el.type === "squiggle") {
        const waves = 3.5;
        const amp = halfH * 0.75;
        ctx.beginPath();
        for (let x = -halfW; x <= halfW; x += 2) {
          const norm = (x + halfW) / wPx;
          const y = Math.sin(norm * waves * Math.PI * 2) * amp;
          if (x === -halfW) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = Math.max(3, halfH * 0.7);
        ctx.stroke();

      } else if (el.type === "pill") {
        const r = Math.min(halfW, halfH);
        ctx.beginPath();
        if (halfW >= halfH) {
          ctx.arc(-halfW + r, 0, r, Math.PI / 2, (3 * Math.PI) / 2);
          ctx.arc(halfW - r, 0, r, (3 * Math.PI) / 2, Math.PI / 2);
        } else {
          ctx.arc(0, -halfH + r, r, Math.PI, 0);
          ctx.arc(0, halfH - r, r, 0, Math.PI);
        }
        ctx.closePath();
        if (el.fill) ctx.fill();
        else ctx.stroke();

      } else if (el.type === "halfMoon") {
        const r = Math.min(halfW, halfH);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI, false);
        ctx.closePath();
        if (el.fill) ctx.fill();
        else ctx.stroke();

      } else if (el.type === "sunburst") {
        const r = Math.min(halfW, halfH) * 0.35;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        const rays = 12;
        const rMax = Math.min(halfW, halfH);
        for (let i = 0; i < rays; i++) {
          const th = (i / rays) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(th) * (r * 1.35), Math.sin(th) * (r * 1.35));
          ctx.lineTo(Math.cos(th) * rMax, Math.sin(th) * rMax);
          ctx.lineWidth = Math.max(2, mmToPx * 0.8);
          ctx.stroke();
        }

      } else if (el.type === "text") {
        const fSizePx = (el.fontSize || 16) * mmToPx;
        ctx.font = `${el.fontWeight || "900"} ${fSizePx}px ${el.fontFamily || "sans-serif"}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.letterSpacing = "0.04em";
        ctx.fillText(el.text || "", 0, 0);
      }
    }

    // =========================================================================
    // PHYSICAL PEN PLOTTER TOOLPATH COMPILER
    // Converts all shapes and text into { layer1, layer2, layer3 } vector paths
    // =========================================================================

    generateVectorPaths(nibScale = 3.5, numColors = 3) {
      const layer1 = [];
      const layer2 = [];
      const layer3 = [];

      // Calibrated for 2.0mm markers: 1.70mm hatch spacing (15% overlap) for solid fill without gaps or jamming
      const hatchSpacing = Math.max(1.1, 0.85 * (this.nibWidthMm || 2.0));

      const getTargetLayer = (el) => {
        if (numColors === 1) return layer1;
        const colorLayer = el.colorLayer || 1;
        if (numColors === 2) return (colorLayer % 2 === 0 ? layer2 : layer1);
        if (colorLayer === 3) return layer3;
        if (colorLayer === 2) return layer2;
        return layer1;
      };

      // Helper to rotate a point [px, py] around element center [cx, cy] by el.angle
      const makeRotator = (el) => {
        const rad = (el.angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return ([px, py]) => [
          el.x + px * cos - py * sin,
          el.y + px * sin + py * cos
        ];
      };

      // 1. COMPILE EACH ELEMENT
      this.elements.forEach(el => {
        const targetList = getTargetLayer(el);
        const rot = makeRotator(el);
        const halfW = el.w / 2;
        const halfH = el.h / 2;

        if (el.type === "circle") {
          const r = Math.min(halfW, halfH);
          const steps = 36;
          const outline = [];
          for (let i = 0; i <= steps; i++) {
            const th = (i / steps) * Math.PI * 2;
            outline.push(rot([r * Math.cos(th), r * Math.sin(th)]));
          }

          if (el.fill) {
            const numLines = Math.floor((2 * r) / hatchSpacing);
            const hatch = [];
            let rev = false;
            for (let i = 1; i < numLines; i++) {
              const ly = -r + i * hatchSpacing;
              const chordHalf = Math.sqrt(Math.max(0, r * r - ly * ly));
              const pLeft = rot([-chordHalf, ly]);
              const pRight = rot([chordHalf, ly]);
              if (!rev) hatch.push(pLeft, pRight);
              else hatch.push(pRight, pLeft);
              rev = !rev;
            }
            if (hatch.length >= 2) {
              targetList.push(outline.concat(hatch));
            } else {
              targetList.push(outline);
            }
          } else {
            targetList.push(outline);
          }

        } else if (el.type === "arch") {
          const r = halfW;
          const outline = [];
          const steps = 24;
          for (let i = 0; i <= steps; i++) {
            const th = Math.PI - (i / steps) * Math.PI;
            outline.push(rot([r * Math.cos(th), -halfH + r - r * Math.sin(th)]));
          }
          outline.push(rot([halfW, halfH]));
          outline.push(rot([-halfW, halfH]));
          outline.push(outline[0]);

          if (el.fill) {
            const numLines = Math.floor((2 * halfH) / hatchSpacing);
            const hatch = [];
            let rev = false;
            for (let i = 1; i < numLines; i++) {
              const ly = -halfH + i * hatchSpacing;
              let chordHalf = halfW;
              if (ly < -halfH + r) {
                const dy = (-halfH + r) - ly;
                chordHalf = Math.sqrt(Math.max(0, r * r - dy * dy));
              }
              const pLeft = rot([-chordHalf, ly]);
              const pRight = rot([chordHalf, ly]);
              if (!rev) hatch.push(pLeft, pRight);
              else hatch.push(pRight, pLeft);
              rev = !rev;
            }
            if (hatch.length >= 2) {
              targetList.push(outline.concat(hatch));
            } else {
              targetList.push(outline);
            }
          } else {
            targetList.push(outline);
          }

        } else if (el.type === "rect") {
          const outline = [
            rot([-halfW, -halfH]),
            rot([halfW, -halfH]),
            rot([halfW, halfH]),
            rot([-halfW, halfH]),
            rot([-halfW, -halfH])
          ];

          if (el.fill) {
            const numLines = Math.floor((2 * halfH) / hatchSpacing);
            const hatch = [];
            let rev = false;
            for (let i = 1; i < numLines; i++) {
              const ly = -halfH + i * hatchSpacing;
              const pLeft = rot([-halfW, ly]);
              const pRight = rot([halfW, ly]);
              if (!rev) hatch.push(pLeft, pRight);
              else hatch.push(pRight, pLeft);
              rev = !rev;
            }
            if (hatch.length >= 2) {
              targetList.push(outline.concat(hatch));
            } else {
              targetList.push(outline);
            }
          } else {
            targetList.push(outline);
          }

        } else if (el.type === "triangle") {
          const p1 = rot([0, -halfH]);
          const p2 = rot([halfW, halfH]);
          const p3 = rot([-halfW, halfH]);
          const outline = [p1, p2, p3, p1];

          if (el.fill) {
            const numLines = Math.floor((2 * halfH) / hatchSpacing);
            const hatch = [];
            let rev = false;
            for (let i = 1; i < numLines; i++) {
              const ly = -halfH + i * hatchSpacing;
              const ratio = (ly + halfH) / (2 * halfH);
              const curW = halfW * ratio;
              const pLeft = rot([-curW, ly]);
              const pRight = rot([curW, ly]);
              if (!rev) hatch.push(pLeft, pRight);
              else hatch.push(pRight, pLeft);
              rev = !rev;
            }
            if (hatch.length >= 2) {
              targetList.push(outline.concat(hatch));
            } else {
              targetList.push(outline);
            }
          } else {
            targetList.push(outline);
          }

        } else if (el.type === "squiggle") {
          const waves = 3.5;
          const amp = halfH * 0.75;
          const strokeCount = Math.max(2, Math.floor(nibScale));
          const continuousSquiggle = [];
          for (let s = 0; s < strokeCount; s++) {
            const offset = (s - strokeCount / 2) * (hatchSpacing * 0.6);
            const forward = (s % 2 === 0);
            const startX = forward ? -halfW : halfW;
            const endX = forward ? halfW : -halfW;
            const step = forward ? 1.5 : -1.5;
            for (let px = startX; forward ? px <= endX : px >= endX; px += step) {
              const norm = (px + halfW) / (2 * halfW);
              const py = Math.sin(norm * waves * Math.PI * 2) * amp + offset;
              continuousSquiggle.push(rot([px, py]));
            }
          }
          if (continuousSquiggle.length >= 2) {
            targetList.push(continuousSquiggle);
          }

        } else if (el.type === "pill") {
          const r = Math.min(halfW, halfH);
          const outline = [];
          const steps = 16;
          for (let i = 0; i <= steps; i++) {
            const th = -Math.PI / 2 + (i / steps) * Math.PI;
            outline.push(rot([halfW - r + r * Math.cos(th), r * Math.sin(th)]));
          }
          for (let i = 0; i <= steps; i++) {
            const th = Math.PI / 2 + (i / steps) * Math.PI;
            outline.push(rot([-halfW + r + r * Math.cos(th), r * Math.sin(th)]));
          }
          outline.push(outline[0]);

          if (el.fill) {
            const numLines = Math.floor((2 * halfH) / hatchSpacing);
            const hatch = [];
            let rev = false;
            for (let i = 1; i < numLines; i++) {
              const ly = -halfH + i * hatchSpacing;
              const pLeft = rot([-halfW, ly]);
              const pRight = rot([halfW, ly]);
              if (!rev) hatch.push(pLeft, pRight);
              else hatch.push(pRight, pLeft);
              rev = !rev;
            }
            if (hatch.length >= 2) {
              targetList.push(outline.concat(hatch));
            } else {
              targetList.push(outline);
            }
          } else {
            targetList.push(outline);
          }

        } else if (el.type === "halfMoon") {
          const r = Math.min(halfW, halfH);
          const outline = [];
          const steps = 24;
          for (let i = 0; i <= steps; i++) {
            const th = (i / steps) * Math.PI;
            outline.push(rot([r * Math.cos(th), r * Math.sin(th)]));
          }
          outline.push(outline[0]);

          if (el.fill) {
            const numLines = Math.floor(r / hatchSpacing);
            const hatch = [];
            let rev = false;
            for (let i = 1; i < numLines; i++) {
              const ly = i * hatchSpacing;
              const chordHalf = Math.sqrt(Math.max(0, r * r - ly * ly));
              const pLeft = rot([-chordHalf, ly]);
              const pRight = rot([chordHalf, ly]);
              if (!rev) hatch.push(pLeft, pRight);
              else hatch.push(pRight, pLeft);
              rev = !rev;
            }
            if (hatch.length >= 2) {
              targetList.push(outline.concat(hatch));
            } else {
              targetList.push(outline);
            }
          } else {
            targetList.push(outline);
          }

        } else if (el.type === "sunburst") {
          const r = Math.min(halfW, halfH) * 0.35;
          const outline = [];
          for (let i = 0; i <= 24; i++) {
            const th = (i / 24) * Math.PI * 2;
            outline.push(rot([r * Math.cos(th), r * Math.sin(th)]));
          }
          targetList.push(outline);

          const rays = 12;
          const rMax = Math.min(halfW, halfH);
          const raysLoop = [];
          for (let i = 0; i < rays; i++) {
            const th = (i / rays) * Math.PI * 2;
            const rInner = r * 1.3;
            if (i % 2 === 0) {
              raysLoop.push(
                rot([Math.cos(th) * rInner, Math.sin(th) * rInner]),
                rot([Math.cos(th) * rMax, Math.sin(th) * rMax])
              );
            } else {
              raysLoop.push(
                rot([Math.cos(th) * rMax, Math.sin(th) * rMax]),
                rot([Math.cos(th) * rInner, Math.sin(th) * rInner])
              );
            }
          }
          targetList.push(raysLoop);

        } else if (el.type === "text") {
          // Vector Typography Engine via Continuous Serpentine Ribbons
          this.vectorizeText(el, targetList, hatchSpacing, rot);
        }
      });

      // 2. SAFE MARGIN BORDER (OPTIONAL - ONLY IF EXPLICITLY REQUESTED)
      if (this.drawBorder) {
        const mx = this.marginMm;
        const my = this.marginMm;
        const mw = this.widthMm - 2 * this.marginMm;
        const mh = this.heightMm - 2 * this.marginMm;
        layer1.push([
          [mx, my], [mx + mw, my], [mx + mw, my + mh], [mx, my + mh], [mx, my]
        ]);
      }

      // 3. OPTIMIZE PATHS USING TRAVELING SALESPERSON HEURISTIC
      const optTSP = (typeof window !== "undefined" && window.optimizePathsTSP)
        ? window.optimizePathsTSP
        : (p => p);

      // Keep weld tolerance minimal (0.3mm) so distinct glyphs, holes, and shapes
      // are NEVER welded together with pen-down connecting strokes!
      const weldTol = 0.3;
      let optPaths = {
        layer1: optTSP(layer1, weldTol),
        layer2: optTSP(layer2, weldTol),
        layer3: optTSP(layer3, weldTol)
      };

      if (typeof window !== "undefined" && window.enforceA5SpeedLimit) {
        optPaths = window.enforceA5SpeedLimit(optPaths, 21000);
      }

      return optPaths;
    }

    /**
     * High-Precision Typography Vectorizer using Marching Squares Contour Boundary Tracing,
     * Concentric Inset Filling, and Douglas-Peucker Polygon Simplification.
     * Produces closed, crisp letterform loops without cross-letter drag lines.
     */
    vectorizeText(el, targetList, hatchSpacing, rot) {
      if (typeof document === "undefined" || !el.text || !el.text.trim()) {
        targetList.push([rot([-el.w / 2, 0]), rot([el.w / 2, 0])]);
        return;
      }

      const fSizeMm = el.fontSize || 16;
      // High-precision resolution: 6 dots per millimeter (~152 DPI)
      const dpm = 6;
      const fSizePx = Math.round(fSizeMm * dpm);
      const fontStr = `${el.fontWeight || "900"} ${fSizePx}px ${el.fontFamily || "sans-serif"}`;

      // Measure text accurately
      const measCanvas = document.createElement("canvas");
      const measCtx = measCanvas.getContext("2d");
      measCtx.font = fontStr;
      const textMetrics = measCtx.measureText(el.text);
      const measuredW = Math.max(textMetrics.width, 20);

      const pad = Math.ceil(dpm * 3); // 3mm padding around glyphs
      const canvasW = Math.ceil(measuredW + pad * 2);
      const canvasH = Math.ceil(fSizePx * 1.8 + pad * 2);

      const off = document.createElement("canvas");
      off.width = canvasW;
      off.height = canvasH;
      const ctx = off.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasW, canvasH);

      ctx.fillStyle = "#000000";
      ctx.font = fontStr;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(el.text, canvasW / 2, canvasH / 2);

      const imgData = ctx.getImageData(0, 0, canvasW, canvasH).data;
      const grid = new Uint8Array(canvasW * canvasH);
      let blackPixels = 0;
      for (let i = 0; i < grid.length; i++) {
        if (imgData[i * 4] < 128) {
          grid[i] = 1;
          blackPixels++;
        }
      }

      if (blackPixels < 10) return;

      // Extract outer letter contours
      const outerLoops = this._traceContours(grid, canvasW, canvasH, dpm, rot);
      outerLoops.forEach(loop => {
        if (loop.length >= 3) targetList.push(loop);
      });

      // Jam-free typography calibrated for 2.0mm marker stroke:
      // - Regular & medium text (< 22mm, e.g. "STUDIO 2026"): EXACTLY 1 crisp outer outline loop!
      //   A 2.0mm marker stroke around the perimeter naturally fills standard 2-3mm letter stems solid.
      // - Extra large title text (>= 22mm, e.g. large "DESIGN"): At most ONE single clean center inset loop.
      if (fSizeMm >= 22 && blackPixels > 150) {
        const erodeR = Math.max(2, Math.round(dpm * 1.0)); // 1.0mm center inset
        const eroded = this._erodeGrid(grid, canvasW, canvasH, erodeR);
        let rem = 0;
        for (let i = 0; i < eroded.length; i++) {
          if (eroded[i]) rem++;
        }
        if (rem >= 40) {
          const innerLoops = this._traceContours(eroded, canvasW, canvasH, dpm, rot);
          innerLoops.forEach(loop => {
            if (loop.length >= 4) targetList.push(loop);
          });
        }
      }
    }

    _erodeGrid(grid, W, H, radius) {
      const out = new Uint8Array(W * H);
      for (let y = radius; y < H - radius; y++) {
        for (let x = radius; x < W - radius; x++) {
          if (!grid[y * W + x]) continue;
          let allOn = true;
          for (let dy = -radius; dy <= radius && allOn; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              if (!grid[(y + dy) * W + (x + dx)]) {
                allOn = false;
                break;
              }
            }
          }
          if (allOn) out[y * W + x] = 1;
        }
      }
      return out;
    }

    _traceContours(grid, W, H, dpm, rot) {
      const segments = [];
      const val = (x, y) => (x >= 0 && x < W && y >= 0 && y < H && grid[y * W + x]) ? 1 : 0;

      for (let y = 0; y < H - 1; y++) {
        for (let x = 0; x < W - 1; x++) {
          const tl = val(x, y);
          const tr = val(x + 1, y);
          const br = val(x + 1, y + 1);
          const bl = val(x, y + 1);
          const idx = (tl << 0) | (tr << 1) | (br << 2) | (bl << 3);
          if (idx === 0 || idx === 15) continue;

          const topPt = [x + 0.5, y];
          const rightPt = [x + 1, y + 0.5];
          const botPt = [x + 0.5, y + 1];
          const leftPt = [x, y + 0.5];

          switch (idx) {
            case 1:  segments.push([leftPt, topPt]); break;
            case 2:  segments.push([topPt, rightPt]); break;
            case 3:  segments.push([leftPt, rightPt]); break;
            case 4:  segments.push([rightPt, botPt]); break;
            case 5:  segments.push([leftPt, topPt], [rightPt, botPt]); break;
            case 6:  segments.push([topPt, botPt]); break;
            case 7:  segments.push([leftPt, botPt]); break;
            case 8:  segments.push([botPt, leftPt]); break;
            case 9:  segments.push([botPt, topPt]); break;
            case 10: segments.push([topPt, leftPt], [botPt, rightPt]); break;
            case 11: segments.push([botPt, rightPt]); break;
            case 12: segments.push([rightPt, leftPt]); break;
            case 13: segments.push([rightPt, topPt]); break;
            case 14: segments.push([topPt, leftPt]); break;
          }
        }
      }

      if (segments.length === 0) return [];

      // Spatial hash stitching
      const key = pt => `${Math.round(pt[0] * 10)},${Math.round(pt[1] * 10)}`;
      const adj = new Map();
      for (let i = 0; i < segments.length; i++) {
        const [p1, p2] = segments[i];
        const k1 = key(p1), k2 = key(p2);
        if (!adj.has(k1)) adj.set(k1, []);
        if (!adj.has(k2)) adj.set(k2, []);
        adj.get(k1).push({ toKey: k2, pt: p2, segIdx: i });
        adj.get(k2).push({ toKey: k1, pt: p1, segIdx: i });
      }

      const used = new Uint8Array(segments.length);
      const rawLoops = [];

      for (let i = 0; i < segments.length; i++) {
        if (used[i]) continue;
        used[i] = 1;

        const chain = [segments[i][0], segments[i][1]];
        let curKey = key(segments[i][1]);

        while (true) {
          const neighbors = adj.get(curKey) || [];
          let found = false;
          for (const n of neighbors) {
            if (!used[n.segIdx]) {
              used[n.segIdx] = 1;
              chain.push(n.pt);
              curKey = n.toKey;
              found = true;
              break;
            }
          }
          if (!found) break;
          if (curKey === key(chain[0])) {
            chain.push([chain[0][0], chain[0][1]]);
            break;
          }
        }

        if (chain.length >= 4) {
          rawLoops.push(chain);
        }
      }

      // Simplify loops and convert to millimeters
      const result = [];
      const dpTol = 1.0; // 1.0 px (~0.17mm) smooths curves and eliminates micro-stutter/jamming
      for (const loop of rawLoops) {
        const simplified = this._simplifyDP(loop, dpTol);
        const mmPath = simplified.map(pt => {
          const mmX = (pt[0] - W / 2) / dpm;
          const mmY = (pt[1] - H / 2) / dpm;
          return rot([mmX, mmY]);
        });
        result.push(mmPath);
      }

      return result;
    }

    _simplifyDP(pts, tol) {
      if (pts.length <= 2) return pts;
      let maxD = 0, maxI = 0;
      const p1 = pts[0], p2 = pts[pts.length - 1];
      const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
      const lenSq = dx * dx + dy * dy;

      for (let i = 1; i < pts.length - 1; i++) {
        const p = pts[i];
        let d;
        if (lenSq === 0) {
          d = Math.hypot(p[0] - p1[0], p[1] - p1[1]);
        } else {
          const t = Math.max(0, Math.min(1, ((p[0] - p1[0]) * dx + (p[1] - p1[1]) * dy) / lenSq));
          const projX = p1[0] + t * dx;
          const projY = p1[1] + t * dy;
          d = Math.hypot(p[0] - projX, p[1] - projY);
        }
        if (d > maxD) {
          maxD = d;
          maxI = i;
        }
      }

      if (maxD > tol) {
        const rec1 = this._simplifyDP(pts.slice(0, maxI + 1), tol);
        const rec2 = this._simplifyDP(pts.slice(maxI), tol);
        return rec1.slice(0, -1).concat(rec2);
      } else {
        return [p1, p2];
      }
    }
  }

  // Export globally
  window.POSTER_PALETTES = POSTER_PALETTES;
  window.PosterMaker = PosterMaker;

})(typeof window !== "undefined" ? window : global);
