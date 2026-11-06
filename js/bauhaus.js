/**
 * Bauhaus & Pop-Memphis Generative Poster Designer
 * Generates funky, contemporary constructivist poster art with bold geometry,
 * playful color blocks, and direct pen plotter vector toolpath generation.
 */

(function(window) {
  'use strict';

  // Seeded PRNG for reproducible remixes
  class BauhausPRNG {
    constructor(seed = 12345) {
      this.seed = (seed % 2147483647) || 12345;
      if (this.seed <= 0) this.seed += 2147483646;
    }
    next() {
      this.seed = (this.seed * 16807) % 2147483647;
      return (this.seed - 1) / 2147483646;
    }
    range(min, max) {
      return min + this.next() * (max - min);
    }
    choice(arr) {
      return arr[Math.floor(this.next() * arr.length)];
    }
    bool(prob = 0.5) {
      return this.next() < prob;
    }
  }

  // Curated Bauhaus & Pop Palettes
  const BAUHAUS_PALETTES = {
    classicBauhaus: {
      id: "classicBauhaus",
      name: "Classic Bauhaus (Black + Ultramarine + Warm Red + Ochre)",
      nameAr: "باوهاوس كلاسيكي (أسود + أزرق ألترامارين + أحمر قرمزي + أصفر)",
      bg: "#faf8f5",
      color1: "#18181b", // Black
      color2: "#1d4ed8", // Ultramarine Blue
      color3: "#e11d48", // Cadmium Warm Red
      accent: "#f59e0b"  // Golden Ochre
    },
    popSorbet: {
      id: "popSorbet",
      name: "Pop Neon Sorbet (Neon Coral + Electric Cyan + Sunshine)",
      nameAr: "بوب سوربيه نيون (مرجاني فاقع + سماوي كهربائي + أصفر مشرق)",
      bg: "#fcfaf7",
      color1: "#0f172a", // Deep Navy
      color2: "#ff2a6d", // Neon Coral
      color3: "#05d9e8", // Electric Cyan
      accent: "#facc15"  // Sunshine Yellow
    },
    groovyMemphis: {
      id: "groovyMemphis",
      name: "Groovy Memphis (Plum Violet + Mint + Tangerine)",
      nameAr: "ميمفيس غروفي (بنفسجي برقوقي + نعناعي + برتقالي يوسفي)",
      bg: "#faf7f2",
      color1: "#4c1d95", // Deep Plum
      color2: "#0d9488", // Fresh Mint
      color3: "#f97316", // Tangerine
      accent: "#fbbf24"
    },
    chunkyWatercolor: {
      id: "chunkyWatercolor",
      name: "Chunky Watercolor (Cerulean + Coral Rose + Golden Ochre)",
      nameAr: "ألوان مائية عريضة (أزرق سيروليان + وردي مرجاني + مغرة ذهبية)",
      bg: "#fefdfb",
      color1: "#0369a1", // Deep Cerulean
      color2: "#f43f5e", // Coral Rose
      color3: "#d97706", // Golden Ochre
      accent: "#10b981"
    },
    duotoneElectric: {
      id: "duotoneElectric",
      name: "Duotone Poster (Prussian Blue + Acid Tangerine)",
      nameAr: "ملصق ثنائي قوي (أزرق بروسي + برتقالي مشع)",
      bg: "#f8fafc",
      color1: "#0f172a", // Prussian Blue
      color2: "#ea580c", // Acid Tangerine
      color3: "#ea580c",
      accent: "#0ea5e9"
    }
  };

  // 5 Iconic Bauhaus & Pop Archetypes
  const BAUHAUS_ARCHETYPES = {
    popTotem: {
      id: "popTotem",
      name: "Pop Totem",
      nameAr: "طوطم بوب هندسي",
      desc: "Stacked monumental archways, semicircular portals, sunburst arcs, and playful ocular elements.",
      descAr: "بوابات مقوسة متراكبة، أنصاف دوائر شمسية، وعناصر هندسية بصرية كلاسيكية بأسلوب الباوهاوس."
    },
    mondrianFunk: {
      id: "mondrianFunk",
      name: "Mondrian Funk Grid",
      nameAr: "شبكة موندريان فونك",
      desc: "Deconstructivist architectural grid with intersecting bands, offset blocks, and diagonal stripe patches.",
      descAr: "تقسيمات معمارية شبكية جريئة كلوحات موندريان ممزوجة بخطوط قطرية وكتل ملونة غير متناظرة."
    },
    solarOrbit: {
      id: "solarOrbit",
      name: "Solar Orbit & Rays",
      nameAr: "مدارات شمسية وأشعة",
      desc: "Concentric planetary discs, radiant wedge rays, and crescent moons with slicing diagonal tangents.",
      descAr: "أقراص مدارية متحدة المركز، أشعة شمسية مثلثة، وأهلة هندسية تقطعها خطوط حركية رشيقة."
    },
    memphisPop: {
      id: "memphisPop",
      name: "Memphis Pop Groove",
      nameAr: "ميمفيس بوب المعاصر",
      desc: "Funky wavy ribbons, pill capsules, zigzag chevrons, floating dots, and scalloped cloud shapes.",
      descAr: "شرائط متموجة انسيابية، كبسولات هندسية، مساحات منقطة، وأشكال عفوية مفعمة بالحيوية والمرح."
    },
    constructivistTypo: {
      id: "constructivistTypo",
      name: "Typo Constructivist",
      nameAr: "تايبوغرافي بنائي ضخم",
      desc: "Monumental constructivist typography framed by architectural geometric corner rules and stamps.",
      descAr: "حروف تايبوغرافية ضخمة مؤطرة بأركان هندسية وشارات معمارية لافتة للأنظار."
    }
  };

  /**
   * Bauhaus Poster Composition Generator
   */
  class BauhausComposer {
    constructor() {
      this.currentPalette = "classicBauhaus";
      this.currentArchetype = "popTotem";
      this.params = {
        seed: 42,
        density: 6,         // 3 to 12 shapes
        wiggle: 50,         // 0 (strict geometric) to 100 (funky wavy)
        asymmetry: 50,      // 0 (balanced) to 100 (wild pop off-grid)
        palette: "classicBauhaus",
        archetype: "popTotem",
        headline: "BAUHAUS",
        subtitle: "FORM FOLLOWS FUN",
        tagline: "EDITION 2026 · RIYADH",
        numColors: 3
      };
      this.composition = null;
    }

    setParams(newParams) {
      Object.assign(this.params, newParams);
      if (newParams.palette) this.currentPalette = newParams.palette;
      if (newParams.paletteId) this.currentPalette = newParams.paletteId;
      if (newParams.archetype) this.currentArchetype = newParams.archetype;
    }

    generateComposition(options = {}) {
      this.setParams(options);
      const w = options.widthMm || 148;
      const h = options.heightMm || 210;
      const m = options.marginMm !== undefined ? options.marginMm : 12;
      return this.generate(w, h, m);
    }

    /**
     * Builds structured geometric elements for the poster
     */
    generate(widthMm, heightMm, marginMm = 12) {
      const rng = new BauhausPRNG(this.params.seed || 42);
      const drawW = widthMm - 2 * marginMm;
      const drawH = heightMm - 2 * marginMm;
      const cx = widthMm / 2;
      const cy = heightMm / 2;

      const numColors = this.params.numColors || 3;
      const shapes = [];

      // Helper to pick color layer: 1, 2, or 3
      const pickLayer = (pref = 1) => {
        if (numColors === 1) return 1;
        if (numColors === 2) return (pref % 2 === 0 ? 2 : 1);
        return pref;
      };

      const arch = this.params.archetype;
      const wiggleRatio = (this.params.wiggle || 50) / 100;
      const asymRatio = (this.params.asymmetry || 50) / 100;

      // 1. ARCHETYPE GENERATORS
      if (arch === "popTotem") {
        // MONUMENTAL STACKED ARCHES & TOTEMIC SYMMETRY
        const totemX = cx + (rng.next() - 0.5) * 20 * asymRatio;
        const baseW = rng.range(50, drawW * 0.72);
        const baseH = rng.range(80, drawH * 0.55);
        const totemY = cy + rng.range(-15, 20);

        // Big Main Arch
        shapes.push({
          type: "arch",
          x: totemX,
          y: totemY + baseH * 0.15,
          w: baseW,
          h: baseH,
          layer: pickLayer(1),
          fill: true,
          hatchAngle: 45
        });

        // Nested Inner Arch or Portal
        shapes.push({
          type: "arch",
          x: totemX,
          y: totemY + baseH * 0.15 + baseH * 0.1,
          w: baseW * 0.62,
          h: baseH * 0.75,
          layer: pickLayer(2),
          fill: true,
          hatchAngle: -45
        });

        // Central Sun or Iris Disc
        shapes.push({
          type: "circle",
          cx: totemX,
          cy: totemY - baseH * 0.18,
          r: baseW * 0.28,
          layer: pickLayer(3),
          fill: true,
          hatchAngle: 0
        });

        // Radiating rays or concentric rings
        if (rng.bool(0.7)) {
          shapes.push({
            type: "concentricRings",
            cx: totemX,
            cy: totemY - baseH * 0.18,
            rMax: baseW * 0.44,
            ringCount: 4,
            layer: pickLayer(1),
            fill: false
          });
        }

        // Funky Base Steps / Pillars
        const stepCount = Math.floor(rng.range(3, 6));
        const stepW = baseW * 1.15;
        const stepH = 8;
        for (let s = 0; s < stepCount; s++) {
          shapes.push({
            type: "rect",
            x: totemX - (stepW - s * 10) / 2,
            y: totemY + baseH * 0.58 + s * (stepH + 2),
            w: stepW - s * 10,
            h: stepH,
            layer: pickLayer((s % 2) + 1),
            fill: true,
            hatchAngle: 90
          });
        }

        // Pop Accents (Wavy ribbons or floating half-moons)
        if (wiggleRatio > 0.25) {
          shapes.push({
            type: "wavyRibbon",
            x: marginMm + 6,
            y: marginMm + drawH * 0.22,
            w: drawW * 0.35,
            h: 12,
            waves: 4,
            layer: pickLayer(3),
            fill: true
          });
        }

      } else if (arch === "mondrianFunk") {
        // CONSTRUCTIVIST MODULAR GRID & OFFSET COLOR BLOCKS
        const cols = 3 + Math.floor(rng.next() * 2);
        const rows = 4 + Math.floor(rng.next() * 2);
        const cellW = drawW / cols;
        const cellH = drawH / rows;

        // Big intersecting divider lines
        const vCut = marginMm + (1 + Math.floor(rng.next() * (cols - 1))) * cellW;
        const hCut = marginMm + (1 + Math.floor(rng.next() * (rows - 1))) * cellH;

        shapes.push({
          type: "line",
          x1: vCut, y1: marginMm,
          x2: vCut, y2: marginMm + drawH,
          strokeW: 3.5,
          layer: pickLayer(1)
        });

        shapes.push({
          type: "line",
          x1: marginMm, y1: hCut,
          x2: marginMm + drawW, y2: hCut,
          strokeW: 3.5,
          layer: pickLayer(1)
        });

        // 3 to 6 Asymmetric Bold Color Blocks
        const blockPlacements = [
          { x: marginMm + 4, y: marginMm + 4, w: vCut - marginMm - 8, h: hCut - marginMm - 8, layer: 2, angle: 45 },
          { x: vCut + 4, y: hCut + 4, w: marginMm + drawW - vCut - 8, h: marginMm + drawH - hCut - 8, layer: 3, angle: -45 },
          { x: vCut + 6, y: marginMm + 6, w: marginMm + drawW - vCut - 12, h: (hCut - marginMm) * 0.5, layer: 1, angle: 0 }
        ];

        blockPlacements.forEach(b => {
          if (b.w > 15 && b.h > 15) {
            shapes.push({
              type: "rect",
              x: b.x, y: b.y, w: b.w, h: b.h,
              layer: pickLayer(b.layer),
              fill: true,
              hatchAngle: b.angle
            });
          }
        });

        // Intersecting Big Disc breaking the grid
        shapes.push({
          type: "circle",
          cx: vCut,
          cy: hCut,
          r: Math.min(cellW, cellH) * 0.85,
          layer: pickLayer(3),
          fill: true,
          hatchAngle: 45
        });

        // Diagonal striped patch
        shapes.push({
          type: "stripedBlock",
          x: marginMm + 8,
          y: hCut + 12,
          w: (vCut - marginMm) * 0.8,
          h: (marginMm + drawH - hCut) * 0.45,
          stripeW: 3.5,
          angle: 45,
          layer: pickLayer(2)
        });

      } else if (arch === "solarOrbit") {
        // SOLAR GEOMETRY, PLANETARY DISCS & RADIANT ANGULAR RAYS
        const sunX = cx + (rng.next() - 0.5) * 30 * asymRatio;
        const sunY = marginMm + drawH * 0.38;
        const sunR = Math.min(drawW, drawH) * 0.28;

        // Radiant Wedge Rays behind sun
        const rayCount = 8;
        for (let i = 0; i < rayCount; i++) {
          const ang = (i / rayCount) * Math.PI - Math.PI / 2;
          shapes.push({
            type: "ray",
            cx: sunX, cy: sunY,
            ang,
            length: sunR * 1.7,
            widthAngle: 0.12,
            layer: pickLayer(3),
            fill: true
          });
        }

        // Big Central Sun Disc
        shapes.push({
          type: "circle",
          cx: sunX, cy: sunY,
          r: sunR,
          layer: pickLayer(1),
          fill: true,
          hatchAngle: 45
        });

        // Crescent Slicing Shadow
        shapes.push({
          type: "crescent",
          cx: sunX, cy: sunY,
          r: sunR * 0.95,
          offsetR: sunR * 0.45,
          layer: pickLayer(2),
          fill: true,
          hatchAngle: -45
        });

        // Concentric Orbit Track Lines
        shapes.push({
          type: "concentricRings",
          cx: sunX, cy: sunY,
          rMax: sunR * 2.1,
          ringCount: 3,
          layer: pickLayer(1),
          fill: false
        });

        // Satellite Moon Discs
        shapes.push({
          type: "circle",
          cx: sunX + sunR * 1.45,
          cy: sunY - sunR * 0.55,
          r: sunR * 0.26,
          layer: pickLayer(2),
          fill: true,
          hatchAngle: 90
        });

        shapes.push({
          type: "circle",
          cx: sunX - sunR * 1.25,
          cy: sunY + sunR * 0.85,
          r: sunR * 0.18,
          layer: pickLayer(3),
          fill: true,
          hatchAngle: 0
        });

      } else if (arch === "memphisPop") {
        // FUNKY MEMPHIS GROOVE: SQUIGGLES, CAPSULES & PLAYFUL SHAPES
        const shapeCount = Math.floor(rng.range(6, 11));
        
        // 1. Giant Background Pill / Arch
        shapes.push({
          type: "pill",
          x: cx - drawW * 0.3,
          y: marginMm + drawH * 0.12,
          w: drawW * 0.6,
          h: drawH * 0.62,
          vertical: true,
          layer: pickLayer(1),
          fill: true,
          hatchAngle: 45
        });

        // 2. Playful Wavy Snake Ribbons
        shapes.push({
          type: "wavyRibbon",
          x: marginMm + 10,
          y: marginMm + drawH * 0.32,
          w: drawW * 0.8,
          h: 22,
          waves: 5,
          layer: pickLayer(2),
          fill: true
        });

        shapes.push({
          type: "wavyRibbon",
          x: marginMm + 15,
          y: marginMm + drawH * 0.58,
          w: drawW * 0.75,
          h: 16,
          waves: 4,
          layer: pickLayer(3),
          fill: true
        });

        // 3. Floating Geometric Candies (Triangles, Half Moons, Donut Rings)
        for (let i = 0; i < shapeCount; i++) {
          const rx = marginMm + rng.next() * (drawW - 30);
          const ry = marginMm + rng.next() * (drawH - 30);
          const size = rng.range(12, 34);
          const layerIdx = pickLayer((i % 3) + 1);

          const choice = i % 4;
          if (choice === 0) {
            shapes.push({ type: "circle", cx: rx, cy: ry, r: size / 2, layer: layerIdx, fill: true, hatchAngle: 45 });
          } else if (choice === 1) {
            shapes.push({ type: "triangle", cx: rx, cy: ry, size, angle: rng.choice([0, 45, 90, 180]), layer: layerIdx, fill: true });
          } else if (choice === 2) {
            shapes.push({ type: "halfMoon", cx: rx, cy: ry, r: size / 2, angle: rng.choice([0, 90, 180, 270]), layer: layerIdx, fill: true });
          } else {
            shapes.push({ type: "checkerboard", x: rx, y: ry, w: size, h: size, cols: 3, rows: 3, layer: layerIdx });
          }
        }

      } else {
        // CONSTRUCTIVIST TYPO & MONUMENTAL POSTER FRAMES
        // Large diagonal banner wedge
        shapes.push({
          type: "diagonalBand",
          yStart: marginMm + drawH * 0.25,
          bandH: drawH * 0.28,
          slope: -0.22,
          layer: pickLayer(2),
          fill: true,
          hatchAngle: 45
        });

        // Architectural Arch at Top
        shapes.push({
          type: "arch",
          x: cx,
          y: marginMm + drawH * 0.18,
          w: drawW * 0.75,
          h: drawH * 0.35,
          layer: pickLayer(1),
          fill: false,
          strokeW: 3.5
        });

        // Big Solid Circle Stamp
        shapes.push({
          type: "circle",
          cx: cx + drawW * 0.22,
          cy: marginMm + drawH * 0.62,
          r: drawW * 0.22,
          layer: pickLayer(3),
          fill: true,
          hatchAngle: -45
        });

        // Slicing horizontal beams
        shapes.push({
          type: "rect",
          x: marginMm + 8,
          y: marginMm + drawH * 0.75,
          w: drawW * 0.65,
          h: 12,
          layer: pickLayer(1),
          fill: true,
          hatchAngle: 0
        });
      }

      // 2. TYPOGRAPHIC CONSTRUCTIVIST BLOCKS
      const typo = {
        headline: this.params.headline || "BAUHAUS",
        subtitle: this.params.subtitle || "FORM FOLLOWS FUN",
        tagline: this.params.tagline || "EDITION 2026 · RIYADH",
        x: cx,
        y: marginMm + drawH * 0.88,
        layer: pickLayer(1)
      };

      // 3. ARCHITECTURAL REGISTRATION MARKS & FRAME
      const frame = {
        x: marginMm,
        y: marginMm,
        w: drawW,
        h: drawH,
        layer: pickLayer(1)
      };

      this.composition = {
        widthMm,
        heightMm,
        marginMm,
        shapes,
        typo,
        frame,
        paletteId: this.currentPalette,
        palette: BAUHAUS_PALETTES[this.currentPalette] || BAUHAUS_PALETTES.classicBauhaus,
        numColors
      };

      return this.composition;
    }

    /**
     * Renders graphic view onto HTML5 canvas (for screen preview)
     */
    renderGraphic(canvas, isWatercolor = true) {
      if (!this.composition) return;
      const comp = this.composition;
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const scale = W / comp.widthMm;

      const pal = comp.palette;

      // 1. Clean Paper Background
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, W, H);

      // Watercolor blend mode: translucent multiply
      ctx.save();
      if (isWatercolor) {
        ctx.globalAlpha = 0.85;
        ctx.globalCompositeOperation = "multiply";
      }

      const getColor = (layerIdx) => {
        if (layerIdx === 2) return pal.color2;
        if (layerIdx === 3) return pal.color3;
        return pal.color1;
      };

      // 2. Draw Shapes
      comp.shapes.forEach(s => {
        ctx.save();
        const color = getColor(s.layer);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(2, (s.strokeW || 2) * (scale / 3.77));
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (s.type === "arch") {
          const x = (s.x - s.w / 2) * scale;
          const y = (s.y - s.h / 2) * scale;
          const w = s.w * scale;
          const h = s.h * scale;
          const r = w / 2;

          ctx.beginPath();
          ctx.moveTo(x, y + h);
          ctx.lineTo(x, y + r);
          ctx.arc(x + r, y + r, r, Math.PI, 0, false);
          ctx.lineTo(x + w, y + h);
          ctx.closePath();
          if (s.fill) ctx.fill();
          else ctx.stroke();

        } else if (s.type === "circle") {
          ctx.beginPath();
          ctx.arc(s.cx * scale, s.cy * scale, s.r * scale, 0, Math.PI * 2);
          if (s.fill) ctx.fill();
          else ctx.stroke();

        } else if (s.type === "crescent") {
          ctx.beginPath();
          ctx.arc(s.cx * scale, s.cy * scale, s.r * scale, -Math.PI / 2, Math.PI / 2, false);
          ctx.arc((s.cx + s.offsetR * 0.4) * scale, s.cy * scale, s.r * scale * 0.9, Math.PI / 2, -Math.PI / 2, true);
          ctx.closePath();
          ctx.fill();

        } else if (s.type === "rect") {
          ctx.beginPath();
          ctx.rect(s.x * scale, s.y * scale, s.w * scale, s.h * scale);
          if (s.fill) ctx.fill();
          else ctx.stroke();

        } else if (s.type === "concentricRings") {
          for (let k = 1; k <= s.ringCount; k++) {
            const rad = (s.rMax * (k / s.ringCount)) * scale;
            ctx.beginPath();
            ctx.arc(s.cx * scale, s.cy * scale, rad, 0, Math.PI * 2);
            ctx.stroke();
          }

        } else if (s.type === "wavyRibbon") {
          const startX = s.x * scale;
          const startY = s.y * scale;
          const w = s.w * scale;
          const amp = s.h * scale * 0.4;
          const waves = s.waves || 4;

          ctx.beginPath();
          for (let px = 0; px <= w; px += 2) {
            const waveY = startY + Math.sin((px / w) * waves * Math.PI * 2) * amp;
            if (px === 0) ctx.moveTo(startX + px, waveY);
            else ctx.lineTo(startX + px, waveY);
          }
          ctx.lineWidth = s.h * scale * 0.6;
          ctx.stroke();

        } else if (s.type === "triangle") {
          const cx = s.cx * scale;
          const cy = s.cy * scale;
          const sz = s.size * scale;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((s.angle * Math.PI) / 180);
          ctx.beginPath();
          ctx.moveTo(0, -sz * 0.6);
          ctx.lineTo(sz * 0.55, sz * 0.45);
          ctx.lineTo(-sz * 0.55, sz * 0.45);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

        } else if (s.type === "halfMoon") {
          const cx = s.cx * scale;
          const cy = s.cy * scale;
          const r = s.r * scale;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((s.angle * Math.PI) / 180);
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI, false);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

        } else if (s.type === "pill") {
          const x = s.x * scale;
          const y = s.y * scale;
          const w = s.w * scale;
          const h = s.h * scale;
          const r = Math.min(w, h) / 2;
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, r);
          if (s.fill) ctx.fill();
          else ctx.stroke();

        } else if (s.type === "stripedBlock") {
          const bx = s.x * scale;
          const by = s.y * scale;
          const bw = s.w * scale;
          const bh = s.h * scale;
          ctx.save();
          ctx.beginPath();
          ctx.rect(bx, by, bw, bh);
          ctx.clip();
          ctx.lineWidth = Math.max(2, s.stripeW * scale);
          const diag = Math.hypot(bw, bh);
          for (let d = -diag; d <= diag; d += s.stripeW * scale * 2.2) {
            ctx.beginPath();
            ctx.moveTo(bx + d, by);
            ctx.lineTo(bx + d + diag, by + diag);
            ctx.stroke();
          }
          ctx.restore();

        } else if (s.type === "checkerboard") {
          const bx = s.x * scale;
          const by = s.y * scale;
          const cw = (s.w * scale) / s.cols;
          const ch = (s.h * scale) / s.rows;
          for (let r = 0; r < s.rows; r++) {
            for (let c = 0; c < s.cols; c++) {
              if ((r + c) % 2 === 0) {
                ctx.fillRect(bx + c * cw, by + r * ch, cw, ch);
              }
            }
          }

        } else if (s.type === "ray") {
          const cx = s.cx * scale;
          const cy = s.cy * scale;
          const len = s.length * scale;
          const a1 = s.ang - s.widthAngle / 2;
          const a2 = s.ang + s.widthAngle / 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a1) * len, cy + Math.sin(a1) * len);
          ctx.lineTo(cx + Math.cos(a2) * len, cy + Math.sin(a2) * len);
          ctx.closePath();
          ctx.fill();

        } else if (s.type === "diagonalBand") {
          const y0 = s.yStart * scale;
          const bh = s.bandH * scale;
          const slope = s.slope;
          ctx.beginPath();
          ctx.moveTo(0, y0);
          ctx.lineTo(W, y0 + W * slope);
          ctx.lineTo(W, y0 + W * slope + bh);
          ctx.lineTo(0, y0 + bh);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      // 3. Draw Architectural Passe-Partout Framing & Corner Crosses
      ctx.strokeStyle = pal.color1;
      ctx.lineWidth = Math.max(1, 0.8 * (scale / 3.77));
      const mx = comp.marginMm * scale;
      const my = comp.marginMm * scale;
      const mw = (comp.widthMm - 2 * comp.marginMm) * scale;
      const mh = (comp.heightMm - 2 * comp.marginMm) * scale;

      ctx.strokeRect(mx, my, mw, mh);

      // Corner Registration Crosses
      const crossSize = 6 * (scale / 3.77);
      const corners = [
        [mx, my], [mx + mw, my],
        [mx, my + mh], [mx + mw, my + mh]
      ];
      corners.forEach(([kx, ky]) => {
        ctx.beginPath();
        ctx.moveTo(kx - crossSize, ky);
        ctx.lineTo(kx + crossSize, ky);
        ctx.moveTo(kx, ky - crossSize);
        ctx.lineTo(kx, ky + crossSize);
        ctx.stroke();
      });

      // 4. Constructivist Monumental Typography
      ctx.restore(); // Exit multiply blend for crisp typography
      ctx.save();
      const typo = comp.typo;
      ctx.fillStyle = pal.color1;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Headline
      const headFontSize = Math.max(18, Math.round(W * 0.082));
      ctx.font = `900 ${headFontSize}px "Helvetica Neue", "Arial Black", sans-serif`;
      ctx.letterSpacing = "0.14em";
      ctx.fillText(typo.headline.toUpperCase(), typo.x * scale, (typo.y - 10) * scale);

      // Thin Accent Divider
      ctx.strokeStyle = pal.color2;
      ctx.lineWidth = Math.max(1.5, 1.2 * (scale / 3.77));
      ctx.beginPath();
      ctx.moveTo((typo.x - 35) * scale, (typo.y - 2) * scale);
      ctx.lineTo((typo.x + 35) * scale, (typo.y - 2) * scale);
      ctx.stroke();

      // Subtitle
      const subFontSize = Math.max(9, Math.round(W * 0.026));
      ctx.font = `700 ${subFontSize}px "Helvetica Neue", Arial, sans-serif`;
      ctx.fillStyle = pal.color1;
      ctx.fillText(typo.subtitle.toUpperCase(), typo.x * scale, (typo.y + 6) * scale);

      // Bottom Tagline
      const tagFontSize = Math.max(8, Math.round(W * 0.02));
      ctx.font = `600 ${tagFontSize}px monospace`;
      ctx.fillStyle = "rgba(24, 24, 27, 0.65)";
      ctx.fillText(typo.tagline.toUpperCase(), typo.x * scale, (typo.y + 13) * scale);

      ctx.restore();
    }

    /**
     * Converts the Bauhaus composition into genuine physical pen plotter vector toolpaths.
     * Filled geometric shapes are hatched with wide directional sweeps scaled for the chosen nib tip!
     */
    generateVectorPaths(nibScale = 3.5, numColors = 3) {
      if (!this.composition) return { layer1: [], layer2: [], layer3: [] };

      const comp = this.composition;
      const layer1 = [];
      const layer2 = [];
      const layer3 = [];

      const getLayerList = (lIdx) => {
        if (numColors === 1) return layer1;
        if (numColors === 2) return (lIdx % 2 === 0 ? layer2 : layer1);
        if (lIdx === 2) return layer2;
        if (lIdx === 3) return layer3;
        return layer1;
      };

      // Hatch spacing in mm based on nib tip width (tightened for solid marker fills)
      const hatchSpacing = Math.max(1.2, 1.5 * (nibScale / 3.0));

      // 1. Convert Shapes to Outlines & Hatch Sweeps
      comp.shapes.forEach(s => {
        const targetList = getLayerList(s.layer);

        if (s.type === "arch") {
          const x0 = s.x - s.w / 2;
          const y0 = s.y - s.h / 2;
          const w = s.w;
          const h = s.h;
          const r = w / 2;

          // Outline path
          const outline = [];
          outline.push([x0, y0 + h]);
          outline.push([x0, y0 + r]);
          const steps = 24;
          for (let i = 0; i <= steps; i++) {
            const th = Math.PI - (i / steps) * Math.PI;
            outline.push([x0 + r + r * Math.cos(th), y0 + r - r * Math.sin(th)]);
          }
          outline.push([x0 + w, y0 + h]);
          outline.push([x0, y0 + h]);
          targetList.push(outline);

          // Hatch fill sweeps
          if (s.fill) {
            const numLines = Math.floor(h / hatchSpacing);
            for (let i = 1; i < numLines; i++) {
              const curY = y0 + i * hatchSpacing;
              let xLeft = x0;
              let xRight = x0 + w;
              if (curY < y0 + r) {
                const dy = (y0 + r) - curY;
                const dx = Math.sqrt(Math.max(0, r * r - dy * dy));
                xLeft = x0 + r - dx;
                xRight = x0 + r + dx;
              }
              if (xRight - xLeft > 2.0) {
                if (i % 2 === 0) targetList.push([[xLeft, curY], [xRight, curY]]);
                else targetList.push([[xRight, curY], [xLeft, curY]]);
              }
            }
          }

        } else if (s.type === "circle") {
          const outline = [];
          const steps = 36;
          for (let i = 0; i <= steps; i++) {
            const th = (i / steps) * Math.PI * 2;
            outline.push([s.cx + s.r * Math.cos(th), s.cy + s.r * Math.sin(th)]);
          }
          targetList.push(outline);

          if (s.fill) {
            // Concentric or parallel hatch sweeps
            const rings = Math.floor(s.r / hatchSpacing);
            for (let k = 1; k < rings; k++) {
              const ringR = k * hatchSpacing;
              const ringPts = [];
              const rSteps = Math.max(16, Math.floor(ringR * 4));
              for (let i = 0; i <= rSteps; i++) {
                const th = (i / rSteps) * Math.PI * 2;
                ringPts.push([s.cx + ringR * Math.cos(th), s.cy + ringR * Math.sin(th)]);
              }
              targetList.push(ringPts);
            }
          }

        } else if (s.type === "rect") {
          const x1 = s.x;
          const y1 = s.y;
          const x2 = s.x + s.w;
          const y2 = s.y + s.h;

          // Outline
          targetList.push([
            [x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]
          ]);

          // Serpentine hatch sweep
          if (s.fill) {
            const nLines = Math.floor(s.h / hatchSpacing);
            for (let i = 1; i < nLines; i++) {
              const hy = y1 + i * hatchSpacing;
              if (i % 2 === 0) targetList.push([[x1, hy], [x2, hy]]);
              else targetList.push([[x2, hy], [x1, hy]]);
            }
          }

        } else if (s.type === "concentricRings") {
          for (let k = 1; k <= s.ringCount; k++) {
            const rad = s.rMax * (k / s.ringCount);
            const ringPts = [];
            const rSteps = Math.max(18, Math.floor(rad * 4));
            for (let i = 0; i <= rSteps; i++) {
              const th = (i / rSteps) * Math.PI * 2;
              ringPts.push([s.cx + rad * Math.cos(th), s.cy + rad * Math.sin(th)]);
            }
            targetList.push(ringPts);
          }

        } else if (s.type === "wavyRibbon") {
          const steps = 40;
          const pts = [];
          const waves = s.waves || 4;
          const amp = s.h * 0.4;
          for (let i = 0; i <= steps; i++) {
            const px = s.x + (i / steps) * s.w;
            const py = s.y + Math.sin((i / steps) * waves * Math.PI * 2) * amp;
            pts.push([px, py]);
          }
          targetList.push(pts);

          // Parallel ribbon tracks for chunky width
          const tracks = Math.max(1, Math.floor(s.h / hatchSpacing));
          for (let t = 1; t <= tracks; t++) {
            const offset = (t - tracks / 2) * (hatchSpacing * 0.75);
            const parallelTrack = pts.map(([x, y]) => [x, y + offset]);
            targetList.push(parallelTrack);
          }

        } else if (s.type === "pill") {
          const x = s.x, y = s.y, w = s.w, h = s.h;
          const r = Math.min(w, h) / 2;
          const outline = [];
          // Draw pill contour
          const steps = 18;
          for (let i = 0; i <= steps; i++) {
            const th = Math.PI - (i / steps) * Math.PI;
            outline.push([x + r + r * Math.cos(th), y + r - r * Math.sin(th)]);
          }
          for (let i = 0; i <= steps; i++) {
            const th = -(i / steps) * Math.PI;
            outline.push([x + r + r * Math.cos(th), y + h - r - r * Math.sin(th)]);
          }
          outline.push(outline[0]);
          targetList.push(outline);

          if (s.fill) {
            const nLines = Math.floor((h - 2 * r) / hatchSpacing);
            for (let i = 1; i <= nLines; i++) {
              const curY = y + r + i * hatchSpacing;
              targetList.push([[x, curY], [x + w, curY]]);
            }
          }

        } else if (s.type === "triangle") {
          const sz = s.size;
          const rad = (s.angle * Math.PI) / 180;
          const cos = Math.cos(rad), sin = Math.sin(rad);
          const p1 = [0, -sz * 0.6];
          const p2 = [sz * 0.55, sz * 0.45];
          const p3 = [-sz * 0.55, sz * 0.45];

          const rot = ([px, py]) => [
            s.cx + px * cos - py * sin,
            s.cy + px * sin + py * cos
          ];

          targetList.push([rot(p1), rot(p2), rot(p3), rot(p1)]);

        } else if (s.type === "halfMoon") {
          const outline = [];
          const rad = (s.angle * Math.PI) / 180;
          const cos = Math.cos(rad), sin = Math.sin(rad);
          const r = s.r;
          const steps = 24;
          for (let i = 0; i <= steps; i++) {
            const th = (i / steps) * Math.PI;
            const px = r * Math.cos(th);
            const py = r * Math.sin(th);
            outline.push([s.cx + px * cos - py * sin, s.cy + px * sin + py * cos]);
          }
          outline.push(outline[0]);
          targetList.push(outline);

        } else if (s.type === "diagonalBand") {
          const y0 = s.yStart;
          const bh = s.bandH;
          const W = comp.widthMm;
          const slope = s.slope;
          targetList.push([
            [0, y0],
            [W, y0 + W * slope],
            [W, y0 + W * slope + bh],
            [0, y0 + bh],
            [0, y0]
          ]);
          // Diagonal hatch lines
          const numLines = Math.floor(bh / hatchSpacing);
          for (let i = 1; i < numLines; i++) {
            const hy = y0 + i * hatchSpacing;
            targetList.push([
              [0, hy],
              [W, hy + W * slope]
            ]);
          }
        }
      });

      // 2. Add Border Frame & Registration Crosses to Layer 1
      const mx = comp.marginMm;
      const my = comp.marginMm;
      const mw = comp.widthMm - 2 * comp.marginMm;
      const mh = comp.heightMm - 2 * comp.marginMm;

      layer1.push([
        [mx, my], [mx + mw, my], [mx + mw, my + mh], [mx, my + mh], [mx, my]
      ]);

      const crossSize = 2.5;
      [[mx, my], [mx + mw, my], [mx, my + mh], [mx + mw, my + mh]].forEach(([kx, ky]) => {
        layer1.push([[kx - crossSize, ky], [kx + crossSize, ky]]);
        layer1.push([[kx, ky - crossSize], [kx, ky + crossSize]]);
      });

      // 3. Add Typographic Framing Accents to Layer 1 & 2
      const typo = comp.typo;
      layer2.push([
        [typo.x - 30, typo.y - 1.5],
        [typo.x + 30, typo.y - 1.5]
      ]);

      // Optimize path traversal
      const optTSP = (typeof window !== "undefined" && window.optimizePathsTSP)
        ? window.optimizePathsTSP
        : (p => p);

      return {
        layer1: optTSP(layer1),
        layer2: optTSP(layer2),
        layer3: optTSP(layer3)
      };
    }
  }

  // Export globally
  window.BAUHAUS_PALETTES = BAUHAUS_PALETTES;
  window.BAUHAUS_ARCHETYPES = BAUHAUS_ARCHETYPES;
  window.BauhausComposer = BauhausComposer;

})(typeof window !== "undefined" ? window : global);
