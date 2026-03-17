import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "data", "news");
const SOURCES_DIR = path.join(DATA_DIR, "sources");
const PAGES_DIR = path.join(DATA_DIR, "pages");
const ARCHIVE_PATH = path.join(DATA_DIR, "archive.json");
const INDEX_PATH = path.join(DATA_DIR, "index.json");

const API_URL = "https://api.x.ai/v1/responses";
const MODEL = "grok-4-1-fast-reasoning";
const PAGE_SIZE = 60;
const MAX_ARCHIVE_ITEMS = 1000;
const GENERAL_LOOKBACK_HOURS = 14;
const GENERAL_MAX_ITEMS = 10;
const GENERAL_REFRESH_HOURS = 12;
const DAILY_DIGEST_REFRESH_HOURS = 12;
const DAILY_DIGEST_MAX_ITEMS = 20;
const DAILY_DIGEST_PAGE_CHAR_LIMIT = 12_000;
const DAILY_DIGEST_FALLBACK_HOUR_UTC = 12;
const ARTIST_LOOKBACK_HOURS = 8;
const ARTIST_REFRESH_HOURS = 6;
const ARTIST_BATCH_SIZE = 8;
const ARTIST_BATCH_LIMIT = 8;
const ARTIST_MAX_CONCURRENCY = 3;
const ARTIST_MAX_ITEMS = 40;
const HANDLE_BATCH_MAX_RETRIES = 1;
const HANDLE_BATCH_RETRY_DELAY_MS = 1500;
const X_AI_SIGNALS_LOOKBACK_HOURS = 14;
const X_AI_SIGNALS_REFRESH_HOURS = 12;
const X_AI_SIGNALS_BATCH_SIZE = 8;
const X_AI_SIGNALS_BATCH_LIMIT = 8;
const X_AI_SIGNALS_MAX_CONCURRENCY = 6;
const X_AI_SIGNALS_MAX_ITEMS = 40;
const AIINDIE_LOOKBACK_HOURS = 14;
const AIINDIE_REFRESH_HOURS = 12;
const AIINDIE_BATCH_SIZE = 8;
const AIINDIE_BATCH_LIMIT = 8;
const AIINDIE_MAX_CONCURRENCY = 4;
const AIINDIE_MAX_ITEMS = 40;
const HKT_OFFSET_MS = 8 * 60 * 60 * 1000;
const TIMEZONE_NAME = "HKT";
const SOURCE_ARG_PREFIX = "--source=";
const NEWS_BOT_USER_AGENT = "Mozilla/5.0 (compatible; XPinyuNewsBot/1.0; +https://xpinyu.github.io)";
const API_KEY = process.env.XAI_API_KEY || "";
const NOW = new Date();
const RAW_ARGS = process.argv.slice(2);
const ARGS = new Set(RAW_ARGS);
const FORCE_REFRESH = ARGS.has("--force");
const REBUILD_ONLY = ARGS.has("--rebuild-only");
const REQUESTED_SOURCE_IDS = new Set(
  RAW_ARGS.filter((arg) => arg.startsWith(SOURCE_ARG_PREFIX))
    .flatMap((arg) => arg.slice(SOURCE_ARG_PREFIX.length).split(","))
    .map((value) => value.trim())
    .filter(Boolean),
);

const ARTIST_HANDLES = [
  "Samann_ai",
  "egeberkina",
  "CharaspowerAI",
  "bri_guy_ai",
  "lexx_aura",
  "rovvmut_",
  "SimplyAnnisa",
  "bananababydoll",
  "Arminn_Ai",
  "r4jjesh",
  "underwoodxie96",
  "ciguleva",
  "aitrendz_xyz",
  "umesh_ai",
  "astronomerozge1",
  "Sheldon056",
  "TechieBySA",
  "YaseenK7212",
  "LearnWithAbbay",
  "AI_for_success",
  "ClaireSilver",
  "nigewillson",
  "paultrillo",
  "karenxcheng",
  "Somnai_dreams",
  "RiversHaveWings",
  "ArtificialBob",
  "CoffeeVectors",
  "rainisto",
  "GlennIsZen",
  "nvnot_",
  "chekhov_eugene",
  "JpgVarya",
  "genekogan",
  "localghost",
  "FroggyCyborg",
  "crow8138",
  "majimagart",
  "paraxenod",
  "silver_AIArt",
  "OxWesty",
  "pressmanc",
  "MarkLalonde68",
  "Martin_G_Edits",
  "jordandchesney",
  "nhoeskape",
  "DDRMondbasis",
  "johnpanic44",
  "iamRemyz",
  "Artedeingenio",
  "hey_rushik",
  "infiniteyay",
  "mreflow",
  "remi_molettee",
  "omokage_AIsOK",
  "op7418",
  "linchen_ox",
  "MANISH1027512",
  "jesselaunz",
  "icreatelife",
  "recatm",
  "javilopen",
  "frank_8848",
  "xpg0970",
  "jayhoang92",
  "Yonghua_AI",
  "kawaii_reachan",
  "ayakapicstudio",
  "ReviAIART",
  "Niniellissime",
  "xerias_x",
  "Lordofacca",
  "midjourney",
];

const X_AI_SIGNALS_HANDLES = [
  "Gorden_Sun",
  "xiaohu",
  "shao__meng",
  "thinkingjimmy",
  "Tumeng05",
  "AxtonLiu",
  "haibun",
  "nishuang",
  "vista8",
  "lijigang",
  "kaifulee",
  "WaytoAGI",
  "xicilion",
  "oran_ge",
  "SamuelQZQ",
  "elliotchen100",
  "Hayami_kiraa",
  "berryxia",
  "lidangzzz",
  "lxfater",
  "nateleex",
  "yan5xu",
  "santiagoyoungus",
  "Cydiar404",
  "JefferyTatsuya",
  "seclink",
  "Fenng",
  "turingou",
  "tinyfool",
  "virushuo",
  "fankaishuoai",
  "XDash",
  "idoubicc",
  "CoderJeffLee",
  "tuturetom",
  "iamtonyzhu",
  "hongjun60",
  "Valley101_Qian",
  "indie_maker_fox",
  "HongyuanCao",
  "nextify2024",
  "readyfor2025",
  "weijunext",
  "JinsFavorites",
  "Junyu",
  "luoleiorg",
  "Plidezus",
  "lewangx",
  "tualatrix",
  "luinlee",
  "yupi996",
  "servasyy_ai",
  "XiaohuiAI666",
  "gefei55",
  "lyc_zh",
  "AI_Jasonyu",
  "JourneymanChina",
  "dev_afei",
  "luobogooooo",
  "GoSailGlobal",
  "chuhaiqu",
  "daluoseo",
  "realNyarime",
  "DigitalNomadLC",
  "RocM301",
  "EvaCmore",
  "shuziyimin",
  "itangtalk",
  "guishou_56",
  "9yearfish",
  "hwwaanng",
  "OwenYoungZh",
  "waylybaye",
  "randyloop",
  "livid",
  "shengxj1",
  "FinanceYF5",
  "liuyi0922",
  "fkysly",
  "zhixianio",
  "Pluvio9yte",
  "abskoop",
  "stark_nico99",
  "hongming731",
  "penny777",
  "quarktalksss",
  "Khazix0918",
  "jiqizhixin",
  "evilcos",
  "steipete",
  "kasong2048",
  "cellinlab",
  "wshuyi",
  "ruanyf",
  "Svwang1",
  "sspai_com",
  "foxshuo",
  "pongba",
  "Francis_YAO_",
  "Astronaut_1216",
  "ityouknows",
  "expatlevi",
  "karpathy",
  "sama",
  "AndrewYNg",
  "ylecun",
  "lexfridman",
  "drfeifei",
  "ID_AA_Carmack",
  "demishassabis",
  "fchollet",
  "rowancheung",
  "OfficialLoganK",
  "mattshumer_",
  "alliekmiller",
  "GaryMarcus",
  "waitin4agi_",
  "jeremyphoward",
  "KirkDBorne",
  "antgrasso",
  "Ronald_vanLoon",
  "geoffreyhinton",
  "goodfellow_ian",
  "jeffdean",
  "erikbryn",
  "thatroblennon",
  "jackfriks",
  "rileybrown",
  "corbin_braun",
  "levie",
  "hnshah",
  "jasonlk",
  "danmartell",
  "nathanlatka",
  "aprildunford",
  "Patticus",
  "MakadiaHarsh",
  "naval",
  "paulg",
  "gregisenberg",
  "vasuman",
  "0xROAS",
  "MengTo",
  "emollick",
  "kloss_xyz",
  "dotey",
  "charliebilello",
  "EricBalchunas",
  "TurnerNovak",
  "AswathDamodaran",
  "MacroAlf",
  "simonw",
  "swyx",
  "hwchase17",
  "jxnlco",
  "ggerganov",
  "rauchg",
  "searchliaison",
  "lilyraynyc",
  "brodieseo",
  "steventey",
  "RestOfWorld",
  "edzitron",
  "benthompson",
];

const AIINDIE_HANDLES = [
  "@levelsio",
  "@dannypostmaa",
  "@marclou",
  "@tdinh_me",
  "@tibo_maker",
  "@damengchen",
  "@pbteja1998",
  "@nicolaiklemke",
  "@bresslertweets",
  "@mubashariqbal",
  "@simonhoiberg",
  "@arvidkahl",
  "@yongfook",
  "@jakobgreenfeld",
  "@alexwestco",
  "@d__raptis",
  "@csallen",
  "@AndreyAzimov",
  "@TheRaymondYeh",
  "@czue",
  "@qayyumrajan",
  "@RoxCodes",
  "@inkdrop_app",
  "@maciejcupial",
  "@Pauline_Cx",
  "@marckohlbrugge",
  "@robwalling",
  "@tarareed",
  "@ollymeakings",
  "@mariemartenss",
  "@philmcp",
  "@nathanbarry",
  "@IndieHackers",
  "@ProductHunt",
  "@watreejane",
  "@ChanningAllen",
  "@goocarlos",
  "@ihower",
  "@balconychy",
  "@op7418",
  "@AlchainHust",
  "@ShouChen_",
  "@fxxkol",
  "@ruiyanghim",
  "@austinit",
  "@benshandebiao",
  "@ailiangzi",
  "@decohack",
  "@CoooolXyh",
  "@javay_hu",
  "@DLKFZWilliam",
  "@real_kai42",
  "@blankwebdev",
  "@davidchen2024",
  "@li_wujie",
  "@xiongchun007",
  "@yihui_indie",
  "@patio11",
  "@RevenueCat",
  "@PaddleHQ",
  "@appfigures",
  "@Shpigford",
];

