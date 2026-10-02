import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import sections from 'virtual:vault-sections';
import { containsMatch, highlightMatches, removeHighlights, searchPattern } from './highlight';

const SEARCH_DELAY_MS = 180;
const ACTIVE_SECTION_OFFSET = 80;
const SCROLL_MARGIN = 12;

const NoteHtml = memo(function NoteHtml({ html }: { html: string }) {
  const container = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (container.current) container.current.innerHTML = html;
  }, [html]);
  return <div ref={container} />;
});

const sectionElements = (content: HTMLElement) => Array.from(content.querySelectorAll<HTMLElement>('section.vs'));

export function VaultApp() {
  const content = useRef<HTMLElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const pendingScrollTarget = useRef<Element | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const scrollTo = useCallback((target: Element) => {
    const pane = content.current;
    if (!pane) return;
    const top = target.getBoundingClientRect().top - pane.getBoundingClientRect().top + pane.scrollTop - SCROLL_MARGIN;
    pane.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setSearch('');
  }, []);

  useEffect(() => {
    if (!pendingScrollTarget.current) return;
    scrollTo(pendingScrollTarget.current);
    pendingScrollTarget.current = null;
  }, [hiddenIds, scrollTo]);

  useEffect(() => {
    const pane = content.current;
    if (!pane) return;
    removeHighlights(pane);
    if (!search) {
      setHiddenIds(new Set());
      return;
    }

    const pattern = searchPattern(search);
    const hidden = new Set<string>();
    for (const section of sectionElements(pane)) {
      if (containsMatch(section.textContent || '', pattern)) highlightMatches(section, pattern);
      else hidden.add(section.id);
    }
    setHiddenIds(hidden);

    const firstMatch = sections.find((section) => !hidden.has(section.id));
    const firstElement = firstMatch && document.getElementById(firstMatch.id);
    if (firstElement) requestAnimationFrame(() => scrollTo(firstElement));
  }, [search, scrollTo]);

  const followScroll = () => {
    const pane = content.current;
    if (!pane) return;
    const threshold = pane.scrollTop + ACTIVE_SECTION_OFFSET;
    let current = sections[0]?.id;
    for (const section of sectionElements(pane)) {
      if (!section.classList.contains('hidden') && section.offsetTop <= threshold) current = section.id;
    }
    if (current !== activeId) setActiveId(current);
  };

  useEffect(() => {
    document.querySelector('.vn-link.active')?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  useEffect(() => {
    const goToAnchor = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.('a[href^="#"]');
      if (!link) return;
      event.preventDefault();
      const target = document.getElementById(decodeURIComponent(link.getAttribute('href')!.slice(1)));
      if (!target) return;

      const isInHiddenSection = target.closest('.vs')?.classList.contains('hidden');
      if (isInHiddenSection) {
        pendingScrollTarget.current = target;
        clearSearch();
      } else {
        scrollTo(target);
      }
      setSidebarOpen(false);
    };
    document.addEventListener('click', goToAnchor);
    return () => document.removeEventListener('click', goToAnchor);
  }, [clearSearch, scrollTo]);

  const visibleCount = sections.length - hiddenIds.size;
  const countLabel = search ? visibleCount + (visibleCount === 1 ? ' seção' : ' seções') : '';
  const hiddenClass = (id: string) => (hiddenIds.has(id) ? ' hidden' : '');

  return (
    <>
      <div className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen((isOpen) => !isOpen)}>&#9776;</button>
        <span className="tb-title">Vault &mdash; VTM 5e &middot; Mec&acirc;nicas</span>
        <a className="tb-back" href="../index.html">&larr; Ficha</a>
      </div>

      <div className="search-bar">
        <input
          ref={searchInput}
          className="search-input"
          type="text"
          placeholder="Buscar nas mecânicas…"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          className="search-clear"
          title="Limpar"
          style={{ display: query ? 'block' : 'none' }}
          onClick={() => { clearSearch(); searchInput.current?.focus(); }}
        >
          &#x2715;
        </button>
        <span className="search-count">{countLabel}</span>
      </div>

      <div className={'overlay' + (sidebarOpen ? ' open' : '')} onClick={() => setSidebarOpen(false)} />

      <div className="layout">
        <nav className={'sidebar' + (sidebarOpen ? ' open' : '')}>
          <div className="sidebar-head">Mec&#226;nicas</div>
          {sections.map((section) => (
            <a
              key={section.id}
              className={'vn-link' + (section.id === activeId ? ' active' : '') + hiddenClass(section.id)}
              href={'#' + section.id}
              data-id={section.id}
            >
              {section.title}
            </a>
          ))}
        </nav>

        <main className="content" ref={content} onScroll={followScroll}>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className={'vs' + hiddenClass(section.id)} data-title={section.title}>
              <NoteHtml html={section.html} />
            </section>
          ))}
        </main>
      </div>
    </>
  );
}
