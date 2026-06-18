import type { NewsPrimarySection, NewsItem } from "@/types/report";
import { CompanyBlock } from "@/components/CompanyBlock";
import { NewsCard } from "@/components/NewsCard";

const SECTION_DESCRIPTIONS: Record<NewsPrimarySection, string> = {
  战略合作伙伴板块: "围绕华为生态核心伙伴的合作、技术、产能与组织动态。",
  界境塔生态板块: "围绕智界、尊界、享界等品牌最近7天的重要进展。",
  车圈行业热点板块: "当固定覆盖范围内无有效新闻时启用的行业热点补充。",
};

export function SectionBlock({
  section,
  items,
}: {
  section: NewsPrimarySection;
  items: NewsItem[];
}) {
  if (!items.length) {
    return null;
  }

  const groups = new Map<string, NewsItem[]>();
  const directItems: NewsItem[] = [];

  for (const item of items) {
    if (!item.companyOrBrand) {
      directItems.push(item);
      continue;
    }
    groups.set(item.companyOrBrand, [...(groups.get(item.companyOrBrand) ?? []), item]);
  }

  return (
    <section className="board-panel p-5">
      <div className="panel-head mb-5">
        <div>
          <span className="panel-kicker">NEWS PANEL</span>
          <h2>{section}</h2>
        </div>
        <p className="max-w-xl text-right text-sm leading-6 text-slate-500">{SECTION_DESCRIPTIONS[section]}</p>
      </div>
      <div className="space-y-8">
        {directItems.length > 0 ? (
          <div className="grid gap-4">
            {directItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}

        {[...groups.entries()].map(([company, companyItems]) => (
          <CompanyBlock key={company} title={company} count={companyItems.length}>
            {companyItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </CompanyBlock>
        ))}
      </div>
    </section>
  );
}
