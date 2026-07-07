import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const ARTICLES_FILE = path.join(ROOT_DIR, "data", "articles.json");
const INDEX_FILE = path.join(ROOT_DIR, "index.html");
const PAGE_DIR = path.join(ROOT_DIR, "page");
const PAGE_SIZE = 99;
const SITE_URL = "https://pinyu.ai";
const SLOGAN =
  "Writing is how I stop being shaped unconsciously by symbols and begin reshaping them deliberately.";
const DESCRIPTION =
  "Writing, essays, and technical notes from Pinyu on symbols, AI, software, and systems.";

async function main() {
  const articles = await readArticles();
  const pages = chunk(sortArticles(articles), PAGE_SIZE);

  if (!pages.length) {
    pages.push([]);
  }

  await removeGeneratedPages();
  await writeFile(INDEX_FILE, renderPage(pages, 1), "utf8");

  for (let pageNumber = 2; pageNumber <= pages.length; pageNumber += 1) {
    const outputDir = path.join(PAGE_DIR, String(pageNumber));
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "index.html"), renderPage(pages, pageNumber), "utf8");
  }

  console.log(`Built ${pages.length} page(s) from ${articles.length} article(s).`);
}

async function readArticles() {
  const raw = await readFile(ARTICLES_FILE, "utf8");
  const articles = JSON.parse(raw);

  if (!Array.isArray(articles)) {
    throw new Error("data/articles.json must contain an array.");
  }

  return articles.map((article, index) => normalizeArticle(article, index));
}

function normalizeArticle(article, index) {
  const title = String(article.title || "").trim();
  const url = String(article.url || "").trim();

  if (!title) {
    throw new Error(`Article at index ${index} is missing title.`);
  }

  if (!url) {
    throw new Error(`Article "${title}" is missing url.`);
  }

  return {
    title,
    subtitle: String(article.subtitle || "").trim(),
    url,
    date: String(article.date || "").trim(),
    source: String(article.source || "site").trim().toLowerCase(),
    isTech: Boolean(article.isTech),
    originalIndex: index,
  };
}

function sortArticles(articles) {
  return [...articles].sort((left, right) => {
    const leftTime = dateTime(left.date);
    const rightTime = dateTime(right.date);

    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    return left.originalIndex - right.originalIndex;
  });
}

