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

const MAX_RESULTS = 30;

export function SearchDropdown({ placeholder, items, onSelect }: SearchDropdownProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const matches = items
    .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, MAX_RESULTS);

  const choose = (item: SearchItem) => {
    setQuery(item.label);
    setOpen(false);
    onSelect(item);
  };

  const resultsClass = 'search-results' + (open && matches.length > 0 ? ' open' : '');

  return (
    <div className="search-dropdown">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
      />
      <div className={resultsClass}>
        {matches.map((item) => (
          <div key={item.label} className="search-result-item" onClick={() => choose(item)}>
            {item.label}
            {item.sub && <span className="search-result-sub">{item.sub}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
