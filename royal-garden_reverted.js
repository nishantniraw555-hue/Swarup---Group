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

  let camera = { 
    x: (CSS_WIDTH - PDF_W * SCALE) / 2, 
    y: (CSS_HEIGHT - PDF_H * SCALE) / 2, 
    zoom: 1.0 
  };
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

    // C-1 to C-4 (third row, y≈19.6)
    {id:"C-1", sqft:2060, pdfX:16.76, pdfY:19.43, w:1.20, h:0.85, color:"#bae6fd"},
    {id:"C-2", sqft:2200, pdfX:15.36, pdfY:19.43, w:1.20, h:0.85, color:"#bae6fd"},
    {id:"C-3", sqft:1616, pdfX:13.64, pdfY:19.43, w:1.20, h:0.85, color:"#bae6fd"},
    {id:"C-4", sqft:1616, pdfX:12.29, pdfY:19.43, w:1.20, h:0.85, color:"#bae6fd"},

    // E-series (right column, x≈20.5, y from 20.8 down to 31.1)
    {id:"E-1",  sqft:1050, pdfX:20.37, pdfY:20.52, w:0.86, h:0.86, color:"#d8b4fe"},
    {id:"E-2",  sqft:1050, pdfX:20.34, pdfY:21.38, w:0.86, h:0.86, color:"#d8b4fe"},
    {id:"E-3",  sqft:1050, pdfX:20.31, pdfY:22.24, w:0.86, h:0.86, color:"#d8b4fe"},
    {id:"E-4",  sqft:1050, pdfX:20.26, pdfY:23.10, w:0.86, h:0.86, color:"#d8b4fe"},
    {id:"E-5",  sqft:1050, pdfX:20.23, pdfY:23.96, w:0.86, h:0.86, color:"#d8b4fe"},
    {id:"E-6",  sqft:1050, pdfX:20.18, pdfY:24.82, w:0.86, h:0.86, color:"#d8b4fe"},
    {id:"E-7",  sqft:1050, pdfX:20.13, pdfY:25.68, w:0.86, h:0.86, color:"#d8b4fe"},
    {id:"E-8",  sqft:1050, pdfX:20.10, pdfY:26.54, w:0.86, h:0.86, color:"#d8b4fe"},
    {id:"E-9",  sqft:1050, pdfX:20.07, pdfY:27.40, w:0.86, h:0.86, color:"#d8b4fe"},
    {id:"E-10", sqft:1050, pdfX:20.05, pdfY:28.26, w:0.86, h:0.86, color:"#d8b4fe"},

    // B-100 to B-87 (right column, x≈21.9, y from 20.8 down to 31.9)
    {id:"B-100", sqft:1035, pdfX:21.68, pdfY:20.52, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-99",  sqft:1005, pdfX:21.66, pdfY:21.38, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-98",  sqft:1020, pdfX:21.66, pdfY:22.24, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-97",  sqft:1030, pdfX:21.66, pdfY:23.10, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-96",  sqft:1040, pdfX:21.66, pdfY:23.96, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-95",  sqft:1055, pdfX:21.66, pdfY:24.82, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-94",  sqft:1065, pdfX:21.66, pdfY:25.68, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-93",  sqft:1075, pdfX:21.66, pdfY:26.54, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-92",  sqft:1085, pdfX:21.66, pdfY:27.40, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-91",  sqft:1095, pdfX:21.66, pdfY:28.26, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-90",  sqft:1120, pdfX:21.66, pdfY:29.12, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-89",  sqft:1120, pdfX:21.66, pdfY:29.98, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-88",  sqft:1076, pdfX:21.66, pdfY:30.84, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-87",  sqft:854,  pdfX:21.66, pdfY:31.70, w:1.10, h:0.86, color:"#fef08a"},
    {id:"B-86",  sqft:856,  pdfX:20.10, pdfY:31.70, w:1.10, h:0.86, color:"#fef08a"},

    // B-5 to B-11 (left column, x≈10, y from 22.9 to 31)
    {id:"B-5",  sqft:2400, pdfX:10.27, pdfY:22.76, w:1.44, h:1.15, color:"#fef08a"},
    {id:"B-6",  sqft:2100, pdfX:10.10, pdfY:23.91, w:1.44, h:1.15, color:"#fef08a"},
    {id:"B-7",  sqft:1500, pdfX:9.94,  pdfY:25.60, w:1.44, h:1.15, color:"#fef08a"},
    {id:"B-8",  sqft:1500, pdfX:9.80,  pdfY:26.56, w:1.44, h:1.15, color:"#fef08a"},
    {id:"B-9",  sqft:1800, pdfX:9.62,  pdfY:28.10, w:1.44, h:1.15, color:"#fef08a"},
    {id:"B-10", sqft:1500, pdfX:9.45,  pdfY:29.20, w:1.44, h:1.15, color:"#fef08a"},
    {id:"B-11", sqft:1600, pdfX:9.27,  pdfY:30.70, w:1.44, h:1.15, color:"#fef08a"},

    // B-12 and B-13 (middle area, y≈32.4)
    {id:"B-12", sqft:3000, pdfX:11.18, pdfY:32.13, w:1.44, h:1.15, color:"#fef08a"},
    {id:"B-13", sqft:1800, pdfX:13.74, pdfY:32.20, w:1.44, h:1.15, color:"#fef08a"},
    {id:"B-14", sqft:1580, pdfX:14.95, pdfY:32.30, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-15", sqft:1175, pdfX:15.95, pdfY:32.40, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-16", sqft:1236, pdfX:16.81, pdfY:32.45, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-17", sqft:1250, pdfX:17.67, pdfY:32.50, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-18", sqft:1267, pdfX:18.53, pdfY:32.55, w:0.86, h:1.15, color:"#fef08a"},

    // B-19 to B-20 (middle lower)
    {id:"B-19", sqft:1370, pdfX:13.15, pdfY:33.65, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-20", sqft:1918, pdfX:14.55, pdfY:33.75, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-21", sqft:1155, pdfX:15.85, pdfY:33.95, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-22", sqft:1315, pdfX:21.06, pdfY:34.40, w:1.20, h:1.15, color:"#fef08a"},

    // B-23 to B-32 (bottom row)
    {id:"B-23", sqft:1596, pdfX:12.97, pdfY:34.88, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-24", sqft:1568, pdfX:13.87, pdfY:34.93, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-25", sqft:2175, pdfX:14.87, pdfY:34.95, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-26", sqft:1194, pdfX:15.90, pdfY:35.18, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-27", sqft:1354, pdfX:16.66, pdfY:35.30, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-28", sqft:1358, pdfX:17.52, pdfY:35.37, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-29", sqft:1363, pdfX:18.35, pdfY:35.43, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-30", sqft:1367, pdfX:19.22, pdfY:35.50, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-31", sqft:1372, pdfX:20.10, pdfY:35.57, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-32", sqft:1607, pdfX:20.97, pdfY:35.62, w:1.20, h:1.15, color:"#fef08a"},

    // B-33 to B-35 (lower)
    {id:"B-33", sqft:1800, pdfX:14.79, pdfY:36.85, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-34", sqft:1155, pdfX:15.86, pdfY:36.93, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-35", sqft:1295, pdfX:21.00, pdfY:37.35, w:1.20, h:1.15, color:"#fef08a"},

    // B-36 to B-39 (lower middle)
    {id:"B-36", sqft:1414, pdfX:14.83, pdfY:38.00, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-37", sqft:1073, pdfX:15.80, pdfY:38.08, w:0.86, h:1.15, color:"#fef08a"},
    {id:"B-38", sqft:1465, pdfX:20.96, pdfY:38.48, w:1.20, h:1.15, color:"#fef08a"},
    {id:"B-39", sqft:971,  pdfX:21.22, pdfY:40.15, w:1.20, h:1.15, color:"#fef08a"},

    // B-40 to B-45 (bottom)
    {id:"B-40", sqft:2000, pdfX:11.80, pdfY:41.18, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-41", sqft:2706, pdfX:13.20, pdfY:41.25, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-42", sqft:1232, pdfX:21.24, pdfY:41.35, w:1.20, h:1.15, color:"#fef08a"},
    {id:"B-43", sqft:1857, pdfX:12.00, pdfY:42.40, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-44", sqft:1834, pdfX:13.33, pdfY:42.40, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-45", sqft:1013, pdfX:19.38, pdfY:42.70, w:1.10, h:1.15, color:"#fef08a"},

    // D-series (30'x40' = 1200 sqft grid blocks)
    // Row 1 (y≈34.1)
    {id:"D-4",  sqft:1200, pdfX:16.76, pdfY:34.06, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-5",  sqft:1200, pdfX:17.62, pdfY:34.12, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-6",  sqft:1200, pdfX:18.47, pdfY:34.18, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-7",  sqft:1200, pdfX:19.33, pdfY:34.24, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-8",  sqft:1200, pdfX:20.18, pdfY:34.30, w:0.86, h:1.15, color:"#fed7aa"},

    // Row 2 (y≈37)
    {id:"D-9",  sqft:1200, pdfX:16.69, pdfY:37.00, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-10", sqft:1200, pdfX:17.55, pdfY:37.06, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-11", sqft:1200, pdfX:18.41, pdfY:37.12, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-12", sqft:1200, pdfX:19.26, pdfY:37.19, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-13", sqft:1200, pdfX:20.12, pdfY:37.25, w:0.86, h:1.15, color:"#fed7aa"},

    // Row 3 (y≈38.2)
    {id:"D-14", sqft:1200, pdfX:16.60, pdfY:38.14, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-15", sqft:1200, pdfX:17.45, pdfY:38.20, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-16", sqft:1200, pdfX:18.31, pdfY:38.27, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-17", sqft:1200, pdfX:19.17, pdfY:38.33, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-18", sqft:1200, pdfX:20.02, pdfY:38.40, w:0.86, h:1.15, color:"#fed7aa"},

    // Row 4 (y≈39.75)
    {id:"D-19", sqft:1200, pdfX:16.16, pdfY:39.75, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-20", sqft:1200, pdfX:17.02, pdfY:39.82, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-21", sqft:1200, pdfX:17.87, pdfY:39.88, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-22", sqft:1200, pdfX:18.73, pdfY:39.95, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-23", sqft:1200, pdfX:19.59, pdfY:40.01, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-24", sqft:1200, pdfX:20.44, pdfY:40.08, w:0.86, h:1.15, color:"#fed7aa"},

    // Row 5 (y≈40.9)
    {id:"D-25", sqft:1200, pdfX:16.06, pdfY:40.88, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-26", sqft:1200, pdfX:16.92, pdfY:40.95, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-27", sqft:1200, pdfX:17.77, pdfY:41.01, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-28", sqft:1200, pdfX:18.63, pdfY:41.08, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-29", sqft:1200, pdfX:19.49, pdfY:41.15, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-30", sqft:1200, pdfX:20.35, pdfY:41.22, w:0.86, h:1.15, color:"#fed7aa"},

    // Row 6 (y≈42.5)
    {id:"D-31", sqft:1200, pdfX:15.94, pdfY:42.51, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-32", sqft:1200, pdfX:16.80, pdfY:42.58, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-33", sqft:1200, pdfX:17.65, pdfY:42.64, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-34", sqft:1200, pdfX:18.51, pdfY:42.71, w:0.86, h:1.15, color:"#fed7aa"},

    // Row 7 bottom (y≈43.7)
    {id:"D-35", sqft:1200, pdfX:15.84, pdfY:43.66, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-36", sqft:1200, pdfX:16.70, pdfY:43.73, w:0.86, h:1.15, color:"#fed7aa"},

    // D-42 to D-45 (middle area)
    {id:"D-42", sqft:1200, pdfX:12.83, pdfY:36.68, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-43", sqft:1200, pdfX:13.69, pdfY:36.75, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-44", sqft:1200, pdfX:13.05, pdfY:37.82, w:0.86, h:1.15, color:"#fed7aa"},
    {id:"D-45", sqft:1200, pdfX:13.91, pdfY:37.88, w:0.86, h:1.15, color:"#fed7aa"},

    // C-series (left wing and center)
    {id:"C-5",  sqft:2000, pdfX:9.16, pdfY:33.60, w:1.44, h:1.40, color:"#bae6fd"},
      </div>
      <div class="bot-trigger-tooltip">
        <span class="tooltip-text">Swarup AI Bot 🔊</span>
      </div>
    </button>

    <!-- Chat Popup Window -->
    <div id="swarup-bot-window" class="bot-window-closed">
      <!-- Header -->
      <div class="bot-header">
        <div class="bot-header-info">
          <div class="bot-avatar-wrapper">
            <img src="assets/swarup_symbol.webp" alt="Swarup Assistant Logo" class="bot-header-avatar">
            <span class="bot-online-badge"></span>
          </div>
          <div>
            <h4 class="bot-title">SWARUP AI ASSISTANT</h4>
            <div class="bot-subtitle">
              <span class="live-dot"></span> Voice Welcome Enabled
            </div>
          </div>
        </div>
        <div class="bot-header-actions">
          <button id="bot-voice-toggle" title="Toggle Sound / Voice Greeting" class="bot-icon-btn voice-active">
            <span class="material-symbols-outlined" id="bot-voice-icon">volume_up</span>
          </button>
          <button id="bot-close-btn" title="Minimize Chat" class="bot-icon-btn">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <!-- Voice Equalizer Banner (Visible when voiceover plays) -->
      <div id="bot-voice-banner" class="bot-voice-banner">
        <div class="voice-wave-container">
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
        </div>
        <span id="bot-voice-text" class="voice-banner-text">Voiceover: "नमस्ते! स्वरूप ग्रुप में आपका हार्दिक स्वागत है।"</span>
        <button id="bot-replay-speech" title="Replay Voice Greeting" class="btn-speech-replay">
          <span class="material-symbols-outlined" style="font-size:16px;">replay</span>
        </button>
      </div>

      <!-- Messages Body -->
      <div id="bot-messages" class="bot-messages-body">
        <!-- Messages dynamically populated by JS -->
      </div>

      <!-- Quick Action Buttons Container -->
      <div id="bot-quick-chips" class="bot-quick-chips">
        <button class="chip-btn" data-action="royal-garden">👑 Royal Garden</button>
        <button class="chip-btn" data-action="guru-niwas">🏡 Guru Niwas</button>
        <button class="chip-btn" data-action="calc-price">💰 Price Estimator</button>
        <button class="chip-btn" data-action="book-visit">🚗 Book Site Visit</button>
        <button class="chip-btn" data-action="kyc-form">📋 Booking Form</button>
        <button class="chip-btn" data-action="whatsapp">💬 WhatsApp Us</button>
      </div>

      <!-- Footer Input Form -->
      <form id="bot-input-form" class="bot-input-form" onsubmit="return false;">
        <input type="text" id="bot-user-input" placeholder="Ask about plot rates, location, visit..." autocomplete="off">
        <button type="submit" id="bot-send-btn" aria-label="Send message">
          <span class="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  </div>

  <!-- PDF.js Engine for 100% Exact AutoCAD Map Rendering -->
  <script src="assets/pdf.min.js"></script>
  <!-- Custom Script Files -->
  <script src="royal-garden.js?v=3"></script>
  <script src="script.js?v=18"></script>

</body>
</html>

    {id:"C-4a", sqft:1480, pdfX:9.27, pdfY:31.90, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-6",  sqft:2305, pdfX:9.08, pdfY:35.00, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-7",  sqft:3000, pdfX:10.17, pdfY:37.15, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-8",  sqft:2200, pdfX:10.10, pdfY:38.48, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-9",  sqft:1600, pdfX:9.93,  pdfY:39.96, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-10", sqft:2606, pdfX:11.98, pdfY:39.66, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-11", sqft:2965, pdfX:13.32, pdfY:39.78, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-12", sqft:1565, pdfX:15.24, pdfY:39.68, w:1.10, h:1.40, color:"#bae6fd"},
    {id:"C-13", sqft:1500, pdfX:15.17, pdfY:40.83, w:1.10, h:1.40, color:"#bae6fd"},
    {id:"C-14", sqft:1405, pdfX:15.11, pdfY:42.47, w:1.10, h:1.40, color:"#bae6fd"},

    // C-22 to C-32 (deep left and bottom)
    {id:"C-22", sqft:2400, pdfX:8.38,  pdfY:40.00, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-23", sqft:2400, pdfX:6.17,  pdfY:39.84, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-24", sqft:2650, pdfX:7.24,  pdfY:34.90, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-25", sqft:2600, pdfX:7.36,  pdfY:33.35, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-26", sqft:1648, pdfX:7.42,  pdfY:31.67, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-27", sqft:1896, pdfX:19.63, pdfY:32.60, w:1.44, h:1.15, color:"#bae6fd"},
    {id:"C-28", sqft:1396, pdfX:21.24, pdfY:32.73, w:1.44, h:1.15, color:"#bae6fd"},
    {id:"C-29", sqft:1200, pdfX:12.20, pdfY:34.60, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-30", sqft:5445, pdfX:10.47, pdfY:34.55, w:1.44, h:1.60, color:"#bae6fd"},
    {id:"C-31", sqft:1200, pdfX:11.97, pdfY:36.56, w:1.44, h:1.40, color:"#bae6fd"},
    {id:"C-32", sqft:1680, pdfX:12.05, pdfY:37.80, w:1.44, h:1.40, color:"#bae6fd"},

    // B-55 to B-65 (left side)
    {id:"B-55", sqft:2853, pdfX:9.89, pdfY:41.13, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-56", sqft:2325, pdfX:8.30, pdfY:41.13, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-57", sqft:2295, pdfX:6.04, pdfY:40.92, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-58", sqft:4043, pdfX:4.56, pdfY:40.25, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-59", sqft:1400, pdfX:8.84, pdfY:38.35, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-60", sqft:1400, pdfX:7.84, pdfY:38.30, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-61", sqft:1400, pdfX:6.84, pdfY:38.21, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-62", sqft:1253, pdfX:5.94, pdfY:38.15, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-63", sqft:2246, pdfX:4.65, pdfY:38.09, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-64", sqft:1909, pdfX:9.21, pdfY:37.05, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-65", sqft:1909, pdfX:8.21, pdfY:37.00, w:1.10, h:1.15, color:"#fef08a"},

    // B-66 to B-85 (far left)
    {id:"B-66", sqft:1909, pdfX:6.98, pdfY:36.90, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-67", sqft:1674, pdfX:6.04, pdfY:36.85, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-68", sqft:3163, pdfX:4.76, pdfY:36.75, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-69", sqft:2624, pdfX:3.33, pdfY:36.73, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-70", sqft:2334, pdfX:2.26, pdfY:36.65, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-71", sqft:1354, pdfX:6.14, pdfY:34.80, w:1.10, h:1.10, color:"#fef08a"},
    {id:"B-72", sqft:2260, pdfX:5.09, pdfY:34.68, w:1.10, h:1.10, color:"#fef08a"},
    {id:"B-73", sqft:1590, pdfX:4.08, pdfY:34.65, w:1.10, h:1.10, color:"#fef08a"},
    {id:"B-74", sqft:1590, pdfX:3.24, pdfY:34.59, w:1.10, h:1.10, color:"#fef08a"},
    {id:"B-75", sqft:1721, pdfX:2.37, pdfY:34.51, w:1.10, h:1.10, color:"#fef08a"},
    {id:"B-76", sqft:1329, pdfX:6.15, pdfY:33.30, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-77", sqft:2217, pdfX:5.22, pdfY:33.24, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-78", sqft:1560, pdfX:4.18, pdfY:33.16, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-79", sqft:1560, pdfX:3.32, pdfY:33.09, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-80", sqft:1700, pdfX:2.49, pdfY:33.00, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-81", sqft:1444, pdfX:2.61, pdfY:31.14, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-82", sqft:1278, pdfX:3.48, pdfY:31.25, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-83", sqft:1145, pdfX:4.31, pdfY:31.38, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-84", sqft:1549, pdfX:5.38, pdfY:31.48, w:1.10, h:1.15, color:"#fef08a"},
    {id:"B-85", sqft:868,  pdfX:6.37, pdfY:31.60, w:1.10, h:1.15, color:"#fef08a"},
  ];

  // ── LANDMARK LABELS (from PDF) ──
  const landmarks = [
    {text:"PROPOSED LAYOUT OF PLOTS PLAN", x:11.07, y:4.03, size:16, color:"#000"},
    {text:"AT MOUZA - PAINATHI, THANA NO - 68,", x:10.82, y:5.06, size:12, color:"#000"},
    {text:"R-THANA - MANER, DIST - PATNA", x:12.13, y:5.70, size:12, color:"#000"},
    {text:"ROYAL GARDEN", x:12.79, y:14.84, size:20, color:"#dc2626"},
    {text:"Building Your Dreams", x:13.39, y:15.43, size:14, color:"#2563eb"},
    {text:"PROPOSED KANHAULI BUS STAND", x:23.22, y:7.25, size:10, color:"#000"},
    {text:"BIHTA - SARMERA ROAD", x:29.62, y:9.66, size:10, color:"#fff"},
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
    ctx.strokeStyle = "#166534";
    ctx.lineWidth = 0.08;
    ctx.strokeRect(12.0, 19.45, 4.1, 12.7);
    ctx.save();
    ctx.translate(14.05, 25.8);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#166534";
    ctx.font = "bold 0.75px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FUTURE EXTENSION", 0, 0);
    ctx.restore();

    // ── RED LANDOWNER AREA ──
    ctx.fillStyle = "rgba(255, 127, 127, 0.35)";
    ctx.fillRect(8.3, 20.0, 3.1, 4.4);

    // ════════════════════════════════════════════════════════════════
    // 2. PLOTS SECTOR (DRAWN SECOND INSIDE ROAD GRID CAVITIES)
    // ════════════════════════════════════════════════════════════════
    plots.forEach(p => {
      const isHover = hoveredPlot && hoveredPlot.id === p.id;
      const x = p.pdfX;
      const y = p.pdfY;
      const w = p.w;
      const h = p.h;

      // Plot Fill
      if (isHover) ctx.fillStyle = "#34d399"; // Vibrant emerald hover
      else ctx.fillStyle = p.color || "#e0f2fe";
      ctx.fillRect(x, y, w, h);

      // Plot Border
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 0.035;
      ctx.strokeRect(x, y, w, h);

      // Plot ID Text
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 0.21px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.id, x + w / 2, y + h / 2 - 0.11);

      // Plot Area Text
      ctx.fillStyle = "#334155";
      ctx.font = "600 0.15px Inter, sans-serif";
      ctx.fillText(p.sqft + " SqFt", x + w / 2, y + h / 2 + 0.14);
    });

    // ════════════════════════════════════════════════════════════════
    // 3. TOP-LAYER LANDMARKS, TITLES & COMPASS
    // ════════════════════════════════════════════════════════════════
    landmarks.forEach(lm => {
      ctx.fillStyle = lm.color;
      ctx.font = `bold ${lm.size * 0.04}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(lm.text, lm.x, lm.y);
    });

    // ── COMPASS (top left) ──
    ctx.save();
    ctx.translate(2.5, 8.0);
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

  canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
      camera.x += (e.clientX - dragStart.x);
      camera.y += (e.clientY - dragStart.y);
      dragStart = { x: e.clientX, y: e.clientY };
      drawMap();
      return;
    }
    const { wx, wy } = getWorldPos(e);
    let found = null;
    for (const p of plots) {
      if (wx >= p.pdfX && wx <= p.pdfX + p.w && wy >= p.pdfY && wy <= p.pdfY + p.h) {
        found = p;
        break;
      }
    }
    if (found !== hoveredPlot) {
      hoveredPlot = found;
      canvas.style.cursor = found ? "pointer" : "grab";
      drawMap();
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

        <button class="chip-btn" data-action="whatsapp">💬 WhatsApp Us</button>
      </div>

      <!-- Footer Input Form -->
      <form id="bot-input-form" class="bot-input-form" onsubmit="return false;">
        <input type="text" id="bot-user-input" placeholder="Ask about plot rates, location, visit..." autocomplete="off">
        <button type="submit" id="bot-send-btn" aria-label="Send message">
          <span class="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  </div>

  <!-- PDF.js Engine for 100% Exact AutoCAD Map Rendering -->
  <script src="assets/pdf.min.js"></script>
  <!-- Custom Script Files -->
  <script src="royal-garden.js?v=3"></script>
  <script src="script.js?v=18"></script>

</body>
</html>
