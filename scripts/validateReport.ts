import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { z } from "zod";

import type { WeeklyNewsReport } from "../src/types/report";
import { buildHistoryTitle } from "../src/lib/dateUtils";
import {
  ALLOWED_CATEGORIES,
  ALLOWED_PRIMARY_SECTIONS,
  BANNED_DOMAINS,
  ensureDirectoryPaths,
  isWithinRange,
} from "./shared";

const newsItemSchema = z.object({
  id: z.string().min(1),
  primarySection: z.enum(ALLOWED_PRIMARY_SECTIONS),
  companyOrBrand: z.string().optional(),
  title: z.string().min(1),
  dateRange: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(3).max(5),
  summary: z.string().min(1),
  sourceName: z.string().min(1),
  sourceUrl: z.string().url(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.enum(ALLOWED_CATEGORIES),
  importanceScore: z.number().int().min(0).max(100),
});

const weeklyNewsReportSchema = z.object({
  id: z.string().min(1),
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weekEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  generatedAt: z.string().min(1),
  overview: z.string().min(1),
  items: z.array(newsItemSchema).max(10),
  keyTakeaways: z.array(z.string().min(1)).min(3).max(5),
});

export function validateReportData(report: unknown): WeeklyNewsReport {
  const parsed = weeklyNewsReportSchema.parse(report);

  for (const item of parsed.items) {
    if (!item.summary.startsWith("概览：")) {
      throw new Error(`Item "${item.title}" summary must start with "概览："`);
    }
    if (!isWithinRange(item.publishedAt, parsed.weekStart, parsed.weekEnd)) {
      throw new Error(`Item "${item.title}" publishedAt ${item.publishedAt} is outside report range`);
    }
    if (item.sourceUrl.includes("example.com")) {
      throw new Error(`Item "${item.title}" has placeholder sourceUrl`);
    }
    if (
      BANNED_DOMAINS.some((domain) => {
        const hostname = new URL(item.sourceUrl).hostname.toLowerCase();
        return hostname === domain || hostname.endsWith(`.${domain}`);
      })
    ) {
      throw new Error(`Item "${item.title}" uses banned source domain`);
    }
  }

  return parsed;
}

async function main() {
  const { publicDataDir } = ensureDirectoryPaths();
  const latestReportPath = path.join(publicDataDir, "latest-report.json");
  const payload = JSON.parse(await fs.readFile(latestReportPath, "utf8"));
  const parsed = validateReportData(payload);
  console.log(`Validated ${parsed.id} successfully (${parsed.items.length} items).`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { weeklyNewsReportSchema, buildHistoryTitle };
