import { Copy, Download, FileDown, FileImage, FileText } from "lucide-react";
import { toast } from "sonner";

import {
  buildReportMarkdown,
  copyText,
  exportCsv,
  exportElementAsPdf,
  exportElementAsPng,
  exportMarkdown,
  getExportFileStem,
  getReportSummaryLabel,
} from "@/lib/exportUtils";
import type { WeeklyNewsReport } from "@/types/report";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExportPanelProps {
  report: WeeklyNewsReport;
  targetElement: HTMLElement | null;
}

export function ExportPanel({ report, targetElement }: ExportPanelProps) {
  async function handleCopyFullMarkdown() {
    await copyText(buildReportMarkdown(report));
    toast.success("已复制完整周报 Markdown");
  }

  async function handlePdf() {
    if (!targetElement) {
      toast.error("导出目标未准备好，请稍后重试");
      return;
    }
    await exportElementAsPdf(targetElement, `${getExportFileStem(report)}.pdf`);
    toast.success("PDF 已开始下载");
  }

  async function handlePng() {
    if (!targetElement) {
      toast.error("导出目标未准备好，请稍后重试");
      return;
    }
    await exportElementAsPng(targetElement, `${getExportFileStem(report)}.png`);
    toast.success("PNG 已开始下载");
  }

  return (
    <Card id="export-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-950">
          <Download className="size-5 text-sky-700" />
          导出与复制
        </CardTitle>
        <p className="text-sm leading-7 text-slate-500">{getReportSummaryLabel(report)}</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Button variant="outline" onClick={handleCopyFullMarkdown}>
          <Copy className="size-4" />
          复制完整 Markdown
        </Button>
        <Button variant="outline" onClick={() => exportMarkdown(report)}>
          <FileText className="size-4" />
          导出 Markdown
        </Button>
        <Button variant="outline" onClick={() => exportCsv(report)}>
          <FileDown className="size-4" />
          导出 CSV
        </Button>
        <Button variant="outline" onClick={handlePdf}>
          <FileText className="size-4" />
          导出 PDF
        </Button>
        <Button variant="outline" onClick={handlePng}>
          <FileImage className="size-4" />
          导出 PNG 长图
        </Button>
      </CardContent>
    </Card>
  );
}
