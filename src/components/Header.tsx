import { CalendarRange, CheckCircle2, Download, History } from "lucide-react";

import { formatGeneratedAt, formatReportRange } from "@/lib/dateUtils";
import type { WeeklyNewsReport } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HuaweiLogo } from "@/components/HuaweiLogo";

interface HeaderProps {
  report: WeeklyNewsReport;
  historyCount: number;
  onOpenHistory: () => void;
  onExportFocus: () => void;
}

export function Header({ report, historyCount, onOpenHistory, onExportFocus }: HeaderProps) {
  return (
    <header className="board-panel topbar">
      <div className="brand-block">
        <HuaweiLogo />
        <div>
          <strong className="block text-lg font-black text-slate-950 md:text-xl">HUAWEI Weekly Intelligence Board</strong>
          <span className="muted-small">华为生态与智能汽车行业周报看板</span>
        </div>
      </div>

      <div className="window-block">
        <span className="inline-flex items-center gap-2">
          <CalendarRange className="size-4 text-red-600" />
          监测窗口
        </span>
        <strong>{formatReportRange(report.weekStart, report.weekEnd)}</strong>
      </div>

      <div className="window-block">
        <span className="inline-flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" />
          更新状态
        </span>
        <strong>{formatGeneratedAt(report.generatedAt)}</strong>
        <Badge variant="highlight">已更新 · 历史 {historyCount} 期</Badge>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={onOpenHistory}>
          <History className="size-4" />
          历史
        </Button>
        <Button onClick={onExportFocus}>
          <Download className="size-4" />
          导出
        </Button>
      </div>
    </header>
  );
}
