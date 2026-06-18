import type { WeeklyNewsReport } from "@/types/report";
import { SectionBlock } from "@/components/SectionBlock";

const SECTION_ORDER = ["战略合作伙伴板块", "界境塔生态板块", "车圈行业热点板块"] as const;

export function NewsDashboard({ report }: { report: WeeklyNewsReport }) {
  return (
    <div className="space-y-6">
      {SECTION_ORDER.map((section) => (
        <SectionBlock
          key={section}
          section={section}
          items={report.items.filter((item) => item.primarySection === section)}
        />
      ))}
    </div>
  );
}
