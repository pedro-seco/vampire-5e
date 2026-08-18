(function () {
  'use strict';

  // ── Render sections from data ──────────────────────────────────────────
  const sidebar  = document.getElementById('sidebar');
  const content  = document.getElementById('content');

  window.VAULT_SECTIONS.forEach(function (sec) {
    // nav link
    var a = document.createElement('a');
    a.className   = 'vn-link';
    a.href        = '#' + sec.id;
    a.dataset.id  = sec.id;
    a.textContent = sec.title;
    sidebar.appendChild(a);

    // content section
    var el = document.createElement('section');
    el.id          = sec.id;
    el.className   = 'vs';
    el.dataset.title = sec.title;
    el.innerHTML   = sec.html;
    content.appendChild(el);
  });

  // ── Mobile sidebar toggle ──────────────────────────────────────────────
  var menuBtn  = document.getElementById('menuBtn');
  var sidebarEl = document.getElementById('sidebar');
  var overlay  = document.getElementById('overlay');

  function closeSidebar() {
    sidebarEl.classList.remove('open');
    overlay.classList.remove('open');
  }
  menuBtn.addEventListener('click', function () {
    sidebarEl.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  overlay.addEventListener('click', closeSidebar);
  document.querySelectorAll('.vn-link').forEach(function (l) {
    l.addEventListener('click', closeSidebar);
  });

  // ── Active link on scroll ──────────────────────────────────────────────
  var sections = Array.from(document.querySelectorAll('.vs'));
  var navLinks = Array.from(document.querySelectorAll('.vn-link'));

  content.addEventListener('scroll', function () {
    var offset = content.scrollTop + 80;
    var cur = sections[0];
    sections.forEach(function (s) {
      if (!s.classList.contains('hidden') && s.offsetTop <= offset) cur = s;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.dataset.id === cur.id);
    });
    var al = document.querySelector('.vn-link.active');
    if (al) al.scrollIntoView({ block: 'nearest' });
  });

  // ── Anchor click handler ───────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    var id  = decodeURIComponent(a.getAttribute('href').slice(1));
    var tgt = document.getElementById(id);
    if (!tgt) return;
    var sec = tgt.closest('.vs');
    if (sec && sec.classList.contains('hidden')) clearSearch();
    // iOS Safari ignores scrollIntoView() inside overflow containers with sticky
    // layout — manually scroll the .content element to the correct position.
    var scrollTo = tgt.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop - 12;
    content.scrollTo({ top: scrollTo, behavior: 'smooth' });
    closeSidebar();
  });

  // ── Search ─────────────────────────────────────────────────────────────
  var input    = document.getElementById('searchInput');
  var clearBtn = document.getElementById('searchClear');
  var countEl  = document.getElementById('searchCount');

  function escapeRe(s) {
    var r = '';
    var specials = '.*+?^${}()|[]\\';
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (specials.indexOf(c) >= 0) r += '\\';
      r += c;
    }
    return r;
  }

  function removeMarks() {
    document.querySelectorAll('mark').forEach(function (m) {
      m.replaceWith(document.createTextNode(m.textContent));
    });
  }

  function clearSearch() {
    input.value = '';
    clearBtn.style.display = 'none';
    countEl.textContent = '';
    removeMarks();
    sections.forEach(function (s) { s.classList.remove('hidden'); });
    navLinks.forEach(function (l) { l.classList.remove('hidden'); });
  }

  function highlightNode(node, re) {
    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.textContent;
      if (!re.test(text)) { re.lastIndex = 0; return; }
      re.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var last = 0, m;
      while ((m = re.exec(text)) !== null) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var mk = document.createElement('mark');
        mk.textContent = m[0];
        frag.appendChild(mk);
        last = re.lastIndex;
      }
      frag.appendChild(document.createTextNode(text.slice(last)));
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE &&
               !['SCRIPT', 'STYLE', 'INPUT'].includes(node.tagName)) {
      Array.from(node.childNodes).forEach(function (c) { highlightNode(c, re); });
    }
  }

  function doSearch(q) {
    clearBtn.style.display = q ? 'block' : 'none';
    removeMarks();
    if (!q) { clearSearch(); return; }

    var re = new RegExp(escapeRe(q), 'gi');
    var shown = 0;
    sections.forEach(function (s) {
      var match = re.test(s.textContent);
      re.lastIndex = 0;
      s.classList.toggle('hidden', !match);
      if (match) { shown++; highlightNode(s, re); re.lastIndex = 0; }
    });
    navLinks.forEach(function (l) {
      var sec = document.getElementById(l.dataset.id);
      l.classList.toggle('hidden', !sec || sec.classList.contains('hidden'));
    });
    countEl.textContent = shown + (shown === 1 ? ' seção' : ' seções');
    var first = sections.find(function (s) { return !s.classList.contains('hidden'); });
    if (first) {
      var scrollTo = first.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop - 12;
      content.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }
  }

  var debounce;
  input.addEventListener('input', function () {
    clearTimeout(debounce);
    debounce = setTimeout(function () { doSearch(input.value.trim()); }, 180);
  });
  clearBtn.addEventListener('click', function () { clearSearch(); input.focus(); });
})();
