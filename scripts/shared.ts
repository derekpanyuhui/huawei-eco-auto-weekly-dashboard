import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NewsCategory, NewsPrimarySection, WeeklyNewsReport } from "../src/types/report";

export interface SearchTarget {
  primarySection: NewsPrimarySection;
  companyOrBrand?: string;
  queries: string[];
  requiredKeywords: string[];
}

export interface RawNewsItem {
  id: string;
  primarySection: NewsPrimarySection;
  companyOrBrand?: string;
  query: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  authorityScore: number;
  matchedKeywords: string[];
}

export interface RawNewsSearchResult {
  id: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  items: RawNewsItem[];
}

export const ALLOWED_PRIMARY_SECTIONS: NewsPrimarySection[] = [
  "战略合作伙伴板块",
  "界境塔生态板块",
  "车圈行业热点板块",
];

export const ALLOWED_CATEGORIES: NewsCategory[] = [
  "产销交付",
  "新品技术",
  "战略合作",
  "人事组织",
  "行业大会",
  "投融资产能",
  "行业热点",
];

export const BANNED_DOMAINS = [
  "xiaohongshu.com",
  "zhihu.com",
  "toutiao.com",
  "sohu.com",
  "baijiahao.baidu.com",
  "163.com/dy",
  "dy.163.com",
  "haokan.baidu.com",
  "v.douyin.com",
  "douyin.com",
  "bilibili.com",
  "kuaishou.com",
];

export const REPORT_SECTION_TARGETS: SearchTarget[] = [
  {
    primarySection: "战略合作伙伴板块",
    companyOrBrand: "华为终端",
    queries: ["华为终端 智选车 最近7天"],
    requiredKeywords: ["华为终端", "智选车", "鸿蒙智行", "问界", "智界"],
  },
  {
    primarySection: "战略合作伙伴板块",
    companyOrBrand: "华为数字能源",
    queries: ["华为数字能源 三电 超充 最近7天"],
    requiredKeywords: ["华为数字能源", "超充", "三电", "充电网络"],
  },
  {
    primarySection: "战略合作伙伴板块",
    companyOrBrand: "华为智能汽车解决方案",
    queries: ["华为智能汽车解决方案 引望 最近7天"],
    requiredKeywords: ["华为智能汽车解决方案", "引望", "ADS", "乾崑"],
  },
  {
    primarySection: "战略合作伙伴板块",
    companyOrBrand: "华为ICT",
    queries: ["华为 ICT 汽车 最近7天"],
    requiredKeywords: ["华为ICT", "华为 ICT", "车联网", "智能汽车"],
  },
  {
    primarySection: "战略合作伙伴板块",
    companyOrBrand: "华为慧通",
    queries: ["华为慧通 汽车 最近7天"],
    requiredKeywords: ["华为慧通", "汽车", "合作"],
  },
  {
    primarySection: "战略合作伙伴板块",
    companyOrBrand: "华为企发与哈勃投资",
    queries: ["华为企发 哈勃投资 汽车 最近7天"],
    requiredKeywords: ["哈勃投资", "华为企发", "汽车", "投资"],
  },
  {
    primarySection: "战略合作伙伴板块",
    companyOrBrand: "宁德时代",
    queries: ["宁德时代 动力电池 产能 合作 最近7天"],
    requiredKeywords: ["宁德时代", "动力电池", "电池", "产能", "合作"],
  },
  {
    primarySection: "战略合作伙伴板块",
    companyOrBrand: "博世",
    queries: ["博世 智能驾驶 汽车 中国 最近7天"],
    requiredKeywords: ["博世", "智能驾驶", "汽车", "中国"],
  },
  {
    primarySection: "界境塔生态板块",
    companyOrBrand: "智界",
    queries: ["智界 交付 发布 智驾 最近7天"],
    requiredKeywords: ["智界", "交付", "发布", "智驾"],
  },
  {
    primarySection: "界境塔生态板块",
    companyOrBrand: "尊界",
    queries: ["尊界 交付 发布 智驾 最近7天"],
    requiredKeywords: ["尊界", "交付", "发布", "智驾"],
  },
  {
    primarySection: "界境塔生态板块",
    companyOrBrand: "享界",
    queries: ["享界 交付 发布 智驾 最近7天"],
    requiredKeywords: ["享界", "交付", "发布", "智驾"],
  },
  {
    primarySection: "界境塔生态板块",
    companyOrBrand: "尚界",
    queries: ["尚界 交付 发布 智驾 最近7天"],
    requiredKeywords: ["尚界", "交付", "发布", "智驾"],
  },
  {
    primarySection: "界境塔生态板块",
    companyOrBrand: "奕境",
    queries: ["奕境 汽车 最近7天"],
    requiredKeywords: ["奕境", "汽车"],
  },
  {
    primarySection: "界境塔生态板块",
    companyOrBrand: "启境",
    queries: ["启境 汽车 最近7天"],
    requiredKeywords: ["启境", "汽车"],
  },
  {
    primarySection: "界境塔生态板块",
    companyOrBrand: "华境",
    queries: ["华境 汽车 最近7天"],
    requiredKeywords: ["华境", "汽车"],
  },
  {
    primarySection: "界境塔生态板块",
    companyOrBrand: "阿维塔",
    queries: ["阿维塔 交付 发布 智驾 最近7天"],
    requiredKeywords: ["阿维塔", "交付", "发布", "智驾"],
  },
];

