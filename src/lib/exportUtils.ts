import { buildOverviewHeading, formatReportRange } from "@/lib/dateUtils";
import type { NewsItem, WeeklyNewsReport } from "@/types/report";

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildNewsItemMarkdown(item: NewsItem) {
  const companyLine = item.companyOrBrand ? `## **${item.companyOrBrand}**\n` : "";
  return `${companyLine}## ${item.title}（${item.dateRange}）\n${item.keywords.join("·")}\n${item.summary}\n[阅读原文](${item.sourceUrl})`;
}

export function buildReportMarkdown(report: WeeklyNewsReport) {
  const sections = [
    "战略合作伙伴板块",
    "界境塔生态板块",
    "车圈行业热点板块",
  ] as const;

  const sectionChunks = sections
    .map((section) => {
      const items = report.items.filter((item) => item.primarySection === section);
      if (!items.length) {
        return "";
      }

      const grouped = new Map<string, NewsItem[]>();
      for (const item of items) {
        const key = item.companyOrBrand ?? "__no-company__";
        grouped.set(key, [...(grouped.get(key) ?? []), item]);
      }

      const body = [...grouped.entries()]
        .map(([company, companyItems]) => {
          const prefix = company === "__no-company__" ? "" : `## **${company}**\n`;
          const details = companyItems
            .map(
              (item) =>
                `## ${item.title}（${item.dateRange}）\n${item.keywords.join("·")}\n${item.summary}\n[阅读原文](${item.sourceUrl})`,
            )
            .join("\n---\n");
          return `${prefix}${details}`;
        })
        .join("\n---\n");

      return `# ${section}\n${body}`;
    })
    .filter(Boolean)
    .join("\n---\n");

  return `${buildOverviewHeading(report.weekStart, report.weekEnd)}
# 🤖 本周华为生态与智能汽车行业新闻周报 🔆
## ✍️ 概览：
${report.overview}
---
${sectionChunks}
---
# 关键总结
${report.keyTakeaways.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function exportMarkdown(report: WeeklyNewsReport) {
  const content = buildReportMarkdown(report);
  triggerDownload(new Blob([content], { type: "text/markdown;charset=utf-8" }), `${report.id}.md`);
}

export function exportCsv(report: WeeklyNewsReport) {
  const rows = [
    [
      "primarySection",
      "companyOrBrand",
      "title",
      "dateRange",
      "keywords",
      "summary",
      "sourceName",
      "sourceUrl",
      "publishedAt",
      "category",
      "importanceScore",
    ],
    ...report.items.map((item) => [
      item.primarySection,
      item.companyOrBrand ?? "",
      item.title,
      item.dateRange,
      item.keywords.join("|"),
      item.summary,
      item.sourceName,
      item.sourceUrl,
      item.publishedAt,
      item.category,
      String(item.importanceScore),
    ]),
  ];

  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${report.id}.csv`);
}

export async function exportElementAsPng(element: HTMLElement, fileName: string) {
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(element, {
    backgroundColor: "#fff7f5",
    scale: 2,
    useCORS: true,
  });
  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }
    triggerDownload(blob, fileName);
  }, "image/png");
}

export async function exportElementAsPdf(element: HTMLElement, fileName: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const canvas = await html2canvas(element, {
    backgroundColor: "#fff7f5",
    scale: 2,
    useCORS: true,
  });
  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const imageWidth = canvas.width * ratio;
  const imageHeight = canvas.height * ratio;

  let offsetY = 0;
  let remainingHeight = imageHeight;

  while (remainingHeight > 0) {
    pdf.addImage(imageData, "PNG", 0, offsetY, imageWidth, imageHeight);
    remainingHeight -= pageHeight;
    if (remainingHeight > 0) {
      pdf.addPage();
      offsetY -= pageHeight;
    }
  }

  pdf.save(fileName);
}

export function getExportFileStem(report: WeeklyNewsReport) {
  return `huawei-weekly-report-${report.weekEnd}`;
}

export function getReportSummaryLabel(report: WeeklyNewsReport) {
  return `${formatReportRange(report.weekStart, report.weekEnd)} | ${report.items.length} 条新闻`;
}
