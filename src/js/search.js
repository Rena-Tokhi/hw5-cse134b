const RESULTS_LIMIT = 20;
let pagefind;
let debounceId;

async function ensurePagefind() {
  if (!pagefind) {
    pagefind = await import("/pagefind/pagefind.js");
    await pagefind.init();
  }
  return pagefind;
}

async function runSearch(query, statusEl, listEl) {
  listEl.textContent = "";

  if (!query.trim()) {
    statusEl.textContent = "";
    return;
  }

  statusEl.textContent = "Searching…";

  const pf = await ensurePagefind();
  const search = await pf.search(query);
  const results = search.results.slice(0, RESULTS_LIMIT);

  if (results.length === 0) {
    statusEl.textContent = `No results for "${query}".`;
    return;
  }

  statusEl.textContent = `${results.length} result${results.length === 1 ? "" : "s"} for "${query}".`;

  for (const result of results) {
    const data = await result.data();
    const item = document.createElement("li");

    const link = document.createElement("a");
    link.href = data.url;
    link.textContent = data.meta && data.meta.title ? data.meta.title : data.url;

    const excerpt = document.createElement("p");
    excerpt.textContent = data.excerpt.replace(/<[^>]*>/g, "");

    item.append(link, excerpt);
    listEl.appendChild(item);
  }
}

function init() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const status = document.getElementById("search-status");
  const list = document.getElementById("search-results");
  if (!form || !input || !status || !list) return;

  form.addEventListener("submit", (event) => event.preventDefault());
  input.addEventListener("input", () => {
    clearTimeout(debounceId);
    debounceId = setTimeout(() => runSearch(input.value, status, list), 200);
  });
}

init();
