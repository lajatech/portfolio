/**
 * Per-character text splitting.
 *
 * Nothing here knows about scroll or React. It takes an element, rewrites its
 * text nodes into word and character spans, and hands back the character spans
 * so a caller can animate them one by one.
 *
 * Two constraints shaped the implementation:
 *
 * 1. It must be idempotent. React effects run twice in dev StrictMode, and a
 *    second split would wrap the already-wrapped spans and return garbage. The
 *    result is cached on the element itself, keyed by a WeakMap so an element
 *    that leaves the document takes its entry with it.
 *
 * 2. It must only touch text nodes. Some headings carry inline children (a
 *    shape, a <br>, a highlighted fragment) that the layout depends on, so the
 *    walk collects text nodes and leaves every element child where it is.
 */

const splitCache = new WeakMap<HTMLElement, HTMLSpanElement[]>();

/**
 * Wrap each word of `el` in `.split-w` (so a word can never break mid-way) and
 * each character in `.split-c`. Returns the character spans in document order.
 *
 * `className` is appended to every character span, for callers that want their
 * own hook without having to walk the result.
 */
export function splitChars(
  el: HTMLElement,
  className?: string,
): HTMLSpanElement[] {
  const cached = splitCache.get(el);
  if (cached) return cached;

  // collect first, mutate second: replacing nodes while the walker is live
  // would invalidate its position
  const texts: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n !== null; n = walker.nextNode()) {
    texts.push(n as Text);
  }

  const charClass = className ? `split-c ${className}` : "split-c";
  const chars: HTMLSpanElement[] = [];

  for (const node of texts) {
    const value = node.nodeValue ?? "";
    if (value === "") continue;

    const frag = document.createDocumentFragment();
    // capturing split: the separators come back as entries of their own, so
    // the original spacing is reproduced verbatim rather than normalised
    for (const token of value.split(/(\s+)/)) {
      if (token === "") continue;
      if (/^\s+$/.test(token)) {
        frag.appendChild(document.createTextNode(token));
        continue;
      }
      const word = document.createElement("span");
      word.className = "split-w";
      // Array.from, not a plain index loop: it iterates code points, so an
      // accented or non-BMP character stays one span instead of splitting
      // into broken halves
      for (const glyph of Array.from(token)) {
        const char = document.createElement("span");
        char.className = charClass;
        char.textContent = glyph;
        word.appendChild(char);
        chars.push(char);
      }
      frag.appendChild(word);
    }
    node.parentNode?.replaceChild(frag, node);
  }

  splitCache.set(el, chars);
  return chars;
}
