const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, './src/components/career-sections'),
  path.join(__dirname, './src/views/JobDetail')
];

function roundRem(val) {
  // up to 4 decimal places
  let str = (val / 16).toFixed(4);
  return str.replace(/\.?0+$/, '') + 'rem';
}

function processFile(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // match fontSize: '15px' or "15px"
    content = content.replace(/fontSize:\s*(['"])(\d+)px\1/g, (match, quote, digits) => {
      let rem = roundRem(parseInt(digits, 10));
      return `fontSize: ${quote}${rem}${quote}`;
    });

    // match fontSize: 16 (number literal)
    content = content.replace(/fontSize:\s*(\d+)(?![\w.])/g, (match, digits) => {
      let rem = roundRem(parseInt(digits, 10));
      return `fontSize: '${rem}'`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

dirs.forEach(d => walk(d));
console.log('Done');
