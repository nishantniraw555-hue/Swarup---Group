const fs = require('fs');

async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync('royal garden map/royal garden new sketch 2026.1pdf_7.pdf'));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();
  
  const allTexts = textContent.items.map(it => ({
    str: it.str,
    x: it.transform[4],
    y: it.transform[5],
    rotX: it.transform[0],
    rotY: it.transform[1]
  }));

  console.log('Total text items:', allTexts.length);
  
  // Roads
  const roads = allTexts.filter(t => t.str.includes('ROAD') || t.str.includes('17') || t.str.includes('30'));
  console.log('Road items in PDF:');
  roads.forEach(r => console.log(`"${r.str}" at x=${r.x.toFixed(1)}, y=${r.y.toFixed(1)}, rot=[${r.rotX.toFixed(1)}, ${r.rotY.toFixed(1)}]`));
}

main();
