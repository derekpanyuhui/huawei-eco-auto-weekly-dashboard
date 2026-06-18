import { History } from "lucide-react";

import { buildHistoryTitle, formatGeneratedAt } from "@/lib/dateUtils";
import type { HistoryReportIndexItem } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface HistoryDrawerProps {
  open: boolean;
  historyItems: HistoryReportIndexItem[];
  currentReportId?: string;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: HistoryReportIndexItem) => void;
}

export function HistoryDrawer({
  open,
  historyItems,
  currentReportId,
  onOpenChange,
  onSelect,
}: HistoryDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="size-5 text-sky-700" />
            历史周报
          </SheetTitle>
          <SheetDescription>点击任意周报即可切换查看对应历史版本。</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-3">
            {historyItems.length ? (
              historyItems.map((item) => {
                const active = item.id === currentReportId;
                return (
                  <button
                    key={item.id}
                    className={`rounded-3xl border p-4 text-left transition ${
                      active
                        ? "border-sky-300 bg-sky-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                    onClick={() => onSelect(item)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-950">
                          {item.title || buildHistoryTitle(item.weekStart, item.weekEnd)}
                        </p>
                        <p className="text-sm text-slate-500">生成于 {formatGeneratedAt(item.generatedAt)}</p>
                      </div>
                      {active ? <Badge>当前查看</Badge> : <Badge variant="secondary">{item.count} 条</Badge>}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm leading-7 text-slate-500">
                还没有可切换的历史周报记录。首次 GitHub Actions 生成成功后，这里会自动出现。
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-slate-200 p-6">
          <Button className="w-full" variant="secondary" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