function dateTime(value) {
  if (!value) {
    return 0;
  }

  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function chunk(items, size) {
  const pages = [];

  for (let index = 0; index < items.length; index += size) {
    pages.push(items.slice(index, index + size));
  }

  return pages;
}

async function removeGeneratedPages() {
  try {
    const entries = await readdir(PAGE_DIR, { withFileTypes: true });
    await Promise.all(
      entries
        .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
        .map((entry) => rm(path.join(PAGE_DIR, entry.name), { recursive: true, force: true }))
    );
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

function renderPage(pages, pageNumber) {
  const totalPages = pages.length;
  const articles = pages[pageNumber - 1] || [];
  const title = pageNumber === 1 ? "pinyu.ai" : `pinyu.ai - Page ${pageNumber}`;
  const canonicalPath = pageNumber === 1 ? "/" : `/page/${pageNumber}/`;
  const prevPath = pageNumber > 1 ? pageHref(pageNumber - 1) : "";
  const nextPath = pageNumber < totalPages ? pageHref(pageNumber + 1) : "";

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${escapeAttribute(DESCRIPTION)}">
<title>${escapeHtml(title)}</title>
<link rel="canonical" href="${SITE_URL}${canonicalPath}">
${prevPath ? `<link rel="prev" href="${SITE_URL}${prevPath}">` : ""}
${nextPath ? `<link rel="next" href="${SITE_URL}${nextPath}">` : ""}
<link rel="stylesheet" href="/fonts/fonts.css">
<style>
  :root {
    --bg: #FAF6EE;
    --surface: #FFFFFF;
    --text-1: #1F1B17;
    --text-2: #6B6256;
    --text-3: #7C7466;
    --line: rgba(31, 27, 23, 0.08);
    --line-strong: rgba(31, 27, 23, 0.14);
    --accent: #C84A2E;
    --serif: 'EB Garamond', 'Songti SC', Georgia, serif;
    --sans: 'Inter', -apple-system, 'PingFang SC', 'Noto Sans SC', sans-serif;
    --mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
    /* Type scale: 24 / 17 / 14 / 12 */
    --fs-display: 1.5rem;
    --fs-title: 1.0625rem;
    --fs-body: 0.875rem;
    --fs-meta: 0.75rem;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: var(--sans);
    background: var(--bg);
    color: var(--text-1);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  ::selection {
    background: rgba(200, 74, 46, 0.14);
  }

  .page {
    width: 100%;
    max-width: 620px;
    flex: 1;
    margin: 0 auto;
    padding: max(80px, 12vh) 32px 96px;
    animation: enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes enter {
    from { opacity: 0; transform: translateY(6px); }
  }

  .identity {
    margin-bottom: 40px;
  }

  .wordmark {
    font-family: var(--serif);
    font-size: var(--fs-display);
    font-weight: 400;
    line-height: 1;
    color: var(--text-1);
  }

  .wordmark .dot { color: var(--accent); }

  .lede {
    max-width: 50ch;
    margin-top: 12px;
    font-size: var(--fs-body);
    line-height: 1.55;
    color: var(--text-2);
    text-wrap: pretty;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 28px;
    margin-bottom: 4px;
    padding-bottom: 20px;
    font-size: var(--fs-meta);
  }

  .nav-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 4px 0;
    color: var(--text-3);
    text-decoration: none;
    background: none;
    border: 0;
    font: inherit;
    cursor: pointer;
    transition: color 0.18s ease;
  }

  .nav-item:hover { color: var(--text-1); }

  .nav-item.is-active {
    color: var(--text-1);
  }

  .links {
    position: relative;
  }

  .links-trigger {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .links-caret {
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 3px solid currentColor;
    opacity: 0.55;
    transform: translateY(1px);
    transition: opacity 0.18s ease;
  }

  .links:hover .links-caret,
  .links:focus-within .links-caret {
    opacity: 0.9;
  }

  .links-panel {
    position: absolute;
    z-index: 2;
    top: calc(100% + 6px);
    left: -14px;
    min-width: 152px;
    padding: 12px 14px;
    background: #FFFCF4;
    border: 1px solid rgba(31, 27, 23, 0.12);
    box-shadow: 0 18px 40px rgba(31, 27, 23, 0.10), 0 2px 6px rgba(31, 27, 23, 0.04);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-3px);
    transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
  }

  .links::before {
    content: '';
    position: absolute;
    top: 100%;
    left: -14px;
    right: -14px;
    height: 8px;
  }

  .links:hover .links-panel,
  .links:focus-within .links-panel {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .links-panel a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 5px 0;
    color: var(--text-2);
    font-size: var(--fs-body);
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.18s ease;
  }

  .links-panel a:hover { color: var(--accent); }

  .external-mark {
    font-size: 0.84em;
    line-height: 1;
    opacity: 0.55;
  }

  .articles { list-style: none; }

  .articles li + li { border-top: 1px solid var(--line); }

  .articles a {
    display: block;
    padding: 18px 0;
    text-decoration: none;
    color: inherit;
  }

  .article-title {
    font-family: var(--serif);
    font-size: var(--fs-title);
    font-weight: 500;
    line-height: 1.3;
    color: var(--text-1);
    text-decoration: underline;
    text-decoration-color: transparent;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 0.22em;
    transition: text-decoration-color 0.2s ease;
  }

  .articles a:hover .article-title {
    text-decoration-color: var(--accent);
  }

  .article-marker {
    display: inline-block;
    margin-left: 0.5rem;
    font-family: var(--mono);
    font-size: 0.68em;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: var(--text-3);
    vertical-align: 0.14em;
    text-decoration: none;
  }

  .article-desc {
    max-width: 60ch;
    margin-top: 5px;
    font-size: var(--fs-body);
    color: var(--text-2);
    line-height: 1.55;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
    font-size: var(--fs-meta);
    color: var(--text-3);
  }

  .pagination a {
    color: var(--text-3);
    text-decoration: none;
    transition: color 0.18s ease;
  }

  .pagination a:hover { color: var(--text-1); }
  .pagination .disabled { opacity: 0.4; }

  .page-chip {
    min-width: 80px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .articles a:focus-visible,
  .nav-item:focus-visible,
  .links-panel a:focus-visible,
  .pagination a:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: 4px;
    border-radius: 1px;
  }

  @media (prefers-reduced-motion: reduce) {
    .page { animation: none; }
    * { transition: none !important; }
  }

  @media (max-width: 640px) {
    .page { padding: 56px 22px 72px; }

    .identity { margin-bottom: 32px; }

    .wordmark { font-size: 1.375rem; }

    .lede { margin-top: 10px; }

    .nav {
      gap: 22px;
      padding-bottom: 16px;
    }

    .articles a { padding: 16px 0; }

    .article-title { font-size: 1rem; }
  }
</style>
<script type="application/ld+json">
${jsonLd(articles, pageNumber)}
</script>
</head>
<body>
<main class="page">
  <section class="identity" aria-labelledby="site-title">
    <h1 id="site-title" class="wordmark">pinyu<span class="dot">.</span>ai</h1>
    <p class="lede">${escapeHtml(SLOGAN)}</p>
  </section>

  <nav class="nav" aria-label="Writing channels">
    <a href="/" class="nav-item is-active" aria-current="page">Writing</a>
    <div class="links">
      <button type="button" class="nav-item links-trigger" aria-haspopup="menu">Links<span class="links-caret" aria-hidden="true"></span></button>
      <div class="links-panel" role="menu">
        <a href="https://blog.pinyu.ai/" target="_blank" rel="noopener noreferrer" role="menuitem">
          <span>Blog</span>
          <span class="external-mark" aria-hidden="true">↗</span>
        </a>
        <a href="https://pinyulabs.substack.com/" target="_blank" rel="noopener noreferrer" role="menuitem">
          <span>Labs</span>
          <span class="external-mark" aria-hidden="true">↗</span>
        </a>
        <a href="https://zencat.uk/" target="_blank" rel="noopener noreferrer" role="menuitem">
          <span>ZenCat</span>
          <span class="external-mark" aria-hidden="true">↗</span>
        </a>
        <a href="https://b8zi.com/" target="_blank" rel="noopener noreferrer" role="menuitem">
          <span>先知神谕</span>
          <span class="external-mark" aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
    <a href="mailto:pinyu@fastmail.com" class="nav-item" title="pinyu@fastmail.com">Contact</a>
  </nav>

  <ol class="articles">
${articles.map(renderArticle).join("\n")}
  </ol>
${renderPagination(pageNumber, totalPages)}
</main>

<script defer src="https://cloud.umami.is/script.js" data-website-id="920ac93c-222f-4ac4-9de2-f7cf2d3de4cd"></script>
</body>
</html>
`;
}

function renderArticle(article) {
  const href = displayHref(article.url);
  const isExternal = /^https?:\/\//i.test(article.url);
  const attributes = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
  const marker = article.isTech ? ' <span class="article-marker">Tech</span>' : "";

  return `    <li class="article">
      <a href="${escapeAttribute(href)}"${attributes}>
        <h2 class="article-title">${escapeHtml(article.title)}${marker}</h2>
        ${article.subtitle ? `<p class="article-desc">${escapeHtml(article.subtitle)}</p>` : ""}
      </a>
    </li>`;
}

function renderPagination(pageNumber, totalPages) {
  if (totalPages <= 1) {
    return "";
  }

  const prev = pageNumber > 1
    ? `<a href="${pageHref(pageNumber - 1)}">← Newer</a>`
    : '<span class="disabled">← Newer</span>';
  const next = pageNumber < totalPages
    ? `<a href="${pageHref(pageNumber + 1)}">Older →</a>`
    : '<span class="disabled">Older →</span>';

  return `
  <nav class="pagination" aria-label="Pagination">
    <span>${prev}</span>
    <span class="page-chip">${pageNumber} / ${totalPages}</span>
    <span>${next}</span>
  </nav>`;
}

function pageHref(pageNumber) {
  return pageNumber === 1 ? "/" : `/page/${pageNumber}/`;
}

function displayHref(url) {
  if (/^https?:\/\//i.test(url) || url.startsWith("/")) {
    return url;
  }

  return `/${url}`;
}

function jsonLd(articles, pageNumber) {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageNumber === 1 ? "pinyu.ai articles" : `pinyu.ai articles page ${pageNumber}`,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(article.url),
      name: article.title,
    })),
  };

  return JSON.stringify(itemList, null, 2).replace(/<\/script/gi, "<\\/script");
}

function absoluteUrl(url) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `${SITE_URL}${displayHref(url)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
