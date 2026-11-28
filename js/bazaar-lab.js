const frame = document.getElementById('preview-frame');
const stage = frame.parentElement;
const timings = document.getElementById('timings');
const status = document.getElementById('play-status');
const reset = document.getElementById('reset');
const copy = document.getElementById('copy-settings');
const output = document.getElementById('settings-output');
const copyStatus = document.getElementById('copy-status');
const playback = [...document.querySelectorAll('[data-play]')];
const dragButton = document.querySelector('[data-play="drag"]');
const dragGuide = document.getElementById('drag-guide');
const pileLayoutKeys = new Set(['pileCardSize', 'pileCardSpacing', 'pileFanAngle']);

const timingGroups = [
  ['Setting up the Shop', true, {
    rugOpen: ['Rug unroll time', 2400],
    deckEnterDelay: ['Wait before decks enter', 1400],
    deckEnter: ['Time for decks to slide in', 1400],
    discardEnterDelay: ['Wait before discard pile enters', 1400],
    discardEnter: ['Time for discard pile to slide in', 1400],
  }],
  ['Dealing cards', true, {
    dealStart: ['Earliest time to start dealing', 2400],
    dealGap: ['Time between card launches', 500],
    dealSpread: ['Time budget for spacing card launches', 2000],
    dealSlide: ['Time for a card to slide into its slot', 1100, 50],
    dealTravel: ['Total time for a fresh card to slide and flip', 1800, 100],
    dealBackTravel: ['Time for a Miracle card to reach its slot', 1800, 100],
    dealFlipStart: ['When the flip starts during a card’s move', 1600],
    dealFlipDuration: ['Time for the card to turn face-up', 1400],
  }],
  ['Packing up the Shop', false, {
    sweepTravel: ['Time for an unsold card to reach its pile', 1400],
    sweepGap: ['Time between unsold cards leaving', 450],
    sweepSpread: ['Limit on time to send all unsold cards', 1300],
    leftExitDelay: ['Wait before decks slide out', 1200],
    discardExitDelay: ['Wait before discard pile slides out', 1200],
    exitTravel: ['Time for decks and discard to slide out', 1400],
    rugCloseDelay: ['Wait from Shop close to rug roll-up', 2400],
    rugClose: ['Rug roll-up time', 2400],
  }],
  ['Picking up a card', false, {
    dragPickup: ['Time for the card to lift', 360],
    dragGrow: ['Dragged card size increase', 25, 0, 'percent'],
    dragLean: ['How far the card can lean', 16, 0, 'degrees'],
    dragSettle: ['Time for the swing to settle', 500, 40],
  }],
  ['Card shadows', false, {
    shadowRestOpacity: ['Resting shadow strength', 100, 0, 'percent'],
    shadowRestBlur: ['Resting shadow softness', 24, 0, 'pixels'],
    shadowRestOffset: ['Resting shadow distance', 24, 0, 'pixels'],
    shadowLiftOpacity: ['Lifted shadow strength', 100, 0, 'percent'],
    shadowLiftBlur: ['Lifted shadow softness', 32, 0, 'pixels'],
    shadowLiftOffset: ['Lifted shadow distance', 36, 0, 'pixels'],
  }],
  ['Enlarging a card', false, {
    inspectOpen: ['Time for the card to glide to center', 1400, 80],
    inspectClose: ['Time for the card to return to its slot', 1400, 80],
    inspectWidth: ['Width of the enlarged card', 460, 160, 'pixels'],
    inspectDim: ['Background fade for card inspection and Mobilize', 1400],
    inspectPanelDelay: ['Wait before card details appear', 1400],
    inspectPanelFade: ['Time for card details to fade in', 1400],
  }],
  ['Inspecting a pile', false, {
    pileOpen: ['Time for each card to fan out', 1400],
    pileClose: ['Time for the pile to fold back in', 1400],
    pileGap: ['Delay between cards as the pile opens or closes', 250],
    pileCardSize: ['Card size in pile view', 135, 65, 'percent'],
    pileCardSpacing: ['Horizontal spacing as a share of card width', 100, 25, 'percent'],
    pileFanAngle: ['Turn between neighboring cards', 12, 0, 'degrees'],
    pileShift: ['Time for neighboring cards to slide aside', 500],
    pileRoomOpen: ['Time to make room during reordering or inspection', 400],
    pileRoomClose: ['Time to close the gap after reordering or inspection', 400],
  }],
];

let bridge;
let settings;
let playing = false;
const inputs = new Map();

const resizeStage = () => stage.style.setProperty('--preview-scale', stage.clientWidth / 1440);
new ResizeObserver(resizeStage).observe(stage);
resizeStage();

function updateOutput(){
  output.value = JSON.stringify(settings, null, 2);
  copyStatus.textContent = 'Pile layout updates live. Replay to preview timing changes. Times are in milliseconds.';
}

function limitTiming(key, min, max){
  if (!inputs.has(key)) return;
  settings[key] = Math.max(min, Math.min(max, settings[key]));
  for (const input of inputs.get(key)){
    input.min = min;
    input.max = max;
    input.value = settings[key];
  }
}

function updateFlipLimits(){
  const travel = settings.dealTravel;
  if (!Number.isFinite(travel)) return;
  limitTiming('dealFlipStart', Math.ceil(travel * .2), Math.floor(travel * .8));
  limitTiming('dealFlipDuration', Math.ceil(travel * .03), Math.floor(travel * .97 - settings.dealFlipStart));
  limitTiming('dealSlide', Math.ceil(travel * .12), Math.floor(settings.dealFlipStart - travel * .055));
}

