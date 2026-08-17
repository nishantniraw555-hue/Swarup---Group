/**
 * ROYAL GARDEN — EXACT PDF REPLICA (Fully Coded Canvas)
 * Rebuilt to perfectly match the PDF layout, colors, and roads.
 */

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("royal-garden-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const CSS_WIDTH = canvas.parentElement.clientWidth || 1200;
  const CSS_HEIGHT = 850;
  
  canvas.style.width = CSS_WIDTH + "px";
  canvas.style.height = CSS_HEIGHT + "px";
  canvas.width = CSS_WIDTH * dpr;
  canvas.height = CSS_HEIGHT * dpr;
  
  let camera = { x: 50, y: 150, zoom: 0.65 }; // Adjust Y so top is visible
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let hoveredPlot = null;
  let plots = [];
  let roads = [];

  // --- COLORS ---
  const COLORS = {
    bg: "#f8fafc",          
    road: "#0f172a",        
    roadLines: "#f59e0b",   
    roadText: "#f8fafc",    
    futureExt: "#a7f3d0",   
    cSeries: "#e0f2fe",     
    dSeries: "#dcfce7",     
    bSeries: "#fef3c7",     
    purple: "#f3e8ff",      
    booked: "#ef4444",      
    highlight: "rgba(255, 255, 255, 0.5)",
    text: "#0f172a"
  };

  // --- BOOKED PLOTS SPECIFICATION ---
  const BOOKED_PLOT_NUMBERS = [31, 32, 33, 34, 43, 44, 45, 46, 47, 49, 61, 62, 64, 65, 66, 67, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 113, 114, 134, 135];

  function isPlotBooked(id) {
    if (!id) return false;
    const numStr = String(id).replace(/\D/g, '');
    if (!numStr) return false;
    return BOOKED_PLOT_NUMBERS.includes(parseInt(numStr, 10));
  }

  function addPlot(id, x, y, w, h) {
    plots.push({
      id: id, x: x, y: y, w: w, h: h, 
      color: getPlotColor(id),
      status: Math.random() > 0.85 ? "booked" : "available",
      cx: x + w/2, cy: y + h/2
    });
  }

  // --- GEOMETRY LAYOUT ---
  const V_EAST = 1350;
  const PURPLE_X = 1367; 
  const V1 = 650;
  const ROW_H = 45;
  const H_ROAD = 17;

  // 1. Purple Column
  let py = 0;
  ["B-100","B-99","B-98","B-97","B-96","B-95","B-94","B-93","B-92","B-91","B-90","B-89","B-88","B-87"].forEach(id => {
    addPlot(id, PURPLE_X, py, 45, 30);
    py += 30;
  });

  // 2. ROADS (Top Structure)
  const TOP_ROAD_Y = -150;
  // Main Road
  roads.push({ x: PURPLE_X + 80, y: -300, w: 100, h: 1800, name: "MAIN ROAD BIHTA - PATNA", isMain: true });
  // 30' Top Road
  roads.push({ x: 300, y: TOP_ROAD_Y, w: PURPLE_X + 80 - 300, h: 30, name: "30'-0\" WIDE ROAD", isMain: true });
  
  // 2 Entry Roads from 30' Road
  const ENTRY_1_X = V1 + 80; // Shifted right
  const ENTRY_2_X = V_EAST - 80 - 17; // Exactly to the left of A-2
  roads.push({ x: ENTRY_1_X, y: TOP_ROAD_Y + 30, w: 17, h: 60, name: "" }); // Entry 1
  roads.push({ x: ENTRY_2_X, y: TOP_ROAD_Y + 30, w: 17, h: 60, name: "" }); // Entry 2

  // 17' Horizontal Road connecting entries
  const H_ENTRY_Y = TOP_ROAD_Y + 30 + 60; // -60
  roads.push({ x: V1 - 100, y: H_ENTRY_Y, w: V_EAST - (V1 - 100) + 17, h: 17, name: "17'-0\" WIDE ROAD" });
  
  // Plotting starts below H_ENTRY_Y
  const PLOT_START_Y = H_ENTRY_Y + 17; // -43

  // 3. Top Section (Above FUTURE EXTENSION)
  
  // New Vertical Road: A little to the right of the left entry road (V1), 
  // connecting the 1st 17' road (H_ENTRY_Y) to the 2nd 17' road (H_MID_Y).
  const NEW_V_ROAD_X = V1 + 150; // "thora right jake"

  // -- NEW PLOTS LEFT OF NEW VERTICAL ROAD (1 Column) --
  // Space height is 120. We can fit 3 plots of height 40.
  let leftColX = NEW_V_ROAD_X - 50; // Width of 50
  addPlot("N-1", leftColX, PLOT_START_Y, 50, 40);
  addPlot("N-2", leftColX, PLOT_START_Y + 40, 50, 40);
  addPlot("N-3", leftColX, PLOT_START_Y + 80, 50, 40);

  // -- NEW PLOTS RIGHT OF NEW VERTICAL ROAD (2 Rows x 5 Columns) --
  // Total height = 120. 2 rows -> height 60 each. 5 columns -> width 40 each.
  let rightGridX = NEW_V_ROAD_X + 17;
  let rx = rightGridX;
  ["N-4","N-5","N-6","N-7","N-8"].forEach(id => {
    addPlot(id, rx, PLOT_START_Y, 40, 60);
    rx += 40;
  });
  rx = rightGridX;
  ["N-9","N-10","N-11","N-12","N-13"].forEach(id => {
    addPlot(id, rx, PLOT_START_Y + 60, 40, 60);
    rx += 40;
  });

  // -- EXISTING PLOTS (Anchored to right side) --
  let tx = V_EAST;
  ["A-1","A-2"].forEach(id => { tx -= 40; addPlot(id, tx, PLOT_START_Y, 40, 40); });
  tx -= 17; // Road gap
  ["A-3","A-4","A-5"].forEach(id => { tx -= 40; addPlot(id, tx, PLOT_START_Y, 40, 40); });
  
  tx = V_EAST;
  ["B-1","B-2"].forEach(id => { tx -= 40; addPlot(id, tx, PLOT_START_Y + 40, 40, 40); });
  tx -= 17; // Road gap
  ["B-3","B-4"].forEach(id => { tx -= 40; addPlot(id, tx, PLOT_START_Y + 40, 40, 40); });
  
  tx = V_EAST;
  ["C-1","C-2"].forEach(id => { tx -= 40; addPlot(id, tx, PLOT_START_Y + 80, 40, 40); }); // Width 40 to align with A/B
  tx -= 17; // Road gap
  ["C-3","C-4"].forEach(id => { tx -= 50; addPlot(id, tx, PLOT_START_Y + 80, 50, 40); });

  const H_MID_Y = PLOT_START_Y + 120; // 77
  roads.push({ x: V1 - 100, y: H_MID_Y, w: V_EAST - (V1 - 100) + 17, h: 17, name: "17'-0\" WIDE ROAD" });

  // connecting the 1st 17' road (H_ENTRY_Y) to the 2nd 17' road (H_MID_Y).
  roads.push({ x: NEW_V_ROAD_X, y: H_ENTRY_Y + 17, w: 17, h: H_MID_Y - (H_ENTRY_Y + 17), name: "" });

  // 2nd Entry Road continuation: Passing between A2/B2/C2 and A3/B3/C3
  roads.push({ x: ENTRY_2_X, y: H_ENTRY_Y + 17, w: 17, h: H_MID_Y - (H_ENTRY_Y + 17), name: "" });

  // 4. FUTURE EXTENSION (Vertical on the right side)
  const FE_X = V_EAST - 180; // 180 wide on the right
  const FE_Y = H_MID_Y + 17; // 94
  const FE_W = 180; 
  const FE_H = 250; // Made smaller (not too long)

  // 5. Core Grid
  let coreY = FE_Y + FE_H + 17; // Core grid sits BELOW Future Extension
  
  // V1 Road goes down from H_MID_Y
  roads.push({ x: V_EAST, y: H_MID_Y, w: 17, h: 1000, name: "17'-0\" WIDE ROAD" });
  roads.push({ x: V1, y: H_MID_Y, w: 17, h: 1000, name: "17'-0\" WIDE ROAD" });
  
  // Left wing block
  let lwy = FE_Y;
  ["B-5","B-6","B-7","B-8","B-9","B-10","B-11"].forEach(id => {
     addPlot(id, V1 - 50, lwy, 50, FE_H/7); // Left of V1
     lwy += FE_H/7;
  });

  // H-Road 1
  roads.push({ x: V1 - 160, y: coreY - 17, w: 160 + 17 + (V_EAST - V1), h: 17, name: "17'-0\" WIDE ROAD" }); 
  
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

















































          ctx.fillText(r.name, 0, 0);
          ctx.restore();
        }
      }
    });

    // Draw FUTURE EXTENSION
    ctx.fillStyle = COLORS.futureExt;
    ctx.fillRect(FE_X, FE_Y, FE_W, FE_H);
    ctx.strokeStyle = "#166534";
    ctx.lineWidth = 3;
    ctx.strokeRect(FE_X, FE_Y, FE_W, FE_H);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FUTURE", FE_X + FE_W/2, FE_Y + FE_H/2 - 5);
    ctx.fillText("EXTENSION", FE_X + FE_W/2, FE_Y + FE_H/2 + 15);

    // Draw Plots
    plots.forEach(p => {
    ctx.lineWidth = 3;
    ctx.strokeRect(FE_X, FE_Y, FE_W, FE_H);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FUTURE", FE_X + FE_W/2, FE_Y + FE_H/2 - 5);
    ctx.fillText("EXTENSION", FE_X + FE_W/2, FE_Y + FE_H/2 + 15);

    // Draw Plots
    plots.forEach(p => {
      const isHovered = hoveredPlot && hoveredPlot.id === p.id;
      
      const boxW = 36;
      const boxH = 22;
      const bx = p.cx - boxW / 2;
      const by = p.cy - boxH / 2;

      const showBookedRed = (p.status === "booked") && isHovered;

      if (showBookedRed) {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeStyle = "#991b1b";
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, boxW, boxH);
        ctx.fillStyle = "#ffffff";
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, boxW, boxH);
        ctx.fillStyle = COLORS.text;
      }

      if (isHovered) {
        ctx.fillStyle = COLORS.highlight;
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, boxW, boxH);
      }

      // Plot Text
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";

  // --- MOUSE INTERACTIONS ---
  canvas.addEventListener("mousedown", (e) => {
    const mouseX = (e.clientX - rect.left) / camera.zoom - camera.x / camera.zoom;
    const mouseY = (e.clientY - rect.top) / camera.zoom - camera.y / camera.zoom;

    let found = null;
    for (let p of plots) {
      if (mouseX >= p.x && mouseX <= p.x + p.w && mouseY >= p.y && mouseY <= p.y + p.h) {
        found = p; break;
      }
    }

    if (found !== hoveredPlot) {
      hoveredPlot = found;
      canvas.style.cursor = hoveredPlot ? "pointer" : "grab";
      drawMap();
    }
  });

  canvas.addEventListener("mouseup", () => { isDragging = false; canvas.style.cursor = "grab"; });
  canvas.addEventListener("mouseleave", () => { isDragging = false; hoveredPlot = null; drawMap(); });

  canvas.addEventListener("click", () => {
    if (hoveredPlot && typeof openRoyalGardenPlotModal === 'function') {
      openRoyalGardenPlotModal({
        id: hoveredPlot.id,
        sqft: "1200",
        dims: "30' x 40'",
        facing: "East",
        price: "₹18.5 Lakh",
        status: hoveredPlot.status,
        isCorner: false
      });
    }
  });

  function loop() {
    drawMap();
    requestAnimationFrame(loop);
  }
  loop();
});















































































































































































































































































































































































































































































































































































































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