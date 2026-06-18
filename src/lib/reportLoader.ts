import type { HistoryReportIndexItem, WeeklyNewsReport } from "@/types/report";

export function resolveDataPath(path: string) {
  const base = import.meta.env.BASE_URL;
  return `${base}${path.replace(/^\//, "")}`;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  const response = await fetch(resolveDataPath(path), {
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  return JSON.parse(text) as T;
}

export async function loadLatestReport() {
  return fetchJson<WeeklyNewsReport>("/data/latest-report.json");
}

export async function loadHistoryIndex() {
  const index = await fetchJson<HistoryReportIndexItem[]>("/data/history/index.json");
  return index ?? [];
}

export async function loadHistoryReport(path: string) {
  return fetchJson<WeeklyNewsReport>(path);
}
