/**
 * Poster Plotter Studio - Main Application Controller
 * Beginner-Friendly 3-Step Workflow, Live Preview, Simulator, & Bilingual Support
 */

// Global Bilingual Dictionary
const I18N = {
  en: {
    appTitle: "Poster Plotter Studio",
    appSub: "Contemporary Algorithmic Vector Art for Pen Plotters",
    langBtn: "العربية",
    step1Title: "1. Choose or Drop Poster",
    step1Desc: "Upload your poster design or choose a sample to start:",
    dropTitle: "Drop your poster image here",
    dropSub: "or click to browse (JPG, PNG, WebP)",
    sampleSwiss: "Swiss Typography",
    sampleSculpture: "Classical Statue",
    sampleBotanical: "Botanical Riso",
    sampleCyber: "Cyber Club Poster",
    sampleBrutalist: "Brutalist Architecture",
    step2Title: "2. Pick an Algorithm",
    step2Desc: "Choose an experimental generative style inspired by contemporary poster art:",
    step3Title: "3. Quick Vibe & Plot",
    step3Desc: "Pick a starter vibe, adjust 3 simple sliders, or tweak deep settings:",
    colorModeTitle: "Pen Colors (Workshop: 1–3 Max)",
    pen1Mode: "1 Pen",
    pen1Sub: "Fastest · 0 Swaps",
    pen2Mode: "2 Pens",
    pen2Sub: "Duotone · 1 Swap",
    pen3Mode: "3 Pens",
    pen3Sub: "Tritone · 2 Swaps",
    vibeFast: "⚡ Fast Plot (~4m)",
    vibePoster: "🎯 Contemporary (~8m)",
    vibeWatercolor: "🖌️ Chunky Marker (~4m)",
    vibeDuotone: "🎨 Duotone Block (~9m)",
    vibeTritone: "🌈 Riso 3-Trio (~14m)",
    nibModeTitle: "🖌️ Pen / Marker Tip",
    nibFine: "Fine Liner",
    nibChunky: "Chunky Watercolor",
    nibBroad: "Broad Posca",
    sliderDensity: "Detail Density",
    sliderDensityHint: "Fewer lines (faster) ↔ Intricate detail",
    sliderStyle: "Line Character",
    sliderStyleHint: "Smooth gentle lines ↔ Expressive waveforms",
    sliderDepth: "Shadow Depth",
    sliderDepthHint: "Light delicate sketch ↔ Deep intense shading",
    advancedHeader: "⚙️ Advanced Plotter Settings",
    paperSizeLabel: "Paper Size:",
    orientationTitle: "Poster Orientation",
    oriLandscape: "Horizontal",
    oriPortrait: "Vertical",
    oriLandscapeSub: "20.3 × 15.2 cm (8×6\")",
    oriPortraitSub: "15.2 × 20.3 cm (6×8\")",
    paperStockLabel: "Paper Stock:",
    penColorLabel: "Pen & Ink Palette:",
    marginLabel: "Safe Margin (mm):",
    invertLabel: "Invert (White ink on dark paper)",
    dualPenLabel: "Split into 2 Pen Layers (Layer 1 + Layer 2)",
    shuffleSeed: "🎲 Shuffle Seed",
    statTime: "Est. Plot Time",
    statLifts: "Pen Lifts",
    statDist: "Drawing Length",
    statSafe: "Plotter Safe",
    btnSimulate: "▶️ Watch Plotter Draw",
    btnPause: "⏸️ Pause Simulator",
    btnResetSim: "⏮️ Reset",
    btnExportSvg: "📥 Download Plotter SVG",
    btnExportPng: "🖼️ Save Image (PNG)",
    zoomFit: "Fit View",
    zoomIn: "+",
    zoomOut: "-",
    simStatusDrawing: "Simulating Plotter...",
    simStatusDone: "Simulation Finished!",
    badgeSafe: "Safe for Pens & Paper",
    singleLineBadge: "Zero Pen Lifts!",
    tabTransform: "Transform Poster",
    tabCustom: "Make Your Own Poster",
    tabCustomBadge: "Interactive Canvas",
    customStep1Title: "1. Add Shapes & Typography",
    customStep1Desc: "Click any shape or text to place it onto your poster canvas:",
    shapeCircle: "Circle",
    shapeArch: "Arch",
    shapeRect: "Block",
    shapeTriangle: "Triangle",
    shapeSquiggle: "Squiggle",
    shapePill: "Capsule",
    shapeHalfMoon: "Half Moon",
    shapeSunburst: "Sunburst",
    btnAddText: "Add Text / Typography",
    btnStarterTemplate: "✨ Starter Layout",
    btnClearCanvas: "🗑️ Clear Canvas",
    customStep2Title: "2. Move, Rotate & Style",
    customStep2Desc: "Drag elements on canvas, or tune precision controls below:",
    noSelectionHint: "💡 Click any shape or text on the paper to move, rotate, resize, or recolor it.",
    btnForward: "⬆️ Forward",
    btnBackward: "⬇️ Back",
    btnClone: "📋 Clone",
    btnDelete: "🗑️ Delete",
    propTextLabel: "Text Content:",
    propPenLayerLabel: "Color Pen Layer",
    propHatchFill: "Hatched Fill",
    propOutlineOnly: "Outline Only",
    propRotateLabel: "Rotation Angle",
    propSizeLabel: "Element Size",
    customStep3Title: "3. Workshop Palette & Markers",
    customStep3Desc: "Choose pen inks and marker tip for your poster:",
    customPaletteLabel: "Color Palette:",
    btnPlotCustom: "Plot This Poster",
    btnSendToAlgos: "Filter with 14 Algos",
    viewModeGraphic: "🎨 Poster Art",
    viewModePlotter: "🖋️ Plotter Paths",
    btnWorkshopQueue: "Workshop Queue",
    btnSubmitPlotter: "Send to Workshop Plotter",
    btnSubmitPlotterLabel: "Send to Workshop Plotter",
    btnExportGcode: "⚡ OpenBuilds",
    modalSubmitTitle: "Send to Workshop Plotter",
    modalSubmitSub: "Submit your poster to the live drawing queue with calibrated machine coordinates.",
    lblParticipantName: "Your Name / الاسم:",
    lblParticipantSeat: "Table / Seat Number (Optional):",
    specHeader: "Standardized Machine Calibration",
    specPaper: "Paper Size:",
    specPens: "Pen Layers:",
    specTime: "Est. Draw Time:",
    specLifts: "Pen Lifts:",
    specCalibrated: "1:1 Physical Scale · Bottom-Left Origin · OpenBuilds Calibrated",
    successTitle: "Poster Sent to the Workshop Plotter!",
    successGreeting: "Thank you,",
    successDesc: "Your poster has been added to the drawing queue. The instructor will call your name when your paper is placed on the machine!",
    successA5Hint: "Relax and enjoy the workshop — your poster will be drawn with real physical ink on A5 paper!",
    paperLocked: "Workshop Fixed",
    btnDone: "Done / Back to Studio",
    btnHeaderCalib: "Calibration",
    modalOperatorTitle: "Workshop Operator & Machine Setup",
    modalOperatorSub: "Zero-recalibration OpenBuilds workflow: calibrate your corner jig once, then just swap pens and paper!",
    opTabQueue: "Live Queue",
    opTabCalibration: "Machine Jig Calibration",
    opTabShare: "Wi-Fi & QR Share",
    btnFeedback: "Thoughts & Q&A",
    modalFeedbackTitle: "Thoughts & Questions",
    modalFeedbackSub: "Ask Njood a question or share your impressions of the plotter workshop!",
    lblFeedbackName: "Your Name / الاسم (Optional):",
    lblFeedbackType: "What would you like to share? / ماذا تود أن تشارك؟",
    typeThoughts: "💭 Workshop Thoughts",
    typeQuestion: "❓ Question for Njood",
    lblFeedbackMessage: "Your Message / رسالتك:",
    btnSubmitFeedback: "Send Message / إرسال",
    feedbackSuccessTitle: "Message Received! 💌",
    feedbackSuccessDesc: "Thank you for sharing your thoughts with Njood! Feel free to tag your poster prints on Instagram:",
    feedbackCta: "Have questions for Njood or thoughts to share about the workshop?",
    btnShareThoughts: "Share Thoughts / Ask Question",
    igFollowSub: "Tag your plotted posters & stay in touch!",
    opTabFeedback: "Thoughts & Q&A",
    feedbackEmptyTitle: "No Messages Yet",
    feedbackEmptySub: "Participant questions and thoughts submitted during the workshop will appear here live.",
    queueEmptyTitle: "No Posters in Queue Yet",
    queueEmptySub: "Participants can click 'Send to Workshop Plotter' on their devices to submit their designs.",
    roygvStationTitle: "🎨 3-Tone Marker Palette (ROYGV)",
    roygvStationSub: "Image converted into 3 tones (Black, Grey, White). Pick a marker for each:",
    tone1Badge: "Tone 1: Shadows (Black)",
    tone1Desc: "Deepest darks & poster mass",
    tone2Badge: "Tone 2: Midtones (Grey)",
    tone2Desc: "Medium shading & textures",
    tone3Badge: "Tone 3: Highlights (White)",
    tone3Desc: "Light accents & fine details",
    roygvCustomTitle: "🎨 3 Workshop Pen Markers (ROYGV)",
    roygvCustomSub: "Pick physical marker colors for Pen 1, Pen 2, and Pen 3:",
    customPen1Badge: "Pen 1 (Primary)",
    customPen2Badge: "Pen 2 (Accent)",
    customPen3Badge: "Pen 3 (Highlight)",
    elemRoygvTitle: "🎨 Marker Color for Element"
  },
  ar: {
    appTitle: "استوديو رسم الملصقات بالبلوتر",
    appSub: "تحويل ملصقات التصميم إلى لوحات خوارزمية مرسومة بالقلم الآلي",
    langBtn: "English",
    step1Title: "١. اختر أو ارفع ملصقك",
    step1Desc: "ارفع تصميمك أو اختر أحد الملصقات الجاهزة للبدء فوراً:",
    dropTitle: "اسحب ملصقك وأفلته هنا",
    dropSub: "أو انقر لاختيار صورة (JPG, PNG, WebP)",
    sampleSwiss: "تايبوغرافي سويسري",
    sampleSculpture: "تمثال كلاسيكي",
    sampleBotanical: "ورقة نباتية ريزو",
    sampleCyber: "ملصق موسيقي معاصر",
    sampleBrutalist: "عمارة بروتاليزم",
    step2Title: "٢. اختر الخوارزمية الجمالية",
    step2Desc: "اختر أسلوباً خوارزمياً مستوحى من أحدث اتجاهات الفن الرقمي والملصقات:",
    step3Title: "٣. الطابع العام والتخصيص",
    step3Desc: "اختر طابعاً سريعاً واضبط ٣ منزلقات بديهية، أو افتح خيارات البلوتر المتقدمة:",
    colorModeTitle: "ألوان الأقلام (ورشة العمل: ١-٣ كحد أقصى)",
    pen1Mode: "قلم واحد",
    pen1Sub: "الأسرع · بدون تبديل",
    pen2Mode: "قلمان",
    pen2Sub: "طبقتان · تبديل واحد",
    pen3Mode: "٣ أقلام",
    pen3Sub: "٣ طبقات · تبديلان",
    vibeFast: "⚡ رسم سريع (~٤ د)",
    vibePoster: "🎯 ملصق معاصر (~٨ د)",
    vibeWatercolor: "🖌️ ماركر عريض (~٤ د)",
    vibeDuotone: "🎨 كتل ثنائية اللون (~٩ د)",
    vibeTritone: "🌈 ريزوغراف ثلاثي (~١٤ د)",
    nibModeTitle: "🖌️ سن ونوع قلم الماركر",
    nibFine: "قلم رفيع",
    nibChunky: "ماركر مائي عريض",
    nibBroad: "بوسكا ضخم",
    sliderDensity: "كثافة التفاصيل",
    sliderDensityHint: "خطوط أقل وسريعة ↔ تفاصيل فنية دقيقة",
    sliderStyle: "طبيعة وشكل الخط",
    sliderStyleHint: "خطوط انسيابية هادئة ↔ موجات حركية بارزة",
    sliderDepth: "عمق الظلال",
    sliderDepthHint: "تظليل خفيف ناعم ↔ تباين وظلال عميقة",
    advancedHeader: "⚙️ إعدادات البلوتر المتقدمة",
    paperSizeLabel: "حجم الورق:",
    orientationTitle: "اتجاه تصميم الملصق",
    oriLandscape: "أفقي (Landscape)",
    oriPortrait: "عمودي / رأسي (Portrait)",
    oriLandscapeSub: "٢٠.٣ × ١٥.٢ سم (٨×٦ بوصة)",
    oriPortraitSub: "١٥.٢ × ٢٠.٣ سم (٦×٨ بوصة)",
    paperStockLabel: "نوع ولون الورق:",
    penColorLabel: "لوحة ألوان القلم:",
    marginLabel: "الهامش الآمن (مم):",
    invertLabel: "عكس الألوان (حبر أبيض على ورق داكن)",
    dualPenLabel: "فصل الرسم إلى طبقتين لقلمين (طبقة ١ + طبقة ٢)",
    shuffleSeed: "🎲 تغيير البذرة العشوائية",
    statTime: "الوقت التقديري للرسم",
    statLifts: "مرات رفع القلم",
    statDist: "طول الخطوط الكلي",
    statSafe: "آمن للبلوتر والورق",
    btnSimulate: "▶️ محاكاة الرسم بالقلم الآلي",
    btnPause: "⏸️ إيقاف مؤقت",
    btnResetSim: "⏮️ إعادة",
    btnExportSvg: "📥 تحميل ملف البلوتر (SVG)",
    btnExportPng: "🖼️ حفظ كصورة (PNG)",
    zoomFit: "ملاءمة الشاشة",
    zoomIn: "+",
    zoomOut: "-",
    simStatusDrawing: "جاري محاكاة القلم الآلي...",
    simStatusDone: "اكتملت المحاكاة!",
    badgeSafe: "متوافق مع ماكينات البلوتر",
    singleLineBadge: "بدون رفع القلم إطلاقاً!",
    tabTransform: "تحويل ملصق جاهز",
    tabCustom: "صمم ملصقك الخاص",
    tabCustomBadge: "لوحة تفاعلية",
    customStep1Title: "١. أضف الأشكال والنصوص",
    customStep1Desc: "انقر لإضافة أي شكل هندسي أو نص إلى لوحة الملصق:",
    shapeCircle: "دائرة",
    shapeArch: "بوابة",
    shapeRect: "كتلة",
    shapeTriangle: "مثلث",
    shapeSquiggle: "تموج",
    shapePill: "كبسولة",
    shapeHalfMoon: "هلال",
    shapeSunburst: "شمس مشعة",
    btnAddText: "أضف نصاً / تايبوغرافي",
    btnStarterTemplate: "✨ تصميم أولي جاهز",
    btnClearCanvas: "🗑️ مسح اللوحة",
    customStep2Title: "٢. التحريك، التدوير والخصائص",
    customStep2Desc: "اسحب وحرك العناصر على الشاشة أو استخدم لوحة التحكم بالأسفل:",
    noSelectionHint: "💡 انقر على أي شكل أو نص في اللوحة لتحريكه، تدويره، تغيير حجمه أو لونه.",
    btnForward: "⬆️ للأمام",
    btnBackward: "⬇️ للخلف",
    btnClone: "📋 تكرار",
    btnDelete: "🗑️ حذف",
    propTextLabel: "محتوى النص:",
    propPenLayerLabel: "طبقة لون القلم",
    propHatchFill: "تعبئة مخططة",
    propOutlineOnly: "حدود خارجية فقط",
    propRotateLabel: "زاوية التدوير",
    propSizeLabel: "حجم العنصر",
    customStep3Title: "٣. لوحة الألوان وسن القلم",
    customStep3Desc: "اختر التناغم اللوني وسن قلم الماركر:",
    customPaletteLabel: "تناغم الألوان:",
    btnPlotCustom: "رسم هذا الملصق بالبلوتر",
    btnSendToAlgos: "معالجة بالخوارزميات الـ ١٤",
    viewModeGraphic: "🎨 لوحة فنية ملونة",
    viewModePlotter: "🖋️ مسارات البلوتر",
    btnWorkshopQueue: "قائمة الورشة",
    btnSubmitPlotter: "إرسال للراسمة",
    btnSubmitPlotterLabel: "إرسال للراسمة",
    btnExportGcode: "⚡ أوبن بيلدز",
    modalSubmitTitle: "إرسال الملصق لقائمة الراسمة",
    modalSubmitSub: "إرسال تصميمك مباشرة لقائمة الرسم المباشرة بإحداثيات ومعايرة موحدة.",
    lblParticipantName: "اسمك / الاسم:",
    lblParticipantSeat: "رقم الطاولة أو المقعد (اختياري):",
    specHeader: "المعايرة القياسية الموحدة للآلة",
    specPaper: "حجم الورق:",
    specPens: "أقلام التلوين:",
    specTime: "الوقت التقديري:",
    specLifts: "رفعات القلم:",
    specCalibrated: "مقياس حقيقي 1:1 · نقطة الصفر أسفل-يسار · متوافق مع OpenBuilds",
    btnConfirmSubmit: "إرسال الملصق للراسمة",
    successTitle: "تم إرسال الملصق إلى الراسمة بنجاح!",
    successGreeting: "شكراً لك،",
    successDesc: "تمت إضافة ملصقك إلى قائمة الرسم. سيقوم المدرب بمناداة اسمك عند وضع ورقة A5 على الراسمة!",
    successA5Hint: "استمتع بورشة العمل — سيتم رسم ملصقك بالحبر الحقيقي على ورق A5 قريباً!",
    paperLocked: "معيار الورشة المعتمد",
    btnDone: "تم / العودة للاستوديو",
    btnHeaderCalib: "المعايرة والاختبار",
    modalOperatorTitle: "إدارة الورشة ومعايرة الآلة والموجه",
    modalOperatorSub: "منهجية الرسم بدون إعادة معايرة: ثبّت موجه زاوية الورقة مرة واحدة، ثم بدّل الأقلام والورق فقط!",
    opTabQueue: "قائمة الطلبات المباشرة",
    opTabCalibration: "معايرة موجه الورقة والآلة",
    opTabShare: "رابط المشاركين والباركود",
    btnFeedback: "أسئلة وملاحظات",
    modalFeedbackTitle: "شاركنا رأيك وسؤالك",
    modalFeedbackSub: "لديك سؤال لنجود أو ترغب في مشاركة انطباعك وتجربتك في ورشة الرسم الآلي؟",
    lblFeedbackName: "الاسم (اختياري):",
    lblFeedbackType: "ماذا تود أن تشارك؟",
    typeThoughts: "💭 انطباع ورأي عن الورشة",
    typeQuestion: "❓ سؤال لنجود",
    lblFeedbackMessage: "رسالتك أو سؤالك:",
    btnSubmitFeedback: "إرسال الرسالة",
    feedbackSuccessTitle: "وصلت رسالتك بنجاح! 💌",
    feedbackSuccessDesc: "شكراً لك على مشاركة رأيك مع نجود! لا تنسَ تصوير ومشاركة رسمتك ومتابعتنا على إنستغرام @madebynjood.",
    feedbackCta: "هل لديك سؤال لنجود أو ملاحظات تود مشاركتها حول الورشة؟",
    btnShareThoughts: "شاركنا رأيك أو اطرح سؤالك",
    igFollowSub: "شارك رسمتك وتابع كل جديد!",
    opTabFeedback: "الأسئلة والملاحظات",
    feedbackEmptyTitle: "لا توجد رسائل حتى الآن",
    feedbackEmptySub: "ستظهر هنا أسئلة المشاركين وانطباعاتهم مباشرة أثناء الورشة.",
    queueEmptyTitle: "لا توجد ملصقات في القائمة حتى الآن",
    queueEmptySub: "يمكن للمشاركين الضغط على 'إرسال للراسمة' من أجهزتهم لإرسال تصاميمهم هنا.",
    roygvStationTitle: "🎨 لوحة ألوان الماركر ثلاثية التدرج (ROYGV)",
    roygvStationSub: "يتم تحويل الصورة إلى ٣ تدرجات (أسود، رمادي، أبيض). اختر قلماً لكل تدرج:",
    tone1Badge: "التدرج ١: الظلال (أسود)",
    tone1Desc: "الظلال العميقة وكتلة التصميم",
    tone2Badge: "التدرج ٢: درجات رمادية متوسطة",
    tone2Desc: "التظليل والتفاصيل المتوسطة",
    tone3Badge: "التدرج ٣: اللمسات الفاتحة",
    tone3Desc: "اللمسات الفاتحة والتفاصيل الدقيقة",
    roygvCustomTitle: "🎨 ألوان أقلام الورشة (ROYGV)",
    roygvCustomSub: "اختر ألوان أقلام الماركر الفعلية للأقلام ١، ٢، و ٣:",
    customPen1Badge: "القلم ١ (الأساسي)",
    customPen2Badge: "القلم ٢ (الفرعي)",
    customPen3Badge: "القلم ٣ (المميز)",
    elemRoygvTitle: "🎨 لون الماركر للعنصر المحدد"
  }
};

