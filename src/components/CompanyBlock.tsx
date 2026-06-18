import type { PropsWithChildren } from "react";

export function CompanyBlock({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-r from-red-700 to-red-500 px-4 py-3 text-sm font-semibold text-white shadow-sm">
        {title}
      </div>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}
