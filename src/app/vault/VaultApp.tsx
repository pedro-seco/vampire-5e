import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import sections from 'virtual:vault-sections';
import { containsMatch, highlightMatches, removeHighlights, searchPattern } from './highlight';

const SEARCH_DELAY_MS = 180;
const ACTIVE_SECTION_OFFSET = 80;
const SCROLL_MARGIN = 12;
const BACK_TO_TOP_THRESHOLD = 400;

const NoteHtml = memo(function NoteHtml({ html }: { html: string }) {
  const container = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (container.current) container.current.innerHTML = html;
  }, [html]);
  return <div ref={container} />;
});

type SidebarEntry =
  | { kind: 'link'; section: (typeof sections)[number] }
  | { kind: 'group'; name: string; children: (typeof sections)[number][] };

type Tab = 'jogador' | 'narrador';

const TAB_STORAGE_KEY = 'vault-tab';
const TAB_LABELS: Record<Tab, string> = { jogador: 'Jogador', narrador: 'Narrador' };

const isNarratorOnly = (section: (typeof sections)[number]) => section.audience === 'narrador';

function buildSidebarEntries(list: typeof sections): SidebarEntry[] {
  const entries: SidebarEntry[] = [];
  for (const section of list) {
    if (!section.group) {
      entries.push({ kind: 'link', section });
      continue;
    }
    const last = entries[entries.length - 1];
    if (last?.kind === 'group' && last.name === section.group) last.children.push(section);
    else entries.push({ kind: 'group', name: section.group, children: [section] });
  }
  return entries;
}

function readStoredTab(): Tab {
  try {
    return localStorage.getItem(TAB_STORAGE_KEY) === 'narrador' ? 'narrador' : 'jogador';
  } catch {
    return 'jogador';
  }
}

const sectionElements = (content: HTMLElement) => Array.from(content.querySelectorAll<HTMLElement>('section.vs'));

export function VaultApp() {
  const content = useRef<HTMLElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [tab, setTab] = useState<Tab>(readStoredTab);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const pendingScrollTarget = useRef<Element | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const isOutsideTab = useCallback((section: (typeof sections)[number]) => tab === 'jogador' && isNarratorOnly(section), [tab]);
  const tabSections = useMemo(() => sections.filter((section) => !isOutsideTab(section)), [isOutsideTab]);
  const sidebarEntries = useMemo(() => buildSidebarEntries(tabSections), [tabSections]);

  const chooseTab = useCallback((next: Tab) => {
    setTab(next);
    try {
      localStorage.setItem(TAB_STORAGE_KEY, next);
    } catch {
      return;
    }
  }, []);

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
  }, [hiddenIds, scrollTo, tab]);

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
    const outsideIds = new Set(sections.filter(isOutsideTab).map((section) => section.id));
    for (const section of sectionElements(pane)) {
      if (!outsideIds.has(section.id) && containsMatch(section.textContent || '', pattern)) highlightMatches(section, pattern);
      else hidden.add(section.id);
    }
    setHiddenIds(hidden);

    const firstMatch = sections.find((section) => !hidden.has(section.id));
    const firstElement = firstMatch && document.getElementById(firstMatch.id);
    if (firstElement) requestAnimationFrame(() => scrollTo(firstElement));
  }, [search, scrollTo, isOutsideTab]);

  const followScroll = () => {
    const pane = content.current;
    if (!pane) return;
    setShowBackToTop(pane.scrollTop > BACK_TO_TOP_THRESHOLD);
    const threshold = pane.scrollTop + ACTIVE_SECTION_OFFSET;
    let current = sections[0]?.id;
    for (const section of sectionElements(pane)) {
      if (!section.classList.contains('hidden') && section.offsetTop <= threshold) current = section.id;
    }
    if (current !== activeId) setActiveId(current);
  };

  useEffect(() => {
    const activeGroup = sections.find((section) => section.id === activeId)?.group;
    if (activeGroup) setOpenGroups((groups) => (groups.has(activeGroup) ? groups : new Set(groups).add(activeGroup)));
  }, [activeId]);

  const toggleGroup = (name: string) =>
    setOpenGroups((groups) => {
      const next = new Set(groups);
      if (!next.delete(name)) next.add(name);
      return next;
    });

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

      const owner = sections.find((section) => section.id === target.closest('.vs')?.id);
      if (owner && isNarratorOnly(owner) && tab === 'jogador') {
        pendingScrollTarget.current = target;
        chooseTab('narrador');
        setSidebarOpen(false);
        return;
      }
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
  }, [chooseTab, clearSearch, scrollTo, tab]);

  const visibleCount = tabSections.filter((section) => !hiddenIds.has(section.id)).length;
  const countLabel = search ? visibleCount + (visibleCount === 1 ? ' seção' : ' seções') : '';
  const hiddenClass = (section: (typeof sections)[number]) => (hiddenIds.has(section.id) || isOutsideTab(section) ? ' hidden' : '');

  const renderLink = (section: (typeof sections)[number], nested: boolean) => (
    <a
      key={section.id}
      className={'vn-link' + (nested ? ' nested' : '') + (section.id === activeId ? ' active' : '') + hiddenClass(section)}
      href={'#' + section.id}
      data-id={section.id}
    >
      {section.label ?? section.title}
    </a>
  );

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
          <div className="vault-tabs" role="tablist">
            {(Object.keys(TAB_LABELS) as Tab[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className={'vault-tab' + (tab === key ? ' active' : '')}
                onClick={() => chooseTab(key)}
              >
                {TAB_LABELS[key]}
              </button>
            ))}
          </div>
          {sidebarEntries.map((entry) => {
            if (entry.kind === 'link') return renderLink(entry.section, false);
            const allHidden = entry.children.every((child) => hiddenIds.has(child.id));
            const isOpen = openGroups.has(entry.name) || Boolean(search);
            const hasActive = entry.children.some((child) => child.id === activeId);
            return (
              <div key={entry.name} className={'vn-group' + (allHidden ? ' hidden' : '')}>
                <button
                  type="button"
                  className={'vn-group-head' + (hasActive ? ' has-active' : '')}
                  aria-expanded={isOpen}
                  onClick={() => toggleGroup(entry.name)}
                >
                  <span className="vn-caret">{isOpen ? '▾' : '▸'}</span>
                  {entry.name}
                </button>
                {isOpen && entry.children.map((child) => renderLink(child, true))}
              </div>
            );
          })}
        </nav>

        <main className="content" ref={content} onScroll={followScroll}>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className={'vs' + hiddenClass(section)} data-title={section.title}>
              <NoteHtml html={section.html} />
            </section>
          ))}
        </main>
      </div>

      <button
        type="button"
        className={'back-to-top' + (showBackToTop ? ' visible' : '')}
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
        onClick={() => content.current?.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        &#8593;
      </button>
    </>
  );
}
