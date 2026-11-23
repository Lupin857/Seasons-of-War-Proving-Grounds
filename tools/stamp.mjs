#!/usr/bin/env node
// Stamps every local css/js link in index.html with the build number (OASIS_BUILD in js/board-settings.js), as ?v=v79,
// so a browser holding cached files from an older build fetches the whole new set together (GitHub Pages lets browsers
// keep files for 10 minutes; a mix of old and new files breaks the game). Run it after bumping OASIS_BUILD, before
// publishing: node tools/stamp.mjs [--html index.html]
import fs from 'node:fs';
const i = process.argv.indexOf('--html'), HTML = i > 0 ? process.argv[i + 1] : 'index.html';
const build = (/const OASIS_BUILD = '([^']+)'/.exec(fs.readFileSync('js/board-settings.js', 'utf8')) || [])[1];
if (!build){ console.error('OASIS_BUILD not found in js/board-settings.js'); process.exit(2); }
let n = 0;
const html = fs.readFileSync(HTML, 'utf8').replace(/\b(src|href)="((?:css|js)\/[^"?]+\.(?:css|js)|cubes\.js)(?:\?v=[^"]*)?"/g, (all, attr, file) => { n++; return `${attr}="${file}?v=${build}"`; });
fs.writeFileSync(HTML, html);
console.log(`stamped ${n} links in ${HTML} with ?v=${build}`);
