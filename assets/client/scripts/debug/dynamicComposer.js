(() => {
  const cache = new Map();

  async function fetchText(url) {
    if (cache.has(url)) return cache.get(url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const text = await res.text();
    cache.set(url, text);
    return text;
  }

  async function processIncludes(root = document, base = document.baseURI, depth = 0) {
    if (depth > 10) throw new Error('Max include depth exceeded (circular include?)');

    const nodes = Array.from(root.querySelectorAll('[include-html]'));
    if (!nodes.length) return;

    for (const el of nodes) {
      const fileAttr = el.getAttribute('include-html');
      const url = new URL(fileAttr, base).href;

      try {
        let html = await fetchText(url);
        // прибрати будь-які <script> з фрагмента
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        const tmp = document.createElement('div');
        tmp.innerHTML = html;

        // ПРОПИСУЄМО абсолютні шляхи для вкладених include відносно поточного файлу
        for (const child of tmp.querySelectorAll('[include-html]')) {
          const childPath = child.getAttribute('include-html');
          child.setAttribute('include-html', new URL(childPath, url).href);
        }

        const parent = el.parentNode;
        while (tmp.firstChild) parent.insertBefore(tmp.firstChild, el);
        parent.removeChild(el);
      } catch (err) {
        el.outerHTML = `<div style="color:red">Помилка завантаження "${fileAttr}": ${err.message}</div>`;
      }
    }

    // опрацьовуємо наступний рівень вкладеності
    await processIncludes(root, base, depth + 1);

    // корисно кинути подію, щоб ініціалізувати JS у вставлених блоках
    document.dispatchEvent(new CustomEvent('includes:loaded', { detail: { depth } }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    processIncludes().catch(console.error);
  });
})();