const SOURCES = [
  {
    id: "general",
    name: "General AI News",
    type: "general",
    refreshHours: GENERAL_REFRESH_HOURS,
    fetch: fetchGeneralSource,
  },
  {
    id: "artist",
    name: "AI Artist Signals",
    type: "artist",
    refreshHours: ARTIST_REFRESH_HOURS,
    fetch: fetchArtistSource,
  },
  {
    id: "daily_ai_briefs",
    name: "Daily AI Briefs",
    type: "daily_ai_briefs",
    refreshHours: DAILY_DIGEST_REFRESH_HOURS,
    fetch: fetchDailyAiBriefsSource,
  },
  {
    id: "x_ai_signals",
    name: "X AI Signals",
    type: "x_ai_signals",
    refreshHours: X_AI_SIGNALS_REFRESH_HOURS,
    fetch: fetchXAiSignalsSource,
  },
  {
    id: "aiindie",
    name: "AI Indie Hacker Signals",
    type: "aiindie",
    refreshHours: AIINDIE_REFRESH_HOURS,
    fetch: fetchAiIndieSource,
  },
];

function resolveRequestedSourceIds() {
  if (!REQUESTED_SOURCE_IDS.size) {
    return new Set();
  }

  const availableSourceIds = new Set(SOURCES.map((source) => source.id));
  const unknownSourceIds = [...REQUESTED_SOURCE_IDS].filter((sourceId) => !availableSourceIds.has(sourceId));
  if (unknownSourceIds.length) {
    throw new Error(`Unknown source ids: ${unknownSourceIds.join(", ")}`);
  }

  return new Set(REQUESTED_SOURCE_IDS);
}

async function main() {
  await ensureDir(DATA_DIR);
  await ensureDir(SOURCES_DIR);
  await ensureDir(PAGES_DIR);

  const selectedSourceIds = resolveRequestedSourceIds();
  if (selectedSourceIds.size) {
    console.log(`[news] Refreshing selected sources only: ${[...selectedSourceIds].join(", ")}`);
  }

  const snapshots = [];
  for (const source of SOURCES) {
    if (selectedSourceIds.size && !selectedSourceIds.has(source.id)) {
      const snapshot = (await readJsonOrNull(getSnapshotPath(source.id))) || makeEmptySnapshot(source);
      snapshots.push(snapshot);
      continue;
    }

    const snapshot = await refreshSource(source);
    snapshots.push(snapshot);
  }

  const archive = await buildArchive(snapshots);
  await writeJson(ARCHIVE_PATH, {
    updated_at: archive.updated_at,
    page_size: archive.index.page_size,
    total_items: archive.index.total_items,
    sources: archive.index.sources,
    items: archive.items,
  });
  await writeJson(INDEX_PATH, archive.index);
  await writePages(archive.pages);

  console.log(
    `[news] Feed ready. items=${archive.index.total_items}, pages=${archive.index.total_pages}, updated_at=${archive.index.updated_at}`,
  );
}

async function refreshSource(source) {
  const snapshotPath = getSnapshotPath(source.id);
  const existingSnapshot = await readJsonOrNull(snapshotPath);

  if (REBUILD_ONLY) {
    return existingSnapshot || makeEmptySnapshot(source);
  }

  if (!API_KEY) {
    console.log(`[news] Missing XAI_API_KEY. Reusing snapshot for ${source.id}.`);
    const snapshot = existingSnapshot || makeEmptySnapshot(source);
    await maybeWriteInitialSnapshot(snapshotPath, existingSnapshot, snapshot);
    return snapshot;
  }

  if (!FORCE_REFRESH && isSnapshotFresh(existingSnapshot, source.refreshHours, NOW)) {
    console.log(`[news] ${source.id} snapshot is fresh. Reusing existing data.`);
    return existingSnapshot;
  }

  try {
    console.log(`[news] Refreshing source ${source.id}.`);
    const result = await source.fetch({ apiKey: API_KEY, now: NOW });
    const snapshot = {
      source: {
        id: source.id,
        name: source.name,
        type: source.type,
        refresh_hours: source.refreshHours,
        updated_at: result.updatedAt || formatHktIso(NOW),
        item_count: Array.isArray(result.items) ? result.items.length : 0,
        window_start: result.windowStart || null,
        window_end: result.windowEnd || null,
      },
      items: Array.isArray(result.items) ? result.items : [],
    };
    await writeJson(snapshotPath, snapshot);
    return snapshot;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || "Unknown source error");
    console.error(`[news] Source ${source.id} failed: ${message}`);
    const snapshot = existingSnapshot || makeEmptySnapshot(source);
    await maybeWriteInitialSnapshot(snapshotPath, existingSnapshot, snapshot);
    return snapshot;
  }
}

async function buildArchive(snapshots) {
  const existingArchive = await readJsonOrNull(ARCHIVE_PATH);
  const updatedAt = resolveFeedUpdatedAt(snapshots, existingArchive);
  const sourceUpdatedAtById = new Map(
    snapshots
      .map((snapshot) => [snapshot?.source?.id, snapshot?.source?.updated_at])
      .filter(([sourceId, sourceUpdatedAt]) => sourceId && sourceUpdatedAt),
  );
  const archiveItems = sanitizeFeedItems(
    Array.isArray(existingArchive?.items) ? existingArchive.items : [],
    sourceUpdatedAtById,
    updatedAt,
  );
  const incomingItems = sanitizeFeedItems(
    snapshots.flatMap((snapshot) => (Array.isArray(snapshot?.items) ? snapshot.items : [])),
    sourceUpdatedAtById,
    updatedAt,
  );
  const mergedItems = mergeFeedItems([...archiveItems, ...incomingItems]);
  const totalItems = mergedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const pages = [];

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const start = (pageNumber - 1) * PAGE_SIZE;
    const items = mergedItems.slice(start, start + PAGE_SIZE);
    pages.push({
      number: pageNumber,
      payload: {
        updated_at: updatedAt,
        current_page: pageNumber,
        total_pages: totalPages,
        page_size: PAGE_SIZE,
        total_items: totalItems,
        items,
      },
    });
  }

  return {
    updated_at: updatedAt,
    items: mergedItems,
    index: {
      updated_at: updatedAt,
      total_items: totalItems,
      total_pages: totalPages,
      page_size: PAGE_SIZE,
      sources: snapshots.map((snapshot) => snapshot?.source || null).filter(Boolean),
    },
    pages,
  };
}

function resolveFeedUpdatedAt(snapshots, existingArchive) {
  const candidates = [
    ...snapshots.map((snapshot) => snapshot?.source?.updated_at),
    existingArchive?.updated_at,
  ]
    .map((value) => parseIsoDate(value))
    .filter(Boolean)
    .sort((left, right) => right.getTime() - left.getTime());

  if (candidates.length) {
    return formatHktIso(candidates[0]);
  }

  return formatHktIso(NOW);
}

function sanitizeFeedItems(items, sourceUpdatedAtById, defaultUpdatedAt) {
  return items
    .map((item) => sanitizeFeedItem(item, sourceUpdatedAtById, defaultUpdatedAt))
    .filter(Boolean);
}

function sanitizeFeedItem(item, sourceUpdatedAtById, defaultUpdatedAt) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const sourceUpdatedAt = parseIsoDate(sourceUpdatedAtById.get(item.source_id));
  const fallbackUpdatedAt = parseIsoDate(defaultUpdatedAt) || NOW;
  const ceiling = sourceUpdatedAt || fallbackUpdatedAt;
  const publishedAt = parseIsoDate(item.published_at);
  const effectivePublishedAt =
    publishedAt && publishedAt.getTime() <= ceiling.getTime() ? publishedAt : ceiling;

  return {
    ...item,
    published_at: formatHktIso(effectivePublishedAt),
  };
}

async function writePages(pages) {
  const expectedFiles = new Set();
  for (const page of pages) {
    const fileName = `${page.number}.json`;
    const filePath = path.join(PAGES_DIR, fileName);
    expectedFiles.add(fileName);
    await writeJson(filePath, page.payload);
  }

  const existingFiles = await fs.readdir(PAGES_DIR);
  for (const fileName of existingFiles) {
    if (!fileName.endsWith(".json")) {
      continue;
    }
    if (expectedFiles.has(fileName)) {
      continue;
    }
    await fs.rm(path.join(PAGES_DIR, fileName), { force: true });
  }
}

async function fetchGeneralSource({ apiKey, now }) {
  const window = getGeneralTimeWindow(now, GENERAL_LOOKBACK_HOURS);
  const prompt = buildGeneralPrompt(window, GENERAL_LOOKBACK_HOURS, GENERAL_MAX_ITEMS);
  const { data } = await callXai({
    apiKey,
    systemPrompt:
      "You are Grok, a rigorous AI research curator. Use live search tools when current information is required. Return strict JSON only.",
    userPrompt: prompt,
    tools: [{ type: "x_search" }, { type: "web_search" }],
  });
  const rawText = extractOutputText(data);
  if (!rawText) {
    throw new Error("General source returned empty model output.");
  }

  const report = extractJsonPayload(rawText);
  const validatedItems = validateGeneralItems(report?.items, window, GENERAL_MAX_ITEMS);
  const items = validatedItems.map((item) => mapGeneralItemToFeed(item)).filter(Boolean);

  return {
    updatedAt: formatHktIso(window.end),
    windowStart: formatHktIso(window.start),
    windowEnd: formatHktIso(window.end),
    items,
  };
}

