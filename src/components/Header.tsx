import { CalendarRange, CheckCircle2, History } from "lucide-react";

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
    <Card className="overflow-hidden border-red-100 bg-[linear-gradient(135deg,#fff5f4_0%,#ffffff_34%,#fff7f5_100%)]">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    alt="Huawei logo"
                    className="h-10 w-10 object-contain"
                    src={`${import.meta.env.BASE_URL}assets/huawei_logo_symbol_256.png`}
                  />
                  <img
                    alt="Huawei"
                    className="h-7 w-auto md:h-8"
                    src={`${import.meta.env.BASE_URL}assets/huawei_wordmark_512.png`}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-red-600">HUAWEI WEEKLY BOARD</p>
                <p className="text-sm text-slate-500">红白汇报版 · 智能汽车生态跟踪</p>
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                华为生态与智能汽车行业周报看板
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <CalendarRange className="size-4 text-red-600" />
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
