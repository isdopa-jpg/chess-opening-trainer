import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1/+esm';

// ---------------------------------------------------------------------------
// Build the repertoire tree from the variations in lines.js (global OPENINGS).
// ---------------------------------------------------------------------------
const norm = (san) => san.replace(/[+#!?]/g, '');

function insertVariation(root, variation) {
  let node = root;
  for (const san of variation) {
    let child = node.children.find((c) => norm(c.san) === norm(san));
    if (!child) { child = { san, children: [] }; node.children.push(child); }
    node = child;
  }
}

function mergeChildren(target, source) {
  for (const s of source) {
    let t = target.find((c) => norm(c.san) === norm(s.san));
    if (!t) { t = { san: s.san, children: [] }; target.push(t); }
    mergeChildren(t.children, s.children);
  }
}

// --- PGN (with nested variations) -> tree -----------------------------------
let pgnParseErrors = [];

function tokenizePgn(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '{') { const e = text.indexOf('}', i); i = e === -1 ? text.length : e + 1; continue; }
    if (ch === ';') { const e = text.indexOf('\n', i); i = e === -1 ? text.length : e + 1; continue; }
    if (ch === '(' || ch === ')') { tokens.push(ch); i++; continue; }
    if (/\s/.test(ch)) { i++; continue; }
    let j = i;
    while (j < text.length && !/[\s(){};]/.test(text[j])) j++;
    tokens.push(text.slice(i, j));
    i = j;
  }
  return tokens;
}

const PGN_SKIP = /^(\*|1-0|0-1|1\/2-1\/2|\d+\.+|\$\d+)$/;

// A variation "( … )" is an alternative to the move that just preceded it, so
// it branches from the position *before* that move. We track each node's
// fen-before-move and rewind to it when entering a variation.
function pgnToTree(pgn, name) {
  const text = pgn.replace(/^\s*\[[^\]]*\]\s*$/gm, ' '); // drop header tag lines
  const tokens = tokenizePgn(text);
  const root = { san: null, children: [], parent: null, fenBefore: null };
  let game = new Chess();
  let node = root, prev = null;
  const stack = [];
  for (const tk of tokens) {
    if (tk === '(') {
      stack.push({ game, node, prev });
      if (prev) { game = new Chess(prev.fenBefore); node = prev.parent; prev = null; }
      continue;
    }
    if (tk === ')') {
      const f = stack.pop();
      if (f) { game = f.game; node = f.node; prev = f.prev; }
      continue;
    }
    if (PGN_SKIP.test(tk)) continue;
    const want = tk.replace(/^\d+\.+/, '');
    const legal = game.moves({ verbose: true }).find((m) => norm(m.san) === norm(want));
    if (!legal) { pgnParseErrors.push({ opening: name, token: tk, fen: game.fen() }); continue; }
    const fenBefore = game.fen();
    game.move({ from: legal.from, to: legal.to, promotion: legal.promotion || 'q' });
    let child = node.children.find((c) => norm(c.san) === norm(legal.san));
    if (!child) { child = { san: legal.san, children: [], parent: node, fenBefore }; node.children.push(child); }
    prev = child;
    node = child;
  }
  return root;
}

// Build the merged play-tree AND the list of complete lines, each tagged with
// the side you play: 'white' = you move first (default); 'black' = the bot makes
// White's moves and the board is flipped to Black's perspective.
function buildAll(openings) {
  pgnParseErrors = [];
  const root = { san: null, children: [] };
  const lines = [];
  for (const op of openings) {
    const side = op.side === 'black' ? 'black' : 'white';
    let opRoot;
    if (op.pgn) {
      opRoot = pgnToTree(op.pgn, op.name);
    } else {
      opRoot = { san: null, children: [] };
      for (const variation of (op.variations || [])) insertVariation(opRoot, variation);
    }
    mergeChildren(root.children, opRoot.children);
    for (const moves of enumerateLines(opRoot)) lines.push({ moves, side, opening: op.name });
  }
  return { root, lines };
}

const _built = buildAll(OPENINGS);
const TREE = _built.root;

// ---------------------------------------------------------------------------
// Balanced line selection (shuffle bag): every complete line is played once
// per cycle before any repeats, order within a cycle is shuffled, and the same
// line never lands twice in a row across cycle boundaries.
// ---------------------------------------------------------------------------
function enumerateLines(root) {
  const lines = [];
  (function dfs(n, path) {
    if (n.children.length === 0) { if (path.length) lines.push(path); return; }
    for (const c of n.children) dfs(c, path.concat(c.san));
  })(root, []);
  return lines;
}

