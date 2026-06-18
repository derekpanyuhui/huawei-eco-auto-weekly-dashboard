import fs from "node:fs/promises";
import path from "node:path";

import {
  HOT_TOPIC_TARGETS,
  REPORT_SECTION_TARGETS,
  containsBannedDomain,
  ensureDirectoryPaths,
  getWeekRange,
  isWithinRange,
  scoreAuthority,
  slugify,
  toChinaDateTimeOffset,
  toChinaDateString,
  type RawNewsItem,
  type RawNewsSearchResult,
  type SearchTarget,
} from "./shared";

interface NormalizedArticle {
  title: string;
  url: string;
  publishedAt: string;
  summary: string;
  sourceName: string;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildRequestUrl(endpoint: string, apiKey: string, query: string, weekStart: string, weekEnd: string) {
  if (endpoint.includes("{query}")) {
    return endpoint
      .replaceAll("{query}", encodeURIComponent(query))
      .replaceAll("{from}", encodeURIComponent(weekStart))
      .replaceAll("{to}", encodeURIComponent(weekEnd))
      .replaceAll("{apiKey}", encodeURIComponent(apiKey));
  }

  const url = new URL(endpoint);
  url.searchParams.set("q", query);
  url.searchParams.set("query", query);
  url.searchParams.set("from", weekStart);
  url.searchParams.set("to", weekEnd);
  url.searchParams.set("pageSize", "10");
  url.searchParams.set("language", "zh");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("apiKey", apiKey);
  return url.toString();
}

function normalizeDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const directDate = value.match(/\d{4}-\d{2}-\d{2}/)?.[0];
    return directDate ?? "";
  }
  return toChinaDateString(date);
}

function normalizeSourceName(item: Record<string, unknown>) {
  const source = item.source;
  if (typeof source === "object" && source && "name" in source && typeof source.name === "string") {
    return source.name;
  }

  const candidate =
    (typeof item.sourceName === "string" && item.sourceName) ||
    (typeof item.source_name === "string" && item.source_name) ||
    (typeof item.publisher === "string" && item.publisher) ||
    (typeof item.source === "string" && item.source) ||
    "";

  return candidate.trim();
}

function normalizeResponse(payload: unknown): NormalizedArticle[] {
  const record = (payload ?? {}) as Record<string, unknown>;
  const candidates =
    (Array.isArray(record.articles) && record.articles) ||
    (Array.isArray(record.data) && record.data) ||
    (Array.isArray(record.items) && record.items) ||
    (Array.isArray(record.results) && record.results) ||
    (Array.isArray(record.news) && record.news) ||
    (Array.isArray(record.value) && record.value) ||
    (Array.isArray(record.news_results) && record.news_results) ||
    (Array.isArray(record.organic_results) && record.organic_results) ||
    [];

  return candidates
    .map((entry) => {
      const item = entry as Record<string, unknown>;
      const title =
        (typeof item.title === "string" && item.title) ||
        (typeof item.name === "string" && item.name) ||
        (typeof item.headline === "string" && item.headline) ||
        "";
      const url =
        (typeof item.url === "string" && item.url) ||
        (typeof item.link === "string" && item.link) ||
        (typeof item.news_url === "string" && item.news_url) ||
        "";
      const publishedAt = normalizeDate(
        item.publishedAt ?? item.published_at ?? item.pubDate ?? item.date ?? item.time,
      );
      const summary =
        (typeof item.description === "string" && item.description) ||
        (typeof item.summary === "string" && item.summary) ||
        (typeof item.snippet === "string" && item.snippet) ||
        (typeof item.excerpt === "string" && item.excerpt) ||
        "";
      const sourceName = normalizeSourceName(item);

      return {
        title: title.trim(),
        url: url.trim(),
        publishedAt,
        summary: summary.trim(),
        sourceName: sourceName.trim(),
      };
    })
    .filter((item) => item.title && item.url && item.publishedAt);
}

