import { TrendingUp } from "lucide-react";

import type { WeeklyNewsReport } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KeyTakeaways({ report }: { report: WeeklyNewsReport }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-950">
          <TrendingUp className="size-5 text-sky-700" />
          关键总结
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-4 md:grid-cols-3">
          {report.keyTakeaways.map((takeaway, index) => (
            <li
              key={takeaway}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700"
            >
              <div className="mb-3 inline-flex size-8 items-center justify-center rounded-full bg-sky-700 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <p>{takeaway}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
