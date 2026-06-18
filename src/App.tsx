import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { HistoryReportIndexItem, WeeklyNewsReport } from "@/types/report";
import { loadHistoryIndex, loadHistoryReport, loadLatestReport } from "@/lib/reportLoader";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { ExportPanel } from "@/components/ExportPanel";
import { Header } from "@/components/Header";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { LoadingState } from "@/components/LoadingState";
import { NewsDashboard } from "@/components/NewsDashboard";
import { WeeklyOverview } from "@/components/WeeklyOverview";

type LoadState = "loading" | "ready" | "empty" | "error";

export default function App() {
  const [report, setReport] = useState<WeeklyNewsReport | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryReportIndexItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("未知错误");
  const [historyOpen, setHistoryOpen] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  async function bootstrap() {
    setLoadState("loading");
    setErrorMessage("未知错误");

    try {
      const [latestReport, historyIndex] = await Promise.all([loadLatestReport(), loadHistoryIndex()]);
      setHistoryItems(historyIndex);

      if (!latestReport || !latestReport.items || !Array.isArray(latestReport.items)) {
        setReport(null);
        setLoadState("empty");
        return;
      }

      setReport(latestReport);
      setLoadState("ready");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "读取周报数据时发生错误");
      setLoadState("error");
    }
  }

  useEffect(() => {
    void bootstrap();
  }, []);

  const latestReportId = useMemo(() => report?.id, [report]);

  async function handleSelectHistory(item: HistoryReportIndexItem) {
    try {
      const historyReport = await loadHistoryReport(item.path);
      if (!historyReport) {
        toast.error("未找到对应历史周报文件");
        return;
      }
      setReport(historyReport);
      setHistoryOpen(false);
      setLoadState("ready");
      toast.success(`已切换到 ${item.title}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "历史周报加载失败");
    }
  }

  function focusExportPanel() {
    document.getElementById("export-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="min-h-screen bg-[#fff7f5] text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        {loadState === "loading" ? <LoadingState /> : null}
        {loadState === "error" ? <ErrorState message={errorMessage} onRetry={() => void bootstrap()} /> : null}
        {loadState === "empty" ? <EmptyState /> : null}

        {loadState === "ready" && report ? (
          <div className="space-y-6" ref={reportRef}>
            <Header
              report={report}
              historyCount={historyItems.length}
              onOpenHistory={() => setHistoryOpen(true)}
              onExportFocus={focusExportPanel}
            />
            <WeeklyOverview report={report} />
            <ExportPanel report={report} targetElement={reportRef.current} />
            <NewsDashboard report={report} />
            <KeyTakeaways report={report} />
            <div className="rounded-[28px] border border-red-100 bg-white px-6 py-5 text-sm leading-7 text-slate-600 shadow-sm">
              数据来源说明：仅展示最近7天内、具备真实发布时间与可访问链接的新闻；检索范围不只限企业官网，也包括官方媒体、官方微博、官方微信公众号公开发布内容，以及监管公告与权威行业媒体。
            </div>
          </div>
        ) : null}
      </div>

      <HistoryDrawer
        open={historyOpen}
        historyItems={historyItems}
        currentReportId={latestReportId}
        onOpenChange={setHistoryOpen}
        onSelect={(item) => void handleSelectHistory(item)}
      />
    </div>
  );
}
