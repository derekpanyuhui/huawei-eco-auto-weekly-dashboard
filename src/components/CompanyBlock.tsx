import type { PropsWithChildren } from "react";

import { Badge } from "@/components/ui/badge";

export function CompanyBlock({ title, count, children }: PropsWithChildren<{ title: string; count: number }>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-red-700 to-red-500 px-4 py-3 text-sm font-semibold text-white shadow-sm">
        <span>{title}</span>
        <Badge className="border-white/35 bg-white/20 text-white" variant="outline">
          {count} 条新闻
        </Badge>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">{children}</div>
    </div>
  );
}
