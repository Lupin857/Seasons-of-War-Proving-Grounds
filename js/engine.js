/* OasisEngine stable public API. Implementation modules load before this file. */
const OasisEngine = Object.freeze({
  version: 1,
  cards: Object.freeze({units: DEFS, buildings: BDEFS, miracles: MIRS}),
  rules: RULES,
  battle: Object.freeze({run: (cfgs, record) => runBattle(cfgs, record)}),
  game: Object.freeze({create: options => newGame(options), autoRound: (game, budget, depth) => autoRound(game, budget, depth)}),
  shop: Object.freeze({act: (name, game, player, ...args) => {
    const actions = {buy:buyRule, sell:sellRule, pass:passRule, useBM:useBMRule, useFavor:useFavorRule,
      useVision:useVisionRule, useDisc:useDiscRule, useWrit:useWritRule, useFreeze:useFreezeRule, useRedeal:useRedealRule};
    if (!Object.prototype.hasOwnProperty.call(actions, name)) throw new RangeError(`Unknown shop action: ${name}`);
    const rule = actions[name];
    return shopAct(name, rule, game, player, args);
  }, setWatcher: watcher => { SHOP_WATCH = watcher; }}),
  ai: Object.freeze({value: (game, player, name, kind) => aiValue(game, player, name, kind), baseGenome, depth: DEPTH}),
  random: Object.freeze({mulberry32}),
  balance: Object.freeze({applyOverrides: overrides => applyOverrides(overrides), clearCache: () => { OV_KEY = ''; }}),
  stats: Object.freeze({record: (stats, game) => recordStats(stats, game)}),
  settings: Object.freeze({
    get: () => Object.freeze({miracles:MIRACLES_ON, battleMiracles:BATTLE_MIR_ON, refill:REFILL_ON}),
    set: values => {
      if ('miracles' in values) MIRACLES_ON = !!values.miracles;
      if ('battleMiracles' in values) BATTLE_MIR_ON = !!values.battleMiracles;
      if ('refill' in values) REFILL_ON = !!values.refill;
      return Object.freeze({miracles:MIRACLES_ON, battleMiracles:BATTLE_MIR_ON, refill:REFILL_ON});
    },
  }),
});
globalThis.OasisEngine = OasisEngine;
