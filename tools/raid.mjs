import assert from 'node:assert/strict';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { engineSource } from './page-files.mjs';

const html = fileURLToPath(new URL('../index.html', import.meta.url));
const context = vm.createContext({assert});
vm.runInContext(engineSource(html), context, {filename:'engine'});
vm.runInContext(`
  const makeRaid = () => {
    const game = newGame({raid:true, miracles:true, rnd:mulberry32(12)});
    game.firstOverride = 0;
    startShop(game);
    return game;
  };
  const own = (g, i, name, role) => {
    g.players[i].hand[name] = 1;
    g.players[i].raidRoster[name] = role;
  };
  const fightRaid = (g, specs) => {
    for (const [i, spec] of specs.entries()){
      assert.equal(validateDeck(g, i, spec), null);
      setDeck(g, i, spec);
    }
    finishMobilize(g);
    return doBattle(g, true);
  };

  const shop = makeRaid();
  assert.equal(shop.players[0].health, 8);
  assert.equal(shop.miracles, false);
  assert.ok(!shop.bDeck.includes('Cathedral') && !shop.bDeck.includes('Reserve Encampment'));
  const me = shop.players[0];
  me.money = 30;
  shop.disp.u = [{name:'Fencer', at:0}, {name:'Fencer', at:1}];
  assert.equal(buy(shop, 0, 'du', 0), false, 'a new unit requires a deck');
  assert.equal(me.money, 30);
  assert.equal(buy(shop, 0, 'du', 0, null, null, 'defense'), true);
  assert.equal(pass(shop, 1), true);
  const copy = shop.disp.u.findIndex(c => c.name === 'Fencer');
  assert.equal(buy(shop, 0, 'du', copy, null, null, 'attack'), true);
  assert.equal(me.hand.Fencer, 2);
  assert.equal(me.raidRoster.Fencer, 'defense', 'duplicate upgrades in place');
  assert.equal(raidTransfer(shop, 0, 'Fencer', 'attack'), true);
  assert.equal(raidTransfer(shop, 0, 'Fencer', 'defense'), false);
  assert.equal(raidBuySiege(shop, 0), true);
  assert.equal(raidBuySiege(shop, 0), false, 'the upgrade requires another Shop');
  startShop(shop);
  assert.equal(raidAttacker(shop), 1);
  assert.equal(me.raidTransfer, false);
  assert.equal(pass(shop, 1), true);
  assert.equal(raidBuySiege(shop, 0), true);
  assert.equal(me.raidSiege, 2);

  const limits = makeRaid();
  const units = Object.keys(DEFS).filter(n => !exemptUnit(n) && DEFS[n].n > 0);
  units.slice(0, 7).forEach((n, i) => own(limits, 0, n, i < 5 ? 'attack' : 'defense'));
  assert.equal(raidDeckSize(limits.players[0], 'attack'), 5);
  assert.equal(raidChoices(limits.players[0], units[7]).length, 0);
  assert.match(raidTransferReason(limits, 0, units[5], 'attack'), /full/);
  assert.equal(raidTransfer(limits, 0, units[0], 'defense'), true);

  const g = makeRaid();
  own(g, 0, 'Fencer', 'attack');
  own(g, 0, 'Marksman', 'defense');
  own(g, 1, 'Brawler', 'attack');
  g.players[0].gear['Battle Axe'] = 1;
  g.players[0].city.Smithy = 1;
  g.players[0].hand.Recruit = 1;
  g.players[0].health = g.players[1].health = 1;
  endShop(g);
  assert.match(validateDeck(g, 0, [{name:'Marksman'}]), /assigned/);
  assert.match(validateDeck(g, 0, []), /Include every/);
  const opening = fightRaid(g, [[{name:'Fencer', gear:'Battle Axe', arm:1}, {name:'Recruit'}], []]);
  assert.equal(opening.raid.damage, 2);
  assert.equal(g.players[1].health, 1, 'even a lethal hit waits for the counterattack');
  assert.equal(g.over, false);
  assert.equal(raidNextFight(g), true);
  assert.equal(raidAttacker(g), 1);
  assert.match(validateDeck(g, 0, [{name:'Marksman', gear:'Battle Axe'}]), /another/);
  assert.match(validateDeck(g, 0, [{name:'Marksman', arm:1}]), /Too many Armaments/);
  assert.match(validateDeck(g, 0, [{name:'Marksman'}, {name:'Recruit'}]), /Too many Recruits/);
  // Clear the defense to isolate simultaneous lethal scoring.
  delete g.players[0].hand.Marksman;
  const counter = fightRaid(g, [[], [{name:'Brawler'}]]);
  assert.equal(counter.raid.damage, 1);
  assert.equal(g.players[0].health, 0);
  assert.equal(g.players[1].health, 0);
  assert.equal(g.winner, -1);
  assert.equal(g.phase, 'over');

  const defense = makeRaid();
  own(defense, 0, 'Fencer', 'attack');
  own(defense, 1, 'Fencer', 'defense');
  defense.players[1].hand.Fencer = uMax('Fencer');
  endShop(defense);
  const held = fightRaid(defense, [[{name:'Fencer'}], [{name:'Fencer'}]]);
  assert.equal(held.result.w, 1);
  assert.equal(held.raid.damage, 0, 'defenders cannot damage a Caravan');
  assert.equal(raidNextFight(defense), true);
  const tie = fightRaid(defense, [[], []]);
  assert.equal(tie.result.w, -1);
  assert.equal(tie.raid.damage, 0);
  assert.equal(defense.players[0].health, 8);
  assert.equal(defense.players[1].health, 8);

  for (const seed of [2, 7, 19, 41, 71, 99]){
    const game = newGame({raid:true, rnd:mulberry32(seed), genomes:[baseGenome(), baseGenome()]});
    game.players[0].raidDifficulty = seed % RAID_AI_SEARCH.length;
    game.players[1].raidDifficulty = (seed + 1) % RAID_AI_SEARCH.length;
    let bought = 0;
    while (!game.over){
      startShop(game);
      for (let turns = 0; game.phase === 'shop'; turns++){
        assert.ok(turns < 20, 'Raid shop must end');
        const i = cur(game), player = game.players[i], before = player.bought.length;
        assert.equal(raidAiShop(game, i), true);
        bought += player.bought.length - before;
        assert.ok(uniqueUnits(player) <= RAID.roster);
        assert.ok(RAID_ROLES.every(role => raidDeckSize(player, role) <= RAID.deck));
      }
      for (let bout = 0; bout < 2; bout++){
        const specs = [0, 1].map(i => raidAiMobilize(game, i));
        fightRaid(game, specs);
        if (bout === 0) assert.equal(raidNextFight(game), true);
      }
    }
    assert.ok(bought > 0, 'Raid AI should buy cards');
    assert.ok(game.round <= RULES.maxRounds);
  }
`, context, {filename:'raid scenarios'});

console.log('PASS: Raid commitments, caps, transfers, siege, shared resources, simultaneous damage, and seeded AI matches');
