import { CalendarRange, CheckCircle2, History, Sparkles } from "lucide-react";

import { formatGeneratedAt, formatReportRange } from "@/lib/dateUtils";
import type { WeeklyNewsReport } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HeaderProps {
  report: WeeklyNewsReport;
  historyCount: number;
  onOpenHistory: () => void;
  onExportFocus: () => void;
}

export function Header({ report, historyCount, onOpenHistory, onExportFocus }: HeaderProps) {
  return (
    <Card className="overflow-hidden border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(14,116,234,0.16),_transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sky-700">
              <Sparkles className="size-5" />
              <span className="text-sm font-semibold tracking-[0.16em] text-sky-700/90">
                Weekly Intelligence Dashboard
              </span>
            </div>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                华为生态与智能汽车行业周报看板
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <CalendarRange className="size-4 text-sky-700" />
                  周期：{formatReportRange(report.weekStart, report.weekEnd)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  生成时间：{formatGeneratedAt(report.generatedAt)}
                </span>
                <Badge variant="highlight">最新周报状态：已更新</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">历史周报 {historyCount} 期</Badge>
            <Button variant="outline" onClick={onOpenHistory}>
              <History className="size-4" />
              查看历史
            </Button>
            <Button onClick={onExportFocus}>导出周报</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
