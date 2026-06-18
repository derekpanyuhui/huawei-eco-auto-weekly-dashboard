import { Layers3 } from "lucide-react";

import { HUAWEI_COVERAGE_BOARDS, countBoardNews } from "@/lib/coverage";
import type { WeeklyNewsReport } from "@/types/report";
import { Badge } from "@/components/ui/badge";

export function HuaweiCoverageSummary({ report }: { report: WeeklyNewsReport }) {
  return (
    <section className="board-panel p-5">
      <div className="panel-head mb-4">
        <div>
          <span className="panel-kicker inline-flex items-center gap-2">
            <Layers3 className="size-4 text-red-600" />
            COVERAGE TRACKING
          </span>
          <h2>华为固定覆盖板块</h2>
        </div>
        <p className="max-w-2xl text-right text-sm leading-6 text-slate-500">
          每个固定板块显示本期新闻数量；无新闻板块只保留监测状态，不展开空新闻标题。
        </p>
      </div>
      <div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {HUAWEI_COVERAGE_BOARDS.map((board) => {
            const count = countBoardNews(report, board);
            return (
              <div
                className="coverage-card-template flex min-h-28 items-center justify-between gap-4 p-4"
                key={board.name}
              >
                <div>
                  <p className="text-sm font-semibold leading-6 text-slate-950">{board.label}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {count > 0 ? "本期已收录，进入下方新闻板块查看详情" : "本期暂无匹配新闻，继续保持监测"}
                  </p>
                </div>
                <Badge className={count > 0 ? "status-pill updated" : "status-pill monitoring"}>
                  {count} 条
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
