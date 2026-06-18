import type { WeeklyNewsReport } from "@/types/report";

export interface CoverageBoard {
  name: string;
  label: string;
  aliases: string[];
}

export const HUAWEI_COVERAGE_BOARDS: CoverageBoard[] = [
  {
    name: "华为终端",
    label: "华为终端（含智选车业务）",
    aliases: ["华为终端", "智选车", "鸿蒙智行"],
  },
  {
    name: "华为数字能源",
    label: "华为数字能源（三电系统与超充网络）",
    aliases: ["华为数字能源"],
  },
  {
    name: "华为智能汽车解决方案",
    label: "华为智能汽车解决方案（含引望）",
    aliases: ["华为智能汽车解决方案", "引望", "华为乾崑"],
  },
  {
    name: "华为ICT",
    label: "华为ICT",
    aliases: ["华为ICT", "华为 ICT"],
  },
  {
    name: "华为慧通",
    label: "华为慧通",
    aliases: ["华为慧通"],
  },
  {
    name: "华为企发与哈勃投资",
    label: "华为企发与哈勃投资",
    aliases: ["华为企发与哈勃投资", "华为企发", "哈勃投资"],
  },
];

export function countBoardNews(report: WeeklyNewsReport, board: CoverageBoard) {
  return report.items.filter((item) => {
    const haystack = `${item.companyOrBrand ?? ""} ${item.title} ${item.summary} ${item.keywords.join(" ")}`;
    return board.aliases.some((alias) => haystack.includes(alias));
  }).length;
}
