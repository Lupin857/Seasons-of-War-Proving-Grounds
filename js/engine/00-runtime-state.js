/* Engine-owned mutable runtime values. Legacy global accessors below keep existing UI and worker callers working. */
const ENGINE_STATE = (() => {
  const state = {
    balanceKey: '',
    miraclesOn: false,
    battleMiraclesOn: true,
    refillOn: true,
    shopWatch: null,
    battleVM: null,
    searchEvalCache: new Map(),
    searchGenomeKeys: new WeakMap(),
  };
  const legacyBindings = {
    OV_KEY: 'balanceKey',
    MIRACLES_ON: 'miraclesOn',
    BATTLE_MIR_ON: 'battleMiraclesOn',
    REFILL_ON: 'refillOn',
    SHOP_WATCH: 'shopWatch',
  };
  for (const [name, key] of Object.entries(legacyBindings)){
    Object.defineProperty(globalThis, name, {
      configurable:false,
      get(){ return state[key]; },
      set(value){ state[key] = value; },
    });
  }
  return state;
})();