const ALL_LINES = _built.lines;   // [{ moves, side, opening }]

// Per-opening metadata (in study order), plus the current practice filter.
const OPENING_META = (() => {
  const map = new Map();
  for (const l of ALL_LINES) {
    if (!map.has(l.opening)) map.set(l.opening, { name: l.opening, side: l.side, count: 0 });
    map.get(l.opening).count++;
  }
  return [...map.values()];
})();

const FILTER_KEY = 'trainer.filter.v1';
let filter = (() => {           // null = practice all openings
  try {
    const f = localStorage.getItem(FILTER_KEY);
    return f && OPENING_META.some((o) => o.name === f) ? f : null;
  } catch (e) { return null; }
})();
function activeLines() {
  return filter ? ALL_LINES.filter((l) => l.opening === filter) : ALL_LINES;
}

// Accuracy stats: first meaningful attempt at each decision counts once, per
// opening (persisted) and for this session.
const STATS_KEY = 'trainer.stats.v1';
let stats = (() => {
  try { const s = JSON.parse(localStorage.getItem(STATS_KEY)); return s && s.byOpening ? s : { byOpening: {} }; }
  catch (e) { return { byOpening: {} }; }
})();
let session = { correct: 0, wrong: 0 };
function saveStats() { try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch (e) {} }
let bag = [];
let lastKey = null;
let targetLine = null;

