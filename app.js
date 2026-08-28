
// ════════════════════════════════════════════════════════════════
// LEAD CAPTURE & EMAIL DISPATCH ENGINE (swarupinfragroup@gmail.com)
// ════════════════════════════════════════════════════════════════
window.OFFICIAL_SWARUP_EMAIL = "swarupinfragroup@gmail.com";

window.dispatchLeadToEmail = function(leadData, subject) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const payload = {
    _subject: subject || `🌟 New Lead Inquiry - Swarup Group (${timestamp})`,
    _template: "table",
    _captcha: "false",
    "Submission Time (IST)": timestamp,
    "Official Target Email": window.OFFICIAL_SWARUP_EMAIL,
    ...leadData
  };

  // 1. Permanent Local Backup in browser localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('swarup_group_leads') || '[]');
    existing.unshift({
      id: 'LEAD-' + Date.now(),
      savedAt: timestamp,
      ...leadData
    });
    localStorage.setItem('swarup_group_leads', JSON.stringify(existing.slice(0, 200)));
    console.log("✅ Lead archived locally in swarup_group_leads");
  } catch (e) {
    console.warn("Local storage archive notice:", e);
  }

  // 2. Dispatch email directly to swarupinfragroup@gmail.com via FormSubmit AJAX API
  try {
    fetch(`https://formsubmit.co/ajax/${window.OFFICIAL_SWARUP_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => {
      console.log("✅ Lead successfully delivered to swarupinfragroup@gmail.com:", data);
    })
    .catch(err => {
      console.log("Email dispatch notice:", err);
    });
  } catch (err) {
    console.warn("Email trigger exception:", err);
  }
};

window.exportSwarupLeads = function() {
  const leads = JSON.parse(localStorage.getItem('swarup_group_leads') || '[]');
  console.table(leads);
  return leads;
};

window.triggerVipModal = function(plotInfo, projectName) {
  const vipModal = document.getElementById('vip-modal');
  if(vipModal) {
    vipModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (projectName && document.getElementById('vip-project')) {
      const projSelect = document.getElementById('vip-project');
      for (let i = 0; i < projSelect.options.length; i++) {
        if (projSelect.options[i].value.toLowerCase().includes(projectName.toLowerCase())) {
          projSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (plotInfo && document.getElementById('vip-notes')) {
      document.getElementById('vip-notes').value = `Interested in Plot: ${plotInfo}`;
    }
  }
  const plotModal = document.getElementById('plot-inspect-modal');
  if (plotModal) plotModal.remove();
  const parkModal = document.getElementById('park-inspect-modal');
  if (parkModal) parkModal.remove();
};

window.openRoyalGardenPlotModal = function openRoyalGardenPlotModal(p) {
  const existing = document.getElementById('plot-inspect-modal');
  if (existing) existing.remove();

  const statusBadge = p.status === 'booked' 
    ? '<span style="background:#ef4444;color:#fff;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">🔴 Booked</span>'
    : (p.isCorner 
        ? '<span style="background:#f59e0b;color:#fff;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">★ Corner Plot</span>'
        : '<span style="background:#10b981;color:#fff;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">🟢 Available</span>');

  const modalHTML = `
    <div class="plot-modal-overlay active" id="plot-inspect-modal" style="display:flex;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(15,23,42,0.8);z-index:9999;padding:1rem;">
      <div class="plot-modal-card" style="background:#ffffff;border-radius:24px;max-width:480px;width:100%;overflow:hidden;position:relative;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
        <button id="close-modal-btn" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.9);border:none;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#0f172a;z-index:10;">
          <span class="material-symbols-outlined">close</span>
        </button>
        
        <div style="background:linear-gradient(135deg, #1e3a8a, #0f172a);padding:2rem 1.5rem;color:#fff;">
          <div style="font-size:0.75rem;letter-spacing:1px;color:#f59e0b;font-weight:700;margin-bottom:0.5rem;text-transform:uppercase;">
            Royal Garden (Painathi Bihta-Patna Highway)
          </div>
          <h2 style="font-size:1.8rem;margin:0 0 0.5rem 0;font-weight:800;">Plot ${p.id}</h2>
          <div style="display:flex;gap:8px;align-items:center;">${statusBadge}</div>
        </div>

        <div style="padding:1.5rem;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
            <div style="background:#f8fafc;padding:0.75rem;border-radius:12px;border:1px solid #e2e8f0;">
              <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Plot Area</div>
              <div style="font-size:1.1rem;font-weight:800;color:#0f172a;">${p.sqft || "1200"} Sq.Ft</div>
            </div>
            <div style="background:#f8fafc;padding:0.75rem;border-radius:12px;border:1px solid #e2e8f0;">
              <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Dimensions</div>
              <div style="font-size:1.1rem;font-weight:800;color:#0f172a;">${p.dims || "30' x 40'"}</div>
            </div>
            <div style="background:#f8fafc;padding:0.75rem;border-radius:12px;border:1px solid #e2e8f0;">
              <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Facing</div>
              <div style="font-size:1.1rem;font-weight:800;color:#0f172a;">${p.facing || "East"}</div>
            </div>
            <div style="background:#f8fafc;padding:0.75rem;border-radius:12px;border:1px solid #e2e8f0;">
              <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Est. Price</div>
              <div style="font-size:1.1rem;font-weight:800;color:#1e3a8a;">${p.price || "₹18.5 Lakh"}</div>
            </div>
          </div>

          <button class="btn-gold" style="width:100%;justify-content:center;padding:0.85rem;font-size:0.9rem;font-weight:700;" onclick="window.triggerVipModal('Plot ${p.id}', 'Royal Garden');">
            <span class="material-symbols-outlined">key</span> Book Plot ${p.id} Now
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.getElementById('close-modal-btn').addEventListener('click', () => {
    const m = document.getElementById('plot-inspect-modal');
    if (m) m.remove();
  });
}

/* ==========================================
   SWARUP GROUP — MASTER INIT
   ========================================== */
window.BOOKED_PLOT_NUMBERS = window.BOOKED_PLOT_NUMBERS || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 29, 30, 31, 32, 33, 34, 43, 44, 45, 46, 47, 49, 61, 62, 64, 65, 66, 67, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 113, 114, 134, 135];

function isPlotBooked(idOrNum) {
  if (!idOrNum) return false;
  const numStr = String(idOrNum).replace(/\D/g, '');
  if (!numStr) return false;
  return window.BOOKED_PLOT_NUMBERS.includes(parseInt(numStr, 10));
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollVideoEngine();
  initPatnaMasterplanCanvas();
  initCalculator();
  initNavigation();
  initModal();
  initConstructionTimeline();
  initRouteTimeline();
  initGalleryReels();
});

function initPatnaMasterplanCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;
  let width, height;

  let activeFilterSize = 'all';
  let activeFilterStatus = 'all';
  let hoveredPlot = null;
  let selectedPlot = null;

  // Zoom & Pan state
  let userZoom = 1.0;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let didDrag = false;

  const plotConfigs = [];
  const parkHitboxes = [
      { id: 'Central Park & Gazebo', desc: 'A sprawling premium green space featuring a modern gazebo, lush landscapes, and a serene environment.', vx: -480, vy: 385, vw: 120, vh: 140 },
      { id: 'North Green Area', desc: 'A sprawling green lawn offering lush landscapes, fresh air, and a serene environment.', vx: -680, vy: 0, vw: 320, vh: 360 },
      { id: 'Temple & Park View', desc: 'A sacred and peaceful park space situated strategically near the residential blocks.', vx: 260, vy: 120, vw: 80, vh: 120 },
      { id: 'Community Area', desc: 'A dedicated multi-purpose community area for neighborhood gatherings, functions, and events.', vx: 670, vy: 320, vw: 30, vh: 40 }
  ];
  const scaledParks = [];
  let pNum = 1;

  // Uniform plot box size for all plots
  const UNIFORM_W = 40;
  const UNIFORM_H = 30;

  function addColumn(startX, facing, sqft, frontage, topPlots, bottomPlots, topYOffset = 0, midGapStart = 0, midGapHeight = 0, topPlots2 = 0, bottomYOffset = 385, cSqft = 1600, cFront = 40) {
      if (topPlots2 > 0) {
          // Section 1: Above Gap
          for (let r = 0; r < topPlots; r++) {
              let isCorner = (r === 0);
              let rate = 1600;
              if (isCorner) rate *= 1.1;
              let isBooked = isPlotBooked(pNum);
              let status = isBooked ? 'booked' : (isCorner ? 'corner' : 'available');
              let actualSqft = isCorner ? cSqft : sqft;
              let actualFrontage = isCorner ? cFront : frontage;
              let actualDepth = actualSqft / actualFrontage;
              plotConfigs.push({
                  num: pNum, id: 'Plot ' + pNum, sqft: actualSqft, dims: actualFrontage + "' × " + actualDepth + "'",
                  facing: facing, price: "₹" + (actualSqft * rate / 100000).toFixed(2) + " Lakh",
                  status: status, isCorner: isCorner, vx: startX, vy: topYOffset + r * frontage, vw: 40, vh: frontage
              });
              pNum++;
          }
          // Section 2: Below Gap
          let startY2 = midGapStart + midGapHeight;
          for (let r = 0; r < topPlots2; r++) {
              let isCorner = (r === topPlots2 - 1);
              let rate = 1600;
              if (isCorner) rate *= 1.1;
              let isBooked = isPlotBooked(pNum);
              let status = isBooked ? 'booked' : (isCorner ? 'corner' : 'available');
              let actualSqft = isCorner ? cSqft : sqft;
              let actualFrontage = isCorner ? cFront : frontage;
              let actualDepth = actualSqft / actualFrontage;
              plotConfigs.push({
                  num: pNum, id: 'Plot ' + pNum, sqft: actualSqft, dims: actualFrontage + "' × " + actualDepth + "'",
                  facing: facing, price: "₹" + (actualSqft * rate / 100000).toFixed(2) + " Lakh",
                  status: status, isCorner: isCorner, vx: startX, vy: startY2 + r * frontage, vw: 40, vh: frontage
              });
              pNum++;
          }
      } else {
          // Standard single top section
          for (let r = 0; r < topPlots; r++) {
              let isCorner = (r === 0) || (r === topPlots - 1);
              let rate = 1600;
              if (isCorner) rate *= 1.1;
              let isBooked = isPlotBooked(pNum);
              let status = isBooked ? 'booked' : (isCorner ? 'corner' : 'available');
              let actualSqft = isCorner ? cSqft : sqft;
              let actualFrontage = isCorner ? cFront : frontage;
              let actualDepth = actualSqft / actualFrontage;
              plotConfigs.push({
                  num: pNum, id: 'Plot ' + pNum, sqft: actualSqft, dims: actualFrontage + "' × " + actualDepth + "'",
                  facing: facing, price: "₹" + (actualSqft * rate / 100000).toFixed(2) + " Lakh",
                  status: status, isCorner: isCorner, vx: startX, vy: topYOffset + r * frontage, vw: 40, vh: frontage
              });
              pNum++;
          }
      }

      // Bottom Half (Starts below H-Road at bottomYOffset, default 385)
      for (let r = 0; r < bottomPlots; r++) {
          let isCorner = (r === 0) || (r === bottomPlots - 1);
          let rate = 1600;
          if (isCorner) rate *= 1.1;
          let isBooked = isPlotBooked(pNum);
          let status = isBooked ? 'booked' : (isCorner ? 'corner' : 'available');
          let actualSqft = isCorner ? cSqft : sqft;
          let actualFrontage = isCorner ? cFront : frontage;
          let actualDepth = actualSqft / actualFrontage;
          plotConfigs.push({
              num: pNum, id: 'Plot ' + pNum, sqft: actualSqft, dims: actualFrontage + "' × " + actualDepth + "'",
              facing: facing, price: "₹" + (actualSqft * rate / 100000).toFixed(2) + " Lakh",
              status: status, isCorner: isCorner, vx: startX, vy: bottomYOffset + r * frontage, vw: 40, vh: frontage
          });
          pNum++;
      }
  }

  function addHorizontalRow(startX, startY, numPlots, facing, sqft, frontage, isReverse = false, corners = 'both', totalWidth = null) {
      let plotData = [];
      let currentX = startX;
      
      let cornerCount = 0;
      if (corners === 'both') cornerCount = 2;
      else if (corners === 'left' || corners === 'right') cornerCount = 1;
      
      let regularCount = numPlots - cornerCount;
      let visualCornerWidth = 40;
      let visualRegularWidth = frontage;
      
      if (totalWidth !== null && regularCount > 0) {
          visualRegularWidth = (totalWidth - (cornerCount * visualCornerWidth)) / regularCount;
      }
      
      for (let c = 0; c < numPlots; c++) {
          let isCorner = false;
          if (corners === 'both') isCorner = (c === 0) || (c === numPlots - 1);
          else if (corners === 'left') isCorner = (c === 0);
          else if (corners === 'right') isCorner = (c === numPlots - 1);

          let rate = 1600;
          if (isCorner) rate *= 1.1;

          let actualSqft = isCorner ? 1600 : sqft;
          let actualFrontage = isCorner ? 40 : frontage;
          let actualDepth = actualSqft / actualFrontage;
          
          let vw = isCorner ? visualCornerWidth : visualRegularWidth;

          plotData.push({
              sqft: actualSqft,
              dims: actualFrontage + "' × " + actualDepth + "'",
              facing: facing,
              price: "₹" + (actualSqft * rate / 100000).toFixed(2) + " Lakh",
              status: 'available',
              isCorner: isCorner,
              vx: currentX,
              vy: startY,
              vw: vw,
              vh: actualDepth
          });
          currentX += vw;
      }

      if (isReverse) plotData.reverse();
      
      plotData.forEach(p => {
          p.num = pNum;
          p.id = 'Plot ' + pNum;
          let isBooked = isPlotBooked(pNum);
          p.status = isBooked ? 'booked' : (p.isCorner ? 'corner' : 'available');
          plotConfigs.push(p);
          pNum++;
      });
  }

  // ── GENERATE PLOTS ──
  addHorizontalRow(400, 320, 9, 'South Facing', 1200, 30, true, 'none', 270);
  addHorizontalRow(400, 385, 10, 'North Facing', 1440, 30, true, 'none', 290);

  addColumn(360, 'West Facing', 900, 30, 10, 0, 20, 0, 0, 0, 385, 900, 30);
  
  let rate30 = 1600 * 1.1;
  plotConfigs.push({
      num: pNum, id: 'Plot ' + pNum, sqft: 1600, dims: "40' × 40'",
      facing: 'South Facing', price: "₹" + (1600 * rate30 / 100000).toFixed(2) + " Lakh",
      status: isPlotBooked(pNum) ? 'booked' : 'corner', isCorner: true,
      vx: 360, vy: 320, vw: 40, vh: 40
  }); pNum++;

  let rate31 = 1600 * 1.1;
  plotConfigs.push({
      num: pNum, id: 'Plot ' + pNum, sqft: 1600, dims: "40' × 40'",
      facing: 'North Facing', price: "₹" + (1600 * rate31 / 100000).toFixed(2) + " Lakh",
      status: isPlotBooked(pNum) ? 'booked' : 'corner', isCorner: true,
      vx: 360, vy: 385, vw: 40, vh: 40
  }); pNum++;

  addColumn(360, 'West Facing', 900, 30, 0, 8, 0, 0, 0, 0, 425, 900, 30);

  addColumn(300, 'East Facing', 1200, 30, 4, 9, 0, 120, 120, 4);
  addColumn(260, 'West Facing', 1200, 30, 4, 9, 0, 120, 120, 4);

  addColumn(200, 'East Facing', 900, 22.5, 16, 12, 0);
  addColumn(160, 'West Facing', 1200, 30, 12, 9, 0);

  addColumn(100, 'East Facing', 1200, 30, 12, 9, 0);
  addColumn(60, 'West Facing', 1200, 40, 9, 7, 0);

  addColumn(0, 'East Facing', 1200, 30, 12, 9, 0);
  addColumn(-40, 'West Facing', 1200, 30, 12, 9, 0);

  addColumn(-100, 'East Facing', 1200, 30, 12, 9, 0);
  addColumn(-140, 'West Facing', 1200, 30, 12, 9, 0);

  addColumn(-200, 'East Facing', 1200, 30, 12, 9, 0);
  addColumn(-240, 'West Facing', 1200, 30, 12, 9, 0);

  addColumn(-300, 'East Facing', 1200, 30, 12, 9, 0);
  addColumn(-340, 'West Facing', 1200, 30, 12, 9, 0);

  const plots = [];
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  
  const vMinX = -800;
  const vMaxX = 760;
  const vMinY = -50;
  const vMaxY = 800;
  const vWidth = vMaxX - vMinX;
  const vHeight = vMaxY - vMinY;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = (canvas.parentElement && canvas.parentElement.clientWidth) ? canvas.parentElement.clientWidth : (window.innerWidth - 40);
    if (!width || width < 300) width = Math.min(window.innerWidth - 32, 1400);
    height = (canvas.parentElement && canvas.parentElement.clientHeight) ? canvas.parentElement.clientHeight : 700;
    if (!height || height < 400) height = 700;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    buildLayout();
  }

  function buildLayout() {
    plots.length = 0;
    
    const padding = 20;
    const availW = width - padding * 2;
    const availH = height - padding * 2;

    scale = Math.min(availW / vWidth, availH / vHeight) * userZoom;
    
    offsetX = (width - vWidth * scale) / 2 - (vMinX * scale) + panX;
    offsetY = (height - vHeight * scale) / 2 - (vMinY * scale) + panY;

    plotConfigs.forEach(cfg => {
      plots.push({
        ...cfg,
        x: offsetX + cfg.vx * scale,
        y: offsetY + cfg.vy * scale,
        w: cfg.vw * scale,
        h: cfg.vh * scale
      });
    });

    scaledParks.length = 0;
    parkHitboxes.forEach(cfg => {
      scaledParks.push({
        ...cfg,
        x: offsetX + cfg.vx * scale,
        y: offsetY + cfg.vy * scale,
        w: cfg.vw * scale,
        h: cfg.vh * scale
      });
    });
  }

  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);
  setTimeout(resize, 100);
  setTimeout(resize, 500);
  resize();

  // Zoom Button Listeners
  const zoomInBtn = document.getElementById('guru-zoom-in-btn');
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      userZoom = Math.min(3.5, userZoom * 1.25);
      buildLayout();
    });
  }
  const zoomOutBtn = document.getElementById('guru-zoom-out-btn');
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      userZoom = Math.max(0.6, userZoom / 1.25);
      if (userZoom <= 1.0) { panX = 0; panY = 0; }
      buildLayout();
    });
  }
  const zoomResetBtn = document.getElementById('guru-zoom-reset-btn');
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      userZoom = 1.0;
      panX = 0;
      panY = 0;
      buildLayout();
    });
  }

  // Mouse Wheel Zoom (Requires Ctrl key so normal scrolling works over canvas)
  canvas.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const newZoom = Math.min(3.5, Math.max(0.6, userZoom * zoomFactor));
      if (newZoom !== userZoom) {
        userZoom = newZoom;
        if (userZoom <= 1.0) { panX = 0; panY = 0; }
        buildLayout();
      }
    }
  }, { passive: false });

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function handlePointerMove(e) {
    const pos = getCanvasCoords(e);
    let foundPlot = null;
    let foundPark = null;
    plots.forEach(p => {
      if (pos.x >= p.x && pos.x <= p.x + p.w && pos.y >= p.y && pos.y <= p.y + p.h) foundPlot = p;
    });
    scaledParks.forEach(p => {
      if (pos.x >= p.x && pos.x <= p.x + p.w && pos.y >= p.y && pos.y <= p.y + p.h) foundPark = p;
    });
    hoveredPlot = foundPlot;
    canvas.style.cursor = (foundPlot || foundPark) ? 'pointer' : (userZoom > 1.0 ? 'grab' : 'default');
  }

  function handlePointerClick(e) {
    const pos = getCanvasCoords(e);
    plots.forEach(p => {
      if (pos.x >= p.x && pos.x <= p.x + p.w && pos.y >= p.y && pos.y <= p.y + p.h) {
        selectedPlot = p;
        openPlotModal(p);
      }
    });
    scaledParks.forEach(p => {
      if (pos.x >= p.x && pos.x <= p.x + p.w && pos.y >= p.y && pos.y <= p.y + p.h) {
        openParkModal(p);
      }
    });
  }

  canvas.addEventListener('mousedown', (e) => {
    if (userZoom > 1.0) {
      isDragging = true;
      didDrag = false;
      const pos = getCanvasCoords(e);
      dragStart = { x: pos.x, y: pos.y };
      canvas.style.cursor = 'grabbing';
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const pos = getCanvasCoords(e);
    if (isDragging && userZoom > 1.0) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag = true;
      panX += dx;
      panY += dy;
      dragStart = { x: pos.x, y: pos.y };
      buildLayout();
      return;
    }
    handlePointerMove(e);
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = userZoom > 1.0 ? 'grab' : 'default';
  });

  canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    hoveredPlot = null;
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('click', (e) => {
    if (didDrag) {
      didDrag = false;
      return;
    }
    handlePointerClick(e);
  });

  // Touch Handling: 1-finger touch scrolls webpage naturally; 2-finger pinch zooms map
  let touchStartDist = 0;
  let startPinchZoom = 1.0;

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      startPinchZoom = userZoom;
    } else if (e.touches.length === 1 && userZoom > 1.0) {
      isDragging = true;
      didDrag = false;
      const pos = getCanvasCoords(e);
      dragStart = { x: pos.x, y: pos.y };
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      if (e.cancelable) e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchStartDist > 0) {
        const factor = currentDist / touchStartDist;
        const newZoom = Math.min(3.5, Math.max(0.6, startPinchZoom * factor));
        if (newZoom !== userZoom) {
          userZoom = newZoom;
          if (userZoom <= 1.0) { panX = 0; panY = 0; }
          buildLayout();
        }
      }
    } else if (e.touches.length === 1 && isDragging && userZoom > 1.0) {
      const pos = getCanvasCoords(e);
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag = true;
      if (e.cancelable) e.preventDefault();
      panX += dx;
      panY += dy;
      dragStart = { x: pos.x, y: pos.y };
      buildLayout();
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      touchStartDist = 0;
    }
    isDragging = false;
  }, { passive: true });

  const filterBtns = document.querySelectorAll('.plot-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.size) { activeFilterSize = btn.dataset.size; activeFilterStatus = 'all'; }
      else if (btn.dataset.status) { activeFilterStatus = btn.dataset.status; activeFilterSize = 'all'; }
    });
  });

  function openPlotModal(p) {
    const existing = document.getElementById('plot-inspect-modal');
    if (existing) existing.remove();

    const statusBg = p.status === 'corner' ? '#fef3c7' : (p.status === 'booked' ? '#fee2e2' : '#d1fae5');
    const statusColor = p.status === 'corner' ? '#b45309' : (p.status === 'booked' ? '#991b1b' : '#065f46');
    const statusText = p.status === 'corner' ? '★ Premium Corner Plot' : (p.status === 'booked' ? '🔴 Reserved / Booked' : '🟢 Available for Booking');

    const bookBtn = p.status !== 'booked'
      ? `<button class="btn-gold" style="width:100%;justify-content:center;padding:0.85rem;font-size:0.88rem;font-weight:700;" onclick="window.openKycModal('${p.num}', '${p.sqft}', '${p.price}', ${p.isCorner})"><span class="material-symbols-outlined" style="font-size:20px;">bookmark_add</span> Book ${p.id} (${p.sqft} Sq.Ft) Now</button>`
      : `<button class="btn-outline" style="width:100%;justify-content:center;padding:0.85rem;font-size:0.85rem;opacity:0.6;cursor:not-allowed;" disabled>Plot Already Booked</button>`;

    const modalHTML = `
      <div class="plot-modal-overlay active" id="plot-inspect-modal">
        <div class="plot-modal-card" style="padding:0;overflow:hidden;max-width:550px;">
          <div style="width:100%;height:190px;position:relative;overflow:hidden;">
            <img src="./assets/guru_niwas_colony_no_car.webp" alt="Guru Niwas Colony" style="width:100%;height:100%;object-fit:cover;">
            <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.2));"></div>
            <button id="close-plot-modal-btn" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.9);border:none;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#0f172a;z-index:10;">
              <span class="material-symbols-outlined" style="font-size:18px;">close</span>
            </button>
            <div style="position:absolute;bottom:16px;left:20px;right:20px;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.35rem;">
                <span style="background:${statusBg};color:${statusColor};font-weight:800;font-size:0.68rem;padding:4px 10px;border-radius:9999px;text-transform:uppercase;">
                  ${statusText}
                </span>
              </div>
              <h3 style="font-size:1.6rem;font-weight:800;color:#ffffff;margin:0;">
                ${p.id} — ${p.sqft} Sq.Ft.
              </h3>
            </div>
          </div>

          <div style="padding:1.5rem;">
            <p style="font-size:0.82rem;color:#64748b;margin-bottom:1.25rem;">
              Guru Niwas Colony, Bihta — Swarup Group
            </p>

          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:1.25rem;margin-bottom:1.5rem;display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;">
            <div>
              <div style="font-size:0.68rem;color:#64748b;font-weight:600;text-transform:uppercase;">Plot Dimensions</div>
              <div style="font-size:0.92rem;font-weight:700;color:#0f172a;font-family:monospace;">${p.dims}</div>
            </div>
            <div>
              <div style="font-size:0.68rem;color:#64748b;font-weight:600;text-transform:uppercase;">Facing Direction</div>
              <div style="font-size:0.92rem;font-weight:700;color:#0f172a;">${p.facing}</div>
            </div>
            <div>
              <div style="font-size:0.68rem;color:#64748b;font-weight:600;text-transform:uppercase;">Current Rate</div>
              <div style="font-size:0.85rem;font-weight:700;color:#10b981;">₹1,600 / Sq.Ft.</div>
            </div>
            <div>
              <div style="font-size:0.68rem;color:#64748b;font-weight:600;text-transform:uppercase;">Estimated Total ${p.isCorner ? '<span style="color:#d97706;text-transform:none;">(incl. 10% PLC)</span>' : ''}</div>
              <div style="font-size:1.05rem;font-weight:800;color:#1e3a8a;">${p.price}</div>
            </div>
          </div>
          
          <div style="margin-bottom:1.5rem;">
            <div style="font-size:0.75rem;color:#64748b;font-weight:700;text-transform:uppercase;margin-bottom:0.5rem;">✨ Plot Highlights</div>
            <ul style="margin:0;padding-left:1.2rem;font-size:0.85rem;color:#334155;line-height:1.6;">
              ${p.isCorner ? '<li><strong>Dual Road Access</strong> — Unmatched entry and exit convenience.</li><li><strong>10% Premium Corner Valuation</strong> — Highest appreciation potential.</li>' : '<li><strong>Excellent Proportions</strong> — Perfect 40-ft depth for modern villa construction.</li><li><strong>Direct Connectivity</strong> — Immediate access to the main 25-ft central road.</li>'}
              <li><strong>Secure Investment</strong> — Clear title verified zone.</li>
            </ul>
          </div>

          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            ${bookBtn}
            <button class="btn-outline" style="width:100%;justify-content:center;padding:0.75rem;font-size:0.82rem;" onclick="window.triggerVipModal('Plot ${p.id}', 'Guru Niwas')">
              <span class="material-symbols-outlined" style="font-size:18px;">directions_car</span> Schedule Free Site Visit Cab
            </button>
          </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('close-plot-modal-btn').addEventListener('click', () => { const m = document.getElementById('plot-inspect-modal'); if (m) m.remove(); });
    document.getElementById('plot-inspect-modal').addEventListener('click', (e) => { if (e.target.id === 'plot-inspect-modal') e.target.remove(); });
  }

  function openParkModal(p) {
    const existingPlot = document.getElementById('plot-inspect-modal');
    if (existingPlot) existingPlot.remove();
    const existingPark = document.getElementById('park-inspect-modal');
    if (existingPark) existingPark.remove();

    // High quality 3D render placeholder for park
    const parkImg = "./assets/park_3d_render.webp";

    const modalHTML = `
      <div class="plot-modal-overlay active" id="park-inspect-modal" style="display:flex;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(15,23,42,0.8);z-index:9999;padding:1rem;">
        <div class="plot-modal-card" style="background:#ffffff;border-radius:24px;width:100%;max-width:600px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);position:relative;animation:modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
          <button id="close-park-modal-btn" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.9);border:none;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#0f172a;z-index:10;">
            <span class="material-symbols-outlined" style="font-size:20px;">close</span>
          </button>
          
          <div style="width:100%;height:300px;position:relative;overflow:hidden;">
            <img src="${parkImg}" alt="3D Park Render" style="width:100%;height:100%;object-fit:cover;">
            <div style="position:absolute;bottom:0;left:0;right:0;height:120px;background:linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
            <div style="position:absolute;bottom:20px;left:24px;color:#ffffff;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.25rem;">
                <span style="background:#22c55e;color:#ffffff;font-weight:800;font-size:0.7rem;padding:4px 10px;border-radius:9999px;text-transform:uppercase;">
                  Lush Greenery
                </span>
                <span style="background:rgba(255,255,255,0.2);backdrop-filter:blur(4px);color:#ffffff;font-weight:800;font-size:0.7rem;padding:4px 10px;border-radius:9999px;text-transform:uppercase;">
                  3D Render
                </span>
              </div>
              <h3 style="font-size:1.8rem;font-weight:800;margin:0;">${p.id}</h3>
            </div>
          </div>

          <div style="padding:1.5rem 1.5rem 2rem 1.5rem;">
            <p style="font-size:0.95rem;color:#475569;margin-bottom:1.5rem;line-height:1.6;">
              ${p.desc} This premium green zone is designed to offer a tranquil, resort-like atmosphere within Guru Niwas Colony. 
            </p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
              <div style="display:flex;align-items:center;gap:12px;background:#f8fafc;padding:1rem;border-radius:12px;border:1px solid #e2e8f0;">
                 <span class="material-symbols-outlined" style="color:#10b981;font-size:24px;">park</span>
                 <div>
                    <div style="font-size:0.7rem;color:#64748b;font-weight:700;text-transform:uppercase;">Nature</div>
                    <div style="font-size:0.9rem;font-weight:700;color:#0f172a;">Manicured Lawns</div>
                 </div>
              </div>
              <div style="display:flex;align-items:center;gap:12px;background:#f8fafc;padding:1rem;border-radius:12px;border:1px solid #e2e8f0;">
                 <span class="material-symbols-outlined" style="color:#3b82f6;font-size:24px;">wb_sunny</span>
                 <div>
                    <div style="font-size:0.7rem;color:#64748b;font-weight:700;text-transform:uppercase;">Atmosphere</div>
                    <div style="font-size:0.9rem;font-weight:700;color:#0f172a;">Fresh & Serene</div>
                 </div>
              </div>
            </div>

            <button class="btn-gold" style="width:100%;justify-content:center;padding:0.85rem;font-size:0.9rem;font-weight:700;" onclick="window.triggerVipModal();">
              <span class="material-symbols-outlined" style="font-size:20px;">nature_people</span> Schedule a Site Visit
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('close-park-modal-btn').addEventListener('click', () => { const m = document.getElementById('park-inspect-modal'); if (m) m.remove(); });
    document.getElementById('park-inspect-modal').addEventListener('click', (e) => { if (e.target.id === 'park-inspect-modal') e.target.remove(); });
  }

  function drawRect(x, y, w, h, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.rect(offsetX + x * scale, offsetY + y * scale, w * scale, h * scale);
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1 * scale;
      ctx.stroke();
    }
  }
  
  function drawPoly(points, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(offsetX + points[0].x * scale, offsetY + points[0].y * scale);
    for(let i=1; i<points.length; i++) {
      ctx.lineTo(offsetX + points[i].x * scale, offsetY + points[i].y * scale);
    }
    ctx.closePath();
    ctx.fill();
    if(stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1 * scale;
      ctx.stroke();
    }
  }

  function drawText(txt, x, y, size, fill, bold, rot=0) {
    ctx.save();
    ctx.translate(offsetX + x * scale, offsetY + y * scale);
    if(rot) ctx.rotate(rot);
    ctx.fillStyle = fill;
    ctx.font = (bold ? 'bold ' : '') + (size * scale) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, 0, 0);
    ctx.restore();
  }

  function drawCircle(x, y, r, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(offsetX + x * scale, offsetY + y * scale, r * scale, 0, Math.PI * 2);
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1 * scale;
      ctx.stroke();
    }
  }

  function drawMasterplan() {
    ctx.clearRect(0, 0, width, height);

    // BACKGROUND: Premium Architectural Off-White Slate
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    // Subtle architectural grid pattern
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
    ctx.lineWidth = 0.8 * scale;
    for(let i=0; i<width; i+=30*scale) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }
    for(let i=0; i<height; i+=30*scale) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    // ── GREEN AREAS (PARKS) ──
    // Top Left Green Area (Above H-Road)
    drawPoly([
      {x: -360, y: 0},
      {x: -680, y: 0},
      {x: -660, y: 200},
      {x: -640, y: 360},
      {x: -360, y: 360}
    ], '#10b981', '#047857');
    
    // Green Area (Entire Bottom Left Open Land)
    drawPoly([
      {x: -360, y: 385},
      {x: -640, y: 385},
      {x: -590, y: 750},
      {x: -360, y: 750}
    ], '#6ee7b7', '#047857');

    // Bottom Left Park (Corner near Plot 319)
    drawRect(-480, 385, 120, 140, '#10b981', '#047857');
    
    // Inner Park Rectangle inside Bottom Left Park
    drawRect(-460, 400, 80, 70, '#059669', '#047857');
    drawText('CENTRAL PARK & GAZEBO', -420, 440, 9, '#ffffff', true);

    // Gazebo (near the corner)
    drawCircle(-420, 495, 18, '#ffffff', '#dc2626');
    drawCircle(-420, 495, 10, '#fca5a5', '#dc2626');

    // Middle Park (between top 8 plots and bottom 8 plots in Col E & F)
    drawRect(260, 120, 80, 120, '#10b981', '#047857');
    drawText('TEMPLE & PARK VIEW', 300, 180, 10, '#ffffff', true);
    
    // Community Area (right side of 25' horizontal road)
    drawRect(670, 320, 30, 40, '#10b981', '#047857');
    drawText('COMMUNITY', 685, 334, 4.5, '#ffffff', true);
    drawText('AREA', 685, 344, 4.5, '#ffffff', true);

    // Proposed Area (Top Right)
    drawRect(400, 0, 290, 320, '#a7f3d0', '#047857');
    drawText('PROPOSED PHASE 2 AREA', 545, 160, 18, '#065f46', true);

    // Proposed Area (Below Vertical Blocks)
    drawRect(-340, 655, 730, 95, '#a7f3d0', '#047857');

    // Proposed Area (Below Right Wing)
    drawRect(390, 425, 300, 325, '#a7f3d0', '#047857');

    // ── HIGHWAYS & OUTER ROADS ──
    // Left Highway
    drawPoly([
      {x: -800, y: -50},
      {x: -700, y: -50},
      {x: -600, y: 800},
      {x: -700, y: 800}
    ], '#0f172a', '#020617');
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5 * scale;
    ctx.setLineDash([15 * scale, 15 * scale]);
    ctx.beginPath();
    ctx.moveTo(offsetX - 750 * scale, offsetY - 50 * scale);
    ctx.lineTo(offsetX - 650 * scale, offsetY + 800 * scale);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.translate(offsetX - 700 * scale, offsetY + 350 * scale);
    ctx.rotate(1.45);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold ' + (10 * scale) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PROPOSED SASARAM - PATNA HIGHWAY ROAD', 0, 0);
    ctx.restore();

    // Helper to draw realistic trees
    const drawNiceTree = (tx, ty, tscale) => {
      ctx.save();
      ctx.translate(offsetX + tx * scale, offsetY + ty * scale);
      ctx.scale(tscale * scale, tscale * scale);
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); ctx.ellipse(2, 5, 8, 4, 0, 0, Math.PI * 2); ctx.fill();

      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-2, 0, 4, 8);

      // Leaves
      ctx.fillStyle = '#065f46'; ctx.beginPath(); ctx.arc(0, -6, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(-2, -8, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#34d399'; ctx.beginPath(); ctx.arc(-4, -10, 6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    // Trees along Sasaram - Patna Highway
    for (let i = 0; i <= 20; i++) {
        let t = i / 20;
        let lx = -800 + (t * 100);
        let ly = -50 + (t * 850);
        let rx = -700 + (t * 100);
        let ry = -50 + (t * 850);
        
        drawNiceTree(lx - 15, ly, 1.2);
        drawNiceTree(rx + 15, ry, 1.2);
    }

    // Bottom Bypass & Nahar Road
    drawRect(-600, 750, 1350, 30, '#b45309', '#78350f');
    drawText('PROPOSED BYPASS ROAD', 350, 765, 12, '#ffffff', true);
    drawRect(-600, 780, 1350, 20, '#0f172a', '#020617');
    
    // ── INTERNAL ROADS ──
    const roadColor = '#1e293b';
    // Main Horizontal 25' Road
    drawRect(-650, 360, 1370, 25, roadColor);
    drawText("25'-0\" WIDE ROAD", 450, 372.5, 9, '#f8fafc', true);

    // Vertical Roads (V-3 to V5)
    drawRect(-360, 0, 20, 745, roadColor); // V-3
    drawRect(-260, 0, 20, 745, roadColor); // V-2
    drawRect(-160, 0, 20, 745, roadColor); // V-1
    drawRect(-60, 0, 20, 745, roadColor); // V0
    drawRect(40, 0, 20, 745, roadColor); // V1
    drawRect(140, 0, 20, 745, roadColor); // V2
    drawRect(240, 0, 20, 745, roadColor); // V3
    drawRect(340, 0, 20, 745, roadColor); // V4
    drawRect(690, -50, 30, 800, roadColor); // V5 (Main Entrance Road)

    drawText("20'-0\" WIDE ROAD", -350, 200, 8, '#f8fafc', true, -Math.PI/2);
    drawText("20'-0\" WIDE ROAD", -250, 200, 8, '#f8fafc', true, -Math.PI/2);
    drawText("20'-0\" WIDE ROAD", -150, 200, 8, '#f8fafc', true, -Math.PI/2);
    drawText("20'-0\" WIDE ROAD", -50, 200, 8, '#f8fafc', true, -Math.PI/2);
    drawText("20'-0\" WIDE ROAD", 50, 200, 8, '#f8fafc', true, -Math.PI/2);
    drawText("20'-0\" WIDE ROAD", 150, 200, 8, '#f8fafc', true, -Math.PI/2);
    drawText("20'-0\" WIDE ROAD", 250, 200, 8, '#f8fafc', true, -Math.PI/2);
    drawText("20'-0\" WIDE ROAD", 350, 200, 8, '#f8fafc', true, -Math.PI/2);
    drawText("30'-0\" WIDE ROAD", 705, 350, 10, '#f8fafc', true, -Math.PI/2);

    // Road dashed lines
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2 * scale;
    ctx.setLineDash([10 * scale, 10 * scale]);
    // Horizontal dashes
    ctx.beginPath(); ctx.moveTo(offsetX - 650 * scale, offsetY + 372.5 * scale); ctx.lineTo(offsetX + 720 * scale, offsetY + 372.5 * scale); ctx.stroke();
    // Vertical dashes
    [-350, -250, -150, -50, 50, 150, 250, 350, 705].forEach((rx, idx) => {
      ctx.beginPath();
      ctx.moveTo(offsetX + rx * scale, offsetY - (idx===8 ? 50 : 0) * scale);
      ctx.lineTo(offsetX + rx * scale, offsetY + (idx===8 ? 750 : 745) * scale);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    // Draw yellow roundabouts at intersections of Main H-Road and V-Roads
    [-350, -250, -150, -50, 50, 150, 250, 350].forEach(rx => {
       drawCircle(rx, 372.5, 6, '#fef08a', '#d97706');
       drawCircle(rx, 372.5, 2, '#b45309', null);
    });
    ctx.setLineDash([]);

    // ── ENTRANCE GATE ──
    drawRect(680, 730, 50, 20, '#0284c7', '#0369a1');
    drawText('MAIN ENTRANCE GATE', 705, 740, 5.5, '#ffffff', true);

    // ── PLOTS ──
    plots.forEach(p => {
      let isDimmed = false;
      if (activeFilterSize !== 'all' && String(p.sqft) !== activeFilterSize) isDimmed = true;
      if (activeFilterStatus === 'corner' && !p.isCorner) isDimmed = true;
      if (activeFilterStatus === 'available' && p.status !== 'available') isDimmed = true;
      if (activeFilterStatus === 'booked' && p.status !== 'booked') isDimmed = true;

      ctx.save();
      ctx.globalAlpha = isDimmed ? 0.25 : 1.0;

      const isHovered = hoveredPlot && hoveredPlot.num === p.num;
      const isSelected = selectedPlot && selectedPlot.num === p.num;

      let fill = '#ffffff';
      let stroke = '#94a3b8';
      let textCol = '#334155';
      
      if (p.isCorner) {
        fill = '#fef3c7'; // Rich Champagne Amber Gold for Corner plots
        stroke = '#d97706';
        textCol = '#78350f';
      } else if (p.sqft === 1200 || p.sqft === 1600) {
        fill = '#e0f2fe'; // Sleek Sapphire Sky Blue for 1200 sqft plots
        stroke = '#0284c7';
        textCol = '#0369a1';
      } else if (p.sqft === 900) {
        fill = '#f3e8ff'; // Luxury Orchid Violet for 900 sqft plots
        stroke = '#9333ea';
        textCol = '#581c87';
      } else {
        fill = '#dcfce7'; // Emerald Soft Green
        stroke = '#16a34a';
        textCol = '#14532d';
      }

      // Show RED fill only when booked plot is clicked, hovered, or Booked filter is active
      const isBookedHighlight = (p.status === 'booked') && (isHovered || isSelected || activeFilterStatus === 'booked');
      if (isBookedHighlight) {
        fill = '#ef4444';
        stroke = '#991b1b';
        textCol = '#ffffff';
      }

      if (isHovered || isSelected) {
        stroke = isBookedHighlight ? '#7f1d1d' : '#0f172a';
        ctx.shadowColor = isBookedHighlight ? 'rgba(239, 68, 68, 0.6)' : 'rgba(15, 23, 42, 0.35)';
        ctx.shadowBlur = 14 * scale;
      } else {
        ctx.shadowColor = 'rgba(0,0,0,0.06)';
        ctx.shadowBlur = 4 * scale;
      }

      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = (isHovered || isSelected ? 2.5 : 1.5) * scale;
      ctx.beginPath();
      ctx.rect(p.x, p.y, p.w, p.h);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = textCol;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let baseFontSizeNum = 8;
      let baseFontSizeSqft = 6;
      if (p.vw < 30 || p.vh < 30) { baseFontSizeNum = 7; baseFontSizeSqft = 5; }

      ctx.font = 'bold ' + (baseFontSizeNum * scale) + 'px sans-serif';
      ctx.fillText(p.num, p.x + p.w / 2, p.y + p.h / 2 - 4 * scale);
      ctx.font = '600 ' + (baseFontSizeSqft * scale) + 'px sans-serif';
      ctx.fillText(p.sqft, p.x + p.w / 2, p.y + p.h / 2 + 5 * scale);
      
      if (p.isCorner && p.status !== 'booked' && !isHovered && !isSelected) {
          ctx.fillStyle = '#d97706';
          ctx.font = (7 * scale) + 'px sans-serif';
          ctx.fillText('★', p.x + 6 * scale, p.y + 6 * scale);
      }

      ctx.restore();
    });

    // Title text top right
    drawText('GURU NIWAS COLONY', 450, -35, 24, '#b91c1c', true);
    drawText('Building Your Dreams', 450, -15, 12, '#2563eb', false);

    if (isGuruNiwasVisible) {
      guruAnimId = requestAnimationFrame(drawMasterplan);
    }
  }

  let isGuruNiwasVisible = false;
  let guruAnimId = null;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isGuruNiwasVisible = entry.isIntersecting;
        if (isGuruNiwasVisible && !guruAnimId) {
          guruAnimId = requestAnimationFrame(drawMasterplan);
        } else if (!isGuruNiwasVisible && guruAnimId) {
          cancelAnimationFrame(guruAnimId);
          guruAnimId = null;
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  } else {
    isGuruNiwasVisible = true;
    drawMasterplan();
  }
}

function initRoyalGardenMasterplanCanvas() {
  const canvas = document.getElementById('royal-garden-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;
  let width, height;

  let activeFilterSize = 'all';
  let activeFilterStatus = 'all';
  let hoveredPlot = null;
  let selectedPlot = null;

  const rgPlotConfigs = [];
  const scaledRgPlots = [];

  function addRgPlot(id, sqft, dims, facing, vx, vy, vw, vh, isCorner = false) {
    let rate = 1450;
    if (isCorner) rate *= 1.1;
    let isBooked = isPlotBooked(id);
    let status = isBooked ? 'booked' : (isCorner ? 'corner' : 'available');

    rgPlotConfigs.push({
      id: id,
      num: id,
      sqft: sqft,
      dims: dims,
      facing: facing,
      price: "₹" + (sqft * rate / 100000).toFixed(2) + " Lakh",
      status: status,
      isCorner: isCorner,
      vx: vx,
      vy: vy,
      vw: vw,
      vh: vh
    });
  }

  // ── 1. FRONT TOP BLOCK A PLOTS ──
  addRgPlot('A-1', 1585.8, "40' × 40'", 'North Facing', 580, 40, 40, 35, true);
  addRgPlot('A-2', 1585.8, "40' × 40'", 'North Facing', 535, 40, 40, 35);
  addRgPlot('A-3', 1350, "35' × 38'", 'North Facing', 495, 40, 35, 35);
  addRgPlot('A-4', 1500, "38' × 40'", 'North Facing', 450, 40, 40, 35);
  addRgPlot('A-5', 2000, "50' × 40'", 'North Facing', 395, 40, 50, 35, true);

  addRgPlot('B-1', 1337.4, "35' × 38'", 'South Facing', 580, 80, 40, 35, true);
  addRgPlot('B-2', 1337.4, "35' × 38'", 'South Facing', 535, 80, 40, 35);
  addRgPlot('B-3', 1055.2, "30' × 35'", 'South Facing', 495, 80, 35, 35);
  addRgPlot('B-4', 1485, "38' × 39'", 'South Facing', 450, 80, 40, 35);

  // ── 2. BLOCK C TOP ──
  addRgPlot('C-1', 2060, "50' × 41'", 'South Facing', 555, 140, 55, 40, true);
  addRgPlot('C-2', 2200, "55' × 40'", 'South Facing', 495, 140, 55, 40);
  addRgPlot('C-3', 1615.5, "40' × 40'", 'South Facing', 450, 140, 40, 40);
  addRgPlot('C-4', 1615.5, "40' × 40'", 'South Facing', 405, 140, 40, 40);

  // ── 3. BLOCK E (EAST STRIP NEAR MAIN ROAD BIHTA-PATNA) ──
  for (let i = 1; i <= 10; i++) {
    addRgPlot('E-' + i, 1050, "30' × 35'", 'West Facing', 685, 130 + (i - 1) * 35, 35, 32, i === 1 || i === 10);
  }
  const bEastSqft = [854, 1076, 1120, 1120, 1095, 1085, 1075, 1065, 1055, 1040, 1030, 1020, 1005, 1015];
  for (let i = 87; i <= 100; i++) {
    let idx = i - 87;
    addRgPlot('B-' + i, bEastSqft[idx] || 1050, "30' × 35'", 'East Facing', 635, 130 + idx * 25, 35, 23, i === 87 || i === 100);
  }

  // ── 4. BLOCK D CENTRAL GRID (1200 SQFT PLOTS) ──
  // Double Column 1 (D-4 to D-18)
  for (let i = 4; i <= 18; i++) {
    let isEast = i <= 10;
    let x = isEast ? 555 : 515;
    let yIdx = isEast ? (i - 4) : (i - 11);
    addRgPlot('D-' + i, 1200, "30' × 40'", isEast ? 'East Facing' : 'West Facing', x, 300 + yIdx * 30, 35, 27, i === 4 || i === 18);
  }
  // Double Column 2 (D-19 to D-31)
  for (let i = 19; i <= 31; i++) {
    let isEast = i <= 24;
    let x = isEast ? 465 : 425;
    let yIdx = isEast ? (i - 19) : (i - 25);
    addRgPlot('D-' + i, 1200, "30' × 40'", isEast ? 'East Facing' : 'West Facing', x, 300 + yIdx * 30, 35, 27, i === 19 || i === 31);
  }
  // Double Column 3 (D-32 to D-45)
  for (let i = 32; i <= 45; i++) {
    let isEast = i <= 38;
    let x = isEast ? 375 : 335;
    let yIdx = isEast ? (i - 32) : (i - 39);
    addRgPlot('D-' + i, 1200, "30' × 40'", isEast ? 'East Facing' : 'West Facing', x, 300 + yIdx * 30, 35, 27, i === 32 || i === 45);
  }

  // ── 5. MIDDLE LEFT BLOCK B & C PLOTS ──
  addRgPlot('B-5', 2400, "40' × 60'", 'West Facing', 315, 140, 40, 50, true);
  addRgPlot('B-6', 2100, "35' × 60'", 'West Facing', 315, 195, 40, 45);
  addRgPlot('B-7', 1500, "30' × 50'", 'West Facing', 315, 245, 40, 35);
  addRgPlot('B-8', 1500, "30' × 50'", 'West Facing', 315, 285, 40, 35);
  addRgPlot('B-9', 1800, "30' × 60'", 'West Facing', 315, 325, 40, 40);
  addRgPlot('B-10', 1500, "30' × 50'", 'West Facing', 315, 370, 40, 35);
  addRgPlot('B-11', 1800, "30' × 60'", 'West Facing', 315, 410, 40, 40, true);

  // Far Left Row (B-71 to B-86)
  const bLeftSqft = [1354, 2260, 1590, 1590, 1721, 1329, 2217, 1560, 1560, 1700, 1444, 1278, 1145, 1549, 868, 856];
  for (let i = 71; i <= 86; i++) {
    let idx = i - 71;
    addRgPlot('B-' + i, bLeftSqft[idx] || 1500, "30' × 50'", 'West Facing', 120, 140 + idx * 30, 40, 26, i === 71 || i === 86);
  }

  // Middle Block C
  addRgPlot('C-5', 2860, "50' × 57'", 'East Facing', 260, 280, 45, 45);
  addRgPlot('C-6', 2305, "45' × 51'", 'East Facing', 260, 330, 45, 40);
  addRgPlot('C-7', 3000, "50' × 60'", 'East Facing', 260, 375, 45, 50);
  addRgPlot('C-8', 2200, "40' × 55'", 'East Facing', 260, 430, 45, 40);

  // Lower Left Block B (B-52 to B-58)
  addRgPlot('B-52', 1912, "40' × 48'", 'South Facing', 120, 660, 40, 35, true);
  addRgPlot('B-53', 2270, "45' × 50'", 'South Facing', 165, 660, 45, 35);
  addRgPlot('B-54', 2016, "40' × 50'", 'South Facing', 215, 660, 40, 35);
  addRgPlot('B-55', 2325, "45' × 50'", 'South Facing', 260, 660, 45, 35);
  addRgPlot('B-56', 2295, "45' × 50'", 'South Facing', 310, 660, 45, 35);
  addRgPlot('B-57', 2265, "45' × 50'", 'South Facing', 360, 660, 45, 35);
  addRgPlot('B-58', 4043, "60' × 67'", 'South Facing', 410, 660, 55, 35, true);

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  const vMinX = 50;
  const vMaxX = 900;
  const vMinY = -60;
  const vMaxY = 750;
  const vWidth = vMaxX - vMinX;
  const vHeight = vMaxY - vMinY;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = (canvas.parentElement && canvas.parentElement.clientWidth) ? canvas.parentElement.clientWidth : (window.innerWidth - 40);
    if (!width || width < 300) width = Math.min(window.innerWidth - 32, 1400);
    height = 720;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    buildLayout();
  }

  function buildLayout() {
    scaledRgPlots.length = 0;
    const padding = 20;
    const availW = width - padding * 2;
    const availH = height - padding * 2;

    scale = Math.min(availW / vWidth, availH / vHeight);
    offsetX = (width - vWidth * scale) / 2 - (vMinX * scale);
    offsetY = (height - vHeight * scale) / 2 - (vMinY * scale);

    rgPlotConfigs.forEach(cfg => {
      scaledRgPlots.push({
        ...cfg,
        x: offsetX + cfg.vx * scale,
        y: offsetY + cfg.vy * scale,
        w: cfg.vw * scale,
        h: cfg.vh * scale
      });
    });
  }

  window.addEventListener('resize', resize);
  resize();

  // Filters
  document.querySelectorAll('.rg-plot-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.rg-plot-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.size) {
        activeFilterSize = btn.dataset.size;
        activeFilterStatus = 'all';
      }
      if (btn.dataset.status) {
        activeFilterStatus = btn.dataset.status;
        activeFilterSize = 'all';
      }
    });
  });

  // Mouse interaction
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    let found = null;
    scaledRgPlots.forEach(p => {
      if (pos.x >= p.x && pos.x <= p.x + p.w && pos.y >= p.y && pos.y <= p.y + p.h) found = p;
    });
    hoveredPlot = found;
    canvas.style.cursor = found ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseleave', () => { hoveredPlot = null; });

  canvas.addEventListener('click', () => {
    if (hoveredPlot) {
      selectedPlot = hoveredPlot;
      if (typeof window.openRoyalGardenPlotModal === 'function') {
        window.openRoyalGardenPlotModal(hoveredPlot);
      }
    }
  });

  window.openRoyalGardenPlotModal = function openRoyalGardenPlotModal(p) {
    const existing = document.getElementById('plot-inspect-modal');
    if (existing) existing.remove();

    const statusBadge = p.status === 'booked' 
      ? '<span style="background:#ef4444;color:#fff;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">🔴 Booked</span>'
      : (p.isCorner 
          ? '<span style="background:#f59e0b;color:#fff;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">★ Corner Plot</span>'
          : '<span style="background:#10b981;color:#fff;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">🟢 Available</span>');

    const modalHTML = `
      <div class="plot-modal-overlay active" id="plot-inspect-modal" style="display:flex;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(15,23,42,0.8);z-index:9999;padding:1rem;">
        <div class="plot-modal-card" style="background:#ffffff;border-radius:24px;max-width:480px;width:100%;overflow:hidden;position:relative;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          <button id="close-modal-btn" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.9);border:none;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#0f172a;z-index:10;">
            <span class="material-symbols-outlined">close</span>
          </button>
          
          <div style="background:linear-gradient(135deg, #1e3a8a, #0f172a);padding:2rem 1.5rem;color:#fff;">
            <div style="font-size:0.75rem;letter-spacing:1px;color:#f59e0b;font-weight:700;margin-bottom:0.5rem;text-transform:uppercase;">
              Royal Garden (Painathi Bihta-Patna Highway)
            </div>
            <h2 style="font-size:1.8rem;margin:0 0 0.5rem 0;font-weight:800;">Plot ${p.id}</h2>
            <div style="display:flex;gap:8px;align-items:center;">${statusBadge}</div>
          </div>

          <div style="padding:1.5rem;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
              <div style="background:#f8fafc;padding:0.75rem;border-radius:12px;border:1px solid #e2e8f0;">
                <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Plot Area</div>
                <div style="font-size:1.1rem;font-weight:800;color:#0f172a;">${p.sqft} Sq.Ft</div>
              </div>
              <div style="background:#f8fafc;padding:0.75rem;border-radius:12px;border:1px solid #e2e8f0;">
                <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Dimensions</div>
                <div style="font-size:1.1rem;font-weight:800;color:#0f172a;">${p.dims}</div>
              </div>
              <div style="background:#f8fafc;padding:0.75rem;border-radius:12px;border:1px solid #e2e8f0;">
                <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Facing</div>
                <div style="font-size:1.1rem;font-weight:800;color:#0f172a;">${p.facing}</div>
              </div>
              <div style="background:#f8fafc;padding:0.75rem;border-radius:12px;border:1px solid #e2e8f0;">
                <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Est. Price</div>
                <div style="font-size:1.1rem;font-weight:800;color:#1e3a8a;">${p.price}</div>
              </div>
            </div>

            <button class="btn-gold" style="width:100%;justify-content:center;padding:0.85rem;font-size:0.9rem;font-weight:700;" onclick="window.triggerVipModal();">
              <span class="material-symbols-outlined">key</span> Book Plot ${p.id} Now
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('close-modal-btn').addEventListener('click', () => {
      const m = document.getElementById('plot-inspect-modal');
      if (m) m.remove();
    });
  }

  function drawRect(x, y, w, h, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.rect(offsetX + x * scale, offsetY + y * scale, w * scale, h * scale);
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1 * scale;
      ctx.stroke();
    }
  }

  function drawText(txt, x, y, size, fill, bold, rot=0) {
    ctx.save();
    ctx.translate(offsetX + x * scale, offsetY + y * scale);
    if(rot) ctx.rotate(rot);
    ctx.fillStyle = fill;
    ctx.font = (bold ? 'bold ' : '') + (size * scale) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, 0, 0);
    ctx.restore();
  }

  function drawRoyalGardenMasterplan() {
    ctx.clearRect(0, 0, width, height);

    // Silver background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 1 * scale;
    for(let i=0; i<width; i+=40*scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for(let i=0; i<height; i+=40*scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

    // ── MAIN ROAD BIHTA - PATNA (Highway on Right side) ──
    drawRect(760, -60, 100, 850, '#1e293b', '#0f172a');
    ctx.save();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2 * scale;
    ctx.setLineDash([15 * scale, 15 * scale]);
    ctx.beginPath();
    ctx.moveTo(offsetX + 810 * scale, offsetY - 60 * scale);
    ctx.lineTo(offsetX + 810 * scale, offsetY + 790 * scale);
    ctx.stroke();
    ctx.restore();
    drawText('MAIN ROAD BIHTA - PATNA', 810, 350, 12, '#ffffff', true, Math.PI/2);

    // Roundabout at Bihta - Sarmera Road
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(offsetX + 810 * scale, offsetY - 20 * scale, 35 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(offsetX + 810 * scale, offsetY - 20 * scale, 18 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Bihta - Sarmera Road
    drawRect(720, -50, 90, 20, '#1e293b');
    drawText('BIHTA - SARMERA ROAD', 740, -40, 6, '#ffffff', true);

    // PROPOSED KANHAULI BUS STAND (Top Right)
    drawRect(640, -50, 120, 45, '#3b82f6', '#1d4ed8');
    drawText('PROPOSED KANHAULI', 700, -35, 7, '#ffffff', true);
    drawText('BUS STAND', 700, -22, 7, '#ffffff', true);

    // ── ROADS & APPROACHES ──
    const roadCol = '#334155';
    // 30'-0" Wide Road (Main Entrance at Top)
    drawRect(120, 0, 640, 30, roadCol);
    drawText("30'-0\" WIDE ROAD", 440, 15, 9, '#fef08a', true);
    drawRect(120, 95, 640, 25, roadCol);
    drawText("30'-0\" WIDE ROAD", 440, 107.5, 9, '#fef08a', true);

    // 17'-0" Internal Roads
    drawRect(120, 250, 560, 20, roadCol);
    drawRect(120, 450, 560, 20, roadCol);
    drawRect(120, 625, 560, 20, roadCol);
    drawText("17'-0\" WIDE ROAD", 350, 260, 7, '#e2e8f0', false);
    drawText("17'-0\" WIDE ROAD", 350, 460, 7, '#e2e8f0', false);
    drawText("17'-0\" WIDE ROAD", 350, 635, 7, '#e2e8f0', false);

    // Vertical 17' Roads
    drawRect(220, 120, 20, 525, roadCol);
    drawRect(395, 270, 20, 375, roadCol);
    drawRect(495, 270, 20, 375, roadCol);
    drawRect(595, 120, 20, 525, roadCol);
    drawText("17'-0\" WIDE ROAD", 230, 380, 7, '#e2e8f0', false, -Math.PI/2);
    drawText("17'-0\" WIDE ROAD", 605, 380, 7, '#e2e8f0', false, -Math.PI/2);

    // ── FUTURE EXTENSION ──
    drawRect(175, 140, 75, 300, '#86efac', '#166534');
    drawText('FUTURE EXTENSION', 212.5, 290, 12, '#14532d', true, -Math.PI/2);

    // ── COMPASS ROSE (Top Left) ──
    drawText('N', -10, -40, 14, '#b91c1c', true);
    drawText('S', -10, 30, 10, '#64748b', true);
    drawText('W', -45, -5, 10, '#64748b', true);
    drawText('E', 25, -5, 10, '#64748b', true);

    // ── RENDER PLOTS ──
    scaledRgPlots.forEach(p => {
      let isDimmed = false;
      if (activeFilterSize !== 'all') {
        if (activeFilterSize === '1050' && p.sqft > 1100) isDimmed = true;
        if (activeFilterSize === '1200' && (p.sqft < 1150 || p.sqft > 1300)) isDimmed = true;
        if (activeFilterSize === '1500' && p.sqft < 1400) isDimmed = true;
      }
      if (activeFilterStatus === 'corner' && !p.isCorner) isDimmed = true;
      if (activeFilterStatus === 'available' && p.status !== 'available') isDimmed = true;
      if (activeFilterStatus === 'booked' && p.status !== 'booked') isDimmed = true;

      ctx.save();
      ctx.globalAlpha = isDimmed ? 0.3 : 1.0;

      const isHovered = hoveredPlot && hoveredPlot.id === p.id;
      const isSelected = selectedPlot && selectedPlot.id === p.id;

      let fill = '#ffffff';
      let stroke = '#94a3b8';
      let textCol = '#1e293b';

      if (p.status === 'booked') { fill = '#fef2f2'; stroke = '#ef4444'; textCol = '#b91c1c'; }
      else if (p.isCorner) { fill = '#fffbeb'; stroke = '#f59e0b'; textCol = '#92400e'; }

      if (isHovered || isSelected) {
        fill = '#fef3c7';
        stroke = '#d97706';
        textCol = '#78350f';
        ctx.shadowColor = 'rgba(217, 119, 6, 0.5)';
        ctx.shadowBlur = 10 * scale;
      }

      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = (isHovered || isSelected ? 2.5 : 1) * scale;
      ctx.beginPath();
      ctx.rect(p.x, p.y, p.w, p.h);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = textCol;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let baseFontSizeNum = 6.5;
      if (p.w < 25 || p.h < 20) baseFontSizeNum = 5;

      ctx.font = 'bold ' + (baseFontSizeNum * scale) + 'px sans-serif';
      ctx.fillText(p.id, p.x + p.w / 2, p.y + p.h / 2);

      if (p.isCorner && p.status !== 'booked' && !isHovered && !isSelected) {
          ctx.fillStyle = '#d97706';
          ctx.font = (5 * scale) + 'px sans-serif';
          ctx.fillText('★', p.x + 4 * scale, p.y + 4 * scale);
      }

      ctx.restore();
    });

    // Main Header on Canvas Top Left
    drawText('ROYAL GARDEN', 360, -45, 24, '#b91c1c', true);
    if (isRoyalGardenVisible) {
      rgAnimId = requestAnimationFrame(drawRoyalGardenMasterplan);
    }
  }

  let isRoyalGardenVisible = false;
  let rgAnimId = null;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isRoyalGardenVisible = entry.isIntersecting;
        if (isRoyalGardenVisible && !rgAnimId) {
          rgAnimId = requestAnimationFrame(drawRoyalGardenMasterplan);
        } else if (!isRoyalGardenVisible && rgAnimId) {
          cancelAnimationFrame(rgAnimId);
          rgAnimId = null;
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  } else {
    isRoyalGardenVisible = true;
    drawRoyalGardenMasterplan();
  }
}

/* ==========================================
   2. BIHAR REVENUE & DLRS OFFICIAL LAND MEASUREMENT CALCULATOR ENGINE
   ========================================== */
function initCalculator() {
  const customHathInput = document.getElementById('custom-hath-input');
  const laggiPills = document.querySelectorAll('.laggi-pill-btn, .laggi-card-pill');
  const regionSelect = document.getElementById('calc-region-select');
  const formulaLaggiText = document.getElementById('formula-laggi-text');
  const formulaMetricsText = document.getElementById('formula-metrics-text');

  const tabUnit = document.getElementById('calc-tab-unit');
  const tabDims = document.getElementById('calc-tab-dims');
  const panelUnit = document.getElementById('calc-mode-unit-panel');
  const panelDims = document.getElementById('calc-mode-dims-panel');

  const inputVal = document.getElementById('land-input-val');
  const inputUnit = document.getElementById('land-input-unit');

  const dimLength = document.getElementById('plot-dim-length');
  const dimWidth = document.getElementById('plot-dim-width');
  const dimRate = document.getElementById('plot-dim-rate');

  const highlightMain = document.getElementById('calc-highlight-main');
  const highlightSub = document.getElementById('calc-highlight-sub');
  const highlightPrice = document.getElementById('calc-highlight-price');
  const highlightRateText = document.getElementById('calc-highlight-rate-text');

  const resKatha = document.getElementById('res-katha');
  const subKatha = document.getElementById('sub-katha');
  const resDhur = document.getElementById('res-dhur');
  const subDhur = document.getElementById('sub-dhur');
  const resSqkadi = document.getElementById('res-sqkadi');
  const resDecimal = document.getElementById('res-decimal');
  const resSqft = document.getElementById('res-sqft');
  const resGaj = document.getElementById('res-gaj');
  const resBigha = document.getElementById('res-bigha');
  const subBigha = document.getElementById('sub-bigha');
  const resAcre = document.getElementById('res-acre');
  const subAcre = document.getElementById('sub-acre');
  const titleBiswaKanal = document.getElementById('title-biswa-kanal');
  const resBiswa = document.getElementById('res-biswa');
  const subBiswa = document.getElementById('sub-biswa');
  const resSqmeter = document.getElementById('res-sqmeter');
  const subHectare = document.getElementById('sub-hectare');

  if (!inputVal || !highlightMain) return;

  let currentMode = 'unit'; // 'unit' or 'dims'
  let currentHath = 5.5;
  let activeStateMode = 'bihar'; // 'bihar', 'delhi', 'haryana', 'up_pucca', 'up_kachha'

  // Tab switching
  if (tabUnit && tabDims && panelUnit && panelDims) {
    tabUnit.addEventListener('click', () => {
      currentMode = 'unit';
      tabUnit.classList.add('active');
      tabUnit.style.background = '#1e3a8a';
      tabUnit.style.color = '#ffffff';
      tabUnit.style.borderColor = '#1e3a8a';

      tabDims.classList.remove('active');
      tabDims.style.background = '#f8fafc';
      tabDims.style.color = '#475569';
      tabDims.style.borderColor = '#cbd5e1';

      panelUnit.style.display = 'block';
      panelDims.style.display = 'none';
      recalc();
    });

    tabDims.addEventListener('click', () => {
      currentMode = 'dims';
      tabDims.classList.add('active');
      tabDims.style.background = '#1e3a8a';
      tabDims.style.color = '#ffffff';
      tabDims.style.borderColor = '#1e3a8a';

      tabUnit.classList.remove('active');
      tabUnit.style.background = '#f8fafc';
      tabUnit.style.color = '#475569';
      tabUnit.style.borderColor = '#cbd5e1';

      panelDims.style.display = 'block';
      panelUnit.style.display = 'none';
      recalc();
    });
  }

  // Laggi Pill Clicks
  laggiPills.forEach(pill => {
    pill.addEventListener('click', () => {
      laggiPills.forEach(p => {
        p.classList.remove('active');
        p.style.background = '#ffffff';
        p.style.color = '#334155';
        p.style.borderColor = '#cbd5e1';
      });
      pill.classList.add('active');
      pill.style.background = '#1e3a8a';
      pill.style.color = '#ffffff';
      pill.style.borderColor = '#1e3a8a';

      currentHath = parseFloat(pill.getAttribute('data-hath')) || 5.5;
      activeStateMode = 'bihar';
      if (customHathInput) customHathInput.value = currentHath;
      if (regionSelect) {
        for (let opt of regionSelect.options) {
          if (parseFloat(opt.value) === currentHath) {
            opt.selected = true;
            break;
          }
        }
      }
      recalc();
    });
  });

  // Custom Hath Input
  if (customHathInput) {
    customHathInput.addEventListener('input', () => {
      const val = parseFloat(customHathInput.value);
      if (!isNaN(val) && val > 0) {
        currentHath = val;
        activeStateMode = 'bihar';
        laggiPills.forEach(p => {
          if (parseFloat(p.getAttribute('data-hath')) === val) {
            p.classList.add('active');
            p.style.background = '#1e3a8a';
            p.style.color = '#ffffff';
            p.style.borderColor = '#1e3a8a';
          } else {
            p.classList.remove('active');
            p.style.background = '#ffffff';
            p.style.color = '#334155';
            p.style.borderColor = '#cbd5e1';
          }
        });
        recalc();
      }
    });
  }

  // Region preset dropdown
  if (regionSelect) {
    regionSelect.addEventListener('change', () => {
      const val = regionSelect.value;
      if (val === 'delhi_ncr') {
        activeStateMode = 'delhi';
      } else if (val === 'haryana_gurgaon') {
        activeStateMode = 'haryana';
      } else if (val === 'up_pucca') {
        activeStateMode = 'up_pucca';
      } else if (val === 'up_kachha') {
        activeStateMode = 'up_kachha';
      } else if (val === 'jharkhand_ranchi') {
        activeStateMode = 'bihar';
        currentHath = 5.5;
        if (customHathInput) customHathInput.value = 5.5;
      } else {
        activeStateMode = 'bihar';
        currentHath = parseFloat(val) || 5.5;
        if (customHathInput) customHathInput.value = currentHath;
      }

      laggiPills.forEach(p => {
        if (parseFloat(p.getAttribute('data-hath')) === currentHath) {
          p.classList.add('active');
          p.style.background = '#1e3a8a';
          p.style.color = '#ffffff';
          p.style.borderColor = '#1e3a8a';
        } else {
          p.classList.remove('active');
          p.style.background = '#ffffff';
          p.style.color = '#334155';
          p.style.borderColor = '#cbd5e1';
        }
      });
      recalc();
    });
  }

  // Quick Unit Presets
  const presetBtns = document.querySelectorAll('.calc-preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.getAttribute('data-val')) || 1;
      const unit = btn.getAttribute('data-unit') || 'katha';
      if (inputVal) inputVal.value = val;
      if (inputUnit) inputUnit.value = unit;
      recalc();
    });
  });

  // Quick Dimension Presets
  const dimPresetBtns = document.querySelectorAll('.calc-dim-preset-btn');
  dimPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const l = parseFloat(btn.getAttribute('data-l')) || 40;
      const w = parseFloat(btn.getAttribute('data-w')) || 30;
      if (dimLength) dimLength.value = l;
      if (dimWidth) dimWidth.value = w;
      recalc();
    });
  });

  // Event Listeners
  if (inputVal) inputVal.addEventListener('input', recalc);
  if (inputUnit) inputUnit.addEventListener('change', recalc);
  if (dimLength) dimLength.addEventListener('input', recalc);
  if (dimWidth) dimWidth.addEventListener('input', recalc);
  if (dimRate) dimRate.addEventListener('input', recalc);

  // Official Conversion Constants
  // 1 Hath = 1.5 ft = 18 inches
  // 1 Gunter's Chain = 66 ft = 100 Kadi
  // 1 Link/Kadi = 0.66 ft
  // 1 Decimal = 435.6 sqft = 1000 sq kadi = 48.4 sq yards (Gaj)
  // 1 Acre = 100 Decimal = 43560 sqft = 4840 Gaj = 100,000 sq kadi
  const SQFT_PER_GAJ = 9.0;
  const SQFT_PER_DECIMAL = 435.6;
  const SQFT_PER_ACRE = 43560.0;
  const SQFT_PER_SQKADI = 0.4356; // 435.6 / 1000
  const SQFT_PER_SQMETER = 10.7639104;
  const SQFT_PER_HECTARE = 107639.104;

  function getActiveScale() {
    let laggiFeet = currentHath * 1.5;
    let sqftPerDhur = laggiFeet * laggiFeet;
    let sqftPerKatha = sqftPerDhur * 20;
    let sqftPerBigha = sqftPerKatha * 20;
    let sqftPerBiswa = sqftPerKatha;
    let sqftPerKanal = 5445;
    let sqftPerMarla = 272.25;

    if (activeStateMode === 'delhi') {
      sqftPerBiswa = 453.75;
      sqftPerBigha = 9075;
      sqftPerKatha = 453.75;
      sqftPerDhur = 22.6875;
    } else if (activeStateMode === 'haryana') {
      sqftPerMarla = 272.25;
      sqftPerKanal = 5445;
      sqftPerBigha = 43560; // 1 Killa = 1 Acre
      sqftPerKatha = 1361.25;
      sqftPerDhur = 68.0625;
    } else if (activeStateMode === 'up_pucca') {
      sqftPerBiswa = 1361.25;
      sqftPerBigha = 27225;
      sqftPerKatha = 1361.25;
      sqftPerDhur = 68.0625;
    } else if (activeStateMode === 'up_kachha') {
      sqftPerBiswa = 453.75;
      sqftPerBigha = 9075;
      sqftPerKatha = 453.75;
      sqftPerDhur = 22.6875;
    }

    return {
      hath: currentHath,
      laggiFeet,
      sqftPerDhur,
      sqftPerKatha,
      sqftPerBigha,
      sqftPerBiswa,
      sqftPerKanal,
      sqftPerMarla,
      mode: activeStateMode
    };
  }

  function toSqFt(val, unit, scale) {
    switch (unit) {
      case 'katha': return val * scale.sqftPerKatha;
      case 'dhur': return val * scale.sqftPerDhur;
      case 'dhurki': return val * (scale.sqftPerDhur / 20);
      case 'bigha': return val * scale.sqftPerBigha;
      case 'sqkadi': return val * SQFT_PER_SQKADI;
      case 'decimal': return val * SQFT_PER_DECIMAL;
      case 'acre': return val * SQFT_PER_ACRE;
      case 'sqft': return val;
      case 'gaj': return val * SQFT_PER_GAJ;
      case 'biswa': return val * scale.sqftPerBiswa;
      case 'kanal': return val * scale.sqftPerKanal;
      case 'marla': return val * scale.sqftPerMarla;
      case 'sqmeter': return val * SQFT_PER_SQMETER;
      case 'hectare': return val * SQFT_PER_HECTARE;
      default: return val * scale.sqftPerKatha;
    }
  }

  function formatNumber(num, decimals = 2) {
    if (isNaN(num) || num === 0) return '0';
    if (Math.abs(num - Math.round(num)) < 0.0001) return Math.round(num).toLocaleString('en-IN');
    return parseFloat(num.toFixed(decimals)).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
  }

  function formatPriceINR(val) {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹ ${Math.round(val).toLocaleString('en-IN')}`;
  }

  function recalc() {
    const scale = getActiveScale();

    // Update Formula Ribbon
    if (formulaLaggiText) {
      if (scale.mode === 'delhi') {
        formulaLaggiText.textContent = 'दिल्ली मानक (1 बीघा = 20 बिस्वा = 9,075 Sq.Ft = 1008 गज)';
      } else if (scale.mode === 'haryana') {
        formulaLaggiText.textContent = 'हरियाणा मानक (1 किला/एकड़ = 8 कनाल = 160 मरला = 43,560 Sq.Ft)';
      } else if (scale.mode === 'up_pucca') {
        formulaLaggiText.textContent = 'यूपी पक्का बीघा (1 बीघा = 20 बिस्वा = 27,225 Sq.Ft = 3025 गज)';
      } else if (scale.mode === 'up_kachha') {
        formulaLaggiText.textContent = 'यूपी कच्चा बीघा (1 बीघा = 20 बिस्वा = 9,075 Sq.Ft = 1008 गज)';
      } else {
        formulaLaggiText.textContent = `लग्गी = ${scale.hath} हाथ (${scale.laggiFeet.toFixed(2)} फीट) • 1 हाथ = 1.5 ft`;
      }
    }

    if (formulaMetricsText) {
      if (scale.mode === 'haryana') {
        formulaMetricsText.textContent = `1 मरला = 272.25 Sq.Ft • 1 कनाल = 5,445 Sq.Ft (605 गज) • 1 किला = 43,560 Sq.Ft`;
      } else if (scale.mode === 'delhi' || scale.mode === 'up_kachha') {
        formulaMetricsText.textContent = `1 बिस्वा = 453.75 Sq.Ft (50.41 गज) • 1 बीघा = 9,075 Sq.Ft • 1 एकड़ = 4.8 बीघा`;
      } else if (scale.mode === 'up_pucca') {
        formulaMetricsText.textContent = `1 बिस्वा = 1,361.25 Sq.Ft (151.25 गज) • 1 बीघा = 27,225 Sq.Ft • 1 एकड़ = 1.6 बीघा`;
      } else {
        formulaMetricsText.textContent = `1 धूर = ${formatNumber(scale.sqftPerDhur, 2)} Sq.Ft • 1 कट्ठा = ${formatNumber(scale.sqftPerKatha, 2)} Sq.Ft (${formatNumber(scale.sqftPerKatha / 9, 2)} गज) • 1 बीघा = ${formatNumber(scale.sqftPerBigha, 0)} Sq.Ft • 1 एकड़ = ${formatNumber(43560 / scale.sqftPerKatha, 2)} कट्ठा`;
      }
    }

    let totalSqFt = 0;
    let ratePerSqFt = 2600;

    if (currentMode === 'unit') {
      const v = parseFloat(inputVal ? inputVal.value : 1) || 0;
      const u = inputUnit ? inputUnit.value : 'katha';
      totalSqFt = toSqFt(v, u, scale);
      ratePerSqFt = 2600;
    } else {
      const l = parseFloat(dimLength ? dimLength.value : 45) || 0;
      const w = parseFloat(dimWidth ? dimWidth.value : 30.25) || 0;
      totalSqFt = l * w;
      ratePerSqFt = parseFloat(dimRate ? dimRate.value : 2600) || 2600;
    }

    if (totalSqFt <= 0) totalSqFt = 0;

    // Mathematical Conversions
    const katha = totalSqFt / scale.sqftPerKatha;
    const dhur = totalSqFt / scale.sqftPerDhur;
    const sqkadi = totalSqFt / SQFT_PER_SQKADI;
    const decimal = totalSqFt / SQFT_PER_DECIMAL;
    const gaj = totalSqFt / SQFT_PER_GAJ;
    const bigha = totalSqFt / scale.sqftPerBigha;
    const acre = totalSqFt / SQFT_PER_ACRE;
    const biswa = totalSqFt / scale.sqftPerBiswa;
    const kanal = totalSqFt / scale.sqftPerKanal;
    const marla = totalSqFt / scale.sqftPerMarla;
    const sqmeter = totalSqFt / SQFT_PER_SQMETER;
    const hectare = totalSqFt / SQFT_PER_HECTARE;

    // Display in grid cards
    if (resKatha) resKatha.textContent = formatNumber(katha, 3);
    if (subKatha) subKatha.textContent = `1 कट्ठा = ${formatNumber(scale.sqftPerKatha, 2)} Sq.Ft (${formatNumber(scale.sqftPerKatha / 9, 2)} गज)`;

    if (resDhur) resDhur.textContent = formatNumber(dhur, 2);
    if (subDhur) subDhur.textContent = `1 धूर = ${formatNumber(scale.sqftPerDhur, 2)} Sq.Ft (${formatNumber(dhur * 20, 1)} धुरकी)`;

    if (resSqkadi) resSqkadi.textContent = formatNumber(sqkadi, 1);

    if (resDecimal) resDecimal.textContent = formatNumber(decimal, 3);

    if (resSqft) resSqft.textContent = formatNumber(totalSqFt, 2);

    if (resGaj) resGaj.textContent = formatNumber(gaj, 2);

    if (resBigha) resBigha.textContent = formatNumber(bigha, 3);
    if (subBigha) {
      if (scale.mode === 'haryana') {
        subBigha.textContent = '1 किला = 8 कनाल (43,560 Sq.Ft)';
      } else {
        subBigha.textContent = `1 बीघा = 20 ${scale.mode.startsWith('up') || scale.mode === 'delhi' ? 'बिस्वा' : 'कट्ठा'} (${formatNumber(scale.sqftPerBigha, 0)} Sq.Ft)`;
      }
    }

    if (resAcre) resAcre.textContent = formatNumber(acre, 4);
    if (subAcre) subAcre.textContent = `1 एकड़ = 100 डिसमिल (${formatNumber(43560 / scale.sqftPerKatha, 2)} कट्ठा)`;

    if (scale.mode === 'haryana') {
      if (titleBiswaKanal) titleBiswaKanal.textContent = 'कनाल (Kanal / Marla)';
      if (resBiswa) resBiswa.textContent = `${formatNumber(kanal, 2)} कनाल (${formatNumber(marla, 1)} मरला)`;
      if (subBiswa) subBiswa.textContent = '1 कनाल = 20 मरला (5,445 Sq.Ft)';
    } else {
      if (titleBiswaKanal) titleBiswaKanal.textContent = 'बिस्वा (Biswa)';
      if (resBiswa) resBiswa.textContent = formatNumber(biswa, 3);
      if (subBiswa) subBiswa.textContent = `1 बिस्वा = ${formatNumber(scale.sqftPerBiswa, 2)} Sq.Ft`;
    }

    if (resSqmeter) resSqmeter.textContent = `${formatNumber(sqmeter, 2)} m²`;
    if (subHectare) subHectare.textContent = `${formatNumber(hectare, 4)} Hectare`;

    // Highlight Banner Composite Title
    let compositeTitle = '';
    if (scale.mode === 'haryana') {
      const fullKanal = Math.floor(kanal);
      const remMarla = (kanal - fullKanal) * 20;
      compositeTitle = `${fullKanal > 0 ? fullKanal + ' कनाल ' : ''}${formatNumber(remMarla, 1)} मरला (${formatNumber(acre, 3)} एकड़)`;
    } else if (bigha >= 1) {
      const fullBigha = Math.floor(bigha);
      const remKatha = (totalSqFt - fullBigha * scale.sqftPerBigha) / scale.sqftPerKatha;
      const fullKatha = Math.floor(remKatha);
      const remDhur = (remKatha - fullKatha) * 20;
      const unitWord = scale.mode.startsWith('up') || scale.mode === 'delhi' ? 'बिस्वा' : 'कट्ठा';
      compositeTitle = `${fullBigha} बीघा ${fullKatha > 0 ? fullKatha + ' ' + unitWord + ' ' : ''}${remDhur > 0.05 ? remDhur.toFixed(1) + ' धूर' : ''}`;
    } else if (katha >= 1) {
      const fullKatha = Math.floor(katha);
      const remDhur = (katha - fullKatha) * 20;
      const unitWord = scale.mode.startsWith('up') || scale.mode === 'delhi' ? 'बिस्वा' : 'कट्ठा';
      compositeTitle = `${fullKatha} ${unitWord} ${remDhur > 0.05 ? remDhur.toFixed(1) + ' धूर' : '(20 धूर)'}`;
    } else if (dhur > 0) {
      compositeTitle = `${formatNumber(dhur, 2)} धूर (${formatNumber(dhur * 20, 1)} धुरकी)`;
    } else {
      compositeTitle = '0 कट्ठा (0 धूर)';
    }

    if (highlightMain) {
      highlightMain.textContent = compositeTitle.trim();
    }
    if (highlightSub) {
      highlightSub.textContent = `${formatNumber(totalSqFt, 2)} वर्ग फुट • ${formatNumber(gaj, 2)} वर्ग गज • ${formatNumber(decimal, 2)} डिसमिल`;
    }

    // Estimate Price
    const estPrice = totalSqFt * ratePerSqFt;
    if (highlightPrice) {
      highlightPrice.textContent = formatPriceINR(estPrice);
    }
    if (highlightRateText) {
      highlightRateText.textContent = `@ ₹${ratePerSqFt.toLocaleString('en-IN')} / sq.ft`;
    }
  }

  // Initial calculation
  recalc();
}

