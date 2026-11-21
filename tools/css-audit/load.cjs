// Load rules + all recorded matches. matches[ruleId] = Map(target -> Set(partIdx)); target = run|state|elem[:pe]
const fs = require('fs'), zlib = require('zlib'), path = require('path');
module.exports = function load(rulesFile, dirs){
  const rules = JSON.parse(fs.readFileSync(rulesFile, 'utf8'));
  const matches = rules.map(() => new Map());
  for (const d of dirs) for (const f of fs.readdirSync(d).filter(f => f.endsWith('.matches.json.gz'))){
    const st = path.basename(d) + '|' + f.replace('.matches.json.gz', '');
    const x = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(d, f))));
    for (const [rid, hits] of Object.entries(x.m)) for (const h of hits){
      const [t, pi] = h.split('@'); const key = st + '|' + t;
      const mm = matches[+rid]; if (!mm.has(key)) mm.set(key, new Set()); mm.get(key).add(+pi);
    }
  }
  return { rules, matches };
};
