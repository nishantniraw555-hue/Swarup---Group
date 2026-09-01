/**
 * ============================================================================
 * ROYAL GARDEN — EXACT AUTOCAD MASTER SURVEY ENGINE (314 PLOTS)
 * Swarup Group | Mouza Painathi, Thana No. 68, Kanhauli Bihta-Patna Highway
 * Ultra-Modern Interactive Vector Blueprint Map with Smooth Pan/Zoom, Live Search,
 * Category Filters, Floating Tooltip, Luxury Inspection Modal & Dual Themes
 * ============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initRoyalGardenMasterplan();
  });

  function initRoyalGardenMasterplan() {
    const canvas = document.getElementById('royal-garden-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    let width = 1200;
    let height = 750;

    // View & Camera state
    let userZoom = 1.0;
    let panX = 0;
    let panY = 0;
    let targetZoom = 1.0;
    let targetPanX = 0;
    let targetPanY = 0;
    let isAnimatingCamera = false;

    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let didDrag = false;
    let hoveredPlot = null;
    let selectedPlot = null;
    let searchHighlightPlot = null;
    let currentFilter = 'all';
    let isDarkTheme = false; // Default: Clean White Architectural Theme

    // Royal Garden Pricing Configuration (Official Rate: ₹2,700 / Sq.Ft)
    const BASE_RATE_PER_SQFT = 2700;

    // Booked Plot numbers (Official Registry Allocation - Systematic IDs)
    const BOOKED_PLOT_IDS = new Set([
      'A-4', 'A-5', 'A-12', 'A-20',
      'B-5', 'B-12', 'B-14', 'B-25', 'B-26', 'B-33', 'B-34', 'B-45', 'B-46', 'B-61', 'B-62', 'B-75', 'B-76',
      'C-6', 'C-10', 'C-14', 'C-22', 'C-26',
      'D-10', 'D-12', 'D-22', 'D-28', 'D-35', 'D-44', 'D-55', 'D-68',
      'E-3', 'E-8',
      'FE-12', 'FE-25', 'FE-44', 'FE-68'
    ]);

    // Theme Palettes
    const THEMES = {
      light: {
        bg: '#ffffff',
        grid: 'rgba(203, 213, 225, 0.45)',
        border: 'rgba(15, 23, 42, 0.15)',
        mainRoad: '#0f172a',
        mainRoadBorder: '#d97706',
        sectorRoad: '#1e293b',
        sectorRoadBorder: '#334155',
        roadLine: '#f59e0b',
        roadText: '#ffffff',
        greenArea: '#dcfce7',
        greenAreaBorder: '#16a34a',
        greenAreaPattern: '#bbf7d0',
        futureExt: '#f5f3ff',
        futureExtBorder: '#7c3aed',
        futureExtText: '#4338ca',
        plotA: '#d9f99d',       // Crisp Lime (Executive Frontage)
        plotABorder: '#65a30d',
        plotB: '#fef08a',       // Warm Amber Yellow (Residential)
        plotBBorder: '#ca8a04',
        plotC: '#bae6fd',       // Sky Blue (Villa Plots)
        plotCBorder: '#0284c7',
        plotD: '#e0e7ff',       // Soft Indigo (Standard 1200 SqFt)
        plotDBorder: '#4f46e5',
        plotE: '#f3e8ff',       // Lavender (East Frontage)
        plotEBorder: '#9333ea',
        plotFE: '#ede9fe',      // Light Purple (Phase II Future Ext)
        plotFEBorder: '#8b5cf6',
        plotVip: '#fef3c7',     // Premium Gold Corner
        plotVipBorder: '#d97706',
        bookedPlot: '#fee2e2',  // Pastel Red (Booked)
        bookedBorder: '#dc2626',
        textMain: '#0f172a',
        textMuted: '#475569',
        textPlotNum: '#0f172a',
        textSqft: '#64748b',
        highlightFill: 'rgba(245, 158, 11, 0.4)',
        highlightStroke: '#b45309',
        gateBg: '#f59e0b',
        gateText: '#0f172a'
      },
      dark: {
        bg: '#080e1e',
        grid: 'rgba(255, 255, 255, 0.04)',
        border: 'rgba(245, 158, 11, 0.25)',
        mainRoad: '#1e293b',
        mainRoadBorder: '#f59e0b',
        sectorRoad: '#0f172a',
        sectorRoadBorder: '#334155',
        roadLine: '#f59e0b',
        roadText: '#f8fafc',
        greenArea: '#064e3b',
        greenAreaBorder: '#10b981',
        greenAreaPattern: '#047857',
        futureExt: '#1e1b4b',
        futureExtBorder: '#6366f1',
        futureExtText: '#c7d2fe',
        plotA: '#14532d',
        plotABorder: '#22c55e',
        plotB: '#78350f',
        plotBBorder: '#f59e0b',
        plotC: '#1e3a8a',
        plotCBorder: '#38bdf8',
        plotD: '#312e81',
        plotDBorder: '#818cf8',
        plotE: '#581c87',
        plotEBorder: '#c084fc',
        plotFE: '#2e1065',
        plotFEBorder: '#a78bfa',
        plotVip: '#78350f',
        plotVipBorder: '#fbbf24',
        bookedPlot: '#7f1d1d',
        bookedBorder: '#ef4444',
        textMain: '#ffffff',
        textMuted: '#94a3b8',
        textPlotNum: '#ffffff',
        textSqft: '#cbd5e1',
        highlightFill: 'rgba(251, 191, 36, 0.45)',
        highlightStroke: '#fbbf24',
        gateBg: '#fbbf24',
        gateText: '#0f172a'
      }
    };

    // ─────────────────────────────────────────────────────────────
    // GEOMETRY & PLOT DATA DEFINITION (EXACT AUTOCAD SURVEY REPLICA)
    // ─────────────────────────────────────────────────────────────
    const rawPlots = [];
    const rawRoads = [];
    const rawGates = [];
    let futureExtensionZone = null;
    let greenParks = [];

    function addRawPlot(id, block, sqft, dims, facing, x, y, w, h, isCorner = false) {
      const isBooked = BOOKED_PLOT_IDS.has(id);
      const isVip = isCorner || id.startsWith('A-') || id.startsWith('E-');
      const rate = isVip ? BASE_RATE_PER_SQFT * 1.1 : BASE_RATE_PER_SQFT;
      const priceVal = (sqft * rate) / 100000;
      const priceStr = '₹' + priceVal.toFixed(2) + ' Lakh';

      rawPlots.push({
        id: id,
        block: block,
        sqft: sqft,
        dims: dims,
        facing: facing,
        rate: rate,
        price: priceStr,
        status: isBooked ? 'booked' : (isVip ? 'vip' : 'available'),
        isVip: isVip,
        isCorner: isCorner,
        vx: x,
        vy: y,
        vw: w,
        vh: h
      });
    }

    function buildRoyalGardenGeometry() {
      rawPlots.length = 0;
      rawRoads.length = 0;
      rawGates.length = 0;
      greenParks.length = 0;

      // Coordinate reference points (Ultra-Wide Masterplan Layout)
      const V_EAST = 5800;      // 3rd Vertical Sector Road (Right)
      const V1 = 1120;          // 2nd Vertical Sector Road (Left)
      const ROW_H = 220;        // Spacious 220px Sector Row Plot Depth
      const H_ROAD_W = 180;     // Extra Wide 180px Horizontal Sector Road
      const V_ROAD_W = 180;     // Extra Wide 180px Vertical Sector Road
      const TOP_ROAD_Y = -440;
      const ENTRY_ROAD_LEN = 380;// Grand Entrance Road Length
      const MAIN_ROAD_X = 6450; // 100-Ft Highway on East side
      const LEFT_START_X = 200; // 1st Vertical Boundary on Left
      const eWidth = 300;       // Wide Block E plots
      const bWidth = 300;       // Wide Block B plots
      const TOP_PLOT_H = 280;   // Top Row Plot Height (bigger & wider)

      // 1. MAIN ROAD (Bihta - Patna 100-Ft Highway running on East side)
      rawRoads.push({
        vx: MAIN_ROAD_X,
        vy: -540,
        vw: 340,
        vh: 6000,
        name: 'MAIN ROAD BIHTA - PATNA (100 FT HIGHWAY)',
        isMain: true
      });

      // 2. 30'-0" TOP ENTRANCE ROAD (From Highway across to Left Entrance)
      rawRoads.push({
        vx: LEFT_START_X,
        vy: TOP_ROAD_Y,
        vw: MAIN_ROAD_X + 340 - LEFT_START_X,
        vh: 180,
        name: '30\'-0" WIDE ROAD',
        isMain: true
      });

      // 3. Vertical Entry Roads from 30' Road (Gate 1 & Gate 2)
      const ENTRY_1_X = 1120;     // 1st Vertical Entrance Road (Gate 1)
      const ENTRY_2_X = 5660;     // 3rd Vertical Entrance Road (Gate 2)
      rawRoads.push({ vx: ENTRY_1_X, vy: TOP_ROAD_Y + 180, vw: V_ROAD_W, vh: ENTRY_ROAD_LEN, name: '17\'-0" ROAD' });
      rawRoads.push({ vx: ENTRY_2_X, vy: TOP_ROAD_Y + 180, vw: V_ROAD_W, vh: ENTRY_ROAD_LEN, name: '17\'-0" ROAD' });

      // Gates
      rawGates.push({ vx: ENTRY_1_X - 25, vy: TOP_ROAD_Y + 185, vw: 230, vh: 40, name: 'GATE 1' });
      rawGates.push({ vx: ENTRY_2_X - 25, vy: TOP_ROAD_Y + 185, vw: 230, vh: 40, name: 'GATE 2' });

      // 4. First 17'-0" Horizontal Entrance Connector Road
      const H_ENTRY_Y = TOP_ROAD_Y + 180 + ENTRY_ROAD_LEN;
      rawRoads.push({
        vx: ENTRY_1_X,
        vy: H_ENTRY_Y,
        vw: (V_EAST + V_ROAD_W + bWidth) - ENTRY_1_X,
        vh: H_ROAD_W,
        name: '17\'-0" ROAD'
      });

      const PLOT_START_Y = H_ENTRY_Y + H_ROAD_W;

      // 5. TOP ROW PLOTS (Block A Frontage Plots: A-1 to A-12)
      const NEW_V_ROAD_X = 1550;
      rawRoads.push({ vx: NEW_V_ROAD_X, vy: H_ENTRY_Y + H_ROAD_W, vw: V_ROAD_W, vh: TOP_PLOT_H * 2, name: '17\'-0" ROAD' });
      rawRoads.push({ vx: ENTRY_2_X, vy: H_ENTRY_Y + H_ROAD_W, vw: V_ROAD_W, vh: TOP_PLOT_H * 2, name: '17\'-0" ROAD' });

      const midStartX = NEW_V_ROAD_X + V_ROAD_W;
      const parkW = 750;
      const availMidW = ENTRY_2_X - midStartX - parkW; // Space for plots (excluding park)
      const topPlotCount = 4;
      const plotW = availMidW / topPlotCount; // ~660px each — uniform and big

      // Upper Row (North Facing Block A: A-1 to A-4)
      const topA = ['A-1', 'A-2', 'A-3', 'A-4'];
      const topASqfts = [2000, 1800, 1800, 1500];
      const topADims = ["40' × 50'", "36' × 50'", "36' × 50'", "30' × 50'"];
      for (let i = 0; i < topA.length; i++) {
        addRawPlot(topA[i], 'A', topASqfts[i], topADims[i], 'North Facing', midStartX + i * plotW, PLOT_START_Y, plotW, TOP_PLOT_H, i === 0 || i === topA.length - 1);
      }

      // Central Park (after 4 plots)
      const parkX = midStartX + topPlotCount * plotW;
      greenParks.push({
        vx: parkX,
        vy: PLOT_START_Y,
        vw: parkW,
        vh: TOP_PLOT_H * 2,
        title: '🌳 CENTRAL PARK'
      });

      // A-5 on the far East side of Gate 2
      const rStartX = ENTRY_2_X + V_ROAD_W;
      const topRightW = (V_EAST + V_ROAD_W + bWidth) - rStartX;
      addRawPlot('A-5', 'A', 1800, "40' × 45'", 'North Facing', rStartX, PLOT_START_Y, topRightW, TOP_PLOT_H, true);

      // Lower Row (South Facing Block A: A-6 to A-9)
      const topALower = ['A-6', 'A-7', 'A-8', 'A-9'];
      const topALowerSqfts = [1800, 1600, 1600, 1500];
      const topALowerDims = ["36' × 50'", "32' × 50'", "32' × 50'", "30' × 50'"];
      for (let i = 0; i < topALower.length; i++) {
        addRawPlot(topALower[i], 'A', topALowerSqfts[i], topALowerDims[i], 'South Facing', midStartX + i * plotW, PLOT_START_Y + TOP_PLOT_H, plotW, TOP_PLOT_H, i === 0 || i === topALower.length - 1);
      }

      // A-10 on the far East side Lower
      addRawPlot('A-10', 'A', 1300, "30' × 43'", 'South Facing', rStartX, PLOT_START_Y + TOP_PLOT_H, topRightW, TOP_PLOT_H, true);

      // Top Left Green Private Land Buffer
      greenParks.push({
        vx: LEFT_START_X,
        vy: PLOT_START_Y,
        vw: NEW_V_ROAD_X - LEFT_START_X,
        vh: TOP_PLOT_H * 2,
        title: '🌿 LUSH GREEN BUFFER ZONE'
      });

      // 6. SECOND 17'-0" HORIZONTAL ROAD (180px Thick!)
      const H_MID_Y = PLOT_START_Y + TOP_PLOT_H * 2;
      rawRoads.push({
        vx: V1,
        vy: H_MID_Y,
        vw: (V_EAST + V_ROAD_W + bWidth) - V1,
        vh: H_ROAD_W,
        name: '17\'-0" ROAD'
      });

      // 7. Right Vertical Columns (Block E on LEFT of V_EAST road, Block B on RIGHT of V_EAST road)
      const FE_H = 1800;
      const FE_Y = H_MID_Y + H_ROAD_W;
      const FE_X = V1 + V_ROAD_W + bWidth;
      const FE_W = (V_EAST - eWidth) - FE_X;
      futureExtensionZone = {
        vx: FE_X,
        vy: FE_Y,
        vw: FE_W,
        vh: FE_H,
        title: 'PHASE II — FUTURE EXTENSION'
      };

      // 2 Horizontal Roads (17'-0" Wide) to create 3 larger blocks
      const hRoadsY = [];
      for (let i = 1; i <= 2; i++) {
        const rY = FE_Y + (FE_H * i / 3) - (H_ROAD_W / 2);
        hRoadsY.push(rY);
        rawRoads.push({
          vx: V1,
          vy: rY,
          vw: (V_EAST + V_ROAD_W) - V1,
          vh: H_ROAD_W,
          name: '17\'-0" ROAD'
        });
      }

      // Left Vertical Road inside Future Extension Zone (17'-0" Wide)
      const rX = FE_X + 1260;
      rawRoads.push({
        vx: rX,
        vy: FE_Y,
        vw: V_ROAD_W,
        vh: FE_H,
        name: '17\'-0" ROAD'
      });

      // 3 Intervals between horizontal roads
      const blockBounds = [];
      let curBlockY = FE_Y;
      for (let i = 0; i < 2; i++) {
        blockBounds.push({ y1: curBlockY, y2: hRoadsY[i] });
        curBlockY = hRoadsY[i] + H_ROAD_W;
      }
      blockBounds.push({ y1: curBlockY, y2: FE_Y + FE_H });

      // Block E Plots (E-1 to E-12 along East Road, Top to Bottom)
      const eBlockPlots = [
        [ { id: 'E-1', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: true }, { id: 'E-2', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: false }, { id: 'E-3', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: false }, { id: 'E-4', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: false } ],
        [ { id: 'E-5', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: false }, { id: 'E-6', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: false }, { id: 'E-7', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: false }, { id: 'E-8', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: false } ],
        [ { id: 'E-9', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: false }, { id: 'E-10', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: false }, { id: 'E-11', block: 'E', sqft: 1050, dims: "30' × 35'", isCorner: false }, { id: 'E-12', block: 'E', sqft: 1200, dims: "35' × 35'", isCorner: true } ]
      ];

      blockBounds.forEach((b, bIdx) => {
        const netH = b.y2 - b.y1;
        const plots = eBlockPlots[bIdx];
        const singleH = netH / plots.length;
        plots.forEach((p, pIdx) => {
          addRawPlot(p.id, p.block, p.sqft, p.dims, 'East Facing', V_EAST - eWidth, b.y1 + pIdx * singleH, eWidth, singleH, p.isCorner);
        });
      });

      // Block B East Column: B-73 to B-86 (East side of V_EAST road, Top to Bottom)
      let by = H_MID_Y + H_ROAD_W;
      const bPlotsRight = ['B-73', 'B-74', 'B-75', 'B-76', 'B-77', 'B-78', 'B-79', 'B-80', 'B-81', 'B-82', 'B-83', 'B-84', 'B-85', 'B-86'];
      const bRightH = FE_H / bPlotsRight.length;
      bPlotsRight.forEach((id, idx) => {
        addRawPlot(id, 'B', 1050, "30' × 35'", 'West Facing', V_EAST + V_ROAD_W, by, bWidth, bRightH, idx === 0 || idx === bPlotsRight.length - 1);
        by += bRightH;
      });

      // 9. Column Right of V1 Road - B-8 to B-17 (Top to Bottom)
      const bPlotsRightV1 = [
        [ { id: 'B-8', sqft: 1800, dims: "35' × 50'", isCorner: true }, { id: 'B-9', sqft: 1500, dims: "30' × 50'", isCorner: false }, { id: 'B-10', sqft: 1350, dims: "28' × 48'", isCorner: false } ],
        [ { id: 'B-11', sqft: 1350, dims: "28' × 48'", isCorner: false }, { id: 'B-12', sqft: 1350, dims: "28' × 48'", isCorner: false }, { id: 'B-13', sqft: 1350, dims: "28' × 48'", isCorner: false } ],
        [ { id: 'B-14', sqft: 1350, dims: "28' × 48'", isCorner: false }, { id: 'B-15', sqft: 1350, dims: "28' × 48'", isCorner: false }, { id: 'B-16', sqft: 1500, dims: "30' × 50'", isCorner: false }, { id: 'B-17', sqft: 1800, dims: "35' × 50'", isCorner: true } ]
      ];

      blockBounds.forEach((b, bIdx) => {
        const netH = b.y2 - b.y1;
        const group = bPlotsRightV1[bIdx];
        const singleH = netH / group.length;
        group.forEach((p, idx) => {
          addRawPlot(p.id, 'B', p.sqft, p.dims, 'West Facing', V1 + V_ROAD_W, b.y1 + idx * singleH, bWidth, singleH, p.isCorner);
        });
      });

      // 10. Phase II Future Extension Plots Grid
      let fePlotNum = 1;
      blockBounds.forEach((b) => {
        const halfH = (b.y2 - b.y1) / 2;
        
        // Left sub-block (3 plots North Facing, 3 plots South Facing)
        const leftW = (rX - FE_X) / 3;
        for (let c = 0; c < 3; c++) {
          const pX = FE_X + c * leftW;
          addRawPlot('FE-' + (fePlotNum++), 'FE', 1800, "40' × 45'", 'North Facing', pX, b.y1, leftW, halfH, c === 0 || c === 2);
          addRawPlot('FE-' + (fePlotNum++), 'FE', 1800, "40' × 45'", 'South Facing', pX, b.y1 + halfH, leftW, halfH, c === 0 || c === 2);
        }

        // Right sub-block (4 plots North Facing, 4 plots South Facing)
        const rightStartX = rX + V_ROAD_W;
        const rightW = ((FE_X + FE_W) - rightStartX) / 4;
        for (let c = 0; c < 4; c++) {
          const pX = rightStartX + c * rightW;
          addRawPlot('FE-' + (fePlotNum++), 'FE', 1600, "35' × 45'", 'North Facing', pX, b.y1, rightW, halfH, c === 0 || c === 3);
          addRawPlot('FE-' + (fePlotNum++), 'FE', 1600, "35' × 45'", 'South Facing', pX, b.y1 + halfH, rightW, halfH, c === 0 || c === 3);
        }
      });

      // 11. West Columns (Outer Left A-17..A-23, Inner Left A-24..A-30, Block B: B-1..B-7)
      const lwPlotW = 320;
      const lwStartX = V1 - lwPlotW;
      const colW = (lwStartX - LEFT_START_X) / 2;
      const leftWingPlots = [
        { id: 'B-1', sqft: 2400, dims: "40' × 60'" },
        { id: 'B-2', sqft: 2100, dims: "35' × 60'" },
        { id: 'B-3', sqft: 1500, dims: "30' × 50'" },
        { id: 'B-4', sqft: 1500, dims: "30' × 50'" },
        { id: 'B-5', sqft: 1800, dims: "36' × 50'" },
        { id: 'B-6', sqft: 1500, dims: "30' × 50'" },
        { id: 'B-7', sqft: 1600, dims: "32' × 50'" }
      ];
      const lwPlotH = FE_H / leftWingPlots.length;

      for (let r = 0; r < leftWingPlots.length; r++) {
        const rowY = FE_Y + r * lwPlotH;
        const isCorner = (r === 0 || r === 6);
        // Column 1 (Outer Left Column - West Facing: A-11 to A-17)
        addRawPlot('A-' + (11 + r), 'A', 1500, "30' × 50'", 'West Facing', LEFT_START_X, rowY, colW, lwPlotH, isCorner);
        // Column 2 (Inner Left Column - East Facing: A-18 to A-24)
        addRawPlot('A-' + (18 + r), 'A', 1500, "30' × 50'", 'East Facing', LEFT_START_X + colW, rowY, colW, lwPlotH, isCorner);
        // Column 3 (Block B: B-1 to B-7)
        const p = leftWingPlots[r];
        addRawPlot(p.id, 'B', p.sqft, p.dims, 'East Facing', lwStartX, rowY, lwPlotW, lwPlotH, isCorner);
      }

      // 12. Vertical Sector Roads (180px Thick!)
      let coreY = FE_Y + FE_H + H_ROAD_W;
      const V1_END_Y = coreY + ROW_H * 2; // V1 road terminates at horizontal road above C-9
      rawRoads.push({ vx: V1, vy: H_MID_Y, vw: V_ROAD_W, vh: V1_END_Y - H_MID_Y + H_ROAD_W, name: '17\'-0" ROAD' });
      rawRoads.push({ vx: V_EAST, vy: H_MID_Y, vw: V_ROAD_W, vh: FE_H + H_ROAD_W, name: '17\'-0" ROAD' });

      // 13. CORE SECTOR ROWS (Row Blocks 1 through 6)
      const V_MID_X = 2800;
      const coreStartY = coreY; // Save for V_MID_X road height calculation later

      function addFittedRow(ids, startX, endX, y, h, facing) {
        const count = ids.length;
        const totalW = endX - startX;
        const singleW = totalW / count;
        for (let i = 0; i < count; i++) {
          const id = ids[i];
          const blk = id.startsWith('FE') ? 'FE' : id.charAt(0);
          const sqft = blk === 'C' ? 1600 : (blk === 'D' ? 1200 : (blk === 'A' ? 1800 : 1350));
          const dims = blk === 'C' ? "40' × 40'" : (blk === 'D' ? "30' × 40'" : "35' × 40'");
          const isCorner = (i === 0 || i === count - 1);
          addRawPlot(id, blk, sqft, dims, facing, startX + i * singleW, y, singleW, h, isCorner);
        }
      }

      const rColX = V_EAST + V_ROAD_W;
      const ROW_END_X = rColX + bWidth;
      const rowRightStartX = V_MID_X + V_ROAD_W;

      // ── ROW BLOCK 1 (V1 road present: 2 B-plots + 3 C-plots + 6 D-plots) ──
      rawRoads.push({ vx: LEFT_START_X, vy: coreY - H_ROAD_W, vw: ROW_END_X - LEFT_START_X, vh: H_ROAD_W, name: '17\'-0" ROAD' });
      // Top Row
      addFittedRow(['B-18', 'B-19'], LEFT_START_X, V1, coreY, ROW_H, 'North Facing');
      addFittedRow(['C-1', 'C-2', 'C-3'], V1 + V_ROAD_W, V_MID_X, coreY, ROW_H, 'North Facing');
      addFittedRow(['D-1', 'D-2', 'D-3', 'D-4', 'D-5', 'D-6'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'North Facing');
      coreY += ROW_H;
      // Bottom Row
      addFittedRow(['B-20', 'B-21'], LEFT_START_X, V1, coreY, ROW_H, 'South Facing');
      addFittedRow(['C-4', 'C-5', 'C-6'], V1 + V_ROAD_W, V_MID_X, coreY, ROW_H, 'South Facing');
      addFittedRow(['D-7', 'D-8', 'D-9', 'D-10', 'D-11', 'D-12'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'South Facing');
      coreY += ROW_H;

      // ── ROW BLOCK 2 (No V1: 5 left plots + 6 right plots = ~520px + ~550px uniform) ──
      rawRoads.push({ vx: LEFT_START_X, vy: coreY, vw: ROW_END_X - LEFT_START_X, vh: H_ROAD_W, name: '17\'-0" ROAD' });
      coreY += H_ROAD_W;
      // Top Row
      addFittedRow(['B-22', 'B-23', 'C-7', 'C-8', 'C-9'], LEFT_START_X, V_MID_X, coreY, ROW_H, 'North Facing');
      addFittedRow(['D-13', 'D-14', 'D-15', 'D-16', 'D-17', 'D-18'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'North Facing');
      coreY += ROW_H;
      // Bottom Row
      addFittedRow(['B-24', 'B-25', 'C-10', 'C-11', 'C-12'], LEFT_START_X, V_MID_X, coreY, ROW_H, 'South Facing');
      addFittedRow(['D-19', 'D-20', 'D-21', 'D-22', 'D-23', 'D-24'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'South Facing');
      coreY += ROW_H;

      // ── ROW BLOCK 3 (5 left + 6 right) ──
      rawRoads.push({ vx: LEFT_START_X, vy: coreY, vw: ROW_END_X - LEFT_START_X, vh: H_ROAD_W, name: '17\'-0" ROAD' });
      coreY += H_ROAD_W;
      // Top Row
      addFittedRow(['B-26', 'B-27', 'C-13', 'C-14', 'C-15'], LEFT_START_X, V_MID_X, coreY, ROW_H, 'North Facing');
      addFittedRow(['D-25', 'D-26', 'D-27', 'D-28', 'D-29', 'D-30'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'North Facing');
      coreY += ROW_H;
      // Bottom Row
      addFittedRow(['B-28', 'B-29', 'C-16', 'C-17', 'C-18'], LEFT_START_X, V_MID_X, coreY, ROW_H, 'South Facing');
      addFittedRow(['D-31', 'D-32', 'D-33', 'D-34', 'D-35', 'D-36'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'South Facing');
      coreY += ROW_H;

      // ── ROW BLOCK 4 (5 left + 6 right) ──
      rawRoads.push({ vx: LEFT_START_X, vy: coreY, vw: ROW_END_X - LEFT_START_X, vh: H_ROAD_W, name: '17\'-0" ROAD' });
      coreY += H_ROAD_W;

      const swStartY = coreY;

      // Row 4 Top
      addFittedRow(['B-30', 'B-31', 'C-19', 'C-20', 'C-21'], LEFT_START_X, V_MID_X, coreY, ROW_H, 'North Facing');
      addFittedRow(['D-37', 'D-38', 'D-39', 'D-40', 'D-41', 'D-42'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'North Facing');
      coreY += ROW_H;
      // Row 4 Bottom
      addFittedRow(['B-32', 'B-33', 'C-22', 'C-23', 'C-24'], LEFT_START_X, V_MID_X, coreY, ROW_H, 'South Facing');
      addFittedRow(['D-43', 'D-44', 'D-45', 'D-46', 'D-47', 'D-48'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'South Facing');
      coreY += ROW_H;

      // ── ROW BLOCK 5 (Right side only: 5 C/D left + 6 D right) ──
      rawRoads.push({ vx: rowRightStartX, vy: coreY, vw: ROW_END_X - rowRightStartX, vh: H_ROAD_W, name: '17\'-0" ROAD' });
      coreY += H_ROAD_W;
      // Row 5 Top
      addFittedRow(['C-25', 'C-26', 'C-27', 'D-49', 'D-50'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'North Facing');
      coreY += ROW_H;
      // Row 5 Bottom
      addFittedRow(['C-28', 'C-29', 'C-30', 'D-51', 'D-52'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'South Facing');
      coreY += ROW_H;

      // ── ROW BLOCK 6 (Right side only: 5 C/D plots) ──
      rawRoads.push({ vx: rowRightStartX, vy: coreY, vw: ROW_END_X - rowRightStartX, vh: H_ROAD_W, name: '17\'-0" ROAD' });
      coreY += H_ROAD_W;
      // Row 6 South
      addFittedRow(['C-31', 'C-32', 'D-53', 'D-54', 'D-55'], rowRightStartX, ROW_END_X, coreY, ROW_H, 'South Facing');
      coreY += ROW_H;

      const swEndY = coreY;

      // ── LEFT SOUTHWEST WING: B-50 to B-56 (Top to Bottom) ──
      const swPlots = [
        { id: 'B-50', blk: 'B', sqft: 1800, dims: "40' × 45'", facing: 'East Facing' },
        { id: 'B-51', blk: 'B', sqft: 1800, dims: "40' × 45'", facing: 'East Facing' },
        { id: 'B-52', blk: 'B', sqft: 1800, dims: "40' × 45'", facing: 'East Facing' },
        { id: 'B-53', blk: 'B', sqft: 1800, dims: "40' × 45'", facing: 'East Facing' },
        { id: 'B-54', blk: 'B', sqft: 1800, dims: "40' × 45'", facing: 'East Facing' },
        { id: 'B-55', blk: 'B', sqft: 1800, dims: "40' × 45'", facing: 'East Facing' },
        { id: 'B-56', blk: 'B', sqft: 2000, dims: "45' × 45'", facing: 'East Facing' }
      ];
      const swPlotW = 480;
      const swStartX = V_MID_X - swPlotW;
      const swPlotH = (swEndY - swStartY) / swPlots.length;

      // Green Landscape Buffer on Left
      if (swStartX > LEFT_START_X) {
        greenParks.push({
          vx: LEFT_START_X,
          vy: swStartY,
          vw: swStartX - LEFT_START_X,
          vh: swEndY - swStartY,
          title: '🌿 LANDSCAPED GREEN BUFFER'
        });
      }

      swPlots.forEach((p, idx) => {
        const pY = swStartY + idx * swPlotH;
        addRawPlot(p.id, p.blk, p.sqft, p.dims, p.facing, swStartX, pY, swPlotW, swPlotH, idx === 0 || idx === swPlots.length - 1);
      });

      // V_MID_X vertical road — extend all the way down to cover B-66..B-72's right edge
      const vMidRoadStartY = coreStartY - H_ROAD_W;
      rawRoads.push({ vx: V_MID_X, vy: vMidRoadStartY, vw: V_ROAD_W, vh: swEndY - vMidRoadStartY, name: '17\'-0" ROAD' });
    }

    buildRoyalGardenGeometry();

    // ─────────────────────────────────────────────────────────────
    // SCALING & VIEWPORT TRANSFORMATION ENGINE
    // ─────────────────────────────────────────────────────────────
    const transformedPlots = [];
    const transformedRoads = [];
    const transformedGates = [];
    let transformedFutureExt = null;
    let transformedParks = [];
    let mapBounds = { minX: 200, minY: -320, mapW: 1380, mapH: 1200 };

    function resizeCanvas() {
      dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      width = (parent && parent.clientWidth) ? parent.clientWidth : window.innerWidth;
      if (!width || width < 280) width = window.innerWidth;
      height = (parent && parent.clientHeight) ? parent.clientHeight : 750;
      if (!height || height < 300) height = 500;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      buildTransformedLayout();
      drawMasterplan();
    }

    function buildTransformedLayout() {
      transformedPlots.length = 0;
      transformedRoads.length = 0;
      transformedGates.length = 0;
      transformedParks.length = 0;

      // Compute exact tight bounding box across all survey geometry
      let bMinX = Infinity, bMaxX = -Infinity, bMinY = Infinity, bMaxY = -Infinity;
      rawPlots.forEach(p => {
        if (p.vx < bMinX) bMinX = p.vx;
        if (p.vy < bMinY) bMinY = p.vy;
        if (p.vx + p.vw > bMaxX) bMaxX = p.vx + p.vw;
        if (p.vy + p.vh > bMaxY) bMaxY = p.vy + p.vh;
      });
      rawRoads.forEach(r => {
        if (r.vx < bMinX) bMinX = r.vx;
        if (r.vy < bMinY) bMinY = r.vy;
        if (r.vx + r.vw > bMaxX) bMaxX = r.vx + r.vw;
        if (r.vy + r.vh > bMaxY) bMaxY = r.vy + r.vh;
      });
      rawGates.forEach(g => {
        if (g.vx < bMinX) bMinX = g.vx;
        if (g.vy < bMinY) bMinY = g.vy;
        if (g.vx + g.vw > bMaxX) bMaxX = g.vx + g.vw;
        if (g.vy + g.vh > bMaxY) bMaxY = g.vy + g.vh;
      });
      greenParks.forEach(g => {
        if (g.vx < bMinX) bMinX = g.vx;
        if (g.vy < bMinY) bMinY = g.vy;
        if (g.vx + g.vw > bMaxX) bMaxX = g.vx + g.vw;
        if (g.vy + g.vh > bMaxY) bMaxY = g.vy + g.vh;
      });
      if (futureExtensionZone) {
        if (futureExtensionZone.vx < bMinX) bMinX = futureExtensionZone.vx;
        if (futureExtensionZone.vy < bMinY) bMinY = futureExtensionZone.vy;
        if (futureExtensionZone.vx + futureExtensionZone.vw > bMaxX) bMaxX = futureExtensionZone.vx + futureExtensionZone.vw;
        if (futureExtensionZone.vy + futureExtensionZone.vh > bMaxY) bMaxY = futureExtensionZone.vy + futureExtensionZone.vh;
      }

      const isMobile = (width <= 768);
      const padding = isMobile ? 10 : 20;
      const availW = width - padding * 2;
      const availH = height - padding * 2;
      const mapW = bMaxX - bMinX;
      const mapH = bMaxY - bMinY;
      mapBounds = { minX: bMinX, minY: bMinY, mapW, mapH };

      // Fit the entire blueprint cleanly inside the viewport without side cropping
      const baseScale = Math.min(availW / mapW, availH / mapH);
      const scale = baseScale * userZoom;

      const offsetX = (width - mapW * scale) / 2 - (bMinX * scale) + panX;
      const offsetY = (height - mapH * scale) / 2 - (bMinY * scale) + panY;

      // Transform Plots
      rawPlots.forEach(p => {
        transformedPlots.push({
          ...p,
          x: offsetX + p.vx * scale,
          y: offsetY + p.vy * scale,
          w: p.vw * scale,
          h: p.vh * scale
        });
      });

      // Transform Roads
      rawRoads.forEach(r => {
        transformedRoads.push({
          ...r,
          x: offsetX + r.vx * scale,
          y: offsetY + r.vy * scale,
          w: r.vw * scale,
          h: r.vh * scale
        });
      });

      // Transform Gates
      rawGates.forEach(g => {
        transformedGates.push({
          ...g,
          x: offsetX + g.vx * scale,
          y: offsetY + g.vy * scale,
          w: g.vw * scale,
          h: g.vh * scale
        });
      });

      // Transform Parks
      greenParks.forEach(g => {
        transformedParks.push({
          ...g,
          x: offsetX + g.vx * scale,
          y: offsetY + g.vy * scale,
          w: g.vw * scale,
          h: g.vh * scale
        });
      });

      // Transform Future Ext
      if (futureExtensionZone) {
        transformedFutureExt = {
          ...futureExtensionZone,
          x: offsetX + futureExtensionZone.vx * scale,
          y: offsetY + futureExtensionZone.vy * scale,
          w: futureExtensionZone.vw * scale,
          h: futureExtensionZone.vh * scale
        };
      }

      updateStatsSummary();
    }

    // ─────────────────────────────────────────────────────────────
    // RENDERING ENGINE
    // ─────────────────────────────────────────────────────────────
    function getPlotThemeStyles(p, theme) {
      if (p.status === 'booked') {
        return { fill: theme.bookedPlot, stroke: theme.bookedBorder };
      }
      return { fill: theme.plotA, stroke: theme.plotABorder };
    }

    function isPlotVisibleUnderFilter(p) {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'available') return p.status !== 'booked';
      if (currentFilter === 'booked') return p.status === 'booked';
      if (currentFilter === 'corner') return p.isCorner || p.isVip;
      if (currentFilter === 'FE') return p.block === 'FE';
      return p.block === currentFilter;
    }

    function drawMasterplan() {
      const theme = isDarkTheme ? THEMES.dark : THEMES.light;

      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      // Architectural Blueprint Grid Lines
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 1;
      const gridSize = 35;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Outer Decorative Border
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(6, 6, width - 12, height - 12);

      // ── 1. DRAW GREEN PLANTATION / PARK BUFFER ──
      transformedParks.forEach(park => {
        ctx.fillStyle = theme.greenArea;
        ctx.fillRect(park.x, park.y, park.w, park.h);
        ctx.strokeStyle = theme.greenAreaBorder;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(park.x, park.y, park.w, park.h);

        // Text in Park (strictly clipped & only if space permits)
        if (park.w >= 45 && park.h >= 14) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(park.x + 2, park.y + 2, Math.max(1, park.w - 4), Math.max(1, park.h - 4));
          ctx.clip();

          const parkTitle = park.title || (park.vw < 110 ? '🌿 GREEN ZONE' : '🌿 LUSH GREEN BUFFER');
          let maxAllowed = park.h * 0.45;
          let wAllowed = park.w / (parkTitle.length * 0.55);
          let fontSize = Math.min(maxAllowed, wAllowed);
          if (fontSize < 3.5) fontSize = 3.5; // Ensure it is readable on mobile
          ctx.fillStyle = theme.greenAreaBorder;
          ctx.font = 'bold ' + fontSize + 'px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(parkTitle, park.x + park.w / 2, park.y + park.h / 2);
          ctx.restore();
        }
      });

      // ── 2. DRAW FUTURE EXTENSION (Phase II) ──
      if (transformedFutureExt) {
        const fe = transformedFutureExt;
        const isFeHighlighted = currentFilter === 'FE';
        ctx.fillStyle = isFeHighlighted ? 'rgba(99, 102, 241, 0.35)' : theme.futureExt;
        ctx.fillRect(fe.x, fe.y, fe.w, fe.h);
        ctx.strokeStyle = isFeHighlighted ? '#f59e0b' : theme.futureExtBorder;
        ctx.lineWidth = isFeHighlighted ? 3 : 2;
        ctx.strokeRect(fe.x, fe.y, fe.w, fe.h);

        if (fe.w >= 70 && fe.h >= 24) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(fe.x + 2, fe.y + 2, Math.max(1, fe.w - 4), Math.max(1, fe.h - 4));
          ctx.clip();
          ctx.fillStyle = theme.futureExtText || '#4338ca';
          ctx.font = '800 10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('PHASE II • FUTURE EXTENSION', fe.x + fe.w / 2, fe.y + fe.h / 2);
          ctx.restore();
        }
      }

      // ── 3. DRAW ROADS (Seamless Interconnected Open Junctions) ──
      // Pass A: Solid Fill Base
      transformedRoads.forEach(r => {
        ctx.fillStyle = r.isMain ? theme.mainRoad : theme.sectorRoad;
        ctx.fillRect(r.x, r.y, r.w, r.h);
      });

      // Pass B: Border Outlines
      transformedRoads.forEach(r => {
        ctx.strokeStyle = r.isMain ? theme.mainRoadBorder : theme.sectorRoadBorder;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(r.x, r.y, r.w, r.h);
      });

      // Pass C: Open Junction Clearing
      transformedRoads.forEach(r => {
        ctx.fillStyle = r.isMain ? theme.mainRoad : theme.sectorRoad;
        ctx.fillRect(r.x + 1, r.y + 1, Math.max(0, r.w - 2), Math.max(0, r.h - 2));
      });

      // Pass D: Center Dash Lines & Road Labels
      transformedRoads.forEach(r => {
        // Road Center Dash Line
        ctx.strokeStyle = theme.roadLine;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        if (r.w >= r.h) {
          ctx.moveTo(r.x, r.y + r.h / 2);
          ctx.lineTo(r.x + r.w, r.y + r.h / 2);
        } else {
          ctx.moveTo(r.x + r.w / 2, r.y);
          ctx.lineTo(r.x + r.w / 2, r.y + r.h);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Road Name Text (Strictly clipped inside road bounds with scale-aware font)
        const isHorizontal = r.w >= r.h;
        const thickness = isHorizontal ? r.h : r.w;
        const length = isHorizontal ? r.w : r.h;

        if (r.name && thickness >= 9 && length >= 35) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(r.x + 1, r.y + 1, Math.max(1, r.w - 2), Math.max(1, r.h - 2));
          ctx.clip();

          const maxFontSize = r.isMain ? 13 : 9.5;
          const fontSize = Math.min(maxFontSize, Math.max(6, thickness * 0.65));
          ctx.fillStyle = theme.roadText;
          ctx.font = '800 ' + fontSize + 'px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Adaptively shorten road label on narrow mobile scales to prevent truncation
          let roadLabel = r.name;
          if (r.isMain) {
            if (length < 180) roadLabel = '100-FT HIGHWAY';
            else if (length < 340) roadLabel = '100-FT BIHTA-PATNA HIGHWAY';
          } else if (roadLabel.includes('30\'-0"')) {
            if (length < 120) roadLabel = '30-FT';
            else roadLabel = '30\'-0" WIDE ROAD';
          } else if (roadLabel.includes('17\'-0"')) {
            if (length < 80) roadLabel = '17-FT';
            else roadLabel = '17\'-0" ROAD';
          }

          if (isHorizontal) {
            if (r.name.includes('30\'-0"') && length >= 180) {
              ctx.fillText(roadLabel, r.x + r.w * 0.58, r.y + r.h / 2);
            } else if (length > 300 && !r.isMain) {
              ctx.fillText(roadLabel, r.x + r.w * 0.28, r.y + r.h / 2);
              ctx.fillText(roadLabel, r.x + r.w * 0.72, r.y + r.h / 2);
            } else {
              ctx.fillText(roadLabel, r.x + r.w / 2, r.y + r.h / 2);
            }
          } else {
            ctx.save();
            ctx.translate(r.x + r.w / 2, r.y + r.h / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(roadLabel, 0, 0);
            ctx.restore();
          }

          ctx.restore();
        }
      });

      // ── 4. DRAW GATES ──
      transformedGates.forEach(g => {
        ctx.fillStyle = theme.gateBg;
        ctx.fillRect(g.x, g.y, g.w, g.h);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(g.x, g.y, g.w, g.h);

        if (g.w >= 24 && g.h >= 10) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(g.x + 1, g.y + 1, Math.max(1, g.w - 2), Math.max(1, g.h - 2));
          ctx.clip();
          ctx.fillStyle = theme.gateText;
          ctx.font = '800 8.5px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(g.name, g.x + g.w / 2, g.y + g.h / 2);
          ctx.restore();
        }
      });

      // ── 5. DRAW PLOTS ──
      transformedPlots.forEach(p => {
        const isHovered = hoveredPlot && hoveredPlot.id === p.id;
        const isSearched = searchHighlightPlot && searchHighlightPlot.id === p.id;
        const matchesFilter = isPlotVisibleUnderFilter(p);
        const styles = getPlotThemeStyles(p, theme);

        ctx.save();

        if (!matchesFilter) {
          ctx.globalAlpha = 0.16; // Dim filtered out plots
        }

        // Subtle Plot Drop Shadow for depth
        if (isHovered || isSearched) {
          ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
          ctx.shadowBlur = 10;
        }

        // Plot Box Fill
        ctx.fillStyle = (isHovered || isSearched) ? theme.highlightFill : styles.fill;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        ctx.shadowColor = 'transparent';

        // Plot Border
        ctx.strokeStyle = (isHovered || isSearched) ? theme.highlightStroke : styles.stroke;
        ctx.lineWidth = (isHovered || isSearched) ? 2.5 : 1;
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        // Pulsating Search Ring
        if (isSearched) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.strokeRect(p.x - 4, p.y - 4, p.w + 8, p.h + 8);
        }

        // Plot ID Text & SqFt label
        if (p.w >= 4 && p.h >= 4) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(p.x + 1, p.y + 1, Math.max(1, p.w - 2), Math.max(1, p.h - 2));
          ctx.clip();

          const isVertical = p.h > p.w * 1.4 && p.w < 34;
          const availDim = isVertical ? p.h - 4 : p.w - 4;
          const availCross = isVertical ? p.w - 4 : p.h - 4;

          let fontSize = Math.min(12, Math.max(4.5, Math.min(availDim / (p.id.length * 0.62), availCross * 0.42)));
          ctx.font = '800 ' + fontSize + 'px Inter, sans-serif';

          // Measure and ensure no horizontal overflow
          let measuredW = ctx.measureText(p.id).width;
          if (measuredW > availDim && availDim > 6) {
            fontSize = Math.max(4, fontSize * (availDim / measuredW));
            ctx.font = '800 ' + fontSize + 'px Inter, sans-serif';
          }

          ctx.fillStyle = (p.status === 'booked' && !isDarkTheme) ? '#991b1b' : theme.textPlotNum;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const showSqft = !isVertical && p.h >= 28 && p.w >= 34 && p.sqft && (fontSize >= 7);

          if (isVertical) {
            ctx.save();
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(p.id, 0, 0);
            ctx.restore();
          } else if (showSqft) {
            const sqftFontSize = Math.min(8, Math.max(5, fontSize * 0.72));
            ctx.fillText(p.id, p.x + p.w / 2, p.y + p.h / 2 - (fontSize * 0.48));
            ctx.fillStyle = theme.textSqft;
            ctx.font = '600 ' + sqftFontSize + 'px Inter, sans-serif';
            ctx.fillText(p.sqft + ' sqft', p.x + p.w / 2, p.y + p.h / 2 + (sqftFontSize * 0.75));
          } else {
            ctx.fillText(p.id, p.x + p.w / 2, p.y + p.h / 2);
          }

          ctx.restore();
        }

        ctx.restore();
      });

      // ── 6. DRAW NORTH COMPASS INDICATOR ──
      drawCompass(width - 55, 60, theme);
    }

    function drawCompass(cx, cy, theme) {
      ctx.save();
      ctx.translate(cx, cy);

      // Outer circle
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fillStyle = isDarkTheme ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)';
      ctx.fill();
      ctx.strokeStyle = theme.roadLine;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // North Arrow
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(6, 4);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(-6, 4);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = '#991b1b';
      ctx.fill();

      // North Letter
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', 0, -6);

      ctx.restore();
    }

    // ─────────────────────────────────────────────────────────────
    // INTERACTION HANDLING (MOUSE, TOUCH, PAN, ZOOM, HOVER, CLICK)
    // ─────────────────────────────────────────────────────────────
    function getCanvasCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
        clientX: clientX,
        clientY: clientY
      };
    }

    function findPlotAtCoords(x, y) {
      for (let i = transformedPlots.length - 1; i >= 0; i--) {
        const p = transformedPlots[i];
        if (x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) {
          return p;
        }
      }
      return null;
    }

    // No hover tooltip - click only interaction (Guru Niwas style)

    // Canvas Events
    canvas.addEventListener('mousedown', (e) => {
      isDragging = false; // Disabled panning via mouse
      didDrag = false;
      const pos = getCanvasCoords(e);
      dragStart = { x: pos.x, y: pos.y };
      canvas.style.cursor = 'default';
    });

    canvas.addEventListener('mousemove', (e) => {
      const pos = getCanvasCoords(e);
      if (isDragging) {
        // Panning is disabled on mouse drag
        return;
      }

      const found = findPlotAtCoords(pos.x, pos.y);
      if (found !== hoveredPlot) {
        hoveredPlot = found;
        drawMasterplan();
      }

      if (found) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }
    });

    canvas.addEventListener('mouseup', () => {
      isDragging = false;
      canvas.style.cursor = hoveredPlot ? 'pointer' : 'default';
    });

    canvas.addEventListener('mouseleave', () => {
      isDragging = false;
      hoveredPlot = null;
      drawMasterplan();
    });

    let lastTouchTimestamp = 0;

    canvas.addEventListener('click', (e) => {
      if (didDrag) {
        didDrag = false;
        return;
      }
      // Prevent accidental plot opens from direct touch / tap-scroll on mobile/touch screens
      if (e.pointerType === 'touch' || (Date.now() - lastTouchTimestamp < 650)) {
        return;
      }
      const pos = getCanvasCoords(e);
      const clicked = findPlotAtCoords(pos.x, pos.y);
      if (clicked) {
        openPlotModal(clicked);
      }
    });

    // Touch Handling (2-Finger Pinch Zoom & 1-Finger Drag)
    let touchStartDist = 0;
    // ─────────────────────────────────────────────────────────────
    // FOCAL POINT / CURSOR ANCHORED ZOOM ENGINE
    // ─────────────────────────────────────────────────────────────
    function zoomAtPoint(focalX, focalY, zoomFactor) {
      if (!mapBounds || !mapBounds.mapW) return;
      const isMobile = (width <= 768);
      const padding = isMobile ? 6 : 16;
      const availW = width - padding * 2;
      const availH = height - padding * 2;
      const baseScale = isMobile ? (availH / mapBounds.mapH) : Math.min(availW / mapBounds.mapW, availH / mapBounds.mapH);

      const curScale = baseScale * userZoom;
      const curBaseOffsetX = (width - mapBounds.mapW * curScale) / 2 - (mapBounds.minX * curScale);
      const curBaseOffsetY = (height - mapBounds.mapH * curScale) / 2 - (mapBounds.minY * curScale);
      const curOffsetX = curBaseOffsetX + panX;
      const curOffsetY = curBaseOffsetY + panY;

      // World coordinates under cursor/touch point before zoom
      const worldX = (focalX - curOffsetX) / curScale;
      const worldY = (focalY - curOffsetY) / curScale;

      const newZoom = Math.min(4.5, Math.max(0.5, userZoom * zoomFactor));
      if (newZoom === userZoom) return;

      const newScale = baseScale * newZoom;
      const newBaseOffsetX = (width - mapBounds.mapW * newScale) / 2 - (mapBounds.minX * newScale);
      const newBaseOffsetY = (height - mapBounds.mapH * newScale) / 2 - (mapBounds.minY * newScale);

      // Re-anchor pan so (worldX, worldY) stays precisely under cursor (focalX, focalY)
      panX = focalX - newBaseOffsetX - (worldX * newScale);
      panY = focalY - newBaseOffsetY - (worldY * newScale);
      userZoom = newZoom;

      buildTransformedLayout();
      drawMasterplan();
    }

    let startPinchZoom = 1.0;
    let touchMidPoint = { x: 0, y: 0 };

    canvas.addEventListener('touchstart', (e) => {
      lastTouchTimestamp = Date.now();
      if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const rect = canvas.getBoundingClientRect();
        touchMidPoint = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top
        };
        startPinchZoom = userZoom;
      } else if (e.touches.length === 1) {
        // Prevent single touch from panning so users can scroll the page normally
        const pos = getCanvasCoords(e);
        dragStart = { x: pos.x, y: pos.y };
        didDrag = false;
        isDragging = false; // Disabled panning via touch
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      lastTouchTimestamp = Date.now();
      if (e.touches.length === 2) {
        if (e.cancelable) e.preventDefault();
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (touchStartDist > 0 && currentDist > 0) {
          const factor = currentDist / touchStartDist;
          touchStartDist = currentDist;
          zoomAtPoint(touchMidPoint.x, touchMidPoint.y, factor);
        }
      } else if (e.touches.length === 1 && isDragging) {
        const pos = getCanvasCoords(e);
        const dx = pos.x - dragStart.x;
        const dy = pos.y - dragStart.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag = true;
        panX += dx;
        panY += dy;
        dragStart = { x: pos.x, y: pos.y };
        buildTransformedLayout();
        drawMasterplan();
      }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      lastTouchTimestamp = Date.now();
      if (e.touches.length < 2) touchStartDist = 0;
      isDragging = false;
      // Note: Direct touch tap plot opening is disabled on mobile/touch screens to ensure smooth, accident-free page scrolling.
    });

    // Mouse Wheel Zoom centered at Cursor Focal Point with Ctrl key
    canvas.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
        zoomAtPoint(mouseX, mouseY, zoomFactor);
      }
    }, { passive: false });

    // ─────────────────────────────────────────────────────────────
    // ROYAL GARDEN VIRTUAL TOUCH CURSOR & SQUARE TRACKPAD DOCK
    // ─────────────────────────────────────────────────────────────
    const rgCursorToggleBtn = document.getElementById('rg-cursor-toggle-btn');
    const rgCursorToggleText = document.getElementById('rg-cursor-toggle-text');
    const rgTouchCursor = document.getElementById('rg-touch-cursor');
    const rgCursorLabel = document.getElementById('rg-cursor-label');
    const rgTouchController = document.getElementById('rg-touch-controller');
    const rgControllerClose = document.getElementById('rg-controller-close');
    const rgTrackpad = document.getElementById('rg-trackpad');
    const rgTrackpadPuck = document.getElementById('rg-trackpad-puck');
    const rgCursorActionBtn = document.getElementById('rg-cursor-action-btn');
    const rgActionBtnText = document.getElementById('rg-action-btn-text');
    const rgCursorVal = document.getElementById('rg-cursor-val');

    let isRgCursorActive = false;
    let rgCursorX = 0;
    let rgCursorY = 0;
    let rgCursorHoveredPlot = null;
    let prevRgHoveredId = null;

    function updateRgCursor(newX, newY) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cWidth = rect.width || width;
      const cHeight = rect.height || height;

      rgCursorX = Math.max(2, Math.min(cWidth - 2, newX));
      rgCursorY = Math.max(2, Math.min(cHeight - 2, newY));

      if (rgTouchCursor) {
        rgTouchCursor.style.transform = `translate3d(${rgCursorX}px, ${rgCursorY}px, 0)`;
      }

      // Hit-testing against transformed plots
      const found = findPlotAtCoords(rgCursorX, rgCursorY);
      const currentId = found ? found.id : null;
      if (currentId !== prevRgHoveredId) {
        prevRgHoveredId = currentId;
        hoveredPlot = found;
        drawMasterplan(); // ONLY redraw when plot boundary actually changes!
      }
      rgCursorHoveredPlot = found;

      if (found) {
        const isBooked = BOOKED_PLOT_IDS.has(found.id);
        const statusText = isBooked ? 'BOOKED' : (found.isCorner ? 'CORNER VIP' : 'AVAILABLE');
        const priceStr = "₹" + ((found.sqft * BASE_RATE_PER_SQFT) / 100000).toFixed(2) + " Lakh";
        if (rgCursorLabel) rgCursorLabel.textContent = found.id;
        if (rgCursorVal) rgCursorVal.innerHTML = `<span style="color:#fde047; font-weight:800;">Plot ${found.id}</span> • ${found.sqft} Sq.Ft (${statusText}) • ${priceStr}`;
        if (rgCursorActionBtn) {
          rgCursorActionBtn.disabled = false;
          rgCursorActionBtn.classList.add('has-plot');
        }
        if (rgActionBtnText) rgActionBtnText.innerHTML = `👉 Click to Open Plot ${found.id} Details ➔`;
      } else {
        if (rgCursorLabel) rgCursorLabel.textContent = 'Move to Plot';
        if (rgCursorVal) rgCursorVal.textContent = 'Move cursor over any plot';
        if (rgCursorActionBtn) {
          rgCursorActionBtn.disabled = true;
          rgCursorActionBtn.classList.remove('has-plot');
        }
        if (rgActionBtnText) rgActionBtnText.innerHTML = `Move cursor over plot`;
      }
    }

    function setRgCursorMode(enabled) {
      isRgCursorActive = enabled;
      if (enabled && window.closeGuruCursor) {
        window.closeGuruCursor();
      }
      if (rgCursorToggleBtn) {
        rgCursorToggleBtn.classList.toggle('active', enabled);
      }
      if (rgCursorToggleText) {
        rgCursorToggleText.textContent = enabled ? 'Touch Cursor: ON' : 'Touch Cursor: OFF';
      }
      if (rgTouchCursor) {
        rgTouchCursor.classList.toggle('active', enabled);
      }
      if (rgTouchController) {
        rgTouchController.style.display = enabled ? 'block' : 'none';
      }

      if (enabled) {
        if (rgTouchController) {
          rgTouchController.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        const rect = canvas.getBoundingClientRect();
        rgCursorX = (rect.width || width) / 2;
        rgCursorY = (rect.height || height) / 2;
        updateRgCursor(rgCursorX, rgCursorY);
      } else {
        hoveredPlot = null;
        rgCursorHoveredPlot = null;
        prevRgHoveredId = null;
        drawMasterplan();
      }
    }

    window.closeRgCursor = () => setRgCursorMode(false);

    if (rgCursorToggleBtn) {
      rgCursorToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setRgCursorMode(!isRgCursorActive);
      });
    }

    if (rgControllerClose) {
      rgControllerClose.addEventListener('click', (e) => {
        e.preventDefault();
        setRgCursorMode(false);
      });
    }

    if (rgCursorActionBtn) {
      rgCursorActionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (rgCursorHoveredPlot) {
          openPlotModal(rgCursorHoveredPlot);
        }
      });
    }

    // Ultra-Fast Relative Delta Trackpad Engine with Tap-to-Click
    if (rgTrackpad) {
      let lastRgTrackpadX = 0;
      let lastRgTrackpadY = 0;
      let touchStartTime = 0;
      let totalDistMoved = 0;
      let isRgTracking = false;

      function startRgTracking(clientX, clientY) {
        isRgTracking = true;
        touchStartTime = Date.now();
        totalDistMoved = 0;
        rgTrackpad.classList.add('touching');
        lastRgTrackpadX = clientX;
        lastRgTrackpadY = clientY;
        if (rgTrackpadPuck) {
          rgTrackpadPuck.style.transform = 'translate(0px, 0px)';
        }
      }

      function moveRgTracking(clientX, clientY) {
        if (!isRgTracking) return;
        const dx = clientX - lastRgTrackpadX;
        const dy = clientY - lastRgTrackpadY;
        lastRgTrackpadX = clientX;
        lastRgTrackpadY = clientY;
        totalDistMoved += Math.hypot(dx, dy);

        const sensitivity = 2.0; // High-speed responsiveness
        updateRgCursor(rgCursorX + dx * sensitivity, rgCursorY + dy * sensitivity);

        if (rgTrackpadPuck) {
          const clampPuckX = Math.max(-35, Math.min(35, dx * 3));
          const clampPuckY = Math.max(-35, Math.min(35, dy * 3));
          rgTrackpadPuck.style.transform = `translate(${clampPuckX}px, ${clampPuckY}px)`;
        }
      }

      function stopRgTracking() {
        if (!isRgTracking) return;
        isRgTracking = false;
        rgTrackpad.classList.remove('touching');
        if (rgTrackpadPuck) {
          rgTrackpadPuck.style.transform = 'translate(0px, 0px)';
        }
        // Tap-to-click: If quick tap with minimal movement, open plot modal
        const duration = Date.now() - touchStartTime;
        if (duration < 280 && totalDistMoved < 10) {
          if (rgCursorHoveredPlot) {
            openPlotModal(rgCursorHoveredPlot);
          }
        }
      }

      rgTrackpad.addEventListener('touchstart', (e) => {
        if (e.touches.length >= 1) {
          e.preventDefault();
          e.stopPropagation();
          startRgTracking(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: false });

      rgTrackpad.addEventListener('touchmove', (e) => {
        if (e.touches.length >= 1) {
          e.preventDefault();
          e.stopPropagation();
          moveRgTracking(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: false });

      rgTrackpad.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopRgTracking();
      });

      rgTrackpad.addEventListener('touchcancel', stopRgTracking);

      // Mouse support on trackpad
      rgTrackpad.addEventListener('mousedown', (e) => {
        startRgTracking(e.clientX, e.clientY);
      });
      window.addEventListener('mousemove', (e) => {
        if (isRgTracking) {
          moveRgTracking(e.clientX, e.clientY);
        }
      });
      window.addEventListener('mouseup', () => {
        if (isRgTracking) {
          stopRgTracking();
        }
      });
    }

    // ─────────────────────────────────────────────────────────────
    // HEADER TOOLBAR & UI CONTROLS
    // ─────────────────────────────────────────────────────────────
    // Zoom In
    const zoomInBtn = document.getElementById('rg-zoom-in');
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        zoomAtPoint(width / 2, height / 2, 1.25);
      });
    }

    // Zoom Out
    const zoomOutBtn = document.getElementById('rg-zoom-out');
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        zoomAtPoint(width / 2, height / 2, 0.8);
      });
    }

    // Reset View
    const zoomResetBtn = document.getElementById('rg-zoom-reset');
    if (zoomResetBtn) {
      zoomResetBtn.addEventListener('click', () => {
        userZoom = 1.0;
        panX = 0;
        panY = 0;
        searchHighlightPlot = null;
        buildTransformedLayout();
        drawMasterplan();
      });
    }

    // Dark / Light Theme Toggle
    const themeToggleBtn = document.getElementById('rg-toggle-view-mode');
    const themeModeIcon = document.getElementById('rg-mode-icon');
    const themeModeText = document.getElementById('rg-mode-text');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        if (themeModeText) themeModeText.textContent = isDarkTheme ? 'Light View' : 'Dark View';
        if (themeModeIcon) themeModeIcon.textContent = isDarkTheme ? 'light_mode' : 'dark_mode';
        drawMasterplan();
      });
    }

    // Filter Pills
    const filterPills = document.querySelectorAll('.rg-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-filter') || 'all';
        searchHighlightPlot = null;
        updateStatsSummary();
        drawMasterplan();
      });
    });

    // Plot Search Box
    const searchInput = document.getElementById('rg-plot-search');
    const searchClear = document.getElementById('rg-search-clear');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toUpperCase();
        if (searchClear) searchClear.style.display = query ? 'block' : 'none';

        if (!query) {
          searchHighlightPlot = null;
          drawMasterplan();
          return;
        }

        // Find matching plot
        const match = rawPlots.find(p => p.id.toUpperCase() === query || p.id.toUpperCase().replace('-', '') === query);
        if (match) {
          searchHighlightPlot = match;
          userZoom = 1.85;
          const padding = 16;
          const baseScale = Math.min((width - padding * 2) / mapBounds.mapW, (height - padding * 2) / mapBounds.mapH);
          const scale = baseScale * userZoom;
          panX = -((match.vx + match.vw / 2) - (mapBounds.minX + mapBounds.mapW / 2)) * scale;
          panY = -((match.vy + match.vh / 2) - (mapBounds.minY + mapBounds.mapH / 2)) * scale;
          buildTransformedLayout();
          drawMasterplan();
        } else {
          searchHighlightPlot = null;
          drawMasterplan();
        }
      });
    }

    if (searchClear && searchInput) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchHighlightPlot = null;
        drawMasterplan();
      });
    }

    function updateStatsSummary() {
      const statsEl = document.getElementById('rg-stats-text');
      if (!statsEl) return;
      const totalCount = rawPlots.length;
      let count = 0;
      if (currentFilter === 'all') count = totalCount;
      else if (currentFilter === 'available') count = rawPlots.filter(p => p.status !== 'booked').length;
      else if (currentFilter === 'booked') count = rawPlots.filter(p => p.status === 'booked').length;
      else if (currentFilter === 'corner') count = rawPlots.filter(p => p.isCorner || p.isVip).length;
      else if (currentFilter === 'FE') count = rawPlots.filter(p => p.block === 'FE').length;
      else count = rawPlots.filter(p => p.block === currentFilter).length;

      statsEl.innerHTML = `Showing <strong>${count} Plots</strong> • Drag map to Pan • Ctrl + Scroll to Zoom`;
    }

    // ─────────────────────────────────────────────────────────────
    // GURU NIWAS STYLE — CLICK-ONLY PLOT DETAIL MODAL + KYC BOOK
    // ─────────────────────────────────────────────────────────────
    function openPlotModal(p) {
      const existing = document.getElementById('plot-inspect-modal');
      if (existing) existing.remove();

      selectedPlot = p;

      const statusBg = (p.isCorner || p.isVip) ? '#fef3c7' : (p.status === 'booked' ? '#fee2e2' : '#d1fae5');
      const statusColor = (p.isCorner || p.isVip) ? '#b45309' : (p.status === 'booked' ? '#991b1b' : '#065f46');
      const statusText = (p.isCorner || p.isVip) ? '★ Premium Corner / VIP Plot' : (p.status === 'booked' ? '🔴 Reserved / Booked' : '🟢 Available for Booking');

      const rateDisplay = '₹' + p.rate.toLocaleString('en-IN');
      const plcNote = (p.isCorner || p.isVip) ? '<span style="color:#d97706;text-transform:none;">(incl. 10% PLC)</span>' : '';

      const bookBtn = p.status !== 'booked'
        ? `<button class="btn-gold" style="width:100%;justify-content:center;padding:0.85rem;font-size:0.88rem;font-weight:700;" onclick="window.openKycModal('${p.id}', '${p.sqft}', '${p.price}', ${p.isCorner || p.isVip}, 'royal_garden')"><span class="material-symbols-outlined" style="font-size:20px;">bookmark_add</span> Book Plot ${p.id} (${p.sqft} Sq.Ft) Now</button>`
        : `<button class="btn-outline" style="width:100%;justify-content:center;padding:0.85rem;font-size:0.85rem;opacity:0.6;cursor:not-allowed;" disabled>Plot Already Booked</button>`;

      const modalHTML = `
        <div class="plot-modal-overlay active" id="plot-inspect-modal">
          <div class="plot-modal-card" style="padding:0;overflow:hidden;max-width:550px;">
            <div style="width:100%;height:190px;position:relative;overflow:hidden;">
              <img src="./assets/royal_garden_3d_gate.webp" alt="Royal Garden" style="width:100%;height:100%;object-fit:cover;">
              <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.2));"></div>
              <button id="close-rg-plot-modal-btn" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.9);border:none;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#0f172a;z-index:10;">
                <span class="material-symbols-outlined" style="font-size:18px;">close</span>
              </button>
              <div style="position:absolute;bottom:16px;left:20px;right:20px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.35rem;">
                  <span style="background:${statusBg};color:${statusColor};font-weight:800;font-size:0.68rem;padding:4px 10px;border-radius:9999px;text-transform:uppercase;">
                    ${statusText}
                  </span>
                </div>
                <h3 style="font-size:1.6rem;font-weight:800;color:#ffffff;margin:0;">
                  Plot ${p.id} — ${p.sqft} Sq.Ft.
                </h3>
              </div>
            </div>

            <div style="padding:1.5rem;">
              <p style="font-size:0.82rem;color:#64748b;margin-bottom:1.25rem;">
                Royal Garden, Mouza Painathi (Kanhauli Bihta-Patna Highway) — Swarup Group
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
                <div style="font-size:0.85rem;font-weight:700;color:#10b981;">${rateDisplay} / Sq.Ft.</div>
              </div>
              <div>
                <div style="font-size:0.68rem;color:#64748b;font-weight:600;text-transform:uppercase;">Estimated Total ${plcNote}</div>
                <div style="font-size:1.05rem;font-weight:800;color:#1e3a8a;">${p.price}</div>
              </div>
            </div>
            
            <div style="margin-bottom:1.5rem;">
              <div style="font-size:0.75rem;color:#64748b;font-weight:700;text-transform:uppercase;margin-bottom:0.5rem;">✨ Plot Highlights</div>
              <ul style="margin:0;padding-left:1.2rem;font-size:0.85rem;color:#334155;line-height:1.6;">
                ${(p.isCorner || p.isVip) ? '<li><strong>Dual Road Access</strong> — Unmatched entry and exit convenience.</li><li><strong>10% Premium Corner Valuation</strong> — Highest appreciation potential.</li>' : '<li><strong>Excellent Layout</strong> — Perfect proportions for modern villa construction.</li><li><strong>Direct Connectivity</strong> — Immediate access to the 17\'-0" sector road.</li>'}
                <li><strong>Secure Investment</strong> — 100% Direct Immediate Registry.</li>
                <li><strong>Near Kanhauli Bus Stand</strong> — 500M from Ring Road & Main Highway.</li>
              </ul>
            </div>

            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              ${bookBtn}
              <button class="btn-outline" style="width:100%;justify-content:center;padding:0.75rem;font-size:0.82rem;" onclick="window.triggerVipModal('${p.id}', 'Royal Garden')">
                <span class="material-symbols-outlined" style="font-size:18px;">directions_car</span> Schedule Free Site Visit Cab
              </button>
            </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHTML);
      document.getElementById('close-rg-plot-modal-btn').addEventListener('click', () => { const m = document.getElementById('plot-inspect-modal'); if (m) m.remove(); });
      document.getElementById('plot-inspect-modal').addEventListener('click', (e) => { if (e.target.id === 'plot-inspect-modal') e.target.remove(); });
    }

    // Expose openPlotModal to global window
    window.openRoyalGardenPlotModal = openPlotModal;

    // Window Resize & Load Handlers
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('load', resizeCanvas);
    setTimeout(resizeCanvas, 50);
    setTimeout(resizeCanvas, 300);
    resizeCanvas();
  }
})();
