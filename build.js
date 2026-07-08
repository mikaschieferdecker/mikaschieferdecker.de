// build.js
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://mikaschieferdecker.de';
const OG_IMAGE = SITE + '/images/og-default.png';
const EXCLUDE = ['.git', '.github', 'dist', 'node_modules', 'partials', 'build.js', '.gitignore', 'README.md'];

// Partials laden
const header = fs.readFileSync(path.join(ROOT, 'partials', 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(ROOT, 'partials', 'footer.html'), 'utf8');

// Für die Sitemap gesammelte URLs
const urls = [];

// dist-relativen Dateipfad → saubere URL (ohne .html, index → /)
function toUrlPath(destPath) {
  let rel = path.relative(DIST, destPath).split(path.sep).join('/');
  rel = rel.replace(/index\.html$/, '').replace(/\.html$/, '');
  return '/' + rel;
}

// Kritische Above-the-fold-Schriften vorladen, damit sie nicht erst nach dem
// Parsen von fonts.css geladen werden (bricht die kritische Request-Kette auf).
// 400 = Fließtext, 500 = Navigation/Buttons, 600 = Überschriften.
const FONT_PRELOADS = ['inter-v20-latin-regular', 'inter-v20-latin-500', 'inter-v20-latin-600']
  .map((f) => `  <link rel="preload" href="/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin />`)
  .join('\n');

// Vollständiges Favicon-Set einbinden. Google zeigt in den Suchergebnissen
// zuverlässig nur Raster-Favicons (ICO/PNG, quadratisch); die einzelne
// SVG-Zeile pro Seite wird hier zentral um ICO/PNG/Apple-Touch/Manifest ergänzt.
const FAVICON_BLOCK = [
  '  <link rel="icon" href="/favicon.ico" sizes="32x32" />',
  '  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />',
  '  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />',
  '  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
  '  <link rel="manifest" href="/site.webmanifest" />',
].join('\n');

function injectFavicons(content) {
  return content.replace(
    /[ \t]*<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"\s*\/>/,
    FAVICON_BLOCK
  );
}

function injectFontPreloads(content) {
  if (content.indexOf('rel="preload"') !== -1 && /as=["']font["']/.test(content)) return content;
  const fontsLink = /([ \t]*<link[^>]+href=["']\/css\/fonts\.css["'][^>]*>)/;
  if (fontsLink.test(content)) {
    return content.replace(fontsLink, FONT_PRELOADS + '\n$1');
  }
  return content;
}

// Fehlende SEO-/Social-Meta pro Seite ergänzen (canonical, og:url, og:image, twitter)
function injectMeta(content, urlPath) {
  if (content.indexOf('</head>') === -1) return content;
  const abs = SITE + urlPath;
  const tags = [];
  if (!/rel=["']canonical["']/.test(content)) {
    tags.push(`  <link rel="canonical" href="${abs}" />`);
  }
  if (!/property=["']og:url["']/.test(content)) {
    tags.push(`  <meta property="og:url" content="${abs}" />`);
  }
  if (!/property=["']og:image["']/.test(content)) {
    tags.push(`  <meta property="og:image" content="${OG_IMAGE}" />`);
    tags.push(`  <meta property="og:image:width" content="1200" />`);
    tags.push(`  <meta property="og:image:height" content="630" />`);
  }
  if (!/name=["']twitter:card["']/.test(content)) {
    tags.push(`  <meta name="twitter:card" content="summary_large_image" />`);
    tags.push(`  <meta name="twitter:image" content="${OG_IMAGE}" />`);
  }
  if (!tags.length) return content;
  return content.replace('</head>', tags.join('\n') + '\n</head>');
}

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
      const urlPath = toUrlPath(destPath);
      content = injectFavicons(content);
      content = injectFontPreloads(content);
      content = injectMeta(content, urlPath);
      fs.writeFileSync(destPath, content, 'utf8');
      // 404 gehört nicht in die Sitemap
      if (path.basename(destPath) !== '404.html') urls.push(urlPath);
      console.log(`✓ gebaut: ${path.relative(ROOT, destPath)}`);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const items = urls
    .sort()
    .map((u) => {
      const priority = u === '/' ? '1.0' : (u.split('/').length <= 2 ? '0.8' : '0.6');
      return `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml, 'utf8');
  console.log(`✓ sitemap.xml (${urls.length} URLs)`);
}

fs.rmSync(DIST, { recursive: true, force: true });
copyRecursive(ROOT, DIST);
writeSitemap();
console.log('✅ Build abgeschlossen → ./dist');
