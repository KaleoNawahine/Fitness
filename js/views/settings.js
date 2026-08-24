import { h, clear, toast, sheet, numberInput, confirmSheet } from '../ui.js';
import * as store from '../store.js';
import { MAX_LIFTS, blockForWeek, TOTAL_WEEKS } from '../data/program.js';
import { GOALS } from '../data/nutrition.js';
import { EXERCISES } from '../data/exercises.js';

export function render(root, nav) {
  clear(root);
  const s = store.get();
  root.style.setProperty('--accent', blockForWeek(store.currentWeek()).color);

  root.append(
    h('header', { class: 'hdr' },
      h('div', { class: 'hdr-top' },
        h('div', null,
          h('h1', { class: 'hdr-title', text: 'Settings' }),
          h('p', { class: 'hdr-sub', text: 'Maxes, preferences, and your data' })
        )
      )
    )
  );

  const body = h('div', { class: 'stack' });
  root.append(body);

  /* ------------------------------------------------------------- maxes */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Training maxes' }),
      h('p', { class: 'muted', text: 'Estimated 1-rep maxes. Every percentage in the program comes off these, so keeping them current is what keeps the loads honest.' }),
      h('div', { class: 'stack-sm' },
        Object.entries(MAX_LIFTS).map(([ref, m]) => {
          const input = numberInput({
            value: s.maxes[ref],
            class: 'num',
            onchange: e => {
              const v = parseFloat(e.target.value);
              if (Number.isFinite(v)) { store.applyMax(ref, v); toast(`${m.name} max: ${Math.round(v)} lb`); }
            }
          });
          return h('div', { class: 'maxrow' },
            h('span', { class: 'maxrow-name', text: m.name }),
            h('div', { class: 'maxrow-in' }, input, h('span', { class: 'setunit', text: m.unit })),
            h('button', {
              class: 'linkbtn',
              onclick: () => openFrom3RM(ref, m, root, nav)
            }, 'from 3RM')
          );
        })
      ),
      staleCard(root, nav)
    )
  );

  /* ---------------------------------------------------------- week cursor */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Where you are' }),
      h('div', { class: 'weekpick' },
        h('button', {
          class: 'btn btn--ghost btn--sm', disabled: store.currentWeek() <= 1,
          onclick: () => { store.setWeek(store.currentWeek() - 1); render(root, nav); }
        }, '−'),
        h('span', { class: 'weekpick-val', text: `Week ${store.currentWeek()} of ${TOTAL_WEEKS}` }),
        h('button', {
          class: 'btn btn--ghost btn--sm', disabled: store.currentWeek() >= TOTAL_WEEKS,
          onclick: () => { store.setWeek(store.currentWeek() + 1); render(root, nav); }
        }, '+')
      ),
      h('p', { class: 'muted', text: 'The week advances on its own once you finish the five main sessions — the Saturday Pump day is optional and does not hold you back. Move it manually to skip ahead or repeat a week.' })
    )
  );

  /* ------------------------------------------------------------ profile */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Profile' }),
      h('div', { class: 'formstack' },
        field('Name', h('input', {
          class: 'num num--wide', type: 'text', value: s.profile.name, placeholder: 'Your name',
          onchange: e => store.update(st => { st.profile.name = e.target.value; })
        })),
        field('Goal', h('select', {
          class: 'sel',
          onchange: e => { store.update(st => { st.profile.goal = e.target.value; }); toast('Fuel targets updated'); }
        }, Object.entries(GOALS).map(([k, g]) => h('option', {
          value: k, text: `${g.name} (${g.rate > 0 ? '+' : ''}${g.rate} lb/wk)`, selected: s.profile.goal === k
        })))),
        field('Target weight (lb)', numberInput({
          value: s.profile.goalWeight,
          onchange: e => store.update(st => { st.profile.goalWeight = parseFloat(e.target.value) || st.profile.goalWeight; })
        })),
        field('Bodyweight (lb)', numberInput({
          value: s.profile.weightLb,
          onchange: e => {
            const v = parseFloat(e.target.value);
            if (Number.isFinite(v)) { store.update(st => { st.profile.weightLb = v; }); store.logMetric('bodyweight', v); toast('Logged'); }
          }
        })),
        field('Height (in)', numberInput({
          value: s.profile.heightIn,
          onchange: e => store.update(st => { st.profile.heightIn = parseFloat(e.target.value) || st.profile.heightIn; })
        })),
        field('Age', numberInput({
          value: s.profile.age,
          onchange: e => store.update(st => { st.profile.age = parseInt(e.target.value, 10) || st.profile.age; })
        })),
        field('Program start', h('input', {
          class: 'num num--date', type: 'date', value: s.profile.startDate,
          onchange: e => store.update(st => { st.profile.startDate = e.target.value; })
        }))
      )
    )
  );

  /* --------------------------------------------------------- preferences */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Preferences' }),
      h('div', { class: 'stack-sm' },
        toggle('Auto-start rest timer', s.prefs.autoRest, v => store.update(st => { st.prefs.autoRest = v; })),
        toggle('Timer sound + vibrate', s.prefs.sound, v => store.update(st => { st.prefs.sound = v; })),
        h('div', { class: 'maxrow' },
          h('span', { class: 'maxrow-name', text: 'Smallest plate jump' }),
          h('div', { class: 'maxrow-in' },
            h('select', {
              class: 'sel',
              onchange: e => { store.update(st => { st.prefs.plateInc = parseFloat(e.target.value); }); toast('Loads will round to this'); }
            }, [2.5, 5, 10].map(v => h('option', { value: v, text: `${v} lb`, selected: s.prefs.plateInc === v })))
          )
        ),
        h('div', { class: 'maxrow' },
          h('span', { class: 'maxrow-name', text: 'Olympic lift variation' }),
          h('div', { class: 'maxrow-in' },
            h('select', {
              class: 'sel',
              onchange: e => { store.update(st => { st.prefs.cleanVariant = e.target.value; }); toast('Updated'); }
            },
              h('option', { value: 'hang_clean', text: 'Hang power clean', selected: s.prefs.cleanVariant === 'hang_clean' }),
              h('option', { value: 'jump_shrug', text: 'Trap bar jump shrug', selected: s.prefs.cleanVariant === 'jump_shrug' })
            )
          )
        )
      ),
      h('p', { class: 'muted', text: 'Pick the jump shrug if nobody has coached you through catching a clean. It builds the same triple extension with none of the technical risk.' })
    )
  );

  /* ------------------------------------------------------------ exercises */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Exercise library' }),
      h('p', { class: 'muted', text: 'Every movement in the program, with cues and the reason it is in there.' }),
      h('button', { class: 'btn btn--ghost', onclick: () => openLibrary() }, 'Browse all movements')
    )
  );

  /* ----------------------------------------------------------------- data */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Your data' }),
      h('p', { class: 'muted', text: 'Everything lives on this device only — nothing is uploaded anywhere. Export a backup before you switch phones.' }),
      h('div', { class: 'btnrow' },
        h('button', { class: 'btn btn--ghost', onclick: doExport }, 'Export backup'),
        h('button', { class: 'btn btn--ghost', onclick: () => doImport(root, nav) }, 'Import backup')
      ),
      h('button', {
        class: 'btn btn--danger',
        onclick: () => confirmSheet(
          'Erase everything?',
          'This wipes every logged set, measurement, and setting on this device. There is no undo — export a backup first if you might want it.',
          () => { store.resetAll(); toast('Wiped clean'); nav('today'); },
          'Erase it all'
        )
      }, 'Reset all data')
    )
  );

  /* -------------------------------------------------------------- install */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Put it on your home screen' }),
      h('div', { class: 'installsteps' },
        h('div', { class: 'principle' },
          h('h4', { text: 'iPhone' }),
          h('p', { text: 'Open this page in Safari, tap the Share button, scroll down and tap "Add to Home Screen". It then opens full-screen with no browser bars and works with no signal.' })
        ),
        h('div', { class: 'principle' },
          h('h4', { text: 'Android' }),
          h('p', { text: 'Open in Chrome, tap the three-dot menu, then "Install app" or "Add to Home screen".' })
        )
      ),
      h('p', { class: 'muted', text: 'Once installed it runs entirely offline — the gym basement with no bars is exactly where you need it to work.' })
    )
  );

  body.append(h('footer', { class: 'appfoot' },
    h('p', { text: `Frame · a ${TOTAL_WEEKS}-week lean-mass plan built around your jump` }),
    h('p', { class: 'muted small', text: 'General fitness guidance, not medical advice. Sharp or persistent pain means see a professional, not push through.' })
  ));

  body.append(h('div', { class: 'spacer' }));
}