async function fetchArtistSource({ apiKey, now }) {
  const window = getHandleSourceTimeWindow(now, ARTIST_LOOKBACK_HOURS);
  const handles = uniqueHandles(ARTIST_HANDLES);
  const batches = batchHandles(handles, ARTIST_BATCH_SIZE);
  const { batchResults, failedBatches } = await runHandleBatchesWithConcurrency({
    batches,
    window,
    apiKey,
    systemPrompt: ARTIST_SYSTEM_PROMPT,
    buildBatchPrompt: buildArtistBatchPrompt,
    maxConcurrency: ARTIST_MAX_CONCURRENCY,
    logLabel: "AI Artist Signals",
  });
  if (!batchResults.length && failedBatches.length) {
    throw new Error(`All AI Artist Signals batches failed. ${failedBatches.join(" | ")}`);
  }
  const posts = buildArtistPosts(batchResults, window);
  const items = posts.map((post) => mapArtistPostToFeed(post)).filter(Boolean);

  return {
    updatedAt: formatHktIso(window.end),
    windowStart: formatIsoUtc(window.start),
    windowEnd: formatIsoUtc(window.end),
    items,
  };
}

async function fetchDailyAiBriefsSource({ apiKey, now }) {
  const window = getDailyDigestTimeWindow(now);
  const pages = await fetchDailyDigestPages(window);
  if (!pages.length) {
    throw new Error("Daily AI briefs source pages are unavailable.");
  }

  const prompt = buildDailyDigestPrompt(pages, window, DAILY_DIGEST_MAX_ITEMS);
  const { data } = await callXai({
    apiKey,
    systemPrompt: DAILY_DIGEST_SYSTEM_PROMPT,
    userPrompt: prompt,
  });
  const rawText = extractOutputText(data);
  if (!rawText) {
    throw new Error("Daily AI briefs source returned empty model output.");
  }

  const report = extractJsonPayload(rawText);
  const validatedItems = validateDailyDigestItems(report?.items, {
    pages,
    window,
    maxItems: DAILY_DIGEST_MAX_ITEMS,
  });
  const items = validatedItems.map((item) => mapDailyDigestItemToFeed(item)).filter(Boolean);
  const pageWindow = resolveDailyDigestSourceWindow(pages, window);

  return {
    updatedAt: formatHktIso(window.end),
    windowStart: pageWindow.start,
    windowEnd: pageWindow.end,
    items,
  };
}

async function fetchXAiSignalsSource({ apiKey, now }) {
  const window = getHandleSourceTimeWindow(now, X_AI_SIGNALS_LOOKBACK_HOURS);
  const handles = uniqueHandles(X_AI_SIGNALS_HANDLES);
  const batches = batchHandles(handles, X_AI_SIGNALS_BATCH_SIZE);
  const { batchResults, failedBatches } = await runHandleBatchesWithConcurrency({
    batches,
    window,
    apiKey,
    systemPrompt: X_AI_SIGNALS_SYSTEM_PROMPT,
    buildBatchPrompt: buildXAiSignalsBatchPrompt,
    maxConcurrency: X_AI_SIGNALS_MAX_CONCURRENCY,
    logLabel: "X AI Signals",
  });
  if (!batchResults.length && failedBatches.length) {
    throw new Error(`All X AI Signals batches failed. ${failedBatches.join(" | ")}`);
  }
  const posts = buildXAiSignalsPosts(batchResults, window);
  const items = posts.map((post) => mapXAiSignalsPostToFeed(post)).filter(Boolean);

  return {
    updatedAt: formatHktIso(window.end),
    windowStart: formatIsoUtc(window.start),
    windowEnd: formatIsoUtc(window.end),
    items,
  };
}

async function fetchAiIndieSource({ apiKey, now }) {
  const window = getHandleSourceTimeWindow(now, AIINDIE_LOOKBACK_HOURS);
  const handles = uniqueHandles(AIINDIE_HANDLES);
  const batches = batchHandles(handles, AIINDIE_BATCH_SIZE);
  const { batchResults, failedBatches } = await runHandleBatchesWithConcurrency({
    batches,
    window,
    apiKey,
    systemPrompt: AIINDIE_SYSTEM_PROMPT,
    buildBatchPrompt: buildAiIndieBatchPrompt,
    maxConcurrency: AIINDIE_MAX_CONCURRENCY,
    logLabel: "AI Indie Signals",
  });
  if (!batchResults.length && failedBatches.length) {
    throw new Error(`All AI Indie Signals batches failed. ${failedBatches.join(" | ")}`);
  }
  const posts = buildAiIndiePosts(batchResults, window);
  const items = posts.map((post) => mapAiIndiePostToFeed(post)).filter(Boolean);

  return {
    updatedAt: formatHktIso(window.end),
    windowStart: formatIsoUtc(window.start),
    windowEnd: formatIsoUtc(window.end),
    items,
  };
}

function buildGeneralPrompt(window, lookbackHours, maxItems) {
  return `You are curating a compact AI news feed.

Time window (${window.timezone} / Hong Kong Time):
- window_start: ${formatHktIso(window.start)}
- window_end: ${formatHktIso(window.end)}

Task:
1. Scan AI-related content from:
   - X posts, preferred
   - Reddit posts
   - Official blogs from Claude, OpenAI, Gemini, or Grok only
2. Keep only items published today and within the last ${lookbackHours} hours in Hong Kong Time.
3. Prefer original sources. Exclude reposts, roundups, news sites, YouTube, podcasts, and third-party blogs.
4. If the publish time is unclear or outside the window, exclude the item.
5. Return fewer than ${maxItems} items if the signal is weak. Do not pad.
6. Ranking priority: novelty > value density > heat, while preferring X over Reddit over official blogs.

Output rules:
- Return strict JSON only.
- Keep title in its original language if needed.
- Write all descriptive fields in Simplified Chinese.
- published_at must be an ISO 8601 timestamp with timezone.
- scores.novelty, scores.value, scores.heat, and scores.overall must be numbers from 0 to 10.
- platform must be one of: X, Reddit, Claude Blog, OpenAI Blog, Gemini Blog, Grok Blog.

JSON schema:
{
  "items": [
    {
      "kind": "post | article",
      "platform": "X | Reddit | Claude Blog | OpenAI Blog | Gemini Blog | Grok Blog",
      "title": "Title",
      "author": "Author or account",
      "published_at": "ISO 8601 with timezone",
      "link": "https://...",
      "source_signal": "Why the source matters",
      "novelty_reason": "Why this is new",
      "value_reason": "Why this is worth reading",
      "recommendation": "1-2 sentence Simplified Chinese blurb",
      "summary": "2-4 sentence Simplified Chinese summary",
      "takeaways": ["Takeaway 1", "Takeaway 2"],
      "scores": {
        "novelty": 0,
        "value": 0,
        "heat": 0,
        "overall": 0
      }
    }
  ]
}`;
}

const ARTIST_SYSTEM_PROMPT =
  "You are a rigorous curator of AI artist signals. Use x_search only. Return strict JSON only.";

const DAILY_DIGEST_SYSTEM_PROMPT =
  "You are a rigorous curator of high-value daily AI digests. Work only from the provided source excerpts, prefer original links when available, and return strict JSON only.";

const X_AI_SIGNALS_SYSTEM_PROMPT = `你是中文 X（Twitter）高价值 AI 信号挖掘专家，服务对象是 AI 创业者、独立开发者、SaaS 玩家、AI 出海与产品增长从业者。你的目标不是找热闹，而是找真正值得跟进的实战信号：产品进展、增长方法、工具链、工作流、商业机会、行业判断、执行细节与风险提示。同时关注影响 AI 创业决策的基础设施变化：算力经济学、模型部署成本、开发框架迭代、搜索与分发平台规则变动、金融市场与 AI 投资信号、监管与政策动向。判断标准是信息密度、原创性、可执行性与前瞻性，不唯热度。`;

const AIINDIE_SYSTEM_PROMPT =
  "You are a rigorous curator of AI indie hacker signals on X. Serve a builder who wants to become a top AI indie hacker. Prefer concrete execution details, distribution insight, monetization learning, workflow leverage, and original operator judgment. Ignore low-information hype, memes, reposts, and vague motivation. Use x_search only. Return strict JSON only.";

function buildDailyDigestPrompt(pages, window, maxItems) {
  const excerpts = pages
    .map(
      (page) => `Source: ${page.label}
- source_date_key: ${page.source_date_key}
- source_page: ${page.source_page}
- fetched_url: ${page.fetched_url}
- fallback_published_at: ${page.fallback_published_at}
- excerpt:
${page.excerpt}`,
    )
    .join("\n\n");

  return `You are curating a compact high-value AI briefing from daily digest pages.

Current UTC context:
- now: ${formatIsoUtc(window.end)}
- utc_date: ${window.utc_date}
- previous_utc_date: ${window.previous_utc_date}

Task:
1. Work only from the source excerpts below.
2. Keep only high-value AI items: papers, benchmarks, model releases, product launches, agents, tooling, workflows, infra, data, safety, and concrete business signals.
3. Prefer the original paper/article/repo/product URL when the excerpt includes it. If not, use the digest page URL.
4. Deduplicate repeated stories that appear across multiple digest sites.
5. Downrank generic opinion, low-information roundups, vague hype, and repeated summaries with no new details.
6. Return fewer than ${maxItems} items if the signal is weak. Do not pad.

Output rules:
- Return strict JSON only.
- Write descriptive fields in Simplified Chinese.
- Keep the title in its original language when useful.
 - platform must be one of: Hacker News, Hugging Face Papers, ClawFeed, TLDR AI.
- published_at must be ISO 8601 with timezone. If the original timestamp is unclear, use the fallback_published_at from the digest page that surfaced the item.
- link must point to the original item when available.
- source_page must be the digest page URL that surfaced the item.
- topic must be one of: research, model-release, benchmark, agent, tooling, workflow, infra, product, business, safety, data.
- scores.novelty, scores.value, scores.heat, and scores.overall must be numbers from 0 to 10.

JSON schema:
{
  "items": [
    {
      "platform": "Hacker News | Hugging Face Papers | ClawFeed | TLDR AI",
      "title": "Title",
      "author": "Author or publisher",
      "published_at": "ISO 8601 with timezone",
      "link": "https://...",
      "source_page": "https://...",
      "source_signal": "Why this source surfaced it and why it matters",
      "recommendation": "1-2 sentence Simplified Chinese blurb",
      "summary": "2-4 sentence Simplified Chinese summary",
      "takeaways": ["Takeaway 1", "Takeaway 2"],
      "topic": "research/model-release/benchmark/agent/tooling/workflow/infra/product/business/safety/data",
      "scores": {
        "novelty": 0,
        "value": 0,
        "heat": 0,
        "overall": 0
      }
    }
  ]
}

Source excerpts:
${excerpts}`;
}

