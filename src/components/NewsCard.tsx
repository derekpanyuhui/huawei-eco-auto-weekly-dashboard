import { ArrowUpRight, CalendarDays, Copy, Link2, Newspaper, Star } from "lucide-react";
import { toast } from "sonner";

import { buildNewsItemMarkdown, copyText } from "@/lib/exportUtils";
import type { NewsItem } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function NewsCard({ item }: { item: NewsItem }) {
  async function handleCopy() {
    await copyText(buildNewsItemMarkdown(item));
    toast.success("已复制单条新闻 Markdown");
  }

  return (
    <Card
      className={
        item.importanceScore > 90
          ? "border-amber-200 bg-[linear-gradient(180deg,#ffffff_0%,#fffaf0_100%)]"
          : undefined
      }
    >
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={item.importanceScore > 90 ? "highlight" : "default"}>{item.category}</Badge>
              <Badge variant="outline">{item.dateRange}</Badge>
            </div>
            <h3 className="text-xl font-semibold leading-8 text-slate-950">{item.title}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className="size-4" />
            复制 Markdown
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary">
              {keyword}
            </Badge>
          ))}
        </div>

        <p className="text-sm leading-7 text-slate-700">{item.summary}</p>

        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 transition hover:text-red-900"
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          <ArrowUpRight className="size-4" />
          阅读原文
        </a>

        <Separator />

        <div className="grid gap-3 text-sm text-slate-500 md:grid-cols-4">
          <span className="inline-flex items-center gap-2">
            <Newspaper className="size-4 text-slate-400" />
            {item.sourceName}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-slate-400" />
            {item.publishedAt}
          </span>
          <span className="inline-flex items-center gap-2">
            <Link2 className="size-4 text-slate-400" />
            {item.category}
          </span>
          <span className="inline-flex items-center gap-2">
            <Star className="size-4 text-slate-400" />
            重要性 {item.importanceScore}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
