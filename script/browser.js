// Shared by script/gaps and script/a11y: serves the build in _verify/ (made by
// script/verify) and opens its pages in headless Google Chrome.
//
// Playwright and axe-core are installed on first use into ~/.cache/megakemp-verify,
// outside the repository, like the html-proofer gems in script/verify.

const fs = require('fs');
const http = require('http');
const path = require('path');
const { execFileSync } = require('child_process');
const { createRequire } = require('module');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, '_verify');
const CACHE = path.join(process.env.XDG_CACHE_HOME || path.join(require('os').homedir(), '.cache'), 'megakemp-verify');
const PACKAGES = ['playwright-core@1.56', 'axe-core@4.10'];

function dependency(name) {
  if (!fs.existsSync(path.join(CACHE, 'node_modules', name))) {
    fs.mkdirSync(CACHE, { recursive: true });
    execFileSync('npm', ['install', '--prefix', CACHE, '--no-audit', '--no-fund', '--silent', ...PACKAGES], { stdio: 'inherit' });
  }
  return createRequire(path.join(CACHE, 'index.js')).resolve(name);
}

// The pages of script/urls.txt that exist in the build and aren't redirect stubs.
function pages() {
  if (!fs.existsSync(SITE)) throw new Error('No _verify/ build; run script/verify first.');
  return fs.readFileSync(path.join(ROOT, 'script/urls.txt'), 'utf8').split('\n')
    .filter(url => url.endsWith('/'))
    .filter(url => {
      const file = path.join(SITE, url, 'index.html');
      return fs.existsSync(file) && !fs.readFileSync(file, 'utf8').includes('http-equiv="refresh"');
    });
}

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

function serve() {
  const server = http.createServer((req, res) => {
    let file = path.join(SITE, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (file.endsWith(path.sep)) file = path.join(file, 'index.html');
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(data);
    });
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () =>
    resolve({ base: `http://127.0.0.1:${server.address().port}`, close: () => server.close() })));
}

async function launch() {
  const { chromium } = require(dependency('playwright-core'));
  return chromium.launch({ channel: 'chrome' });
}

module.exports = { dependency, pages, serve, launch };
