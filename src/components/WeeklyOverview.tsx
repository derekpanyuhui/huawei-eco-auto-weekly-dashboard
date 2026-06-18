import { FileText } from "lucide-react";

import { buildOverviewHeading } from "@/lib/dateUtils";
import type { WeeklyNewsReport } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WeeklyOverview({ report }: { report: WeeklyNewsReport }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-950">
          <FileText className="size-5 text-red-600" />
          周报概览
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-slate-600">{buildOverviewHeading(report.weekStart, report.weekEnd)}</p>
        <div className="rounded-[24px] bg-slate-50 p-5">
          <p className="text-lg font-semibold text-slate-950">🤖 本周华为生态与智能汽车行业新闻周报 🔆</p>
          <p className="mt-4 text-sm font-medium text-red-700">✍️ 概览：</p>
          <p className="mt-2 text-base leading-8 text-slate-700">{report.overview}</p>
        </div>
      </CardContent>
    </Card>
  );
}
