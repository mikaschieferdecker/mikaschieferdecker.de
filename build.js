// build.js
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const EXCLUDE = ['.git', '.github', 'dist', 'node_modules', 'partials', 'build.js', '.gitignore', 'README.md'];

// Partials laden
const header = fs.readFileSync(path.join(ROOT, 'partials', 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(ROOT, 'partials', 'footer.html'), 'utf8');

function copyRecursive(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (EXCLUDE.includes(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (entry.name.endsWith('.html')) {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replaceAll('<!--#include header-->', header);
      content = content.replaceAll('<!--#include footer-->', footer);
      fs.writeFileSync(destPath, content, 'utf8');
      console.log(`✓ gebaut: ${path.relative(ROOT, destPath)}`);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

fs.rmSync(DIST, { recursive: true, force: true });
copyRecursive(ROOT, DIST);
console.log('✅ Build abgeschlossen → ./dist');