function buildArtistBatchPrompt(batch, window) {
  const since = formatSearchUtc(window.start);
  const until = formatSearchUtc(window.end);
  const handles = batch.map((handle) => `@${handle}`).join(", ");

  return `You are curating a compact AI artist signal feed for creators, AIGC operators, and visual tool observers.

Time window:
- window_start: ${formatIsoUtc(window.start)}
- window_end: ${formatIsoUtc(window.end)}
- since: ${since}
- until: ${until}

Accounts for this batch only:
${handles}

Rules:
1. Use x_search only.
2. Query only these accounts with from:user plus since/until, mode:Latest, and limit:${ARTIST_BATCH_LIMIT}.
3. Prioritize:
   - standout showcases with strong aesthetic, narrative, or technical signal
   - workflow breakdowns
   - prompt, parameter, and control-method insights
   - model or tool comparisons
   - experiments, postmortems, and market signals
4. Downrank pure low-information showcases, reposts, slogans, giveaways, and generic hype.
5. If there is no strong signal, return an empty high_value_posts array.

Output rules:
- Return strict JSON only.
- Write descriptive fields in Simplified Chinese.
- published_at must be ISO 8601 with timezone whenever available from the source.
- signal_score must be a number from 0 to 10.

JSON schema:
{
  "high_value_posts": [
    {
      "handle": "@artist",
      "post_link": "https://x.com/...",
      "published_at": "ISO 8601 with timezone",
      "title": "One-line title",
      "value_summary": "3-5 sentence Simplified Chinese summary",
      "why_valuable": "Why creators should care",
      "domain": "showcase/workflow/prompting/model-comparison/style/tooling/business",
      "actionable_advice": "What to test or borrow next",
      "signal_score": 0
    }
  ],
  "insights": ["Optional insight"],
  "low_value": ["Optional reason"]
}`;
}

function buildXAiSignalsBatchPrompt(batch, window) {
  const since = formatSearchUtc(window.start);
  const until = formatSearchUtc(window.end);
  const handles = batch.map((handle) => `@${handle}`).join(", ");

  return `时间窗口：
- window_start: ${formatIsoUtc(window.start)}
- window_end: ${formatIsoUtc(window.end)}
- since: ${since}
- until: ${until}

本批账号（仅允许处理这些账号）：
${handles}

执行要求：
1. 只使用 x_search 工具。
2. 使用 from:user、since:、until:、mode:Latest、limit:${X_AI_SIGNALS_BATCH_LIMIT} 等运算符拉取本批账号最近 ${window.lookback_hours} 小时的新帖。
3. 一次最多处理本批这 ${batch.length} 个账号，不要把其他账号的帖子写入结果。
4. 优先保留原创帖、长线程、明确分享经验、产品进展、增长方法、可执行技巧、数据复盘、工具链、行业判断。
5. 过滤掉闲聊、水贴、纯转发、纯表情、无信息密度观点、广告口播、抽奖和重复表达；如果没有高价值结果，high_value_posts 返回空数组。
6. 输出必须是严格 JSON，不要 markdown，不要解释，不要代码块。

输出要求：
- 叙述字段统一使用简体中文。
- published_at 必须尽量返回 ISO 8601 时间字符串并带时区；若来源中没有明确时间，也请尽量推断。
- signal_score 为 0-10，重点体现“信息密度 + 可执行性 + 前瞻性”。

JSON schema:
{
  "high_value_posts": [
    {
      "handle": "@builder",
      "post_link": "https://x.com/...",
      "published_at": "ISO 8601 with timezone",
      "title": "一句话标题",
      "value_summary": "核心干货是什么（3-5 句话）",
      "why_valuable": "为什么值得关注（实战价值/机会点/风险）",
      "domain": "AI/创业/出海/SaaS/独立开发/增长/工具链/...",
      "actionable_advice": "可以立刻怎么用/跟进",
      "signal_score": 0
    }
  ],
  "insights": ["本批次 3-5 条最重要趋势/机会/风险"],
  "low_value": ["忽略的账号或帖子原因（可选）"]
}`;
}

function buildAiIndieBatchPrompt(batch, window) {
  const since = formatSearchUtc(window.start);
  const until = formatSearchUtc(window.end);
  const handles = batch.map((handle) => `@${handle}`).join(", ");

  return `You are curating a compact AI indie hacker signal feed.

Time window:
- window_start: ${formatIsoUtc(window.start)}
- window_end: ${formatIsoUtc(window.end)}
- since: ${since}
- until: ${until}

Accounts for this batch only:
${handles}

Execution rules:
1. Use x_search only.
2. Query only these accounts with from:user, since:, until:, mode:Latest, and limit:${AIINDIE_BATCH_LIMIT}.
3. Process only posts that are within the time window. Exclude posts with unclear timing.
4. Prioritize posts with strong operator signal:
   - shipping updates, launch notes, feature rollouts, architecture or product decisions
   - distribution, SEO, content loops, social growth, conversion, retention, pricing, monetization
   - revenue, users, experiments, dashboards, funnel learnings, market feedback
   - AI workflows, agents, automations, prompts, evals, tool stacks, support or ops leverage
   - postmortems, failed experiments, changed strategy, competitive positioning, market insight
5. Prefer original posts and high-context threads. Downrank reposts, screenshots without explanation, generic motivation, vague opinions, memes, giveaways, and empty hype.
6. Keep only posts that help an ambitious builder become a stronger AI indie hacker through reusable tactics, sharper judgment, or clearer market sense.
7. If there is no strong signal, return an empty high_value_posts array.

Output rules:
- Return strict JSON only. No markdown. No explanation.
- Keep title in the original language when helpful.
- Write value_summary, why_valuable, and actionable_advice in Simplified Chinese.
- published_at must be ISO 8601 with timezone whenever available from the source.
- signal_score must be a number from 0 to 10.
- signal_score should weight specificity, repeatability, leverage, and proof over virality.
- domain should be one or more of: build, launch, growth, distribution, pricing, monetization, retention, workflow, agent, automation, tooling, prompt, seo, content, analytics, business, strategy, postmortem

JSON schema:
{
  "high_value_posts": [
    {
      "handle": "@builder",
      "post_link": "https://x.com/...",
      "published_at": "ISO 8601 with timezone",
      "title": "One-line title",
      "value_summary": "3-5 sentence Simplified Chinese summary",
      "why_valuable": "Why this matters for an AI indie hacker",
      "domain": "growth/monetization/workflow",
      "actionable_advice": "What to test, copy, or investigate next",
      "signal_score": 0
    }
  ],
  "insights": ["Optional insight"],
  "low_value": ["Optional reason"]
}`;
}

async function runHandleBatchesWithConcurrency({
  batches,
  window,
  apiKey,
  systemPrompt,
  buildBatchPrompt,
  maxConcurrency,
  logLabel,
}) {
  const batchResults = [];
  const failedBatches = [];
  const boundedConcurrency = Math.max(1, Math.min(maxConcurrency, batches.length || 1));
  let nextBatchIndex = 0;

  async function worker(workerId) {
    while (true) {
      const currentIndex = nextBatchIndex;
      nextBatchIndex += 1;
      if (currentIndex >= batches.length) {
        return;
      }

      const batch = batches[currentIndex];
      console.log(
        `[news] ${logLabel} worker ${workerId} batch ${currentIndex + 1}/${batches.length}: ${batch.map((handle) => `@${handle}`).join(", ")}`,
      );
      try {
        const result = await callHandleBatchWithRetry({
          batch,
          window,
          apiKey,
          systemPrompt,
          buildBatchPrompt,
          logLabel,
          batchNumber: currentIndex + 1,
          totalBatches: batches.length,
        });
        batchResults.push({ index: currentIndex, result });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error || "Unknown batch error");
        failedBatches.push(`Batch ${currentIndex + 1}: ${message}`);
        console.error(
          `[news] ${logLabel} skipping batch ${currentIndex + 1}/${batches.length} after retry: ${message}`,
        );
      }
    }
  }

  await Promise.all(Array.from({ length: boundedConcurrency }, (_, index) => worker(index + 1)));
  batchResults.sort((left, right) => left.index - right.index);

  if (failedBatches.length) {
    console.warn(
      `[news] ${logLabel} completed with ${batchResults.length}/${batches.length} successful batches. failed=${failedBatches.length}`,
    );
  }

  return {
    batchResults: batchResults.map((item) => item.result),
    failedBatches,
  };
}

async function callHandleBatchWithRetry({
  batch,
  window,
  apiKey,
  systemPrompt,
  buildBatchPrompt,
  logLabel,
  batchNumber,
  totalBatches,
}) {
  const maxAttempts = HANDLE_BATCH_MAX_RETRIES + 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      if (attempt > 1) {
        console.warn(
          `[news] ${logLabel} retrying batch ${batchNumber}/${totalBatches} (attempt ${attempt}/${maxAttempts})`,
        );
      }
      return await callHandleBatch({
        batch,
        window,
        apiKey,
        systemPrompt,
        buildBatchPrompt,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || "Unknown batch error");
      if (attempt >= maxAttempts) {
        throw new Error(message);
      }

      console.warn(
        `[news] ${logLabel} batch ${batchNumber}/${totalBatches} failed on attempt ${attempt}/${maxAttempts}: ${message}`,
      );
      await new Promise((resolve) => setTimeout(resolve, HANDLE_BATCH_RETRY_DELAY_MS));
    }
  }

  throw new Error("Unreachable retry state.");
}

async function callHandleBatch({ batch, window, apiKey, systemPrompt, buildBatchPrompt }) {
  const { data } = await callXai({
    apiKey,
    systemPrompt,
    userPrompt: buildBatchPrompt(batch, window),
    tools: [{ type: "x_search" }],
  });
  const rawText = extractOutputText(data);
  if (!rawText) {
    throw new Error("Handle source returned empty model output.");
  }
  return extractJsonPayload(rawText);
}

function buildArtistPosts(batchResults, window) {
  return buildScoredHandlePosts(batchResults, window, {
    maxItems: ARTIST_MAX_ITEMS,
    normalizePost: normalizeArtistPost,
    scorePost: scoreArtistPost,
  });
}