function matchesRequiredKeywords(article: NormalizedArticle, target: SearchTarget) {
  const haystack = `${article.title} ${article.summary}`.toLowerCase();
  return target.requiredKeywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function isHttpsUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

async function fetchArticlesForQuery(
  endpoint: string,
  apiKey: string,
  target: SearchTarget,
  query: string,
  weekStart: string,
  weekEnd: string,
) {
  const requestUrl = buildRequestUrl(endpoint, apiKey, query, weekStart, weekEnd);
  const response = await fetch(requestUrl, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`News search request failed (${response.status}) for query: ${query}`);
  }

  const payload = (await response.json()) as unknown;
  const articles = normalizeResponse(payload)
    .filter((article) => isHttpsUrl(article.url))
    .filter((article) => !containsBannedDomain(article.url))
    .filter((article) => isWithinRange(article.publishedAt, weekStart, weekEnd))
    .filter((article) => matchesRequiredKeywords(article, target))
    .map<RawNewsItem>((article) => ({
      id: slugify(`${target.primarySection}-${target.companyOrBrand ?? "topic"}-${article.title}`),
      primarySection: target.primarySection,
      companyOrBrand: target.companyOrBrand,
      query,
      title: article.title,
      summary: article.summary,
      sourceName: article.sourceName || new URL(article.url).hostname,
      sourceUrl: article.url,
      publishedAt: article.publishedAt,
      authorityScore: scoreAuthority(article.url, article.sourceName),
      matchedKeywords: target.requiredKeywords.filter((keyword) =>
        `${article.title} ${article.summary}`.toLowerCase().includes(keyword.toLowerCase()),
      ),
    }));

  return articles;
}

function dedupeItems(items: RawNewsItem[]) {
  const map = new Map<string, RawNewsItem>();

  for (const item of items.sort((a, b) => b.authorityScore - a.authorityScore)) {
    const key = `${item.publishedAt}-${item.title.replace(/\s+/g, "").toLowerCase()}`;
    const existing = map.get(key);
    if (!existing || item.authorityScore > existing.authorityScore) {
      map.set(key, item);
    }
  }

  return [...map.values()].sort((a, b) => b.authorityScore - a.authorityScore);
}

async function collectByTargets(targets: SearchTarget[], endpoint: string, apiKey: string, weekStart: string, weekEnd: string) {
  const collected: RawNewsItem[] = [];

  for (const target of targets) {
    for (const query of target.queries) {
      const articles = await fetchArticlesForQuery(endpoint, apiKey, target, query, weekStart, weekEnd);
      collected.push(...articles);
    }
  }

  return dedupeItems(collected);
}

async function main() {
  const apiKey = requireEnv("NEWS_SEARCH_API_KEY");
  const endpoint = requireEnv("NEWS_SEARCH_ENDPOINT");
  const { weekStart, weekEnd } = getWeekRange();
  const { tmpDir } = ensureDirectoryPaths();

  const sectionItems = await collectByTargets(REPORT_SECTION_TARGETS, endpoint, apiKey, weekStart, weekEnd);
  const hasPartnerNews = sectionItems.some((item) => item.primarySection === "战略合作伙伴板块");
  const hasBrandNews = sectionItems.some((item) => item.primarySection === "界境塔生态板块");

  let items = sectionItems;

  if (!hasPartnerNews && !hasBrandNews) {
    const fallbackItems = await collectByTargets(HOT_TOPIC_TARGETS, endpoint, apiKey, weekStart, weekEnd);
    items = dedupeItems([...sectionItems, ...fallbackItems]).slice(0, 10);
  }

  if (!items.length) {
    throw new Error("No valid real-news items found within the last 7 days. Latest report will not be updated.");
  }

  const result: RawNewsSearchResult = {
    id: `raw-weekly-news-${weekEnd}`,
    weekStart,
    weekEnd,
    generatedAt: toChinaDateTimeOffset(),
    items,
  };

  await fs.mkdir(tmpDir, { recursive: true });
  await fs.writeFile(path.join(tmpDir, "raw-news.json"), JSON.stringify(result, null, 2), "utf8");

  console.log(`Saved ${items.length} raw news items to tmp/weekly-news/raw-news.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