class AppController {
  constructor() {
    this.lang = "en";
    this.currentAlgo = "watercolor_wash";
    this.currentSample = "swiss";
    this.currentPaper = "a5";
    this.currentPaperStock = "white";
    this.currentPenTheme = "customWorkshop";
    this.sourceImage = null;

    // Workshop ROYGV 3-Tone marker palettes
    this.workshopTones = {
      tone1: "black", // Tone 1: Shadows / Deep Black (#111827)
      tone2: "blue",  // Tone 2: Midtones / Grey (#0284c7)
      tone3: "red"    // Tone 3: Highlights / White (#e11d48)
    };
    this.customWorkshopTones = {
      pen1: "black",
      pen2: "blue",
      pen3: "red"
    };

    // Beginner-friendly settings & multi-color (1, 2, or 3 pens max for workshop)
    this.params = {
      density: 48,
      intensity: 50,
      depth: 50,
      marginMm: 12,
      invert: false,
      dualPen: true,
      numColors: 3,
      nib: "chunky",
      nibWidthMm: 2.8,
      nibScale: 3.5,
      seed: 42
    };

    // Zoom & Pan state
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };

    // Active Navigation Tab ("transform" or "custom")
    this.activeTab = "transform";
    this.customViewMode = "graphic"; // "graphic" | "plotter"
    this.customNibKey = "chunky";
    this.customNibScale = 3.5;
    this.customNibWidthMm = 2.8;
    this.customNumColors = 3;

    // Paper orientation: "portrait" (Vertical) vs "landscape" (Horizontal)
    this.paperOrientation = "portrait";

    const paper = this.getPaper();
    this.posterMaker = new window.PosterMaker(paper.width, paper.height, this.params.marginMm);
    this.posterMaker.loadStarterTemplate();

    // Generated vector paths (up to 3 layers)
    this.paths = { layer1: [], layer2: [], layer3: [] };
    this.metrics = null;

    // DOM Elements
    this.canvas = document.getElementById("plotterCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.viewport = document.getElementById("canvasViewport");

    // Simulator
    this.simulator = new window.PlotterSimulator(this.canvas, (progress, done) => {
      this.handleSimProgress(progress, done);
    });

    // Workshop & OpenBuilds Machine Profile
    this.workshopProfile = window.DEFAULT_MACHINE_PROFILE ? { ...window.DEFAULT_MACHINE_PROFILE } : {
      paperSize: "a5",
      paperOrientation: "portrait",
      marginMm: 12,
      origin: "bottom_left",
      jigOffsetX: 0,
      jigOffsetY: 0,
      actuation: "servo_pwm",
      penDownCmd: "M3 S500",
      penDownS: 500,
      penUpCmd: "M5 S0",
      feedrateDraw: 3000,
      feedrateTravel: 6000,
      dwellSeconds: 0.20,
      pauseBetweenPens: true,
      maxPensAllowed: 2,
      lockedForWorkshop: true
    };
    this.workshopJobs = [];
    this.isOperatorMode = false;
    this.activeJobData = null;

    this.init();
  }

  getPaper() {
    return window.getPlotterPaper
      ? window.getPlotterPaper(this.currentPaper, this.paperOrientation)
      : (window.PLOTTER_CONFIG?.paperSizes?.[this.currentPaper] || { width: 152, height: 203, name: "15.2 × 20.3 cm" });
  }

