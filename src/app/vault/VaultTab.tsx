import { Fragment, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { entries, loadNote, loadSearchText } from 'virtual:vault-index';
import type { VaultEntry, VaultSearchEntry } from 'virtual:vault-index';
import { containsMatch, highlightMatches, searchPattern } from './highlight';
import { noteHash, useVaultRoute } from './route';
import './vault.css';

type Tab = 'jogador' | 'narrador';
type SidebarEntry =
  | { kind: 'link'; entry: VaultEntry }
  | { kind: 'group'; name: string; children: VaultEntry[] };

interface SearchResult {
  entry: VaultEntry;
  headingId?: string;
  headingText?: string;
  score: number;
}

const SEARCH_DELAY_MS = 180;
const TITLE_SCORE = 1000;
const HEADING_SCORE = 500;
const MAX_COUNTED_MATCHES = 200;
const BACK_TO_TOP_THRESHOLD = 400;
const TAB_STORAGE_KEY = 'vault-tab';
const TAB_LABELS: Record<Tab, string> = { jogador: 'Jogador', narrador: 'Narrador' };
const PART_LABELS = { base: 'Livro base', extras: 'Livros extras' } as const;

function buildSidebarEntries(list: VaultEntry[]): SidebarEntry[] {
  const result: SidebarEntry[] = [];
  for (const entry of list) {
    if (!entry.group) {
      result.push({ kind: 'link', entry });
      continue;
    }
    const last = result[result.length - 1];
    if (last?.kind === 'group' && last.name === entry.group) last.children.push(entry);
    else result.push({ kind: 'group', name: entry.group, children: [entry] });
  }
  return result;
}

const partOf = (item: SidebarEntry) => (item.kind === 'link' ? item.entry.part : item.children[0].part);

function countMatches(text: string, pattern: RegExp): number {
  pattern.lastIndex = 0;
  let count = 0;
  while (count < MAX_COUNTED_MATCHES && pattern.exec(text)) count++;
  pattern.lastIndex = 0;
  return count;
}

function rankResults(list: VaultEntry[], texts: Record<string, VaultSearchEntry>, pattern: RegExp): SearchResult[] {
  const results: SearchResult[] = [];
  for (const entry of list) {
    const indexed = texts[entry.id];
    const count = indexed ? countMatches(indexed.text, pattern) : 0;
    const titleHit = containsMatch(entry.title, pattern);
    const headingHit = indexed?.headings.find((heading) => containsMatch(heading.text, pattern));
    if (!count && !titleHit && !headingHit) continue;
    const score = (titleHit ? TITLE_SCORE : 0) + (headingHit ? HEADING_SCORE : 0) + count;
    results.push({ entry, headingId: headingHit?.id, headingText: headingHit?.text, score });
  }
  return results.sort((first, second) => second.score - first.score);
}

const resultHash = (result: SearchResult) => noteHash(result.entry.id, result.headingId);

function readStoredTab(): Tab {
  try {
    return localStorage.getItem(TAB_STORAGE_KEY) === 'narrador' ? 'narrador' : 'jogador';
  } catch {
    return 'jogador';
  }
}

const NoteHtml = memo(function NoteHtml({ html, pattern }: { html: string; pattern: RegExp | null }) {
  const container = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = container.current;
    if (!element) return;
    element.innerHTML = html;
    if (pattern) highlightMatches(element, pattern);
  }, [html, pattern]);
  return <div ref={container} />;
});

