import { h, $, clear, toast, restTimer } from './ui.js';
import * as store from './store.js';
import * as today from './views/today.js';
import * as plan from './views/plan.js';
import * as progress from './views/progress.js';
import * as fuel from './views/fuel.js';
import * as settings from './views/settings.js';
import { blockForWeek } from './data/program.js';

const VIEWS = {
  today: { render: today.render, label: 'Today', icon: iconToday },
  plan: { render: plan.render, label: 'Plan', icon: iconPlan },
  progress: { render: progress.render, label: 'Progress', icon: iconProgress },
  fuel: { render: fuel.render, label: 'Fuel', icon: iconFuel },
  settings: { render: settings.render, label: 'More', icon: iconMore }
};

let current = 'today';
const main = $('#main');
const tabbar = $('#tabbar');

function nav(view, opts = {}) {
  if (!VIEWS[view]) view = 'today';
  const changed = view !== current;
  current = view;
  location.hash = `#${view}`;
  VIEWS[view].render(main, nav);
  if (changed || opts.scroll !== false) window.scrollTo({ top: 0, behavior: changed ? 'instant' : 'auto' });
  renderTabs();
}

function renderTabs() {
  clear(tabbar);
  for (const [key, v] of Object.entries(VIEWS)) {
    tabbar.append(
      h('button', {
        class: `tab ${key === current ? 'is-active' : ''}`,
        onclick: () => nav(key),
        'aria-current': key === current ? 'page' : null
      },
        v.icon(),
        h('span', { class: 'tab-label', text: v.label })
      )
    );
  }
}

/* ------------------------------------------------------------------ ICONS */
function svg(paths, opts = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('viewBox', '0 0 24 24');
  el.setAttribute('class', 'tab-icon');
  el.setAttribute('fill', 'none');
  el.setAttribute('stroke', 'currentColor');
  el.setAttribute('stroke-width', opts.w || '1.9');
  el.setAttribute('stroke-linecap', 'round');
  el.setAttribute('stroke-linejoin', 'round');
  el.innerHTML = paths;
  return el;
}
function iconToday() { return svg('<path d="M6 3v4M18 3v4M3 10h18M5 7h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><path d="M9 15l2 2 4-4"/>'); }
function iconPlan() { return svg('<path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2"/>'); }
function iconProgress() { return svg('<path d="M3 20V10M9 20V4M15 20v-7M21 20V7"/>'); }
function iconFuel() { return svg('<path d="M12 21c4.5 0 7-3 7-7 0-4-3-6-3-9 0 0-2 1.5-2 4 0 0-2-2-2-5-3 2-7 5-7 10 0 4 2.5 7 7 7z"/>'); }
function iconMore() { return svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 7a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 1.1V1a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>', { w: 1.6 }); }

/* ------------------------------------------------------------------- BOOT */
function boot() {
  store.load();

  // Accent the whole shell with the current block's colour.
  document.documentElement.style.setProperty('--accent', blockForWeek(store.currentWeek()).color);

  const hash = location.hash.replace('#', '');
  nav(VIEWS[hash] ? hash : 'today');

  // First run: introduce the program and offer to set a baseline.
  if (!localStorage.getItem('atn.welcomed')) {
    localStorage.setItem('atn.welcomed', '1');
    setTimeout(showWelcome, 500);
  }

  window.addEventListener('hashchange', () => {
    const v = location.hash.replace('#', '');
    if (VIEWS[v] && v !== current) nav(v);
  });

  // Keep the timer out of the way of a tap-happy thumb during a session.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    VIEWS[current].render(main, nav);
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => { /* offline support is a bonus, not a requirement */ });
    });
  }
}

function showWelcome() {
  import('./ui.js').then(({ sheet }) => {
    sheet('Welcome to Above the Net', h('div', { class: 'detail' },
      h('p', { text: 'This is a 16-week block-periodized program built for one thing: making a 6\'3" volleyball player leaner, faster, and harder to break, while adding real inches to the approach jump.' }),
      h('h4', { text: 'Start here' }),
      h('ol', { class: 'cues' },
        h('li', { text: 'Open the Plan tab and read the block overview so you know where this is going.' }),
        h('li', { text: 'Run the two baseline test sessions before week 1. It takes about 70 minutes total and everything the app prescribes depends on it.' }),
        h('li', { text: 'Enter your 3RMs in Settings — the app converts them to estimated 1RMs and calculates every working weight from there.' }),
        h('li', { text: 'Then just open Today and follow it. Log every set; that is what lets the loads progress on their own.' })
      ),
      h('p', { class: 'muted', text: 'Everything stays on this device. Add it to your home screen from the More tab and it works with no signal at all.' })
    ), [
      { label: 'See the plan', onClick: () => nav('plan') },
      { label: 'Start training', kind: 'primary', onClick: () => nav('today') }
    ]);
  });
}

boot();
