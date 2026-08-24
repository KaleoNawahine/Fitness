/** Tiny DOM + chart helpers. No framework, no build step. */

const SVG_NS = 'http://www.w3.org/2000/svg';
const SVG_TAGS = new Set([
  'svg', 'circle', 'path', 'line', 'polyline', 'polygon', 'rect', 'text', 'g',
  'defs', 'linearGradient', 'stop', 'ellipse', 'tspan'
]);

export function h(tag, attrs = {}, ...children) {
  // SVG elements must be namespaced or the browser treats them as inert
  // unknown HTML and nothing paints.
  const el = SVG_TAGS.has(tag)
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.setAttribute('class', v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

/* ---------------------------------------------------------------- TOASTS */
let toastHost;
export function toast(msg, kind = 'ok', ms = 2600) {
  if (!toastHost) {
    toastHost = h('div', { class: 'toast-host' });
    document.body.append(toastHost);
  }
  const t = h('div', { class: `toast toast--${kind}`, text: msg });
  toastHost.append(t);
  requestAnimationFrame(() => t.classList.add('in'));
  setTimeout(() => {
    t.classList.remove('in');
    setTimeout(() => t.remove(), 300);
  }, ms);
}

/* ----------------------------------------------------------------- SHEET */
export function sheet(title, bodyNode, actions = []) {
  const back = h('div', { class: 'sheet-back' });
  const panel = h('div', { class: 'sheet' },
    h('div', { class: 'sheet-grip' }),
    h('div', { class: 'sheet-head' },
      h('h3', { text: title }),
      h('button', { class: 'icon-btn', 'aria-label': 'Close', onclick: close, html: '&times;' })
    ),
    h('div', { class: 'sheet-body' }, bodyNode),
    actions.length ? h('div', { class: 'sheet-actions' },
      actions.map(a => h('button', {
        class: `btn ${a.kind ? 'btn--' + a.kind : ''}`,
        onclick: () => { if (a.onClick?.() !== false) close(); }
      }, a.label))
    ) : null
  );
  back.append(panel);
  back.addEventListener('click', e => { if (e.target === back) close(); });
  document.body.append(back);
  requestAnimationFrame(() => back.classList.add('in'));

  function close() {
    back.classList.remove('in');
    setTimeout(() => back.remove(), 260);
  }
  return { close, panel };
}

export function confirmSheet(title, message, onYes, yesLabel = 'Do it') {
  sheet(title, h('p', { class: 'muted', text: message }), [
    { label: 'Cancel' },
    { label: yesLabel, kind: 'danger', onClick: onYes }
  ]);
}

/* ------------------------------------------------------------ REST TIMER */
class RestTimer {
  constructor() {
    this.remaining = 0;
    this.total = 0;
    this.iv = null;
    this.el = null;
    this.onDone = null;
  }

  mount() {
    if (this.el) return;
    this.el = h('div', { class: 'rest-bar' },
      this.ring = h('svg', { class: 'rest-ring', viewBox: '0 0 40 40' }),
      h('div', { class: 'rest-meta' },
        this.label = h('div', { class: 'rest-time', text: '0:00' }),
        h('div', { class: 'rest-sub', text: 'Rest' })
      ),
      h('div', { class: 'rest-btns' },
        h('button', { class: 'chip', onclick: () => this.bump(-15), text: '-15' }),
        h('button', { class: 'chip', onclick: () => this.bump(15), text: '+15' }),
        h('button', { class: 'chip chip--solid', onclick: () => this.stop(), text: 'Skip' })
      )
    );
    this.ring.innerHTML =
      '<circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="4"/>' +
      '<circle class="rest-arc" cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="4" ' +
      'stroke-linecap="round" transform="rotate(-90 20 20)" stroke-dasharray="106.8" stroke-dashoffset="0"/>';
    this.arc = this.ring.querySelector('.rest-arc');
    document.body.append(this.el);
  }

  start(seconds, onDone) {
    if (!seconds) return;
    this.mount();
    this.total = seconds;
    this.remaining = seconds;
    this.onDone = onDone;
    this.el.classList.add('in');
    this.render();
    clearInterval(this.iv);
    this.iv = setInterval(() => {
      this.remaining--;
      this.render();
      if (this.remaining <= 0) this.ding();
    }, 1000);
  }

  bump(sec) {
    this.remaining = Math.max(0, this.remaining + sec);
    this.total = Math.max(this.total, this.remaining);
    this.render();
  }

  render() {
    if (!this.el) return;
    const m = Math.floor(Math.max(0, this.remaining) / 60);
    const s = Math.max(0, this.remaining) % 60;
    this.label.textContent = `${m}:${String(s).padStart(2, '0')}`;
    const frac = this.total ? Math.max(0, this.remaining) / this.total : 0;
    this.arc.setAttribute('stroke-dashoffset', String(106.8 * (1 - frac)));
    this.el.classList.toggle('rest-bar--low', this.remaining <= 10 && this.remaining > 0);
  }

  ding() {
    clearInterval(this.iv);
    this.iv = null;
    beep();
    if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
    this.el.classList.add('rest-bar--done');
    this.label.textContent = 'GO';
    setTimeout(() => this.stop(), 2200);
    this.onDone?.();
  }

  stop() {
    clearInterval(this.iv);
    this.iv = null;
    this.remaining = 0;
    if (this.el) {
      this.el.classList.remove('in', 'rest-bar--done', 'rest-bar--low');
    }
  }
}

export const restTimer = new RestTimer();

let audioCtx;
export function beep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [0, 0.18, 0.36].forEach((offset, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = idx === 2 ? 1046 : 784;
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.28, now + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.16);
    });
  } catch { /* audio blocked until first gesture — fine */ }
}

