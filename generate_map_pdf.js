const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlFile = 'file:///' + path.resolve(__dirname, 'guru_niwas_exact_map_standalone.html').replace(/\\/g, '/');

const outPaths = [
  path.resolve('C:\\Users\\Nishant\\OneDrive\\Desktop', 'Guru_Niwas_Interactive_Map.pdf'),
  path.resolve(__dirname, 'Guru_Niwas_Interactive_Map.pdf'),
  path.resolve('C:\\Users\\Nishant\\Desktop', 'Guru_Niwas_Interactive_Map.pdf')
];

const primaryOutput = outPaths[1];

console.log('Generating Standalone Exact Interactive Map PDF...');
console.log('Input:', htmlFile);
console.log('Target Output:', primaryOutput);

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--no-pdf-header-footer',
  '--virtual-time-budget=3000',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${primaryOutput}`,
  htmlFile
];

const res = spawnSync(chromePath, args, { stdio: 'inherit' });
console.log('Exit code:', res.status);

if (fs.existsSync(primaryOutput)) {
  const stats = fs.statSync(primaryOutput);
  console.log(`SUCCESS! Map PDF generated: ${stats.size} bytes`);
  
  // Copy to Desktop locations
  outPaths.forEach(target => {
    try {
      const dir = path.dirname(target);
      if (fs.existsSync(dir)) {
        fs.copyFileSync(primaryOutput, target);
        console.log(`Saved exact PDF to Desktop: ${target}`);
      }
    } catch (err) {
      console.warn(`Could not copy to ${target}:`, err.message);
    }
  });
} else {
  console.log('Failed to generate Map PDF');
}
