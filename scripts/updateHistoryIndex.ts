import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { HistoryReportIndexItem, WeeklyNewsReport } from "../src/types/report";
import { buildHistoryTitle } from "../src/lib/dateUtils";
import { ensureDirectoryPaths } from "./shared";
import { validateReportData } from "./validateReport";

export async function updateHistoryIndex() {
  const { historyDir } = ensureDirectoryPaths();
  await fs.mkdir(historyDir, { recursive: true });

  const files = (await fs.readdir(historyDir)).filter((file) => file.endsWith(".json") && file !== "index.json");
  const indexItems: HistoryReportIndexItem[] = [];

  for (const file of files) {
    const payload = JSON.parse(await fs.readFile(path.join(historyDir, file), "utf8")) as WeeklyNewsReport;
    const report = validateReportData(payload);
    indexItems.push({
      id: report.id,
      weekStart: report.weekStart,
      weekEnd: report.weekEnd,
      generatedAt: report.generatedAt,
      title: buildHistoryTitle(report.weekStart, report.weekEnd),
      path: `/data/history/${file}`,
      count: report.items.length,
    });
  }

  indexItems.sort((a, b) => b.weekEnd.localeCompare(a.weekEnd));
  await fs.writeFile(path.join(historyDir, "index.json"), JSON.stringify(indexItems, null, 2), "utf8");
  return indexItems;
}

async function main() {
  const index = await updateHistoryIndex();
  console.log(`Updated history index with ${index.length} report(s).`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
