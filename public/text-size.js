// MemoriGems — text size across the whole app, and the control to change it.
//
// Every one of the 127 pages already loads this file immediately after its own
// <style> block. That is the lever: anything appended from here arrives after
// each page's own rules and wins, so one file changes all of them.
//
// WHAT THIS DOES
//   1. loads fonts.css (Inter) for every page
//   2. applies the saved text size before the page paints, so there is no flicker
//   3. drops a three-step size control into the ☰ menu wherever one exists
//   4. loads read-aloud.js
//
// WHY zoom AND NOT root font-size: the app declares 2,535 font sizes in px and
// only 196 in rem, so scaling the root would move almost nothing. zoom moves the
// whole page. Supported in Chrome, Edge, Safari, and Firefox since 126.
(function () {

  /* ---------- 1. fonts ---------------------------------------------------- */
  try {
    if (!document.getElementById('mgFonts')) {
      var mgf = document.createElement('link');
      mgf.id = 'mgFonts'; mgf.rel = 'stylesheet'; mgf.href = 'fonts.css';
      (document.head || document.documentElement).appendChild(mgf);
    }
  } catch (e) {}

  /* ---------- 2. the sizes ------------------------------------------------ */
  // Three fixed steps, not a slider. A slider needs a controlled drag, which
  // tremor and arthritis make hard, and you cannot tell you have overshot until
  // you let go. Three buttons each showing their own size cannot be missed.
  var STEPS = [
    { z: '',     label: 'Normal',  sample: 15 },
    { z: '1.15', label: 'Larger',  sample: 19 },
    { z: '1.32', label: 'Largest', sample: 24 }
  ];

  function read() {
    try {
      var v = localStorage.getItem('mg_textsize');
      if (v !== null) { var n = parseInt(v, 10); return (n >= 0 && n < STEPS.length) ? n : 0; }
      // migrate the old on/off setting so nobody loses what they had
      if (localStorage.getItem('mg_largetext') === '1') return 1;
    } catch (e) {}
    return 0;
  }

  function apply() {
    var s = STEPS[read()];
    if (document.documentElement) document.documentElement.style.zoom = s.z;
  }

  function set(n) {
    if (n < 0 || n >= STEPS.length) return;
    try {
      localStorage.setItem('mg_textsize', String(n));
      // keep the old key in step, so settings.html stays truthful either way
      localStorage.setItem('mg_largetext', n > 0 ? '1' : '0');
    } catch (e) {}
    apply();
    paintControl();
  }

  window.mgTextSize = { get: read, set: set, steps: STEPS, apply: apply };
  window.mgApplyTextSize = apply;          // old name, still used by settings.html
  apply();

  window.addEventListener('storage', function (e) {
    if (e.key === 'mg_textsize' || e.key === 'mg_largetext') { apply(); paintControl(); }
  });

  /* ---------- 3. the control, injected into the ☰ menu -------------------- */
  var CSS = ''
    + '.mgts{border-top:1px solid rgba(0,0,0,.10);margin-top:6px;padding-top:10px}'
    + '.mgts-h{display:block;font-size:.82rem;font-weight:700;opacity:.65;margin:0 0 8px;padding:0 2px}'
    + '.mgts-row{display:flex;gap:6px}'
    + '.mgts-b{flex:1;min-height:52px;border:1.5px solid rgba(0,0,0,.16);border-radius:12px;'
    + 'background:#fff;color:inherit;cursor:pointer;font-family:inherit;padding:6px 2px;'
    + 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}'
    + '.mgts-b .a{font-weight:700;line-height:1}'
    + '.mgts-b .n{font-size:.62rem;font-weight:600;opacity:.6}'
    + '.mgts-b[aria-pressed="true"]{border-color:#1C7A5C;background:#E6F0EA;color:#1C7A5C}'
    + '.mgts-b[aria-pressed="true"] .n{opacity:1}';

  function styleOnce() {
    if (document.getElementById('mgtsCss')) return;
    var st = document.createElement('style');
    st.id = 'mgtsCss'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function paintControl() {
    var wrap = document.getElementById('mgts');
    if (!wrap) return;
    var cur = read();
    var bs = wrap.querySelectorAll('.mgts-b');
    for (var i = 0; i < bs.length; i++) {
      bs[i].setAttribute('aria-pressed', i === cur ? 'true' : 'false');
    }
  }

  function build(menu) {
    if (!menu || document.getElementById('mgts')) return;
    styleOnce();
    var wrap = document.createElement('div');
    wrap.className = 'mgts'; wrap.id = 'mgts';
    var h = document.createElement('span');
    h.className = 'mgts-h'; h.textContent = 'Text size';
    wrap.appendChild(h);
    var row = document.createElement('div');
    row.className = 'mgts-row';
    STEPS.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'mgts-b';
      b.setAttribute('aria-label', s.label + ' text');
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<span class="a" style="font-size:' + s.sample + 'px">Aa</span>'
                  + '<span class="n">' + s.label + '</span>';
      // stopPropagation: the menus close on any click inside them, and changing
      // size is the one action you want to try twice without reopening.
      b.addEventListener('click', function (ev) { ev.stopPropagation(); set(i); });
      row.appendChild(b);
    });
    wrap.appendChild(row);
    menu.appendChild(wrap);
    paintControl();
  }

  function look() {
    var m = document.getElementById('menu');
    if (m) { build(m); return true; }
    return false;
  }

  function watch() {
    if (look()) return;
    // Several pages render their menu from JS after load, so wait for it rather
    // than assuming it is already in the DOM.
    try {
      var mo = new MutationObserver(function () { if (look()) mo.disconnect(); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 8000);
    } catch (e) {}
  }

  /* ---------- 4. read aloud ---------------------------------------------- */
  function loadReadAloud() {
    if (document.getElementById('mgRead')) return;
    if (document.body && document.body.hasAttribute('data-no-read')) return;
    var sc = document.createElement('script');
    sc.id = 'mgRead'; sc.src = 'read-aloud.js'; sc.defer = true;
    (document.head || document.documentElement).appendChild(sc);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { watch(); loadReadAloud(); });
  } else { watch(); loadReadAloud(); }
})();
