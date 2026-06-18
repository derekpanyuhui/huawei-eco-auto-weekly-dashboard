import fs from "node:fs/promises";
import path from "node:path";

import OpenAI from "openai";

import type { NewsCategory, NewsPrimarySection, WeeklyNewsReport } from "../src/types/report";
import { formatMonthDay } from "../src/lib/dateUtils";
import { WEEKLY_NEWS_PROMPT } from "../src/lib/newsPrompt";
import {
  ensureDirectoryPaths,
  sanitizeModelJson,
  toChinaDateTimeOffset,
  type RawNewsSearchResult,
} from "./shared";
import { updateHistoryIndex } from "./updateHistoryIndex";
import { validateReportData } from "./validateReport";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeCategory(category: string): NewsCategory {
  const normalized = category.trim() as NewsCategory;
  const map: Record<string, NewsCategory> = {
    产销数据: "产销交付",
    交付: "产销交付",
    技术发布: "新品技术",
    新品发布: "新品技术",
    战略签约: "战略合作",
    人事变动: "人事组织",
    组织调整: "人事组织",
    大会活动: "行业大会",
    投融资: "投融资产能",
    热点: "行业热点",
  };

  return map[normalized] ?? normalized;
}

function normalizeSection(section: string): NewsPrimarySection {
  if (section === "战略合作伙伴") {
    return "战略合作伙伴板块";
  }
  if (section === "界境塔生态") {
    return "界境塔生态板块";
  }
  if (section === "行业热点") {
    return "车圈行业热点板块";
  }
  return section as NewsPrimarySection;
}

async function main() {
  const apiKey = requireEnv("OPENAI_API_KEY");
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const { tmpDir, publicDataDir, historyDir } = ensureDirectoryPaths();
  const rawPath = path.join(tmpDir, "raw-news.json");
  const rawPayload = JSON.parse(await fs.readFile(rawPath, "utf8")) as RawNewsSearchResult;

  if (!rawPayload.items.length) {
    throw new Error("No raw news items found. Aborting report generation.");
  }

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model,
    instructions: WEEKLY_NEWS_PROMPT,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `请基于以下最近7天真实新闻搜索结果，生成严格 JSON。\nweekStart=${rawPayload.weekStart}\nweekEnd=${rawPayload.weekEnd}\ngeneratedAt=${rawPayload.generatedAt}\nnews=${JSON.stringify(
              rawPayload.items,
              null,
              2,
            )}`,
          },
        ],
      },
    ],
  });

  const text = sanitizeModelJson(response.output_text);
  const parsed = JSON.parse(text) as WeeklyNewsReport;

  const hydrated: WeeklyNewsReport = {
    ...parsed,
    id: `weekly-report-${rawPayload.weekEnd}`,
    weekStart: rawPayload.weekStart,
    weekEnd: rawPayload.weekEnd,
    generatedAt: toChinaDateTimeOffset(),
    overview: parsed.overview.trim().slice(0, 150),
    items: parsed.items
      .map((item, index) => ({
        ...item,
        id: item.id || `news-${index + 1}`,
        primarySection: normalizeSection(item.primarySection),
        category: normalizeCategory(item.category),
        dateRange: item.dateRange || formatMonthDay(item.publishedAt),
        summary: item.summary.startsWith("概览：") ? item.summary : `概览：${item.summary}`,
        importanceScore: Math.max(0, Math.min(100, Math.round(item.importanceScore))),
      }))
      .slice(0, 10),
    keyTakeaways: parsed.keyTakeaways.slice(0, 5),
  };

  const validated = validateReportData(hydrated);

  await fs.mkdir(publicDataDir, { recursive: true });
  await fs.mkdir(historyDir, { recursive: true });

  const latestPath = path.join(publicDataDir, "latest-report.json");
  const historyPath = path.join(historyDir, `${validated.weekEnd}.json`);

  await fs.writeFile(latestPath, JSON.stringify(validated, null, 2), "utf8");
  await fs.writeFile(historyPath, JSON.stringify(validated, null, 2), "utf8");
  await updateHistoryIndex();

  console.log(`Generated weekly report ${validated.id} with ${validated.items.length} items.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