/* ==========================================
   3. NAVIGATION & UI SCROLL EFFECTS
   ========================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
        }
      }
    });
  });
}

/* ==========================================
   4. VIP BOOKING & INQUIRY MODAL
   ========================================== */
function initModal() {
  const modal = document.getElementById('vip-modal');
  const openBtns = document.querySelectorAll('.open-vip-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('vip-inquiry-form');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const name = document.getElementById('vip-name')?.value.trim() || 'Not specified';
      const phone = document.getElementById('vip-phone')?.value.trim() || 'Not specified';
      const project = document.getElementById('vip-project')?.value || 'Swarup Group Townships';
      const date = document.getElementById('vip-date')?.value || 'Flexible / Next Available';
      const notes = document.getElementById('vip-notes')?.value.trim() || 'None';

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin">sync</span> Forwarding to WhatsApp...`;

      const waMsg = 
        `🌟 *NEW VIP SITE VISIT / LEAD INQUIRY* 🌟\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Client Name:* ${name}\n` +
        `📞 *Contact Number:* ${phone}\n` +
        `🏡 *Township / Property:* ${project}\n` +
        `📅 *Preferred Visit Date:* ${date}\n` +
        `📝 *Requirement / Notes:* ${notes}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📍 *Source:* Swarup Group Official Website (Lead Form)`;

      const waUrl = `https://wa.me/917061556404?text=${encodeURIComponent(waMsg)}`;

      // Dispatch lead directly to official email (swarupinfragroup@gmail.com) and save locally
      if (typeof window.dispatchLeadToEmail === 'function') {
        window.dispatchLeadToEmail({
          "Lead Type": "VIP Site Visit & Consultation",
          "Client Name": name,
          "Contact Number": phone,
          "Selected Township": project,
          "Preferred Date": date,
          "Notes / Requirement": notes,
          "Source": "Website VIP Lead Form"
        }, `🌟 VIP Site Visit Lead: ${name} (${project})`);
      }

      setTimeout(() => {
        window.open(waUrl, '_blank');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Submit to WhatsApp (+91 70615 56404)`;
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }, 500);
    });
  }
}

/* ==========================================
   5. SCROLL-DRIVEN CONSTRUCTION TIMELINE
   ========================================== */
function initConstructionTimeline() {
  const canvas = document.getElementById('construction-canvas');
  const section = document.getElementById('construction-timeline');
  const phaseLabel = document.getElementById('phase-label');
  const progressBar = document.getElementById('construction-progress');

  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  const buildings = [];
  const NUM = 14;

  function initBuildings() {
    buildings.length = 0;
    const spacing = w / (NUM + 1);
    for (let i = 0; i < NUM; i++) {
      const bx = spacing * (i + 1);
      const centerDist = Math.abs(i - NUM / 2) / (NUM / 2);
      const maxH = (200 + Math.random() * 80) * (1 - centerDist * 0.45);
      const bw = spacing * 0.58 + Math.random() * 6;
      const winCols = Math.floor(bw / 7);
      const floors = Math.floor(maxH / 11);
      const wins = [];
      for (let f = 0; f < floors; f++) {
        const row = [];
        for (let c = 0; c < winCols; c++) {
          row.push({ lit: Math.random() > 0.25, color: Math.random() > 0.55 ? '#f7e7ad' : '#00e5ff', brightness: 0.5 + Math.random() * 0.5 });
        }
        wins.push(row);
      }
      buildings.push({ x: bx, width: bw, maxHeight: maxH, floors, windows: wins, craneArm: 35 + Math.random() * 30, craneSide: i % 2 === 0 ? 1 : -1, tint: Math.random() });
    }
  }

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth || (canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth);
    h = canvas.clientHeight || (canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight);
    if (!w || w <= 0) w = window.innerWidth;
    if (!h || h <= 0) h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    initBuildings();
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('load', resizeCanvas);
  setTimeout(resizeCanvas, 100);
  setTimeout(resizeCanvas, 500);
  resizeCanvas();

  const phases = [
    { t: 0.00, icon: 'explore', text: 'Phase 1 — Land Survey & Plot Demarcation' },
    { t: 0.12, icon: 'foundation', text: 'Phase 2 — Foundation & Deep Piling' },
    { t: 0.30, icon: 'architecture', text: 'Phase 3 — Steel Framework Rising' },
    { t: 0.50, icon: 'apartment', text: 'Phase 4 — Concrete Slab Casting & Crane Operations' },
    { t: 0.72, icon: 'window', text: 'Phase 5 — Glass Curtain Wall & Facade Installation' },
    { t: 0.88, icon: 'auto_awesome', text: 'Phase 6 — Completed Patna Skyline — City Lights On!' }
  ];

  function getPhase(p) { let cur = phases[0]; for (const ph of phases) { if (p >= ph.t) cur = ph; } return cur; }

  function scrollProgress() {
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -rect.top / total));
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpHex(c1, c2, t) {
    const r1 = parseInt(c1.slice(1,3),16), g1 = parseInt(c1.slice(3,5),16), b1 = parseInt(c1.slice(5,7),16);
    const r2 = parseInt(c2.slice(1,3),16), g2 = parseInt(c2.slice(3,5),16), b2 = parseInt(c2.slice(5,7),16);
    return `rgb(${Math.round(lerp(r1,r2,t))},${Math.round(lerp(g1,g2,t))},${Math.round(lerp(b1,b2,t))})`;
  }

  const skyImage = new Image();
  skyImage.src = 'assets/sky_clouds_bg.webp';

  function drawSky(prog, tick) {
    // Draw beautiful scrolling cloud background image seamlessly
    if (skyImage.complete && skyImage.naturalWidth > 0) {
      const slideSpeed = 0.2;
      const cycleW = w * 2;
      const offset = (tick * slideSpeed) % cycleW;
      
      // Helper to draw panels (Normal, Mirrored, Normal) to create a perfect seamless loop
      const drawPanel = (xPos, isMirrored) => {
        if (xPos + w < 0 || xPos > w) return; // Skip if off-screen
        if (isMirrored) {
          ctx.save();
          ctx.translate(xPos + w, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(skyImage, 0, 0, w, h);
          ctx.restore();
        } else {
          ctx.drawImage(skyImage, xPos, 0, w, h);
        }
      };

      // Draw 3 panels to ensure the screen is always fully covered during the loop
      drawPanel(-offset, false);
      drawPanel(w - offset, true);
      drawPanel(w * 2 - offset, false);
      
      // Slight atmospheric overlay to blend it with our lighting
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 0, w, h);
    } else {
      // Fallback
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(0, 0, w, h);
    }
    
    // ── NATURAL, SOFT STATIONARY SUN (Clouds move behind it) ──
    const sunAlpha = Math.min(1, prog * 1.5);
    if (sunAlpha > 0.05) {
      ctx.save();
      ctx.globalAlpha = sunAlpha;

      // Sun position moves dynamically with scroll progress (but doesn't slide with clouds)
      const sx = w * (0.85 - prog * 0.12);
      const sy = h * (0.28 - prog * 0.16);

      // Soft natural radius
      const baseRadius = 25 + prog * 15;
      const auraRadius = 120 + prog * 100;

      // Natural Atmospheric Soft Glow
      const bgGlow = ctx.createRadialGradient(sx, sy, baseRadius, sx, sy, auraRadius);
      bgGlow.addColorStop(0, `rgba(255, 250, 230, ${0.8 + prog * 0.2})`);
      bgGlow.addColorStop(0.3, `rgba(255, 230, 150, ${0.4 + prog * 0.3})`);
      bgGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = bgGlow;
      ctx.fillRect(sx - auraRadius, sy - auraRadius, auraRadius * 2, auraRadius * 2);

      // Solid Core Sun Disc (Soft edges)
      ctx.beginPath();
      ctx.arc(sx, sy, baseRadius, 0, Math.PI * 2);
      const coreGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, baseRadius);
      coreGlow.addColorStop(0, '#ffffff');
      coreGlow.addColorStop(0.7, '#fffbe0');
      coreGlow.addColorStop(1, '#ffedd5');
      ctx.fillStyle = coreGlow;
      ctx.fill();

      // Soft glow ring
      ctx.lineWidth = 4;
      ctx.strokeStyle = `rgba(253, 224, 71, ${0.4 + prog * 0.3})`;
      ctx.stroke();

      ctx.restore();
    }
  }

  // ── HEROIC HYPER-REALISTIC 3D MOUNTAINS (ORGANIC & VOLUMETRIC) ──
  function drawHeroicMountains(prog, groundY, tick) {
    // Intentionally empty. Mountain rendering removed as per user request.
    return;
  }

  // ── HIGH-QUALITY 3D DYNAMIC CONSTRUCTION VEHICLES (FOREGROUND) ──
  function drawVehicles(prog, groundY, tick) {
    if (prog < 0.1 || prog > 0.95) return;

    ctx.save();
    // Move to front part of the building (Foreground)
    const roadY = groundY + 30; // Further down

    // Scale up for higher quality and detail
    const vScale = 1.6; 

    // Define a local progress (0 to 1) for the vehicle active range
    const vp = Math.max(0, Math.min(1, (prog - 0.1) / 0.85));

    // 🚜 Vehicle 1: Heavy Duty Excavator (Driving Rightwards based on scroll)
    const v1X = -200 + vp * (w + 400);
    
    ctx.save();
    ctx.translate(v1X, roadY);
    ctx.scale(vScale, vScale);

    // Excavator Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(15, 0, 35, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Treads Base (Dark Slate)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-20, -8, 45, 8, 4);
    ctx.fill();
    // Tread Wheels (Static, Belt moves over them)
    ctx.fillStyle = '#64748b';
    for (let i = -16; i <= 20; i += 8) {
      ctx.beginPath(); ctx.arc(i, -4, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    // Animated Tread Belt (Scroll driven)
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 2]); 
    ctx.lineDashOffset = -vp * 200; // Moves smoothly with scroll
    ctx.strokeRect(-20, -8, 45, 8);
    ctx.setLineDash([]);

    // Main Body Engine Compartment (Industrial Orange/Yellow Gradient)
    const bodyGrad = ctx.createLinearGradient(-10, -25, 20, -8);
    bodyGrad.addColorStop(0, '#f59e0b');
    bodyGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath(); ctx.roundRect(-15, -22, 35, 14, 3); ctx.fill();
    // Engine vents
    ctx.fillStyle = '#1e293b';
    for(let i=0; i<4; i++) { ctx.fillRect(-10 + i*3, -18, 1.5, 6); }

    // Cabin (Dark Glass)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.roundRect(5, -30, 15, 15, 2); ctx.fill();
    // Window Reflection
    const glassGrad = ctx.createLinearGradient(5, -30, 20, -15);
    glassGrad.addColorStop(0, '#38bdf8');
    glassGrad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');
    ctx.fillStyle = glassGrad;
    ctx.beginPath(); ctx.roundRect(7, -28, 11, 10, 1); ctx.fill();

    // Animated Hydraulic Arm (Scroll driven)
    const armAngle1 = Math.sin(vp * 30) * 0.25 - 0.2;
    const armAngle2 = Math.sin(vp * 30 + 1) * 0.3 + 0.5;

    ctx.translate(15, -15); // Arm Pivot
    ctx.rotate(armAngle1);
    
    // Main Boom
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.roundRect(0, -4, 30, 8, 4); ctx.fill();
    // Hydraulic cylinder
    ctx.fillStyle = '#475569'; ctx.fillRect(5, 4, 15, 3);
    ctx.fillStyle = '#94a3b8'; ctx.fillRect(15, 4.5, 10, 2);

    ctx.translate(28, 0); // Second Pivot
    ctx.rotate(armAngle2);
    
    // Stick (Dipper)
    ctx.fillStyle = '#d97706';
    ctx.beginPath(); ctx.roundRect(0, -3, 25, 6, 3); ctx.fill();
    
    // Bucket (Scoop)
    ctx.translate(25, 0); // Bucket Pivot
    ctx.rotate(-0.5);
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(0, -5); ctx.lineTo(12, -2); ctx.lineTo(10, 8); ctx.lineTo(0, 5);
    ctx.closePath(); ctx.fill();
    // Bucket Teeth
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(12, -2, 3, 1.5); ctx.fillRect(11, 2, 3, 1.5); ctx.fillRect(10, 6, 3, 1.5);

    ctx.restore();

    // 🚛 Vehicle 2: 3D Heavy Concrete Transit Mixer (Driving Leftwards based on scroll)
    const v2X = w + 200 - vp * (w + 400);

    ctx.save();
    ctx.translate(v2X, roadY);
    ctx.scale(vScale, vScale);

    // Truck Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(-5, 0, 45, 6, 0, 0, Math.PI * 2); ctx.fill();

    // Chassis Frame (3D Depth)
    ctx.fillStyle = '#1e293b'; ctx.fillRect(-35, -10, 65, 4);
    ctx.fillStyle = '#475569'; ctx.fillRect(-35, -12, 65, 2); // Top Highlight

    // Front Cab (3D Sculpted)
    // Cab Body Side
    const cabSide = ctx.createLinearGradient(-35, -28, -15, -12);
    cabSide.addColorStop(0, '#2563eb');
    cabSide.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = cabSide;
    ctx.beginPath();
    ctx.moveTo(-15, -12); ctx.lineTo(-35, -12); ctx.lineTo(-35, -20); 
    ctx.lineTo(-28, -28); ctx.lineTo(-15, -28); ctx.closePath();
    ctx.fill();
    // Cab Body Front (3D perspective edge)
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath(); ctx.moveTo(-35, -12); ctx.lineTo(-38, -14); ctx.lineTo(-38, -20); ctx.lineTo(-35, -20); ctx.fill();
    
    // Cab Window (Glass reflection)
    const cabGlass = ctx.createLinearGradient(-27, -25, -17, -15);
    cabGlass.addColorStop(0, '#e0f2fe'); cabGlass.addColorStop(1, '#7dd3fc');
    ctx.fillStyle = cabGlass;
    ctx.beginPath();
    ctx.moveTo(-17, -15); ctx.lineTo(-28, -15); ctx.lineTo(-25, -25); ctx.lineTo(-17, -25);
    ctx.closePath(); ctx.fill();

    // Fuel Tank / Side Details
    ctx.fillStyle = '#94a3b8'; ctx.roundRect(-12, -8, 10, 5, 2); ctx.fill();
    ctx.fillStyle = '#334155'; ctx.fillRect(-10, -8, 1, 5); ctx.fillRect(-6, -8, 1, 5); // Straps

    // 3D Concrete Drum (Static bounds, Animated spiral texture via scroll)
    ctx.save();
    ctx.translate(0, -22);
    
    // 1. Draw static ellipsoid drum body with 3D volume shading
    const drumVol = ctx.createRadialGradient(0, -5, 2, 0, 0, 24);
    drumVol.addColorStop(0, '#ffffff'); // Specular Highlight
    drumVol.addColorStop(0.3, '#38bdf8');
    drumVol.addColorStop(0.8, '#0284c7');
    drumVol.addColorStop(1, '#0c4a6e'); // Deep Shadow
    
    ctx.fillStyle = drumVol;
    ctx.beginPath();
    // Tilted ellipsoid shape for the drum (static, does not wobble)
    ctx.ellipse(0, 0, 24, 14, -0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // 2. Clip strictly to the drum bounds so stripes don't bleed out
    ctx.clip();
    
    // 3. Draw animated wrapping spiral stripes to simulate axial rotation (Scroll driven)
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.85)'; 
    ctx.lineWidth = 3.5;
    
    // Shift stripes horizontally based on scroll progress
    const stripeOffset = (vp * 600) % 30; 
    ctx.beginPath();
    for (let i = -60; i < 40; i += 30) {
      const x = i + stripeOffset;
      // Draw a curved line to look like it's wrapping around a 3D cylinder
      ctx.moveTo(x, -20);
      ctx.quadraticCurveTo(x + 18, 0, x - 5, 20);
    }
    ctx.stroke();
    
    ctx.restore();

    // Rear Drum Mount & Chute (3D shaded)
    ctx.fillStyle = '#64748b'; ctx.fillRect(-20, -18, 5, 8); // Front mount
    
    const mountGrad = ctx.createLinearGradient(20, -22, 28, -8);
    mountGrad.addColorStop(0, '#94a3b8'); mountGrad.addColorStop(1, '#475569');
    ctx.fillStyle = mountGrad;
    ctx.beginPath(); ctx.moveTo(20, -22); ctx.lineTo(28, -24); ctx.lineTo(28, -8); ctx.lineTo(20, -8); ctx.fill();
    
    // Concrete Chute
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath(); ctx.moveTo(28, -18); ctx.lineTo(36, -26); ctx.lineTo(39, -24); ctx.lineTo(28, -12); ctx.fill(); 

    // Detailed 3D Wheels (Dual rear, single front) - Scrolling Spin
    const wheelPositions = [-25, 12, 24];
    wheelPositions.forEach((wx, idx) => {
      ctx.save();
      ctx.translate(wx, -4);
      // Back tire for dual wheels (parallax)
      if (idx > 0) {
        ctx.fillStyle = '#020617';
        ctx.beginPath(); ctx.arc(2, -1, 6.5, 0, Math.PI * 2); ctx.fill();
      }
      
      // Main Tire
      const tireGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 6.5);
      tireGrad.addColorStop(0, '#1e293b'); tireGrad.addColorStop(1, '#020617');
      ctx.fillStyle = tireGrad;
      ctx.beginPath(); ctx.arc(0, 0, 6.5, 0, Math.PI * 2); ctx.fill();
      
      // Rotate inner rim based on scroll
      ctx.rotate(-vp * 30); // Rotate counter-clockwise because truck moves left
      
      // Rim
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
      // Hubcap Detail
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI * 2); ctx.fill();
      // Wheel Nut details
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.arc(0, -2, 0.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 2, 0.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(-2, 0, 0.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(2, 0, 0.5, 0, Math.PI * 2); ctx.fill();
      
      ctx.restore();
    });

    ctx.restore();
    ctx.restore();
  }

  function drawGround(prog, groundY, tick) {
    const gg = ctx.createLinearGradient(0, groundY, 0, h);
    gg.addColorStop(0, '#f1f5f9'); gg.addColorStop(1, '#ffffff');
    ctx.fillStyle = gg; ctx.fillRect(0, groundY, w, h - groundY);

    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(0, groundY - 2, w, 10);
    ctx.setLineDash([24, 16]);
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.4)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(0, groundY + 2); ctx.lineTo(w, groundY + 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(212, 160, 23, 0.4)';
    ctx.beginPath(); ctx.moveTo(0, groundY + 5); ctx.lineTo(w, groundY + 5); ctx.stroke();
    ctx.setLineDash([]);

    if (prog > 0.85) {
      const ra = (prog - 0.85) / 0.15;
      const rg = ctx.createLinearGradient(0, groundY + 10, 0, h);
      rg.addColorStop(0, `rgba(0,229,255,${ra * 0.06})`); rg.addColorStop(1, 'rgba(0,229,255,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, groundY + 10, w, h - groundY - 10);
    }

    if (prog < 0.2) {
      const ma = 1 - prog / 0.2;
      buildings.forEach(b => {
        ctx.strokeStyle = `rgba(0,229,255,${ma * 0.45})`; ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]); ctx.strokeRect(b.x - b.width / 2 - 2, groundY - 8, b.width + 4, 8); ctx.setLineDash([]);
        ctx.fillStyle = `rgba(0,229,255,${ma * 0.6})`; ctx.font = '600 7px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('PLOT', b.x, groundY + 20);
      });
    }

    if (prog > 0.15 && prog < 0.8) {
      const ba = prog < 0.25 ? (prog - 0.15) / 0.1 : prog > 0.7 ? (0.8 - prog) / 0.1 : 1;
      ctx.globalAlpha = ba * 0.5;
      for (let i = 0; i < w; i += 60) {
        ctx.fillStyle = '#c5a059'; ctx.fillRect(i, groundY - 12, 2, 12);
        if (i + 60 < w) { ctx.strokeStyle = 'rgba(197,160,89,0.3)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(i + 1, groundY - 9); ctx.lineTo(i + 61, groundY - 9); ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawCrane(b, prog, groundY, tick) {
    if (prog < 0.15 || prog > 0.84) return;
    const ca = prog < 0.22 ? (prog - 0.15) / 0.07 : prog > 0.78 ? (0.84 - prog) / 0.06 : 1;
    ctx.save(); ctx.globalAlpha = ca;

    const bProg = Math.min(1, Math.max(0, (prog - 0.12) / 0.73));
    const currentH = b.maxHeight * bProg;
    const side = b.craneSide;
    const mastX = b.x + (b.width / 2 + 10) * side;
    const mastH = currentH + 50;
    const mastTop = groundY - mastH;
    const armLen = b.craneArm;
    const counterLen = armLen * 0.35;
    const mw = 6;

    // Heavy Industrial Amber Steel Crane Mast
    ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(mastX - mw / 2, groundY); ctx.lineTo(mastX - mw / 2, mastTop);
    ctx.moveTo(mastX + mw / 2, groundY); ctx.lineTo(mastX + mw / 2, mastTop); ctx.stroke();

    // 3D Lattice Cross Bracing
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)'; ctx.lineWidth = 0.8;
    const segH = 14, segs = Math.floor(mastH / segH);
    for (let s = 0; s < segs; s++) {
      const sy1 = groundY - s * segH, sy2 = groundY - (s + 1) * segH;
      ctx.beginPath(); ctx.moveTo(mastX - mw / 2, sy1); ctx.lineTo(mastX + mw / 2, sy2);
      ctx.moveTo(mastX + mw / 2, sy1); ctx.lineTo(mastX - mw / 2, sy2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mastX - mw / 2, sy2); ctx.lineTo(mastX + mw / 2, sy2); ctx.stroke();
    }

    ctx.fillStyle = '#b45309'; ctx.fillRect(mastX - 5, mastTop - 4, 10, 7);

    // Crane Jib Arm Swing Motion
    const swing = Math.sin(tick * 0.008 + b.x * 0.04) * 0.14;
    const jibEndX = mastX + Math.cos(swing) * armLen * side;
    const jibEndY = mastTop - 5 + Math.sin(swing) * 3;

    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(mastX, mastTop - 2); ctx.lineTo(jibEndX, jibEndY); ctx.stroke();

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)'; ctx.lineWidth = 0.6;
    for (let js = 1; js < 8; js++) {
      const jt = js / 8, jx = lerp(mastX, jibEndX, jt), jy = lerp(mastTop - 2, jibEndY, jt);
      ctx.beginPath(); ctx.moveTo(jx, jy - 3); ctx.lineTo(jx, jy + 3); ctx.stroke();
    }

    const cjibEndX = mastX - Math.cos(swing) * counterLen * side;
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(mastX, mastTop - 2); ctx.lineTo(cjibEndX, mastTop - 3); ctx.stroke();

    // Counterweight Concrete Blocks
    ctx.fillStyle = '#475569'; ctx.fillRect(cjibEndX - 6, mastTop - 4, 12, 8);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.strokeRect(cjibEndX - 6, mastTop - 4, 12, 8);

    const catY = mastTop - 14;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)'; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(mastX, mastTop - 4); ctx.lineTo(mastX, catY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mastX, catY); ctx.lineTo(jibEndX, jibEndY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mastX, catY); ctx.lineTo(cjibEndX, mastTop - 3); ctx.stroke();

    // Crane Cable & Winch Hook Assembly
    const trolleyT = 0.45 + Math.sin(tick * 0.012 + b.x) * 0.35;
    const trolleyX = lerp(mastX, jibEndX, trolleyT), trolleyY = lerp(mastTop - 2, jibEndY, trolleyT);
    const cableBottom = trolleyY + 22 + Math.sin(tick * 0.025 + b.x) * 12;
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(trolleyX, trolleyY); ctx.lineTo(trolleyX, cableBottom); ctx.stroke();
    ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(trolleyX, cableBottom + 3, 3, 0, Math.PI); ctx.stroke();

    // ⚡ REALISTIC DYNAMIC WELDING SPARKS FX AT HOOK ⚡
    if (prog > 0.25 && prog < 0.75 && Math.random() > 0.4) {
      for (let sp = 0; sp < 4; sp++) {
        const sparkX = trolleyX + (Math.random() - 0.5) * 8;
        const sparkY = cableBottom + 4 + Math.random() * 10;
        ctx.fillStyle = Math.random() > 0.5 ? '#fde047' : '#38bdf8';
        ctx.beginPath(); ctx.arc(sparkX, sparkY, 1 + Math.random() * 1.5, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Red Flashing Aviation Safety Beacon on Top
    const blink = Math.sin(tick * 0.08 + b.x) * 0.5 + 0.5;
    ctx.beginPath(); ctx.arc(mastX, catY - 2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(239,68,68,${0.4 + blink * 0.6})`; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 6 + blink * 6;
    ctx.fill(); ctx.shadowBlur = 0;

    ctx.restore();
  }

  function drawBuilding(b, prog, groundY, tick) {
    const bw = b.width, maxH = b.maxHeight, bLeft = b.x - bw / 2;
    
    // Construction Animation Timings
    const tFoundation = Math.max(0, Math.min(1, (prog - 0.10) / 0.15)); // 0.10 -> 0.25
    const tSteel = Math.max(0, Math.min(1, (prog - 0.25) / 0.35));      // 0.25 -> 0.60
    const tConcrete = Math.max(0, Math.min(1, (prog - 0.35) / 0.40));   // 0.35 -> 0.75
    const tGlass = Math.max(0, Math.min(1, (prog - 0.45) / 0.45));      // 0.45 -> 0.90
    
    const maxFloors = Math.floor(maxH / 12);
    const flH = 12;

    const steelFloors = Math.floor(maxFloors * tSteel);
    const concreteFloors = Math.floor(maxFloors * tConcrete);
    const glassFloors = Math.floor(maxFloors * tGlass);

    const steelH = steelFloors * flH;
    const concreteH = concreteFloors * flH;
    const glassH = glassFloors * flH;

    // ── 1. GROUND SHADOW ──
    if (tSteel > 0) {
      const shadowH = Math.max(steelH, glassH);
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
      ctx.beginPath();
      ctx.moveTo(bLeft, groundY);
      ctx.lineTo(bLeft + bw, groundY);
      ctx.lineTo(bLeft + bw + shadowH * 0.35, groundY + shadowH * 0.18);
      ctx.lineTo(bLeft + shadowH * 0.35, groundY + shadowH * 0.18);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // ── 2. FOUNDATION & EXCAVATION (Active during early phase) ──
    if (tFoundation > 0 && tGlass < 0.2) {
      // Excavation Pit
      const pitDepth = 15 * tFoundation;
      ctx.fillStyle = '#475569';
      ctx.fillRect(bLeft - 5, groundY, bw + 10, pitDepth);
      ctx.fillStyle = '#1e293b'; // Pit shadow
      ctx.fillRect(bLeft - 5, groundY, bw + 10, pitDepth * 0.3);

      // Heavy Concrete Base Pour
      if (tFoundation > 0.5) {
        ctx.fillStyle = '#cbd5e1'; 
        ctx.fillRect(bLeft, groundY - 4, bw, 8 + pitDepth);
        // Rebar sticking out
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
        for(let i = 4; i < bw; i += 8) {
          ctx.beginPath(); ctx.moveTo(bLeft + i, groundY - 4); ctx.lineTo(bLeft + i, groundY - 12); ctx.stroke();
        }
      }
    }

    // ── 3. STEEL FRAMEWORK (Grows first) ──
    if (steelFloors > 0) {
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.2;
      const colCount = Math.max(3, Math.floor(bw / 14));
      
      // Vertical Columns
      for (let c = 0; c <= colCount; c++) {
        const cx = bLeft + (bw / colCount) * c;
        ctx.beginPath(); ctx.moveTo(cx, groundY); ctx.lineTo(cx, groundY - steelH); ctx.stroke();
      }
      // Horizontal Beams
      for (let f = concreteFloors; f <= steelFloors; f++) {
        const fy = groundY - f * flH;
        ctx.beginPath(); ctx.moveTo(bLeft, fy); ctx.lineTo(bLeft + bw, fy); ctx.stroke();
      }
      // Cross Bracing
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)'; ctx.lineWidth = 0.6;
      for (let f = concreteFloors; f < steelFloors; f += 2) {
        const fy1 = groundY - f * flH, fy2 = groundY - Math.min((f + 2) * flH, steelH);
        ctx.beginPath(); ctx.moveTo(bLeft, fy1); ctx.lineTo(bLeft + bw, fy2);
        ctx.moveTo(bLeft + bw, fy1); ctx.lineTo(bLeft, fy2); ctx.stroke();
      }
    }

    // ── 4. CONCRETE SLABS (Poured inside/over the steel framework) ──
    if (concreteFloors > 0) {
      // Concrete Core Solid
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(bLeft + 2, groundY - concreteH, bw - 4, concreteH);
      
      // Horizontal Concrete Slab Edges
      ctx.fillStyle = '#cbd5e1';
      for (let f = glassFloors; f <= concreteFloors; f++) {
        const fy = groundY - f * flH;
        ctx.fillRect(bLeft, fy, bw, 3);
      }
    }

    // ── 5. PREMIUM GLASS FACADE (Installed over the concrete core) ──
    if (glassFloors > 0) {
      const splitX = bLeft + bw * 0.46;
      const glassTop = groundY - glassH;

      // Left Facet (Dark Titanium Slate)
      const lg = ctx.createLinearGradient(bLeft, groundY, bLeft, glassTop);
      lg.addColorStop(0, '#1e293b'); lg.addColorStop(0.5, '#334155'); lg.addColorStop(1, '#0f172a');
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(bLeft, groundY); ctx.lineTo(splitX, groundY);
      ctx.lineTo(splitX, glassTop); ctx.lineTo(bLeft, glassTop);
      ctx.closePath(); ctx.fill();

      // Right Facet (Luminous Sapphire Glass)
      const rg = ctx.createLinearGradient(splitX, groundY, splitX, glassTop);
      rg.addColorStop(0, '#0284c7'); rg.addColorStop(0.4, '#0369a1'); rg.addColorStop(0.8, '#38bdf8'); rg.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.moveTo(splitX, groundY); ctx.lineTo(bLeft + bw, groundY);
      ctx.lineTo(bLeft + bw, glassTop); ctx.lineTo(splitX, glassTop);
      ctx.closePath(); ctx.fill();

      // Center Chrome Ribbon
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(splitX, glassTop); ctx.lineTo(splitX, groundY); ctx.stroke();

      // Platinum Slab Edges
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; ctx.lineWidth = 0.8;
      for (let f = 1; f <= glassFloors; f++) {
        const fy = groundY - f * flH;
        ctx.beginPath(); ctx.moveTo(bLeft, fy); ctx.lineTo(bLeft + bw, fy); ctx.stroke();
      }

      // Vertical Glass Mullions
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; ctx.lineWidth = 0.4;
      const mullions = Math.floor(bw / 6);
      for (let m = 1; m < mullions; m++) {
        const mx = bLeft + (bw / mullions) * m;
        ctx.beginPath(); ctx.moveTo(mx, glassTop); ctx.lineTo(mx, groundY); ctx.stroke();
      }

      // Lit Windows
      if (tGlass > 0.8) {
        for (let f = 1; f <= glassFloors; f++) {
          const fy = groundY - f * flH;
          const cols = b.windows[f % b.windows.length] || [];
          cols.forEach((win, ci) => {
            const wx = bLeft + 2 + ci * 6, wy = fy - flH + 2, ww = 4.5, wh = flH - 3;
            if (wx + ww > bLeft + bw - 1) return;
            // Base window frame
            ctx.fillStyle = 'rgba(15, 23, 42, 0.7)'; ctx.fillRect(wx, wy, ww, wh);
            if (win.lit) {
              const litA = Math.min(1, (prog - 0.80) / 0.15) * win.brightness;
              ctx.fillStyle = win.color === '#f7e7ad' ? `rgba(253, 224, 71, ${litA * 0.95})` : `rgba(56, 189, 248, ${litA * 0.85})`;
              ctx.shadowColor = win.color; ctx.shadowBlur = 4 * litA;
              ctx.fillRect(wx + 0.5, wy + 0.5, ww - 1, wh - 1);
              ctx.shadowBlur = 0;
            }
          });
        }
      }

      // Dynamic Sunlight Glint
      if (tGlass > 0.9) {
        const st = (tick * 0.01 + b.x * 0.005) % 1;
        const sg = ctx.createLinearGradient(bLeft, glassTop, bLeft + bw, groundY);
        sg.addColorStop(Math.max(0, st - 0.15), 'rgba(255,255,255,0)');
        sg.addColorStop(st, 'rgba(255,255,255,0.25)');
        sg.addColorStop(Math.min(1, st + 0.15), 'rgba(255,255,255,0)');
        ctx.fillStyle = sg;
        ctx.fillRect(bLeft, glassTop, bw, glassH);
      }

      // Topping Crown & Helipad
if (tGlass >= 1.0) {
        ctx.fillStyle = '#d4a017'; ctx.fillRect(bLeft - 1, glassTop - 2, bw + 2, 2.5); // Parapet
        if (maxH > 150) {
          // Spire
          ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(b.x, glassTop - 2); ctx.lineTo(b.x, glassTop - 22); ctx.stroke();
          // Strobe Beacon
          const bk = Math.sin(tick * 0.09 + b.x) * 0.5 + 0.5;
          ctx.beginPath(); ctx.arc(b.x, glassTop - 22, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239,68,68,${0.4 + bk * 0.6})`; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 8 + bk * 8; ctx.fill(); ctx.shadowBlur = 0;
          // Helipad
          ctx.fillStyle = '#334155'; ctx.fillRect(b.x - 10, glassTop - 4, 20, 3);
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.8; ctx.strokeRect(b.x - 9, glassTop - 4, 18, 3);
        }
      }
    }
  }

  function drawAtmosphere(prog, groundY) {
    if (prog < 0.3) return;
    const ha = Math.min(0.15, (prog - 0.3) * 0.3);
    const hg = ctx.createLinearGradient(0, groundY - 80, 0, groundY);
    hg.addColorStop(0, 'rgba(20,30,50,0)'); hg.addColorStop(1, `rgba(20,30,50,${ha})`);
    ctx.fillStyle = hg; ctx.fillRect(0, groundY - 80, w, 80);
  }

  function drawCitySkyline(prog, groundY) {
    // Fades in to show a bustling background city
    const skylineAlpha = Math.min(0.6, prog * 0.8);
    if (skylineAlpha <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = skylineAlpha;
    ctx.fillStyle = '#64748b'; // Distant slate grey buildings
    
    // Draw an array of distant silhouette buildings
    const numBuildings = 30;
    for (let i = 0; i < numBuildings; i++) {
      // Use pseudo-random heights based on index to keep it static
      const bH = 50 + (Math.sin(i * 4.3) * 40) + (Math.cos(i * 7.1) * 20);
      const bW = 30 + (Math.sin(i * 1.9) * 20);
      const bX = (i * w / numBuildings) - 50;
      
      ctx.fillRect(bX, groundY - bH, bW, bH);
      
      // Distant building windows (lit up if near completion)
      if (prog > 0.8 && Math.sin(i * 3.3) > 0) {
        ctx.fillStyle = `rgba(253, 224, 71, ${0.4 + Math.sin(i)*0.2})`;
        ctx.fillRect(bX + 5, groundY - bH + 10, 4, 4);
        ctx.fillRect(bX + 15, groundY - bH + 20, 4, 4);
        ctx.fillStyle = '#64748b';
      }
    }
    ctx.restore();
  }

  function drawFencing(prog, groundY) {
    // Construction fence disappears when building finishes
    if (prog > 0.90) return; 
    
    const fenceAlpha = Math.min(1, (0.90 - prog) / 0.10);
    ctx.save();
    ctx.globalAlpha = fenceAlpha;
    
    // Draw green construction barricade boards
    ctx.fillStyle = '#064e3b'; // Dark green board
    ctx.fillRect(0, groundY - 20, w, 20);
    
    // Draw panel lines and warning stripes
    ctx.strokeStyle = '#022c22';
    ctx.lineWidth = 1;
    for(let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, groundY - 20); ctx.lineTo(x, groundY); ctx.stroke();
      
      // Warning stripes every few panels
      if (x % 160 === 0) {
        ctx.fillStyle = '#f59e0b'; // Yellow
        ctx.fillRect(x + 5, groundY - 15, 30, 10);
        ctx.fillStyle = '#000000'; // Black stripes
        for(let s = 0; s < 30; s += 8) {
          ctx.beginPath(); ctx.moveTo(x + 5 + s, groundY - 5); ctx.lineTo(x + 10 + s, groundY - 15); ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  function drawLandscaping(prog, groundY, tick) {
    // Trees grow as the building nears completion
    if (prog < 0.8) return;
    const growth = Math.min(1, (prog - 0.8) / 0.15);
    
    ctx.save();
    ctx.globalAlpha = growth;
    
    // Helper to draw a modern low-poly or soft tree
    const drawTree = (tx, ty, scale) => {
      const s = scale * growth;
      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tx - 2*s, ty - 15*s, 4*s, 15*s);
      
      // Leaves (Soft circles)
      ctx.fillStyle = '#15803d'; // Rich green
      ctx.beginPath(); ctx.arc(tx, ty - 25*s, 14*s, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(tx - 10*s, ty - 18*s, 10*s, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(tx + 10*s, ty - 18*s, 10*s, 0, Math.PI*2); ctx.fill();
      
      // Leaf highlight
      ctx.fillStyle = '#22c55e';
      ctx.beginPath(); ctx.arc(tx - 3*s, ty - 28*s, 6*s, 0, Math.PI*2); ctx.fill();
    };

    // Plant trees at intervals where there are no buildings
    buildings.forEach(b => {
      drawTree(b.x - b.width/2 - 20, groundY + 5, 1.2);
      drawTree(b.x + b.width/2 + 25, groundY + 5, 1.0);
      drawTree(b.x + b.width/2 + 50, groundY + 8, 1.4);
    });

    ctx.restore();
  }

  function drawCityGlow(prog, groundY) {
    if (prog < 0.75) return;
    const ga = (prog - 0.75) / 0.25;
    const cg = ctx.createRadialGradient(w / 2, groundY, 50, w / 2, groundY, w * 0.6);
    cg.addColorStop(0, `rgba(197,160,89,${ga * 0.06})`); cg.addColorStop(0.5, `rgba(0,229,255,${ga * 0.03})`); cg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cg; ctx.fillRect(0, groundY - 200, w, 200);
  }

  function drawDust(prog, groundY, tick) {
    if (prog < 0.15 || prog > 0.7) return;
    const da = prog < 0.25 ? (prog - 0.15) / 0.1 : prog > 0.6 ? (0.7 - prog) / 0.1 : 1;
    ctx.fillStyle = `rgba(160,140,100,${da * 0.2})`;
    for (let i = 0; i < 25; i++) {
      const dx = (tick * 0.5 + i * 61) % w, dy = groundY - 15 - Math.sin(tick * 0.015 + i * 1.7) * 35 - (i % 5) * 8;
      ctx.beginPath(); ctx.arc(dx, dy, 0.8 + (i % 3) * 0.4, 0, Math.PI * 2); ctx.fill();
    }
  }

  let tick = 0;
  function render() {
    tick++;
    const prog = scrollProgress();
    const groundY = h * 0.78;

    const ph = getPhase(prog);
    const iconBadge = phaseLabel.querySelector('.phase-icon-badge');
    if (iconBadge) {
      iconBadge.innerHTML = `<span class="material-symbols-outlined text-lg leading-none">${ph.icon}</span>`;
    }
    phaseLabel.querySelector('.phase-text').textContent = ph.text;
    progressBar.style.width = `${prog * 100}%`;

    ctx.clearRect(0, 0, w, h);
    drawSky(prog, tick);
    
    // Background Environment Layer
    drawCitySkyline(prog, groundY);
    drawHeroicMountains(prog, groundY, tick); // (Currently empty/disabled)
    drawCityGlow(prog, groundY);
    
    drawGround(prog, groundY, tick);
    drawDust(prog, groundY, tick);

    buildings.forEach(b => {
      drawBuilding(b, prog, groundY, tick);
      drawCrane(b, prog, groundY, tick);
    });

    // Foreground Elements Layer
    drawVehicles(prog, groundY, tick);
    drawFencing(prog, groundY);
    drawLandscaping(prog, groundY, tick);

    drawAtmosphere(prog, groundY);
    if (isConstructionVisible) {
      constructionAnimId = requestAnimationFrame(render);
    }
  }

  let isConstructionVisible = false;
  let constructionAnimId = null;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isConstructionVisible = entry.isIntersecting;
        if (isConstructionVisible && !constructionAnimId) {
          constructionAnimId = requestAnimationFrame(render);
        } else if (!isConstructionVisible && constructionAnimId) {
          cancelAnimationFrame(constructionAnimId);
          constructionAnimId = null;
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  } else {
    isConstructionVisible = true;
    render();
  }
}

/* ==========================================
   6. DYNAMIC CAMERA-PANNING PATNA-BIHTA CORRIDOR GPS ENGINE (PREMIUM PROGRESSIVE REVEAL)
   ========================================== */
function initRouteTimeline() {
  const container = document.getElementById('route-timeline');
  const canvas = document.getElementById('route-canvas');
  const progressBar = document.getElementById('route-progress');
  const statusMain = document.getElementById('route-status-main');
  const statusSub = document.getElementById('route-status-sub');
  
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let cameraY = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function scrollProgress() {
    const rect = container.getBoundingClientRect();
    const totalScroll = rect.height - window.innerHeight;
    if (totalScroll <= 0) return 0;
    const progress = Math.max(0, Math.min(1, -rect.top / totalScroll));
    return progress;
  }

  // Map Theme State ('light' = Clean Day Map by default, 'dark' = Luxury Night Map)
  let mapTheme = 'light';
  const btnDay = document.getElementById('btn-mode-day');
  const btnNight = document.getElementById('btn-mode-night');
  const switcherContainer = document.getElementById('route-mode-switcher');

  function updateThemeButtons() {
    if (mapTheme === 'dark') {
      if (btnNight) {
        btnNight.style.background = '#1e3a8a';
        btnNight.style.color = '#ffffff';
        btnNight.style.boxShadow = '0 2px 8px rgba(30, 58, 138, 0.3)';
      }
      if (btnDay) {
        btnDay.style.background = 'transparent';
        btnDay.style.color = '#94a3b8';
        btnDay.style.boxShadow = 'none';
      }
      if (switcherContainer) {
        switcherContainer.style.background = '#0f172a';
        switcherContainer.style.borderColor = '#1e3a8a';
      }
    } else {
      if (btnDay) {
        btnDay.style.background = '#1e3a8a';
        btnDay.style.color = '#ffffff';
        btnDay.style.boxShadow = '0 2px 8px rgba(30, 58, 138, 0.2)';
      }
      if (btnNight) {
        btnNight.style.background = 'transparent';
        btnNight.style.color = '#475569';
        btnNight.style.boxShadow = 'none';
      }
      if (switcherContainer) {
        switcherContainer.style.background = '#ffffff';
        switcherContainer.style.borderColor = '#1e3a8a';
      }
    }
  }

  function setMode(mode) {
    mapTheme = mode;
    updateThemeButtons();
  }

  if (btnDay) btnDay.addEventListener('click', (e) => { e.stopPropagation(); setMode('light'); });
  if (btnNight) btnNight.addEventListener('click', (e) => { e.stopPropagation(); setMode('dark'); });
  updateThemeButtons();

  // Virtual Map Height for smooth expansive camera travel
  const mapH = 2050;

  // Real-World Landmarks Matching Patna-Bihta Corridor (Spacious Vertical Clearance)
  const landmarks = [
    { id: "saguna", name: "Saguna More", sub: "VIP Cab Pickup Starting Hub", x: 0.15, y: 300, type: "saguna_hub", km: "0.0 KM", triggerProg: 0 },
    { id: "danapur", name: "Danapur Railway Station", sub: "Major Railway Terminal & Junction", x: 0.465, y: 300, type: "station", km: "3.5 KM", triggerProg: 0.07 },
    { id: "aiims", name: "AIIMS Patna Hospital", sub: "Super-Specialty Medical Hub", x: 0.74, y: 190, type: "hospital_aiims", km: "7.0 KM", triggerProg: 0.16 },
    { id: "shivala", name: "Shivala Chowk", sub: "Bihta Corridor Junction", x: 0.42, y: 440, type: "chowk", km: "10.2 KM", triggerProg: 0.24 },
    { id: "goal_inst", name: "GOAL Institute Campus", sub: "Premier Medical & NEET Coaching Hub", x: 0.58, y: 550, type: "education_goal", km: "12.0 KM", triggerProg: 0.32 },
    { id: "patli_bus", name: "Patli Bus Stand (Kanhauli)", sub: "Inter-State Bus Terminal • Left of Ring Road", x: 0.28, y: 760, type: "patli_bus", km: "13.5 KM", triggerProg: 0.40 },
    { id: "ringroad", name: "Patna Ring Road Golambar", sub: "6-Lane Bihta-Sarmera Expressway", x: 0.42, y: 760, type: "ringroad_east", km: "15.0 KM", triggerProg: 0.44 },
    { id: "painathi", name: "Painathi Road", sub: "Direct Access to Royal Garden", x: 0.42, y: 920, type: "painathi_entry", km: "16.5 KM", triggerProg: 0.50 },
    { id: "royal_garden", name: "ROYAL GARDEN TOWNSHIP", sub: "314 Gated Luxury Villa Plots", x: 0.22, y: 975, type: "township_royal", km: "17.5 KM", triggerProg: 0.58 },
    { id: "bihta_chowk", name: "Bihta Chowk Junction", sub: "Central Transit Hub • Access to Airport & Ara", x: 0.42, y: 1260, type: "chowk_bihta", km: "22.0 KM", triggerProg: 0.68 },
    { id: "bihta_airport", name: "Bihta Int'l Airport", sub: "Right Side along Airport Road", x: 0.28, y: 1210, type: "airport", km: "23.5 KM", triggerProg: 0.74 },
    { id: "nit", name: "NIT Patna (Bihta Campus)", sub: "Right Side along Ara Highway Corridor", x: 0.58, y: 1400, type: "education_nit", km: "25.0 KM", triggerProg: 0.78 },
    { id: "nsmch", name: "NSMCH Medical College", sub: "Super Specialty Hospital (2 KM)", x: 0.60, y: 1260, type: "hospital_nsmch", km: "26.5 KM", triggerProg: 0.82 },
    { id: "iit", name: "IIT Patna Campus (Gate 1)", sub: "Premier Tech Institute (1.5 KM)", x: 0.73, y: 1260, type: "education_iit", km: "28.0 KM", triggerProg: 0.88 },
    { id: "guru_niwas", name: "GURU NIWAS COLONY (BIHTA)", sub: "Swarup Gated Township • Left of Final Road", x: 0.94, y: 1640, type: "township_guru", km: "31.0 KM", triggerProg: 0.98 }
  ];

  // Driving Route Path:
  const path = [
    { x: 0.15, y: 300, title: "Saguna More • VIP Pickup Zone" },
    { x: 0.42, y: 300, title: "Danapur Railway Station (Danapur Terminal on Right)" },
    { x: 0.42, y: 190, title: "Turning towards AIIMS Patna Link Road" },
    { x: 0.74, y: 190, title: "AIIMS Patna Super Specialty Hospital (7.0 KM)" },
    { x: 0.42, y: 190, title: "Returning along AIIMS Link Road" },
    { x: 0.42, y: 300, title: "Connecting back to NH-30 Main Highway Corridor" },
    { x: 0.42, y: 440, title: "Shivala Chowk (NH-30 Main Junction)" },
    { x: 0.42, y: 550, title: "Passing GOAL Institute Campus (Kanhauli - Right Side)" },
    { x: 0.42, y: 760, title: "Patna 6-Lane Ring Road Golambar (Patli Bus Stand on Left)" },
    { x: 0.42, y: 920, title: "NH-30 Junction • Turning onto Painathi Road" },
    { x: 0.22, y: 920, title: "Painathi Road • ROYAL GARDEN TOWNSHIP (314 Plots • Dual Gated Entries)" },
    { x: 0.42, y: 920, title: "Returning along Painathi Road to NH-30 Corridor" },
    { x: 0.42, y: 1260, title: "Bihta Chowk Junction • Turning Left onto Airport Road" },
    { x: 0.28, y: 1260, title: "Airport Road • BIHTA INTERNATIONAL AIRPORT (Right Side)" },
    { x: 0.42, y: 1260, title: "Bihta Chowk Junction • Continuing East along Institutional Corridor" },
    { x: 0.60, y: 1260, title: "NSMCH Hospital & Medical College (2 KM)" },
    { x: 0.73, y: 1260, title: "IIT Patna Main Campus (Gate No. 1 - 1.5 KM)" },
    { x: 0.84, y: 1260, title: "Continuing East past IIT Gate 1" },
    { x: 0.84, y: 1460, title: "Turning South towards Swarup Gated Township Corridor" },
    { x: 0.92, y: 1460, title: "Turning East (Right) onto Approach Link Road" },
    { x: 0.92, y: 1640, title: "Turning South towards GURU NIWAS COLONY (On Left Side)" },
    { x: 0.92, y: 1720, title: "Destination Arrived: GURU NIWAS COLONY (Bihta - 327 Plots - On Left Side)!" }
  ];

  function getPointOnPath(t) {
    if (t <= 0) return { x: path[0].x, y: path[0].y, title: path[0].title };
    if (t >= 1) return { x: path[path.length - 1].x, y: path[path.length - 1].y, title: path[path.length - 1].title };
    const segment = t * (path.length - 1);
    const index = Math.floor(segment);
    const fraction = segment - index;
    
    const p1 = path[index];
    const p2 = path[index + 1];
    
    return {
      x: p1.x + (p2.x - p1.x) * fraction,
      y: p1.y + (p2.y - p1.y) * fraction,
      title: fraction > 0.5 ? p2.title : p1.title
    };
  }

  function getLandmarkReveal(lm, currentProg, carX, carY) {
    const lx = lm.x * w;
    const ly = lm.y;
    const dist = Math.hypot(lx - carX, ly - carY);
    
    if (currentProg >= lm.triggerProg - 0.04) {
      return 1.0;
    }
    if (dist < 260) {
      return Math.max(0.3, 1 - (dist - 80) / 180);
    }
    return 0.25;
  }

  // Helper: Universal Sharp & Auto-Sizing Landmark Card (Guaranteed Zero Overflow / Auto-Clamped)
  function drawCard(centerX, centerY, title, subtitle, borderColor, isDark, s) {
    const titleFont = `800 ${Math.max(7.5, Math.round(9.2 * s))}px Montserrat, Inter, sans-serif`;
    const subFont = `700 ${Math.max(6.2, Math.round(6.8 * s))}px Montserrat, Inter, sans-serif`;
    
    ctx.font = titleFont;
    const titleWidth = ctx.measureText(title).width;
    ctx.font = subFont;
    const subWidth = subtitle ? ctx.measureText(subtitle).width : 0;

    const contentW = Math.max(titleWidth, subWidth);
    const cardW = Math.max(Math.round(130 * s), contentW + Math.round(20 * s));
    const cardH = subtitle ? Math.round(26 * s) : Math.round(18 * s);
    const clampedX = Math.max(cardW / 2 + 8, Math.min(w - cardW / 2 - 8, centerX));
    
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(clampedX - cardW / 2, centerY - cardH / 2, cardW, cardH, Math.round(6 * s));
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
    ctx.font = titleFont;
    ctx.textAlign = 'center';
    ctx.fillText(title, clampedX, subtitle ? (centerY - 1) : (centerY + 3));

    if (subtitle) {
      ctx.fillStyle = '#1e3a8a';
      ctx.font = subFont;
      ctx.fillText(subtitle, clampedX, centerY + Math.round(8.5 * s));
    }
  }

  // 1. START POINT: SAGUNA MORE
  function drawSagunaMoreHub(sx, sy, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');

    // Clean Roundabout
    ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
    ctx.beginPath(); ctx.arc(sx, sy, Math.round(36 * s), 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2; ctx.stroke();

    // Central Green Roundel
    ctx.fillStyle = isDark ? '#065f46' : '#dcfce7';
    ctx.beginPath(); ctx.arc(sx, sy, Math.round(22 * s), 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.fillStyle = '#d4a017';
    ctx.beginPath(); ctx.arc(sx, sy, Math.round(7 * s), 0, Math.PI * 2); ctx.fill();

    // Sharp Landmark Card
    if (reveal > 0.35) {
      drawCard(sx, sy - Math.round(50 * s), "SAGUNA MORE", "VIP Cab Pickup Starting Hub", '#1e3a8a', isDark, s);
    }

    ctx.restore();
  }

  // 2. 3D DANAPUR RAILWAY TERMINAL (WITH REAL-TIME ANIMATED HIGH-SPEED TRAIN)
  function drawStationAnimation(sx, sy, label, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');

    // ── 3D RAILWAY TRACKS (Running vertically parallel to highway) ──
    const trackX = sx - 38 * s;
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(trackX - 6 * s, sy - 75 * s); ctx.lineTo(trackX - 6 * s, sy + 75 * s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(trackX + 6 * s, sy - 75 * s); ctx.lineTo(trackX + 6 * s, sy + 75 * s); ctx.stroke();

    // Perspective Sleepers
    ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1'; ctx.lineWidth = 1.6;
    for (let ty = sy - 70 * s; ty <= sy + 70 * s; ty += 10 * s) {
      ctx.beginPath(); ctx.moveTo(trackX - 9 * s, ty); ctx.lineTo(trackX + 9 * s, ty); ctx.stroke();
    }

    // ── 3D ISOMETRIC STATION TERMINAL BUILDING ──
    const bw = 62 * s;
    const bh = 40 * s;
    const depthX = 12 * s;
    const depthY = -10 * s;

    // Platform Base
    ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(sx - 20 * s, sy - 38 * s, 80 * s, 76 * s, 8 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // 3D Roof
    ctx.fillStyle = isDark ? '#0f172a' : '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(sx - 12 * s, sy - bh / 2);
    ctx.lineTo(sx - 12 * s + depthX, sy - bh / 2 + depthY);
    ctx.lineTo(sx - 12 * s + bw + depthX, sy - bh / 2 + depthY);
    ctx.lineTo(sx - 12 * s + bw, sy - bh / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.2; ctx.stroke();

    // 3D Right Side Wall
    ctx.fillStyle = isDark ? '#0284c7' : '#0f172a';
    ctx.beginPath();
    ctx.moveTo(sx - 12 * s + bw, sy - bh / 2);
    ctx.lineTo(sx - 12 * s + bw + depthX, sy - bh / 2 + depthY);
    ctx.lineTo(sx - 12 * s + bw + depthX, sy + bh / 2 + depthY);
    ctx.lineTo(sx - 12 * s + bw, sy + bh / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.2; ctx.stroke();

    // Station Main Facade
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(sx - 12 * s, sy - bh / 2, bw, bh, 4 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // Clock Tower in Center
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(sx + 10 * s, sy - bh / 2 - 16 * s, 16 * s, 18 * s);
    ctx.fillStyle = '#d4a017';
    ctx.beginPath(); ctx.arc(sx + 18 * s, sy - bh / 2 - 8 * s, 5 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(sx + 18 * s, sy - bh / 2 - 8 * s, 3.5 * s, 0, Math.PI * 2); ctx.fill();

    // Arch Doors & Windows
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(sx - 4 * s, sy - 6 * s, 10 * s, 16 * s);
    ctx.fillRect(sx + 28 * s, sy - 6 * s, 10 * s, 16 * s);

    // ── 3D ANIMATED EXPRESS TRAIN ──
    const trainSpan = 150 * s;
    const tNow = (Date.now() * 0.05) % trainSpan;
    const trainY = sy - 75 * s + tNow;

    // Train Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(trackX - 6 * s, trainY - 2 * s, 13 * s, 46 * s);

    // Engine & Coaches
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(trackX - 5 * s, trainY, 11 * s, 42 * s, 4 * s); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.2; ctx.stroke();

    // Blue Stripe Livery
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(trackX - 4 * s, trainY + 4 * s, 9 * s, 8 * s);
    ctx.fillRect(trackX - 4 * s, trainY + 16 * s, 9 * s, 12 * s);
    ctx.fillRect(trackX - 4 * s, trainY + 30 * s, 9 * s, 8 * s);

    // Train Headlight
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(trackX + 0.5 * s, trainY + 40 * s, 2 * s, 0, Math.PI * 2); ctx.fill();

    // Sharp Station Card (Clean Text)
    if (reveal > 0.35) {
      drawCard(sx + Math.round(18 * s), sy - Math.round(52 * s), "🚆 DANAPUR RAILWAY STATION", "Major Railway Terminal & Junction", '#1e3a8a', isDark, s);
    }

    ctx.restore();
  }

  // 3. 3D AIIMS PATNA SUPER-SPECIALTY APEX HOSPITAL
  function drawHospitalAnimation(hx, hy, label, isAIIMS, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');

    if (!isAIIMS) {
      // NSMCH Hospital
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.beginPath(); ctx.roundRect(hx - 50 * s, hy - 36 * s, 100 * s, 72 * s, 8 * s); ctx.fill();
      ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(hx - 3 * s, hy - 22 * s, 6 * s, 18 * s);
      ctx.fillRect(hx - 9 * s, hy - 16 * s, 18 * s, 6 * s);
      if (reveal > 0.35) {
        drawCard(hx, hy - Math.round(52 * s), "🏥 NSMCH MEDICAL COLLEGE", "Super Specialty Hospital (2 KM)", '#1e3a8a', isDark, s);
      }
      ctx.restore();
      return;
    }

    // ── 3D ISOMETRIC AIIMS SUPER-SPECIALTY HOSPITAL COMPLEX ──
    const bw = 88 * s;
    const bh = 46 * s;
    const depthX = 14 * s;
    const depthY = -12 * s;

    // Campus Courtyard Base
    ctx.fillStyle = isDark ? '#1e293b' : '#eff6ff';
    ctx.beginPath();
    ctx.roundRect(hx - 58 * s, hy - 32 * s, 118 * s, 76 * s, 10 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.6; ctx.stroke();

    // 3D Main Tower Roof
    ctx.fillStyle = isDark ? '#0f172a' : '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(hx - 18 * s, hy - bh / 2);
    ctx.lineTo(hx - 18 * s + depthX, hy - bh / 2 + depthY);
    ctx.lineTo(hx + bw / 2 + depthX, hy - bh / 2 + depthY);
    ctx.lineTo(hx + bw / 2, hy - bh / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.2; ctx.stroke();

    // 3D Helipad on Main Tower Roof
    const heliX = hx + 14 * s + depthX * 0.6;
    const heliY = hy - bh / 2 + depthY * 0.6;
    ctx.fillStyle = '#15803d';
    ctx.beginPath(); ctx.ellipse(heliX, heliY, 14 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${Math.max(6, Math.round(7 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("H", heliX, heliY + 2.5 * s);

    // 3D Right Side Isometric Wall
    ctx.fillStyle = isDark ? '#0284c7' : '#0f172a';
    ctx.beginPath();
    ctx.moveTo(hx + bw / 2, hy - bh / 2);
    ctx.lineTo(hx + bw / 2 + depthX, hy - bh / 2 + depthY);
    ctx.lineTo(hx + bw / 2 + depthX, hy + bh / 2 + depthY);
    ctx.lineTo(hx + bw / 2, hy + bh / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.2; ctx.stroke();

    // Main Hospital Facade
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(hx - 18 * s, hy - bh / 2, bw / 2 + 18 * s, bh, 4 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.6; ctx.stroke();

    // Windows Grid (Blue Glass Tint)
    ctx.fillStyle = '#38bdf8';
    for (let wx = hx - 10 * s; wx <= hx + 30 * s; wx += 12 * s) {
      ctx.fillRect(wx, hy - 16 * s, 8 * s, 6 * s);
      ctx.fillRect(wx, hy - 6 * s, 8 * s, 6 * s);
      ctx.fillRect(wx, hy + 4 * s, 8 * s, 6 * s);
    }

    // 3D Left Emergency Wing
    ctx.fillStyle = isDark ? '#1e293b' : '#fee2e2';
    ctx.beginPath();
    ctx.roundRect(hx - 50 * s, hy - 10 * s, 32 * s, 32 * s, 4 * s);
    ctx.fill();
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1.5; ctx.stroke();

    // Red Cross Emblem on Emergency Wing
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(hx - 37 * s, hy - 4 * s, 6 * s, 18 * s);
    ctx.fillRect(hx - 43 * s, hy + 2 * s, 18 * s, 6 * s);

    // AIIMS Gold Entrance Portico
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(hx - 4 * s, hy + 12 * s, 34 * s, 12 * s);
    ctx.fillStyle = '#d4a017';
    ctx.font = `800 ${Math.max(5.5, Math.round(6 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("AIIMS PATNA", hx + 13 * s, hy + 20 * s);

    // Sharp Landmark Card (Clean Text)
    if (reveal > 0.35) {
      drawCard(hx + 8 * s, hy - Math.round(52 * s), "🏥 AIIMS PATNA HOSPITAL", "Super-Specialty Medical Hub (7 KM)", '#d4a017', isDark, s);
    }

    ctx.restore();
  }

  // 3.5 3D GOAL INSTITUTE CAMPUS (At 1/3rd Distance between Shivala & Ring Road on Right Side)
  function drawGoalInstituteAnimation(gx, gy, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');

    // ── 3D ISOMETRIC/EXTRUDED ACADEMIC BUILDING ──
    const bw = 84 * s;
    const bh = 42 * s;
    const depthX = 10 * s;
    const depthY = -10 * s;

    // Campus Courtyard Base
    ctx.fillStyle = isDark ? '#1e293b' : '#eff6ff';
    ctx.beginPath();
    ctx.roundRect(gx - 48 * s, gy - 28 * s, 96 * s, 64 * s, 8 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // 3D Top Roof Face
    ctx.fillStyle = isDark ? '#0f172a' : '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(gx - bw / 2, gy - bh / 2);
    ctx.lineTo(gx - bw / 2 + depthX, gy - bh / 2 + depthY);
    ctx.lineTo(gx + bw / 2 + depthX, gy - bh / 2 + depthY);
    ctx.lineTo(gx + bw / 2, gy - bh / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.2; ctx.stroke();

    // 3D Right Side Bevel Face
    ctx.fillStyle = isDark ? '#0284c7' : '#0f172a';
    ctx.beginPath();
    ctx.moveTo(gx + bw / 2, gy - bh / 2);
    ctx.lineTo(gx + bw / 2 + depthX, gy - bh / 2 + depthY);
    ctx.lineTo(gx + bw / 2 + depthX, gy + bh / 2 + depthY);
    ctx.lineTo(gx + bw / 2, gy + bh / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.2; ctx.stroke();

    // Building Front Main Facade
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(gx - bw / 2, gy - bh / 2, bw, bh, 4 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // Windows Grid
    ctx.fillStyle = '#3b82f6';
    for (let wx = gx - 28 * s; wx <= gx + 18 * s; wx += 12 * s) {
      ctx.fillRect(wx, gy - 12 * s, 8 * s, 6 * s);
      ctx.fillRect(wx, gy - 2 * s, 8 * s, 6 * s);
    }

    // Goal Target Logo on Roof
    const logoX = gx;
    const logoY = gy - 24 * s;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(logoX, logoY, 8 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(logoX, logoY, 5 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(logoX, logoY, 2.5 * s, 0, Math.PI * 2); ctx.fill();

    // Sharp Landmark Card (Clean Text)
    if (reveal > 0.35) {
      drawCard(gx, gy - Math.round(48 * s), "🎯 GOAL INSTITUTE CAMPUS", "Premier Medical & NEET Coaching Hub", '#d4a017', isDark, s);
    }

    ctx.restore();
  }

  // 4. 3D PATLI BUS STAND (ISBT KANHAULI)
  function drawPatliBusStand(bx, by, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');

    // Terminal Apron & Bus Bays Ground
    ctx.fillStyle = isDark ? '#1e293b' : '#eff6ff';
    ctx.beginPath(); ctx.roundRect(bx - 52 * s, by - 30 * s, 104 * s, 64 * s, 8 * s); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // ── 3D ISOMETRIC TERMINAL CONCOURSE BUILDING ──
    const tw = 46 * s;
    const th = 32 * s;
    const depthX = 10 * s;
    const depthY = -8 * s;

    // Terminal Roof
    ctx.fillStyle = isDark ? '#0f172a' : '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(bx + 4 * s, by - th / 2);
    ctx.lineTo(bx + 4 * s + depthX, by - th / 2 + depthY);
    ctx.lineTo(bx + 4 * s + tw + depthX, by - th / 2 + depthY);
    ctx.lineTo(bx + 4 * s + tw, by - th / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.2; ctx.stroke();

    // Terminal Facade (Glass Concourse)
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bx + 4 * s, by - th / 2, tw, th, 4 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // Glass Windows
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(bx + 8 * s, by - 8 * s, 16 * s, 16 * s);
    ctx.fillRect(bx + 26 * s, by - 8 * s, 16 * s, 16 * s);

    // Gold ISBT Signboard on Roof
    ctx.fillStyle = '#d4a017';
    ctx.font = `900 ${Math.max(5.5, Math.round(6 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("ISBT PATLI", bx + 27 * s, by + 12 * s);

    // ── 3D ISOMETRIC LUXURY BUSES PARKED AT BAYS ──
    // Bus 1 (Blue Volvo Coach)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(bx - 44 * s, by - 18 * s, 36 * s, 13 * s, 3 * s); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(bx - 42 * s, by - 16 * s, 24 * s, 5 * s);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(bx - 10 * s, by - 16 * s, 2 * s, 4 * s);

    // Bus 2 (Gold & Red Express Coach)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(bx - 44 * s, by + 5 * s, 36 * s, 13 * s, 3 * s); ctx.fill();
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(bx - 42 * s, by + 7 * s, 24 * s, 5 * s);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(bx - 10 * s, by + 7 * s, 2 * s, 4 * s);

    // Sharp Card (Clean Text)
    if (reveal > 0.35) {
      drawCard(bx, by - Math.round(44 * s), "🚏 PATLI BUS STAND", "Kanhauli • Inter-State Bus Terminal", '#1e3a8a', isDark, s);
    }

    ctx.restore();
  }

  // 5. PATNA 6-LANE RING ROAD (GOLAMBAR + EAST EXPRESSWAY & SHERPUR-DIGHWARA SPUR)
  function drawPatnaRingRoadEast(rx, ry, reveal, prog, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');
    const gx = rx; // Golambar X on NH-30 (0.42 * w)
    const gy = ry; // Golambar Y on NH-30 (760)

    const roadW = Math.round(24 * s);

    // ── 1. SHERPUR - DIGHWARA 6-LANE ROAD (PASSING WELL BELOW SAGUNA MORE ON LEFT SIDE) ──
    const sherpurEndX = -w * 0.35 - 120;
    const deltaSpan = gx - sherpurEndX;
    const sherpurEndY = gy - deltaSpan * 0.38; // Realistic corridor elevation

    // Sherpur - Dighwara Asphalt Base
    ctx.strokeStyle = isDark ? '#1e293b' : '#334155';
    ctx.lineWidth = roadW;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(sherpurEndX, sherpurEndY);
    ctx.stroke();

    // Road outer borders
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(sherpurEndX, sherpurEndY);
    ctx.stroke();

    // Double dashed center lane
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(sherpurEndX, sherpurEndY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Overhead Signboard on Sherpur - Dighwara Road
    const sherMidX = Math.max(w * 0.12, (gx + Math.max(0, sherpurEndX)) / 2 - 15);
    const sherMidY = gy - (gx - sherMidX) * 0.38 - 20 * s;
    const signBoxW = Math.round(175 * s);
    const signBoxH = Math.round(26 * s);

    ctx.fillStyle = '#0284c7';
    ctx.beginPath(); ctx.roundRect(sherMidX - signBoxW / 2, sherMidY - signBoxH / 2, signBoxW, signBoxH, 6 * s); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.max(7, Math.round(8.5 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("🌉 SHERPUR - DIGHWARA ➔", sherMidX, sherMidY - 1);
    ctx.fillStyle = '#fde047';
    ctx.font = `700 ${Math.max(6, Math.round(6.5 * s))}px Montserrat, Inter, sans-serif`;
    ctx.fillText("6-LANE GANGA BRIDGE CORRIDOR", sherMidX, sherMidY + Math.round(8 * s));

    // ── 2. 6-LANE RING ROAD EXPRESSWAY TRAJECTORY (East -> North -> East OUTSIDE SCREEN BORDER) ──
    const turn1X = w * 0.68;
    const turn1Y = gy;
    const turn2X = w * 0.68;
    const turn2Y = gy - 140;
    const endX = w * 1.35 + 200; // Extends far outside screen frame
    const endY = gy - 140;

    ctx.strokeStyle = isDark ? '#1e293b' : '#334155';
    ctx.lineWidth = roadW;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(turn1X, turn1Y);
    ctx.lineTo(turn2X, turn2Y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Road outer borders
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(turn1X, turn1Y);
    ctx.lineTo(turn2X, turn2Y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Double yellow center divider
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(gx + 20 * s, gy);
    ctx.lineTo(turn1X, turn1Y);
    ctx.lineTo(turn2X, turn2Y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // ── 3. GOLAMBAR / ROUNDABOUT ON NH-30 ──
    ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
    ctx.beginPath(); ctx.arc(gx, gy, Math.round(28 * s), 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2; ctx.stroke();

    // Central landscaped green island in Golambar
    ctx.fillStyle = isDark ? '#065f46' : '#dcfce7';
    ctx.beginPath(); ctx.arc(gx, gy, Math.round(18 * s), 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1.5; ctx.stroke();

    // Center Gold Fountain / Landmark Pillar
    ctx.fillStyle = '#d4a017';
    ctx.beginPath(); ctx.arc(gx, gy, Math.round(6 * s), 0, Math.PI * 2); ctx.fill();

    // Green Expressway Overhead Signboard (East Branch)
    const signX = Math.min(w - signBoxW / 2 - 10, turn1X + 25 * s);
    const signY = turn2Y - 26 * s;
    ctx.fillStyle = '#15803d';
    ctx.beginPath(); ctx.roundRect(signX - signBoxW / 2, signY - signBoxH / 2, signBoxW, signBoxH, 6 * s); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.max(7, Math.round(8.5 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("🛣️ PATNA 6-LANE RING ROAD ➔", signX, signY - 1);
    ctx.fillStyle = '#fde047';
    ctx.font = `700 ${Math.max(6, Math.round(6.5 * s))}px Montserrat, Inter, sans-serif`;
    ctx.fillText("BIHTA-SARMERA EXPRESSWAY", signX, signY + Math.round(8 * s));

    // Sharp Golambar Card
    if (reveal > 0.35) {
      drawCard(gx, gy + Math.round(46 * s), "⭕ PATNA RING ROAD GOLAMBAR", "6-LANE EXPRESSWAY INTERCHANGE", '#1e3a8a', isDark, s);
    }

    ctx.restore();
  }

  // 6. REALISTIC PAINATHI ROAD & 2 SLIM ENTRY CONNECTORS TO ROYAL GARDEN
  function drawPainathiRoadEntry(px, py, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');
    const roadW = Math.round(20 * s);
    const endWestX = w * 0.08;
    const rx = w * 0.22;
    const entry1X = rx + 32 * s; // Slim Entry 1 (East Gate)
    const entry2X = rx - 28 * s; // Slim Entry 2 (West Gate)
    const entryW = Math.round(10 * s); // Slim entry road width

    // ── 1. MAIN PAINATHI ASPHALT ROAD (NH-30 Junction heading West) ──
    ctx.strokeStyle = isDark ? '#1e293b' : '#334155';
    ctx.lineWidth = roadW;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(endWestX, py);
    ctx.stroke();

    // ── 2. TWO SLIM ENTRY ROADS (Branching South from Painathi Road into Royal Garden) ──
    ctx.lineWidth = entryW;
    // Entry 1
    ctx.beginPath();
    ctx.moveTo(entry1X, py);
    ctx.lineTo(entry1X, py + 26 * s);
    ctx.stroke();
    // Entry 2
    ctx.beginPath();
    ctx.moveTo(entry2X, py);
    ctx.lineTo(entry2X, py + 26 * s);
    ctx.stroke();

    // ── 3. MATCHING ROAD OUTER BORDERS & JUNCTION THROATS ──
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1.6;

    // Top Highway Border (with fillet into NH-30)
    ctx.beginPath();
    ctx.moveTo(px - roadW / 2, py - 20 * s);
    ctx.quadraticCurveTo(px - 10 * s, py - roadW / 2, px - 20 * s, py - roadW / 2);
    ctx.lineTo(endWestX, py - roadW / 2);
    ctx.stroke();

    // Bottom Highway Border (with fillet into NH-30 & fillets at the 2 slim entries)
    ctx.beginPath();
    ctx.moveTo(px - roadW / 2, py + 20 * s);
    ctx.quadraticCurveTo(px - 10 * s, py + roadW / 2, px - 20 * s, py + roadW / 2);
    ctx.lineTo(entry1X + entryW / 2, py + roadW / 2);
    ctx.lineTo(entry1X + entryW / 2, py + 26 * s);
    ctx.moveTo(entry1X - entryW / 2, py + 26 * s);
    ctx.lineTo(entry1X - entryW / 2, py + roadW / 2);
    ctx.lineTo(entry2X + entryW / 2, py + roadW / 2);
    ctx.lineTo(entry2X + entryW / 2, py + 26 * s);
    ctx.moveTo(entry2X - entryW / 2, py + 26 * s);
    ctx.lineTo(entry2X - entryW / 2, py + roadW / 2);
    ctx.lineTo(endWestX, py + roadW / 2);
    ctx.stroke();

    // ── 4. DASHED YELLOW CENTER LANE ──
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(px - 10 * s, py);
    ctx.lineTo(endWestX + 10 * s, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── 5. JUNCTION OVERHEAD SIGNBOARD ──
    const juncSignX = px - 80 * s;
    const juncSignY = py - 24 * s;
    const signW = Math.round(150 * s);
    const signH = Math.round(22 * s);

    ctx.fillStyle = '#0284c7';
    ctx.beginPath(); ctx.roundRect(juncSignX - signW / 2, juncSignY - signH / 2, signW, signH, 5 * s); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.max(6.5, Math.round(7.5 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("📍 PAINATHI ROAD ➔", juncSignX, juncSignY - 1);
    ctx.fillStyle = '#fde047';
    ctx.font = `700 ${Math.max(5.5, Math.round(6 * s))}px Montserrat, Inter, sans-serif`;
    ctx.fillText("ROYAL GARDEN TOWNSHIP", juncSignX, juncSignY + Math.round(7 * s));

    // Sharp Landmark Card
    if (reveal > 0.35) {
      drawCard(px - Math.round(55 * s), py - Math.round(44 * s), "📍 PAINATHI ROAD", "Direct Access Route to Royal Garden", '#1e3a8a', isDark, s);
    }

    ctx.restore();
  }

  // 7. GRAND 3D ISOMETRIC ROYAL GARDEN LUXURY GATED TOWNSHIP (KANHAULI)
  function drawRoyalGardenTownship(rx, ry, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');
    const entry1X = rx + 32 * s;
    const entry2X = rx - 28 * s;

    // ── 3D GATED TOWNSHIP COMMUNITY GROUND ──
    const townW = 150 * s;
    const townH = 80 * s;
    ctx.fillStyle = isDark ? '#064e3b' : '#ecfdf5';
    ctx.beginPath();
    ctx.roundRect(rx - townW / 2, ry - 32 * s, townW, townH, 10 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2; ctx.stroke();

    // ── 3D ISOMETRIC LUXURY VILLAS ──
    function draw3DVilla(vx, vy, vw, vh, roofColor) {
      const depthX = 6 * s;
      const depthY = -6 * s;
      // Roof 3D
      ctx.fillStyle = roofColor;
      ctx.beginPath();
      ctx.moveTo(vx - vw / 2, vy - vh / 2);
      ctx.lineTo(vx - vw / 2 + depthX, vy - vh / 2 + depthY);
      ctx.lineTo(vx + vw / 2 + depthX, vy - vh / 2 + depthY);
      ctx.lineTo(vx + vw / 2, vy - vh / 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1; ctx.stroke();

      // Right Wall 3D
      ctx.fillStyle = isDark ? '#0284c7' : '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(vx + vw / 2, vy - vh / 2);
      ctx.lineTo(vx + vw / 2 + depthX, vy - vh / 2 + depthY);
      ctx.lineTo(vx + vw / 2 + depthX, vy + vh / 2 + depthY);
      ctx.lineTo(vx + vw / 2, vy + vh / 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1; ctx.stroke();

      // Front Facade
      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(vx - vw / 2, vy - vh / 2, vw, vh, 2 * s);
      ctx.fill();
      ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.2; ctx.stroke();

      // Windows
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(vx - vw / 2 + 3 * s, vy - vh / 2 + 3 * s, 5 * s, 4 * s);
      ctx.fillRect(vx + vw / 2 - 8 * s, vy - vh / 2 + 3 * s, 5 * s, 4 * s);
    }

    // Render 4 3D Villas in Township
    draw3DVilla(rx - 48 * s, ry - 6 * s, 22 * s, 14 * s, '#dc2626');
    draw3DVilla(rx - 18 * s, ry - 6 * s, 22 * s, 14 * s, '#1e3a8a');
    draw3DVilla(rx + 14 * s, ry - 6 * s, 22 * s, 14 * s, '#0284c7');
    draw3DVilla(rx + 44 * s, ry - 6 * s, 22 * s, 14 * s, '#d4a017');

    // Second Row of 3D Villas
    draw3DVilla(rx - 48 * s, ry + 18 * s, 20 * s, 13 * s, '#ea580c');
    draw3DVilla(rx - 18 * s, ry + 18 * s, 20 * s, 13 * s, '#16a34a');
    draw3DVilla(rx + 14 * s, ry + 18 * s, 20 * s, 13 * s, '#9333ea');
    draw3DVilla(rx + 44 * s, ry + 18 * s, 20 * s, 13 * s, '#dc2626');

    // ── 3D CENTRAL FOUNTAIN ROUNDEL ──
    const fX = rx - 2 * s;
    const fY = ry + 6 * s;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(fX, fY, 7 * s, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(fX, fY, 3 * s, 0, Math.PI * 2); ctx.fill();

    // ── TWO 3D GRAND ENTRANCE GATES ──
    // Gate 1 (East Gate)
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(entry1X - 12 * s, ry - 35 * s, 24 * s, 5 * s);
    ctx.fillRect(entry1X - 12 * s, ry - 35 * s, 4 * s, 12 * s);
    ctx.fillRect(entry1X + 8 * s, ry - 35 * s, 4 * s, 12 * s);
    ctx.fillStyle = '#fde047';
    ctx.font = `800 ${Math.max(4.8, Math.round(5.2 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("GATE 1", entry1X, ry - 25 * s);

    // Gate 2 (Main VIP Gate)
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(entry2X - 15 * s, ry - 35 * s, 30 * s, 5 * s);
    ctx.fillRect(entry2X - 15 * s, ry - 35 * s, 4 * s, 12 * s);
    ctx.fillRect(entry2X + 11 * s, ry - 35 * s, 4 * s, 12 * s);
    ctx.fillStyle = '#fde047';
    ctx.font = `800 ${Math.max(4.8, Math.round(5.2 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("VIP GATE", entry2X, ry - 25 * s);

    // Sharp Dynamic Landmark Card
    if (reveal > 0.35) {
      drawCard(rx, ry + Math.round(60 * s), "🏰 ROYAL GARDEN TOWNSHIP", "314 Gated Luxury Villa Plots", '#d4a017', isDark, s);
    }

    ctx.restore();
  }

  // 7.5 BIHTA CHOWK JUNCTION (4-WAY INTERCHANGE: AIRPORT LEFT, ARA HIGHWAY SOUTH, INSTITUTIONAL EAST)
  function drawBihtaChowk(bx, by, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');
    const roadW = Math.round(22 * s);
    const airX = w * 0.28;
    const nitY = by + 140 * s;
    const nitX = w * 0.58;

    // ── 1. WEST ROAD (Heading Left towards Bihta Airport) ──
    ctx.strokeStyle = isDark ? '#1e293b' : '#334155';
    ctx.lineWidth = roadW;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(w * 0.10, by);
    ctx.stroke();

    // Link Road to Airport (Right/North side of West Road at close distance)
    ctx.lineWidth = Math.round(14 * s);
    ctx.beginPath();
    ctx.moveTo(airX, by);
    ctx.lineTo(airX, by - 35 * s);
    ctx.stroke();

    // West Road Outer Borders
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(bx - roadW / 2, by + roadW / 2);
    ctx.lineTo(w * 0.10, by + roadW / 2);
    ctx.moveTo(bx - roadW / 2, by - roadW / 2);
    ctx.lineTo(airX + 7 * s, by - roadW / 2);
    ctx.moveTo(airX - 7 * s, by - roadW / 2);
    ctx.lineTo(w * 0.10, by - roadW / 2);
    ctx.stroke();

    // Dashed Centerline on West Road
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(bx - 10 * s, by);
    ctx.lineTo(w * 0.10 + 10 * s, by);
    ctx.stroke();
    ctx.setLineDash([]);

    // Signboard on Airport Branch
    const airSignX = bx - 55 * s;
    const airSignY = by + 24 * s;
    ctx.fillStyle = '#0284c7';
    ctx.beginPath(); ctx.roundRect(airSignX - 60 * s, airSignY - 10 * s, 120 * s, 20 * s, 4 * s); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.max(6.2, Math.round(7 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("✈️ AIRPORT ROAD", airSignX, airSignY + 3.5 * s);

    // ── 2. EAST ROAD (Heading Right to NSMCH & IIT Patna) ──
    ctx.strokeStyle = isDark ? '#1e293b' : '#334155';
    ctx.lineWidth = roadW;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(w * 0.95, by);
    ctx.stroke();

    // ── 3. SOUTH STRAIGHT HIGHWAY TOWARDS ARA / BUXAR (CONTINUOUS EXTENSION DOWNWARDS) ──
    ctx.strokeStyle = isDark ? '#1e293b' : '#334155';
    ctx.lineWidth = roadW;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx, mapH + 150);
    ctx.stroke();

    // South Road Outer Borders
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(bx - roadW / 2, by + roadW / 2);
    ctx.lineTo(bx - roadW / 2, mapH + 150);
    ctx.moveTo(bx + roadW / 2, by + roadW / 2);
    ctx.lineTo(bx + roadW / 2, nitY - 7 * s);
    ctx.moveTo(bx + roadW / 2, nitY + 7 * s);
    ctx.lineTo(bx + roadW / 2, mapH + 150);
    ctx.stroke();

    // South Road Dashed Yellow Centerline
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(bx, by + 10 * s);
    ctx.lineTo(bx, mapH + 150);
    ctx.stroke();
    ctx.setLineDash([]);

    // Link Road branching East/Right to NIT Patna along South Road
    ctx.strokeStyle = isDark ? '#1e293b' : '#334155';
    ctx.lineWidth = Math.round(14 * s);
    ctx.beginPath();
    ctx.moveTo(bx, nitY);
    ctx.lineTo(nitX - 35 * s, nitY);
    ctx.stroke();

    // Signboard 1 on Ara Highway (Near NIT)
    const araSignX = bx - 58 * s;
    const araSignY = by + 200 * s;
    ctx.fillStyle = '#15803d';
    ctx.beginPath(); ctx.roundRect(araSignX - 70 * s, araSignY - 11 * s, 140 * s, 22 * s, 5 * s); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.max(6.5, Math.round(7.5 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("🛣️ NH-30 ➔ ARA / BUXAR", araSignX, araSignY + 3.5 * s);

    // Signboard 2 on Ara Highway (Lower Stretch)
    const araSign2Y = by + 420 * s;
    ctx.fillStyle = '#15803d';
    ctx.beginPath(); ctx.roundRect(araSignX - 70 * s, araSign2Y - 11 * s, 140 * s, 22 * s, 5 * s); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.max(6.2, Math.round(7.2 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("➔ TO ARA (BHOJPUR)", araSignX, araSign2Y + 3.5 * s);

    // Central Chowk Roundel
    ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
    ctx.beginPath(); ctx.arc(bx, by, Math.round(24 * s), 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#d4a017';
    ctx.beginPath(); ctx.arc(bx, by, Math.round(6 * s), 0, Math.PI * 2); ctx.fill();

    // Sharp Card
    if (reveal > 0.35) {
      drawCard(bx, by - Math.round(42 * s), "⭕ BIHTA CHOWK JUNCTION", "Transit Interchange • Access to Airport & Ara", '#1e3a8a', isDark, s);
    }

    ctx.restore();
  }

  // 8. 3D ANIMATED BIHTA INTERNATIONAL AIRPORT (SITUATED ON RIGHT/NORTH SIDE OF AIRPORT ROAD)
  function drawAirportAnimation(ax, ay, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');

    // ── 3D PERSPECTIVE RUNWAY ──
    const runW = 110 * s;
    const runH = 20 * s;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.roundRect(ax - runW / 2, ay + 10 * s, runW, runH, 3 * s); ctx.fill();
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5; ctx.stroke();

    // Runway Centerline Dashes
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(ax - runW / 2 + 8 * s, ay + 20 * s); ctx.lineTo(ax + runW / 2 - 8 * s, ay + 20 * s); ctx.stroke();
    ctx.setLineDash([]);

    // Threshold Piano Key Markings
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
    for (let py = ay + 12 * s; py <= ay + 28 * s; py += 3 * s) {
      ctx.beginPath(); ctx.moveTo(ax - runW / 2 + 3 * s, py); ctx.lineTo(ax - runW / 2 + 8 * s, py); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ax + runW / 2 - 8 * s, py); ctx.lineTo(ax + runW / 2 - 3 * s, py); ctx.stroke();
    }

    // Runway Edge Lights
    for (let lx = ax - runW / 2 + 12 * s; lx <= ax + runW / 2 - 12 * s; lx += 18 * s) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(lx, ay + 10 * s, 1.5 * s, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(lx, ay + 30 * s, 1.5 * s, 0, Math.PI * 2); ctx.fill();
    }

    // ── 3D ISOMETRIC PASSENGER TERMINAL CONCOURSE ──
    const termW = 56 * s;
    const termH = 26 * s;
    const depthX = 9 * s;
    const depthY = -7 * s;

    // Terminal Roof (Aerodynamic Curved Gold Canopy)
    ctx.fillStyle = isDark ? '#0f172a' : '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(ax - termW / 2, ay - termH / 2);
    ctx.lineTo(ax - termW / 2 + depthX, ay - termH / 2 + depthY);
    ctx.lineTo(ax + termW / 2 + depthX, ay - termH / 2 + depthY);
    ctx.lineTo(ax + termW / 2, ay - termH / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.2; ctx.stroke();

    // Terminal Glass Facade
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(ax - termW / 2, ay - termH / 2, termW, termH, 4 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // Blue Glass Tint Windows
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(ax - termW / 2 + 4 * s, ay - 7 * s, 20 * s, 14 * s);
    ctx.fillRect(ax + termW / 2 - 24 * s, ay - 7 * s, 20 * s, 14 * s);

    // ── 3D ATC RADAR CONTROL TOWER ──
    const towerX = ax + termW / 2 + 12 * s;
    const towerY = ay - 12 * s;
    // Tower Shaft
    ctx.fillStyle = '#64748b';
    ctx.fillRect(towerX - 3.5 * s, towerY, 7 * s, 20 * s);
    // 360° Glass Cab
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(towerX, towerY, 6 * s, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.2; ctx.stroke();

    // Rotating 3D Radar Antenna
    const radarAngle = (Date.now() * 0.005) % (Math.PI * 2);
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(towerX, towerY - 2 * s);
    ctx.lineTo(towerX + Math.cos(radarAngle) * 7 * s, towerY - 2 * s + Math.sin(radarAngle) * 3.5 * s);
    ctx.stroke();

    // Blinking Red Aviation Beacon Light
    if (Date.now() % 1000 < 500) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(towerX, towerY - 7 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
    }

    // ── 3D ANIMATED COMMERCIAL JET AIRLINER (TAXIING ALONG RUNWAY) ──
    const planeSpan = 120 * s;
    const planeT = (Date.now() * 0.04) % planeSpan;
    const planeX = ax - runW / 2 + planeT;
    const planeY = ay + 20 * s;

    // Plane Shadow on Runway
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(planeX, planeY + 4 * s, 14 * s, 4.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // Jet Fuselage
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(planeX, planeY, 14 * s, 4 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.2; ctx.stroke();

    // Swept Wings
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(planeX - 2 * s, planeY);
    ctx.lineTo(planeX - 11 * s, planeY - 12 * s);
    ctx.lineTo(planeX - 7 * s, planeY);
    ctx.lineTo(planeX - 11 * s, planeY + 12 * s);
    ctx.closePath();
    ctx.fill();

    // Jet Tail Fin
    ctx.fillStyle = '#d4a017';
    ctx.beginPath();
    ctx.moveTo(planeX - 13 * s, planeY);
    ctx.lineTo(planeX - 16 * s, planeY - 7 * s);
    ctx.lineTo(planeX - 10 * s, planeY);
    ctx.closePath();
    ctx.fill();

    // Sharp Dynamic Card
    if (reveal > 0.35) {
      drawCard(ax, ay - Math.round(44 * s), "✈️ BIHTA INT'L AIRPORT", "Right Side of Airport Road", '#1e3a8a', isDark, s);
    }

    ctx.restore();
  }

  // 8.5 3D NIT PATNA CAMPUS (SITUATED ON RIGHT/EAST SIDE OF SOUTH ARA ROAD)
  function drawNITCampusAnimation(nx, ny, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');

    // ── 3D ISOMETRIC NIT ACADEMIC BLOCK ──
    const bw = 70 * s;
    const bh = 36 * s;
    const depthX = 10 * s;
    const depthY = -8 * s;

    // Campus Base
    ctx.fillStyle = isDark ? '#1e293b' : '#eff6ff';
    ctx.beginPath(); ctx.roundRect(nx - 42 * s, ny - 25 * s, 84 * s, 54 * s, 6 * s); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // 3D Roof
    ctx.fillStyle = isDark ? '#0f172a' : '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(nx - bw / 2, ny - bh / 2);
    ctx.lineTo(nx - bw / 2 + depthX, ny - bh / 2 + depthY);
    ctx.lineTo(nx + bw / 2 + depthX, ny - bh / 2 + depthY);
    ctx.lineTo(nx + bw / 2, ny - bh / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.2; ctx.stroke();

    // Front Facade
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.beginPath(); ctx.roundRect(nx - bw / 2, ny - bh / 2, bw, bh, 3 * s); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // Windows Grid
    ctx.fillStyle = '#38bdf8';
    for (let wx = nx - 22 * s; wx <= nx + 14 * s; wx += 12 * s) {
      ctx.fillRect(wx, ny - 10 * s, 8 * s, 6 * s);
      ctx.fillRect(wx, ny + 1 * s, 8 * s, 6 * s);
    }

    // Gold Pediment on Roof
    ctx.fillStyle = '#d4a017';
    ctx.beginPath();
    ctx.moveTo(nx - 14 * s, ny - bh / 2);
    ctx.lineTo(nx, ny - bh / 2 - 10 * s);
    ctx.lineTo(nx + 14 * s, ny - bh / 2);
    ctx.closePath();
    ctx.fill();

    // Sharp Dynamic Card
    if (reveal > 0.35) {
      drawCard(nx, ny - Math.round(48 * s), "🎓 NIT PATNA (BIHTA CAMPUS)", "Right Side along Ara Highway Corridor", '#1e3a8a', isDark, s);
    }

    ctx.restore();
  }

  // 9. 3D IIT PATNA CAMPUS
  function drawIITCampusAnimation(cx, cy, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');

    // Building
    ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
    ctx.beginPath(); ctx.roundRect(cx - 38 * s, cy - 26 * s, 76 * s, 36 * s, 6 * s); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // Sharp Card
    if (reveal > 0.35) {
      drawCard(cx, cy - Math.round(46 * s), "🎓 IIT PATNA (GATE 1)", "Premier Tech Institute (1.5 KM)", '#1e3a8a', isDark, s);
    }

    ctx.restore();
  }

  // 10. GURU NIWAS COLONY (BIHTA) - SITUATED ON LEFT (EAST) SIDE OF FINAL SOUTH APPROACH ROAD
  function drawGuruNiwasFinal(gx, gy, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');
    const roadX = w * 0.92;

    // ── 3D GATED TOWNSHIP GROUND (ON LEFT/EAST SIDE OF ROAD) ──
    const townW = 100 * s;
    const townH = 85 * s;
    const townX = Math.min(w - townW / 2 - 8, roadX + townW / 2 + 10 * s);
    const townY = gy;

    ctx.fillStyle = isDark ? '#1e293b' : '#fefce8';
    ctx.beginPath();
    ctx.roundRect(townX - townW / 2, townY - townH / 2, townW, townH, 10 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2; ctx.stroke();

    // 3D Villas & Plotted Grid Inside Guru Niwas
    ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1'; ctx.lineWidth = 1;
    for (let px = townX - 35 * s; px <= townX + 35 * s; px += 20 * s) {
      for (let py = townY - 28 * s; py <= townY + 28 * s; py += 16 * s) {
        ctx.fillStyle = (Math.cos(px * py) > 0) ? (isDark ? '#0369a1' : '#dbeafe') : (isDark ? '#d4a017' : '#ffffff');
        ctx.fillRect(px, py, 16 * s, 12 * s);
        ctx.strokeRect(px, py, 16 * s, 12 * s);
      }
    }

    // ── GRAND 3D ENTRANCE ARCH (FACING WEST TOWARDS THE ROAD) ──
    const gateX = roadX + 8 * s;
    const gateY = gy;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(gateX - 2 * s, gateY - 16 * s, 5 * s, 32 * s);
    ctx.fillRect(gateX - 2 * s, gateY - 16 * s, 12 * s, 4 * s);
    ctx.fillRect(gateX - 2 * s, gateY + 12 * s, 12 * s, 4 * s);
    ctx.fillStyle = '#fde047';
    ctx.font = `800 ${Math.max(4.5, Math.round(5 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("GURU NIWAS", gateX + 20 * s, gateY + 2 * s);

    // Sharp Dynamic Final Destination Card
    if (reveal > 0.35) {
      drawCard(townX, townY - Math.round(54 * s), "🏆 GURU NIWAS COLONY", "327 Plots Ready for Registry • Left of Road", '#d4a017', isDark, s);
    }

    ctx.restore();
  }

  // Generic Chowk
  function drawGenericChowk(jx, jy, name, km, reveal, theme, s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.3, reveal);
    const isDark = (theme === 'dark');

    ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
    ctx.beginPath(); ctx.arc(jx, jy, Math.round(13 * s), 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath(); ctx.arc(jx, jy, Math.round(4 * s), 0, Math.PI * 2); ctx.fill();

    if (reveal > 0.35) {
      drawCard(jx, jy - Math.round(28 * s), `📍 ${name}`, null, '#cbd5e1', isDark, s);
    }

    ctx.restore();
  }

  // 11. LUXURY VIP SUV (SHARP, CLEAN & VECTOR-CRISP WITH HEADLIGHT BEAMS)
  function drawLuxuryCab(cx, cy, heading, theme, s) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(heading);

    const isDark = (theme === 'dark');

    // 1. DUAL LED HEADLIGHT LIGHT BEAMS (Forward road illumination)
    const beamLen = Math.round(110 * s);
    const beamGrad = ctx.createLinearGradient(14 * s, 0, beamLen, 0);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
    beamGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.45)');
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

    ctx.fillStyle = beamGrad;
    // Left headlight beam
    ctx.beginPath();
    ctx.moveTo(14 * s, -5 * s);
    ctx.lineTo(beamLen, -28 * s);
    ctx.lineTo(beamLen, -3 * s);
    ctx.closePath();
    ctx.fill();

    // Right headlight beam
    ctx.beginPath();
    ctx.moveTo(14 * s, 5 * s);
    ctx.lineTo(beamLen, 3 * s);
    ctx.lineTo(beamLen, 28 * s);
    ctx.closePath();
    ctx.fill();

    // Soft Chassis Drop Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 2 * s, 18 * s, 11 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4 Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-12 * s, -12 * s, 7 * s, 3 * s); // Front L
    ctx.fillRect(5 * s, -12 * s, 7 * s, 3 * s);   // Front R
    ctx.fillRect(-12 * s, 9 * s, 7 * s, 3 * s);   // Rear L
    ctx.fillRect(5 * s, 9 * s, 7 * s, 3 * s);     // Rear R

    // Car Body (Pure White with Dark Blue Trim)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(-14 * s, -9 * s, 28 * s, 18 * s, 4 * s);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    // Roof & Tinted Glass
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-8 * s, -6.5 * s, 15 * s, 13 * s, 3 * s);
    ctx.fill();

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.roundRect(-5 * s, -5 * s, 10 * s, 10 * s, 2 * s);
    ctx.fill();

    // Gold Hood Emblem
    ctx.fillStyle = '#d4a017';
    ctx.beginPath(); ctx.arc(12 * s, 0, 1.8 * s, 0, Math.PI * 2); ctx.fill();

    // Bright Headlight Projector Bulbs
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(13 * s, -5 * s, 2 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(13 * s, 5 * s, 2 * s, 0, Math.PI * 2); ctx.fill();

    // Rear Taillights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-14.5 * s, -6 * s, 1.5 * s, 12 * s);

    ctx.restore();

    // Floating Sharp VIP Tooltip
    ctx.save();
    const tooltipX = cx;
    const tooltipY = cy - Math.round(36 * s);

    // Tether Line
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
    ctx.beginPath(); ctx.moveTo(cx, cy - 10 * s); ctx.lineTo(tooltipX, tooltipY + 11 * s); ctx.stroke();
    ctx.setLineDash([]);

    // Sharp Tooltip Box
    const tipW = Math.round(120 * s);
    const tipH = Math.round(22 * s);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(tooltipX - tipW / 2, tooltipY - tipH / 2, tipW, tipH, 5 * s); ctx.fill();
    ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = `800 ${Math.max(7, Math.round(8.5 * s))}px Montserrat, Inter, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("🚕 SWARUP VIP CAB", tooltipX, tooltipY + Math.round(3 * s));

    ctx.restore();
  }

  let currentProg = 0;
  let targetProg = 0;

  function render() {
    targetProg = scrollProgress();
    currentProg = targetProg;

    const prog = currentProg;
    const currentPt = getPointOnPath(prog);

    if (statusMain && currentPt.title) {
      statusMain.textContent = currentPt.title;
    }
    if (statusSub) {
      statusSub.textContent = `Swarup VIP Site Tour • Progress: ${Math.round(prog * 100)}%`;
    }
    if (progressBar) {
      progressBar.style.width = `${(prog * 100).toFixed(1)}%`;
    }

    const prevPt = getPointOnPath(Math.max(0, prog - 0.008));
    const nextPt = getPointOnPath(Math.min(1, prog + 0.008));
    const vx = currentPt.x * w;
    const vy = currentPt.y;
    const dx = (nextPt.x - prevPt.x) * w;
    const dy = nextPt.y - prevPt.y;

    const heading = (Math.hypot(dx, dy) > 0.001) ? Math.atan2(dy, dx) : 0;
    cameraY = Math.max(0, Math.min(mapH - h, vy - h * 0.38));

    const isDark = (mapTheme === 'dark');
    // Global responsive scale for crisp rendering across all screen sizes
    const s = Math.min(1.0, Math.max(0.60, w / 750));
    const roadW = Math.round(22 * s);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 1. Clean Crisp Map Background
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(0, -cameraY);

    // Subtle Clean Map Grid
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 120) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, mapH); ctx.stroke();
    }
    for (let y = 0; y < mapH; y += 120) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Greenery Land Zones along Corridor
    ctx.fillStyle = isDark ? 'rgba(6, 78, 59, 0.25)' : '#f0fdf4';
    ctx.beginPath(); ctx.roundRect(w * 0.05, 180, w * 0.30, 480, 16); ctx.fill();
    ctx.beginPath(); ctx.roundRect(w * 0.52, 320, w * 0.42, 520, 16); ctx.fill();

    // Continuous NH-30 Highway Spine (Infinite Frame Out)
    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = roadW;
    ctx.beginPath();
    ctx.moveTo(w * 0.42, -150);
    ctx.lineTo(w * 0.42, mapH + 150);
    ctx.stroke();

    // 2. UNVISITED ROAD BASE
    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = roadW;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(path[0].x * w, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x * w, path[i].y);
    }
    ctx.stroke();

    ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(path[0].x * w, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x * w, path[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. REVEALED ASPHALT HIGHWAY (Directly scroll-synced)
    const activeProg = Math.max(0.001, prog);
    const numSteps = Math.max(1, Math.floor(activeProg * 250));

    // Sharp Asphalt Base
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = roadW;
    ctx.beginPath();
    ctx.moveTo(path[0].x * w, path[0].y);
    for (let i = 1; i <= numSteps; i++) {
      const pt = getPointOnPath(i / 250);
      ctx.lineTo(pt.x * w, pt.y);
    }
    ctx.lineTo(vx, vy);
    ctx.stroke();

    // Outer Road Borders in Brand Dark Blue
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(path[0].x * w, path[0].y);
    for (let i = 1; i <= numSteps; i++) {
      const pt = getPointOnPath(i / 250);
      ctx.lineTo(pt.x * w, pt.y);
    }
    ctx.lineTo(vx, vy);
    ctx.stroke();

    // Sharp Golden Dashed Center Lane
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 6]);
    ctx.lineDashOffset = -prog * 300;
    ctx.beginPath();
    ctx.moveTo(path[0].x * w, path[0].y);
    for (let i = 1; i <= numSteps; i++) {
      const pt = getPointOnPath(i / 250);
      ctx.lineTo(pt.x * w, pt.y);
    }
    ctx.lineTo(vx, vy);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. DRAW CRISP LANDMARKS WITH AUTO-RESPONSIVE SCALING
    landmarks.forEach(lm => {
      const reveal = getLandmarkReveal(lm, prog, vx, vy);
      const lx = lm.x * w;
      const ly = lm.y;

      switch(lm.type) {
        case 'saguna_hub':
          drawSagunaMoreHub(lx, ly, reveal, mapTheme, s);
          break;
        case 'station':
          drawStationAnimation(lx, ly, lm.name, reveal, mapTheme, s);
          break;
        case 'hospital_aiims':
          drawHospitalAnimation(lx, ly, lm.name, true, reveal, mapTheme, s);
          break;
        case 'hospital_nsmch':
          drawHospitalAnimation(lx, ly, lm.name, false, reveal, mapTheme, s);
          break;
        case 'education_goal':
          drawGoalInstituteAnimation(lx, ly, reveal, mapTheme, s);
          break;
        case 'patli_bus':
          drawPatliBusStand(lx, ly, reveal, mapTheme, s);
          break;
        case 'ringroad_east':
          drawPatnaRingRoadEast(lx, ly, reveal, prog, mapTheme, s);
          break;
        case 'painathi_entry':
          drawPainathiRoadEntry(lx, ly, reveal, mapTheme, s);
          break;
        case 'township_royal':
          drawRoyalGardenTownship(lx, ly, reveal, mapTheme, s);
          break;
        case 'chowk_bihta':
          drawBihtaChowk(lx, ly, reveal, mapTheme, s);
          break;
        case 'airport':
          drawAirportAnimation(lx, ly, reveal, mapTheme, s);
          break;
        case 'education_nit':
          drawNITCampusAnimation(lx, ly, reveal, mapTheme, s);
          break;
        case 'education_iit':
          drawIITCampusAnimation(lx, ly, reveal, mapTheme, s);
          break;
        case 'township_guru':
          drawGuruNiwasFinal(lx, ly, reveal, mapTheme, s);
          break;
        default:
          drawGenericChowk(lx, ly, lm.name, lm.km, reveal, mapTheme, s);
      }
    });

    // 5. DRAW CRISP VIP CAB
    drawLuxuryCab(vx, vy, heading, mapTheme, s);

    ctx.restore();

    if (isRouteVisible) {
      routeAnimId = requestAnimationFrame(render);
    }
  }

  let isRouteVisible = false;
  let routeAnimId = null;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isRouteVisible = entry.isIntersecting;
        if (isRouteVisible && !routeAnimId) {
          routeAnimId = requestAnimationFrame(render);
        } else if (!isRouteVisible && routeAnimId) {
          cancelAnimationFrame(routeAnimId);
          routeAnimId = null;
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  } else {
    isRouteVisible = true;
    render();
  }
}

/* ==========================================
   HERO CARD 3D PARALLAX TILT & SPOTLIGHT ENGINE
   ========================================== */
function initHeroParallaxTilt() {
  const heroCard = document.querySelector('.hero-poster-card');
  if (!heroCard) return;

  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    heroCard.style.setProperty('--mouse-x', `${x}px`);
    heroCard.style.setProperty('--mouse-y', `${y}px`);

    heroCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================
   SMEULDERS HERO BACKGROUND SLIDER & TEXT CLIPPING MASK ENGINE
   ========================================== */
function initSmeuldersHeroSlider() {
  const slides = document.querySelectorAll('.hero-slider-bg .slide-item');
  const dots = document.querySelectorAll('.hero-slider-controls .slider-dot');
  const heroCards = document.querySelectorAll('.hero-3d-card');
  const titleClip = document.getElementById('hero-clipped-title');
  const subtitleElem = document.getElementById('hero-subtitle-text');
  if (!slides.length) return;

  const bgImages = [
    'assets/swarup_hero_banner.webp',
    'assets/royal_garden_3d_gate.webp',
    'assets/guru_niwas_3d_gate.webp',
    'assets/royal_garden_vibrant.webp'
  ];

  const subtitles = [
    'Redefining Luxury Living in Bihar',
    'Royal Garden Gate — Kanhauli',
    'Guru Niwas Colony — Bihta',
    'Royal Garden Vibrant View — Kanhauli'
  ];

  let currentIndex = 0;
  let autoTimer = null;

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
    if (heroCards.length) {
      heroCards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
      });
    }

    // Update Subtitle Text with Image Name
    if (subtitleElem && subtitles[index]) {
      subtitleElem.textContent = subtitles[index];
    }

    currentIndex = index;
  }

  function nextSlide() {
    const nextIdx = (currentIndex + 1) % slides.length;
    goToSlide(nextIdx);
  }

  function startTimer() {
    stopTimer();
    autoTimer = setInterval(nextSlide, 5000); // Crossfade every 5 seconds
  }

  function stopTimer() {
    if (autoTimer) clearInterval(autoTimer);
  }

  if (dots.length) {
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startTimer();
      });
    });
  }

  if (heroCards.length) {
    heroCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        const targetIdx = parseInt(card.getAttribute('data-slide-target')) || idx;
        goToSlide(targetIdx);
        startTimer();
      });
    });
  }

  startTimer();
}

/* ==========================================
   PURE LIGHT THEME 3-COLUMN GALLERY ENGINE
   ========================================== */
function initGalleryReels() {
  const gallerySection = document.getElementById('gallery-reels');
  if (!gallerySection) return;

  const lotteryCols = document.querySelectorAll('.lottery-col');
  const tabBtns = document.querySelectorAll('.gallery-tab-btn');
  const reelCards = document.querySelectorAll('.square-reel-card');

  const lightboxModal = document.getElementById('gallery-lightbox-modal');
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const lightboxPriceTag = document.getElementById('lightbox-price-tag');
  const lightboxLocText = document.getElementById('lightbox-location-text');
  const specSizes = document.getElementById('spec-sizes');
  const specRoad = document.getElementById('spec-road');
  const specLegal = document.getElementById('spec-legal');
  const specRegistry = document.getElementById('spec-registry');
  const lightboxDistancesCard = document.getElementById('lightbox-distances-card');
  const lightboxDistanceItems = document.getElementById('lightbox-distance-items');
  const lightboxAmenitiesStrip = document.getElementById('lightbox-amenities-strip');
  const lightboxQuoteBox = document.getElementById('lightbox-quote-box');
  const lightboxQuote = document.getElementById('lightbox-quote');
  const lightboxWhatsappBtn = document.getElementById('lightbox-whatsapp-btn');
  const lightboxPdfBtn = document.getElementById('lightbox-pdf-btn');

  // 1. Active Column Highlight
  lotteryCols.forEach(col => {
    col.addEventListener('mouseenter', () => {
      lotteryCols.forEach(c => c.classList.remove('active'));
      col.classList.add('active');
    });
  });

  // 2. Category Tab Filtering
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      reelCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.opacity = '0.2';
          card.style.display = 'none';
        }
      });
    });
  });

  // ── RICH SEO DATA REPOSITORY FOR ALL PROJECTS & SITE VISITS ──
  const projectDatabase = {
    "guru_niwas": {
      title: "Guru Niwas Colony — Bihta (Near IIT Gate 1)",
      category: "Residential Gated Township (327 Plots)",
      price: "₹1,600 / Sq.Ft • From ₹14.40L",
      location: "Bihta, Patna (1.5 KM from IIT Patna Main Gate)",
      img: "assets/guru_niwas_colony.webp",
      desc: "Guru Niwas Colony is Swarup Group's signature 327-plot master-planned residential enclave in Bihta near IIT Patna Gate No. 1. Official Rate: ₹1,600 / Sq.Ft (900 Sq.Ft ~ ₹14.40 Lakh, 1200 Sq.Ft ~ ₹19.20 Lakh, 1600 Sq.Ft ~ ₹25.60 Lakh). 100% verified DLRS survey records with 30-ft concrete roads, underground utilities, and guaranteed instant registry.",
      specs: {
        sizes: "900, 1200 & 1600 Sq.Ft (₹1,600/Sq.Ft)",
        road: "30-Ft Wide Concrete Road",
        legal: "100% Clear Title & Mutation",
        registry: "Immediate on Spot Booking"
      },
      distances: [
        { icon: "school", text: "IIT Patna Gate 1: 1.5 KM" },
        { icon: "local_hospital", text: "NSMCH Hospital: 2.0 KM" },
        { icon: "flight", text: "Bihta Airport: 3.0 KM" },
        { icon: "medical_services", text: "ESIC Hospital: 4.0 KM" },
        { icon: "train", text: "Danapur Station: 20 Mins" },
        { icon: "alt_route", text: "NH-30 Main Highway: 5 Mins" }
      ],
      amenities: ["Rate: ₹1,600 / Sq.Ft", "30-Ft Concrete Roads", "Underground Drainage", "Gated Arch Entry", "24/7 Security", "Solar LED Lights", "Central Temple & Park"],
      pdf: "Guru_Niwas_Colony_Masterplan_Brochure.pdf",
      whatsapp: "Hello Swarup Group, I am interested in Guru Niwas Colony (Bihta - ₹1,600/Sq.Ft). Please share available plot layout map, rate chart, and site visit booking details."
    },
    "royal_garden": {
      title: "Royal Garden — Mouza Painathi, Kanhauli",
      category: "Luxury Villa Township (314 Plots)",
      price: "₹2,700 / Sq.Ft • From ₹28.35L",
      location: "Mouza Painathi, Thana No. 68, Kanhauli (Patna Ring Road)",
      img: "assets/royal_garden_3d_gate.webp",
      desc: "Royal Garden is Swarup Group's flagship 314-plot luxury gated villa township located on the 100-Ft Patna-Bihta Highway corridor. Official Rate: ₹2,700 / Sq.Ft (1050 Sq.Ft ~ ₹28.35 Lakh, 1200 Sq.Ft ~ ₹32.40 Lakh, 1350 Sq.Ft ~ ₹36.45 Lakh, 2700 Sq.Ft ~ ₹72.90 Lakh). Just 500 meters from Patli Bus Stand & Patna Ring Road. Features 3D arch gates, fountain park, and 30-40 ft boulevards.",
      specs: {
        sizes: "1050, 1350, 1800 & 2700 Sq.Ft (₹2,700/Sq.Ft)",
        road: "30-Ft & 40-Ft Boulevards",
        legal: "DLRS Verified • Non-Disputed",
        registry: "Instant Registry & Free Mutation"
      },
      distances: [
        { icon: "directions_bus", text: "Patli Bus Stand: 500M" },
        { icon: "alt_route", text: "Patna Ring Road: 500M" },
        { icon: "school", text: "GOAL Institute: 1.0 KM" },
        { icon: "train", text: "Danapur Station: 6.0 KM" },
        { icon: "local_hospital", text: "AIIMS Patna: 7.0 KM" },
        { icon: "flight", text: "Bihta Airport: 10 KM" }
      ],
      amenities: ["Rate: ₹2,700 / Sq.Ft", "Grand 3D Gate", "Central Blue Fountain", "Kids Park", "30-40 Ft Concrete Roads", "Underground Sewerage", "24/7 CCTV Security"],
      pdf: "Royal_Garden_Kanhauli_Masterplan_Brochure.pdf",
      whatsapp: "Hello Swarup Group, I want complete plot details for Royal Garden Kanhauli (Rate: ₹2,700/Sq.Ft). Please send brochure PDF and available plot list."
    },
    "site_visit": {
      title: "Free VIP AC Cab Site Visit Tour",
      category: "VIP Experience & Guidance",
      price: "100% Free Doorstep Cab",
      location: "Saguna More • Danapur • AIIMS • Patna Junction Pickup",
      img: "assets/site_visit.webp",
      desc: "Experience zero-hassle personalized site visits in our executive AC fleet. Our certified real estate advisors pick you up from your doorstep, guide you through on-ground boundary demarcation, official AutoCAD masterplans, and revenue khatiyan records with total transparency.",
      specs: {
        sizes: "Full Township Tour",
        road: "Doorstep Pickup & Drop",
        legal: "Live Khatiyan & Survey Proof",
        registry: "Free Consultation Included"
      },
      distances: [
        { icon: "directions_car", text: "Saguna More: Free Pickup" },
        { icon: "train", text: "Danapur Station: Free Pickup" },
        { icon: "local_hospital", text: "AIIMS Patna: Free Pickup" },
        { icon: "apartment", text: "Patna City: Doorstep Pickup" }
      ],
      amenities: ["Chauffeur Driven AC Cab", "Senior Advisor Assistance", "On-Spot Demarcation", "Free Legal Document Kit", "Zero Hidden Charges"],
      pdf: "Royal_Garden_Kanhauli_Masterplan_Brochure.pdf",
      whatsapp: "Hello Swarup Group, I would like to book a Free VIP AC Cab Site Visit for my family. Please confirm the pickup time."
    },
    "commercial_hub": {
      title: "Swarup Business Park & Commercial Hub",
      category: "Commercial Showroom & Retail",
      price: "₹60 Lakh+ (Starting)",
      location: "NH-30 Highway Frontage, Saguna More / RPS More Corridor",
      img: "assets/swarup_group_apartments.webp",
      desc: "High-visibility commercial plots, corporate banking floors, and retail showroom frontage along the buzzing NH-30 corridor near Saguna More. Designed for high footfall, premium brand presence, and exponential capital growth.",
      specs: {
        sizes: "1500–4000 Sq.Ft",
        road: "60–100 Ft Highway Frontage",
        legal: "Commercial Conversion Ready",
        registry: "Direct Developer Registry"
      },
      distances: [
        { icon: "storefront", text: "Saguna More: 2 Mins" },
        { icon: "train", text: "Danapur Stn: 5 Mins" },
        { icon: "local_hospital", text: "AIIMS Patna: 10 Mins" },
        { icon: "flight", text: "Patna Airport: 15 Mins" }
      ],
      amenities: ["100-Ft Highway Frontage", "Multi-Level Parking", "24/7 Power Backup", "High Speed Elevators", "Commercial Zone"],
      pdf: "Royal_Garden_Kanhauli_Masterplan_Brochure.pdf",
      whatsapp: "Hello Swarup Group, I am looking for Commercial showroom / plot space near Saguna More. Please send details."
    },
    "customer_feedback": {
      title: "800+ Delighted Families & Instant Registry",
      category: "Trust & Customer Legacy",
      price: "8+ Years Unbroken Trust",
      location: "Across Patna, Bihta, Kanhauli & Ring Road Corridors",
      img: "assets/customer_feedback.webp",
      desc: "Over 800+ families have successfully invested and secured instant registry with Swarup Group. We maintain a 100% legal purity record with complete mutation, clean land titles, and unmatched customer satisfaction across Bihar.",
      specs: {
        sizes: "All Plot Categories",
        road: "Immediate Possession",
        legal: "100% Mutation Record",
        registry: "800+ Registries Delivered"
      },
      distances: [
        { icon: "verified", text: "800+ Happy Families" },
        { icon: "workspace_premium", text: "8+ Yrs Proven Record" },
        { icon: "gavel", text: "100% DLRS Verification" },
        { icon: "thumb_up", text: "5-Star Google Rating" }
      ],
      amenities: ["Legal Consultation", "Immediate Mutation Assistance", "Lifetime Boundary Care", "Dedicated Relationship Manager"],
      pdf: "Royal_Garden_Kanhauli_Masterplan_Brochure.pdf",
      whatsapp: "Hello Swarup Group, I would like to speak to a Senior Property Advisor regarding property investments in Patna."
    }
  };

  // ── FUNCTION TO POPULATE & OPEN RICH SEO FUNNEL MODAL ──
  window.openProjectSeoModal = function(dataKey, customData = {}) {
    const data = projectDatabase[dataKey] || {
      title: customData.title || "Swarup Group Premium Property",
      category: customData.category || "Residential Plots",
      price: customData.price || "Contact for Pricing",
      location: customData.location || "Patna Corridor, Bihar",
      img: customData.img || "assets/guru_niwas_colony.webp",
      desc: customData.desc || "Verified premium real estate offerings by Swarup Group with clear title deeds and immediate registry.",
      specs: customData.specs || { sizes: "900–2400 Sq.Ft", road: "30-50 Ft Road", legal: "100% Mutation Done", registry: "Immediate Registry" },
      distances: customData.distances || [
        { icon: "near_me", text: "Near Patna Ring Road" },
        { icon: "flight", text: "Bihta Airport: 10 Mins" },
        { icon: "train", text: "Danapur Station: 15 Mins" },
        { icon: "local_hospital", text: "AIIMS Patna: 15 Mins" }
      ],
      amenities: customData.amenities || ["30-Ft Wide Road", "Underground Drainage", "Gated Security", "Electricity & Water"],
      pdf: customData.pdf || "Royal_Garden_Kanhauli_Masterplan_Brochure.pdf",
      whatsapp: customData.whatsapp || "Hello Swarup Group, I want more details on this project."
    };

    if (lightboxImg) lightboxImg.src = data.img;
    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxDesc) lightboxDesc.textContent = data.desc;
    if (lightboxPriceTag) lightboxPriceTag.textContent = data.price;
    if (lightboxLocText) lightboxLocText.textContent = data.location;

    if (lightboxBadge) {
      lightboxBadge.className = "reel-badge real-estate";
      lightboxBadge.innerHTML = `<span class="material-symbols-outlined" style="font-size:14px;">verified</span> ${data.category}`;
    }

    if (specSizes) specSizes.textContent = data.specs.sizes;
    if (specRoad) specRoad.textContent = data.specs.road;
    if (specLegal) specLegal.textContent = data.specs.legal;
    if (specRegistry) specRegistry.textContent = data.specs.registry;

    // Distances
    if (lightboxDistanceItems) {
      lightboxDistanceItems.innerHTML = data.distances.map(d => `
        <div class="distance-item">
          <span class="material-symbols-outlined" style="font-size:14px; color:#d4a017;">${d.icon}</span>
          <span>${d.text}</span>
        </div>
      `).join('');
    }

    // Amenities
    if (lightboxAmenitiesStrip) {
      lightboxAmenitiesStrip.innerHTML = data.amenities.map(a => `
        <span class="amenity-chip">
          <span class="material-symbols-outlined" style="font-size:13px;">check_circle</span>
          ${a}
        </span>
      `).join('');
    }

    // PDF Brochure
    if (lightboxPdfBtn) {
      lightboxPdfBtn.href = data.pdf;
      lightboxPdfBtn.download = data.pdf;
    }

    // WhatsApp Direct Link
    if (lightboxWhatsappBtn) {
      const encodedMsg = encodeURIComponent(data.whatsapp);
      lightboxWhatsappBtn.href = `https://wa.me/919939989800?text=${encodedMsg}`;
    }

    // Quote
    if (customData.quote && lightboxQuoteBox && lightboxQuote) {
      lightboxQuote.textContent = customData.quote;
      lightboxQuoteBox.style.display = 'block';
    } else if (lightboxQuoteBox) {
      lightboxQuoteBox.style.display = 'none';
    }

    if (lightboxModal) lightboxModal.classList.add('active');
  };

  // 3. Open Lightbox Modal on Gallery Card Click
  reelCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = card.dataset.title || '';
      const desc = card.dataset.desc || '';
      const img = card.dataset.img || '';
      const cat = card.dataset.category || 'plots';
      const tag = card.dataset.tag || 'Swarup Project';
      const quote = card.dataset.quote;

      let key = 'guru_niwas';
      if (title.toLowerCase().includes('royal garden') || desc.toLowerCase().includes('royal garden')) {
        key = 'royal_garden';
      } else if (title.toLowerCase().includes('visit') || title.toLowerCase().includes('tour')) {
        key = 'site_visit';
      } else if (title.toLowerCase().includes('commercial') || title.toLowerCase().includes('penthouse') || title.toLowerCase().includes('apartment')) {
        key = 'commercial_hub';
      } else if (cat === 'feedback') {
        key = 'customer_feedback';
      }

      window.openProjectSeoModal(key, { title, desc, img, category: tag, quote });
    });
  });

  // 4. Also wire up Project Cards in #plots section to open the modal
  document.querySelectorAll('#plots .project-card').forEach((pCard, idx) => {
    pCard.style.cursor = 'pointer';
    pCard.addEventListener('click', (e) => {
      // Don't trigger if clicked on download button directly
      if (e.target.closest('a[download]')) return;
      
      const cardTitle = pCard.querySelector('h3')?.textContent || '';
      if (cardTitle.toLowerCase().includes('royal garden')) {
        window.openProjectSeoModal('royal_garden');
      } else if (cardTitle.toLowerCase().includes('guru niwas')) {
        window.openProjectSeoModal('guru_niwas');
      } else {
        window.openProjectSeoModal('commercial_hub');
      }
    });
  });

  // 5. Close Lightbox Modal
  if (closeLightboxBtn && lightboxModal) {
    closeLightboxBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }
}

/* ==========================================
   WEBP FRAME SCROLL-DRIVEN VIDEO SCRUBBING ENGINE
   ========================================== */
function initScrollVideoEngine() {
  const section = document.getElementById('scroll-video-section');
  const canvas = document.getElementById('scroll-video-canvas');
  const progressBar = document.getElementById('scroll-video-progress');

  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const frameCount = 150;
  const frames = new Array(frameCount);
  let hasStartedPreload = false;
  let currentFrameIndex = 0;
  let currentDpr = 1;
  let lastW = 0;
  let lastH = 0;

  function resize(force = false) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Mobile viewport stability: prevent canvas re-allocation when URL address bar toggles
    if (!force && lastW === w && Math.abs(lastH - h) < 160 && canvas.width > 0) {
      return;
    }
    lastW = w;
    lastH = h;

    currentDpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * currentDpr);
    canvas.height = Math.round(h * currentDpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    renderFrame(currentFrameIndex);
  }
  window.addEventListener('resize', () => resize(false), { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(() => resize(true), 200), { passive: true });

  // Load Frame 1 immediately for initial display
  const firstImg = new Image();
  firstImg.src = 'scrolling_frames/frame_001.webp';
  firstImg.onload = () => {
    frames[0] = firstImg;
    resize(true);
    renderFrame(0);
  };

  // Eagerly preload all remaining frames for ultra-smooth 60fps scrubbing
  function startPreloadingFrames() {
    if (hasStartedPreload) return;
    hasStartedPreload = true;

    for (let i = 1; i <= frameCount; i++) {
      if (i === 1) continue;
      const img = new Image();
      const padIndex = String(i).padStart(3, '0');
      img.src = `scrolling_frames/frame_${padIndex}.webp`;
      frames[i - 1] = img;
    }
  }

  if ('IntersectionObserver' in window) {
    const preloadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startPreloadingFrames();
          preloadObserver.disconnect();
        }
      });
    }, { rootMargin: '1000px 0px' });
    preloadObserver.observe(section);
  } else {
    setTimeout(startPreloadingFrames, 400);
  }

  function renderFrame(index) {
    let img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find closest loaded frame
      for (let offset = 1; offset < 25; offset++) {
        if (frames[index - offset] && frames[index - offset].complete) {
          img = frames[index - offset];
          break;
        }
        if (frames[index + offset] && frames[index + offset].complete) {
          img = frames[index + offset];
          break;
        }
      }
      if (!img || !img.complete) img = frames[0];
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    ctx.save();
    ctx.scale(currentDpr, currentDpr);
    ctx.imageSmoothingEnabled = true;

    // Full-bleed cover draw on all screen sizes — Seamless edge-to-edge video with 0 black gaps
    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;
    ctx.drawImage(img, nx, ny, nw, nh);

    // Subtle dark gradient vignette on bottom 45% for high-contrast, crystal-clear text readability
    const grad = ctx.createLinearGradient(0, ch * 0.45, 0, ch);
    grad.addColorStop(0, 'rgba(3, 7, 18, 0)');
    grad.addColorStop(0.5, 'rgba(3, 7, 18, 0.45)');
    grad.addColorStop(1, 'rgba(3, 7, 18, 0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, ch * 0.45, cw, ch * 0.55);

    ctx.restore();
  }

  const phases = [
    {
      badge: "PHASE 01 • SITE PREPARATION",
      title: "RAW PLOT & FOUNDATION",
      subtitle: "भूमिलाभ एवं नींव की खुदाई • Site Marking & Ground Excavation"
    },
    {
      badge: "PHASE 02 • STRUCTURAL ERECTION",
      title: "STEEL & CONCRETE FRAMING",
      subtitle: "मजबूत बीम एवं पिलर निर्माण • Heavy Reinforced Slab & Beams"
    },
    {
      badge: "PHASE 03 • EXTERIOR ARCHITECTURE",
      title: "LUXURY GLASS ELEVATION",
      subtitle: "आधुनिक फिनिशिंग एवं इंटीरियर • Modern Facade & Wall Crafting"
    },
    {
      badge: "PHASE 04 • FINAL HANDOVER",
      title: "EXECUTIVE LUXURY BUNGALOW",
      subtitle: "सपनों का महल तैयार • Grand 4BHK Villa & Lush Landscaping"
    }
  ];

  let currentPhaseIndex = -1;
  let titleTimeout = null;
  let subtitleTimeout = null;

  function updatePhaseText(progress) {
    const phaseIndex = Math.min(3, Math.floor(progress * 4));
    if (phaseIndex !== currentPhaseIndex) {
      currentPhaseIndex = phaseIndex;
      const phase = phases[phaseIndex];
      const badgeEl = document.getElementById('scroll-phase-badge');
      const titleEl = document.getElementById('scroll-video-title');
      const subtitleEl = document.getElementById('scroll-video-subtitle');

      if (badgeEl) badgeEl.textContent = phase.badge;
      
      if (titleEl) {
        if (titleTimeout) clearTimeout(titleTimeout);
        titleEl.style.opacity = '0';
        titleEl.style.transform = 'translateY(6px)';
        titleTimeout = setTimeout(() => {
          titleEl.textContent = phase.title;
          titleEl.style.opacity = '1';
          titleEl.style.transform = 'translateY(0)';
        }, 100);
      }
      if (subtitleEl) {
        if (subtitleTimeout) clearTimeout(subtitleTimeout);
        subtitleEl.style.opacity = '0';
        subtitleTimeout = setTimeout(() => {
          subtitleEl.textContent = phase.subtitle;
          subtitleEl.style.opacity = '1';
        }, 100);
      }
    }
  }

  let ticking = false;
  function updateScroll() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    // If section is offscreen, skip work entirely
    if (rect.bottom < -50 || rect.top > vh + 50) {
      ticking = false;
      return;
    }

    const totalScroll = rect.height - vh;
    if (totalScroll <= 0) {
      ticking = false;
      return;
    }
    const progress = Math.max(0, Math.min(1, -rect.top / totalScroll));

    if (progressBar) {
      progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    updatePhaseText(progress);

    const frameIndex = Math.min(frameCount - 1, Math.floor(progress * frameCount));
    if (frameIndex !== currentFrameIndex) {
      currentFrameIndex = frameIndex;
      renderFrame(currentFrameIndex);
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });

  resize(true);
}

/* ==========================================
   3D ARCHITECTURAL GATE RENDER SHOWCASE MODAL ENGINE
   ========================================== */
function init3DGateModal() {
  const modal = document.getElementById('gate-3d-modal');
  const closeBtn = document.getElementById('close-gate-3d-modal-btn');
  const modalImg = document.getElementById('gate-modal-img');
  const modalTitle = document.getElementById('gate-modal-title');
  const modalDesc = document.getElementById('gate-modal-desc');
  const tabBtns = document.querySelectorAll('.gate-tab-btn');

  if (!modal) return;

  const gateData = {
    master: {
      img: 'assets/swarup_group_3d_master.webp',
      title: 'Swarup Group Flagship Master 3D Gate Render',
      desc: 'Autodesk Maya & 3ds Max Architectural Render • Combined Flagship Gate with Metallic Gold Arch, Illuminated 3D Signage & CAD Blueprint Wireframe Details.'
    },
    guru_niwas: {
      img: 'assets/guru_niwas_3d_gate.webp',
      title: 'Guru Niwas Colony 3D Gate (Bihta, Patna)',
      desc: 'Bihta Patna Corridor • Architectural Maya 3D Gate with Double Stone Archway, 30-ft Asphalt Boulevard, Streetlights & Landscaping.'
    },
    royal_garden: {
      img: 'assets/royal_garden_3d_gate.webp',
      title: 'Royal Garden Colony 3D Gate (Kanhauli, Patna)',
      desc: 'Kanhauli Ring Road Corridor • Regal Royal Arch Entrance Gate, Guard Kiosk, Manicured Gardens & Gated Villa Security Boundary.'
    }
  };

  function setGate(key) {
    const data = gateData[key] || gateData.master;
    if (modalImg) modalImg.src = data.img;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;

    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-gate') === key);
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-gate');
      setGate(key);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  window.open3DGateModal = function(key = 'master') {
    setGate(key);
    modal.classList.add('active');
  };
}

/* ==========================================
   KYC BOOKING MODAL LOGIC
   ========================================== */
let currentKycProject = 'Royal Garden';

window.openKycModal = function(plotNum, sqft, price, isCorner, projectType) {
  const modal = document.getElementById('kyc-modal');
  if (!modal) return;
  
  currentKycProject = (projectType === 'royal_garden') ? 'Royal Garden (Kanhauli - Bihta Highway)' : 'Guru Niwas Colony (IIT Bihta)';

  // Close plot modal if open
  const plotModal = document.getElementById('plot-inspect-modal');
  if (plotModal) plotModal.remove();

  // Populate fields
  const today = new Date().toISOString().split('T')[0];
  if (document.getElementById('kyc-date')) document.getElementById('kyc-date').value = today;
  if (document.getElementById('kyc-plot-no')) document.getElementById('kyc-plot-no').value = plotNum;
  if (document.getElementById('kyc-plot-size')) document.getElementById('kyc-plot-size').value = sqft + (String(sqft).includes('Sq.Ft') ? '' : ' Sq.Ft.');
  if (document.getElementById('kyc-booking-amount')) document.getElementById('kyc-booking-amount').value = price;
  
  // Use correct rate based on project type
  const rate = (projectType === 'royal_garden') ? 2600 : 1600;
  if (document.getElementById('kyc-booking-rate')) document.getElementById('kyc-booking-rate').value = "₹" + rate + " / Sq.Ft.";

  modal.classList.add('active');
};

document.getElementById('close-kyc-btn')?.addEventListener('click', () => {
  document.getElementById('kyc-modal').classList.remove('active');
});

document.getElementById('kyc-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'kyc-modal') e.target.classList.remove('active');
});

window.submitKycForm = function() {
  const plotNo = document.getElementById('kyc-plot-no')?.value || 'N/A';
  const plotSize = document.getElementById('kyc-plot-size')?.value || 'N/A';
  const bookingAmt = document.getElementById('kyc-booking-amount')?.value || 'N/A';
  const bookingRate = document.getElementById('kyc-booking-rate')?.value || 'N/A';
  const date = document.getElementById('kyc-date')?.value || new Date().toLocaleDateString();

  const name = document.getElementById('kyc-name')?.value.trim();
  const mobile = document.getElementById('kyc-mobile')?.value.trim();
  
  if (!name || !mobile) {
    alert("Please enter at least your Full Name and Mobile Number to submit the booking form.");
    return;
  }

  const relative = document.getElementById('kyc-relative')?.value.trim() || 'N/A';
  const dd = document.getElementById('kyc-dob-dd')?.value.trim() || '';
  const mm = document.getElementById('kyc-dob-mm')?.value.trim() || '';
  const yyyy = document.getElementById('kyc-dob-yyyy')?.value.trim() || '';
  const dob = (dd && mm && yyyy) ? `${dd}/${mm}/${yyyy}` : 'N/A';
  
  const marital = document.querySelector('input[name="kyc-marital"]:checked')?.value || 'N/A';
  const gender = document.querySelector('input[name="kyc-gender"]:checked')?.value || 'N/A';
  const nominee = document.getElementById('kyc-nominee')?.value.trim() || 'N/A';
  const relation = document.getElementById('kyc-relation')?.value.trim() || 'N/A';
  
  const presAddr1 = document.getElementById('kyc-pres-addr-1')?.value.trim() || '';
  const presAddr2 = document.getElementById('kyc-pres-addr-2')?.value.trim() || '';
  const presAddr = (presAddr1 + ' ' + presAddr2).trim() || 'N/A';
  
  const city = document.getElementById('kyc-city')?.value.trim() || 'Patna';
  const district = document.getElementById('kyc-district')?.value.trim() || 'Patna';
  const state = document.getElementById('kyc-state')?.value.trim() || 'Bihar';
  const pincode = document.getElementById('kyc-pincode')?.value.trim() || 'N/A';
  
  const altPhone = document.getElementById('kyc-phone')?.value.trim() || 'N/A';
  const email = document.getElementById('kyc-email')?.value.trim() || 'N/A';
  const aadhar = document.getElementById('kyc-aadhar')?.value.trim() || 'N/A';
  const pan = document.getElementById('kyc-pan')?.value.trim() || 'N/A';

  const waMsg = 
    `📋 *NEW PLOT BOOKING & KYC APPLICATION* 📋\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🏢 *Township Project:* ${currentKycProject}\n` +
    `🏡 *Plot Number:* ${plotNo}\n` +
    `📐 *Plot Area:* ${plotSize}\n` +
    `💰 *Estimated Value / Amount:* ${bookingAmt}\n` +
    `🏷️ *Booking Rate:* ${bookingRate}\n` +
    `📅 *Submission Date:* ${date}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *CUSTOMER INFORMATION:*\n` +
    `• Full Name: ${name}\n` +
    `• S/o, D/o, W/o: ${relative}\n` +
    `• DOB: ${dob} | Gender: ${gender} | Marital: ${marital}\n` +
    `• Primary Mobile: ${mobile}\n` +
    `• Alternate Phone: ${altPhone}\n` +
    `• Email: ${email}\n` +
    `• Address: ${presAddr}, ${city}, ${district}, ${state} - ${pincode}\n` +
    `• Nominee: ${nominee} (Relation: ${relation})\n` +
    `• Aadhar: ${aadhar} | PAN: ${pan}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📍 *Swarup Group Real Estate Developer, Patna*`;

  const waUrl = `https://wa.me/917061556404?text=${encodeURIComponent(waMsg)}`;

  // Dispatch full booking application data directly to swarupinfragroup@gmail.com and archive locally
  if (typeof window.dispatchLeadToEmail === 'function') {
    window.dispatchLeadToEmail({
      "Application Type": "Online Plot Booking & KYC Form",
      "Township Project": currentKycProject,
      "Plot Number": plotNo,
      "Plot Area": plotSize,
      "Booking Amount": bookingAmt,
      "Booking Rate": bookingRate,
      "Submission Date": date,
      "Customer Full Name": name,
      "Father / Husband Name": relative,
      "Date of Birth": dob,
      "Gender": gender,
      "Marital Status": marital,
      "Primary Mobile": mobile,
      "Alternate Phone": altPhone,
      "Customer Email": email,
      "Full Address": `${presAddr}, ${city}, ${district}, ${state} - ${pincode}`,
      "Nominee Name": nominee,
      "Nominee Relation": relation,
      "Aadhar Number": aadhar,
      "PAN Number": pan,
      "Source": "Website KYC Application Portal"
    }, `📋 KYC Booking Form: ${name} - Plot ${plotNo} (${currentKycProject})`);
  }

  window.open(waUrl, '_blank');

  document.getElementById('kyc-modal').classList.remove('active');
  document.getElementById('kyc-success-overlay').style.display = 'flex';
  
  // Fire confetti
  if (typeof confetti === 'function') {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }
};

window.closeKycSuccess = function() {
  document.getElementById('kyc-success-overlay').style.display = 'none';
};

window.previewKycPhoto = function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('kyc-photo-preview').src = e.target.result;
      document.getElementById('kyc-photo-preview').style.display = 'block';
      document.getElementById('kyc-photo-placeholder').style.display = 'none';
    }
    reader.readAsDataURL(file);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initSmeuldersHeroSlider === 'function') initSmeuldersHeroSlider();
  if (typeof initGalleryReels === 'function') initGalleryReels();
  if (typeof initScrollVideoEngine === 'function') initScrollVideoEngine();
  if (typeof init3DGateModal === 'function') init3DGateModal();
  if (typeof initSwarupAiBot === 'function') initSwarupAiBot();
});

/* ==========================================
   SWARUP AI VIRTUAL ASSISTANT BOT WITH VOICEOVER
   ========================================== */
function initSwarupAiBot() {
  const container = document.getElementById('swarup-bot-container');
  if (!container) return;

  const triggerBtn = document.getElementById('swarup-bot-trigger');
  const botWindow = document.getElementById('swarup-bot-window');
  const closeBtn = document.getElementById('bot-close-btn');
  const voiceToggleBtn = document.getElementById('bot-voice-toggle');
  const voiceIcon = document.getElementById('bot-voice-icon');
  const voiceBanner = document.getElementById('bot-voice-banner');
  const voiceText = document.getElementById('bot-voice-text');
  const replaySpeechBtn = document.getElementById('bot-replay-speech');
  const messagesContainer = document.getElementById('bot-messages');
  const inputForm = document.getElementById('bot-input-form');
  const userInput = document.getElementById('bot-user-input');
  const quickChips = document.getElementById('bot-quick-chips');

  let isVoiceActive = true;
  let isWindowOpen = false;
  let hasSpokenGreeting = false;

  // --- Soft Serene Luxury Chime for Calm & Happy Ambience (Instant Local Synthesizer) ---
  function playSoftWelcomeChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const now = ctx.currentTime;
      
      // Note 1: Soft C5 to E5 gentle swell
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.45);

      // Note 2: Warm G5 chime fade
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.15);
      gain2.gain.setValueAtTime(0.06, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.75);
    } catch(e) {
      // Audio context silently handled
    }
  }

  // --- Ultra-Fast Native Browser Speech Engine (0ms Network Latency) ---
  function speakGreeting(customText) {
    if (!isVoiceActive) return;

    playSoftWelcomeChime();

    const textToSpeak = customText || "नमस्ते! स्वरूप ग्रुप में आपका हार्दिक स्वागत है।";

    if (voiceBanner) {
      voiceBanner.style.display = 'flex';
      voiceBanner.style.opacity = '1';
    }
    if (voiceText) {
      voiceText.textContent = `Voice: "${textToSpeak}"`;
    }

    if (!('speechSynthesis' in window)) {
      setTimeout(() => {
        if (voiceBanner) voiceBanner.style.opacity = '0.7';
      }, 1500);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
      (v.name.toLowerCase().includes('female') || 
       v.name.toLowerCase().includes('swara') || 
       v.name.toLowerCase().includes('kalpana') || 
       v.name.toLowerCase().includes('zira') || 
       v.name.toLowerCase().includes('neerja') || 
       v.name.toLowerCase().includes('heera') ||
       v.name.toLowerCase().includes('google') ||
       v.name.toLowerCase().includes('aditi') ||
       v.name.toLowerCase().includes('hindi')) &&
      (v.lang.includes('hi') || v.lang.includes('IN'))
    ) || voices.find(v => v.lang.includes('hi')) || voices.find(v => v.lang.includes('IN'));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = function() {
      setTimeout(() => {
        if (voiceBanner) voiceBanner.style.opacity = '0.7';
      }, 800);
    };

    try {
      window.speechSynthesis.speak(utterance);
      hasSpokenGreeting = true;
    } catch(e) {
      // Handled safely
    }
  }

  // --- Instant Window Toggle Functions ---
  function openBotWindow(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    isWindowOpen = true;
    botWindow.classList.remove('bot-window-closed');
    triggerBtn.setAttribute('aria-expanded', 'true');
    if (!hasSpokenGreeting) {
      speakGreeting("नमस्ते! स्वरूप ग्रुप में आपका हार्दिक स्वागत है।");
    }
  }

  function closeBotWindow(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    isWindowOpen = false;
    botWindow.classList.add('bot-window-closed');
    triggerBtn.setAttribute('aria-expanded', 'false');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  triggerBtn.addEventListener('click', (e) => {
    if (isWindowOpen) closeBotWindow(e);
    else openBotWindow(e);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeBotWindow);
    closeBtn.addEventListener('touchend', closeBotWindow);
  }

  // Close on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isWindowOpen) {
      closeBotWindow();
    }
  });

  voiceToggleBtn.addEventListener('click', () => {
    isVoiceActive = !isVoiceActive;
    if (isVoiceActive) {
      voiceToggleBtn.classList.add('voice-active');
      voiceIcon.textContent = 'volume_up';
      speakGreeting("नमस्ते! स्वरूप ग्रुप में आपका हार्दिक स्वागत है।");
    } else {
      voiceToggleBtn.classList.remove('voice-active');
      voiceIcon.textContent = 'volume_off';
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (voiceBanner) voiceBanner.style.display = 'none';
    }
  });

  replaySpeechBtn.addEventListener('click', () => {
    isVoiceActive = true;
    voiceToggleBtn.classList.add('voice-active');
    voiceIcon.textContent = 'volume_up';
    speakGreeting("नमस्ते! स्वरूप ग्रुप में आपका हार्दिक स्वागत है।");
  });

  // --- Initial Welcome Message ---
  function addInitialWelcome() {
    const welcomeHtml = `
      <p>Namaste! 🙏 <strong>Swarup Group me aapka swagat hai!</strong></p>
      <p>Main aapka AI Assistant hoon. Patna me premium plots aur real estate investments ki jaankari ke liye tayyar hoon.</p>
    `;
    addBotMsg(welcomeHtml, [
      { label: '👑 Royal Garden Plots', action: 'royal-garden' },
      { label: '🏡 Guru Niwas Plots', action: 'guru-niwas' },
      { label: '💰 Price Estimator', action: 'calc-price' },
      { label: '🚗 Free Site Visit', action: 'book-visit' }
    ]);
  }

  // --- Message UI Builders ---
  function addBotMsg(htmlContent, actionBtns = []) {
    const row = document.createElement('div');
    row.className = 'bot-msg-row';
    
    let actionsMarkup = '';
    if (actionBtns && actionBtns.length > 0) {
      actionsMarkup = `<div class="bot-msg-actions">` +
        actionBtns.map(btn => `<button class="bot-action-btn" data-action="${btn.action}">${btn.label}</button>`).join('') +
        `</div>`;
    }

    row.innerHTML = `
      <div class="bot-msg-avatar">
        <img src="assets/bot_ai_avatar.svg" alt="Bot">
      </div>
      <div class="bot-msg-bubble">
        ${htmlContent}
        ${actionsMarkup}
      </div>
    `;

    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Attach listener to any message action buttons
    row.querySelectorAll('.bot-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        handleAction(btn.getAttribute('data-action'));
      });
    });
  }

  function addUserMsg(text) {
    const row = document.createElement('div');
    row.className = 'bot-msg-row user-msg';
    row.innerHTML = `
      <div class="bot-msg-bubble">
        <p>${escapeHtml(text)}</p>
      </div>
    `;
    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'bot-msg-row bot-typing';
    row.id = 'bot-typing-indicator';
    row.innerHTML = `
      <div class="bot-msg-avatar"><img src="assets/bot_ai_avatar.svg" alt="Bot"></div>
      <div class="bot-msg-bubble typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('bot-typing-indicator');
    if (indicator) indicator.remove();
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // --- Quick Action Handler ---
  function handleAction(actionKey) {
    if (actionKey === 'royal-garden') {
      addUserMsg("Tell me about Royal Garden");
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addBotMsg(`
          <p><strong>👑 Royal Garden — Kanhauli Patli Bus Stand (Bihta-Patna Highway)</strong></p>
          <p>Patna ka most prestigious residential township layout!</p>
          <p>• Location: <strong>Kanhauli Patli Bus Stand ke paas</strong><br>• Plot Sizes: 1200, 1500, 2400 sqft<br>• Rate: Starting ₹2,600 / sqft<br>• 30ft & 40ft wide main roads, temple, parks & streetlights.</p>
        `, [
          { label: '🚗 Book Free VIP Site Visit', action: 'book-visit' },
          { label: '💰 Price Estimator', action: 'calc-price' },
          { label: '💬 WhatsApp Inquiry', action: 'whatsapp' }
        ]);
        speakGreeting("रॉयल गार्डन कन्हौली पतली बस स्टैंड के पास स्थित है।");
      }, 400);
    } 
    else if (actionKey === 'guru-niwas') {
      addUserMsg("Tell me about Guru Niwas");
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addBotMsg(`
          <p><strong>🏡 Guru Niwas — Near IIT Gate No. 1 (Bihta Patna)</strong></p>
          <p>Prime township location close to IIT Patna Gate No. 1, NSMCH Hospital, and Bihta Airport corridor!</p>
          <p>• Location: <strong>IIT Gate No. 1 ke paas (Bihta)</strong><br>• High appreciation property with verified 30-ft wide roads for instant home construction.</p>
        `, [
          { label: '🚗 Book Site Visit', action: 'book-visit' },
          { label: '📋 Fill Booking Form', action: 'kyc-form' }
        ]);
        speakGreeting("गुरु निवास आईआईटी गेट नंबर 1 के पास स्थित है।");
      }, 400);
    }
    else if (actionKey === 'calc-price') {
      addUserMsg("Calculate Plot Price");
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addBotMsg(`<p>Price Estimator section scroll ho gaya hai. Aap plot size aur facing choose kar exact budget dekh sakte hain!</p>`);
        const calcElem = document.getElementById('calculator');
        if (calcElem) calcElem.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
    else if (actionKey === 'book-visit') {
      addUserMsg("Book VIP Site Visit");
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addBotMsg(`<p>VIP Site Visit modal open kar diya gaya hai. Kripya apna name aur phone fill karein, hamari luxury cab aapko pickup karegi!</p>`);
        if (typeof window.triggerVipModal === 'function') {
          window.triggerVipModal();
        }
      }, 300);
    }
    else if (actionKey === 'kyc-form') {
      addUserMsg("Open KYC Booking Form");
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addBotMsg(`<p>Online KYC Booking form open ho gaya hai. Aap direct online form fill karke plot hold kar sakte hain.</p>`);
        const kycModal = document.getElementById('kyc-modal');
        if (kycModal) kycModal.style.display = 'block';
      }, 300);
    }
    else if (actionKey === 'whatsapp') {
      window.open('https://wa.me/917061556404?text=Hello%20Swarup%20Group,%20I%20want%20to%20know%20more%20about%20plots.', '_blank');
    }
    else if (actionKey === 'instagram') {
      window.open('https://www.instagram.com/swarup.group?igsh=MWVxd3Fsb3R3Y3pxMg==', '_blank');
    }
    else if (actionKey === 'facebook') {
      window.open('https://www.facebook.com/profile.php?id=61568916357284', '_blank');
    }
    else if (actionKey === 'maps') {
      window.open('https://maps.app.goo.gl/ESxtKLBJFiaKFHb49', '_blank');
    }
  }

  // Attach listeners to static chips
  quickChips.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleAction(btn.getAttribute('data-action'));
    });
  });

  // --- Input Form Handler ---
  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    addUserMsg(query);
    userInput.value = '';
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      processUserQuery(query.toLowerCase());
    }, 500);
  });

  function processUserQuery(q) {
    if (q.includes('royal') || q.includes('kanhauli') || q.includes('bihta')) {
      handleAction('royal-garden');
    }
    else if (q.includes('guru') || q.includes('iit') || q.includes('gate')) {
      handleAction('guru-niwas');
    }
    else if (q.includes('instagram') || q.includes('insta') || q.includes('reels') || q.includes('@swarup')) {
      addBotMsg(`
        <p><strong>📸 Swarup Group Official Instagram:</strong></p>
        <p>Hamare official Instagram handle <strong>@swarup.group</strong> par visit karein aur daily site videos, drone walkthroughs aur reels dekhein!</p>
      `, [
        { label: '📸 Open Instagram Profile', action: 'instagram' },
        { label: '💬 WhatsApp Direct', action: 'whatsapp' }
      ]);
      speakGreeting("स्वरूप ग्रुप का इंस्टाग्राम प्रोफाइल देखने के लिए बटन पर क्लिक करें");
    }
    else if (q.includes('facebook') || q.includes('fb') || q.includes('social') || q.includes('page')) {
      addBotMsg(`
        <p><strong>🌐 Swarup Group Official Facebook Page:</strong></p>
        <p>Hamare official Facebook page par visit karke aap ongoing developments, videos aur customer reviews dekh sakte hain.</p>
      `, [
        { label: '🌐 Open Facebook Page', action: 'facebook' },
        { label: '📸 Instagram @swarup.group', action: 'instagram' },
        { label: '💬 Chat on WhatsApp', action: 'whatsapp' }
      ]);
      speakGreeting("स्वरूप ग्रुप का फेसबुक पेज ओपन करने के लिए बटन पर क्लिक करें");
    }
    else if (q.includes('map') || q.includes('location') || q.includes('gmb') || q.includes('direction') || q.includes('kahan') || q.includes('office') || q.includes('address')) {
      addBotMsg(`
        <p><strong>📍 Swarup Group Corporate Office & Google Maps:</strong></p>
        <p>Flat No. 502, 5th Floor, Rupa Tower, Near RPS More, Beside Patna Doon Public School, Danapur, Patna, Bihar.</p>
        <p>⭐ <strong>Google Verified Business Profile: 4.9 / 5.0</strong></p>
      `, [
        { label: '📍 Get Google Maps Directions', action: 'maps' },
        { label: '💬 WhatsApp Sales Team', action: 'whatsapp' }
      ]);
      speakGreeting("स्वरूप ग्रुप का ऑफिस दानापुर आरपीएस मोड़ के पास रूपा टावर में है");
    }
    else if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('daam') || q.includes('kitna')) {
      addBotMsg(`
        <p><strong>Swarup Group Plot Pricing & Rates:</strong></p>
        <p>• Royal Garden: <strong>₹2,600 / sq.ft.</strong></p>
        <p>• Guru Niwas: <strong>₹1,600 / sq.ft.</strong></p>
        <p>• 1200 Sqft plot (Royal Garden) ~ ₹31.20 Lakhs<br>• Corner plots carry 10% premium location advantage.</p>
      `, [
        { label: '💰 Open Price Estimator', action: 'calc-price' },
        { label: '🚗 Book Free Visit', action: 'book-visit' }
      ]);
      speakGreeting("रॉयल गार्डन में प्लॉट का रेट 2600 रुपए और गुरु निवास में 1600 रुपए स्क्वायर फीट है");
    }
    else if (q.includes('visit') || q.includes('dekhena') || q.includes('book') || q.includes('cab')) {
      handleAction('book-visit');
    }
    else if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('email') || q.includes('mail')) {
      addBotMsg(`
        <p><strong>🏢 Swarup Group Official Contact & Helpline:</strong></p>
        <p>Flat No. 502, 5th Floor, Rupa Tower, Near RPS More, Danapur, Patna.</p>
        <p>📞 <strong>WhatsApp / Call:</strong> +91 70615 56404<br>📧 <strong>Official Email:</strong> swarupinfragroup@gmail.com</p>
      `, [
        { label: '💬 WhatsApp Sales Team', action: 'whatsapp' },
        { label: '📸 Instagram Profile', action: 'instagram' },
        { label: '🌐 Facebook Page', action: 'facebook' }
      ]);
      speakGreeting("आप हमारे हेल्पलाइन नंबर या ऑफिशियल ईमेल पर संपर्क कर सकते हैं");
    }
    else {
      addBotMsg(`
        <p>Swarup Group Patna me luxury plots aur prime land investment ka sabse bharosemand developer hai.</p>
        <p>Aap niche options se jankari le sakte hain ya sales team se baat kar sakte hain:</p>
      `, [
        { label: '👑 Royal Garden Plots', action: 'royal-garden' },
        { label: '🚗 Free VIP Site Visit', action: 'book-visit' },
        { label: '💬 WhatsApp Direct', action: 'whatsapp' }
      ]);
      speakGreeting("स्वरूप ग्रुप में आपका स्वागत है!");
    }
  }

  // Add Initial Welcome Message
  addInitialWelcome();

  // Autoplay fallback setup
  setupAutoplayFallback();

  // Auto-Open Window after 1.2 seconds when site opens!
  setTimeout(() => {
    openBotWindow();
  }, 1200);
}

// ════════════════════════════════════════════════════════════════
// STATS COUNTER SPEED COUNT-UP ANIMATION ON SCROLL
// ════════════════════════════════════════════════════════════════
function initStatsCounterAnimation() {
  const statsSection = document.querySelector('.stats-bar');
  if (!statsSection) return;

  const counters = statsSection.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let hasAnimated = false;

  function runSpeedCountUp() {
    if (hasAnimated) return;
    hasAnimated = true;

    counters.forEach(counter => {
      const rawTarget = counter.getAttribute('data-target') || counter.innerText.replace(/[^0-9.]/g, '');
      const target = parseFloat(rawTarget) || 0;
      const prefix = counter.getAttribute('data-prefix') || '';
      let suffix = counter.getAttribute('data-suffix');
      if (suffix === null || suffix === undefined) {
        if (counter.innerText.includes('%')) suffix = '%';
        else if (counter.innerText.includes('+ Yrs')) suffix = '+ Yrs';
        else if (counter.innerText.includes('+')) suffix = '+';
        else suffix = '';
      }

      // Reset counter to 0 before starting count-up
      counter.textContent = prefix + '0' + suffix;
      counter.classList.remove('stat-counted');

      const duration = 1800; // 1.8 seconds speed count-up duration
      const startTime = performance.now();

      function frame(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // High-velocity deceleration curve (ease-out quart)
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.round(easeOut * target);

        counter.textContent = prefix + currentVal.toLocaleString('en-IN') + suffix;

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          counter.textContent = prefix + target.toLocaleString('en-IN') + suffix;
          counter.classList.add('stat-counted');
        }
      }

      requestAnimationFrame(frame);
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runSpeedCountUp();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(statsSection);
  } else {
    runSpeedCountUp();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStatsCounterAnimation);
} else {
  initStatsCounterAnimation();
}

/* ==========================================
   GOOGLE ANALYTICS 4 (GA4) REAL ESTATE CONVERSION TRACKER
   Measurement ID: G-XKP8NR63SL
   ========================================== */
function initGA4EventTracking() {
  function sendGA4(eventName, params = {}) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        send_to: 'G-XKP8NR63SL',
        ...params
      });
    }
  }

  // 1. Phone Call Clicks Track (+91-7061556404)
  document.addEventListener('click', (e) => {
    const telLink = e.target.closest('a[href^="tel:"]');
    if (telLink) {
      const phoneNumber = telLink.getAttribute('href').replace('tel:', '');
      sendGA4('phone_call_click', {
        event_category: 'Direct Lead',
        event_label: phoneNumber,
        value: 50
      });
    }

    // 2. WhatsApp Chat Clicks
    const waLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (waLink) {
      sendGA4('whatsapp_chat_click', {
        event_category: 'Direct Lead',
        event_label: 'WhatsApp Inquiry',
        value: 40
      });
    }

    // 3. Official PDF Brochure Downloads
    const pdfLink = e.target.closest('a[href$=".pdf"], a[download]');
    if (pdfLink) {
      const fileName = pdfLink.getAttribute('href') || pdfLink.getAttribute('download') || 'Brochure.pdf';
      sendGA4('file_download', {
        event_category: 'Brochure',
        event_label: fileName,
        file_name: fileName,
        value: 20
      });
    }

    // 4. Site Visit Cab Modal Open
    const visitBtn = e.target.closest('.open-vip-modal, button:has(.material-symbols-outlined)');
    if (visitBtn && (visitBtn.textContent.includes('Site Visit') || visitBtn.textContent.includes('Cab') || visitBtn.classList.contains('open-vip-modal'))) {
      sendGA4('site_visit_modal_open', {
        event_category: 'Lead Engagement',
        event_label: 'Site Visit Modal Opened'
      });
    }
  }, { passive: true });

  // 5. Booking / KYC Form Lead Generation Submission
  const bookingForms = document.querySelectorAll('#kyc-booking-form, form');
  bookingForms.forEach(form => {
    form.addEventListener('submit', () => {
      sendGA4('generate_lead', {
        event_category: 'High Value Conversion',
        lead_type: 'VIP Site Visit Booking',
        currency: 'INR',
        value: 500
      });
    }, { passive: true });
  });

  // 6. Bihar Bhumi Mapan Calculator Usage
  const calcInputs = document.querySelectorAll('#calc-input-val, #calc-laggi-select');
  calcInputs.forEach(input => {
    input.addEventListener('change', () => {
      sendGA4('calculator_used', {
        event_category: 'SEO Utility Tool',
        event_label: 'Bihar Bhumi Mapan Calculator',
        value: 10
      });
    }, { passive: true });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGA4EventTracking);
} else {
  initGA4EventTracking();
}



// 🌟 TOGGLE PROJECT READ MORE / COLLAPSE 🌟
window.toggleProjectDetails = function(contentId, btnId) {
  const content = document.getElementById(contentId);
  const btn = document.getElementById(btnId);
  if (!content) return;
  
  const isHidden = content.style.display === 'none' || !content.style.display;
  if (isHidden) {
    content.style.display = 'block';
    if (btn) btn.textContent = 'Read Less Details';
  } else {
    content.style.display = 'none';
    if (btn) btn.textContent = 'Read More Details';
  }
};

// 🌟 WHY US INTERACTIVE FUNNEL CONTROLLER 🌟
window.openWhyFunnel = function(pillarKey) {
  const container = document.getElementById('why-funnel-box');
  if (!container) return;

  // Deactivate all cards, pills, and panes
  document.querySelectorAll('.why-card').forEach(card => {
    card.classList.remove('active-funnel');
    const btn = card.querySelector('.why-funnel-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
  document.querySelectorAll('.why-funnel-pill').forEach(pill => pill.classList.remove('active'));
  document.querySelectorAll('.why-funnel-content-pane').forEach(pane => pane.classList.remove('active'));

  // Activate selected card
  const targetCard = document.getElementById('why-card-' + pillarKey);
  if (targetCard) {
    targetCard.classList.add('active-funnel');
    const btn = targetCard.querySelector('.why-funnel-btn');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  // Activate selected pill
  const targetPill = document.getElementById('why-pill-' + pillarKey);
  if (targetPill) targetPill.classList.add('active');

  // Activate selected pane
  const targetPane = document.getElementById('why-pane-' + pillarKey);
  if (targetPane) targetPane.classList.add('active');

  // If matrix tab clicked, scroll to the full comparison table
  if (pillarKey === 'matrix') {
    const matrixEl = document.getElementById('transparency-matrix');
    if (matrixEl) {
      matrixEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }

  // Smooth scroll to funnel box on smaller viewports or when outside viewport
  const rect = container.getBoundingClientRect();
  if (rect.top < 80 || rect.bottom > (window.innerHeight + 100)) {
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