function staleCard(root, nav) {
  const stale = store.staleMaxes();
  if (!stale.length) return null;
  return h('div', { class: 'banner banner--good' },
    h('span', { text: `Your logged sets suggest ${stale.length} max${stale.length > 1 ? 'es are' : ' is'} out of date.` }),
    h('button', {
      class: 'btn btn--sm btn--primary',
      onclick: () => {
        stale.forEach(st => store.applyMax(st.ref, st.implied));
        toast('Maxes updated');
        render(root, nav);
      }
    }, 'Update')
  );
}

function openFrom3RM(ref, m, root, nav) {
  const input = numberInput({ placeholder: 'weight you hit for 3 reps', class: 'num num--wide' });
  sheet(`${m.name} — from a 3RM`, h('div', { class: 'formstack' },
    h('p', { class: 'muted', text: 'Enter the heaviest weight you can do 3 clean reps with. The app converts it to an estimated 1RM using the Epley formula, which is accurate enough at low reps and much safer than testing a true single.' }),
    field('3RM weight (lb)', input)
  ), [
    { label: 'Cancel' },
    {
      label: 'Calculate', kind: 'primary',
      onClick: () => {
        const v = parseFloat(input.value);
        if (!Number.isFinite(v)) { toast('Enter a weight', 'warn'); return false; }
        const est = store.e1rm(v, 3);
        store.applyMax(ref, est);
        toast(`${m.name}: ${v} × 3 → estimated 1RM ${est} lb`);
        render(root, nav);
      }
    }
  ]);
}

