// Built-in aesthetic poster samples for immediate testing
// These provide SVG / DataURL posters so participants can experiment even before uploading their own!
window.POSTER_SAMPLES = [
  {
    id: "swiss",
    name: "Swiss Typography",
    nameAr: "ملصق تايبوغرافي سويسري",
    tag: "Graphic Design",
    bg: "#f4f2eb",
    render: (ctx, w, h) => {
      ctx.fillStyle = "#f4f2eb";
      ctx.fillRect(0, 0, w, h);
      
      // Swiss grid layout
      ctx.fillStyle = "#111111";
      ctx.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.02);
      
      // Big geometric circles & typography
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.45, w * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = "#161616";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w * 0.65, h * 0.38, w * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = "#f4f2eb";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w * 0.72, h * 0.35, w * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = "#161616";
      ctx.fill();

      // Bold structural bars
      ctx.fillStyle = "#111111";
      for (let i = 0; i < 5; i++) {
        const y = h * 0.72 + i * (h * 0.035);
        ctx.fillRect(w * 0.1, y, w * (0.8 - i * 0.12), h * 0.015);
      }

      // Large number / typography block
      ctx.font = `900 ${Math.floor(w * 0.28)}px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`;
      ctx.fillStyle = "#111111";
      ctx.fillText("84", w * 0.1, h * 0.38);

      ctx.font = `700 ${Math.floor(w * 0.055)}px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`;
      ctx.fillText("KINETIC FORMS", w * 0.1, h * 0.66);
      
      ctx.font = `400 ${Math.floor(w * 0.03)}px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`;
      ctx.fillText("INTERNATIONAL TYPOGRAPHIC STYLE · 1984", w * 0.1, h * 0.70);
    }
  },
  {
    id: "sculpture",
    name: "Classical Statue",
    nameAr: "تمثال كلاسيكي",
    tag: "High Contrast",
    bg: "#111114",
    render: (ctx, w, h) => {
      // Dark dramatic background
      ctx.fillStyle = "#0c0d12";
      ctx.fillRect(0, 0, w, h);
      
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.05, w * 0.5, h * 0.45, w * 0.6);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.35, "#c4cad6");
      grad.addColorStop(0.7, "#282d3c");
      grad.addColorStop(1, "#0c0d12");
      ctx.fillStyle = grad;
      
      // Sculpture silhouette
      ctx.beginPath();
      // Head and neck oval
      ctx.ellipse(w * 0.5, h * 0.42, w * 0.28, h * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Facial contour depth
      ctx.fillStyle = "#0a0a0f";
      // Shadow side of face
      ctx.beginPath();
      ctx.ellipse(w * 0.58, h * 0.44, w * 0.16, h * 0.22, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Strong highlight cheek and nose
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(w * 0.42, h * 0.38, w * 0.09, h * 0.14, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal / Bust shoulders
      ctx.beginPath();
      ctx.moveTo(w * 0.15, h * 0.88);
      ctx.quadraticCurveTo(w * 0.35, h * 0.65, w * 0.5, h * 0.68);
      ctx.quadraticCurveTo(w * 0.65, h * 0.65, w * 0.85, h * 0.88);
      ctx.lineTo(w * 0.85, h * 0.95);
      ctx.lineTo(w * 0.15, h * 0.95);
      ctx.closePath();
      ctx.fillStyle = "#64748b";
      ctx.fill();

      // Typography overlay
      ctx.fillStyle = "#ffffff";
      ctx.font = `800 ${Math.floor(w * 0.07)}px -apple-system, sans-serif`;
      ctx.fillText("APHRODITE", w * 0.12, h * 0.14);
      ctx.font = `400 ${Math.floor(w * 0.03)}px -apple-system, sans-serif`;
      ctx.fillText("MUSEUM ARCHIVE · MARBLE STUDY", w * 0.12, h * 0.18);
    }
  },
  {
    id: "botanical",
    name: "Botanical Riso",
    nameAr: "ورقة نباتية ريزوغراف",
    tag: "Organic & Flowing",
    bg: "#faf5ee",
    render: (ctx, w, h) => {
      ctx.fillStyle = "#faf5ee";
      ctx.fillRect(0, 0, w, h);

      // Huge organic monstera / palm leaf contours
      ctx.save();
      ctx.translate(w * 0.5, h * 0.52);

      // Stem
      ctx.lineWidth = w * 0.02;
      ctx.strokeStyle = "#1b2a1e";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.35);
      ctx.quadraticCurveTo(w * 0.05, 0, -w * 0.04, -h * 0.35);
      ctx.stroke();

      // Leaf segments
      ctx.fillStyle = "#223826";
      for (let i = -4; i <= 4; i++) {
        if (i === 0) continue;
        const y = i * (h * 0.065);
        const side = i > 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.quadraticCurveTo(
          side * w * 0.45,
          y - h * 0.08,
          side * w * 0.38,
          y + h * 0.04
        );
        ctx.quadraticCurveTo(side * w * 0.18, y + h * 0.06, 0, y + h * 0.03);
        ctx.fill();
      }

      ctx.restore();

      // Big sun circle behind leaf
      ctx.globalCompositeOperation = "destination-over";
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.42, w * 0.36, 0, Math.PI * 2);
      ctx.fillStyle = "#e2d2b8";
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // Header text
      ctx.fillStyle = "#1b2a1e";
      ctx.font = `700 ${Math.floor(w * 0.06)}px serif`;
      ctx.fillText("MONSTERA DELICIOSA", w * 0.1, h * 0.12);
      ctx.font = `italic 400 ${Math.floor(w * 0.035)}px serif`;
      ctx.fillText("Botanical Monograph No. 12", w * 0.1, h * 0.16);
    }
  },
  {
    id: "cyberpunk",
    name: "Cyber Club Poster",
    nameAr: "ملصق إلكتروني للموسيقى",
    tag: "Futuristic Glitch",
    bg: "#08090f",
    render: (ctx, w, h) => {
      ctx.fillStyle = "#08090f";
      ctx.fillRect(0, 0, w, h);

      // Gradient sphere / portal
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.48, w * 0.05, w * 0.5, h * 0.48, w * 0.42);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.3, "#a855f7");
      grad.addColorStop(0.6, "#2563eb");
      grad.addColorStop(1, "#08090f");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.48, w * 0.38, 0, Math.PI * 2);
      ctx.fill();

      // Cyber lines & crosshairs
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.08, h * 0.48);
      ctx.lineTo(w * 0.92, h * 0.48);
      ctx.moveTo(w * 0.5, h * 0.12);
      ctx.lineTo(w * 0.5, h * 0.84);
      ctx.stroke();

      // Concentric target rings
      for (let r = 0.12; r <= 0.32; r += 0.07) {
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.48, w * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Bold display typography
      ctx.fillStyle = "#ffffff";
      ctx.font = `900 ${Math.floor(w * 0.11)}px -apple-system, sans-serif`;
      ctx.fillText("SYNTHESIS", w * 0.08, h * 0.11);

      ctx.font = `700 ${Math.floor(w * 0.038)}px monospace`;
      ctx.fillText("FREQ // 142.80 MHz", w * 0.08, h * 0.91);
      ctx.fillText("OCTOBER 2026", w * 0.08, h * 0.94);
    }
  },
  {
    id: "brutalist",
    name: "Brutalist Architecture",
    nameAr: "عمارة بروتاليزم خرسانية",
    tag: "Geometric Grid",
    bg: "#e7e5e4",
    render: (ctx, w, h) => {
      ctx.fillStyle = "#e7e5e4";
      ctx.fillRect(0, 0, w, h);

      // Concrete cantilever blocks
      const darkColor = "#1c1917";
      const midColor = "#78716c";

      ctx.fillStyle = darkColor;
      ctx.fillRect(w * 0.12, h * 0.22, w * 0.76, h * 0.18);

      ctx.fillStyle = midColor;
      ctx.fillRect(w * 0.24, h * 0.44, w * 0.64, h * 0.15);

      ctx.fillStyle = darkColor;
      ctx.fillRect(w * 0.12, h * 0.62, w * 0.54, h * 0.22);

      // Angled shadow wedges
      ctx.beginPath();
      ctx.moveTo(w * 0.66, h * 0.62);
      ctx.lineTo(w * 0.88, h * 0.74);
      ctx.lineTo(w * 0.88, h * 0.84);
      ctx.lineTo(w * 0.66, h * 0.84);
      ctx.closePath();
      ctx.fillStyle = midColor;
      ctx.fill();

      // Grid of window slits
      ctx.fillStyle = "#e7e5e4";
      for (let c = 0; c < 8; c++) {
        ctx.fillRect(w * 0.16 + c * (w * 0.085), h * 0.26, w * 0.04, h * 0.1);
      }

      ctx.fillStyle = darkColor;
      ctx.font = `900 ${Math.floor(w * 0.09)}px -apple-system, sans-serif`;
      ctx.fillText("CONCRETE", w * 0.12, h * 0.13);
      ctx.font = `600 ${Math.floor(w * 0.035)}px -apple-system, sans-serif`;
      ctx.fillText("FORMS IN DIALOGUE · 03", w * 0.12, h * 0.17);
    }
  }
];

// Helper to convert sample to Image element
window.createSampleImage = function(sampleId, width = 600, height = 850) {
  const sample = window.POSTER_SAMPLES.find(s => s.id === sampleId) || window.POSTER_SAMPLES[0];
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  sample.render(ctx, width, height);
  const img = new Image();
  img.src = canvas.toDataURL("image/png");
  return img;
};