export function VaultTab() {
  const route = useVaultRoute();
  const searchInput = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>(readStoredTab);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [texts, setTexts] = useState<Record<string, VaultSearchEntry> | null>(null);
  const [loaded, setLoaded] = useState<{ id: string; html: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [showBackToTop, setShowBackToTop] = useState(false);

  const tabEntries = useMemo(() => entries.filter((entry) => tab === 'narrador' || entry.audience === 'jogador'), [tab]);
  const requested = entries.find((entry) => entry.id === route.noteId);
  const activeEntry = requested ?? tabEntries[0];
  const activeId = activeEntry?.id;

  const pattern = useMemo(() => (search ? searchPattern(search) : null), [search]);

  const results = useMemo(() => (pattern && texts ? rankResults(tabEntries, texts, pattern) : null), [pattern, texts, tabEntries]);
  const sidebarEntries = useMemo(() => buildSidebarEntries(tabEntries), [tabEntries]);
  const lastNavigatedSearch = useRef('');

  const chooseTab = useCallback((next: Tab) => {
    setTab(next);
    try {
      localStorage.setItem(TAB_STORAGE_KEY, next);
    } catch {
      return;
    }
  }, []);

  const clearSearch = () => {
    setQuery('');
    setSearch('');
  };

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (search && !texts) loadSearchText().then(setTexts);
  }, [search, texts]);

  useEffect(() => {
    if (requested?.audience === 'narrador' && tab === 'jogador') chooseTab('narrador');
  }, [requested, tab, chooseTab]);

  useEffect(() => {
    if (!search) lastNavigatedSearch.current = '';
    if (!results || results.length === 0 || lastNavigatedSearch.current === search) return;
    lastNavigatedSearch.current = search;
    window.location.hash = resultHash(results[0]);
  }, [results, search]);

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    loadNote(activeId).then((html) => {
      if (!cancelled) setLoaded({ id: activeId, html });
    });
    return () => { cancelled = true; };
  }, [activeId]);

  const isNoteReady = loaded !== null && loaded.id === activeId;

  useLayoutEffect(() => {
    if (!isNoteReady) return;
    const target = route.anchor ? document.getElementById(route.anchor) : null;
    const firstMatch = pattern ? document.querySelector('.vault-note mark') : null;
    if (target) target.scrollIntoView({ block: 'start' });
    else if (firstMatch) firstMatch.scrollIntoView({ block: 'center' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [isNoteReady, activeId, route.anchor, pattern]);

  useEffect(() => {
    const group = activeEntry?.group;
    if (group) setOpenGroups((groups) => (groups.has(group) ? groups : new Set(groups).add(group)));
  }, [activeEntry]);

  useEffect(() => {
    document.querySelector('.vault-link.active')?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  useEffect(() => {
    const follow = () => setShowBackToTop(window.scrollY > BACK_TO_TOP_THRESHOLD);
    window.addEventListener('scroll', follow, { passive: true });
    return () => window.removeEventListener('scroll', follow);
  }, []);

  const toggleGroup = (name: string) =>
    setOpenGroups((groups) => {
      const next = new Set(groups);
      if (!next.delete(name)) next.add(name);
      return next;
    });

  const countLabel = (() => {
    if (!search) return '';
    if (!results) return 'Buscando…';
    return results.length + (results.length === 1 ? ' nota' : ' notas');
  })();

  const renderLink = (entry: VaultEntry, nested: boolean) => (
    <a
      key={entry.id}
      className={'vault-link' + (nested ? ' nested' : '') + (entry.id === activeId ? ' active' : '')}
      href={noteHash(entry.id)}
      onClick={() => setSidebarOpen(false)}
    >
      {entry.label ?? entry.title}
    </a>
  );

  const renderResult = (result: SearchResult) => (
    <a
      key={result.entry.id}
      className={'vault-link vault-result' + (result.entry.id === activeId ? ' active' : '')}
      href={resultHash(result)}
      onClick={() => setSidebarOpen(false)}
    >
      <span className="vault-result-title">{result.entry.title}</span>
      {result.headingText && <span className="vault-result-heading">{result.headingText}</span>}
    </a>
  );

  return (
    <div className="vault">
      <div className={'vault-overlay' + (sidebarOpen ? ' open' : '')} onClick={() => setSidebarOpen(false)} />

      <nav className={'vault-sidebar' + (sidebarOpen ? ' open' : '')}>
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
        {results && results.map(renderResult)}
        {!results && sidebarEntries.map((item, index) => {
          const previous = sidebarEntries[index - 1];
          const partHeading = (!previous || partOf(previous) !== partOf(item)) && <div className="vault-part">{PART_LABELS[partOf(item)]}</div>;
          if (item.kind === 'link') return <Fragment key={item.entry.id}>{partHeading}{renderLink(item.entry, false)}</Fragment>;
          const isOpen = openGroups.has(item.name);
          const hasActive = item.children.some((child) => child.id === activeId);
          return (
            <Fragment key={item.name}>
              {partHeading}
              <div className="vault-group">
                <button
                  type="button"
                  className={'vault-group-head' + (hasActive ? ' has-active' : '')}
                  aria-expanded={isOpen}
                  onClick={() => toggleGroup(item.name)}
                >
                  <span className="vault-caret">{isOpen ? '▾' : '▸'}</span>
                  {item.name}
                </button>
                {isOpen && item.children.map((child) => renderLink(child, true))}
              </div>
            </Fragment>
          );
        })}
      </nav>

      <div className="vault-main">
        <div className="vault-toolbar">
          <button type="button" className="vault-menu" onClick={() => setSidebarOpen((isOpen) => !isOpen)}>☰ Notas</button>
          <input
            ref={searchInput}
            className="vault-search"
            type="text"
            placeholder="Buscar nas mecânicas…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button type="button" className="vault-search-clear" title="Limpar" onClick={() => { clearSearch(); searchInput.current?.focus(); }}>
              ✕
            </button>
          )}
          <span className="vault-count">{countLabel}</span>
        </div>

        <article className="vault-note">
          {isNoteReady && loaded ? <NoteHtml html={loaded.html} pattern={pattern} /> : <p className="vault-loading">Carregando…</p>}
          {results && results.length === 0 && <p className="vault-loading">Nenhuma nota encontrada.</p>}
        </article>
      </div>

      <button
        type="button"
        className={'vault-back-to-top' + (showBackToTop ? ' visible' : '')}
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
}
