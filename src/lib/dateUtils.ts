const zhDateTime = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const zhDate = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const monthDay = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  month: "2-digit",
  day: "2-digit",
});

function normalizeParts(parts: Intl.DateTimeFormatPart[]) {
  return Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  ) as Record<string, string>;
}

export function formatReportRange(weekStart: string, weekEnd: string) {
  return `${formatDateCn(weekStart)}-${formatDateCn(weekEnd)}`;
}

export function formatDateCn(value: string) {
  const parts = normalizeParts(zhDate.formatToParts(new Date(`${value}T00:00:00+08:00`)));
  return `${parts.year}年${parts.month}月${parts.day}日`;
}

export function formatMonthDay(value: string) {
  const parts = normalizeParts(monthDay.formatToParts(new Date(`${value}T00:00:00+08:00`)));
  return `${parts.month}月${parts.day}日`;
}

export function formatGeneratedAt(value: string) {
  const parts = normalizeParts(zhDateTime.formatToParts(new Date(value)));
  return `${parts.year}年${parts.month}月${parts.day}日 ${parts.hour}:${parts.minute}`;
}

export function buildOverviewHeading(weekStart: string, weekEnd: string) {
  return `基于搜索结果，我将为您提供本周（${formatReportRange(weekStart, weekEnd)}）的热点新闻分析：`;
}

export function buildHistoryTitle(weekStart: string, weekEnd: string) {
  return `${formatDateCn(weekStart)}-${formatDateCn(weekEnd)} 周报`;
}
