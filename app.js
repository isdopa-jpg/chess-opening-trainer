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

function buildTree(openings) {
  pgnParseErrors = [];
  const root = { san: null, children: [] };
  for (const op of openings) {
    if (op.pgn) {
      mergeChildren(root.children, pgnToTree(op.pgn, op.name).children);
    } else if (op.variations) {
      for (const variation of op.variations) insertVariation(root, variation);
    }
  }
  return root;
}

const TREE = buildTree(OPENINGS);

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

const ALL_LINES = enumerateLines(TREE);   // each is a full SAN sequence
let bag = [];
let lastKey = null;
let targetLine = null;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function nextTargetLine() {
  if (!ALL_LINES.length) return null;
  if (bag.length === 0) {
    bag = shuffle(ALL_LINES.slice());
    if (ALL_LINES.length > 1 && bag[0].join(' ') === lastKey) bag.push(bag.shift());
  }
  const line = bag.shift();
  lastKey = line.join(' ');
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

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let game = new Chess();
let node = TREE;        // current position in the repertoire tree
let selected = null;    // currently selected square
let locked = true;      // input blocked (bot thinking / line over)
let sanList = [];       // SAN moves played, for the move panel
const squares = {};     // square name -> div

// ---------------------------------------------------------------------------
// One-time board construction
// ---------------------------------------------------------------------------
function buildBoard() {
  boardEl.innerHTML = '';
  for (let r = 0; r < 8; r++) {        // r=0 -> rank 8 (top)
    for (let c = 0; c < 8; c++) {      // c=0 -> file a (left)
      const sq = FILES[c] + (8 - r);
      const div = document.createElement('div');
      const light = (r + c) % 2 === 0;
      div.className = 'sq ' + (light ? 'light' : 'dark');
      div.dataset.square = sq;
      if (c === 7) {                   // rank numbers on the right edge
        const s = document.createElement('span');
        s.className = 'coord rank ' + (light ? 'on-light' : 'on-dark');
        s.textContent = 8 - r;
        div.appendChild(s);
      }
      if (r === 7) {                   // file letters on the bottom edge
        const s = document.createElement('span');
        s.className = 'coord file ' + (light ? 'on-light' : 'on-dark');
        s.textContent = FILES[c];
        div.appendChild(s);
      }
      boardEl.appendChild(div);
      squares[sq] = div;
    }
  }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
function pieceSrc(p) {
  return `pieces/${p.color}${p.type.toUpperCase()}.svg`;
}

function render(lastMove) {
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

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = 'status' + (cls ? ' ' + cls : '');
}

// ---------------------------------------------------------------------------
// Trainer logic
// ---------------------------------------------------------------------------
function legalMove(from, to) {
  return game.moves({ square: from, verbose: true })
    .find((m) => m.to === to) || null;
}

function matchChild(san) {
  return node.children.find((c) => norm(c.san) === norm(san)) || null;
}

function attemptUserMove(from, to) {
  if (locked) return;
  const m = legalMove(from, to);
  if (!m) { fail(); return; }                 // not even a legal move
  const child = matchChild(m.san);
  if (!child) { fail(to); return; }           // legal, but off the repertoire
  // good move
  game.move({ from: m.from, to: m.to, promotion: m.promotion || 'q' });
  sanList.push(m.san);
  node = child;
  clearSelection();
  render({ from: m.from, to: m.to });
  if (node.children.length === 0) { lineComplete(); return; }
  // now it's Black's turn
  locked = true;
  setStatus('…');
  setTimeout(botMove, 450);
}

function botMove() {
  const opts = node.children;
  // follow the pre-selected balanced target line when possible…
  let choice = null;
  if (targetLine) {
    const wantSan = targetLine[sanList.length];
    choice = opts.find((c) => norm(c.san) === norm(wantSan)) || null;
  }
  // …otherwise (e.g. user chose a different valid White branch) fall back to random
  if (!choice) choice = opts[Math.floor(Math.random() * opts.length)];
  // find the matching legal move and play it
  const verbose = game.moves({ verbose: true });
  const m = verbose.find((mv) => norm(mv.san) === norm(choice.san));
  if (!m) {                                    // should never happen if lines are legal
    setStatus('Line data error: ' + choice.san, 'fail');
    return;
  }
  game.move({ from: m.from, to: m.to, promotion: m.promotion || 'q' });
  sanList.push(m.san);
  node = choice;
  render({ from: m.from, to: m.to });
  if (node.children.length === 0) { lineComplete(); return; }
  locked = false;
  setStatus('Your move — play White.');
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
  game = new Chess();
  node = TREE;
  sanList = [];
  selected = null;
  locked = false;
  targetLine = nextTargetLine();
  render(null);
  setStatus('Your move — play White.');
}

function hint() {
  if (locked) return;
  if (game.turn() !== 'w') return;
  const moves = node.children.map((c) => c.san);
  if (moves.length) setStatus('Hint: ' + moves.join(' or '));
}

// ---------------------------------------------------------------------------
// Pointer input (tap-to-move + drag), works on touch and mouse
// ---------------------------------------------------------------------------
const ghost = document.getElementById('ghost');
let drag = null;   // { from, started }

function squareFromPoint(x, y) {
  const rect = boardEl.getBoundingClientRect();
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return null;
  const c = Math.floor(((x - rect.left) / rect.width) * 8);
  const r = Math.floor(((y - rect.top) / rect.height) * 8);
  if (c < 0 || c > 7 || r < 0 || r > 7) return null;
  return FILES[c] + (8 - r);
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
  // Selecting one of our own pieces (White, our turn).
  if (piece && piece.color === 'w' && game.turn() === 'w') {
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

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
buildBoard();
newLine();

// expose a tiny hook for automated testing
window.__trainer = {
  get fen() { return game.fen(); },
  get turn() { return game.turn(); },
  get options() { return node.children.map((c) => c.san); },
  get status() { return statusEl.textContent; },
  get locked() { return locked; },
  get history() { return sanList.slice(); },
  get target() { return targetLine ? targetLine.slice() : null; },
  get lineCount() { return ALL_LINES.length; },
  get pgnErrors() { return pgnParseErrors.slice(); },
  userMove(from, to) { attemptUserMove(from, to); },
  newLine,
};
