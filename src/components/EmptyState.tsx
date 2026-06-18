import { DatabaseZap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-950">
          <DatabaseZap className="size-5 text-sky-700" />
          暂无可用周报数据
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
        <p>暂无可用周报数据，请检查 GitHub Actions 是否已成功运行。</p>
        <p>
          当前项目不会用 mock 新闻补位。只有当 `scripts/fetchWeeklyNews.ts` 与 `scripts/generateWeeklyReport.ts`
          成功写入真实数据后，页面才会展示最新周报。
        </p>
      </CardContent>
    </Card>
  );
}
