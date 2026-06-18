import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <p className="text-xl font-semibold text-slate-950">正在加载周报数据</p>
            <p className="text-sm leading-7 text-slate-500">
              正在读取最新周报与历史索引。如果当前仓库还没有生成真实数据，页面会自动切换到空状态提示。
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