export const HOT_TOPIC_TARGETS: SearchTarget[] = [
  {
    primarySection: "车圈行业热点板块",
    queries: ["新能源汽车 智能驾驶 动力电池 过去7天"],
    requiredKeywords: ["新能源汽车", "智能驾驶", "动力电池", "超充", "供应链"],
  },
  {
    primarySection: "车圈行业热点板块",
    queries: ["中国汽车 产销 交付 过去7天"],
    requiredKeywords: ["中国汽车", "产销", "交付", "销量", "汽车"],
  },
  {
    primarySection: "车圈行业热点板块",
    queries: ["动力电池 产能 合作 过去7天"],
    requiredKeywords: ["动力电池", "产能", "合作", "电池"],
  },
  {
    primarySection: "车圈行业热点板块",
    queries: ["高阶智驾 发布 过去7天"],
    requiredKeywords: ["智驾", "发布", "自动驾驶", "高阶智驾"],
  },
];

const cnDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const cnDateTimeFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const authorityKeywords = [
  { pattern: /(huawei|huaweicloud|hihonor|avatr|catl|bosch)/i, score: 95 },
  { pattern: /(gov\.cn|miit\.gov\.cn|xinhuanet\.com|people\.com\.cn|cctv\.com|cs\.com\.cn)/i, score: 92 },
  { pattern: /(sse\.com\.cn|szse\.cn|cninfo\.com\.cn)/i, score: 91 },
  { pattern: /(stcn|yicai|caixin|cls\.cn|21jingji|bjnews|jiemian)/i, score: 80 },
  { pattern: /(autohome|gasgoo|d1ev|nev\.ofweek|eeo|cnmo)/i, score: 72 },
];

export function getWeekRange(referenceDate = new Date()) {
  const endDate = toChinaDateString(referenceDate);
  const end = new Date(`${endDate}T12:00:00+08:00`);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);

  return {
    weekStart: toChinaDateString(start),
    weekEnd: toChinaDateString(end),
  };
}

export function toChinaDateString(input: Date | string) {
  const date = input instanceof Date ? input : new Date(input);
  return cnDateFormatter.format(date);
}

export function toChinaDateTimeOffset(referenceDate = new Date()) {
  const formatted = cnDateTimeFormatter.format(referenceDate).replace(" ", "T");
  return `${formatted}+08:00`;
}

export function isWithinRange(date: string, weekStart: string, weekEnd: string) {
  return date >= weekStart && date <= weekEnd;
}

export function ensureDirectoryPaths() {
  const rootDir = path.dirname(fileURLToPath(import.meta.url));
  return {
    projectRoot: path.resolve(rootDir, ".."),
    tmpDir: path.resolve(rootDir, "../tmp/weekly-news"),
    publicDataDir: path.resolve(rootDir, "../public/data"),
    historyDir: path.resolve(rootDir, "../public/data/history"),
  };
}

export function sanitizeModelJson(input: string) {
  const fencedMatch = input.match(/```json\s*([\s\S]*?)```/i) ?? input.match(/```([\s\S]*?)```/i);
  return (fencedMatch ? fencedMatch[1] : input).trim();
}

export function containsBannedDomain(url: string) {
  return BANNED_DOMAINS.some((domain) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      return hostname === domain || hostname.endsWith(`.${domain}`);
    } catch {
      return true;
    }
  });
}

export function scoreAuthority(url: string, sourceName: string) {
  const combined = `${url} ${sourceName}`;
  for (const rule of authorityKeywords) {
    if (rule.pattern.test(combined)) {
      return rule.score;
    }
  }
  return 60;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createHistoryIndexEntry(report: WeeklyNewsReport) {
  return {
    id: report.id,
    weekStart: report.weekStart,
    weekEnd: report.weekEnd,
    generatedAt: report.generatedAt,
    title: `${report.weekStart.replaceAll("-", "年").replace(/年(\d{2})$/, "月$1日")}-${report.weekEnd
      .replaceAll("-", "年")
      .replace(/年(\d{2})$/, "月$1日")} 周报`,
    path: `/data/history/${report.weekEnd}.json`,
    count: report.items.length,
  };
}
