export type NewsPrimarySection =
  | "战略合作伙伴板块"
  | "界境塔生态板块"
  | "车圈行业热点板块";

export type NewsCategory =
  | "产销交付"
  | "新品技术"
  | "战略合作"
  | "人事组织"
  | "行业大会"
  | "投融资产能"
  | "行业热点";

export interface NewsItem {
  id: string;
  primarySection: NewsPrimarySection;
  companyOrBrand?: string;
  title: string;
  dateRange: string;
  keywords: string[];
  summary: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  category: NewsCategory;
  importanceScore: number;
}

export interface WeeklyNewsReport {
  id: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  overview: string;
  items: NewsItem[];
  keyTakeaways: string[];
}

export interface HistoryReportIndexItem {
  id: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  title: string;
  path: string;
  count: number;
}
