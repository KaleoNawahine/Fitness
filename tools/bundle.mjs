/**
 * Emits a single self-contained HTML file from the ES-module sources.
 *
 * Each module body is wrapped in its own function so nothing collides
 * (every view exports a `render`), and imports are rewritten to pull from a
 * tiny memoising registry — a minimal ES-module emulation, which is enough
 * for the one import style this codebase uses.
 *
 *   node tools/bundle.mjs [outfile]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.argv[2] || join(ROOT, 'dist', 'above-the-net.html');

// Dependency order: a module may only import ones already defined.
const MODULES = [
  ['exercises', 'js/data/exercises.js'],
  ['program', 'js/data/program.js'],
  ['nutrition', 'js/data/nutrition.js'],
  ['ui', 'js/ui.js'],
  ['store', 'js/store.js'],
  ['today', 'js/views/today.js'],
  ['plan', 'js/views/plan.js'],
  ['progress', 'js/views/progress.js'],
  ['fuel', 'js/views/fuel.js'],
  ['settings', 'js/views/settings.js'],
  ['app', 'js/app.js']
];

const MOD_BY_PATH = name => name.replace(/^.*\//, '').replace(/\.js$/, '');

function transform(src) {
  const exports = new Set();
  let out = src;

  // import * as ns from './x.js'  ->  const ns = __req('x')
  out = out.replace(
    /^import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"];?$/gm,
    (_, ns, path) => `const ${ns} = __req('${MOD_BY_PATH(path)}');`
  );

  // import { a, b } from './x.js'  ->  const { a, b } = __req('x')
  out = out.replace(
    /^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?$/gms,
    (_, names, path) => `const {${names}} = __req('${MOD_BY_PATH(path)}');`
  );

  // Collect and strip export keywords.
  out = out.replace(/^export\s+(async\s+)?function\s+([$\w]+)/gm, (_, asy, n) => {
    exports.add(n);
    return `${asy || ''}function ${n}`;
  });
  out = out.replace(/^export\s+(const|let|var|class)\s+([$\w]+)/gm, (_, kind, n) => {
    exports.add(n);
    return `${kind} ${n}`;
  });

  if (/^\s*(export|import)\s/m.test(out)) {
    const stray = out.match(/^\s*(export|import)\s.*$/m);
    throw new Error(`Unhandled module syntax: ${stray[0].trim()}`);
  }

  return { code: out, exports: [...exports] };
}

const parts = [];
for (const [name, rel] of MODULES) {
  const { code, exports } = transform(readFileSync(join(ROOT, rel), 'utf8'));
  parts.push(
    `__def('${name}', function () {\n${code}\nreturn { ${exports.join(', ')} };\n});`
  );
  console.log(`  ${name.padEnd(10)} ${exports.length} exports`);
}

const css = readFileSync(join(ROOT, 'css', 'app.css'), 'utf8');
const favicon = readFileSync(join(ROOT, 'icons', 'favicon.svg'), 'utf8');
const faviconUrl = `data:image/svg+xml,${encodeURIComponent(favicon)}`;

const html = `<meta charset="utf-8">
<title>Above the Net</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0b0d10">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Above the Net">
<link rel="apple-touch-icon" href="${faviconUrl}">
<style>
${css}
</style>

<div id="app">
  <main id="main" class="main"></main>
  <nav id="tabbar" class="tabbar" aria-label="Main navigation"></nav>
</div>

<script>
window.__ATN_SINGLE_FILE = true;
(function () {
  'use strict';
  var __factories = {}, __cache = {};
  function __def(name, fn) { __factories[name] = fn; }
  function __req(name) {
    if (!(name in __cache)) {
      if (!__factories[name]) throw new Error('Unknown module: ' + name);
      __cache[name] = __factories[name]();
    }
    return __cache[name];
  }

${parts.join('\n\n')}

  __req('app');
})();
</script>
`;

writeFileSync(OUT, html);
console.log(`\n${OUT}  ${(html.length / 1024).toFixed(0)} KB`);