// Lines you get wrong are served more often (up to ~3x as often as the rest).
// Counts persist across sessions so the trainer keeps drilling your weak spots.
const MISS_KEY = 'trainer.missCounts.v1';
let missCounts = (() => {
  try { return JSON.parse(localStorage.getItem(MISS_KEY)) || {}; } catch (e) { return {}; }
})();
function saveMissCounts() {
  try { localStorage.setItem(MISS_KEY, JSON.stringify(missCounts)); } catch (e) {}
}
function lineWeight(line) {
  return Math.min(3, 1 + (missCounts[line.moves.join(' ')] || 0)); // 1x normally → up to 3x
}
function recordMiss() {
  if (!targetLine) return;
  const k = targetLine.join(' ');
  missCounts[k] = Math.min(20, (missCounts[k] || 0) + 1);
  saveMissCounts();
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a shuffle bag where each line appears `weight` times (1–3). Still
// shuffled, still no same-line back-to-back (within the bag and across cycles).
function buildBag() {
  const weighted = [];
  for (const line of activeLines()) {
    const w = lineWeight(line);
    for (let i = 0; i < w; i++) weighted.push(line);
  }
  shuffle(weighted);
  for (let i = 1; i < weighted.length; i++) {
    if (weighted[i].moves.join(' ') === weighted[i - 1].moves.join(' ')) {
      const prevKey = weighted[i - 1].moves.join(' ');
      const j = weighted.findIndex((l, idx) => idx > i && l.moves.join(' ') !== prevKey);
      if (j > -1) { const t = weighted[i]; weighted[i] = weighted[j]; weighted[j] = t; }
    }
  }
  return weighted;
}

function nextTargetLine() {
  if (!activeLines().length) return null;
  if (bag.length === 0) {
    bag = buildBag();
    if (bag.length > 1 && bag[0].moves.join(' ') === lastKey) bag.push(bag.shift());
  }
  const line = bag.shift();
  lastKey = line.moves.join(' ');
  return line;
}

// ---------------------------------------------------------------------------
// DOM + state
// ---------------------------------------------------------------------------
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const movesEl = document.getElementById('moves');
const newBtn = document.getElementById('newBtn');
const hintBtn = document.getElementById('hintBtn');
const backBtn = document.getElementById('backBtn');
const titleEl = document.getElementById('title');
const pickerEl = document.getElementById('picker');
const tickerEl = document.getElementById('ticker');
const optsToggleEl = document.getElementById('optsToggle');

const SVGNS = 'http://www.w3.org/2000/svg';
const arrowsSvg = document.createElementNS(SVGNS, 'svg');
arrowsSvg.setAttribute('id', 'arrows');
arrowsSvg.setAttribute('viewBox', '0 0 8 8');
arrowsSvg.setAttribute('preserveAspectRatio', 'none');

const OPTS_KEY = 'trainer.showOptions.v1';
let showOptions = (() => { try { return localStorage.getItem(OPTS_KEY) !== 'off'; } catch (e) { return true; } })();

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let game = new Chess();
let node = TREE;        // current position in the repertoire tree
let selected = null;    // currently selected square
let locked = true;      // input blocked (bot thinking / line over)
let sanList = [];       // SAN moves played, for the move panel
let botTimer = null;    // pending bot-reply timeout
let userColor = 'w';    // 'w' = you play White (default), 'b' = you play Black
let flipped = false;    // board orientation (true = Black at bottom)
let targetOpening = null; // opening name of the current line (title + stats)
let decisionScored = false; // has the current move-decision been counted yet?
const squares = {};     // square name -> div

// ---------------------------------------------------------------------------
// One-time board construction
// ---------------------------------------------------------------------------
function buildBoard() {
  boardEl.innerHTML = '';
  for (const k in squares) delete squares[k];
  for (let row = 0; row < 8; row++) {      // row 0 = top of the board
    for (let col = 0; col < 8; col++) {    // col 0 = left
      const rank = flipped ? row + 1 : 8 - row;
      const fileIdx = flipped ? 7 - col : col;
      const file = FILES[fileIdx];
      const sq = file + rank;
      const div = document.createElement('div');
      const light = (fileIdx + rank) % 2 === 0;   // a1 (0+1) = dark
      div.className = 'sq ' + (light ? 'light' : 'dark');
      div.dataset.square = sq;
      if (col === 7) {                   // rank numbers on the right edge
        const s = document.createElement('span');
        s.className = 'coord rank ' + (light ? 'on-light' : 'on-dark');
        s.textContent = rank;
        div.appendChild(s);
      }
      if (row === 7) {                   // file letters on the bottom edge
        const s = document.createElement('span');
        s.className = 'coord file ' + (light ? 'on-light' : 'on-dark');
        s.textContent = file;
        div.appendChild(s);
      }
      boardEl.appendChild(div);
      squares[sq] = div;
    }
  }
  clearArrows();
  boardEl.appendChild(arrowsSvg);   // overlay on top of the squares
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
function pieceSrc(p) {
  return `pieces/${p.color}${p.type.toUpperCase()}.svg`;
}

function render(lastMove) {
  clearArrows();
  for (const sq in squares) {
    const div = squares[sq];
    div.classList.remove('sel', 'lastmove', 'dest', 'occupied', 'bad');
    const img = div.querySelector('img.piece');
    if (img) img.remove();
    const p = game.get(sq);
    if (p) {
      const el = document.createElement('img');
      el.className = 'piece';
      el.src = pieceSrc(p);
      el.draggable = false;
      div.appendChild(el);
    }
  }
  if (lastMove) {
    squares[lastMove.from]?.classList.add('lastmove');
    squares[lastMove.to]?.classList.add('lastmove');
  }
  renderMoves();
  if (backBtn) backBtn.disabled = sanList.length === 0;
}

function renderMoves() {
  let html = '';
  for (let i = 0; i < sanList.length; i++) {
    if (i % 2 === 0) html += `<span class="mv"><span class="num">${i / 2 + 1}.</span>${sanList[i]}</span>`;
    else html += `<span class="mv">${sanList[i]}</span>`;
  }
  movesEl.innerHTML = html;
}

function showDests(from) {
  for (const m of game.moves({ square: from, verbose: true })) {
    const d = squares[m.to];
    if (!d) continue;
    d.classList.add('dest');
    if (game.get(m.to)) d.classList.add('occupied');
  }
}

function clearSelection() {
  selected = null;
  for (const sq in squares) squares[sq].classList.remove('sel', 'dest', 'occupied');
}

// --- option arrows (opponent's alternatives at a branch) -------------------
function clearArrows() {
  if (!arrowsSvg) return;
  while (arrowsSvg.firstChild) arrowsSvg.removeChild(arrowsSvg.firstChild);
}
function cellCenter(sq) {
  const fileIdx = FILES.indexOf(sq[0]);
  const rank = parseInt(sq.slice(1), 10);
  const col = flipped ? 7 - fileIdx : fileIdx;
  const row = flipped ? rank - 1 : 8 - rank;
  return { x: col + 0.5, y: row + 0.5 };
}
function drawArrow(from, to) {
  const a = cellCenter(from), b = cellCenter(to);
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const shaftW = 0.11, headW = 0.24, headLen = 0.32;
  const sx = a.x + ux * 0.26, sy = a.y + uy * 0.26;   // start just outside source centre
  const tx = b.x - ux * 0.16, ty = b.y - uy * 0.16;   // tip just inside target centre
  const bx = tx - ux * headLen, by = ty - uy * headLen;
  const pts = [
    [sx + nx * shaftW, sy + ny * shaftW],
    [bx + nx * shaftW, by + ny * shaftW],
    [bx + nx * headW, by + ny * headW],
    [tx, ty],
    [bx - nx * headW, by - ny * headW],
    [bx - nx * shaftW, by - ny * shaftW],
    [sx - nx * shaftW, sy - ny * shaftW],
  ];
  const poly = document.createElementNS(SVGNS, 'polygon');
  poly.setAttribute('points', pts.map((p) => p[0].toFixed(3) + ',' + p[1].toFixed(3)).join(' '));
  poly.setAttribute('class', 'arrow');
  arrowsSvg.appendChild(poly);
}
function drawOptionArrows(sans) {
  const verbose = game.moves({ verbose: true });
  for (const san of sans) {
    const mv = verbose.find((m) => norm(m.san) === norm(san));
    if (mv) drawArrow(mv.from, mv.to);
  }
}

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = 'status' + (cls ? ' ' + cls : '');
}

function youPlay() { return userColor === 'w' ? 'White' : 'Black'; }
function yourMove() { setStatus('Your move — play ' + youPlay() + '.'); }

// --- accuracy ticker -------------------------------------------------------
function pct(s) { const t = s.correct + s.wrong; return t ? Math.round((100 * s.correct) / t) : null; }
function overallStats() {
  const t = { correct: 0, wrong: 0 };
  for (const k in stats.byOpening) { t.correct += stats.byOpening[k].correct; t.wrong += stats.byOpening[k].wrong; }
  return t;
}
function scoreDecision(correct) {
  if (decisionScored) return;           // only the first meaningful attempt counts
  decisionScored = true;
  session[correct ? 'correct' : 'wrong']++;
  if (targetOpening) {
    const o = stats.byOpening[targetOpening] || (stats.byOpening[targetOpening] = { correct: 0, wrong: 0 });
    o[correct ? 'correct' : 'wrong']++;
  }
  saveStats();
  renderTicker();
}
function renderTicker() {
  if (!tickerEl) return;
  const scoped = filter ? (stats.byOpening[filter] || { correct: 0, wrong: 0 }) : overallStats();
  const label = filter ? shortName(filter) : 'Overall';
  const a = pct(scoped), sa = pct(session);
  const tot = scoped.correct + scoped.wrong;
  tickerEl.innerHTML =
    `<span class="tk-scope">${label}: <strong>${a == null ? '—' : a + '%'}</strong> <span class="tk-sub">${scoped.correct}/${tot}</span></span>` +
    `<span class="tk-sub">session ${sa == null ? '—' : sa + '%'}</span>`;
}

// ---------------------------------------------------------------------------
// Trainer logic
// ---------------------------------------------------------------------------
function legalMove(from, to) {
  return game.moves({ square: from, verbose: true })
    .find((m) => m.to === to) || null;
}

// Options for the side to move, restricted to the active practice filter:
// the next move of every active line whose prefix matches what's been played.
function currentOptions() {
  const depth = sanList.length;
  const seen = new Map();
  for (const line of activeLines()) {
    const mv = line.moves;
    if (mv.length <= depth) continue;
    let ok = true;
    for (let i = 0; i < depth; i++) { if (norm(mv[i]) !== norm(sanList[i])) { ok = false; break; } }
    if (ok) { const s = mv[depth]; const k = norm(s); if (!seen.has(k)) seen.set(k, s); }
  }
  return [...seen.values()];
}
function matchChild(san) {
  return currentOptions().some((o) => norm(o) === norm(san));
}
function advance(san) {   // keep the merged-tree pointer in sync
  node = node.children.find((c) => norm(c.san) === norm(san)) || node;
}

function attemptUserMove(from, to) {
  if (locked) return;
  const m = legalMove(from, to);
  if (!m) { fail(); return; }                 // illegal input — not scored (mis-drag)
  if (!matchChild(m.san)) { scoreDecision(false); recordMiss(); fail(to); return; } // off repertoire
  // good move
  scoreDecision(true);
  game.move({ from: m.from, to: m.to, promotion: m.promotion || 'q' });
  sanList.push(m.san);
  advance(m.san);
  clearSelection();
  render({ from: m.from, to: m.to });
  if (currentOptions().length === 0) { lineComplete(); return; }
  // now it's the opponent's turn
  locked = true;
  setStatus('…');
  botTimer = setTimeout(botMove, 450);
}

function botMove() {
  botTimer = null;
  const optSans = currentOptions();                    // filter-aware
  // follow the pre-selected balanced target line when possible…
  let chosen = null;
  if (targetLine) {
    const wantSan = targetLine[sanList.length];
    if (optSans.some((s) => norm(s) === norm(wantSan))) chosen = wantSan;
  }
  // …otherwise (e.g. user chose a different valid branch) fall back to random
  if (!chosen) chosen = optSans[Math.floor(Math.random() * optSans.length)];
  // at a genuine branch, first show the opponent's alternatives as arrows
  if (showOptions && optSans.length > 1) {
    drawOptionArrows(optSans);
    setStatus("Opponent's options…");
    botTimer = setTimeout(() => playBotChoice(chosen), 1200);
  } else {
    playBotChoice(chosen);
  }
}

function playBotChoice(chosenSan) {
  botTimer = null;
  clearArrows();
  const verbose = game.moves({ verbose: true });
  const m = verbose.find((mv) => norm(mv.san) === norm(chosenSan));
  if (!m) {                                    // should never happen if lines are legal
    setStatus('Line data error: ' + chosenSan, 'fail');
    return;
  }
  game.move({ from: m.from, to: m.to, promotion: m.promotion || 'q' });
  sanList.push(m.san);
  advance(m.san);
  render({ from: m.from, to: m.to });
  if (currentOptions().length === 0) { lineComplete(); return; }
  locked = false;
  decisionScored = false;
  yourMove();
}

function fail(badSquare) {
  setStatus('❌ Failure, try again.', 'fail');
  boardEl.classList.remove('shake');
  void boardEl.offsetWidth;        // restart animation
  boardEl.classList.add('shake');
  if (badSquare && squares[badSquare]) {
    squares[badSquare].classList.add('bad');
    setTimeout(() => squares[badSquare]?.classList.remove('bad'), 500);
  }
  clearSelection();
}

function lineComplete() {
  locked = true;
  clearSelection();
  setStatus('✅ Line complete! Press “New line”.', 'ok');
}

function newLine() {
  if (botTimer) { clearTimeout(botTimer); botTimer = null; }
  const target = nextTargetLine();
  targetLine = target ? target.moves : null;
  targetOpening = target ? target.opening : null;
  userColor = target && target.side === 'black' ? 'b' : 'w';
  if (titleEl) {
    titleEl.innerHTML = (targetOpening || 'Opening Trainer') +
      ' <span class="side">· you play ' + youPlay() + '</span>';
  }
  const wantFlip = userColor === 'b';
  if (wantFlip !== flipped) { flipped = wantFlip; buildBoard(); }
  game = new Chess();
  node = TREE;
  sanList = [];
  selected = null;
  decisionScored = false;
  render(null);
  if (userColor === 'w') {
    locked = false;
    yourMove();
  } else {
    // you play Black: the bot makes White's first move, then it's your turn
    locked = true;
    setStatus('…');
    botTimer = setTimeout(botMove, 500);
  }
}

// Step back to the previous position where it was your (White's) turn, undoing
// your last move and the bot's reply so you can try the move again.
function rebuildTo(len) {
  if (botTimer) { clearTimeout(botTimer); botTimer = null; }
  game = new Chess();
  node = TREE;
  const target = Math.max(0, Math.min(len, sanList.length));
  const kept = [];
  let last = null;
  for (let i = 0; i < target; i++) {
    const san = sanList[i];
    const mv = game.moves({ verbose: true }).find((m) => norm(m.san) === norm(san));
    if (!mv) break;
    game.move({ from: mv.from, to: mv.to, promotion: mv.promotion || 'q' });
    node = node.children.find((c) => norm(c.san) === norm(san)) || node;
    kept.push(san);
    last = { from: mv.from, to: mv.to };
  }
  sanList = kept;
  selected = null;
  locked = false;
  decisionScored = false;
  render(last);
  yourMove();
}

function goBack() {
  if (sanList.length === 0) return;
  const L = sanList.length;
  // your-turn positions have even length if you're White, odd if you're Black
  const wantEven = (userColor === 'w');
  let newLen = L - 1;
  while (newLen >= 0 && ((newLen % 2 === 0) !== wantEven)) newLen--;
  const minLen = wantEven ? 0 : 1;   // Black can't go back past White's first move
  if (newLen < minLen) return;
  rebuildTo(newLen);
}

function hint() {
  if (locked) return;
  if (game.turn() !== userColor) return;
  const moves = currentOptions();
  if (moves.length) setStatus('Hint: ' + moves.join(' or '));
}

// ---------------------------------------------------------------------------
// Opening picker — choose one opening to drill, or "All" for the full mix.
// ---------------------------------------------------------------------------
let pickerOpen = false;

function shortName(name) {
  if (name.startsWith('QGA')) {
    const paren = name.match(/\(([^)]+)\)/);
    return paren ? 'QGA ' + paren[1] : name.replace(/:\s*/, ' ');
  }
  return name.split(':')[0].replace(/\s*\([^)]*\)/, '').replace(/\s*(Defense|Game)\b/, '').trim();
}

