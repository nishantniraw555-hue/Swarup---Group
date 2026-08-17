const fs = require('fs');

async function analyzeBlocks() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync('royal garden map/royal garden new sketch 2026.1pdf_7.pdf'));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();
  
  const items = textContent.items.map(it => ({
    str: it.str.trim(),
    x: Math.round(it.transform[4]),
    y: Math.round(it.transform[5])
  })).filter(it => it.str.length > 0);

  // Find all occurrences of 17'-0" WIDE ROAD
  const road17 = items.filter(it => it.str.includes(`17'-0" WIDE ROAD`));
  console.log('17 ft roads (sorted by Y descending):');
  road17.sort((a, b) => b.y - a.y).forEach((r, idx) => {
    console.log(`Road #${idx + 1}: "${r.str}" at x=${r.x}, y=${r.y}`);
  });
}

analyzeBlocks();