function buildXAiSignalsPosts(batchResults, window) {
  return buildScoredHandlePosts(batchResults, window, {
    maxItems: X_AI_SIGNALS_MAX_ITEMS,
    normalizePost: normalizeXAiSignalsPost,
    scorePost: scoreXAiSignalsPost,
  });
}

function buildAiIndiePosts(batchResults, window) {
  return buildScoredHandlePosts(batchResults, window, {
    maxItems: AIINDIE_MAX_ITEMS,
    normalizePost: normalizeAiIndiePost,
    scorePost: scoreAiIndiePost,
  });
}

function buildScoredHandlePosts(batchResults, window, { maxItems, normalizePost, scorePost }) {
  const postMap = new Map();

  for (const result of batchResults) {
    const posts = Array.isArray(result?.high_value_posts) ? result.high_value_posts : [];
    for (const item of posts) {
      const normalized = normalizePost(item, window);
      if (!normalized) {
        continue;
      }

      const existing = postMap.get(normalized.post_link);
      if (!existing || scorePost(normalized) > scorePost(existing)) {
        postMap.set(normalized.post_link, normalized);
      }
    }
  }

  return [...postMap.values()]
    .sort((left, right) => {
      const timeLeft = parseIsoDate(left.published_at)?.getTime() || 0;
      const timeRight = parseIsoDate(right.published_at)?.getTime() || 0;
      if (timeLeft !== timeRight) {
        return timeRight - timeLeft;
      }
      return (right.signal_score || 0) - (left.signal_score || 0);
    })
    .slice(0, maxItems);
}

function normalizeArtistPost(item, window) {
  return normalizeScoredHandlePost(item, window);
}

function normalizeXAiSignalsPost(item, window) {
  return normalizeScoredHandlePost(item, window);
}

function normalizeAiIndiePost(item, window) {
  return normalizeScoredHandlePost(item, window);
}

function normalizeScoredHandlePost(item, window) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const postLink = canonicalizePostLink(item.post_link || item.link);
  if (!postLink) {
    return null;
  }

  const normalizedHandle = normalizeHandle(item.handle) || extractHandleFromLink(postLink);
  if (!normalizedHandle) {
    return null;
  }

  const parsedPublishedAt = parseIsoDate(item.published_at);
  if (
    parsedPublishedAt &&
    (parsedPublishedAt.getTime() < window.start.getTime() || parsedPublishedAt.getTime() > window.end.getTime())
  ) {
    return null;
  }

  const publishedAt = parsedPublishedAt || window.end;

  return {
    handle: `@${normalizedHandle}`,
    post_link: postLink,
    published_at: formatHktIso(publishedAt),
    title: normalizeText(item.title) || `Signal from @${normalizedHandle}`,
    value_summary: normalizeText(item.value_summary),
    why_valuable: normalizeText(item.why_valuable),
    domain: normalizeText(item.domain),
    actionable_advice: normalizeText(item.actionable_advice),
    signal_score: normalizeScore(item.signal_score) ?? 7,
  };
}

function scoreArtistPost(post) {
  return scoreScoredHandlePost(post);
}

function scoreXAiSignalsPost(post) {
  return scoreScoredHandlePost(post);
}

function scoreAiIndiePost(post) {
  return scoreScoredHandlePost(post);
}

function scoreScoredHandlePost(post) {
  return [
    post.title,
    post.value_summary,
    post.why_valuable,
    post.domain,
    post.actionable_advice,
  ]
    .map((value) => normalizeText(value).length)
    .reduce((sum, value) => sum + value, 0) + (post.signal_score || 0) * 10;
}

function mapArtistPostToFeed(post) {
  return mapHandlePostToFeed(post, {
    sourceId: "artist",
    sourceName: "AI Artist Signals",
    sourceType: "artist",
  });
}

function mapXAiSignalsPostToFeed(post) {
  return mapHandlePostToFeed(post, {
    sourceId: "x_ai_signals",
    sourceName: "X AI Signals",
    sourceType: "x_ai_signals",
  });
}

function mapAiIndiePostToFeed(post) {
  return mapHandlePostToFeed(post, {
    sourceId: "aiindie",
    sourceName: "AI Indie Hacker Signals",
    sourceType: "aiindie",
  });
}

function mapHandlePostToFeed(post, { sourceId, sourceName, sourceType }) {
  return createFeedItem({
    sourceId,
    sourceName,
    sourceType,
    platform: "X",
    author: post.handle,
    title: post.title,
    blurb: pickFirstText([
      joinSentences(post.value_summary, post.why_valuable),
      post.value_summary,
      post.why_valuable,
      post.actionable_advice,
    ]),
    link: post.post_link,
    publishedAt: post.published_at,
    score: post.signal_score,
    tags: splitTags(post.domain),
  });
}

function mapGeneralItemToFeed(item) {
  return createFeedItem({
    sourceId: "general",
    sourceName: "General AI News",
    sourceType: "general",
    platform: item.platform,
    author: normalizeText(item.author) || item.platform,
    title: normalizeText(item.title) || "Untitled",
    blurb: pickFirstText([
      item.recommendation,
      item.summary,
      joinSentences(item.value_reason, item.novelty_reason),
      item.value_reason,
      item.novelty_reason,
    ]),
    link: item.link,
    publishedAt: item.published_at,
    score: item?.scores?.overall ?? averageScores(item?.scores),
    tags: [item.platform, item.kind].filter(Boolean),
  });
}

function mapDailyDigestItemToFeed(item) {
  const feedItem = createFeedItem({
    sourceId: "daily_ai_briefs",
    sourceName: "Daily AI Briefs",
    sourceType: "daily_ai_briefs",
    platform: item.platform,
    author: normalizeText(item.author) || item.platform,
    title: normalizeText(item.title) || "Untitled",
    blurb: pickFirstText([
      item.recommendation,
      item.summary,
      item.source_signal,
      ...(Array.isArray(item.takeaways) ? item.takeaways : []),
    ]),
    link: item.link,
    publishedAt: item.published_at,
    score: item?.scores?.overall ?? averageScores(item?.scores),
    tags: [item.platform, item.topic].filter(Boolean),
  });

  if (!feedItem) {
    return null;
  }

  return {
    ...feedItem,
    source_page: normalizeText(item.source_page),
    source_signal: normalizeText(item.source_signal),
    recommendation: normalizeText(item.recommendation),
    summary: normalizeText(item.summary),
    takeaways: uniqueStrings(item.takeaways),
    topic: normalizeText(item.topic),
  };
}

function createFeedItem({
  sourceId,
  sourceName,
  sourceType,
  platform,
  author,
  title,
  blurb,
  link,
  publishedAt,
  score,
  tags,
}) {
  const canonicalLink = canonicalizeExternalUrl(link);
  if (!canonicalLink) {
    return null;
  }

  const preferredLink = preferredExternalUrl(link) || canonicalLink;
  const publishedDate = parseIsoDate(publishedAt);
  if (!publishedDate) {
    return null;
  }

  return {
    id: createStableId(`${sourceId}|${canonicalLink}`),
    source_id: sourceId,
    source_name: sourceName,
    source_type: sourceType,
    platform: normalizeText(platform) || "Unknown",
    author: normalizeText(author),
    title: normalizeText(title) || "Untitled",
    blurb: compressText(blurb, 220),
    link: preferredLink,
    canonical_link: canonicalLink,
    published_at: formatHktIso(publishedDate),
    score: normalizeScore(score) ?? 0,
    tags: uniqueStrings(tags),
  };
}

function mergeFeedItems(items) {
  const itemMap = new Map();

  for (const item of items) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const canonicalLink = canonicalizeExternalUrl(item.canonical_link || item.link);
    if (!canonicalLink) {
      continue;
    }

    const normalizedItem = {
      ...item,
      id: createStableId(`${item.source_id || "source"}|${canonicalLink}`),
      canonical_link: canonicalLink,
      published_at: formatHktIso(parseIsoDate(item.published_at) || NOW),
      score: normalizeScore(item.score) ?? 0,
      tags: uniqueStrings(item.tags),
      source_id: normalizeText(item.source_id),
      source_name: normalizeText(item.source_name),
      source_type: normalizeText(item.source_type),
      platform: normalizeText(item.platform),
      author: normalizeText(item.author),
      title: normalizeText(item.title) || "Untitled",
      blurb: compressText(item.blurb, 220),
      link: preferredExternalUrl(item.link || canonicalLink) || canonicalLink,
    };

    const existing = itemMap.get(canonicalLink);
    if (!existing || shouldReplaceFeedItem(normalizedItem, existing)) {
      itemMap.set(canonicalLink, normalizedItem);
    }
  }

  return [...itemMap.values()].sort(sortFeedItems).slice(0, MAX_ARCHIVE_ITEMS);
}

function shouldReplaceFeedItem(candidate, existing) {
  const candidatePriority = sourceMergePriority(candidate);
  const existingPriority = sourceMergePriority(existing);
  if (candidatePriority !== existingPriority) {
    return candidatePriority > existingPriority;
  }

  const candidateScore = feedCompleteness(candidate);
  const existingScore = feedCompleteness(existing);
  return candidateScore > existingScore;
}

function sourceMergePriority(item) {
  const sourceType = normalizeText(item?.source_type).toLowerCase();
  if (sourceType === "aiindie") {
    return 1;
  }
  return 0;
}

function feedCompleteness(item) {
  const publishedAt = parseIsoDate(item.published_at)?.getTime() || 0;
  return [
    item.title,
    item.blurb,
    item.author,
    item.platform,
    ...(Array.isArray(item.tags) ? item.tags : []),
  ]
    .map((value) => normalizeText(value).length)
    .reduce((sum, value) => sum + value, 0) +
    (item.score || 0) * 20 +
    publishedAt / 1_000_000_000;
}

function sortFeedItems(left, right) {
  const leftTime = parseIsoDate(left.published_at)?.getTime() || 0;
  const rightTime = parseIsoDate(right.published_at)?.getTime() || 0;
  if (leftTime !== rightTime) {
    return rightTime - leftTime;
  }
  if ((left.score || 0) !== (right.score || 0)) {
    return (right.score || 0) - (left.score || 0);
  }
  return String(left.title || "").localeCompare(String(right.title || ""));
}

