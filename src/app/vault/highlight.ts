const SKIPPED_TAGS = ['SCRIPT', 'STYLE', 'INPUT'];

export function searchPattern(query: string): RegExp {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped, 'gi');
}

export function containsMatch(text: string, pattern: RegExp): boolean {
  pattern.lastIndex = 0;
  const found = pattern.test(text);
  pattern.lastIndex = 0;
  return found;
}

export function removeHighlights(root: HTMLElement) {
  root.querySelectorAll('mark').forEach((mark) => mark.replaceWith(document.createTextNode(mark.textContent || '')));
  root.normalize();
}

function highlightText(textNode: Text, pattern: RegExp) {
  const text = textNode.textContent || '';
  if (!containsMatch(text, pattern)) return;

  const fragment = document.createDocumentFragment();
  let lastEnd = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    fragment.appendChild(document.createTextNode(text.slice(lastEnd, start)));
    const mark = document.createElement('mark');
    mark.textContent = match[0];
    fragment.appendChild(mark);
    lastEnd = start + match[0].length;
  }
  fragment.appendChild(document.createTextNode(text.slice(lastEnd)));
  textNode.replaceWith(fragment);
}

export function highlightMatches(node: Node, pattern: RegExp) {
  if (node.nodeType === Node.TEXT_NODE) {
    highlightText(node as Text, pattern);
    return;
  }
  const isElement = node.nodeType === Node.ELEMENT_NODE;
  if (isElement && !SKIPPED_TAGS.includes((node as Element).tagName)) {
    Array.from(node.childNodes).forEach((child) => highlightMatches(child, pattern));
  }
}