  setOrientation(ori = "portrait") {
    if (this.paperOrientation === ori) return;
    this.paperOrientation = ori;

    document.querySelectorAll(".btn-orientation-pill").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-orientation") === ori);
    });

    const opOriSelect = document.getElementById("opPaperOrientation");
    if (opOriSelect) opOriSelect.value = ori;

    const paper = this.getPaper();

    const badge = document.getElementById("badgeCurrentOrientation");
    if (badge) {
      badge.textContent = `${paper.width} × ${paper.height} mm (${ori === "landscape" ? "Horizontal" : "Vertical"})`;
    }

    const headerPill = document.querySelector(".header-a5-pill");
    if (headerPill) {
      headerPill.textContent = `📐 ${paper.width} × ${paper.height} mm (${ori === "landscape" ? "Horizontal" : "Vertical"})`;
    }

    if (this.posterMaker) {
      this.posterMaker.setPaperSize(paper.width, paper.height, this.params.marginMm);
      if (this.activeTab === "custom" && this.posterMaker.elements.length <= 5) {
        this.posterMaker.loadStarterTemplate();
      }
    }

    this.fitToScreen();

    if (this.activeTab === "custom") {
      this.ensureCustomPlotterPaths();
      this.renderCanvas();
    } else {
      this.generatePaths();
    }
  }

  getActivePenTheme() {
    if (this.activeTab === "custom" && this.posterMaker) {
      const p1 = window.getRoygvColor ? window.getRoygvColor(this.customWorkshopTones.pen1) : { hex: "#111827", name: "Black", nameAr: "أسود" };
      const p2 = window.getRoygvColor ? window.getRoygvColor(this.customWorkshopTones.pen2) : { hex: "#0284c7", name: "Blue", nameAr: "أزرق" };
      const p3 = window.getRoygvColor ? window.getRoygvColor(this.customWorkshopTones.pen3) : { hex: "#e11d48", name: "Red", nameAr: "أحمر" };
      const activeNib = (window.PLOTTER_CONFIG && window.PLOTTER_CONFIG.nibStyles && window.PLOTTER_CONFIG.nibStyles[this.customNibKey]) || { widthMm: 2.8, watercolor: true };

      return {
        id: "custom_workshop",
        name: `Custom (${p1.name} + ${p2.name} + ${p3.name})`,
        nameAr: `الملصق الخاص (${p1.nameAr} + ${p2.nameAr} + ${p3.nameAr})`,
        color1: p1.hex,
        color2: p2.hex,
        color3: p3.hex,
        widthMm: this.customNibWidthMm || 2.8,
        colors: this.customNumColors || 3,
        watercolor: activeNib.watercolor !== false,
        opacity: 0.85,
        darkPaper: false
      };
    } else {
      const p1 = window.getRoygvColor ? window.getRoygvColor(this.workshopTones.tone1) : { hex: "#111827", name: "Black", nameAr: "أسود" };
      const p2 = window.getRoygvColor ? window.getRoygvColor(this.workshopTones.tone2) : { hex: "#0284c7", name: "Blue", nameAr: "أزرق" };
      const p3 = window.getRoygvColor ? window.getRoygvColor(this.workshopTones.tone3) : { hex: "#e11d48", name: "Red", nameAr: "أحمر" };
      const activeNib = (window.PLOTTER_CONFIG && window.PLOTTER_CONFIG.nibStyles && window.PLOTTER_CONFIG.nibStyles[this.params.nib]) || { widthMm: 2.8, watercolor: true };

      return {
        id: "workshop_roygv",
        name: `Workshop ROYGV (${p1.name} + ${p2.name} + ${p3.name})`,
        nameAr: `ألوان الورشة (${p1.nameAr} + ${p2.nameAr} + ${p3.nameAr})`,
        color1: p1.hex,
        color2: p2.hex,
        color3: p3.hex,
        widthMm: this.params.nibWidthMm || activeNib.widthMm || 2.8,
        colors: this.params.numColors || 3,
        watercolor: activeNib.watercolor !== false,
        opacity: activeNib.watercolor ? 0.82 : 0.95,
        darkPaper: false
      };
    }
  }

  populateRoygvSwatches() {
    if (!window.ROYGV_COLORS) return;

    // 1. Transform Poster 3-Tone Channels
    const tones = [
      { num: 1, gridId: "roygvGridTone1", nameId: "tone1ColorName", stateKey: "tone1" },
      { num: 2, gridId: "roygvGridTone2", nameId: "tone2ColorName", stateKey: "tone2" },
      { num: 3, gridId: "roygvGridTone3", nameId: "tone3ColorName", stateKey: "tone3" }
    ];

    tones.forEach(t => {
      const grid = document.getElementById(t.gridId);
      if (!grid) return;
      grid.innerHTML = "";
      window.ROYGV_COLORS.forEach(c => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `roygv-swatch-chip ${this.workshopTones[t.stateKey] === c.id ? "active" : ""}`;
        chip.setAttribute("data-tone", t.num);
        chip.setAttribute("data-color", c.id);
        chip.setAttribute("title", this.lang === "ar" ? c.nameAr : c.name);

        chip.innerHTML = `
          <span class="roygv-color-circle" style="background:${c.hex};"></span>
          <span class="roygv-chip-label">${this.lang === "ar" ? c.nameAr : c.name}</span>
        `;

        chip.addEventListener("click", (e) => {
          e.preventDefault();
          this.setToneColor(t.num, c.id);
        });

        grid.appendChild(chip);
      });

      const nameEl = document.getElementById(t.nameId);
      if (nameEl) {
        const cur = window.getRoygvColor(this.workshopTones[t.stateKey]);
        nameEl.textContent = this.lang === "ar" ? cur.nameAr : cur.name;
      }
    });

    // 2. Custom Poster 3 Workshop Pens
    const customPens = [
      { num: 1, gridId: "customRoygvGridPen1", nameId: "customPen1ColorName", stateKey: "pen1" },
      { num: 2, gridId: "customRoygvGridPen2", nameId: "customPen2ColorName", stateKey: "pen2" },
      { num: 3, gridId: "customRoygvGridPen3", nameId: "customPen3ColorName", stateKey: "pen3" }
    ];

    customPens.forEach(p => {
      const grid = document.getElementById(p.gridId);
      if (!grid) return;
      grid.innerHTML = "";
      window.ROYGV_COLORS.forEach(c => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `roygv-swatch-chip ${this.customWorkshopTones[p.stateKey] === c.id ? "active" : ""}`;
        chip.setAttribute("data-custom-pen", p.num);
        chip.setAttribute("data-color", c.id);
        chip.setAttribute("title", this.lang === "ar" ? c.nameAr : c.name);

        chip.innerHTML = `
          <span class="roygv-color-circle" style="background:${c.hex};"></span>
          <span class="roygv-chip-label">${this.lang === "ar" ? c.nameAr : c.name}</span>
        `;

        chip.addEventListener("click", (e) => {
          e.preventDefault();
          this.setCustomPenColor(p.num, c.id);
        });

        grid.appendChild(chip);
      });

      const nameEl = document.getElementById(p.nameId);
      if (nameEl) {
        const cur = window.getRoygvColor(this.customWorkshopTones[p.stateKey]);
        nameEl.textContent = this.lang === "ar" ? cur.nameAr : cur.name;
      }
    });

    // 3. Direct Element Color Swatches in Custom Poster
    const elemGrid = document.getElementById("elemRoygvSwatches");
    if (elemGrid) {
      elemGrid.innerHTML = "";
      window.ROYGV_COLORS.forEach(c => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "elem-roygv-chip";
        chip.setAttribute("data-color", c.id);
        chip.setAttribute("title", this.lang === "ar" ? c.nameAr : c.name);
        chip.style.backgroundColor = c.hex;

        chip.addEventListener("click", (e) => {
          e.preventDefault();
          this.setSelectedElementColor(c.id);
        });

        elemGrid.appendChild(chip);
      });
    }

    this.updateCustomPenPreviewPills();
  }

  setToneColor(toneNum, colorId) {
    this.workshopTones[`tone${toneNum}`] = colorId;
    const colorObj = window.getRoygvColor(colorId);

    const grid = document.getElementById(`roygvGridTone${toneNum}`);
    if (grid) {
      grid.querySelectorAll(".roygv-swatch-chip").forEach(ch => {
        ch.classList.toggle("active", ch.getAttribute("data-color") === colorId);
      });
    }

    const nameEl = document.getElementById(`tone${toneNum}ColorName`);
    if (nameEl) {
      nameEl.textContent = this.lang === "ar" ? colorObj.nameAr : colorObj.name;
    }

    if (window.PLOTTER_CONFIG && window.PLOTTER_CONFIG.penThemes) {
      window.PLOTTER_CONFIG.penThemes.customWorkshop = this.getActivePenTheme();
      this.currentPenTheme = "customWorkshop";
    }

    this.updateLayerLegend();
    this.renderCanvas();
  }

  setCustomPenColor(penNum, colorId) {
    this.customWorkshopTones[`pen${penNum}`] = colorId;
    const colorObj = window.getRoygvColor(colorId);

    const grid = document.getElementById(`customRoygvGridPen${penNum}`);
    if (grid) {
      grid.querySelectorAll(".roygv-swatch-chip").forEach(ch => {
        ch.classList.toggle("active", ch.getAttribute("data-color") === colorId);
      });
    }

    const nameEl = document.getElementById(`customPen${penNum}ColorName`);
    if (nameEl) {
      nameEl.textContent = this.lang === "ar" ? colorObj.nameAr : colorObj.name;
    }

    if (this.posterMaker) {
      const p1 = window.getRoygvColor(this.customWorkshopTones.pen1).hex;
      const p2 = window.getRoygvColor(this.customWorkshopTones.pen2).hex;
      const p3 = window.getRoygvColor(this.customWorkshopTones.pen3).hex;
      this.posterMaker.setPaletteColors(p1, p2, p3);
    }

    this.updateCustomPenPreviewPills();
    if (this.customViewMode === "plotter") {
      this.ensureCustomPlotterPaths();
    }
    this.updateLayerLegend();
    this.renderCanvas();
  }

  setSelectedElementColor(colorId) {
    if (!this.posterMaker) return;
    const selected = this.posterMaker.getSelected();
    if (!selected) return;

    this.posterMaker.setElementColor(selected.id, colorId);
    this.updateSelectionPropsUI(false);

    if (this.customViewMode === "plotter") {
      this.ensureCustomPlotterPaths();
    }
    this.renderCanvas();
  }

  updateToneCardsActiveState() {
    const count = this.params.numColors || 3;
    const c1 = document.getElementById("toneCard1");
    const c2 = document.getElementById("toneCard2");
    const c3 = document.getElementById("toneCard3");

    if (c1) {
      c1.classList.toggle("disabled", false);
      c1.classList.toggle("active", true);
    }
    if (c2) {
      c2.classList.toggle("disabled", count < 2);
      c2.classList.toggle("active", count >= 2);
    }
    if (c3) {
      c3.classList.toggle("disabled", count < 3);
      c3.classList.toggle("active", count >= 3);
    }

    const cp1 = document.querySelector('[data-custom-pen="1"]');
    const cp2 = document.querySelector('[data-custom-pen="2"]');
    const cp3 = document.querySelector('[data-custom-pen="3"]');
    const customCount = this.customNumColors || 3;
    if (cp1) {
      cp1.classList.toggle("disabled", false);
      cp1.classList.toggle("active", true);
    }
    if (cp2) {
      cp2.classList.toggle("disabled", customCount < 2);
      cp2.classList.toggle("active", customCount >= 2);
    }
    if (cp3) {
      cp3.classList.toggle("disabled", customCount < 3);
      cp3.classList.toggle("active", customCount >= 3);
    }
  }

  updateCustomPenPreviewPills() {
    const p1 = window.getRoygvColor ? window.getRoygvColor(this.customWorkshopTones.pen1) : { hex: "#111827", name: "Black", nameAr: "أسود" };
    const p2 = window.getRoygvColor ? window.getRoygvColor(this.customWorkshopTones.pen2) : { hex: "#0284c7", name: "Blue", nameAr: "أزرق" };
    const p3 = window.getRoygvColor ? window.getRoygvColor(this.customWorkshopTones.pen3) : { hex: "#e11d48", name: "Red", nameAr: "أحمر" };

    const d1 = document.getElementById("dotPen1Preview");
    const d2 = document.getElementById("dotPen2Preview");
    const d3 = document.getElementById("dotPen3Preview");
    if (d1) d1.style.backgroundColor = p1.hex;
    if (d2) d2.style.backgroundColor = p2.hex;
    if (d3) d3.style.backgroundColor = p3.hex;

    const l1 = document.getElementById("lblPen1Preview");
    const l2 = document.getElementById("lblPen2Preview");
    const l3 = document.getElementById("lblPen3Preview");
    if (l1) l1.textContent = `${this.lang === "ar" ? "القلم ١" : "Pen 1"} (${this.lang === "ar" ? p1.nameAr : p1.name})`;
    if (l2) l2.textContent = `${this.lang === "ar" ? "القلم ٢" : "Pen 2"} (${this.lang === "ar" ? p2.nameAr : p2.name})`;
    if (l3) l3.textContent = `${this.lang === "ar" ? "القلم ٣" : "Pen 3"} (${this.lang === "ar" ? p3.nameAr : p3.name})`;
  }

  init() {
    this.populateRoygvSwatches();
    this.updateToneCardsActiveState();
    this.bindEvents();
    this.populateAlgorithmCards();
    this.loadSample(this.currentSample);
    this.initWorkshopSystem();
  }

  setLanguage(lang) {
    this.lang = lang;
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.body.setAttribute("lang", lang);

    // Update translated text in DOM
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (I18N[lang][key]) el.textContent = I18N[lang][key];
    });

    // Update Custom Poster badges
    const customNibBadge = document.getElementById("customNibBadge");
    if (customNibBadge) {
      const style = window.PLOTTER_CONFIG.nibStyles[this.customNibKey] || window.PLOTTER_CONFIG.nibStyles.chunky;
      customNibBadge.textContent = lang === "ar" ? style.nameAr : `${style.name} (${style.widthMm}mm)`;
    }
    this.updateSelectionPropsUI();

    // Update orientation badge
    const badgeOri = document.getElementById("badgeCurrentOrientation");
    const paperOri = this.getPaper();
    if (badgeOri) {
      const isLand = (this.paperOrientation === "landscape");
      badgeOri.textContent = lang === "ar"
        ? `${paperOri.width} × ${paperOri.height} مم (${isLand ? "أفقي" : "رأسي"})`
        : `${paperOri.width} × ${paperOri.height} mm (${isLand ? "Horizontal" : "Vertical"})`;
    }

    // Update Algorithm Cards descriptions
    this.populateAlgorithmCards();
    this.updateStatsDisplay();
  }

  bindEvents() {
    // Language Toggle
    const langBtn = document.getElementById("langToggleBtn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        this.setLanguage(this.lang === "en" ? "ar" : "en");
      });
    }

    // Global Paper Orientation Selector (Horizontal vs Vertical)
    document.querySelectorAll(".btn-orientation-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const ori = btn.getAttribute("data-orientation");
        this.setOrientation(ori);
      });
    });

    const opOri = document.getElementById("opPaperOrientation");
    if (opOri) {
      opOri.addEventListener("change", (e) => {
        this.setOrientation(e.target.value);
      });
    }

    // File Upload (Drag & Drop + Input)
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");

    if (dropZone && fileInput) {
      dropZone.addEventListener("click", () => fileInput.click());
      dropZone.addEventListener("dragover", e => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });
      dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
      dropZone.addEventListener("drop", e => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.loadFile(e.dataTransfer.files[0]);
        }
      });
      fileInput.addEventListener("change", e => {
        if (e.target.files && e.target.files[0]) {
          this.loadFile(e.target.files[0]);
        }
      });
    }

    // Sample Posters Click
    document.querySelectorAll(".sample-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".sample-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const sampleId = chip.getAttribute("data-sample");
        this.loadSample(sampleId);
      });
    });

    // Vibe Presets Click
    document.querySelectorAll(".vibe-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".vibe-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const vibe = pill.getAttribute("data-vibe");
        this.applyVibePreset(vibe);
      });
    });

    // Workshop Color Mode Click (1, 2, or 3 Pens)
    document.querySelectorAll(".color-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const count = parseInt(btn.getAttribute("data-colors"), 10);
        this.setColorMode(count);
      });
    });

    // Workshop Marker & Nib Tip Click (Fine vs Chunky vs Broad)
    document.querySelectorAll(".nib-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const nib = btn.getAttribute("data-nib");
        this.setNibStyle(nib);
      });
    });

    // Sliders
    this.bindSlider("sliderDensity", "density");
    this.bindSlider("sliderIntensity", "intensity");
    this.bindSlider("sliderDepth", "depth");

    // Advanced Controls Toggle
    const advToggle = document.getElementById("advancedToggle");
    const advPanel = document.getElementById("advancedPanel");
    if (advToggle && advPanel) {
      advToggle.addEventListener("click", () => {
        const isOpen = advPanel.classList.toggle("open");
        advToggle.classList.toggle("open", isOpen);
      });
    }

    // Paper Size Selector
    const paperSelect = document.getElementById("selectPaper");
    if (paperSelect) {
      paperSelect.addEventListener("change", e => {
        this.currentPaper = e.target.value;
        const paper = this.getPaper();
        if (this.posterMaker && paper) {
          this.posterMaker.setPaperSize(paper.width, paper.height, this.params.marginMm);
        }
        this.fitToScreen();
        this.generatePaths();
      });
    }

    // Paper Stock Selector
    const paperStockSelect = document.getElementById("selectPaperStock");
    if (paperStockSelect) {
      paperStockSelect.addEventListener("change", e => {
        this.currentPaperStock = e.target.value;
        this.renderCanvas();
      });
    }

    // Pen Palette Selector
    const penSelect = document.getElementById("selectPenTheme");
    if (penSelect) {
      penSelect.addEventListener("change", e => {
        this.currentPenTheme = e.target.value;
        this.renderCanvas();
      });
    }

    // Margin Slider
    const marginSlider = document.getElementById("sliderMargin");
    if (marginSlider) {
      marginSlider.addEventListener("input", e => {
        this.params.marginMm = parseFloat(e.target.value);
        document.getElementById("valMargin").textContent = `${this.params.marginMm} mm`;
        this.generatePaths();
      });
    }

    // Invert Checkbox
    const invertCheck = document.getElementById("checkInvert");
    if (invertCheck) {
      invertCheck.addEventListener("change", e => {
        this.params.invert = e.target.checked;
        this.generatePaths();
      });
    }

    // Dual Pen Checkbox
    const dualPenCheck = document.getElementById("checkDualPen");
    if (dualPenCheck) {
      dualPenCheck.addEventListener("change", e => {
        this.params.dualPen = e.target.checked;
        this.generatePaths();
      });
    }

    // Shuffle Seed
    const btnSeed = document.getElementById("btnShuffleSeed");
    if (btnSeed) {
      btnSeed.addEventListener("click", () => {
        this.params.seed = Math.floor(Math.random() * 1000000);
        this.generatePaths();
      });
    }

    // Simulator Toolbar
    const btnSimulate = document.getElementById("btnSimulate");
    const btnResetSim = document.getElementById("btnResetSim");
    const speedSlider = document.getElementById("simSpeedSlider");
    const scrubSlider = document.getElementById("simScrubSlider");

    if (btnSimulate) {
      btnSimulate.addEventListener("click", () => {
        if (this.simulator.isPlaying) {
          this.simulator.pause();
          btnSimulate.innerHTML = `<span>▶️</span> <span>${I18N[this.lang].btnSimulate}</span>`;
        } else {
          this.startSimulation();
          btnSimulate.innerHTML = `<span>⏸️</span> <span>${I18N[this.lang].btnPause}</span>`;
        }
      });
    }

    if (btnResetSim) {
      btnResetSim.addEventListener("click", () => {
        this.simulator.stop();
        if (scrubSlider) scrubSlider.value = 0;
        if (btnSimulate) btnSimulate.innerHTML = `<span>▶️</span> <span>${I18N[this.lang].btnSimulate}</span>`;
        this.renderCanvas();
      });
    }

    if (speedSlider) {
      speedSlider.addEventListener("input", e => {
        this.simulator.speed = parseFloat(e.target.value);
        document.getElementById("valSpeed").textContent = `${this.simulator.speed}x`;
      });
    }

    if (scrubSlider) {
      scrubSlider.addEventListener("input", e => {
        const ratio = parseFloat(e.target.value) / 100;
        this.simulator.seek(ratio);
        this.renderCanvas();
      });
    }

    // Export Buttons
    const btnSvg = document.getElementById("btnExportSvg");
    if (btnSvg) {
      btnSvg.addEventListener("click", () => this.downloadSVG());
    }

    const btnGcode = document.getElementById("btnExportGcode");
    if (btnGcode) {
      btnGcode.addEventListener("click", () => this.downloadGCode("normal"));
    }

    const btnGcodeWide = document.getElementById("btnExportGcodeWide");
    if (btnGcodeWide) {
      btnGcodeWide.addEventListener("click", () => this.downloadGCode("wide"));
    }

    const btnPng = document.getElementById("btnExportPng");
    if (btnPng) {
      btnPng.addEventListener("click", () => this.downloadPNG());
    }

    // Workshop Modal Buttons
    const btnOpenSubmit = document.getElementById("btnOpenSubmitModal");
    if (btnOpenSubmit) {
      btnOpenSubmit.addEventListener("click", () => this.openSubmitModal());
    }

    const btnOpenWorkshop = document.getElementById("btnOpenWorkshopModal");
    if (btnOpenWorkshop) {
      btnOpenWorkshop.addEventListener("click", () => this.openWorkshopModal());
    }

    // Viewport Pan & Zoom
    this.viewport.addEventListener("wheel", e => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom = Math.max(0.2, Math.min(6, this.zoom * zoomFactor));
      this.renderCanvas();
    });

    // Coordinate converter for canvas viewport to paper (mm)
    this.getPaperCoords = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const paper = this.getPaper();
      const paperPxW = paper.width * this.baseScale * this.zoom;
      const paperPxH = paper.height * this.baseScale * this.zoom;
      const paperX = (this.viewport.clientWidth - paperPxW) / 2 + this.panX;
      const paperY = (this.viewport.clientHeight - paperPxH) / 2 + this.panY;
      const mmToPx = this.baseScale * this.zoom;
      return {
        mmX: (mouseX - paperX) / mmToPx,
        mmY: (mouseY - paperY) / mmToPx,
        paperX,
        paperY,
        paperPxW,
        paperPxH,
        paperW: paper.width,
        paperH: paper.height
      };
    };

    // Canvas & Viewport Mouse Events (Direct-manipulation drag, rotate, resize, and pan)
    this.viewport.addEventListener("mousedown", e => {
      if (this.activeTab === "custom" && e.button === 0 && !e.shiftKey) {
        const coords = this.getPaperCoords(e);
        const hit = this.posterMaker.hitTest(coords.mmX, coords.mmY);
        if (hit) {
          this.posterMaker.startDrag(hit.handle === "body" ? "move" : hit.handle, hit.element, coords.mmX, coords.mmY);
          this.updateSelectionPropsUI();
          this.renderCanvas();
          return;
        } else if (coords.mmX >= 0 && coords.mmX <= coords.paperW && coords.mmY >= 0 && coords.mmY <= coords.paperH) {
          // Clicked empty sheet area -> deselect element
          this.posterMaker.deselect();
          this.updateSelectionPropsUI();
          this.renderCanvas();
          return;
        }
      }

      // Pan viewport when dragging background or middle-clicking
      if (e.button === 0 || e.button === 1) {
        this.isPanning = true;
        this.panStart = { x: e.clientX - this.panX, y: e.clientY - this.panY };
        this.viewport.style.cursor = "grabbing";
      }
    });

    window.addEventListener("mousemove", e => {
      if (this.activeTab === "custom" && this.posterMaker && this.posterMaker.isInteracting) {
        const coords = this.getPaperCoords(e);
        this.posterMaker.updateDrag(coords.mmX, coords.mmY);
        this.updateSelectionPropsUI(false);
        if (this.customViewMode === "plotter") {
          this.ensureCustomPlotterPaths();
        }
        this.renderCanvas();
        const type = this.posterMaker.interactionType;
        this.viewport.style.cursor = type === "rotate" ? "crosshair" : (type === "resize" ? "nwse-resize" : "grabbing");
        return;
      }

      if (this.isPanning) {
        this.panX = e.clientX - this.panStart.x;
        this.panY = e.clientY - this.panStart.y;
        this.renderCanvas();
        return;
      }

      // Dynamic cursor update for handles and element bodies
      if (this.activeTab === "custom" && this.customViewMode === "graphic" && this.posterMaker) {
        const coords = this.getPaperCoords(e);
        const hit = this.posterMaker.hitTest(coords.mmX, coords.mmY);
        if (hit) {
          if (hit.handle === "rotate") this.viewport.style.cursor = "crosshair";
          else if (hit.handle === "resize") this.viewport.style.cursor = "nwse-resize";
          else this.viewport.style.cursor = "move";
        } else if (coords.mmX >= 0 && coords.mmX <= coords.paperW && coords.mmY >= 0 && coords.mmY <= coords.paperH) {
          this.viewport.style.cursor = "default";
        } else {
          this.viewport.style.cursor = "grab";
        }
      }
    });

    window.addEventListener("mouseup", () => {
      if (this.activeTab === "custom" && this.posterMaker && this.posterMaker.isInteracting) {
        this.posterMaker.endDrag();
        this.updateSelectionPropsUI(true);
        if (this.customViewMode === "plotter") {
          this.ensureCustomPlotterPaths();
        }
        this.renderCanvas();
      }
      this.isPanning = false;
      this.viewport.style.cursor = "grab";
    });

    // Keyboard shortcuts for poster maker (Delete/Backspace to delete, Arrows to nudge)
    window.addEventListener("keydown", e => {
      if (this.activeTab !== "custom" || !this.posterMaker) return;
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea") return;

      const selected = this.posterMaker.getSelected();
      if (!selected) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        this.posterMaker.removeSelected();
        this.updateSelectionPropsUI();
        if (this.customViewMode === "plotter") this.ensureCustomPlotterPaths();
        this.renderCanvas();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selected.y -= e.shiftKey ? 5 : 1;
        this.renderCanvas();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        selected.y += e.shiftKey ? 5 : 1;
        this.renderCanvas();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        selected.x -= e.shiftKey ? 5 : 1;
        this.renderCanvas();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        selected.x += e.shiftKey ? 5 : 1;
        this.renderCanvas();
      }
    });

    // Zoom buttons
    document.getElementById("btnZoomFit")?.addEventListener("click", () => this.fitToScreen());
    document.getElementById("btnZoomIn")?.addEventListener("click", () => {
      this.zoom = Math.min(6, this.zoom * 1.25);
      this.renderCanvas();
    });
    document.getElementById("btnZoomOut")?.addEventListener("click", () => {
      this.zoom = Math.max(0.2, this.zoom * 0.8);
      this.renderCanvas();
    });

    window.addEventListener("resize", () => {
      this.fitToScreen();
      this.renderCanvas();
    });

    // Top-Level Navigation Tabs (Transform vs Make Your Own Poster)
    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        const tabId = tab.getAttribute("data-tab");
        this.switchTab(tabId);
      });
    });

    // View Mode Bar (Graphic Art vs Plotter Paths)
    document.querySelectorAll(".view-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".view-mode-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.customViewMode = btn.getAttribute("data-mode");
        if (this.customViewMode === "plotter") {
          this.ensureCustomPlotterPaths();
        }
        this.renderCanvas();
      });
    });

    // Step 1: Shape Adding Grid
    document.querySelectorAll(".btn-add-shape").forEach(btn => {
      btn.addEventListener("click", () => {
        const shapeType = btn.getAttribute("data-shape");
        this.posterMaker.addShape(shapeType);
        this.updateSelectionPropsUI();
        if (this.customViewMode === "plotter") {
          this.ensureCustomPlotterPaths();
        }
        this.renderCanvas();
      });
    });

    // Step 1: Add Text / Typography Button
    const btnAddText = document.getElementById("btnAddText");
    if (btnAddText) {
      btnAddText.addEventListener("click", () => {
        const defaultWord = this.lang === "ar" ? "تصميم" : "POSTER";
        this.posterMaker.addText(defaultWord);
        this.updateSelectionPropsUI();
        if (this.customViewMode === "plotter") {
          this.ensureCustomPlotterPaths();
        }
        this.renderCanvas();
        const input = document.getElementById("propTextInput");
        if (input) {
          input.focus();
          input.select();
        }
      });
    }

    // Step 1: Starter Template & Clear
    document.getElementById("btnStarterTemplate")?.addEventListener("click", () => {
      this.posterMaker.loadStarterTemplate();
      this.updateSelectionPropsUI();
      if (this.customViewMode === "plotter") {
        this.ensureCustomPlotterPaths();
      }
      this.renderCanvas();
    });

    document.getElementById("btnClearCanvas")?.addEventListener("click", () => {
      this.posterMaker.clear();
      this.updateSelectionPropsUI();
      if (this.customViewMode === "plotter") {
        this.ensureCustomPlotterPaths();
      }
      this.renderCanvas();
    });

    // Step 2: Selected Element Mini Tools (Arrange, Clone, Delete)
    document.getElementById("btnBringForward")?.addEventListener("click", () => {
      this.posterMaker.bringForward();
      if (this.customViewMode === "plotter") this.ensureCustomPlotterPaths();
      this.renderCanvas();
    });

    document.getElementById("btnSendBackward")?.addEventListener("click", () => {
      this.posterMaker.sendBackward();
      if (this.customViewMode === "plotter") this.ensureCustomPlotterPaths();
      this.renderCanvas();
    });

    document.getElementById("btnDuplicateElem")?.addEventListener("click", () => {
      this.posterMaker.duplicateSelected();
      this.updateSelectionPropsUI();
      if (this.customViewMode === "plotter") this.ensureCustomPlotterPaths();
      this.renderCanvas();
    });

    document.getElementById("btnDeleteElem")?.addEventListener("click", () => {
      this.posterMaker.removeSelected();
      this.updateSelectionPropsUI();
      if (this.customViewMode === "plotter") this.ensureCustomPlotterPaths();
      this.renderCanvas();
    });

    // Step 2: Text Content Input
    const propTextInput = document.getElementById("propTextInput");
    if (propTextInput) {
      propTextInput.addEventListener("input", e => {
        const selected = this.posterMaker.getSelected();
        if (selected && selected.type === "text") {
          selected.text = e.target.value;
          if (this.customViewMode === "plotter") {
            this.ensureCustomPlotterPaths();
          }
          this.renderCanvas();
        }
      });
    }

    // Step 2: Pen Layer Selection
    document.querySelectorAll(".prop-pen-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const penNum = parseInt(btn.getAttribute("data-pen"), 10);
        const selected = this.posterMaker.getSelected();
        if (selected) {
          selected.colorLayer = penNum;
          this.updateSelectionPropsUI(false);
          if (this.customViewMode === "plotter") {
            this.ensureCustomPlotterPaths();
          }
          this.renderCanvas();
        }
      });
    });

    // Step 2: Fill vs Outline
    document.querySelectorAll('input[name="elemFill"]').forEach(radio => {
      radio.addEventListener("change", e => {
        const selected = this.posterMaker.getSelected();
        if (selected) {
          selected.fill = (e.target.value === "fill");
          if (this.customViewMode === "plotter") {
            this.ensureCustomPlotterPaths();
          }
          this.renderCanvas();
        }
      });
    });

    // Step 2: Rotation Slider & Quick Chips
    const sliderAngle = document.getElementById("propSliderAngle");
    if (sliderAngle) {
      sliderAngle.addEventListener("input", e => {
        const deg = parseInt(e.target.value, 10);
        const selected = this.posterMaker.getSelected();
        if (selected) {
          selected.angle = deg;
          document.getElementById("valPropAngle").textContent = `${deg}°`;
          if (this.customViewMode === "plotter") {
            this.ensureCustomPlotterPaths();
          }
          this.renderCanvas();
        }
      });
    }

    document.querySelectorAll(".btn-angle-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const deg = parseInt(chip.getAttribute("data-angle"), 10);
        const selected = this.posterMaker.getSelected();
        if (selected) {
          selected.angle = deg;
          if (sliderAngle) sliderAngle.value = deg;
          document.getElementById("valPropAngle").textContent = `${deg}°`;
          if (this.customViewMode === "plotter") {
            this.ensureCustomPlotterPaths();
          }
          this.renderCanvas();
        }
      });
    });

    // Step 2: Size Slider
    const sliderSize = document.getElementById("propSliderSize");
    if (sliderSize) {
      sliderSize.addEventListener("input", e => {
        const val = parseFloat(e.target.value);
        const selected = this.posterMaker.getSelected();
        if (selected) {
          if (selected.type === "text") {
            selected.fontSize = val;
            selected.h = val * 1.35;
            document.getElementById("valPropSize").textContent = `${Math.round(val)}pt`;
          } else {
            const ratio = selected.h / (selected.w || 1);
            selected.w = val;
            selected.h = val * ratio;
            document.getElementById("valPropSize").textContent = `${Math.round(val)}mm`;
          }
          if (this.customViewMode === "plotter") {
            this.ensureCustomPlotterPaths();
          }
          this.renderCanvas();
        }
      });
    }

    // Step 3: Palette Selector
    const customPalSelect = document.getElementById("selectCustomPalette");
    if (customPalSelect) {
      customPalSelect.addEventListener("change", e => {
        this.posterMaker.setPalette(e.target.value);
        if (this.customViewMode === "plotter") {
          this.ensureCustomPlotterPaths();
        }
        this.renderCanvas();
      });
    }

    // Step 3: Nib Tip Buttons
    document.querySelectorAll(".custom-nib-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const nibKey = btn.getAttribute("data-nib");
        this.setCustomNibStyle(nibKey);
      });
    });

    // Step 4: Plot This Poster Button
    const btnPlotCustom = document.getElementById("btnPlotCustom");
    if (btnPlotCustom) {
      btnPlotCustom.addEventListener("click", () => {
        this.customViewMode = "plotter";
        document.querySelectorAll(".view-mode-btn").forEach(b => {
          b.classList.toggle("active", b.getAttribute("data-mode") === "plotter");
        });
        this.ensureCustomPlotterPaths();
        this.startSimulation();
      });
    }

    // Step 4: Filter with 14 Algorithms Button
    const btnSendToAlgos = document.getElementById("btnSendToAlgos");
    if (btnSendToAlgos) {
      btnSendToAlgos.addEventListener("click", () => {
        this.sendCustomPosterToAlgorithms();
      });
    }
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Toggle navigation tab active classes
    document.querySelectorAll(".nav-tab").forEach(t => {
      t.classList.toggle("active", t.getAttribute("data-tab") === tabId);
    });

    const panelTransform = document.getElementById("panelTransform");
    const panelCustomPoster = document.getElementById("panelCustomPoster");
    const viewModeBar = document.getElementById("viewModeBar");

    if (tabId === "custom") {
      if (panelTransform) panelTransform.style.display = "none";
      if (panelCustomPoster) panelCustomPoster.style.display = "flex";
      if (viewModeBar) viewModeBar.style.display = "flex";

      const paper = this.getPaper();
      this.posterMaker.widthMm = paper.width;
      this.posterMaker.heightMm = paper.height;
      this.posterMaker.marginMm = this.params.marginMm;

      if (this.customViewMode === "plotter") {
        this.ensureCustomPlotterPaths();
      }
      this.updateSelectionPropsUI();
      this.renderCanvas();
    } else {
      if (panelTransform) panelTransform.style.display = "flex";
      if (panelCustomPoster) panelCustomPoster.style.display = "none";
      if (viewModeBar) viewModeBar.style.display = "none";

      this.generatePaths();
    }
  }

  updateSelectionPropsUI(updateInputs = true) {
    const noHint = document.getElementById("noSelectionHint");
    const propsBox = document.getElementById("elementPropsBox");
    if (!noHint || !propsBox) return;

    const selected = this.posterMaker ? this.posterMaker.getSelected() : null;
    if (!selected) {
      noHint.style.display = "block";
      propsBox.style.display = "none";
      return;
    }

    noHint.style.display = "none";
    propsBox.style.display = "block";

    // Type badge
    const badge = document.getElementById("elemTypeBadge");
    if (badge) {
      const names = {
        circle: { en: "⭕ Circle", ar: "⭕ دائرة" },
        arch: { en: "🏛️ Arch", ar: "🏛️ بوابة" },
        rect: { en: "⬛ Block", ar: "⬛ كتلة" },
        triangle: { en: "🔺 Triangle", ar: "🔺 مثلث" },
        squiggle: { en: "〰️ Squiggle", ar: "〰️ تموج" },
        pill: { en: "💊 Capsule", ar: "💊 كبسولة" },
        halfMoon: { en: "🌙 Half Moon", ar: "🌙 هلال" },
        sunburst: { en: "☀️ Sunburst", ar: "☀️ شمس مشعة" },
        text: { en: "🔤 Typography", ar: "🔤 تايبوغرافي" }
      };
      const n = names[selected.type] || { en: selected.type, ar: selected.type };
      badge.textContent = this.lang === "ar" ? n.ar : n.en;
    }

    const groupText = document.getElementById("groupTextContent");
    const textInput = document.getElementById("propTextInput");
    const groupFill = document.getElementById("groupFillStyle");
    const sizeLabel = document.getElementById("propSizeLabel");
    const sizeVal = document.getElementById("valPropSize");
    const sizeSlider = document.getElementById("propSliderSize");

    if (selected.type === "text") {
      if (groupText) groupText.style.display = "block";
      if (textInput && updateInputs) textInput.value = selected.text || "";
      if (groupFill) groupFill.style.display = "none";

      if (sizeLabel) sizeLabel.textContent = this.lang === "ar" ? "حجم الخط" : "Font Size";
      const fSize = selected.fontSize || 18;
      if (sizeVal) sizeVal.textContent = `${Math.round(fSize)}pt`;
      if (sizeSlider) {
        sizeSlider.min = "8";
        sizeSlider.max = "48";
        if (updateInputs) sizeSlider.value = Math.round(fSize);
      }
    } else {
      if (groupText) groupText.style.display = "none";
      if (groupFill) groupFill.style.display = "flex";
      const fillRadio = document.getElementById("propFillHatch");
      const outlineRadio = document.getElementById("propFillOutline");
      if (fillRadio && outlineRadio) {
        fillRadio.checked = (selected.fill !== false);
        outlineRadio.checked = (selected.fill === false);
      }

      if (sizeLabel) sizeLabel.textContent = this.lang === "ar" ? "حجم العنصر" : "Element Size";
      const w = selected.w || 50;
      if (sizeVal) sizeVal.textContent = `${Math.round(w)}mm`;
      if (sizeSlider) {
        sizeSlider.min = "10";
        sizeSlider.max = "130";
        if (updateInputs) sizeSlider.value = Math.round(w);
      }
    }

    // Color Pen Layer
    document.querySelectorAll(".prop-pen-btn").forEach(btn => {
      const penNum = parseInt(btn.getAttribute("data-pen"), 10);
      btn.classList.toggle("active", (!selected.customColorId && (selected.colorLayer || 1) === penNum));
    });
    const penBadge = document.getElementById("propPenBadge");
    if (penBadge) {
      penBadge.textContent = `${this.lang === "ar" ? "القلم" : "Pen"} ${selected.colorLayer || 1}`;
    }

    // Direct ROYGV Marker Recolor Swatches
    const elemSwatches = document.getElementById("elemRoygvSwatches");
    const elemRoygvBadge = document.getElementById("elemRoygvBadge");
    if (elemSwatches) {
      elemSwatches.querySelectorAll(".elem-roygv-chip").forEach(ch => {
        const cId = ch.getAttribute("data-color");
        let isMatch = false;
        if (selected.customColorId) {
          isMatch = (selected.customColorId === cId);
        } else {
          const activePenId = (selected.colorLayer === 2) ? this.customWorkshopTones.pen2 :
                              (selected.colorLayer === 3 ? this.customWorkshopTones.pen3 : this.customWorkshopTones.pen1);
          isMatch = (activePenId === cId);
        }
        ch.classList.toggle("active", isMatch);
      });
    }
    if (elemRoygvBadge) {
      if (selected.customColorId) {
        const roygv = window.getRoygvColor ? window.getRoygvColor(selected.customColorId) : null;
        elemRoygvBadge.textContent = this.lang === "ar" ? roygv?.nameAr : roygv?.name;
      } else {
        const activePenId = (selected.colorLayer === 2) ? this.customWorkshopTones.pen2 :
                            (selected.colorLayer === 3 ? this.customWorkshopTones.pen3 : this.customWorkshopTones.pen1);
        const roygv = window.getRoygvColor ? window.getRoygvColor(activePenId) : null;
        elemRoygvBadge.textContent = this.lang === "ar" ? roygv?.nameAr : roygv?.name;
      }
    }

    // Rotation
    const sliderAngle = document.getElementById("propSliderAngle");
    const angleVal = document.getElementById("valPropAngle");
    const ang = selected.angle || 0;
    if (sliderAngle && updateInputs) sliderAngle.value = ang;
    if (angleVal) angleVal.textContent = `${ang}°`;
  }

  setCustomNibStyle(nibKey) {
    const style = window.PLOTTER_CONFIG.nibStyles[nibKey] || window.PLOTTER_CONFIG.nibStyles.chunky;
    this.customNibKey = nibKey;
    this.customNibWidthMm = style.widthMm;
    this.customNibScale = style.scale;

    document.querySelectorAll(".custom-nib-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-nib") === nibKey);
    });

    const badge = document.getElementById("customNibBadge");
    if (badge) {
      badge.textContent = this.lang === "ar" ? style.nameAr : `${style.name} (${style.widthMm}mm)`;
    }

    if (this.customViewMode === "plotter") {
      this.ensureCustomPlotterPaths();
    }
    this.renderCanvas();
  }

  ensureCustomPlotterPaths() {
    if (!this.posterMaker) return;
    this.paths = this.posterMaker.generateVectorPaths(
      this.customNibScale,
      this.customNumColors
    );
    this.metrics = window.calculatePlotMetrics(
      this.paths.layer1,
      this.paths.layer2,
      this.paths.layer3
    );
    this.updateStatsDisplay();
  }

  sendCustomPosterToAlgorithms() {
    const paper = this.getPaper();
    const off = document.createElement("canvas");
    off.width = 1024;
    off.height = Math.round(1024 * (paper.height / paper.width));
    this.posterMaker.renderGraphic(off, this.customNibKey === "chunky");

    const dataUrl = off.toDataURL("image/png");
    const img = new Image();
    img.onload = () => {
      this.sourceImage = img;
      this.updateThumbnail(dataUrl);
      this.switchTab("transform");
    };
    img.src = dataUrl;
  }

  bindSlider(elementId, paramKey) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.addEventListener("input", e => {
      this.params[paramKey] = parseFloat(e.target.value);
      this.generatePaths();
    });
  }

  populateAlgorithmCards() {
    const container = document.getElementById("algoGrid");
    if (!container) return;
    container.innerHTML = "";

    Object.keys(window.POSTER_ALGORITHMS).forEach(key => {
      const algo = window.POSTER_ALGORITHMS[key];
      const card = document.createElement("div");
      card.className = `algo-card ${key === this.currentAlgo ? "active" : ""}`;
      card.setAttribute("data-algo", key);

      const title = this.lang === "ar" ? algo.nameAr : algo.name;
      const desc = this.lang === "ar" ? algo.descAr : algo.desc;

      card.innerHTML = `
        <div class="algo-card-header">
          <span class="algo-icon">${algo.icon}</span>
          <span class="algo-badge">${algo.badge}</span>
        </div>
        <div class="algo-name">${title}</div>
        <div class="algo-desc">${desc}</div>
      `;

      card.addEventListener("click", () => {
        document.querySelectorAll(".algo-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        this.currentAlgo = key;

        // Auto-enable dual pen if supported and active
        const dualCheck = document.getElementById("checkDualPen");
        if (dualCheck) {
          dualCheck.disabled = !algo.dualPenAvailable;
          if (!algo.dualPenAvailable) dualCheck.checked = false;
        }

        this.generatePaths();
      });

      container.appendChild(card);
    });
  }

  setColorMode(numColors) {
    this.params.numColors = numColors;
    this.params.dualPen = (numColors >= 2);

    document.querySelectorAll(".color-mode-btn").forEach(b => {
      b.classList.toggle("active", parseInt(b.getAttribute("data-colors"), 10) === numColors);
    });

    const badge = document.getElementById("colorModeBadge");
    if (badge) {
      badge.textContent = numColors === 1 ? (this.lang === "ar" ? "قلم واحد" : "1 Pen") :
                          numColors === 2 ? (this.lang === "ar" ? "قلمان (طبقتان)" : "2 Pens") :
                          (this.lang === "ar" ? "٣ أقلام (كتل ثلاثية)" : "3 Pens");
    }

    this.updateToneCardsActiveState();

    if (window.PLOTTER_CONFIG && window.PLOTTER_CONFIG.penThemes) {
      window.PLOTTER_CONFIG.penThemes.customWorkshop = this.getActivePenTheme();
      this.currentPenTheme = "customWorkshop";
    }

    const dualCheck = document.getElementById("checkDualPen");
    if (dualCheck) dualCheck.checked = this.params.dualPen;

    this.generatePaths();
  }

  setNibStyle(nibKey) {
    const style = window.PLOTTER_CONFIG.nibStyles[nibKey] || window.PLOTTER_CONFIG.nibStyles.chunky;
    this.params.nib = nibKey;
    this.params.nibWidthMm = style.widthMm;
    this.params.nibScale = style.scale;

    document.querySelectorAll(".nib-mode-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-nib") === nibKey);
    });

    const badge = document.getElementById("nibModeBadge");
    if (badge) {
      badge.textContent = this.lang === "ar" ? style.nameAr : `${style.name} (${style.widthMm}mm)`;
    }

    if (window.PLOTTER_CONFIG && window.PLOTTER_CONFIG.penThemes) {
      window.PLOTTER_CONFIG.penThemes.customWorkshop = this.getActivePenTheme();
      this.currentPenTheme = "customWorkshop";
    }

    this.generatePaths();
  }

  applyVibePreset(vibe) {
    if (vibe === "fast") {
      this.params.density = 28;
      this.params.intensity = 40;
      this.params.depth = 45;
      this.params.numColors = 1;
      this.params.dualPen = false;
    } else if (vibe === "poster") {
      this.params.density = 52;
      this.params.intensity = 55;
      this.params.depth = 55;
      this.params.numColors = 2;
      this.params.dualPen = true;
    } else if (vibe === "watercolor") {
      this.params.density = 45;
      this.params.intensity = 55;
      this.params.depth = 50;
      this.params.numColors = 3;
      this.params.dualPen = true;
      this.params.nib = "chunky";
      this.params.nibWidthMm = 2.8;
      this.params.nibScale = 3.5;
      this.currentAlgo = "watercolor_wash";
    } else if (vibe === "duotone") {
      this.params.density = 55;
      this.params.intensity = 50;
      this.params.depth = 55;
      this.params.numColors = 2;
      this.params.dualPen = true;
    } else if (vibe === "tritone") {
      this.params.density = 52;
      this.params.intensity = 52;
      this.params.depth = 55;
      this.params.numColors = 3;
      this.params.dualPen = true;
    }

    this.updateToneCardsActiveState();

    if (window.PLOTTER_CONFIG && window.PLOTTER_CONFIG.penThemes) {
      window.PLOTTER_CONFIG.penThemes.customWorkshop = this.getActivePenTheme();
      this.currentPenTheme = "customWorkshop";
    }

    // Sync UI elements
    const penSelect = document.getElementById("selectPenTheme");
    if (penSelect) penSelect.value = this.currentPenTheme;

    document.querySelectorAll(".color-mode-btn").forEach(b => {
      b.classList.toggle("active", parseInt(b.getAttribute("data-colors"), 10) === this.params.numColors);
    });

    document.querySelectorAll(".nib-mode-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-nib") === this.params.nib);
    });
    const nibBadge = document.getElementById("nibModeBadge");
    if (nibBadge) {
      const style = window.PLOTTER_CONFIG.nibStyles[this.params.nib] || window.PLOTTER_CONFIG.nibStyles.chunky;
      nibBadge.textContent = this.lang === "ar" ? style.nameAr : `${style.name} (${style.widthMm}mm)`;
    }

    document.querySelectorAll(".algo-card").forEach(c => {
      c.classList.toggle("active", c.getAttribute("data-algo") === this.currentAlgo);
    });

    const badge = document.getElementById("colorModeBadge");
    if (badge) {
      badge.textContent = this.params.numColors === 1 ? (this.lang === "ar" ? "قلم واحد" : "1 Pen") :
                          this.params.numColors === 2 ? (this.lang === "ar" ? "قلمان (طبقتان)" : "2 Pens") :
                          (this.lang === "ar" ? "٣ أقلام (كتل ثلاثية)" : "3 Pens");
    }

    document.getElementById("sliderDensity").value = this.params.density;
    document.getElementById("sliderIntensity").value = this.params.intensity;
    document.getElementById("sliderDepth").value = this.params.depth;
    const dualCheck = document.getElementById("checkDualPen");
    if (dualCheck) dualCheck.checked = this.params.dualPen;

    this.generatePaths();
  }

  loadSample(sampleId) {
    this.currentSample = sampleId;
    const img = window.createSampleImage(sampleId);
    img.onload = () => {
      this.sourceImage = img;
      this.updateThumbnail(img.src);
      this.fitToScreen();
      this.generatePaths();
    };
  }

  loadFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        this.sourceImage = img;
        this.updateThumbnail(e.target.result);
        document.querySelectorAll(".sample-chip").forEach(c => c.classList.remove("active"));
        this.fitToScreen();
        this.generatePaths();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  updateThumbnail(src) {
    const thumb = document.getElementById("posterThumbnail");
    const thumbImg = document.getElementById("thumbImg");
    if (thumb && thumbImg) {
      thumbImg.src = src;
      thumb.style.display = "block";
    }
  }

  fitToScreen() {
    const paper = this.getPaper();
    const vW = this.viewport.clientWidth;
    const vH = this.viewport.clientHeight;

    // Convert paper mm to pixel representation on screen
    const pxPerMm = Math.min((vW * 0.75) / paper.width, (vH * 0.78) / paper.height);
    this.baseScale = pxPerMm;
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
  }

  generatePaths() {
    if (!this.sourceImage) return;

    const paper = this.getPaper();
    const algo = window.POSTER_ALGORITHMS[this.currentAlgo];

    // Build luminance matrix from current source image
    const grid = new PosterGrid(
      this.sourceImage,
      paper.width,
      paper.height,
      this.params.marginMm,
      1.0 + (this.params.depth - 50) * 0.02,
      (this.params.depth - 50) * 0.4,
      this.params.invert
    );

    // Run procedural algorithm
    const rawPaths = algo.generate(grid, this.params);

    // Algorithms return optimized layers with algorithm-tuned weld tolerances
    let optPaths = {
      layer1: rawPaths.layer1 || [],
      layer2: rawPaths.layer2 || [],
      layer3: rawPaths.layer3 || []
    };

    // A5 Workshop Speed Governor: Hard cap to <= 14-15 minutes at max settings
    if ((this.params.paperSize === "a5" || paper.width <= 160) && window.enforceA5SpeedLimit) {
      optPaths = window.enforceA5SpeedLimit(optPaths, 21000);
    }
    this.paths = optPaths;

    // Calculate metrics
    this.metrics = window.calculatePlotMetrics(this.paths.layer1, this.paths.layer2, this.paths.layer3);
    this.updateStatsDisplay();

    // Reset simulator if running
    this.simulator.stop();
    document.getElementById("simScrubSlider").value = 0;
    const btnSim = document.getElementById("btnSimulate");
    if (btnSim) btnSim.innerHTML = `<span>▶️</span> <span>${I18N[this.lang].btnSimulate}</span>`;

    this.renderCanvas();
  }

  updateStatsDisplay() {
    if (!this.metrics) return;
    const swapTxt = this.metrics.penSwaps > 0 ? ` (${this.metrics.penSwaps} ${this.lang === "ar" ? "تبديل" : "swaps"})` : "";
    document.getElementById("statTimeVal").textContent = `⏱️ ${this.metrics.timeFormatted}${swapTxt}`;
    const liftsElem = document.getElementById("statLiftsVal");
    if (liftsElem) {
      if (this.metrics.penLifts === 0) {
        liftsElem.textContent = `⚡ 0 ${this.lang === "ar" ? "رفعات (مسار واحد متصل!)" : "lifts (Continuous!)"}`;
      } else {
        liftsElem.textContent = `⚡ ${this.metrics.penLifts} ${this.lang === "ar" ? "رفعة" : "lifts"}`;
      }
      liftsElem.title = this.lang === "ar"
        ? "مسارات محسنة هندسياً لتقليل رفعات القلم عبر اللحام المكاني والتظليل المتصل"
        : "Continuous serpentine toolpaths and spatial-hash endpoint welding active";
    }
    document.getElementById("statDistVal").textContent = `📏 ${this.metrics.drawDistMeters}m`;
    this.updateLayerLegend();
  }

  updateLayerLegend() {
    const bar = document.getElementById("layerLegendBar");
    if (!bar) return;
    const penTheme = this.getActivePenTheme();
    const l1 = this.paths.layer1 && this.paths.layer1.length > 0;
    const l2 = this.paths.layer2 && this.paths.layer2.length > 0;
    const l3 = this.paths.layer3 && this.paths.layer3.length > 0;

    let html = "";
    if (l1) {
      html += `<div class="layer-chip"><span class="layer-dot" style="background:${penTheme?.color1 || '#111'}"></span><span>${this.lang === 'ar' ? 'القلم ١' : 'Pen 1'}: ${this.metrics.l1Meters}m</span></div>`;
    }
    if (l2) {
      html += `<div class="layer-chip"><span class="layer-dot" style="background:${penTheme?.color2 || '#ff3b5c'}"></span><span>${this.lang === 'ar' ? 'القلم ٢' : 'Pen 2'}: ${this.metrics.l2Meters}m</span></div>`;
    }
    if (l3) {
      html += `<div class="layer-chip"><span class="layer-dot" style="background:${penTheme?.color3 || '#0066cc'}"></span><span>${this.lang === 'ar' ? 'القلم ٣' : 'Pen 3'}: ${this.metrics.l3Meters}m</span></div>`;
    }
    bar.innerHTML = html;
  }

  renderCanvas() {
    const paper = this.getPaper();
    const paperStock = (window.PLOTTER_CONFIG?.paperThemes?.[this.currentPaperStock])
      || (window.PLOTTER_CONFIG?.paperThemes?.white)
      || { bg: "#fcfcfa", lineGuide: "rgba(0,0,0,0.06)", shadow: "0 20px 50px rgba(0,0,0,0.5)" };
    let penTheme = this.getActivePenTheme();

    const vW = this.viewport.clientWidth;
    const vH = this.viewport.clientHeight;

    this.canvas.width = vW;
    this.canvas.height = vH;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, vW, vH);

    // Compute paper on screen
    const paperPxW = paper.width * this.baseScale * this.zoom;
    const paperPxH = paper.height * this.baseScale * this.zoom;

    const paperX = (vW - paperPxW) / 2 + this.panX;
    const paperY = (vH - paperPxH) / 2 + this.panY;

    // Draw Paper Shadow & Sheet
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 35 * this.zoom;
    ctx.shadowOffsetY = 15 * this.zoom;
    ctx.fillStyle = (this.activeTab === "custom" && this.posterMaker)
      ? this.posterMaker.palette.bg
      : paperStock.bg;
    ctx.fillRect(paperX, paperY, paperPxW, paperPxH);
    ctx.restore();

    // If Custom Poster tab and in Graphic Poster Art view mode:
    if (this.activeTab === "custom" && this.customViewMode === "graphic") {
      if (this.posterMaker) {
        const offCanvas = document.createElement("canvas");
        offCanvas.width = Math.max(10, Math.round(paperPxW));
        offCanvas.height = Math.max(10, Math.round(paperPxH));
        this.posterMaker.renderGraphic(offCanvas, this.customNibKey === "chunky");
        ctx.drawImage(offCanvas, paperX, paperY, paperPxW, paperPxH);
      }
      return;
    }

    // Draw Safe Margin Boundary
    const marginPx = this.params.marginMm * this.baseScale * this.zoom;
    ctx.strokeStyle = paperStock.lineGuide;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(paperX + marginPx, paperY + marginPx, paperPxW - 2 * marginPx, paperPxH - 2 * marginPx);
    ctx.setLineDash([]);

    // Transform coordinate system: (0,0) in mm to paper canvas
    ctx.save();
    ctx.translate(paperX, paperY);
    const mmToPx = this.baseScale * this.zoom;
    const activeNib = this.activeTab === "custom"
      ? (window.PLOTTER_CONFIG.nibStyles[this.customNibKey] || window.PLOTTER_CONFIG.nibStyles.chunky)
      : (window.PLOTTER_CONFIG.nibStyles[this.params.nib] || window.PLOTTER_CONFIG.nibStyles.chunky);
    const nibWidthMm = this.activeTab === "custom" ? this.customNibWidthMm : (this.params.nibWidthMm || activeNib.widthMm);
    const isWatercolor = activeNib.watercolor || false;

    const strokeW = Math.max(0.8, nibWidthMm * mmToPx);

    // Helper to draw a polyline path with watercolor multiply blend
    const drawPolyline = (pts, color) => {
      if (pts.length < 2) return;
      ctx.save();
      if (isWatercolor) {
        ctx.globalAlpha = 0.78;
        ctx.globalCompositeOperation = "multiply";
      }
      ctx.beginPath();
      ctx.moveTo(pts[0][0] * mmToPx, pts[0][1] * mmToPx);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i][0] * mmToPx, pts[i][1] * mmToPx);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeW;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.restore();
    };

    // If Simulator is active, draw only up to current drawn points
    if (this.simulator.isPlaying || this.simulator.drawnPoints > 0) {
      const curHead = this.simulator.getCurrentHeadPosition();

      for (let pIdx = 0; pIdx < this.simulator.allPaths.length; pIdx++) {
        const item = this.simulator.allPaths[pIdx];
        const color = item.layer === 3 ? (penTheme.color3 || penTheme.color2) :
                      (item.layer === 2 ? penTheme.color2 : penTheme.color1);

        if (pIdx < this.simulator.currentPathIdx) {
          drawPolyline(item.pts, color);
        } else if (pIdx === this.simulator.currentPathIdx) {
          const partial = item.pts.slice(0, this.simulator.currentPtIdx + 1);
          drawPolyline(partial, color);
          break;
        }
      }

      // Draw Virtual Plotter Carriage & Air Jump Line
      if (curHead) {
        ctx.save();
        const headX = curHead.x * mmToPx;
        const headY = curHead.y * mmToPx;

        // Pen Reticle
        ctx.beginPath();
        ctx.arc(headX, headY, 6, 0, Math.PI * 2);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(headX, headY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(headX - 10, headY);
        ctx.lineTo(headX + 10, headY);
        ctx.moveTo(headX, headY - 10);
        ctx.lineTo(headX, headY + 10);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    } else {
      // Normal full render across all 3 layers
      (this.paths.layer1 || []).forEach(p => drawPolyline(p, penTheme.color1));
      (this.paths.layer2 || []).forEach(p => drawPolyline(p, penTheme.color2));
      (this.paths.layer3 || []).forEach(p => drawPolyline(p, penTheme.color3 || penTheme.color2));
    }

    ctx.restore();
  }

  startSimulation() {
    const paper = this.getPaper();
    const penTheme = this.getActivePenTheme();

    this.simulator.setup(
      this.paths.layer1,
      this.paths.layer2,
      this.paths.layer3,
      paper.width,
      paper.height,
      penTheme
    );
    this.simulator.play();
  }

  handleSimProgress(progress, done) {
    const scrubSlider = document.getElementById("simScrubSlider");
    if (scrubSlider) scrubSlider.value = Math.round(progress * 100);

    const btnSim = document.getElementById("btnSimulate");
    if (done && btnSim) {
      btnSim.innerHTML = `<span>▶️</span> <span>${I18N[this.lang].btnSimulate}</span>`;
    }
    this.renderCanvas();
  }

  downloadSVG() {
    const paper = this.getPaper();
    let penTheme = this.getActivePenTheme();
    let activeNib = (this.activeTab === "custom")
      ? (window.PLOTTER_CONFIG.nibStyles[this.customNibKey] || window.PLOTTER_CONFIG.nibStyles.chunky)
      : (window.PLOTTER_CONFIG.nibStyles[this.params.nib] || window.PLOTTER_CONFIG.nibStyles.chunky);
    let nibWidthMm = (this.activeTab === "custom") ? (this.customNibWidthMm || 2.8) : this.params.nibWidthMm;
    let isWatercolor = activeNib.watercolor || false;
    let filename = (this.activeTab === "custom")
      ? `plotter_custom_poster_${paper.name.toLowerCase().replace(/\s+/g, "_")}.svg`
      : `plotter_${this.currentAlgo}_${paper.name.toLowerCase().replace(/\s+/g, "_")}.svg`;

    if (this.activeTab === "custom") {
      this.ensureCustomPlotterPaths();
    }

    const svgContent = window.exportPlotterSVG(
      this.paths.layer1,
      this.paths.layer2,
      this.paths.layer3,
      paper.width,
      paper.height,
      penTheme,
      nibWidthMm,
      isWatercolor
    );

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  downloadPNG() {
    const paper = this.getPaper();
    const paperStock = (window.PLOTTER_CONFIG?.paperThemes?.[this.currentPaperStock])
      || (window.PLOTTER_CONFIG?.paperThemes?.white)
      || { bg: "#fcfcfa", lineGuide: "rgba(0,0,0,0.06)", shadow: "0 20px 50px rgba(0,0,0,0.5)" };
    let penTheme = this.getActivePenTheme();
    let activeNib = (this.activeTab === "custom")
      ? (window.PLOTTER_CONFIG.nibStyles[this.customNibKey] || window.PLOTTER_CONFIG.nibStyles.chunky)
      : (window.PLOTTER_CONFIG.nibStyles[this.params.nib] || window.PLOTTER_CONFIG.nibStyles.chunky);
    let nibWidthMm = (this.activeTab === "custom") ? (this.customNibWidthMm || 2.8) : (this.params.nibWidthMm || activeNib.widthMm);
    let isWatercolor = activeNib.watercolor || false;

    // High resolution render (300 DPI: ~11.8 pixels per mm)
    const dpm = 11.8;
    const outCanvas = document.createElement("canvas");
    outCanvas.width = Math.round(paper.width * dpm);
    outCanvas.height = Math.round(paper.height * dpm);

    if (this.activeTab === "custom" && this.customViewMode === "graphic") {
      this.posterMaker.renderGraphic(outCanvas, this.customNibKey === "chunky");
      const a = document.createElement("a");
      a.href = outCanvas.toDataURL("image/png");
      a.download = `custom_poster_art.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (this.activeTab === "custom") {
      this.ensureCustomPlotterPaths();
    }

    const ctx = outCanvas.getContext("2d");
    ctx.fillStyle = (this.activeTab === "custom" && this.posterMaker)
      ? this.posterMaker.palette.bg
      : paperStock.bg;
    ctx.fillRect(0, 0, outCanvas.width, outCanvas.height);

    const strokeW = Math.max(1.0, nibWidthMm * dpm);

    const renderPaths = (paths, color) => {
      if (!paths || paths.length === 0) return;
      ctx.save();
      if (isWatercolor) {
        ctx.globalAlpha = 0.78;
        ctx.globalCompositeOperation = "multiply";
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeW;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      paths.forEach(p => {
        if (p.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(p[0][0] * dpm, p[0][1] * dpm);
        for (let i = 1; i < p.length; i++) {
          ctx.lineTo(p[i][0] * dpm, p[i][1] * dpm);
        }
        ctx.stroke();
      });
      ctx.restore();
    };

    renderPaths(this.paths.layer1, penTheme.color1);
    renderPaths(this.paths.layer2, penTheme.color2);
    renderPaths(this.paths.layer3, penTheme.color3 || penTheme.color2);

    const a = document.createElement("a");
    a.href = outCanvas.toDataURL("image/png");
    a.download = this.activeTab === "custom"
      ? `plotter_custom_poster_paths.png`
      : `plotter_${this.currentAlgo}_preview.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ==============================================================================
  // WORKSHOP & OPENBUILDS ZERO-RECALIBRATION PIPELINE
  // ==============================================================================

  downloadTextFile(filename, text, mimeType = "text/plain;charset=utf-8") {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  downloadGCode(explicitMode = null) {
    if (this.activeTab === "custom" && this.posterMaker) {
      this.ensureCustomPlotterPaths();
    }
    const paper = this.getPaper();
    const penTheme = this.getActivePenTheme();
    const isCustom = this.activeTab === "custom";
    const p1 = window.getRoygvColor ? window.getRoygvColor(isCustom ? this.customWorkshopTones.pen1 : this.workshopTones.tone1) : { hex: "#111827", name: "Midnight Black" };
    const p2 = window.getRoygvColor ? window.getRoygvColor(isCustom ? this.customWorkshopTones.pen2 : this.workshopTones.tone2) : { hex: "#0284c7", name: "Cobalt Blue" };
    const p3 = window.getRoygvColor ? window.getRoygvColor(isCustom ? this.customWorkshopTones.pen3 : this.workshopTones.tone3) : { hex: "#e11d48", name: "Crimson Red" };
    const participantName = localStorage.getItem("plotter_participant_name") || "Maker";
    const safePerson = window.getSafePersonName ? window.getSafePersonName(participantName) : "Maker";

    const meta = {
      participantName: safePerson,
      jobId: "PLOT",
      pen1Name: p1.name,
      pen1Color: penTheme?.color1 || p1.hex,
      pen2Name: p2.name,
      pen2Color: penTheme?.color2 || p2.hex,
      pen3Name: p3.name,
      pen3Color: penTheme?.color3 || p3.hex,
      timeFormatted: this.metrics?.timeFormatted || "N/A"
    };

    const aspectMode = explicitMode || this.operatorAspectMode || this.workshopProfile?.aspectMode || "normal";
    const profileWithAspect = { ...this.workshopProfile, aspectMode };
    const prefix = aspectMode === "wide" ? "Wide_" : "";

    const splitFiles = window.generateSplitGCode
      ? window.generateSplitGCode(this.paths, paper, profileWithAspect, meta)
      : [];

    if (splitFiles.length > 0) {
      // Export each color as a separate file: color_personName.gcode (or Wide_color_personName.gcode)
      splitFiles.forEach(split => {
        const fn = `${prefix}${split.filename}`;
        this.downloadTextFile(fn, split.gcode, "text/plain");
      });
    } else {
      const gcode = window.generateOpenBuildsGCode
        ? window.generateOpenBuildsGCode(this.paths, paper, profileWithAspect, meta)
        : "; No paths";
      this.downloadTextFile(`${prefix}All_Colors_${safePerson}.gcode`, gcode, "text/plain");
    }
  }

  initWorkshopSystem() {
    // 1. Check URL parameters (?operator=true or ?participant=Name)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("operator") === "true" || urlParams.get("mode") === "operator" || localStorage.getItem("isOperator") === "true") {
      this.isOperatorMode = true;
      const btnOp = document.getElementById("btnOpenWorkshopModal");
      if (btnOp) btnOp.style.display = "inline-flex";
      const btnCalib = document.getElementById("btnHeaderCalibModal");
      if (btnCalib) btnCalib.style.display = "inline-flex";
      document.querySelectorAll(".operator-only").forEach(el => {
        el.style.display = el.tagName === "BUTTON" ? "inline-flex" : "flex";
      });
      setTimeout(() => this.openWorkshopModal(), 400);
    } else {
      this.isOperatorMode = false;
      const btnOp = document.getElementById("btnOpenWorkshopModal");
      if (btnOp) btnOp.style.display = "none";
      const btnCalib = document.getElementById("btnHeaderCalibModal");
      if (btnCalib) btnCalib.style.display = "none";
      document.querySelectorAll(".operator-only").forEach(el => el.style.display = "none");
    }
    if (urlParams.get("participant")) {
      localStorage.setItem("plotter_participant_name", urlParams.get("participant"));
    }

    // 2. Fetch server info & machine profile (if running with server)
    this.fetchWorkshopConfig();

    // 3. Modal close and tab buttons wiring
    const btnCloseSubmit = document.getElementById("btnCloseSubmitModal");
    if (btnCloseSubmit) btnCloseSubmit.addEventListener("click", () => this.closeSubmitModal());

    const btnDoneSubmit = document.getElementById("btnDoneSubmitModal");
    if (btnDoneSubmit) btnDoneSubmit.addEventListener("click", () => this.closeSubmitModal());

    const btnConfirmSubmit = document.getElementById("btnConfirmSubmit");
    if (btnConfirmSubmit) btnConfirmSubmit.addEventListener("click", () => this.submitCurrentPoster());

    const btnCloseOperator = document.getElementById("btnCloseWorkshopModal");
    if (btnCloseOperator) btnCloseOperator.addEventListener("click", () => this.closeWorkshopModal());

    // 4. Feedback & Q&A modal listeners
    const btnOpenFeedback = document.getElementById("btnOpenFeedbackModal");
    if (btnOpenFeedback) btnOpenFeedback.addEventListener("click", () => this.openFeedbackModal());

    const btnSuccessOpenFeedback = document.getElementById("btnSuccessOpenFeedback");
    if (btnSuccessOpenFeedback) btnSuccessOpenFeedback.addEventListener("click", () => this.openFeedbackModal());

    const btnCloseFeedback = document.getElementById("btnCloseFeedbackModal");
    if (btnCloseFeedback) btnCloseFeedback.addEventListener("click", () => this.closeFeedbackModal());

    const btnDoneFeedback = document.getElementById("btnDoneFeedbackModal");
    if (btnDoneFeedback) btnDoneFeedback.addEventListener("click", () => this.closeFeedbackModal());

    const btnSubmitFeedback = document.getElementById("btnSubmitFeedback");
    if (btnSubmitFeedback) btnSubmitFeedback.addEventListener("click", () => this.submitFeedback());

    const btnClearFeedback = document.getElementById("btnClearFeedback");
    if (btnClearFeedback) btnClearFeedback.addEventListener("click", () => this.clearFeedback());

    // Operator tabs
    const opTabs = document.querySelectorAll(".operator-tab-btn");
    opTabs.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-optab");
        this.switchOperatorTab(tab);
      });
    });

    // Save & lock configuration button
    const btnLock = document.getElementById("btnSaveAndLockConfig");
    if (btnLock) btnLock.addEventListener("click", () => this.saveAndLockWorkshopConfig());

    // Corner test G-code download & copy
    const btnCornerTest = document.getElementById("btnDownloadCornerTestGcode");
    if (btnCornerTest) btnCornerTest.addEventListener("click", () => this.downloadCornerTest());

    const btnCopyCorner = document.getElementById("btnCopyCornerTestGcode");
    if (btnCopyCorner) btnCopyCorner.addEventListener("click", () => this.copyCornerTest());

    // Pen Up / Pen Down test G-code download & copy
    const btnPenTest = document.getElementById("btnDownloadPenTestGcode");
    if (btnPenTest) btnPenTest.addEventListener("click", () => this.downloadPenUpDownTest());

    const btnCopyPen = document.getElementById("btnCopyPenTestGcode");
    if (btnCopyPen) btnCopyPen.addEventListener("click", () => this.copyPenUpDownTest());

    // Pressure Ladder test G-code download & copy
    const btnLadderTest = document.getElementById("btnDownloadLadderTestGcode");
    if (btnLadderTest) btnLadderTest.addEventListener("click", () => this.downloadLadderTest());

    const btnCopyLadder = document.getElementById("btnCopyLadderTestGcode");
    if (btnCopyLadder) btnCopyLadder.addEventListener("click", () => this.copyLadderTest());

    // Servo pressure controls wiring
    const opSlider = document.getElementById("opPenDownSlider");
    const opInput = document.getElementById("opPenDownS");
    const valBadge = document.getElementById("valPenDownS");

    const updatePressure = (sVal) => {
      const s = Math.max(150, Math.min(1000, Number(sVal) || 500));
      if (opSlider) opSlider.value = s;
      if (opInput) opInput.value = s;
      if (valBadge) {
        valBadge.textContent = `S${s} (${s <= 400 ? "Gentle" : s <= 600 ? "Balanced" : "Firm"})`;
      }
      this.workshopProfile.penDownS = s;
      this.workshopProfile.penDownCmd = `M3 S${s}`;
      document.querySelectorAll(".btn-pressure-preset").forEach(b => {
        b.classList.toggle("active", Number(b.getAttribute("data-s")) === s);
      });
    };

    if (opSlider) {
      opSlider.addEventListener("input", (e) => updatePressure(e.target.value));
    }
    if (opInput) {
      opInput.addEventListener("change", (e) => updatePressure(e.target.value));
    }
    document.querySelectorAll(".btn-pressure-preset").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const s = Number(btn.getAttribute("data-s"));
        updatePressure(s);
      });
    });

    // Operator Queue Format Toggle (Regular vs Squished/Compensated)
    this.operatorAspectMode = localStorage.getItem("plotter_operator_aspect_mode") || "normal";
    const updateQueueAspectUI = (mode) => {
      this.operatorAspectMode = mode;
      localStorage.setItem("plotter_operator_aspect_mode", mode);
      document.querySelectorAll(".btn-queue-aspect").forEach(b => {
        const isActive = b.getAttribute("data-aspect") === mode;
        b.classList.toggle("active", isActive);
        b.style.background = isActive ? "#0284c7" : "#334155";
        b.style.color = isActive ? "#ffffff" : "#94a3b8";
      });
      const opAspect = document.getElementById("opAspectMode");
      if (opAspect) opAspect.value = mode;
    };

    document.querySelectorAll(".btn-queue-aspect").forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-aspect") || "normal";
        updateQueueAspectUI(mode);
      });
    });

    const opAspectSelect = document.getElementById("opAspectMode");
    if (opAspectSelect) {
      opAspectSelect.addEventListener("change", (e) => {
        updateQueueAspectUI(e.target.value);
      });
    }
    updateQueueAspectUI(this.operatorAspectMode);

    // Top header calibration shortcut
    const btnHeaderCalib = document.getElementById("btnHeaderCalibModal");
    if (btnHeaderCalib) btnHeaderCalib.addEventListener("click", () => this.openWorkshopModal("calibration"));

    // Copy share URL button
    const btnCopyUrl = document.getElementById("btnCopyShareUrl");
    if (btnCopyUrl) btnCopyUrl.addEventListener("click", () => this.copyShareUrl());

    // Fullscreen QR button
    const btnFullQr = document.getElementById("btnFullscreenQr");
    if (btnFullQr) btnFullQr.addEventListener("click", () => this.toggleFullscreenQR());

    // Import participant file button
    const inputImport = document.getElementById("inputImportJobFile");
    if (inputImport) {
      inputImport.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleImportJobFile(e.target.files[0]);
        }
      });
    }

    // Clear completed queue button
    const btnClearQueue = document.getElementById("btnClearCompletedQueue");
    if (btnClearQueue) btnClearQueue.addEventListener("click", () => this.clearCompletedJobs());

    // NFC Tag Writer modal wiring
    const btnCloseNfc = document.getElementById("btnCloseNfcModal");
    if (btnCloseNfc) btnCloseNfc.addEventListener("click", () => this.closeNfcWriterModal());

    const btnNfcLocal = document.getElementById("btnNfcModeLocal");
    if (btnNfcLocal) {
      btnNfcLocal.addEventListener("click", () => {
        this.nfcTargetMode = "local";
        btnNfcLocal.classList.add("active");
        document.getElementById("btnNfcModeGithub")?.classList.remove("active");
        this.updateNfcModalView();
      });
    }

    const btnNfcGithub = document.getElementById("btnNfcModeGithub");
    if (btnNfcGithub) {
      btnNfcGithub.addEventListener("click", () => {
        this.nfcTargetMode = "github";
        btnNfcGithub.classList.add("active");
        document.getElementById("btnNfcModeLocal")?.classList.remove("active");
        this.updateNfcModalView();
      });
    }

    const btnCopyNfcTarget = document.getElementById("btnCopyNfcTargetUrl");
    if (btnCopyNfcTarget) {
      btnCopyNfcTarget.addEventListener("click", () => {
        const input = document.getElementById("nfcTargetUrlInput");
        if (input && navigator.clipboard) {
          navigator.clipboard.writeText(input.value).then(() => {
            btnCopyNfcTarget.textContent = "✓ Copied!";
            setTimeout(() => { btnCopyNfcTarget.textContent = "📋 Copy URL"; }, 2000);
          });
        }
      });
    }

    const btnWebNfc = document.getElementById("btnTriggerWebNfcWrite");
    if (btnWebNfc) btnWebNfc.addEventListener("click", () => this.writeWebNfc());

    // Background polling every 6 seconds
    setInterval(() => {
      if (document.getElementById("modalWorkshopBackdrop")?.style.display === "flex" || this.isOperatorMode) {
        this.fetchWorkshopQueue(true);
      }
    }, 6000);
  }

  fetchWorkshopConfig() {
    fetch("/api/workshop/config")
      .then(res => res.json())
      .then(cfg => {
        if (cfg && cfg.paperSize) {
          this.workshopProfile = { ...this.workshopProfile, ...cfg };
          this.applyWorkshopConstraints();
        }
      })
      .catch(() => {
        const localCfg = localStorage.getItem("plotter_workshop_config");
        if (localCfg) {
          try {
            this.workshopProfile = { ...this.workshopProfile, ...JSON.parse(localCfg) };
            this.applyWorkshopConstraints();
          } catch(e) {}
        }
      });
  }

  applyWorkshopConstraints() {
    if (!this.workshopProfile.lockedForWorkshop) return;

    // Synchronize locked paper size across UI
    const targetPaper = this.workshopProfile.paperSize || "a5";
    if (this.currentPaper !== targetPaper) {
      this.currentPaper = targetPaper;
      const select = document.getElementById("selectPaper");
      if (select) select.value = targetPaper;
      const paper = this.getPaper();
      if (this.posterMaker && paper) {
        this.posterMaker.setPaperSize(paper.width, paper.height, this.params.marginMm);
      }
      this.fitToScreen();
      this.generatePaths();
    }

    // Lock paper margin
    if (this.workshopProfile.marginMm) {
      this.params.marginMm = this.workshopProfile.marginMm;
      const marginInput = document.getElementById("marginMm");
      if (marginInput) marginInput.value = this.workshopProfile.marginMm;
    }

    // Synchronize locked paper orientation
    if (this.workshopProfile.paperOrientation) {
      this.setOrientation(this.workshopProfile.paperOrientation);
    }

    // Populate Operator calibration inputs with current profile
    const opPaper = document.getElementById("opPaperSize");
    if (opPaper) opPaper.value = this.workshopProfile.paperSize || "a5";

    const opOri = document.getElementById("opPaperOrientation");
    if (opOri) opOri.value = this.workshopProfile.paperOrientation || "portrait";

    const opMargin = document.getElementById("opPaperMargin");
    if (opMargin) opMargin.value = this.workshopProfile.marginMm || 12;

    const opMaxPens = document.getElementById("opMaxPens");
    if (opMaxPens) opMaxPens.value = this.workshopProfile.maxPensAllowed || 2;

    const opOrigin = document.getElementById("opMachineOrigin");
    if (opOrigin) opOrigin.value = this.workshopProfile.origin || "bottom_left";

    const opAct = document.getElementById("opPenActuation");
    if (opAct) opAct.value = this.workshopProfile.actuation || "servo_pwm";

    const opFeedD = document.getElementById("opFeedDraw");
    if (opFeedD) opFeedD.value = this.workshopProfile.feedrateDraw || 3000;

    const opFeedT = document.getElementById("opFeedTravel");
    if (opFeedT) opFeedT.value = this.workshopProfile.feedrateTravel || 6000;

    const downS = this.workshopProfile.penDownS || 500;
    const opSlider = document.getElementById("opPenDownSlider");
    const opInput = document.getElementById("opPenDownS");
    const valBadge = document.getElementById("valPenDownS");
    if (opSlider) opSlider.value = downS;
    if (opInput) opInput.value = downS;
    if (valBadge) {
      valBadge.textContent = `S${downS} (${downS <= 400 ? "Gentle" : downS <= 600 ? "Balanced" : "Firm"})`;
    }
    document.querySelectorAll(".btn-pressure-preset").forEach(b => {
      b.classList.toggle("active", Number(b.getAttribute("data-s")) === downS);
    });
  }

  openSubmitModal() {
    const backdrop = document.getElementById("modalSubmitBackdrop");
    if (!backdrop) return;

    // Reset view to form
    const formBody = document.getElementById("submitFormBody");
    const successBody = document.getElementById("submitSuccessBody");
    if (formBody) formBody.style.display = "block";
    if (successBody) successBody.style.display = "none";

    // Populate specifications
    const paper = this.getPaper();
    const specPaper = document.getElementById("submitSpecPaper");
    if (specPaper) specPaper.textContent = `${paper.name} (${paper.width}×${paper.height}mm)`;

    let numPens = this.activeTab === "custom" ? (this.customNumColors || 3) : (this.params.numColors || 3);
    const penTheme = this.getActivePenTheme();

    const specPens = document.getElementById("submitSpecPens");
    if (specPens) specPens.textContent = `${numPens} ${this.lang === "ar" ? "أقلام" : "Pens"}`;

    const specTime = document.getElementById("submitSpecTime");
    if (specTime) specTime.textContent = `⏱️ ${this.metrics?.timeFormatted || "~4m"}`;

    const specLifts = document.getElementById("submitSpecLifts");
    if (specLifts) specLifts.textContent = `⚡ ${this.metrics?.penLifts || 0} ${this.lang === "ar" ? "رفعة" : "lifts"}`;

    // Color chips
    const colorsRow = document.getElementById("submitSpecColorsRow");
    if (colorsRow) {
      let chipsHtml = "";
      if (penTheme) {
        chipsHtml += `<div class="spec-color-chip"><span class="spec-color-dot" style="background:${penTheme.color1}"></span><span>Pen 1</span></div>`;
        if (numPens >= 2) chipsHtml += `<div class="spec-color-chip"><span class="spec-color-dot" style="background:${penTheme.color2}"></span><span>Pen 2</span></div>`;
        if (numPens >= 3) chipsHtml += `<div class="spec-color-chip"><span class="spec-color-dot" style="background:${penTheme.color3}"></span><span>Pen 3</span></div>`;
      }
      colorsRow.innerHTML = chipsHtml;
    }

    // Pre-fill participant name
    const inputName = document.getElementById("inputParticipantName");
    if (inputName) {
      const saved = localStorage.getItem("plotter_participant_name") || "";
      inputName.value = saved;
      setTimeout(() => inputName.focus(), 100);
    }

    backdrop.style.display = "flex";
  }

  closeSubmitModal() {
    const backdrop = document.getElementById("modalSubmitBackdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  submitCurrentPoster() {
    const nameInput = document.getElementById("inputParticipantName");
    const name = nameInput ? nameInput.value.trim() : "";

    if (!name) {
      alert(this.lang === "ar" ? "الرجاء إدخال اسمك قبل الإرسال!" : "Please enter your name before submitting!");
      if (nameInput) nameInput.focus();
      return;
    }

    localStorage.setItem("plotter_participant_name", name);

    if (this.activeTab === "custom" && this.posterMaker) {
      this.ensureCustomPlotterPaths();
    }

    const paper = this.getPaper();
    let numPens = this.activeTab === "custom" ? (this.customNumColors || 3) : (this.params.numColors || 3);
    const penTheme = this.getActivePenTheme();

    const isCustom = this.activeTab === "custom";
    const p1 = window.getRoygvColor ? window.getRoygvColor(isCustom ? this.customWorkshopTones.pen1 : this.workshopTones.tone1) : { hex: "#111827", name: "Midnight Black" };
    const p2 = window.getRoygvColor ? window.getRoygvColor(isCustom ? this.customWorkshopTones.pen2 : this.workshopTones.tone2) : { hex: "#0284c7", name: "Cobalt Blue" };
    const p3 = window.getRoygvColor ? window.getRoygvColor(isCustom ? this.customWorkshopTones.pen3 : this.workshopTones.tone3) : { hex: "#e11d48", name: "Crimson Red" };

    const metadata = {
      participantName: name,
      pen1Name: p1.name,
      pen1Color: penTheme?.color1 || p1.hex,
      pen2Name: p2.name,
      pen2Color: penTheme?.color2 || p2.hex,
      pen3Name: p3.name,
      pen3Color: penTheme?.color3 || p3.hex,
      timeFormatted: this.metrics?.timeFormatted || "N/A"
    };

    // Fast 10-char privacy token for URL & GitHub Pages
    const hash = window.createPosterHash ? window.createPosterHash(name) : Math.random().toString(36).slice(2, 12);

    // Participant submissions are clean standard geometry; also generate wide (+28%) versions for operator
    const profileStandard = { ...this.workshopProfile, aspectMode: "normal" };
    const combinedGcode = window.generateOpenBuildsGCode
      ? window.generateOpenBuildsGCode(this.paths, paper, profileStandard, metadata)
      : "";
    const splitFiles = window.generateSplitGCode
      ? window.generateSplitGCode(this.paths, paper, profileStandard, metadata)
      : [];
    const calibratedSvg = window.generateCalibratedSVG
      ? window.generateCalibratedSVG(this.paths, paper, { pen1: penTheme?.color1, pen2: penTheme?.color2, pen3: penTheme?.color3 }, { ...metadata, aspectMode: "normal" })
      : "";

    // Pre-calculate wide compensated versions for operator
    const profileWide = { ...this.workshopProfile, aspectMode: "wide" };
    const wideCombinedGcode = window.generateOpenBuildsGCode
      ? window.generateOpenBuildsGCode(this.paths, paper, profileWide, metadata)
      : "";
    const wideSplitFiles = window.generateSplitGCode
      ? window.generateSplitGCode(this.paths, paper, profileWide, metadata)
      : [];
    const wideCalibratedSvg = window.generateCalibratedSVG
      ? window.generateCalibratedSVG(this.paths, paper, { pen1: penTheme?.color1, pen2: penTheme?.color2, pen3: penTheme?.color3 }, { ...metadata, aspectMode: "wide" })
      : "";

    const payload = {
      participantName: name,
      hash: hash,
      paperSize: paper.name,
      paperOrientation: this.paperOrientation,
      paperWidthMm: paper.width,
      paperHeightMm: paper.height,
      markerType: this.customMarkerType || "chunky",
      penCount: numPens,
      penNames: [metadata.pen1Name, metadata.pen2Name, metadata.pen3Name].slice(0, numPens),
      penColors: [metadata.pen1Color, metadata.pen2Color, metadata.pen3Color].slice(0, numPens),
      timeFormatted: this.metrics?.timeFormatted || "4m 00s",
      penLifts: this.metrics?.penLifts || 0,
      drawDistMeters: this.metrics?.drawDistMeters || "0m",
      gcode: combinedGcode,
      svg: calibratedSvg,
      splitFiles: splitFiles,
      wideGcode: wideCombinedGcode,
      wideSvg: wideCalibratedSvg,
      wideSplitFiles: wideSplitFiles,
      paths: this.paths
    };

    const submitBtn = document.getElementById("btnConfirmSubmit");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳</span> <span>${this.lang === "ar" ? "جاري الإرسال للراسمة..." : "Sending to Plotter..."}</span>`;
    }

    fetch("/api/workshop/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        this.showSubmitSuccess(data.queuePosition || 1, name, payload, data);
      })
      .catch(() => {
        // Offline / Standalone mode: save locally and download package
        const localQueue = JSON.parse(localStorage.getItem("plotter_local_queue") || "[]");
        const jobId = `JOB-${String(localQueue.length + 1).padStart(2, '0')}`;
        payload.id = jobId;
        payload.submittedAt = new Date().toISOString();
        payload.status = "queued";
        localQueue.push(payload);
        localStorage.setItem("plotter_local_queue", JSON.stringify(localQueue));

        this.showSubmitSuccess(localQueue.length, name, payload, null);
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>🚀</span> <span data-i18n="btnConfirmSubmit">${I18N[this.lang].btnConfirmSubmit}</span>`;
        }
      });
  }

  showSubmitSuccess(pos, name, payload, data) {
    const formBody = document.getElementById("submitFormBody");
    const successBody = document.getElementById("submitSuccessBody");
    const posBadge = document.getElementById("successQueuePosBadge");
    const nameDisplay = document.getElementById("successParticipantNameDisplay");

    if (formBody) formBody.style.display = "none";
    if (successBody) successBody.style.display = "block";
    if (nameDisplay) nameDisplay.textContent = name || (this.lang === "ar" ? "المشارك" : "Participant");
    if (posBadge) {
      posBadge.textContent = this.lang === "ar" ? `الترتيب في الطابور #${pos}` : `Queue Position #${pos}`;
    }
  }

  openWorkshopModal(initialTab = "queue") {
    const backdrop = document.getElementById("modalWorkshopBackdrop");
    if (!backdrop) return;
    backdrop.style.display = "flex";

    this.switchOperatorTab(initialTab || "queue");
    if (initialTab === "queue") {
      this.fetchWorkshopQueue();
    }

    // Populate Wi-Fi & QR code
    fetch("/api/workshop/info")
      .then(res => res.json())
      .then(info => {
        const qrContainer = document.getElementById("qrCodeContainer");
        const urlInput = document.getElementById("shareUrlInput");
        if (urlInput) urlInput.value = info.localUrl || window.location.origin;

        if (qrContainer) {
          if (info.qrSvg) {
            qrContainer.innerHTML = info.qrSvg;
          } else if (window.generateQRCodeSVG) {
            qrContainer.innerHTML = window.generateQRCodeSVG(info.localUrl || window.location.href, 240);
          }
        }
      })
      .catch(() => {
        const urlInput = document.getElementById("shareUrlInput");
        const qrContainer = document.getElementById("qrCodeContainer");
        const curUrl = window.location.href;
        if (urlInput) urlInput.value = curUrl;
        if (qrContainer && window.generateQRCodeSVG) {
          qrContainer.innerHTML = window.generateQRCodeSVG(curUrl, 240);
        }
      });
  }

  closeWorkshopModal() {
    const backdrop = document.getElementById("modalWorkshopBackdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  switchOperatorTab(tabKey) {
    document.querySelectorAll(".operator-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-optab") === tabKey);
    });

    const panels = {
      queue: document.getElementById("opPanelQueue"),
      calibration: document.getElementById("opPanelCalibration"),
      share: document.getElementById("opPanelShare"),
      feedback: document.getElementById("opPanelFeedback")
    };

    Object.keys(panels).forEach(k => {
      if (panels[k]) panels[k].style.display = (k === tabKey) ? "block" : "none";
    });

    if (tabKey === "feedback") {
      this.fetchFeedback();
    }
  }

  openFeedbackModal() {
    const backdrop = document.getElementById("modalFeedbackBackdrop");
    if (!backdrop) return;
    const formBody = document.getElementById("feedbackFormBody");
    const successBody = document.getElementById("feedbackSuccessBody");
    if (formBody) formBody.style.display = "block";
    if (successBody) successBody.style.display = "none";

    const nameInput = document.getElementById("inputFeedbackName");
    const savedName = localStorage.getItem("plotter_participant_name") || "";
    if (nameInput) nameInput.value = savedName;

    const msgInput = document.getElementById("inputFeedbackMessage");
    if (msgInput) msgInput.value = "";

    backdrop.style.display = "flex";
  }

  closeFeedbackModal() {
    const backdrop = document.getElementById("modalFeedbackBackdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  submitFeedback() {
    const nameInput = document.getElementById("inputFeedbackName");
    const msgInput = document.getElementById("inputFeedbackMessage");
    const typeRadio = document.querySelector('input[name="feedbackType"]:checked');

    const name = (nameInput?.value || "").trim() || "Anonymous Participant";
    const message = (msgInput?.value || "").trim();
    const type = typeRadio?.value || "thoughts";

    if (!message) {
      alert(this.lang === "ar" ? "الرجاء كتابة رسالتك أو سؤالك قبل الإرسال" : "Please enter your message or question before sending.");
      if (msgInput) msgInput.focus();
      return;
    }

    if (name && name !== "Anonymous Participant") {
      localStorage.setItem("plotter_participant_name", name);
    }

    const payload = { name, message, type };

    fetch("/api/workshop/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        const formBody = document.getElementById("feedbackFormBody");
        const successBody = document.getElementById("feedbackSuccessBody");
        if (formBody) formBody.style.display = "none";
        if (successBody) successBody.style.display = "block";
        if (this.isOperatorMode) {
          this.fetchFeedback(true);
        }
      })
      .catch(err => {
        console.error("Feedback submit error:", err);
        const formBody = document.getElementById("feedbackFormBody");
        const successBody = document.getElementById("feedbackSuccessBody");
        if (formBody) formBody.style.display = "none";
        if (successBody) successBody.style.display = "block";
      });
  }

  fetchFeedback(silent = false) {
    fetch("/api/workshop/feedback")
      .then(res => res.json())
      .then(data => {
        this.feedbackList = data.feedback || [];
        this.renderFeedbackList();
      })
      .catch(() => {
        this.feedbackList = [];
        this.renderFeedbackList();
      });
  }

  renderFeedbackList() {
    const container = document.getElementById("feedbackListContainer");
    const emptyState = document.getElementById("feedbackEmptyState");
    const badge = document.getElementById("opTabFeedbackBadge");
    const list = this.feedbackList || [];

    if (badge) {
      badge.textContent = list.length;
      badge.style.display = list.length > 0 ? "inline-flex" : "none";
    }

    const qCount = list.filter(item => item.type === "question").length;
    const tCount = list.filter(item => item.type !== "question").length;

    const statTotal = document.getElementById("feedbackStatTotal");
    const statQ = document.getElementById("feedbackStatQuestions");
    const statT = document.getElementById("feedbackStatThoughts");

    if (statTotal) statTotal.textContent = `💬 ${list.length} ${this.lang === "ar" ? "رسالة" : "Total Messages"}`;
    if (statQ) statQ.textContent = `❓ ${qCount} ${this.lang === "ar" ? "أسئلة" : "Questions"}`;
    if (statT) statT.textContent = `💭 ${tCount} ${this.lang === "ar" ? "انطباعات" : "Thoughts"}`;

    if (!container) return;

    if (list.length === 0) {
      if (emptyState) emptyState.style.display = "block";
      container.innerHTML = "";
      if (emptyState) container.appendChild(emptyState);
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    let html = "";
    list.forEach(item => {
      const isQ = item.type === "question";
      const badgeClass = isQ ? "feedback-badge-question" : "feedback-badge-thoughts";
      const badgeLabel = isQ
        ? (this.lang === "ar" ? "❓ سؤال لنجود" : "❓ Question for Njood")
        : (this.lang === "ar" ? "💭 انطباع ورأي" : "💭 Workshop Thoughts");
      
      const timeStr = item.submittedAt
        ? new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "";

      html += `
        <div class="feedback-card-item">
          <div class="feedback-card-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="${badgeClass}">${badgeLabel}</span>
              <strong style="color:#f8fafc; font-size:13px;">${item.name || "Anonymous"}</strong>
            </div>
            <span style="font-size:11px; color:#64748b;">${timeStr}</span>
          </div>
          <div style="font-size:13px; color:#cbd5e1; line-height:1.5; white-space:pre-wrap; background:rgba(15,23,42,0.5); padding:8px 12px; border-radius:6px; margin-top:6px;">${item.message}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  clearFeedback() {
    if (!confirm(this.lang === "ar" ? "هل أنت متأكد من مسح جميع رسائل الملاحظات والأسئلة؟" : "Are you sure you want to clear all feedback messages?")) {
      return;
    }
    fetch("/api/workshop/feedback/clear", { method: "POST" })
      .then(() => this.fetchFeedback())
      .catch(() => this.fetchFeedback());
  }

  fetchWorkshopQueue(silent = false) {
    fetch("/api/workshop/queue")
      .then(res => res.json())
      .then(jobs => {
        this.workshopJobs = jobs || [];
        this.renderQueueList();
        if (this.isOperatorMode) this.fetchFeedback(true);
      })
      .catch(() => {
        const local = JSON.parse(localStorage.getItem("plotter_local_queue") || "[]");
        this.workshopJobs = local;
        this.renderQueueList();
      });
  }

  renderQueueList() {
    const container = document.getElementById("jobListContainer");
    const emptyState = document.getElementById("queueEmptyState");
    const queueBadge = document.getElementById("headerQueueBadge");
    const opBadge = document.getElementById("opTabQueueBadge");

    const pendingCount = this.workshopJobs.filter(j => j.status !== "completed").length;
    const completedCount = this.workshopJobs.filter(j => j.status === "completed").length;

    if (queueBadge) {
      queueBadge.textContent = pendingCount;
      queueBadge.style.display = pendingCount > 0 ? "inline-flex" : "none";
    }
    if (opBadge) opBadge.textContent = pendingCount;

    const statPending = document.getElementById("queueStatPending");
    const statCompleted = document.getElementById("queueStatCompleted");
    if (statPending) statPending.textContent = `⏳ ${pendingCount} ${this.lang === "ar" ? "قيد الانتظار" : "Pending"}`;
    if (statCompleted) statCompleted.textContent = `✓ ${completedCount} ${this.lang === "ar" ? "مكتمل" : "Completed"}`;

    if (!container) return;

    if (this.workshopJobs.length === 0) {
      if (emptyState) emptyState.style.display = "block";
      container.innerHTML = "";
      if (emptyState) container.appendChild(emptyState);
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    container.innerHTML = "";

    this.workshopJobs.forEach((job, idx) => {
      const card = document.createElement("div");
      card.className = `job-card status-${job.status || 'queued'}`;

      const safePerson = window.getSafePersonName
        ? window.getSafePersonName(job.participantName)
        : (job.participantName || "Maker").trim().replace(/\s+/g, "_");

      let dotsHtml = "";
      if (Array.isArray(job.penColors)) {
        dotsHtml = job.penColors.map(c => `<span class="spec-color-dot" style="background:${c}"></span>`).join("");
      }

      let colorButtonsHtml = "";
      if (Array.isArray(job.splitFiles) && job.splitFiles.length > 0) {
        colorButtonsHtml = job.splitFiles.map((sf, sfIdx) => {
          const colName = sf.colorName || (window.getSimpleColorName ? window.getSimpleColorName(sf.name) : (job.penNames?.[sfIdx] || `Color${sfIdx + 1}`));
          const colDot = (job.penColors && job.penColors[sfIdx]) || "#38bdf8";
          const fn = sf.filename || `${colName}_${safePerson}.gcode`;
          return `
            <button type="button" class="btn-job-action btn-color-dl" data-filename="${fn}" data-colidx="${sfIdx}" title="Download single color G-code: ${fn}">
              <span class="btn-color-dot" style="background:${colDot}; width:9px; height:9px; border-radius:50%; display:inline-block; margin-inline-end:4px; vertical-align:middle; border:1px solid rgba(255,255,255,0.4);"></span>
              <span>${colName}</span>
            </button>
          `;
        }).join("");
      }

      card.innerHTML = `
        <div class="job-info-col">
          <div class="job-header-line">
            <span class="job-id-pill">${job.id || 'JOB-' + (idx + 1)}</span>
            <span class="job-name">${job.participantName || 'Anonymous'}</span>
            ${job.hash ? `<span class="job-seat" style="color:#c084fc; font-family:monospace; font-size:11px;">#${job.hash}</span>` : ""}
          </div>
          <div class="job-meta-line">
            <span>📄 ${job.paperOrientation === 'portrait' ? '↕️ Vertical' : '↔️ Horizontal'} (${job.paperSize || '15.2×20.3cm'})</span>
            <span>🎨 ${job.penCount || 1} ${this.lang === "ar" ? "أقلام" : "pens"} ${dotsHtml}</span>
            <span>⏱️ ${job.timeFormatted || '4m'}</span>
            <span>⚡ ${job.penLifts ?? 0} ${this.lang === "ar" ? "رفعة" : "lifts"}</span>
          </div>
        </div>
        <div class="job-actions-col">
          ${colorButtonsHtml ? `
            <div class="job-color-files-row" title="Download separate G-code files per color (color_personName.gcode)">
              <span class="color-files-label">${this.lang === "ar" ? "ملفات الألوان:" : "Color Files:"}</span>
              ${colorButtonsHtml}
            </div>
          ` : ""}
          <div class="job-bundle-actions-row">
            <button type="button" class="btn-job-action btn-zip-dl" data-jobid="${job.id}" data-person="${safePerson}" title="Download folder as ZIP (${safePerson}.zip)">
              <span>📦</span> <span>${this.lang === "ar" ? "مجلد ZIP" : "Folder (ZIP)"}</span>
            </button>
            <button type="button" class="btn-job-action btn-gcode-dl" data-jobid="${job.id}" title="Download Combined G-Code (All_Colors_${safePerson}.gcode)">
              <span>⚡</span> <span>${this.lang === "ar" ? "كل الألوان" : "All Colors"}</span>
            </button>
            <button type="button" class="btn-job-action btn-svg-dl" data-jobid="${job.id}" title="Download 1:1 SVG">
              <span>📥</span> <span>SVG</span>
            </button>
            <button type="button" class="btn-job-action btn-job-nfc" data-jobid="${job.id}" title="Program NFC Tag">
              <span>🏷️</span> <span>NFC</span>
            </button>
            <button type="button" class="btn-job-action btn-mark-done" data-jobid="${job.id}" title="Mark Job Plotted">
              <span>✓</span> <span>${job.status === "completed" ? (this.lang === "ar" ? "مكتمل" : "Done") : (this.lang === "ar" ? "تم الرسم" : "Plot Done")}</span>
            </button>
          </div>
          <div class="job-folder-hint">
            <span>📁 Folder:</span> <code>workshop_jobs/${safePerson}/</code>
          </div>
        </div>
      `;

      // Wire Individual Color G-Code Buttons
      card.querySelectorAll(".btn-color-dl").forEach(btn => {
        btn.addEventListener("click", () => {
          const fn = btn.getAttribute("data-filename");
          const colIdx = Number(btn.getAttribute("data-colidx"));
          const aspectMode = this.operatorAspectMode || "normal";

          if (aspectMode === "wide" && job.paths && window.generateSplitGCode) {
            const paper = { width: job.paperWidthMm || 152.4, height: job.paperHeightMm || 203.2, name: job.paperSize || "A5", margin: 12 };
            const meta = { participantName: safePerson, pen1Name: job.penNames?.[0], pen2Name: job.penNames?.[1], pen3Name: job.penNames?.[2] };
            const splits = window.generateSplitGCode(job.paths, paper, { ...this.workshopProfile, aspectMode: "wide" }, meta);
            const targetSplit = splits[colIdx] || splits[0];
            if (targetSplit) {
              this.downloadTextFile(`Wide_${targetSplit.filename}`, targetSplit.gcode, "text/plain");
              return;
            }
          }

          if (fn && !fn.startsWith("Pen")) {
            window.location.href = `/api/workshop/download/${encodeURIComponent(fn)}`;
          } else if (job.splitFiles && job.splitFiles[colIdx] && job.splitFiles[colIdx].gcode) {
            this.downloadTextFile(fn, job.splitFiles[colIdx].gcode, "text/plain");
          } else if (fn) {
            window.location.href = `/api/workshop/download/${encodeURIComponent(fn)}`;
          }
        });
      });

      // Wire Folder ZIP Download
      const btnZip = card.querySelector(".btn-zip-dl");
      if (btnZip) {
        btnZip.addEventListener("click", () => {
          window.location.href = `/api/workshop/job/${encodeURIComponent(job.id || job.hash)}/zip`;
        });
      }

      // Wire Combined G-Code
      card.querySelector(".btn-gcode-dl").addEventListener("click", () => {
        const aspectMode = this.operatorAspectMode || "normal";
        if (aspectMode === "wide" && job.paths && window.generateOpenBuildsGCode) {
          const paper = { width: job.paperWidthMm || 152.4, height: job.paperHeightMm || 203.2, name: job.paperSize || "A5", margin: 12 };
          const meta = { participantName: safePerson, pen1Name: job.penNames?.[0], pen2Name: job.penNames?.[1], pen3Name: job.penNames?.[2] };
          const gcode = window.generateOpenBuildsGCode(job.paths, paper, { ...this.workshopProfile, aspectMode: "wide" }, meta);
          this.downloadTextFile(`Wide_All_Colors_${safePerson}.gcode`, gcode, "text/plain");
          return;
        }

        const fn = job.gcodeFilename || `All_Colors_${safePerson}.gcode`;
        if (job.gcodeFilename) {
          window.location.href = `/api/workshop/download/${encodeURIComponent(job.gcodeFilename)}`;
        } else if (job.gcode) {
          this.downloadTextFile(fn, job.gcode, "text/plain");
        } else {
          alert("G-Code not found in job record.");
        }
      });

      // Wire SVG
      card.querySelector(".btn-svg-dl").addEventListener("click", () => {
        const aspectMode = this.operatorAspectMode || "normal";
        if (aspectMode === "wide" && job.paths && window.generateCalibratedSVG) {
          const paper = { width: job.paperWidthMm || 152.4, height: job.paperHeightMm || 203.2, name: job.paperSize || "A5", margin: 12 };
          const meta = { participantName: safePerson, pen1Name: job.penNames?.[0], pen2Name: job.penNames?.[1], pen3Name: job.penNames?.[2], aspectMode: "wide" };
          const svg = window.generateCalibratedSVG(job.paths, paper, { pen1: job.penColors?.[0], pen2: job.penColors?.[1], pen3: job.penColors?.[2] }, meta);
          this.downloadTextFile(`Wide_Calibrated_${safePerson}.svg`, svg, "image/svg+xml");
          return;
        }

        const fn = job.svgFilename || `Calibrated_${safePerson}.svg`;
        if (job.svgFilename) {
          window.location.href = `/api/workshop/download/${encodeURIComponent(job.svgFilename)}`;
        } else if (job.svg) {
          this.downloadTextFile(fn, job.svg, "image/svg+xml");
        }
      });

      // Wire NFC
      card.querySelector(".btn-job-nfc").addEventListener("click", () => {
        this.openNfcWriterModal(job);
      });

      // Wire Mark Done
      card.querySelector(".btn-mark-done").addEventListener("click", () => {
        this.markJobStatus(job.id, job.status === "completed" ? "queued" : "completed");
      });

      container.appendChild(card);
    });
  }

  openNfcWriterModal(job) {
    this.currentNfcJob = job;
    this.nfcTargetMode = "local";

    const backdrop = document.getElementById("modalNfcWriterBackdrop");
    const idElem = document.getElementById("nfcModalJobId");
    const nameElem = document.getElementById("nfcModalParticipant");
    const hashElem = document.getElementById("nfcModalHashBadge");

    if (idElem) idElem.textContent = job.id || "JOB";
    if (nameElem) nameElem.textContent = job.participantName || "Anonymous";
    if (hashElem) hashElem.textContent = `#${job.hash || 'souvenir'}`;

    document.getElementById("btnNfcModeLocal")?.classList.add("active");
    document.getElementById("btnNfcModeGithub")?.classList.remove("active");

    const statusText = document.getElementById("nfcWriteStatusText");
    if (statusText) {
      statusText.textContent = "ℹ️ Web NFC supported directly on Android Chrome. On iPhone / iOS, open the free NFC Tools app, tap 'Write' > 'Add a record' > 'URL', paste the URL above, and tap the sticker!";
      statusText.style.color = "#94a3b8";
    }

    this.updateNfcModalView();
    if (backdrop) backdrop.style.display = "flex";
  }

  closeNfcWriterModal() {
    const backdrop = document.getElementById("modalNfcWriterBackdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  updateNfcModalView() {
    const job = this.currentNfcJob;
    if (!job) return;

    const hash = job.hash || job.id || "souvenir";
    let targetUrl = "";

    if (this.nfcTargetMode === "github") {
      const base = window.location.hostname.includes("github.io")
        ? `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}`
        : (this.workshopConfig?.githubPagesBaseUrl || "https://doojn.github.io/poster-plotter-studio/");
      targetUrl = `${base.replace(/\/$/, '')}/viewer.html?id=${hash}`;
    } else {
      // Local Workshop Wi-Fi URL
      targetUrl = `${window.location.origin}/p/${hash}`;
    }

    const input = document.getElementById("nfcTargetUrlInput");
    if (input) input.value = targetUrl;

    const qrBox = document.getElementById("nfcQrCodeContainer");
    if (qrBox && window.generateQRCodeSVG) {
      qrBox.innerHTML = window.generateQRCodeSVG(targetUrl, 180);
    }

    const previewLink = document.getElementById("btnOpenNfcPageDirect");
    if (previewLink) previewLink.href = targetUrl;
  }

  async writeWebNfc() {
    const statusText = document.getElementById("nfcWriteStatusText");
    const job = this.currentNfcJob;
    if (!job) return;

    const input = document.getElementById("nfcTargetUrlInput");
    const targetUrl = input ? input.value : `${window.location.origin}/viewer.html?id=${job.hash || job.id}`;

    if (!('NDEFReader' in window)) {
      alert(`Web NFC is not supported in this desktop browser.\n\nQuick 3-step setup on your phone:\n1. Open free "NFC Tools" app (iOS/Android)\n2. Tap "Write" > "Add a record" > "URL"\n3. Paste:\n${targetUrl}\n4. Tap "Write" and touch your sticker!`);
      return;
    }

    try {
      if (statusText) {
        statusText.textContent = "⏳ Ready! Touch an NFC sticker to your device now...";
        statusText.style.color = "#fbbf24";
      }
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [{ recordType: "url", data: targetUrl }]
      });
      if (statusText) {
        statusText.textContent = "🎉 SUCCESS! NFC Souvenir sticker programmed successfully!";
        statusText.style.color = "#34d399";
      }
    } catch (err) {
      if (statusText) {
        statusText.textContent = `❌ Write error: ${err.message}`;
        statusText.style.color = "#f87171";
      }
    }
  }

  markJobStatus(jobId, status) {
    fetch(`/api/workshop/job/${jobId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then(() => this.fetchWorkshopQueue())
      .catch(() => {
        const local = JSON.parse(localStorage.getItem("plotter_local_queue") || "[]");
        const found = local.find(j => j.id === jobId);
        if (found) {
          found.status = status;
          localStorage.setItem("plotter_local_queue", JSON.stringify(local));
          this.workshopJobs = local;
          this.renderQueueList();
        }
      });
  }

  clearCompletedJobs() {
    this.workshopJobs = this.workshopJobs.filter(j => j.status !== "completed");
    localStorage.setItem("plotter_local_queue", JSON.stringify(this.workshopJobs));
    this.renderQueueList();
  }

  saveAndLockWorkshopConfig() {
    const opPaper = document.getElementById("opPaperSize")?.value || "a5";
    const opOri = document.getElementById("opPaperOrientation")?.value || "landscape";
    const opMargin = Number(document.getElementById("opPaperMargin")?.value) || 12;
    const opMaxPens = Number(document.getElementById("opMaxPens")?.value) || 2;
    const opMarker = document.getElementById("opMarkerType")?.value || "chunky";
    const opOrigin = document.getElementById("opMachineOrigin")?.value || "bottom_left";
    const opAct = document.getElementById("opPenActuation")?.value || "servo_pwm";
    const opFeedD = Number(document.getElementById("opFeedDraw")?.value) || 2200;
    const opFeedT = Number(document.getElementById("opFeedTravel")?.value) || 3500;
    const opDownS = Number(document.getElementById("opPenDownS")?.value) || 500;
    const opAspect = document.getElementById("opAspectMode")?.value || "normal";

    const newConfig = {
      lockedForWorkshop: true,
      paperSize: opPaper,
      paperOrientation: opOri,
      marginMm: opMargin,
      maxPensAllowed: opMaxPens,
      markerType: opMarker,
      origin: opOrigin,
      actuation: opAct,
      penDownS: opDownS,
      penDownCmd: `M3 S${opDownS}`,
      feedrateDraw: opFeedD,
      feedrateTravel: opFeedT,
      aspectMode: opAspect
    };

    this.workshopProfile = { ...this.workshopProfile, ...newConfig };
    localStorage.setItem("plotter_workshop_config", JSON.stringify(this.workshopProfile));

    // Send to server so all participants receive it
    fetch("/api/workshop/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newConfig)
    }).catch(() => {});

    this.applyWorkshopConstraints();

    const btn = document.getElementById("btnSaveAndLockConfig");
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = this.lang === "ar" ? "✓ تم قفل الإعدادات بنجاح!" : "✓ Settings Locked for Workshop!";
      setTimeout(() => btn.textContent = orig, 2500);
    }
  }

  downloadCornerTest() {
    const paper = this.getPaper();
    const gcode = window.generateCornerTestGCode
      ? window.generateCornerTestGCode(paper, this.workshopProfile)
      : "; Corner test generator not loaded.";

    this.downloadTextFile(`Paper_Corner_Alignment_Test_${paper.name.replace(/[^a-zA-Z0-9]/g, "_")}.gcode`, gcode, "text/plain");
  }

  copyCornerTest() {
    const paper = this.getPaper();
    const gcode = window.generateCornerTestGCode
      ? window.generateCornerTestGCode(paper, this.workshopProfile)
      : "; Corner test generator not loaded.";

    navigator.clipboard.writeText(gcode).then(() => {
      const btn = document.getElementById("btnCopyCornerTestGcode");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = this.lang === "ar" ? "✓ تم النسخ!" : "✓ Copied G-Code!";
        setTimeout(() => btn.textContent = orig, 1800);
      }
    });
  }

  downloadPenUpDownTest() {
    const paper = this.getPaper();
    const gcode = window.generatePenUpDownCalibrationGCode
      ? window.generatePenUpDownCalibrationGCode(paper, this.workshopProfile)
      : "; Pen test generator not loaded.";

    this.downloadTextFile(`Pen_UpDown_Calibration_Test_${paper.name.replace(/[^a-zA-Z0-9]/g, "_")}.gcode`, gcode, "text/plain");
  }

  copyPenUpDownTest() {
    const paper = this.getPaper();
    const gcode = window.generatePenUpDownCalibrationGCode
      ? window.generatePenUpDownCalibrationGCode(paper, this.workshopProfile)
      : "; Pen test generator not loaded.";

    navigator.clipboard.writeText(gcode).then(() => {
      const btn = document.getElementById("btnCopyPenTestGcode");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = this.lang === "ar" ? "✓ تم النسخ!" : "✓ Copied G-Code!";
        setTimeout(() => btn.textContent = orig, 1800);
      }
    });
  }

  downloadLadderTest() {
    const paper = this.getPaper();
    const gcode = window.generatePenDownStepTestGCode
      ? window.generatePenDownStepTestGCode(paper, this.workshopProfile)
      : "; Ladder test generator not loaded.";

    this.downloadTextFile(`Pen_Down_Pressure_Ladder_Test_${paper.name.replace(/[^a-zA-Z0-9]/g, "_")}.gcode`, gcode, "text/plain");
  }

  copyLadderTest() {
    const paper = this.getPaper();
    const gcode = window.generatePenDownStepTestGCode
      ? window.generatePenDownStepTestGCode(paper, this.workshopProfile)
      : "; Ladder test generator not loaded.";

    navigator.clipboard.writeText(gcode).then(() => {
      const btn = document.getElementById("btnCopyLadderTestGcode");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = this.lang === "ar" ? "✓ تم النسخ!" : "✓ Copied G-Code!";
        setTimeout(() => btn.textContent = orig, 1800);
      }
    });
  }

  copyShareUrl() {
    const input = document.getElementById("shareUrlInput");
    if (!input) return;
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
      const btn = document.getElementById("btnCopyShareUrl");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = "✓ Copied!";
        setTimeout(() => btn.textContent = orig, 1800);
      }
    });
  }

  toggleFullscreenQR() {
    const box = document.querySelector(".qr-preview-box");
    if (!box) return;
    if (!document.fullscreenElement) {
      box.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  handleImportJobFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        if (file.name.endsWith(".json")) {
          const job = JSON.parse(content);
          this.workshopJobs.push(job);
          this.renderQueueList();
          alert(`✓ Imported Job: ${job.participantName || file.name}`);
        } else if (file.name.endsWith(".gcode")) {
          const job = {
            id: `IMP-${Date.now().toString().slice(-4)}`,
            participantName: file.name.replace(".gcode", ""),
            paperSize: "A4",
            penCount: 1,
            timeFormatted: "~4m",
            status: "queued",
            gcode: content
          };
          this.workshopJobs.push(job);
          this.renderQueueList();
          alert(`✓ Imported G-Code file: ${file.name}`);
        }
      } catch (err) {
        alert("Failed to parse file: " + err.message);
      }
    };
    reader.readAsText(file);
  }
}

// Instantiate on load
window.addEventListener("DOMContentLoaded", () => {
  window.app = new AppController();
});