async function callXai({ apiKey, systemPrompt, userPrompt, tools }) {
  const payload = {
    model: MODEL,
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    tools,
  };

  const { status, text } = await postJson(API_URL, payload, {
    Authorization: `Bearer ${apiKey}`,
  });

  if (status >= 400) {
    throw new Error(`xAI API request failed (${status}): ${text}`);
  }

  const data = tryParseJson(text);
  if (!data || typeof data !== "object") {
    throw new Error(`xAI API returned invalid JSON: ${text}`);
  }

  return { data };
}

async function postJson(url, payload, headers = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });

  return {
    status: response.status,
    text: await response.text(),
  };
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractFirstJsonObject(text) {
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (start === -1) {
      if (char === "{") {
        start = index;
        depth = 1;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        const candidate = text.slice(start, index + 1);
        const parsed = tryParseJson(candidate);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  }

  throw new Error("No valid JSON object found in model output.");
}

function extractJsonPayload(rawText) {
  let cleaned = String(rawText || "").trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  const direct = tryParseJson(cleaned);
  if (direct && typeof direct === "object" && !Array.isArray(direct)) {
    return direct;
  }

  return extractFirstJsonObject(cleaned);
}

function extractOutputText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (Array.isArray(data?.output_text)) {
    return data.output_text.map(String).join("").trim();
  }

  const chunks = [];
  for (const item of data?.output || []) {
    if (!item || typeof item !== "object") {
      continue;
    }

    if (typeof item.text === "string" && item.text.trim()) {
      chunks.push(item.text.trim());
    }

    if (Array.isArray(item.content)) {
      for (const block of item.content) {
        if (block && typeof block.text === "string" && block.text.trim()) {
          chunks.push(block.text.trim());
        }
      }
    }
  }

  return chunks.join("\n").trim();
}

async function fetchDailyDigestPages(window) {
  const configs = buildDailyDigestPageConfigs(window);
  const pages = await Promise.all(configs.map((config) => fetchDailyDigestPage(config, window)));
  return pages.filter(Boolean);
}

function buildDailyDigestPageConfigs(window) {
  return [
    {
      id: "hacker_news",
      label: "Hacker News",
      maxChars: 10_000,
      candidates: [
        {
          url: "https://news.ycombinator.com/",
          sourcePage: "https://news.ycombinator.com/",
          sourceDateKey: window.utc_date,
        },
      ],
    },
    {
      id: "huggingface_papers",
      label: "Hugging Face Papers",
      maxChars: 14_000,
      candidates: [
        {
          url: `https://huggingface.co/papers/date/${window.utc_date}`,
          sourcePage: `https://huggingface.co/papers/date/${window.utc_date}`,
          sourceDateKey: window.utc_date,
        },
        {
          url: `https://huggingface.co/papers/date/${window.previous_utc_date}`,
          sourcePage: `https://huggingface.co/papers/date/${window.previous_utc_date}`,
          sourceDateKey: window.previous_utc_date,
        },
      ],
    },
    {
      id: "clawfeed",
      label: "ClawFeed",
      maxChars: 8_000,
      candidates: [
        {
          url: "https://clawfeed.kevinhe.io/",
          sourcePage: "https://clawfeed.kevinhe.io/#daily",
          sourceDateKey: window.utc_date,
        },
      ],
    },
    {
      id: "tldr_ai",
      label: "TLDR AI",
      maxChars: 14_000,
      candidates: [
        {
          url: "https://tldr.tech/api/latest/ai",
          sourcePage: "https://tldr.tech/api/latest/ai",
          sourceDateKey: window.utc_date,
        },
        {
          url: `https://tldr.tech/ai/${window.utc_date}`,
          sourcePage: `https://tldr.tech/ai/${window.utc_date}`,
          sourceDateKey: window.utc_date,
        },
        {
          url: `https://tldr.tech/ai/${window.previous_utc_date}`,
          sourcePage: `https://tldr.tech/ai/${window.previous_utc_date}`,
          sourceDateKey: window.previous_utc_date,
        },
      ],
    },
  ];
}

async function fetchDailyDigestPage(config, window) {
  const failures = [];

  for (const candidate of config.candidates) {
    try {
      const response = await fetch(candidate.url, {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
          "user-agent": NEWS_BOT_USER_AGENT,
        },
        signal: AbortSignal.timeout(20_000),
      });
      const html = await response.text();
      if (!response.ok) {
        failures.push(`${candidate.url} (${response.status})`);
        continue;
      }

      const excerpt = truncateText(
        joinTextBlocks(extractReadablePageText(html, response.url), extractEmbeddedJsonText(html)),
        config.maxChars || DAILY_DIGEST_PAGE_CHAR_LIMIT,
      );
      if (excerpt.length < 200) {
        failures.push(`${candidate.url} (sparse content)`);
        continue;
      }

      const sourcePage = canonicalizeExternalUrl(response.url) || candidate.sourcePage;
      const sourceDateKey = resolveDailyDigestDateKey({
        config,
        responseUrl: response.url,
        sourcePage,
        excerpt,
        fallbackDateKey: candidate.sourceDateKey,
        window,
      });

      console.log(`[news] Daily AI briefs page ready: ${config.label} <- ${candidate.sourcePage}`);
      return {
        id: config.id,
        label: config.label,
        source_date_key: sourceDateKey,
        source_page: sourcePage,
        fetched_url: response.url,
        fallback_published_at: resolveDailyDigestFallbackPublishedAt(sourceDateKey, window.end),
        excerpt,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || "Unknown page fetch error");
      failures.push(`${candidate.url} (${message})`);
    }
  }

  console.warn(`[news] Daily AI briefs page skipped: ${config.label}. ${failures.join(" | ")}`);
  return null;
}

