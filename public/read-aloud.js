// MemoriGems — "Hear this" beside each section heading.
//
// Loaded automatically by text-size.js, which every page already carries, so no
// page needed editing to get this.
//
// TWO RULES THIS FOLLOWS, both inherited from decisions already made:
//   • Nothing speaks until it is tapped. The keeper pages "stay quiet until you
//     tap", and a caregiver is often reading at night beside someone asleep.
//   • One section at a time. A 1,200-word grief page read end to end is nine
//     minutes with no way to skip; people want THIS bit read to them.
//
// To opt a page out entirely: <body data-no-read>.
(function () {
  if (!('speechSynthesis' in window)) return;
  if (document.getElementById('mgraCss')) return;

  var MIN_WORDS = 12;          // don't offer to read a two-word label
  var current = null;          // the button that is speaking

  /* ---------- voice: use the app's shared voice if it is present ---------- */
  var applyVoice = null;
  try {
    import('./voice.js').then(function (m) {
      if (m && typeof m.applyVoice === 'function') applyVoice = m.applyVoice;
    }).catch(function () {});
  } catch (e) {}

  var CSS = ''
    + '.mgra{display:inline-flex;align-items:center;gap:6px;vertical-align:middle;'
    + 'margin-left:10px;border:1.4px solid currentColor;background:transparent;'
    + 'color:inherit;opacity:.62;border-radius:100px;padding:5px 11px;'
    + 'font:600 .72rem/1 inherit;font-family:inherit;cursor:pointer;min-height:34px}'
    + '.mgra:hover,.mgra:focus-visible{opacity:1}'
    + '.mgra[aria-pressed="true"]{opacity:1;background:currentColor}'
    + '.mgra[aria-pressed="true"] .mgra-t,.mgra[aria-pressed="true"] svg{'
    + 'color:#fff;mix-blend-mode:normal;filter:invert(1) grayscale(1) contrast(9)}'
    + '@media print{.mgra{display:none}}';

  var st = document.createElement('style');
  st.id = 'mgraCss'; st.textContent = CSS;
  document.head.appendChild(st);

  var ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>';

  function stop() {
    try { speechSynthesis.cancel(); } catch (e) {}
    if (current) {
      current.setAttribute('aria-pressed', 'false');
      current.querySelector('.mgra-t').textContent = 'Hear this';
      current = null;
    }
  }

  function speak(text, btn) {
    if (current === btn) { stop(); return; }   // tapping again stops it
    stop();
    var u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92;
    if (applyVoice) { try { applyVoice(u); } catch (e) {} }
    u.onend = u.onerror = function () { if (current === btn) stop(); };
    current = btn;
    btn.setAttribute('aria-pressed', 'true');
    btn.querySelector('.mgra-t').textContent = 'Stop';
    try { speechSynthesis.speak(u); } catch (e) { stop(); }
  }

  /* ---------- what belongs to a heading ---------------------------------- */
  // Everything between this heading and the NEXT HEADING OF ANY LEVEL.
  // Stopping only at same-or-higher levels is more correct HTML-wise, but it
  // makes an h2 swallow every h3 beneath it — so tapping the h2 reads the same
  // words the h3 button will read again. One button, one block, no overlap is
  // far easier to predict, and predictability is the whole point here.
  function textFor(h) {
    var out = [h.textContent], n = h.nextElementSibling;
    while (n) {
      if (/^H[1-6]$/.test(n.tagName)) break;
      if (!n.classList.contains('mgra')) out.push(n.textContent || '');
      n = n.nextElementSibling;
    }
    return out
      .map(function (x) { return (x || '').replace(/\s+/g, ' ').trim(); })
      .filter(Boolean)
      .join('. ')
      .replace(/([.!?])\s*\./g, '$1')   // "Too few.." -> "Too few."
      .replace(/\s+/g, ' ')
      .trim();
  }

  function words(s) { return s ? s.split(/\s+/).length : 0; }

  function addButton(h, text) {
    if (h.querySelector('.mgra')) return;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'mgra';
    b.setAttribute('aria-label', 'Hear this section read aloud');
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = ICON + '<span class="mgra-t">Hear this</span>';
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation(); speak(text, b);
    });
    h.appendChild(b);
  }

  function run() {
    var scope = document.querySelector('main, article, .page, #page') || document.body;
    var hs = scope.querySelectorAll('h2, h3');
    var added = 0;
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i];
      if (h.closest('nav, header, .topbar, .menu, .listen, .ov')) continue;
      var t = textFor(h);
      if (words(t) < MIN_WORDS) continue;
      addButton(h, t); added++;
    }
    // Degrade gracefully: a page with no usable headings still gets one button.
    if (added === 0) {
      var t2 = (scope.textContent || '').replace(/\s+/g, ' ').trim();
      if (words(t2) >= 40) {
        var first = scope.querySelector('h1');
        if (first && !first.querySelector('.mgra')) addButton(first, t2);
      }
    }
  }

  // Stop speaking if the page is left or hidden — nobody wants a voice
  // continuing from a screen they have navigated away from.
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else { run(); }

  // Several pages render their content from JS, so look once more after it lands.
  try {
    var seen = 0;
    var mo = new MutationObserver(function () { if (++seen < 40) run(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 6000);
  } catch (e) {}

  window.mgReadAloud = { stop: stop, run: run };
})();