/* ---------------------------------------------------------------- CHARTS */

/**
 * Line chart as inline SVG. points: [{x:number, y:number, label?:string}]
 */
export function lineChart(points, opts = {}) {
  const {
    w = 320, hgt = 140, pad = { t: 14, r: 12, b: 22, l: 34 },
    color = 'var(--accent)', fill = true, invert = false, target = null,
    yUnit = ''
  } = opts;

  if (!points.length) {
    return h('div', { class: 'chart-empty' }, 'No data yet — log it and this fills in.');
  }

  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  let minY = Math.min(...ys), maxY = Math.max(...ys);
  if (target != null) { minY = Math.min(minY, target); maxY = Math.max(maxY, target); }
  const span = maxY - minY || Math.max(1, maxY * 0.1);
  minY -= span * 0.15; maxY += span * 0.15;
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const xSpan = maxX - minX || 1;

  const iw = w - pad.l - pad.r, ih = hgt - pad.t - pad.b;
  const X = v => pad.l + ((v - minX) / xSpan) * iw;
  const Y = v => pad.t + (1 - (v - minY) / (maxY - minY)) * ih;

  const path = points.map((p, idx) => `${idx ? 'L' : 'M'}${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join('');
  const area = `${path}L${X(maxX).toFixed(1)},${(pad.t + ih).toFixed(1)}L${X(minX).toFixed(1)},${(pad.t + ih).toFixed(1)}Z`;

  const ticks = [minY + (maxY - minY) * 0.15, (minY + maxY) / 2, maxY - (maxY - minY) * 0.15];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${hgt}`);
  svg.setAttribute('class', 'chart');
  svg.setAttribute('preserveAspectRatio', 'none');

  const parts = [];
  for (const t of ticks) {
    parts.push(`<line x1="${pad.l}" y1="${Y(t).toFixed(1)}" x2="${w - pad.r}" y2="${Y(t).toFixed(1)}" stroke="rgba(255,255,255,.07)" stroke-width="1"/>`);
    parts.push(`<text x="${pad.l - 6}" y="${(Y(t) + 3.5).toFixed(1)}" fill="rgba(255,255,255,.38)" font-size="9" text-anchor="end">${fmtNum(t)}</text>`);
  }
  if (target != null) {
    parts.push(`<line x1="${pad.l}" y1="${Y(target).toFixed(1)}" x2="${w - pad.r}" y2="${Y(target).toFixed(1)}" stroke="var(--good)" stroke-width="1.5" stroke-dasharray="4 3" opacity=".7"/>`);
    parts.push(`<text x="${w - pad.r}" y="${(Y(target) - 4).toFixed(1)}" fill="var(--good)" font-size="8.5" text-anchor="end">target ${fmtNum(target)}${yUnit}</text>`);
  }
  if (fill) {
    parts.push(`<defs><linearGradient id="g-${uid()}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity=".30"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>`);
  }
  const gid = `grad${uid()}`;
  if (fill) {
    parts.push(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity=".32"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient>`);
    parts.push(`<path d="${area}" fill="url(#${gid})"/>`);
  }
  parts.push(`<path d="${path}" fill="none" stroke="${color}" stroke-width="2.25" stroke-linejoin="round" stroke-linecap="round"/>`);
  for (const p of points) {
    parts.push(`<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="3" fill="var(--bg)" stroke="${color}" stroke-width="2"/>`);
  }
  // First and last value labels.
  const last = points[points.length - 1];
  parts.push(`<text x="${Math.min(w - pad.r, X(last.x) + 6).toFixed(1)}" y="${(Y(last.y) - 8).toFixed(1)}" fill="${color}" font-size="10.5" font-weight="700" text-anchor="end">${fmtNum(last.y)}${yUnit}</text>`);

  svg.innerHTML = parts.join('');
  return svg;
}

/** Small inline sparkline. */
export function sparkline(values, color = 'currentColor', w = 72, hgt = 24) {
  if (values.length < 2) return h('span', { class: 'spark-empty', text: '—' });
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, idx) => {
    const x = (idx / (values.length - 1)) * (w - 4) + 2;
    const y = hgt - 2 - ((v - min) / span) * (hgt - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${hgt}`);
  svg.setAttribute('class', 'spark');
  svg.innerHTML = `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  return svg;
}

/** Horizontal bar set — used for weekly tonnage. */
export function barChart(items, opts = {}) {
  const { color = 'var(--accent)' } = opts;
  if (!items.length) return h('div', { class: 'chart-empty' }, 'Nothing logged yet.');
  const max = Math.max(...items.map(it => it.v)) || 1;
  return h('div', { class: 'bars' },
    items.map(it => h('div', { class: 'bar-row' },
      h('span', { class: 'bar-label', text: it.label }),
      h('div', { class: 'bar-track' },
        h('div', { class: 'bar-fill', style: { width: `${(it.v / max) * 100}%`, background: color } })
      ),
      h('span', { class: 'bar-val', text: it.display ?? fmtNum(it.v) })
    ))
  );
}

export function ring(pct, opts = {}) {
  const { size = 56, stroke = 5, color = 'var(--accent)', label } = opts;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('class', 'ringchart');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.innerHTML = `
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="${stroke}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
      stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}"
      stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    ${label ? `<text x="50%" y="50%" dy="3.5" text-anchor="middle" fill="var(--fg)" font-size="${size * 0.26}" font-weight="800">${label}</text>` : ''}`;
  return svg;
}

/* ----------------------------------------------------------------- UTILS */
let _uid = 0;
function uid() { return ++_uid; }

export function fmtNum(n) {
  if (n == null) return '—';
  if (Math.abs(n) >= 10000) return `${(n / 1000).toFixed(0)}k`;
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function numberInput(attrs = {}) {
  return h('input', {
    type: 'number', inputmode: 'decimal', step: 'any',
    class: 'num', ...attrs
  });
}
