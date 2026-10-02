import { useState } from 'react';

export interface SearchItem {
  label: string;
  sub?: string;
}

interface SearchDropdownProps {
  placeholder: string;
  items: SearchItem[];
  onSelect: (item: SearchItem) => void;
}

/** Faithful port of legacy setupSearch(): filters by substring, shows up to 30 matches. */
export function SearchDropdown({ placeholder, items, onSelect }: SearchDropdownProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const matches = items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())).slice(0, 30);

  return (
    <div className="search-dropdown">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
      />
      <div className={'search-results' + (open && matches.length > 0 ? ' open' : '')}>
        {matches.map((item) => (
          <div
            key={item.label}
            className="search-result-item"
            onClick={() => { setQuery(item.label); setOpen(false); onSelect(item); }}
          >
            {item.label}
            {item.sub && <span className="search-result-sub">{item.sub}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
