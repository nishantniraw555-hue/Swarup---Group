const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlFile = 'file:///' + path.resolve(__dirname, 'guru_niwas_brochure.html').replace(/\\/g, '/');
const outputFile = path.resolve(__dirname, 'Guru_Niwas_Colony_Masterplan_Brochure.pdf');

console.log('Generating PDF...');
console.log('Input:', htmlFile);
console.log('Output:', outputFile);

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--no-pdf-header-footer',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${outputFile}`,
  htmlFile
];

const res = spawnSync(chromePath, args, { stdio: 'inherit' });
console.log('Exit code:', res.status);

if (fs.existsSync(outputFile)) {
  const stats = fs.statSync(outputFile);
  console.log(`SUCCESS! PDF generated successfully: ${stats.size} bytes`);
} else {
  console.log('Failed to generate PDF');
}
