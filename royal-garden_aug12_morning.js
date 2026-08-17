/**
 * ROYAL GARDEN — 100% EXACT CARBON COPY CANVAS ENGINE
 * Built from extracted PDF geometry data (196 plots)
 * Every plot is clickable & interactive
 */

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("royal-garden-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const CSS_WIDTH = canvas.parentElement.clientWidth || 1200;
  const CSS_HEIGHT = canvas.parentElement.clientHeight || 850;

  canvas.style.width = CSS_WIDTH + "px";
  canvas.style.height = CSS_HEIGHT + "px";
  canvas.width = CSS_WIDTH * dpr;
  canvas.height = CSS_HEIGHT * dpr;

  // PDF page is 37.188 x 52.625 units. We scale to fit canvas.
  const PDF_W = 37.188;
  const PDF_H = 52.625;
  const SCALE = Math.min(CSS_WIDTH / PDF_W, CSS_HEIGHT / PDF_H);

  let camera = { x: 0, y: 0, zoom: 1.0 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let hoveredPlot = null;

  // ── PLOT DATA (extracted from AutoCAD PDF) ──
  // Each plot: {id, pdfX, pdfY, sqft, w, h, color}
  // pdfX/pdfY = position of the plot label in PDF units
  // w/h = estimated plot width/height in PDF units

  // A-series: top row, horizontal plots
  const plots = [
    // A-Series (top row, y≈17)
    {id:"A-1", sqft:1586, pdfX:16.97, pdfY:16.89, w:1.35, h:0.85, color:"#bfff00"},
    {id:"A-2", sqft:1586, pdfX:15.87, pdfY:16.89, w:1.10, h:0.85, color:"#bfff00"},
    {id:"A-3", sqft:1350, pdfX:15.04, pdfY:16.89, w:0.83, h:0.85, color:"#bfff00"},
    {id:"A-4", sqft:1500, pdfX:14.12, pdfY:16.89, w:0.92, h:0.85, color:"#bfff00"},
    {id:"A-5", sqft:2000, pdfX:12.93, pdfY:16.89, w:1.19, h:0.85, color:"#bfff00"},

    // B-1 to B-4 (second row, y≈18)
    {id:"B-1", sqft:1337, pdfX:16.68, pdfY:17.79, w:1.00, h:0.85, color:"#fef08a"},
    {id:"B-2", sqft:1337, pdfX:15.45, pdfY:17.79, w:1.00, h:0.85, color:"#fef08a"},
    {id:"B-3", sqft:1055, pdfX:14.33, pdfY:17.79, w:0.90, h:0.85, color:"#fef08a"},
    {id:"B-4", sqft:1485, pdfX:12.93, pdfY:17.79, w:1.20, h:0.85, color:"#fef08a"},

  // ════════════════════════════════════════
  // PDF.JS DIRECT RENDERER ENGINE
  // ════════════════════════════════════════
  function loadAndRenderPDF() {
    if (typeof pdfjsLib === 'undefined') {
      console.warn("PDF.js library not loaded yet.");
      return;
    }

    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.js';
    } catch(e) {}

    const pdfUrl = 'royal garden map/royal garden new sketch 2026.1pdf_7.pdf';

    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
      pdf.getPage(1).then(page => {
        const scale = 2.5; // High resolution render
        const viewport = page.getViewport({ scale: scale });

        pdfCanvas = document.createElement('canvas');
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        const pdfCtx = pdfCanvas.getContext('2d');

        const renderContext = {
          canvasContext: pdfCtx,
          viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
          isPdfLoaded = true;
          // Auto-adjust initial camera zoom to fit screen
          const fitZoom = CSS_WIDTH / viewport.width;
          camera.zoom = Math.max(0.35, fitZoom);
          drawMap();
        });
      }).catch(err => {
        console.error("PDF Page 1 error:", err);
        pdfError = true;
      });
    }).catch(err => {
      console.error("PDF Document load error:", err);
      pdfError = true;
    });
  }

  // Initial call to load PDF
  loadAndRenderPDF();
  // Right Purple Column E-1..10
  py = 780;
  ["E-1","E-2","E-3","E-4","E-5","E-6","E-7","E-8","E-9","E-10"].forEach(id => {
    addPlot(id, "1050", 1240, py, 110, 66);
    py += 66;
  });

  // Right Purple Column B-86..100
  py = 780;
  ["B-100","B-99","B-98","B-97","B-96","B-95","B-94","B-93","B-92","B-91","B-90","B-89","B-88","B-87","B-86"].forEach(id => {
    addPlot(id, "1050", 1350, py, 110, 44);
    py += 44;
  });


  // ════════════════════════════════════════
  // RENDER CANVAS ENGINE
  // ════════════════════════════════════════
  function drawMap() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    
    // Background 
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, CSS_WIDTH, CSS_HEIGHT);
    
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    if (isPdfLoaded && pdfCanvas) {
      // Draw 100% Exact Vector PDF Document
      ctx.drawImage(pdfCanvas, 0, 0);
    } else {
      // Loading State Shimmer
      ctx.fillStyle = "#334155";
      ctx.fillRect(100, 100, 1800, 2400);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(pdfError ? "PDF Loading Error — Please check PDF file" : "Loading Exact AutoCAD PDF Masterplan...", 1000, 1300);
    }

    // Interactive Hover & Booking Highlights
    plots.forEach(p => {
      const isHovered = hoveredPlot && hoveredPlot.id === p.id;
      const isBooked = p.status === "booked";

      if (isBooked) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.45)";
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, p.y, p.w, p.h);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("🔴 BOOKED", p.cx, p.cy);
      }

      if (isHovered && !isBooked) {
        ctx.fillStyle = "rgba(245, 158, 11, 0.35)";
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 4;
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`★ Click to inspect Plot ${p.id}`, p.cx, p.cy);
      }
    });

    ctx.restore();
  }

  // ════════════════════════════════════════
  // MOUSE & CAMERA CONTROLS
  // ════════════════════════════════════════
  // Row Block 1
  tx = V1;
  ["B-84","B-83","B-82","B-81"].forEach(id => { tx -= 40; addPlot(id, tx, coreY, 40, ROW_H); });
  tx = V1 + 17;
  ["C-4","C-26","C-27","C-28","B-18"].forEach(id => { let w = id.startsWith("C")?40:30; addPlot(id, tx, coreY, w, ROW_H); tx += w; });
  tx = V_EAST;
  ["B-12","B-13","B-14","B-15","B-16","B-17"].forEach(id => { tx -= 35; addPlot(id, tx, coreY, 35, ROW_H); });
  coreY += ROW_H; 

  tx = V1;
  ["B-80","B-79","B-78","B-77","B-76"].forEach(id => { tx -= 40; addPlot(id, tx, coreY, 40, ROW_H); });
  tx = V1 + 17;
  ["C-25","C-5","C-29","B-19","B-20","B-21"].forEach(id => { let w = id.startsWith("C")?40:35; addPlot(id, tx, coreY, w, ROW_H); tx += w; });
  tx = V_EAST;
  ["B-22","D-8","D-7","D-6","D-5","D-4"].forEach(id => { tx -= 35; addPlot(id, tx, coreY, 35, ROW_H); });
  coreY += ROW_H;

  roads.push({ x: V1 - 160, y: coreY, w: 160 + 17 + (V_EAST - V1), h: 17, name: "17'-0\" WIDE ROAD" });
  coreY += H_ROAD;
  
  // Row Block 2
  tx = V1;
  ["B-74","B-73","B-72","B-71"].forEach(id => { tx -= 40; addPlot(id, tx, coreY, 40, ROW_H); });
  tx = V1 + 17;
  ["C-24","C-6","C-30","B-23","B-24","B-25","B-26"].forEach(id => { let w = id.startsWith("C")?40:35; addPlot(id, tx, coreY, w, ROW_H); tx += w; });
  tx = V_EAST;
  ["B-32","B-31","B-30","B-29","B-28","B-27"].forEach(id => { tx -= 35; addPlot(id, tx, coreY, 35, ROW_H); });
  coreY += ROW_H;
  
  tx = V1;
  ["B-68","B-67","B-66","B-65","B-64"].forEach(id => { tx -= 40; addPlot(id, tx, coreY, 40, ROW_H); });
  tx = V1 + 17;
  ["C-7","C-31","D-42","D-43","D-44","B-33"].forEach(id => { let w = id.startsWith("C")?40:35; addPlot(id, tx, coreY, w, ROW_H); tx += w; });
  tx = V_EAST;
  ["B-35","D-13","D-12","D-11","D-10","D-9"].forEach(id => { tx -= 35; addPlot(id, tx, coreY, 35, ROW_H); });
  coreY += ROW_H;

  roads.push({ x: V1 - 160, y: coreY, w: 160 + 17 + (V_EAST - V1), h: 17, name: "17'-0\" WIDE ROAD" });
  coreY += H_ROAD;

  // Row Block 3
  tx = V1;
  ["B-63","B-62","B-61","B-60","B-59"].forEach(id => { tx -= 40; addPlot(id, tx, coreY, 40, ROW_H); });
  tx = V1 + 17;
  ["C-8","C-32","D-45","B-36"].forEach(id => { let w = id.startsWith("C")?40:35; addPlot(id, tx, coreY, w, ROW_H); tx += w; });
  tx = V_EAST;
  ["B-38","D-18","D-17","D-16","D-15","D-14"].forEach(id => { tx -= 35; addPlot(id, tx, coreY, 35, ROW_H); });
  coreY += ROW_H;
  
  tx = V1;
  ["B-58","C-23","C-22","C-9","C-10","C-11","C-12","D-19"].forEach(id => { let w = 40; addPlot(id, tx, coreY, w, ROW_H); tx += w; });
  tx = V_EAST;
  ["B-39","D-24","D-23","D-22","D-21","D-20"].forEach(id => { tx -= 35; addPlot(id, tx, coreY, 35, ROW_H); });
  coreY += ROW_H;

  roads.push({ x: V1, y: coreY, w: (V_EAST - V1), h: 17, name: "17'-0\" WIDE ROAD" });
  coreY += H_ROAD;

  // Row Block 4
  tx = V1 + 17;
  ["B-57","B-56","B-55","B-40","B-41","C-13","D-25"].forEach(id => { let w = 40; addPlot(id, tx, coreY, w, ROW_H); tx += w; });
  tx = V_EAST;
  ["B-42","D-30","D-29","D-28","D-27","D-26"].forEach(id => { tx -= 35; addPlot(id, tx, coreY, 35, ROW_H); });
  coreY += ROW_H;
  
  tx = V1 + 17 + 160;
  ["B-54","B-43","B-44","C-14"].forEach(id => { let w = 40; addPlot(id, tx, coreY, w, ROW_H); tx += w; });
  tx = V_EAST;
  ["B-45","D-34","D-33","D-32","D-31"].forEach(id => { tx -= 35; addPlot(id, tx, coreY, 35, ROW_H); });
  coreY += ROW_H;

  roads.push({ x: V1, y: coreY, w: (V_EAST - V1), h: 17, name: "17'-0\" WIDE ROAD" });
  coreY += H_ROAD;

  // Row Block 5
  tx = V1 + 17 + 160;
  ["C-21","C-17","C-16","C-15"].forEach(id => { let w = 40; addPlot(id, tx, coreY, w, ROW_H); tx += w; });
  tx = V_EAST;
  ["B-46","D-36","D-35"].forEach(id => { tx -= 35; addPlot(id, tx, coreY, 35, ROW_H); });
  coreY += ROW_H;
  
  tx = V1 + 17 + 160 + 80;
  ["C-20","C-18"].forEach(id => { let w = 40; addPlot(id, tx, coreY, w, ROW_H); tx += w; });
  tx = V_EAST;
  ["B-50","B-49","B-48","B-47","D-37"].forEach(id => { tx -= 35; addPlot(id, tx, coreY, 35, ROW_H); });
  coreY += ROW_H;

  roads.push({ x: V1, y: coreY, w: (V_EAST - V1), h: 17, name: "17'-0\" WIDE ROAD" });
  coreY += H_ROAD;
    {text:"Main Road Bihta - Patna", x:28.01, y:32.09, size:18, color:"#fff"},
    {text:"FUTURE EXTENSION", x:16.06, y:29.53, size:20, color:"#166534"},
    {text:"30 फीट चौरा रास्ता", x:12.51, y:13.60, size:8, color:"#333"},
    {text:"17'-0\" WIDE ROAD", x:12.33, y:18.55, size:6, color:"#333"},
  ];

  function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CSS_WIDTH, CSS_HEIGHT);

    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom * SCALE, camera.zoom * SCALE);

    // ════════════════════════════════════════════════════════════════
    // 1. ROAD FRAMEWORK (DRAWN FIRST AS THE BASE TOWNSHIP SKELETON)
    // ════════════════════════════════════════════════════════════════

    function drawRoadSegment(rx, ry, rw, rh, label = "", isHighway = false) {
      ctx.fillStyle = isHighway ? "#1e293b" : "#334155";
      ctx.fillRect(rx, ry, rw, rh);

      // Road Borders
      ctx.strokeStyle = isHighway ? "#0f172a" : "#1e293b";
      ctx.lineWidth = 0.04;
      ctx.strokeRect(rx, ry, rw, rh);

      // Centerline dashed marking
      ctx.strokeStyle = isHighway ? "#f59e0b" : "#ffffff";
      ctx.lineWidth = isHighway ? 0.04 : 0.025;
      ctx.setLineDash([0.25, 0.15]);
      ctx.beginPath();
      if (rw >= rh) { // Horizontal Road
        ctx.moveTo(rx, ry + rh / 2);
        ctx.lineTo(rx + rw, ry + rh / 2);
      } else { // Vertical Road
        ctx.moveTo(rx + rw / 2, ry);
        ctx.lineTo(rx + rw / 2, ry + rh);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Road Label
      if (label) {
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${isHighway ? 0.45 : 0.18}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (rw >= rh) {
          ctx.fillText(label, rx + rw / 2, ry + rh / 2);
        } else {
          ctx.save();
          ctx.translate(rx + rw / 2, ry + rh / 2);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      }
    }

    // ── HIGHWAYS & MAIN ROADS ──
    drawRoadSegment(26.5, 3.5, 3.0, 48.5, "Main Road Bihta - Patna", true);
    drawRoadSegment(8.39, 13.35, 18.11, 0.90, "BIHTA - SARMERA ROAD", true);

    // ── MAIN BOULEVARD (30' Wide) ──
    drawRoadSegment(11.5, 17.65, 15.0, 0.40, "30'-0\" WIDE ROAD");

    // ── HORIZONTAL INTERNAL ROADS (17' Wide) ──
    drawRoadSegment(11.5, 19.05, 15.0, 0.35, "17'-0\" WIDE ROAD");
    drawRoadSegment(8.0, 24.50, 3.8, 0.35, "17' ROAD");
    drawRoadSegment(8.0, 29.85, 3.8, 0.35, "17' ROAD");
    drawRoadSegment(2.0, 32.20, 24.5, 0.45, "17'-0\" WIDE MAIN CROSS ROAD");
    drawRoadSegment(2.0, 35.80, 24.5, 0.35, "17'-0\" WIDE ROAD");
    drawRoadSegment(6.0, 38.90, 20.5, 0.35, "17'-0\" WIDE ROAD");
    drawRoadSegment(6.0, 41.50, 20.5, 0.35, "17'-0\" WIDE ROAD");
    drawRoadSegment(11.5, 44.50, 15.0, 0.35, "17'-0\" WIDE ROAD");
    drawRoadSegment(10.0, 47.50, 16.5, 0.35, "17'-0\" WIDE ROAD");

    // ── VERTICAL INTERNAL ROADS (17' Wide) ──
    drawRoadSegment(7.8, 19.5, 0.4, 22.5, "17' ROAD");
    drawRoadSegment(11.5, 17.65, 0.4, 30.2, "17' ROAD");
    drawRoadSegment(16.2, 32.20, 0.4, 15.6, "17' ROAD");
    drawRoadSegment(21.2, 19.05, 0.4, 28.8, "17' ROAD");

    // ── BUS STAND (top right) ──
    ctx.fillStyle = "#f1f5f9";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 0.08;
    ctx.fillRect(22.5, 6.5, 4.0, 3.0);
    ctx.strokeRect(22.5, 6.5, 4.0, 3.0);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 0.32px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PROPOSED KANHAULI", 24.5, 7.60);
    ctx.fillText("BUS STAND", 24.5, 8.20);

    // ── NALA / DRAIN (green strip on far left) ──
    ctx.fillStyle = "#a3e635";
    ctx.fillRect(5.72, 4.14, 0.38, 3.73);
    ctx.fillRect(5.69, 7.88, 2.95, 2.90);
    ctx.fillRect(6.21, 22.27, 1.5, 9.57);

    // ── FUTURE EXTENSION (center green area) ──
    ctx.fillStyle = "rgba(134, 239, 172, 0.5)";
    ctx.fillRect(12.0, 19.45, 4.1, 12.7);
      } else { // vertical road
        ctx.moveTo(rx + rw/2, ry);
        ctx.lineTo(rx + rw/2, ry + rh);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      // Label
      if (label) {
        ctx.fillStyle = "#334155";
        ctx.font = "bold 0.18px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, rx + rw/2, ry + rh/2);
      }
    }

    // 30 फीट चौरा रास्ता (between A and B rows, y≈17.7)
    drawRoad(12.5, 17.74, 6.0, 0.35, "30' ROAD");

    // 17' road between B and C rows (y≈19.2)
    drawRoad(12.0, 19.25, 6.5, 0.35, "17' ROAD");

    // 17' road between E/B right columns (y≈20.4)
    drawRoad(20.0, 20.35, 2.8, 0.35, "");

    // Left side 17' roads (between B-5 to B-11 and land owners)
    drawRoad(8.5, 24.55, 3.5, 0.35, "17' ROAD");
    drawRoad(8.5, 29.95, 3.5, 0.35, "17' ROAD");

    // Major horizontal road at y≈32.5 (middle divider)
    drawRoad(4.0, 32.30, 18.5, 0.40, "17'-0\" WIDE ROAD");

    // Left bottom horizontal roads
    drawRoad(4.0, 35.90, 8.0, 0.35, "17' ROAD");

    // Center/Right horizontal roads
    drawRoad(12.0, 33.30, 10.5, 0.35, "17' ROAD");
    drawRoad(12.0, 35.95, 10.5, 0.35, "17' ROAD");
    drawRoad(12.0, 38.80, 10.5, 0.35, "17' ROAD");
    drawRoad(6.5, 39.15, 5.5, 0.35, "17' ROAD");
    drawRoad(12.0, 41.50, 10.5, 0.35, "17' ROAD");
    drawRoad(7.5, 41.50, 4.5, 0.35, "17' ROAD");
    drawRoad(14.5, 42.30, 8.0, 0.35, "17' ROAD");
    drawRoad(14.5, 44.70, 8.0, 0.35, "17' ROAD");

    // ── MAIN ROAD LABEL (right side) ──
    ctx.save();
    ctx.translate(27.5, 28.0);
    ctx.rotate(-Math.PI/2);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 0.7px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Main Road Bihta - Patna", 0, 0);
    ctx.restore();

    // ── SARMERA ROAD LABEL ──
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 0.45px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BIHTA - SARMERA ROAD", 17.0, 13.79);

    // ── BUS STAND LABEL ──
    ctx.fillStyle = "#000000";
    ctx.font = "bold 0.35px Inter, sans-serif";
    ctx.fillText("PROPOSED KANHAULI", 24.75, 7.60);
    ctx.fillText("BUS STAND", 24.75, 8.10);

    ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = "#000"; ctx.lineWidth = 0.06; ctx.stroke();
    ctx.fillStyle = "#ffffff"; ctx.fill();
    // N arrow
    ctx.beginPath(); ctx.moveTo(0, -1.8); ctx.lineTo(0.3, -0.5);
    ctx.lineTo(0, -0.3); ctx.lineTo(-0.3, -0.5); ctx.closePath();
    ctx.fillStyle = "#dc2626"; ctx.fill();
    // S arrow
    ctx.beginPath(); ctx.moveTo(0, 1.8); ctx.lineTo(0.3, 0.5);
    ctx.lineTo(0, 0.3); ctx.lineTo(-0.3, 0.5); ctx.closePath();
    ctx.fillStyle = "#000000"; ctx.fill();
    ctx.font = "bold 0.5px Inter, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#dc2626";
    ctx.fillText("N", 0, -2.2);
    ctx.fillStyle = "#000000";
    ctx.fillText("S", 0, 2.2);
    ctx.fillText("E", 2.2, 0);
    ctx.fillText("W", -2.2, 0);
    ctx.restore();; ctx.textBaseline = "middle";
    ctx.fillStyle = "#dc2626";
    ctx.fillText("N", 0, -2.2);
    ctx.fillStyle = "#000";
    ctx.fillText("S", 0, 2.2);
    ctx.fillText("E", 2.2, 0);
    ctx.fillText("W", -2.2, 0);
    ctx.restore();

    ctx.restore();
  }

  // ── INTERACTIVITY ──
  function getWorldPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const mx = evt.clientX - rect.left;
    const my = evt.clientY - rect.top;
    const wx = (mx - camera.x) / (camera.zoom * SCALE);
    const wy = (my - camera.y) / (camera.zoom * SCALE);
    return { wx, wy, mx, my };
  }

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
  });

    const { wx, wy } = getWorldPos(e);
    let found = null;
    for (const p of plots) {
      if (wx >= p.pdfX && wx <= p.pdfX + p.w && wy >= p.pdfY && wy <= p.pdfY + p.h) {
    }
  });

  canvas.addEventListener("mouseup", () => isDragging = false);
  canvas.addEventListener("mouseleave", () => { isDragging = false; hoveredPlot = null; drawMap(); });

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zf = 1.1;
    const { mx, my } = getWorldPos(e);
    let nz = e.deltaY < 0 ? camera.zoom * zf : camera.zoom / zf;
    nz = Math.max(0.3, Math.min(nz, 10));
    camera.x = mx - (mx - camera.x) * (nz / camera.zoom);
    camera.y = my - (my - camera.y) * (nz / camera.zoom);
    camera.zoom = nz;
    drawMap();
  }, { passive: false });

  canvas.addEventListener("click", () => {
    if (hoveredPlot && typeof window.openRoyalGardenPlotModal === "function") {
      window.openRoyalGardenPlotModal(hoveredPlot);
    }
  });

  drawMap();

  window.addEventListener("resize", () => {
    const nw = canvas.parentElement.clientWidth;
    const nh = canvas.parentElement.clientHeight || 850;
    canvas.style.width = nw + "px";
    canvas.style.height = nh + "px";
    canvas.width = nw * dpr;
    canvas.height = nh * dpr;
    drawMap();
  });
});

      canvas.style.cursor = hoveredPlot ? "pointer" : "grab";
      drawMap();
    }
  });

























































































































































































































































































































































































































          </div>
          <div class="kyc-address">
            Flat No. 502, 5th Floor, Rupa Tower,<br>
            Near RPS More, Beside Patna Doon Public School,<br>
            Danapur, Patna
          </div>
        </div>
        <div class="kyc-header-right" style="display: flex; flex-direction: column; align-items: flex-end;">
          <img src="assets/swarup_symbol.webp" alt="Logo" class="kyc-logo" style="width: 55px; margin-bottom: 8px;">
          <div class="brand-text-block">
            <div class="brand-main" style="font-size: 1.1rem;">SW<span class="gold-peak">∧</span>RUP</div>
            <div class="brand-sub" style="font-size: 0.45rem;">GROUP</div>
          </div>
          <div class="kyc-tagline" style="margin-top: 8px;">Building Trust With Legacy</div>
        </div>
      </div>
      <div style="text-align: center; margin-bottom: 20px;">
        <div class="kyc-title-strip" style="margin-bottom:0;">BOOKING FORM</div>
      </div>

      <div class="kyc-meta-row">
        <label class="kyc-photo-box" for="kyc-photo-upload" style="cursor:pointer;position:relative;overflow:hidden;background:#f8fafc;border:2px dashed #94a3b8;border-radius:6px;">
          <input type="file" id="kyc-photo-upload" accept="image/*" style="display:none;" onchange="previewKycPhoto(event)">
          <div id="kyc-photo-placeholder" style="padding:10px;">Click to Upload<br>Passport Size<br>Photo</div>
          <img id="kyc-photo-preview" src="" style="display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
        </label>
        <div class="kyc-meta-details" style="justify-content: flex-end; align-items: flex-end;">
          <div class="kyc-date">Date : <input type="date" id="kyc-date"></div>
        </div>
      </div>

      <div class="kyc-form-grid">
        <div class="kyc-field half">Plot No. : <input type="text" id="kyc-plot-no" readonly></div>
        <div class="kyc-field half">Plot Size : <input type="text" id="kyc-plot-size"></div>
        <div class="kyc-field half">Booking Amount : <input type="text" id="kyc-booking-amount"></div>
        <div class="kyc-field half">Booking Rate : <input type="text" id="kyc-booking-rate"></div>
      </div>

      <div class="kyc-form-grid">
        <div class="kyc-field full">Name : <input type="text" id="kyc-name"></div>
        <div class="kyc-field full">S/o, D/o, W/o : <input type="text" id="kyc-relative"></div>
        <div class="kyc-field full">Date of Birth : 
          <div style="display:inline-flex;gap:5px;align-items:center;margin-left:10px;">
            <input type="text" class="box-input" maxlength="2" placeholder="DD"> / 
            <input type="text" class="box-input" maxlength="2" placeholder="MM"> / 
            <input type="text" class="box-input" style="width:40px;" maxlength="4" placeholder="YYYY">
          </div>
        </div>
        <div class="kyc-field full">Marital Status : 
          <label style="margin-left:10px;"><input type="checkbox"> Married</label>
          <label style="margin-left:10px;"><input type="checkbox"> Single</label>
          <span style="margin-left:30px;">Gender :</span>
          <label style="margin-left:10px;"><input type="checkbox"> Male</label>
          <label style="margin-left:10px;"><input type="checkbox"> Female</label>
        </div>
        <div class="kyc-field half">Nominee Name : <input type="text"></div>
        <div class="kyc-field half">Relation : <input type="text"></div>
        <div class="kyc-field full">Present Address : <input type="text"></div>
        <div class="kyc-field full" style="margin-top:-10px;"><input type="text"></div>
        <div class="kyc-field full">Permanent Address : <input type="text"></div>
        <div class="kyc-field full" style="margin-top:-10px;"><input type="text"></div>
        <div class="kyc-field half">City : <input type="text"></div>
        <div class="kyc-field half">District : <input type="text"></div>
        <div class="kyc-field half">State : <input type="text"></div>
        <div class="kyc-field half">Pin Code : <input type="text"></div>
        <div class="kyc-field half">Phone : <input type="text"></div>
        <div class="kyc-field half">Mobile : <input type="text"></div>
        <div class="kyc-field full">Email : <input type="text"></div>
        <div class="kyc-field half">Aadhar No. : <input type="text"></div>
        <div class="kyc-field half">Pan No. : <input type="text"></div>
      </div>

      <div class="kyc-footer">
        <div class="signature-box">Customer's Signature</div>
        <div class="signature-box right">Authorised Signatory</div>
      </div>
      
      <button class="btn-gold" style="width:100%;margin-top:20px;padding:12px;font-size:1.1rem;font-weight:700;" onclick="submitKycForm()">Submit Form</button>
    </div>
  </div>

  <div id="kyc-success-overlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:99999;justify-content:center;align-items:center;flex-direction:column;text-align:center;">
    <h2 style="color:var(--gold);font-family:'Playfair Display', serif;font-size:2.5rem;margin-bottom:10px;">Congratulations!</h2>
    <p style="color:#fff;font-size:1.2rem;">You have successfully submitted your KYC Booking form.</p>
    <button class="btn-outline" style="margin-top:20px;" onclick="closeKycSuccess()">Close</button>
  </div>

  <!-- External Confetti Library -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <!-- Custom Script Files -->
  <script src="royal-garden.js?v=2"></script>
  <script src="script.js?v=17"></script>

</body>
</html>





































































        <button type="submit" id="bot-send-btn" aria-label="Send message">
          <span class="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  </div>

  <!-- Custom Script Files -->
  <script src="royal-garden.js?v=2"></script>
  <script src="script.js?v=17"></script>

</body>
</html>