function currentLabel() {
  if (!filter) return `All openings (${ALL_LINES.length})`;
  const m = OPENING_META.find((o) => o.name === filter);
  return m ? `${shortName(m.name)} (${m.count})` : filter;
}

function chip(label, title, active, onClick) {
  const b = document.createElement('button');
  b.className = 'chip' + (active ? ' active' : '');
  b.textContent = label;
  if (title) b.title = title;
  b.addEventListener('click', onClick);
  return b;
}

function renderPicker() {
  if (!pickerEl) return;
  pickerEl.innerHTML = '';
  const header = document.createElement('button');
  header.className = 'picker-header';
  header.innerHTML = `<span class="caret">${pickerOpen ? '▾' : '▸'}</span> Practice: <strong>${currentLabel()}</strong>`;
  header.addEventListener('click', () => { pickerOpen = !pickerOpen; renderPicker(); });
  pickerEl.appendChild(header);
  if (!pickerOpen) return;

  const panel = document.createElement('div');
  panel.className = 'picker-panel';
  const allRow = document.createElement('div');
  allRow.className = 'chip-row';
  allRow.appendChild(chip(`All (${ALL_LINES.length})`, 'Practice every opening', !filter, () => selectFilter(null)));
  panel.appendChild(allRow);

  for (const side of ['white', 'black']) {
    const metas = OPENING_META.filter((o) => o.side === side);
    if (!metas.length) continue;
    const lbl = document.createElement('div');
    lbl.className = 'picker-group';
    lbl.textContent = side === 'white' ? 'You play White' : 'You play Black';
    panel.appendChild(lbl);
    const row = document.createElement('div');
    row.className = 'chip-row';
    for (const m of metas) {
      row.appendChild(chip(`${shortName(m.name)} (${m.count})`, m.name, filter === m.name, () => selectFilter(m.name)));
    }
    panel.appendChild(row);
  }
  pickerEl.appendChild(panel);
}