function extractReadablePageText(html, baseUrl) {
  let text = String(html || "");
  text = text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ");
  text = text.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ");
  text = text.replace(/<a\b[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi, (_, __, href, inner) => {
    const label = decodeHtmlEntities(String(inner || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    const resolvedUrl = resolveUrl(href, baseUrl);
    if (!label) {
      return resolvedUrl;
    }
    if (!resolvedUrl) {
      return label;
    }
    return `${label} (${resolvedUrl})`;
  });
  text = text.replace(/<\/(p|div|section|article|li|ul|ol|tr|td|th|h\d)>/gi, "\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<[^>]+>/g, " ");
  text = decodeHtmlEntities(text);
  text = text.replace(/\r/g, "");
  text = text.replace(/[ \t]+\n/g, "\n");
  text = text.replace(/\n[ \t]+/g, "\n");
  text = text.replace(/[ \t]{2,}/g, " ");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

function extractEmbeddedJsonText(html) {
  const chunks = [];
  const nextDataMatch = String(html || "").match(/<script[^>]*id=(["'])__NEXT_DATA__\1[^>]*>([\s\S]*?)<\/script>/i);
  if (nextDataMatch?.[2]) {
    const parsed = tryParseJson(nextDataMatch[2]);
    if (parsed) {
      collectJsonTextChunks(parsed, chunks);
    }
  }
  return uniqueStrings(chunks).join("\n\n");
}

function collectJsonTextChunks(value, chunks) {
  if (typeof value === "string") {
    const text = normalizeText(decodeHtmlEntities(value).replace(/\s+/g, " "));
    if (text.length >= 24 && !/^https?:\/\//i.test(text)) {
      chunks.push(text);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectJsonTextChunks(item, chunks);
    }
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  for (const item of Object.values(value)) {
    collectJsonTextChunks(item, chunks);
  }
}

function joinTextBlocks(...values) {
  return values.map((value) => normalizeText(value)).filter(Boolean).join("\n\n");
}

function resolveDailyDigestDateKey({ config, responseUrl, sourcePage, excerpt, fallbackDateKey, window }) {
  return (
    extractDateKeyFromDailyDigestText(config, excerpt) ||
    extractDateKeyFromDailyDigestUrl(responseUrl) ||
    extractDateKeyFromDailyDigestUrl(sourcePage) ||
    fallbackDateKey ||
    window.previous_utc_date ||
    window.utc_date
  );
}

function extractDateKeyFromDailyDigestUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  const match = value.match(/\/(20\d{2}-\d{2}-\d{2})(?:[/?#]|$)/i);
  return match?.[1] || "";
}

function extractDateKeyFromDailyDigestText(config, value) {
  const text = normalizeText(value);
  if (!text) {
    return "";
  }

  if (config?.id === "tldr_ai") {
    const tldrMatch = text.match(/\btldr ai\s+(20\d{2}-\d{2}-\d{2})\b/i);
    if (tldrMatch?.[1]) {
      return tldrMatch[1];
    }
  }

  return "";
}

function resolveDailyDigestSourceWindow(pages, window) {
  const dateKeys = uniqueStrings(pages.map((page) => page?.source_date_key)).sort();
  if (!dateKeys.length) {
    return {
      start: makeUtcDayStartIso(window.previous_utc_date || window.utc_date),
      end: formatIsoUtc(window.end),
    };
  }

  const latestDateKey = dateKeys[dateKeys.length - 1];
  return {
    start: makeUtcDayStartIso(dateKeys[0]),
    end: latestDateKey === window.utc_date ? formatIsoUtc(window.end) : makeUtcDayEndIso(latestDateKey),
  };
}

function decodeHtmlEntities(value) {
  return String(value || "").replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    const normalized = String(entity).toLowerCase();
    if (normalized === "amp") {
      return "&";
    }
    if (normalized === "lt") {
      return "<";
    }
    if (normalized === "gt") {
      return ">";
    }
    if (normalized === "quot") {
      return "\"";
    }
    if (normalized === "apos" || normalized === "#39") {
      return "'";
    }
    if (normalized === "nbsp") {
      return " ";
    }
    if (normalized.startsWith("#x")) {
      const parsed = Number.parseInt(normalized.slice(2), 16);
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : match;
    }
    if (normalized.startsWith("#")) {
      const parsed = Number.parseInt(normalized.slice(1), 10);
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : match;
    }
    return match;
  });
}

function resolveUrl(value, baseUrl) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    return new URL(value.trim(), baseUrl).toString();
  } catch {
    return "";
  }
}

function getDailyDigestTimeWindow(now) {
  const end = new Date(now);
  const previousDay = new Date(end.getTime() - 24 * 60 * 60 * 1000);
  return {
    end,
    timezone: "UTC",
    utc_date: getUtcDateKey(end),
    previous_utc_date: getUtcDateKey(previousDay),
  };
}

function getGeneralTimeWindow(now, lookbackHours) {
  const end = new Date(now);
  const dayStart = getHktDayStartUtc(end);
  const start = new Date(Math.max(end.getTime() - lookbackHours * 60 * 60 * 1000, dayStart.getTime()));
  return { start, end, timezone: TIMEZONE_NAME };
}

function getHandleSourceTimeWindow(now, lookbackHours) {
  const end = new Date(now);
  const start = new Date(end.getTime() - lookbackHours * 60 * 60 * 1000);
  return {
    start,
    end,
    timezone: "UTC",
    lookback_hours: lookbackHours,
  };
}

function parseIsoDate(value) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  let candidate = value.trim();
  if (!/(Z|[+-]\d{2}:\d{2})$/i.test(candidate)) {
    candidate += "+08:00";
  }

  const timestamp = Date.parse(candidate);
  if (Number.isNaN(timestamp)) {
    return null;
  }

  return new Date(timestamp);
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function pad3(value) {
  return String(value).padStart(3, "0");
}

function getHktShiftedDate(date = new Date()) {
  return new Date(date.getTime() + HKT_OFFSET_MS);
}

function formatHktIso(date) {
  const shifted = getHktShiftedDate(new Date(date));
  const year = shifted.getUTCFullYear();
  const month = pad2(shifted.getUTCMonth() + 1);
  const day = pad2(shifted.getUTCDate());
  const hour = pad2(shifted.getUTCHours());
  const minute = pad2(shifted.getUTCMinutes());
  const second = pad2(shifted.getUTCSeconds());
  const millisecond = pad3(shifted.getUTCMilliseconds());
  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}+08:00`;
}

function formatIsoUtc(date) {
  return new Date(date).toISOString();
}

function formatSearchUtc(date) {
  const value = new Date(date);
  const year = value.getUTCFullYear();
  const month = pad2(value.getUTCMonth() + 1);
  const day = pad2(value.getUTCDate());
  const hour = pad2(value.getUTCHours());
  const minute = pad2(value.getUTCMinutes());
  const second = pad2(value.getUTCSeconds());
  return `${year}-${month}-${day}_${hour}:${minute}:${second}_UTC`;
}

function getUtcDateKey(date) {
  const value = new Date(date);
  const year = value.getUTCFullYear();
  const month = pad2(value.getUTCMonth() + 1);
  const day = pad2(value.getUTCDate());
  return `${year}-${month}-${day}`;
}

function getHktDateKey(date) {
  const shifted = getHktShiftedDate(date);
  const year = shifted.getUTCFullYear();
  const month = pad2(shifted.getUTCMonth() + 1);
  const day = pad2(shifted.getUTCDate());
  return `${year}-${month}-${day}`;
}

function getHktDayStartUtc(now = new Date()) {
  const shifted = getHktShiftedDate(now);
  const shiftedMidnightUtcMs = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
    0,
    0,
    0,
    0,
  );
  return new Date(shiftedMidnightUtcMs - HKT_OFFSET_MS);
}

function getUtcDayStart(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
}

function makeUtcMiddayIso(dateKey) {
  return `${dateKey}T${pad2(DAILY_DIGEST_FALLBACK_HOUR_UTC)}:00:00.000Z`;
}

function resolveDailyDigestFallbackPublishedAt(dateKey, windowEnd) {
  const fallbackDate = resolveDailyDigestFallbackDate(dateKey, windowEnd);
  return fallbackDate ? formatIsoUtc(fallbackDate) : "";
}

function resolveDailyDigestFallbackDate(dateKey, windowEnd) {
  const fallbackDate = parseIsoDate(makeUtcMiddayIso(dateKey));
  if (!fallbackDate) {
    return windowEnd ? new Date(windowEnd) : null;
  }

  if (windowEnd && getUtcDateKey(windowEnd) === dateKey && fallbackDate.getTime() > windowEnd.getTime()) {
    return new Date(windowEnd);
  }

  return fallbackDate;
}

function makeUtcDayStartIso(dateKey) {
  return `${dateKey}T00:00:00.000Z`;
}

function makeUtcDayEndIso(dateKey) {
  return `${dateKey}T23:59:59.999Z`;
}

function normalizeScore(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.round(parsed * 10) / 10;
}

function averageScores(scores) {
  const values = [scores?.novelty, scores?.value, scores?.heat]
    .map((value) => normalizeScore(value))
    .filter((value) => value !== null);
  if (!values.length) {
    return null;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizeHost(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    const url = new URL(value.trim());
    return url.hostname.replace(/^(www\.|m\.|mobile\.)/i, "").toLowerCase();
  } catch {
    return "";
  }
}

function normalizePath(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    return new URL(value.trim()).pathname.toLowerCase();
  } catch {
    return "";
  }
}

function normalizedText(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isXPlatform(value) {
  const normalized = normalizedText(value);
  return normalized === "x" || normalized.includes("twitter");
}

function isRedditPlatform(value) {
  const normalized = normalizedText(value);
  return normalized === "reddit" || normalized.includes("reddit");
}

function isXLink(value) {
  const host = normalizeHost(value);
  return host.endsWith("x.com") || host.endsWith("twitter.com");
}

function isRedditLink(value) {
  const host = normalizeHost(value);
  return host.endsWith("reddit.com") || host.endsWith("redd.it");
}

function isOfficialBlogLink(value) {
  const host = normalizeHost(value);
  const pathname = normalizePath(value);

  if (host.endsWith("openai.com")) {
    return ["/index", "/news", "/blog"].some((prefix) => pathname.startsWith(prefix));
  }
  if (host.endsWith("anthropic.com")) {
    return ["/news", "/research"].some((prefix) => pathname.startsWith(prefix));
  }
  if (host.endsWith("blog.google")) {
    return pathname.includes("gemini");
  }
  if (host.endsWith("deepmind.google")) {
    return pathname.includes("/discover/blog") || pathname.includes("/blog");
  }
  if (host.endsWith("x.ai")) {
    return ["/blog", "/news"].some((prefix) => pathname.startsWith(prefix));
  }

  return false;
}

function detectAllowedSource(item) {
  const platform = item?.platform;
  const link = item?.link;
  if (typeof link !== "string" || !link.trim()) {
    return null;
  }

  if (isXPlatform(platform) || isXLink(link)) {
    return "x";
  }
  if (isRedditPlatform(platform) || isRedditLink(link)) {
    return "reddit";
  }
  if (isOfficialBlogLink(link)) {
    return "official_blog";
  }

  return null;
}

function sourcePriority(item) {
  const source = detectAllowedSource(item);
  if (source === "x") {
    return 2;
  }
  if (source === "reddit") {
    return 1;
  }
  if (source === "official_blog") {
    return 0;
  }
  return -1;
}

function canonicalPlatform(item) {
  const link = item?.link;
  if (isXLink(link) || isXPlatform(item?.platform)) {
    return "X";
  }
  if (isRedditLink(link) || isRedditPlatform(item?.platform)) {
    return "Reddit";
  }

  const host = normalizeHost(link);
  if (host.endsWith("openai.com")) {
    return "OpenAI Blog";
  }
  if (host.endsWith("anthropic.com")) {
    return "Claude Blog";
  }
  if (host.endsWith("blog.google") || host.endsWith("deepmind.google")) {
    return "Gemini Blog";
  }
  if (host.endsWith("x.ai")) {
    return "Grok Blog";
  }

  return item?.platform || "Unknown";
}

function canonicalKind(item) {
  return detectAllowedSource(item) === "official_blog" ? "article" : "post";
}

function canonicalDailyDigestPlatform(value, sourcePage) {
  const normalized = normalizedText(value);
  const host = normalizeHost(sourcePage);

  if (normalized.includes("hacker news") || host.endsWith("news.ycombinator.com")) {
    return "Hacker News";
  }
  if (normalized.includes("hugging face") || host.endsWith("huggingface.co")) {
    return "Hugging Face Papers";
  }
  if (normalized.includes("clawfeed") || host.endsWith("clawfeed.kevinhe.io")) {
    return "ClawFeed";
  }
  if (normalized.includes("tldr") || host.endsWith("tldr.tech")) {
    return "TLDR AI";
  }
  return "";
}

function canonicalDailyDigestTopic(value) {
  const normalized = normalizedText(value);
  if (!normalized) {
    return "";
  }
  if (normalized.includes("research") || normalized.includes("paper")) {
    return "research";
  }
  if (normalized.includes("model")) {
    return "model-release";
  }
  if (normalized.includes("benchmark")) {
    return "benchmark";
  }
  if (normalized.includes("agent")) {
    return "agent";
  }
  if (normalized.includes("tool")) {
    return "tooling";
  }
  if (normalized.includes("workflow")) {
    return "workflow";
  }
  if (normalized.includes("infra")) {
    return "infra";
  }
  if (normalized.includes("product")) {
    return "product";
  }
  if (normalized.includes("business") || normalized.includes("growth") || normalized.includes("startup")) {
    return "business";
  }
  if (normalized.includes("safety")) {
    return "safety";
  }
  if (normalized.includes("data")) {
    return "data";
  }
  return "";
}

function validateGeneralItems(items, window, maxItems) {
  const validItems = [];

  for (const item of Array.isArray(items) ? items : []) {
    if (!item || typeof item !== "object") {
      continue;
    }

    if (!detectAllowedSource(item)) {
      continue;
    }

    const publishedAt = parseIsoDate(item.published_at);
    if (!publishedAt) {
      continue;
    }

    const publishedDateKey = getHktDateKey(publishedAt);
    const endDateKey = getHktDateKey(window.end);
    if (publishedDateKey !== endDateKey) {
      continue;
    }

    if (publishedAt.getTime() < window.start.getTime() || publishedAt.getTime() > window.end.getTime()) {
      continue;
    }

    const scores = item?.scores && typeof item.scores === "object" ? item.scores : {};

    validItems.push({
      ...item,
      platform: canonicalPlatform(item),
      kind: canonicalKind(item),
      published_at: formatHktIso(publishedAt),
      scores: {
        novelty: normalizeScore(scores.novelty),
        value: normalizeScore(scores.value),
        heat: normalizeScore(scores.heat),
        overall: normalizeScore(scores.overall),
      },
    });
  }

  validItems.sort((left, right) => {
    const score = (item) => (item?.scores?.overall || 0) + sourcePriority(item);
    const source = (item) => sourcePriority(item);
    const value = (item) => item?.scores?.value || 0;
    const novelty = (item) => item?.scores?.novelty || 0;
    const heat = (item) => item?.scores?.heat || 0;

    const leftRank = [score(left), source(left), value(left), novelty(left), heat(left)];
    const rightRank = [score(right), source(right), value(right), novelty(right), heat(right)];

    for (let index = 0; index < leftRank.length; index += 1) {
      if (leftRank[index] !== rightRank[index]) {
        return rightRank[index] - leftRank[index];
      }
    }

    return 0;
  });

  return validItems.slice(0, maxItems);
}

function validateDailyDigestItems(items, { pages, window, maxItems }) {
  const pageBySourcePage = new Map();
  const pageByPlatform = new Map();

  for (const page of pages) {
    pageBySourcePage.set(page.source_page, page);
    pageByPlatform.set(page.label, page);
  }

  const validItems = [];
  for (const item of Array.isArray(items) ? items : []) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const hintedPlatform = canonicalDailyDigestPlatform(item.platform, item.source_page);
    const sourcePage =
      canonicalizeExternalUrl(item.source_page) || pageByPlatform.get(hintedPlatform)?.source_page || "";
    const platform = canonicalDailyDigestPlatform(item.platform, sourcePage);
    if (!platform) {
      continue;
    }

    const link = canonicalizeExternalUrl(item.link) || sourcePage;
    if (!link) {
      continue;
    }

    const sourcePageRecord = pageBySourcePage.get(sourcePage) || pageByPlatform.get(platform);
    const fallbackDateKey = String(sourcePageRecord?.source_date_key || window.utc_date || "").trim();
    const fallbackPublishedAt =
      resolveDailyDigestFallbackDate(fallbackDateKey, window.end) ||
      parseIsoDate(sourcePageRecord?.fallback_published_at) ||
      resolveDailyDigestFallbackDate(window.utc_date, window.end);
    let publishedAt = parseIsoDate(item.published_at);
    if (!publishedAt || publishedAt.getTime() > window.end.getTime()) {
      publishedAt = fallbackPublishedAt;
    }
    if (!publishedAt) {
      continue;
    }

    const scores = item?.scores && typeof item.scores === "object" ? item.scores : {};
    validItems.push({
      platform,
      title: normalizeText(item.title) || "Untitled",
      author: normalizeText(item.author) || platform,
      published_at: formatHktIso(publishedAt),
      link,
      source_page: sourcePage || link,
      source_signal: normalizeText(item.source_signal),
      recommendation: normalizeText(item.recommendation),
      summary: normalizeText(item.summary),
      takeaways: uniqueStrings(item.takeaways),
      topic: canonicalDailyDigestTopic(item.topic),
      scores: {
        novelty: normalizeScore(scores.novelty),
        value: normalizeScore(scores.value),
        heat: normalizeScore(scores.heat),
        overall: normalizeScore(scores.overall),
      },
    });
  }

  validItems.sort((left, right) => {
    const leftRank = [
      left?.scores?.overall || 0,
      left?.scores?.value || 0,
      left?.scores?.novelty || 0,
      left?.scores?.heat || 0,
      parseIsoDate(left.published_at)?.getTime() || 0,
    ];
    const rightRank = [
      right?.scores?.overall || 0,
      right?.scores?.value || 0,
      right?.scores?.novelty || 0,
      right?.scores?.heat || 0,
      parseIsoDate(right.published_at)?.getTime() || 0,
    ];

    for (let index = 0; index < leftRank.length; index += 1) {
      if (leftRank[index] !== rightRank[index]) {
        return rightRank[index] - leftRank[index];
      }
    }

    return String(left.title || "").localeCompare(String(right.title || ""));
  });

  return validItems.slice(0, maxItems);
}

function normalizeHandle(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replace(/^@+/, "");
}

function uniqueHandles(handles) {
  const seen = new Set();
  const items = [];

  for (const handle of Array.isArray(handles) ? handles : []) {
    const normalized = normalizeHandle(handle);
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    items.push(normalized);
  }

  return items;
}

function batchHandles(handles, batchSize) {
  const batches = [];
  for (let index = 0; index < handles.length; index += batchSize) {
    batches.push(handles.slice(index, index + batchSize));
  }
  return batches;
}

function canonicalizePostLink(value) {
  const url = canonicalizeExternalUrl(value);
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.replace(/\/+$/, "");
    if (!host.endsWith("x.com") || !/\/status\/\d+$/i.test(pathname)) {
      return "";
    }
    return `https://x.com${pathname}`;
  } catch {
    return "";
  }
}

function extractHandleFromLink(link) {
  try {
    const url = new URL(link);
    const parts = url.pathname.split("/").filter(Boolean);
    return normalizeHandle(parts[0] || "");
  } catch {
    return "";
  }
}

function canonicalizeExternalUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    const url = new URL(value.trim());
    const canonicalPaperUrl = canonicalizePaperUrl(url);
    if (canonicalPaperUrl) {
      return canonicalPaperUrl;
    }

    url.protocol = "https:";
    url.hostname = url.hostname.replace(/^www\./i, "").toLowerCase();
    if (url.hostname === "twitter.com") {
      url.hostname = "x.com";
    }
    url.hash = "";

    const params = new URLSearchParams(url.search);
    for (const key of [...params.keys()]) {
      const normalized = key.toLowerCase();
      if (
        normalized.startsWith("utm_") ||
        normalized === "ref" ||
        normalized === "ref_src" ||
        normalized === "s" ||
        normalized === "t" ||
        normalized === "fbclid"
      ) {
        params.delete(key);
      }
    }

    const strippedQueryHosts = ["x.com", "reddit.com", "redd.it"];
    if (strippedQueryHosts.some((host) => url.hostname.endsWith(host))) {
      url.search = "";
    } else {
      const sorted = [...params.entries()].sort(([left], [right]) => left.localeCompare(right));
      const normalizedSearch = new URLSearchParams(sorted);
      const query = normalizedSearch.toString();
      url.search = query ? `?${query}` : "";
    }

    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
  } catch {
    return "";
  }
}

function preferredExternalUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    const url = new URL(value.trim());
    const canonicalPaperUrl = canonicalizePaperUrl(url);
    if (canonicalPaperUrl) {
      return canonicalPaperUrl;
    }
    return value.trim();
  } catch {
    return String(value || "").trim();
  }
}

function canonicalizePaperUrl(url) {
  const paperId = extractPaperIdFromUrl(url);
  if (!paperId) {
    return "";
  }

  if (isArxivPaperId(paperId)) {
    return `https://arxiv.org/abs/${paperId}`;
  }

  return `https://huggingface.co/papers/${paperId}`;
}

function extractPaperIdFromUrl(url) {
  const host = String(url?.hostname || "").replace(/^www\./i, "").toLowerCase();
  const pathname = String(url?.pathname || "").replace(/\/+$/, "");

  if (host.endsWith("huggingface.co")) {
    const match = pathname.match(/^\/papers\/(.+)$/i);
    return normalizePaperId(match?.[1] || "");
  }

  if (host.endsWith("arxiv.org")) {
    const match = pathname.match(/^\/(?:abs|pdf|html|format)\/(.+)$/i);
    return normalizePaperId(match?.[1] || "");
  }

  return "";
}

function normalizePaperId(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/\.pdf$/i, "")
    .replace(/v\d+$/i, "");
}

