import { FileText, Newspaper, ShieldCheck, Target } from "lucide-react";

import { buildOverviewHeading } from "@/lib/dateUtils";
import type { WeeklyNewsReport } from "@/types/report";

export function WeeklyOverview({ report }: { report: WeeklyNewsReport }) {
  return (
    <section className="board-panel headline-panel">
      <div className="grid content-center gap-4">
        <span className="panel-kicker inline-flex items-center gap-2">
          <FileText className="size-4 text-red-600" />
          WEEKLY BRIEF
        </span>
        <h1 className="headline-title">华为资讯洞察看板</h1>
        <p className="max-w-4xl text-sm leading-7 text-slate-600">
          {buildOverviewHeading(report.weekStart, report.weekEnd)}
        </p>
        <p className="max-w-5xl text-base leading-8 text-slate-700">{report.overview}</p>
      </div>
      <aside className="policy-card grid gap-4">
        <div>
          <span className="muted-small">来源与口径</span>
          <strong className="mt-1 block text-2xl leading-tight text-slate-950">官方与权威渠道优先</strong>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            企业官网、官方媒体、官方微博、官方微信公众号公开内容、监管公告与权威媒体均可纳入。
          </p>
        </div>
        <div className="metric-row">
          <div className="metric-card">
            <Newspaper className="mb-2 size-4 text-red-600" />
            <strong>{report.items.length}</strong>
            <p>本期新闻</p>
          </div>
          <div className="metric-card">
            <ShieldCheck className="mb-2 size-4 text-red-600" />
            <strong>100%</strong>
            <p>含来源链接</p>
          </div>
          <div className="metric-card">
            <Target className="mb-2 size-4 text-red-600" />
            <strong>6</strong>
            <p>华为固定板块</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