function selectFilter(name) {
  filter = name;                 // null or opening name
  bag = [];
  lastKey = null;
  try { localStorage.setItem(FILTER_KEY, name || ''); } catch (e) {}
  pickerOpen = false;
  renderPicker();
  renderTicker();
  newLine();
}

function renderOptsToggle() {
  if (!optsToggleEl) return;
  optsToggleEl.innerHTML = '';
  const b = document.createElement('button');
  b.className = 'opts-btn' + (showOptions ? ' on' : '');
  b.textContent = (showOptions ? '◉' : '◯') + "  Show opponent's options";
  b.addEventListener('click', () => {
    showOptions = !showOptions;
    try { localStorage.setItem(OPTS_KEY, showOptions ? 'on' : 'off'); } catch (e) {}
    if (!showOptions) clearArrows();
    renderOptsToggle();
  });
  optsToggleEl.appendChild(b);
}

// ---------------------------------------------------------------------------
// Pointer input (tap-to-move + drag), works on touch and mouse
// ---------------------------------------------------------------------------
const ghost = document.getElementById('ghost');
let drag = null;   // { from, started }

function squareFromPoint(x, y) {
  const rect = boardEl.getBoundingClientRect();
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return null;
  const col = Math.floor(((x - rect.left) / rect.width) * 8);
  const row = Math.floor(((y - rect.top) / rect.height) * 8);
  if (col < 0 || col > 7 || row < 0 || row > 7) return null;
  const rank = flipped ? row + 1 : 8 - row;
  const fileIdx = flipped ? 7 - col : col;
  return FILES[fileIdx] + rank;
}

