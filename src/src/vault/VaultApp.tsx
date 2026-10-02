import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import sections from 'virtual:vault-sections';

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function removeMarks(root: HTMLElement) {
  root.querySelectorAll('mark').forEach((m) => m.replaceWith(document.createTextNode(m.textContent || '')));
  root.normalize();
}

function highlightNode(node: Node, re: RegExp) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    re.lastIndex = 0;
    if (!re.test(text)) { re.lastIndex = 0; return; }
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const mk = document.createElement('mark');
      mk.textContent = m[0];
      frag.appendChild(mk);
      last = re.lastIndex;
    }
    frag.appendChild(document.createTextNode(text.slice(last)));
    (node as ChildNode).replaceWith(frag);
  } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'INPUT'].includes((node as Element).tagName)) {
    Array.from(node.childNodes).forEach((c) => highlightNode(c, re));
  }
}

/**
 * Note HTML is injected once through a ref, so React never owns these children and
 * re-renders (e.g. toggling `.hidden` on the section) can't wipe the search <mark>s.
 */
const SectionBody = memo(function SectionBody({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) ref.current.innerHTML = html;
  }, [html]);
  return <div ref={ref} />;
});

export function VaultApp() {
  const contentRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [active, setActive] = useState(sections[0]?.id);

  const scrollContentTo = useCallback((el: Element) => {
    const content = contentRef.current;
    if (!content) return;
    // iOS Safari ignores scrollIntoView() inside overflow containers with sticky
    // layout — manually scroll the .content element to the correct position.
    const top = el.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop - 12;
    content.scrollTo({ top, behavior: 'smooth' });
  }, []);

  // Debounced search input.
  useEffect(() => {
    const t = setTimeout(() => setSearch(query.trim()), 180);
    return () => clearTimeout(t);
  }, [query]);

  // Filter sections and highlight matches.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    removeMarks(content);
    if (!search) { setHidden(new Set()); return; }
    const re = new RegExp(escapeRe(search), 'gi');
    const nextHidden = new Set<string>();
    content.querySelectorAll<HTMLElement>('section.vs').forEach((s) => {
      re.lastIndex = 0;
      if (re.test(s.textContent || '')) highlightNode(s, re);
      else nextHidden.add(s.id);
    });
    setHidden(nextHidden);
    const first = sections.find((s) => !nextHidden.has(s.id));
    if (first) requestAnimationFrame(() => { const el = document.getElementById(first.id); if (el) scrollContentTo(el); });
  }, [search, scrollContentTo]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setSearch('');
  }, []);

  // Active sidebar link follows the scroll position.
  const onScroll = () => {
    const content = contentRef.current;
    if (!content) return;
    const offset = content.scrollTop + 80;
    let cur = sections[0]?.id;
    content.querySelectorAll<HTMLElement>('section.vs').forEach((s) => {
      if (!s.classList.contains('hidden') && s.offsetTop <= offset) cur = s.id;
    });
    if (cur !== active) setActive(cur);
  };

  // Keep the active sidebar link visible.
  useEffect(() => {
    document.querySelector('.vn-link.active')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  // In-page anchors (sidebar + wiki links inside the notes) scroll the content pane.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const id = decodeURIComponent(a.getAttribute('href')!.slice(1));
      const tgt = document.getElementById(id);
      if (!tgt) return;
      const sec = tgt.closest('.vs');
      if (sec?.classList.contains('hidden')) {
        clearSearch();
        requestAnimationFrame(() => scrollContentTo(tgt));
      } else {
        scrollContentTo(tgt);
      }
      setSidebarOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [clearSearch, scrollContentTo]);

  const shown = sections.length - hidden.size;

  return (
    <>
      <div className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen((o) => !o)}>&#9776;</button>
        <span className="tb-title">Vault &mdash; VTM 5e &middot; Mec&acirc;nicas</span>
        <a className="tb-back" href="../index.html">&larr; Ficha</a>
      </div>

      <div className="search-bar">
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Buscar nas mecânicas…"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="search-clear"
          title="Limpar"
          style={{ display: query ? 'block' : 'none' }}
          onClick={() => { clearSearch(); inputRef.current?.focus(); }}
        >
          &#x2715;
        </button>
        <span className="search-count">{search ? shown + (shown === 1 ? ' seção' : ' seções') : ''}</span>
      </div>

      <div className={'overlay' + (sidebarOpen ? ' open' : '')} onClick={() => setSidebarOpen(false)} />

      <div className="layout">
        <nav className={'sidebar' + (sidebarOpen ? ' open' : '')}>
          <div className="sidebar-head">Mec&#226;nicas</div>
          {sections.map((s) => (
            <a
              key={s.id}
              className={'vn-link' + (s.id === active ? ' active' : '') + (hidden.has(s.id) ? ' hidden' : '')}
              href={'#' + s.id}
              data-id={s.id}
            >
              {s.title}
            </a>
          ))}
        </nav>
        <main className="content" ref={contentRef} onScroll={onScroll}>
          {sections.map((s) => (
            <section key={s.id} id={s.id} className={'vs' + (hidden.has(s.id) ? ' hidden' : '')} data-title={s.title}>
              <SectionBody html={s.html} />
            </section>
          ))}
        </main>
      </div>
    </>
  );
}
