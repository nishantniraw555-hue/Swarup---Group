const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function checkLayout() {
  const data = new Uint8Array(fs.readFileSync('royal garden map/royal garden new sketch 2026.1pdf_7.pdf'));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();
  
  const road17s = textContent.items.filter(it => it.str.includes('17'));
  console.log('17 ft road texts in PDF:');
  road17s.forEach(r => {
    console.log(`Text: "${r.str}", x: ${r.transform[4].toFixed(1)}, y: ${r.transform[5].toFixed(1)}, rotation: ${r.transform[0]} ${r.transform[1]} ${r.transform[2]} ${r.transform[3]}`);
  });
}

checkLayout();
