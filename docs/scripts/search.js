import Fuse from "https://esm.sh/fuse.js@6.6.2";

function initSearch(container) {
  const input = container.querySelector('input');
  const results = container.querySelector('[data-results]');
  const dataNode = container.querySelector('[data-search-entries]');
  const entries = JSON.parse(dataNode?.textContent ?? "[]");
  dataNode?.remove();

  const fuse = new Fuse(entries, {
    includeScore: true,
    keys: ["state", "city"],
    threshold: 0.3,
  });

  const renderResults = (items) => {
    if (!results) return;
    results.innerHTML = '';
    if (!items.length) {
      results.classList.add('hidden');
      return;
    }
    items.slice(0, 6).forEach((item) => {
      const li = document.createElement('li');
      li.className = 'border-b last:border-none border-slate-100';
      const link = document.createElement('a');
      link.href = item.item.href;
      link.textContent = `${item.item.city}, ${item.item.state}`;
      link.className = 'block px-5 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700';
      li.appendChild(link);
      results.appendChild(li);
    });
    results.classList.remove('hidden');
  };

  input?.addEventListener('input', (event) => {
    const value = (event.target?.value ?? '').trim();
    if (!value) {
      results?.classList.add('hidden');
      results.innerHTML = '';
      return;
    }
    const matches = fuse.search(value);
    renderResults(matches);
  });

  results?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      results.classList.add('hidden');
    }
  });
}

function initAll() {
  document.querySelectorAll('[data-search]')
    .forEach((container) => initSearch(container));
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