function isArxivPaperId(value) {
  const normalized = normalizePaperId(value);
  return (
    /^\d{4}\.\d{4,5}$/i.test(normalized) ||
    /^[a-z-]+(?:\.[a-z-]+)?\/\d{7}$/i.test(normalized)
  );
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function compressText(value, limit) {
  const text = normalizeText(value).replace(/\s+/g, " ");
  if (!text) {
    return "";
  }
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit - 1).trimEnd()}…`;
}

function truncateText(value, limit) {
  const text = normalizeText(value);
  if (!text) {
    return "";
  }
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit - 1).trimEnd()}…`;
}

function pickFirstText(values) {
  for (const value of values) {
    const text = compressText(value, 220);
    if (text) {
      return text;
    }
  }
  return "";
}

function joinSentences(...values) {
  return values.map((value) => normalizeText(value)).filter(Boolean).join(" ");
}

function splitTags(value) {
  return uniqueStrings(
    normalizeText(value)
      .split(/[\/,|]+/g)
      .map((item) => item.trim()),
  );
}

function uniqueStrings(values) {
  const items = [];
  const seen = new Set();

  for (const value of Array.isArray(values) ? values : []) {
    const text = normalizeText(value);
    if (!text) {
      continue;
    }
    const key = text.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    items.push(text);
  }

  return items;
}

function createStableId(value) {
  return createHash("sha1").update(String(value)).digest("hex").slice(0, 16);
}

function isSnapshotFresh(snapshot, refreshHours, now) {
  const updatedAt = parseIsoDate(snapshot?.source?.updated_at);
  if (!updatedAt) {
    return false;
  }
  const ageMs = now.getTime() - updatedAt.getTime();
  return ageMs < refreshHours * 60 * 60 * 1000;
}

function makeEmptySnapshot(source) {
  return {
    source: {
      id: source.id,
      name: source.name,
      type: source.type,
      refresh_hours: source.refreshHours,
      updated_at: null,
      item_count: 0,
      window_start: null,
      window_end: null,
    },
    items: [],
  };
}

function getSnapshotPath(sourceId) {
  return path.join(SOURCES_DIR, `${sourceId}.json`);
}

async function maybeWriteInitialSnapshot(filePath, existingSnapshot, snapshot) {
  if (existingSnapshot) {
    return;
  }
  await writeJson(filePath, snapshot);
}

async function ensureDir(targetPath) {
  await fs.mkdir(targetPath, { recursive: true });
}

async function readJsonOrNull(filePath) {
  try {
    const contents = await fs.readFile(filePath, "utf8");
    return JSON.parse(contents);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

await main();
