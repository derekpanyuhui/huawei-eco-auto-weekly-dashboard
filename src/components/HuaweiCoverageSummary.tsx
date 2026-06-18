import { Layers3 } from "lucide-react";

import { HUAWEI_COVERAGE_BOARDS, countBoardNews } from "@/lib/coverage";
import type { WeeklyNewsReport } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HuaweiCoverageSummary({ report }: { report: WeeklyNewsReport }) {
  return (
    <Card className="border-red-100 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-slate-950">
          <Layers3 className="size-5 text-red-600" />
          华为固定覆盖板块
        </CardTitle>
        <p className="text-sm leading-7 text-slate-500">
          以下为本期固定跟踪范围；无新闻的板块保留计数提示，不展开空新闻标题。
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {HUAWEI_COVERAGE_BOARDS.map((board) => {
            const count = countBoardNews(report, board);
            return (
              <div
                className="flex min-h-20 items-center justify-between gap-4 rounded-lg border border-red-100 bg-red-50/45 px-4 py-3"
                key={board.name}
              >
                <div>
                  <p className="text-sm font-semibold leading-6 text-slate-950">{board.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{count > 0 ? "本期已收录" : "本期暂无匹配新闻"}</p>
                </div>
                <Badge variant={count > 0 ? "default" : "secondary"}>{count} 条</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
