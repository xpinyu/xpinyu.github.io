import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const ARTICLES_FILE = path.join(ROOT_DIR, "data", "articles.json");

const FEEDS = [
  {
    url: "https://blog.pinyu.ai/feed",
    source: "blog",
    isTech: false,
  },
  {
    url: "https://pinyulabs.substack.com/feed",
    source: "labs",
    isTech: true,
  },
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
});

async function main() {
  const existingArticles = await readArticles();
  const seenUrls = new Set(existingArticles.map((article) => normalizeUrl(article.url)));
  const importedArticles = [];

  for (const feed of FEEDS) {
    const articles = await readFeed(feed);

    for (const article of articles) {
      const key = normalizeUrl(article.url);

      if (seenUrls.has(key)) {
        continue;
      }

      seenUrls.add(key);
      importedArticles.push(article);
    }
  }

  const nextArticles = sortArticles([...existingArticles, ...importedArticles]);
  await writeFile(ARTICLES_FILE, `${JSON.stringify(nextArticles, null, 2)}\n`, "utf8");

  console.log(`Imported ${importedArticles.length} new article(s).`);
}

async function readArticles() {
  const raw = await readFile(ARTICLES_FILE, "utf8");
  const articles = JSON.parse(raw);

  if (!Array.isArray(articles)) {
    throw new Error("data/articles.json must contain an array.");
  }

  return articles.map((article) => ({
    title: String(article.title || "").trim(),
    subtitle: String(article.subtitle || "").trim(),
    url: String(article.url || "").trim(),
    date: String(article.date || "").trim(),
    source: String(article.source || "site").trim().toLowerCase(),
    isTech: Boolean(article.isTech),
  }));
}

async function readFeed(feed) {
  const response = await fetch(feed.url, {
    headers: {
      "User-Agent": "pinyu.ai article sync",
      Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${feed.url}: ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  const data = parser.parse(xml);
  const items = asArray(data?.rss?.channel?.item);

  return items
    .map((item) => normalizeFeedItem(item, feed))
    .filter(Boolean);
}

function normalizeFeedItem(item, feed) {
  const url = text(item?.link || item?.guid);

  if (!isArticleUrl(url)) {
    return null;
  }

  const title = text(item?.title);

  if (!title) {
    return null;
  }

  return {
    title,
    subtitle: cleanSubtitle(text(item?.description)),
    url: stripTracking(url),
    date: toDate(text(item?.pubDate || item?.["dc:date"])),
    source: feed.source,
    isTech: feed.isTech,
  };
}

function isArticleUrl(value) {
  try {
    const url = new URL(value);
    return url.pathname.startsWith("/p/");
  } catch {
    return false;
  }
}

function stripTracking(value) {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

function normalizeUrl(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  try {
    return stripTracking(raw).toLowerCase();
  } catch {
    return raw.replace(/\/$/, "").toLowerCase();
  }
}

function cleanSubtitle(value) {
  return stripHtml(value)
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, " ");
}

function toDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function text(value) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  if (value && typeof value === "object") {
    if (typeof value["#text"] === "string") {
      return value["#text"].trim();
    }

    if (typeof value["@_href"] === "string") {
      return value["@_href"].trim();
    }
  }

  return "";
}

function asArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
}

function sortArticles(articles) {
  return articles
    .map((article, index) => ({ ...article, originalIndex: index }))
    .sort((left, right) => {
      const leftTime = dateTime(left.date);
      const rightTime = dateTime(right.date);

      if (leftTime !== rightTime) {
        return rightTime - leftTime;
      }

      return left.originalIndex - right.originalIndex;
    })
    .map(({ originalIndex, ...article }) => article);
}

function dateTime(value) {
  if (!value) {
    return 0;
  }

  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