function onDown(e) {
  if (locked) return;
  const sq = squareFromPoint(e.clientX, e.clientY);
  if (!sq) return;
  const piece = game.get(sq);

  // If something is selected and this is a legal destination -> move.
  if (selected && selected !== sq && legalMove(selected, sq)) {
    attemptUserMove(selected, sq);
    return;
  }
  // Selecting one of our own pieces (our color, our turn).
  if (piece && piece.color === userColor && game.turn() === userColor) {
    clearSelection();
    selected = sq;
    squares[sq].classList.add('sel');
    showDests(sq);
    drag = { from: sq, started: false };
    boardEl.setPointerCapture?.(e.pointerId);
    return;
  }
  clearSelection();
}

function onMove(e) {
  if (!drag) return;
  const sq = squareFromPoint(e.clientX, e.clientY);
  if (!drag.started) {
    // lift the piece into the ghost once the pointer actually moves
    const p = game.get(drag.from);
    if (!p) return;
    ghost.src = pieceSrc(p);
    ghost.style.display = 'block';
    const sz = boardEl.getBoundingClientRect().width / 8;
    ghost.style.width = ghost.style.height = sz + 'px';
    const img = squares[drag.from].querySelector('img.piece');
    if (img) img.style.visibility = 'hidden';
    drag.started = true;
  }
  ghost.style.left = e.clientX + 'px';
  ghost.style.top = e.clientY + 'px';
}