function openLibrary() {
  const groups = {};
  for (const [id, def] of Object.entries(EXERCISES)) {
    (groups[def.cat] = groups[def.cat] || []).push({ id, ...def });
  }
  const order = ['power', 'strength', 'speed', 'core', 'accessory', 'conditioning', 'prep', 'recovery', 'test'];
  const body = h('div', { class: 'detail' },
    order.filter(k => groups[k]).map(k => h('div', null,
      h('h4', { class: 'libcat', text: LABELS[k] || k }),
      groups[k].map(d => h('div', { class: 'libitem' },
        h('strong', { text: d.name }),
        h('p', { class: 'libwhy', text: d.why }),
        h('ul', { class: 'libcues' }, d.cues.map(c => h('li', { text: c })))
      ))
    ))
  );
  sheet('Exercise library', body, [{ label: 'Close', kind: 'primary' }]);
}

const LABELS = {
  power: 'Power & Plyometrics', strength: 'Strength', speed: 'Speed & Agility',
  core: 'Core', accessory: 'Accessory & Shoulder Health', conditioning: 'Conditioning',
  prep: 'Movement Prep', recovery: 'Recovery', test: 'Testing'
};

function field(label, input) {
  return h('label', { class: 'field' },
    h('span', { class: 'field-label', text: label }),
    input
  );
}

function toggle(label, value, onChange) {
  const input = h('input', {
    type: 'checkbox', class: 'sw-in', checked: value,
    onchange: e => onChange(e.target.checked)
  });
  return h('label', { class: 'swrow' },
    h('span', { class: 'maxrow-name', text: label }),
    h('span', { class: 'sw' }, input, h('span', { class: 'sw-track' }))
  );
}

function doExport() {
  const data = store.exportJSON();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const name = `above-the-net-backup-${store.todayISO()}.json`;

  // Try the share sheet first — on iOS that is the only reliable save path.
  if (navigator.canShare?.({ files: [new File([blob], name, { type: 'application/json' })] })) {
    navigator.share({
      files: [new File([blob], name, { type: 'application/json' })],
      title: 'Above the Net backup'
    }).catch(() => fallbackDownload(url, name));
  } else {
    fallbackDownload(url, name);
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function fallbackDownload(url, name) {
  const a = h('a', { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  toast('Backup saved');
}

function doImport(root, nav) {
  const input = h('input', { type: 'file', accept: 'application/json,.json', style: { display: 'none' } });
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        store.importJSON(String(reader.result));
        toast('Backup restored');
        nav('today');
      } catch (e) {
        toast('That file did not look like a backup', 'warn');
      }
    };
    reader.readAsText(file);
  });
  document.body.append(input);
  input.click();
  setTimeout(() => input.remove(), 1000);
}
