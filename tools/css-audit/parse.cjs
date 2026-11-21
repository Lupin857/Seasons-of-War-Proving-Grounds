// Flatten the page's CSS (in load order) into rules with their at-rule context.
const fs = require('fs'), path = require('path'), postcss = require('postcss');
const R = process.argv[2];
const html = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
const files = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => m[1]).filter(f => !/^https?:/.test(f));
const rules = [], atCount = {};
const inline = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
const srcs = inline.map((t, k) => ['index.html#style' + k, t]).concat(files.map(f => [f, fs.readFileSync(path.join(R, f), 'utf8')]));
srcs.forEach(([f, text], fi) => {
  const root = postcss.parse(text, { from: f });
  root.walk(n => {
    if (n.type === 'atrule') atCount[n.name] = (atCount[n.name] || 0) + 1;
    if (n.type !== 'rule') return;
    const ctx = []; let p = n.parent;
    while (p && p.type !== 'root'){ if (p.type === 'atrule') ctx.unshift('@' + p.name + ' ' + p.params); else if (p.type === 'rule') ctx.unshift('RULE ' + p.selector); p = p.parent; }
    if (ctx.some(c => c.startsWith('@keyframes'))) return;
    const decls = []; n.each(d => { if (d.type === 'decl') decls.push({ prop: d.prop, value: d.value, important: !!d.important }); });
    rules.push({ id: rules.length, file: f, line: n.source.start.line, selector: n.selector, ctx, decls });
  });
});
fs.writeFileSync(process.argv[3], JSON.stringify(rules));
console.log(srcs.length, 'sources', rules.length, 'style rules', JSON.stringify(atCount));
console.log('nested rule ctx:', rules.filter(r => r.ctx.some(c => c.startsWith('RULE'))).length);
const ctxs = {}; rules.forEach(r => { const k = r.ctx.join(' | ') || '(none)'; ctxs[k] = (ctxs[k] || 0) + 1; });
Object.entries(ctxs).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, v]) => console.log(String(v).padStart(5), k.slice(0, 110)));
