// Which component file each rule belongs in, by the first class (or tag) in its selector.
const B = {
  tokens: [':root', 'html'],
  base: ['(tag)', '.wrap', '.sub', '.small', '.note', '.eyebrow', '.primary', '.row', '.grow', '.list', '.tag', '.err', '.mono',
    '.num', '.up', '.down', '.dim', '.sr', '.panel', '.seg', '.chg', '.pts', '.big', '.float', '#view-play', '.mid', '.bar', '.line', '.li'],
  chrome: ['.dock', '.gtop', '.sticky', '.stickywrap', '.rolebar', '.dockspace', '.side', '.purse', '.pip', '.banner', '.turnflash',
    '.turn', '.turnrow', '.sndbtn', '.tabs', '.toast', '.flag', '.tfcard', '.tfcards', '.tfnews', '.tftag', '.passglow', '.budget',
    '.dkic', '.dkgo', '.deckwrap', '.so0', '.deckp', '.pcount', '.sr', '.ingame', '.lenrow', '.mswitch', '.pbhint', '.pbs', '.pbc',
    '.pbm', '.pbg', '.pbn', '.pbx', '.pbmo', '.pbar', '.prog', '.remind', '.remindbox', '.rmsg'],
  cards: ['.mcard', '.card', '.cface', '.cface-txt', '.stamp', '.stamps', '.zh', '.zhw', '.tokchip', '.gtk', '.gcard', '.fcard',
    '.ccost', '.hgtok', '.shpiece', '.shicon', '.shbreak', '.shflash', '.gi', '.gi-arm', '.gi-tr', '.gi-sh', '.gi-rec', '.hp',
    '.hpn', '.hprow', '.tokfly', '.mtx', '.lab-crop', '.pkhit', '.pkchip', '.tip', '.tipmark'],
  popups: ['.pkwin', '.peek', '.peekwrap', '.peekhead', '.peekhint', '.pkg', '.pksheet', '.pkfoot', '.pkbody', '.pksec', '.pkttl',
    '.pksub', '.sheet', '.sheethead', '.sheetnote', '.sheet-open', '.sheetmir', '.dsheet', '.dsheet-old', '.dshead', '.dsclose',
    '.dsbody', '.dsopen', '.dstabs', '.mirmodal', '.mirpop', '.mirmbox', '.kwmini', '.kwminis', '.kwgloss', '.oinsp', '.lshort',
    '.infob', '#deck-list', '#bench-list'],
  shop: ['.market', '.mktp', '.mkthead', '.mpile', '.muster', '.mpcards', '.mplbl', '.mphit', '.mpc', '.mpface', '.mpcount', '.mshead',
    '.bmtag', '.alwaysw', '.dealdeck', '.dealback', '.slots', '.slotg', '.need', '.newb', '.mdiv', '.msec', '.mwhen', '.masonrow',
    '.writbar', '.writmark', '.writown', '.frozenrow', '.pickdock', '.pick', '.pickr', '.pickn', '.pickhint', '.mircard', '.mirwrap',
    '.mirhover', '.mirback', '.mirseal', '.mirdock', '.mirtab', '.mirtog', '.mirs', '.mirlive', '.mirgrid', '.mirtray', '.mwrap',
    '.fcards', '.sdeck', '.astack', '.ppn', '.log', '.logp', '.mirhand', '.mlist', '.musterbtn', '.mstack', '.ownrow', '.pairtag',
    '.benchp', '.gearchip', '.tx', '.jump', '.patch'],
  mobilize: ['.dgrid', '.drow', '.dslot', '.dslots', '.dspacer', '.dord', '.dend', '.dempty', '.dragwrap', '.dragghost', '.dropzone',
    '.dropgap', '.dragging', '.is-dragging', '.grip', '.mobright', '.zone', '.sidecol', '.tokbench', '.zc0', '.zc1', '.zd0', '.zd1',
    '.zg0', '.zg1', '.pbhint'],
  battle: ['.board', '.stage', '.stack', '.table', '.forces', '.abbox', '.abcol', '.ablines', '.abghost', '.abwin', '.abtog',
    '.battlectl', '.arw', '.arrows', '.arl', '.aht', '.arlic', '.charge', '.chron', '.grave', '.clash', '.linewrap', '.fr', '.cubegl',
    '.ah0', '.ah1', '.battlegrid', '.die'],
  setup: ['.startp', '.modes', '.mode', '.surow', '.sustep', '.sufs', '.subadge', '.suopp', '.sugrid', '.sul', '.sucell', '.sulobby',
    '.suhead', '.subk', '.surules', '.subar', '.suswitch', '.sugo', '.sujoin', '.suchipw', '.suchip', '.supop', '.pkgs', '.pkadd',
    '.r1', '.ppnames', '.roomcode', '.netlobby', '.handoff', '.rollside', '.rollrow', '.rollp', '.rtot', '.rvs', '.dice', '.colpick',
    '.bk', '.opinions'],
  tabs: ['.kpi', '.kpis', '.weights', '.curve', '.ladder', '.brackets', '.spark', '.smeter', '.smeter-l', '.tablewrap', '.verdict',
    '.finalbox', '.patches', '.patchlist', '.grpbtn', '.cgrid', '#view-cards', '.mirs', '.pick'],
  board: ['.labsheet', '.labbar', '.labsh', '.labcnt', '.lab-inbattle', '.lab-v-lean', '.lab-v-table', '.lab-stock', '.lab-light',
    '.lab-full', '.lab-sp-diag', '.lab-sp-fanL', '.lab-sp-fanR', '.lab-sp-up'],
  desktop: ['.oasis-desk'],
};
const ORDER = ['tokens', 'base', 'chrome', 'cards', 'popups', 'shop', 'mobilize', 'battle', 'setup', 'tabs', 'board', 'desktop'];
const KEY = new Map(); for (const b of ORDER) for (const k of B[b]) if (!KEY.has(k)) KEY.set(k, b);
const BY_FILE = { 'css/01-battle-card.css': 'battle', 'css/02-board-settings.css': 'board', 'css/03-main.css': 'base',
  'css/04-desktop-art.css': 'cards', 'css/05-fixes.css': 'base', 'css/06-mobile-crop.css': 'cards', 'css/07-no-anchor.css': 'base',
  'css/08-cards-tab.css': 'tabs' };
function keyOf(sel){
  const m = sel.replace(/:not\((?:[^()]|\([^()]*\))*\)/g, '').match(/[.#]([\w-]+)/);
  if (/^\s*(:root|html)\b/.test(sel) && !/^\s*html\s+body/.test(sel)) return /^\s*:root/.test(sel) ? ':root' : 'html';
  if (/^\s*html\s+body\s*$/.test(sel) || /^\s*body\b/.test(sel) && !m) return '(tag)';
  return m ? m[0] : '(tag)';
}
module.exports = { ORDER, bucketOf: r => KEY.get(keyOf(r.selector)) || BY_FILE[r.file] || 'base', keyOf };
