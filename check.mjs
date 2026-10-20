import fs from 'node:fs';
import assert from 'node:assert/strict';
const routes = ['', 'about/', 'our-work/', 'support/', 'projects/'];
const base = process.env.SITE_BASE || '/';
for (const route of routes) {
  const html = fs.readFileSync(`dist/${route}index.html`, 'utf8');
  assert.match(html, /<main id="main">/);
  assert.match(html, /<h1>/);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /aria-label="Primary"/);
  for (const target of routes) assert.ok(html.includes(`href="${base}${target}"`), `${route} missing ${target}`);
}
const about = fs.readFileSync('dist/about/index.html', 'utf8');
for (const name of ['Gunnar Kristiansen','Raymond Pajaron','Gilly Paul Pasao','Kari Anne Kristiansen','Kim Mulstad','Torstein Opdal','Carina Stensrud']) assert.ok(about.includes(name), `Missing ${name}`);
const support = fs.readFileSync('dist/support/index.html', 'utf8');
for (const detail of ['info@ihelpfriendship.net','4750 27 21344','50 5260','+47 909 15 612','1gunnarkristiansen@gmail.com']) assert.ok(support.includes(detail), `Missing ${detail}`);
console.log('Checked five routes, navigation, leadership, and donation details.');
