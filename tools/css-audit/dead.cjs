// Rules whose every selector part names a class or id that appears nowhere in the page's JS or HTML.
const fs = require('fs'), path = require('path');
module.exports = function dead(R, rules, matches){
  const html = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
  let js = html.replace(/<script type="application\/json"[\s\S]*?<\/script>/g, '') + [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(f => !/vendor|cubes/.test(f)).map(f => fs.readFileSync(path.join(R, f), 'utf8')).join('\n');
  // only string and template contents count: class names live there (comments and variable names don't)
  const strs = []; const src = js.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
  for (const m of src.matchAll(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g)) strs.push(m[0]);
  js = strs.join('\n') + '\n' + html.replace(/<script[\s\S]*?<\/script>/g, '');
  const present = new Map();
  const has = tok => { if (!present.has(tok)){ const re = new RegExp('(^|[^\\w-])' + tok.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&') + '($|[^\\w-])'); present.set(tok, re.test(js)); } return present.get(tok); };
  // a class built from pieces (`lab-${x}`, 'tk ' + k) shows up as a prefix: accept a prefix match ending in - or _
  const esc = x => x.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  // a class built from pieces: 'ah' + side (ah0), `t-${k}` (t-arm), `lab-sp-${x}`: the piece before the digits or a hyphen
  const hasPrefix = tok => { const pres = new Set(); const d = tok.match(/^([a-zA-Z][\w-]*?)\d+$/); if (d) pres.add(d[1]);
    for (let i = 1; i < tok.length; i++) if (tok[i] === '-' || tok[i] === '_') pres.add(tok.slice(0, i + 1));
    for (const pre of pres){ const e = esc(pre); if (new RegExp('(^|[^\\w-])' + e + '(\\$\\{|[\'"`]\\s*\\+)').test(js)) return true; } return false; };
  const out = [];
  rules.forEach(r => {
    if (r.file.startsWith('index.html')) return;
    const parts = r.selector.split(/,(?![^(]*\))/);
    const alive = parts.some(p => {
      const toks = [...p.replace(/:not\([^)]*\)/g, '').matchAll(/([.#])([\w-]+)/g)].map(m => m[2]);
      return toks.every(t => has(t) || hasPrefix(t));
    });
    if (!alive && !(matches && matches[r.id].size)) out.push(r.id);
  });
  return out;
};