function timingControl(key, [name, max, min = 0, unit = 'milliseconds']){
  const row = document.createElement('div');
  row.className = 'timing';
  const label = document.createElement('label');
  const slider = document.createElement('input');
  const number = document.createElement('input');
  slider.id = 'timing-' + key;
  label.htmlFor = slider.id;
  label.textContent = name;
  number.setAttribute('aria-label', name + ' in ' + unit);
  slider.type = 'range';
  number.type = 'number';
  for (const input of [slider, number]){
    input.min = Math.min(min, settings[key]);
    input.max = Math.max(max, settings[key]);
    input.step = '1';
    input.value = settings[key];
    input.addEventListener('input', () => {
      if (!Number.isFinite(input.valueAsNumber) || !input.validity.valid) return;
      settings[key] = input.valueAsNumber;
      (input === slider ? number : slider).value = settings[key];
      if (key === 'dealTravel' || key === 'dealFlipStart') updateFlipLimits();
      if (pileLayoutKeys.has(key)) bridge.setPileLayout(settings);
      updateOutput();
    });
  }
  number.addEventListener('change', () => { number.value = settings[key]; });
  inputs.set(key, [slider, number]);
  row.append(label, slider, number);
  return row;
}

function buildTimingControls(){
  for (const [name, expanded, specs] of timingGroups){
    const group = document.createElement('details');
    const title = document.createElement('summary');
    const rows = document.createElement('div');
    title.textContent = name;
    group.open = expanded;
    if ('dragPickup' in specs) group.id = 'drag-timings';
    if ('inspectOpen' in specs) group.id = 'inspect-timings';
    if ('pileOpen' in specs) group.id = 'pile-timings';
    for (const [key, spec] of Object.entries(specs)){
      if (Number.isFinite(settings[key])) rows.append(timingControl(key, spec));
    }
    if (rows.childElementCount){
      group.append(title, rows);
      timings.append(group);
    }
  }
}

async function replay(mode, firstPlay = false){
  if (!bridge || playing) return;
  playing = true;
  playback.forEach(button => { button.disabled = true; });
  stage.classList.remove('is-interactive');
  frame.tabIndex = -1;
  dragGuide.hidden = true;
  status.textContent = firstPlay && mode === 'open' ? 'Loading Shop artwork…'
    : {open:'Opening Shop…', close:'Closing Shop…', both:'Playing full cycle…',
      drag:'Setting up drag preview…', inspect:'Setting up enlarge preview…', mobilize:'Opening Mobilize…',
      'battle-end':'Preparing Battle result…', charge:'Preparing Deck → Charge…'}[mode];
  try {
    await bridge.play(mode, {...settings});
    const drag = mode === 'drag';
    const interactive = drag || mode === 'inspect' || mode === 'mobilize' || mode === 'battle-end' || mode === 'charge';
    status.textContent = {drag:'Drag a card to try it', inspect:'Click a card to enlarge it',
      open:'Shop is open', close:'Shop is closed', both:'Shop is closed',
      mobilize:'',
      'battle-end':'Choose Go to round 2 shop to preview the return.',
      charge:'Press Next step twice quickly to try the queue. Choose Try Deck → Charge to reset.'}[mode];
    stage.classList.toggle('is-interactive', interactive);
    frame.tabIndex = interactive ? 0 : -1;
    dragGuide.hidden = !drag;
    dragButton.textContent = drag ? 'Reset drag preview' : 'Try card drag';
    if (drag) document.getElementById('drag-timings').open = true;
    if (mode === 'inspect') document.getElementById('inspect-timings').open = true;
    if (mode === 'inspect' || mode === 'mobilize') document.getElementById('pile-timings').open = true;
  } catch (error) {
    console.error('Oasis Shop preview', error);
    status.textContent = 'Couldn’t play the preview. Try replaying.';
  } finally {
    playback.forEach(button => { button.disabled = false; });
    playing = false;
  }
}

playback.forEach(button => button.addEventListener('click', () => replay(button.dataset.play)));
reset.addEventListener('click', () => {
  settings = {...bridge.defaults};
  updateFlipLimits();
  for (const [key, elements] of inputs){
    for (const input of elements) input.value = settings[key];
  }
  bridge.setPileLayout(settings);
  updateOutput();
});
copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    copyStatus.textContent = 'Copied. Paste these settings into chat.';
  } catch {
    output.focus();
    output.select();
    copyStatus.textContent = 'Settings selected. Copy them with your keyboard.';
  }
});

async function previewBridge(){
  const stopAt = performance.now() + 15000;
  while (performance.now() < stopAt){
    const candidate = frame.contentWindow?.OasisBazaarLab;
    if (candidate?.defaults && typeof candidate.play === 'function') return candidate;
    await new Promise(resolve => setTimeout(resolve, 80));
  }
  return null;
}

previewBridge().then(candidate => {
  if (!candidate){
    status.textContent = 'Preview didn’t load. Reload this page to try again.';
    return;
  }
  bridge = candidate;
  settings = {...bridge.defaults};
  buildTimingControls();
  updateFlipLimits();
  updateOutput();
  reset.disabled = false;
  copy.disabled = false;
  const mode = new URLSearchParams(location.search).get('preview') === 'charge' ? 'charge' : 'open';
  replay(mode, true);
}).catch(error => {
  console.error('Oasis Shop lab', error);
  status.textContent = 'Preview didn’t load. Reload this page to try again.';
});