function onUp(e) {
  if (!drag) return;
  const from = drag.from;
  const started = drag.started;
  drag = null;
  ghost.style.display = 'none';
  const img = squares[from]?.querySelector('img.piece');
  if (img) img.style.visibility = '';
  if (!started) return;   // it was a tap; keep selection so user can tap a target
  const to = squareFromPoint(e.clientX, e.clientY);
  if (to && to !== from && legalMove(from, to)) {
    attemptUserMove(from, to);
  }
  // dropped on empty/illegal square: keep selection (user can tap)
}

boardEl.addEventListener('pointerdown', onDown);
window.addEventListener('pointermove', onMove);
window.addEventListener('pointerup', onUp);

newBtn.addEventListener('click', newLine);
hintBtn.addEventListener('click', hint);
backBtn.addEventListener('click', goBack);

// ---------------------------------------------------------------------------
// Block accidental zoom on touch devices (pinch + double-tap)
// ---------------------------------------------------------------------------
['gesturestart', 'gesturechange', 'gestureend'].forEach((t) =>
  document.addEventListener(t, (e) => e.preventDefault(), { passive: false }));
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) e.preventDefault();   // pinch
}, { passive: false });

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
buildBoard();
renderPicker();
renderTicker();
renderOptsToggle();
newLine();

// expose a tiny hook for automated testing
window.__trainer = {
  get fen() { return game.fen(); },
  get turn() { return game.turn(); },
  get options() { return currentOptions(); },
  get status() { return statusEl.textContent; },
  get locked() { return locked; },
  get history() { return sanList.slice(); },
  get target() { return targetLine ? targetLine.slice() : null; },
  get lineCount() { return ALL_LINES.length; },
  get sides() { const s = { white: 0, black: 0 }; ALL_LINES.forEach((l) => s[l.side]++); return s; },
  get openings() { return OPENING_META.map((o) => ({ ...o })); },
  get filter() { return filter; },
  setFilter: selectFilter,
  get stats() { return JSON.parse(JSON.stringify({ byOpening: stats.byOpening, session })); },
  get openingName() { return targetOpening; },
  get showOptions() { return showOptions; },
  get arrowCount() { return arrowsSvg.querySelectorAll('polygon').length; },
  resetStats() { stats = { byOpening: {} }; session = { correct: 0, wrong: 0 }; saveStats(); renderTicker(); },
  get userColor() { return userColor; },
  get flipped() { return flipped; },
  get pgnErrors() { return pgnParseErrors.slice(); },
  get missCounts() { return { ...missCounts }; },
  userMove(from, to) { attemptUserMove(from, to); },
  newLine,
  back: goBack,
};
