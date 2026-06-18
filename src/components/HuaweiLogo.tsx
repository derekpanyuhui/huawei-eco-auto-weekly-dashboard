export function HuaweiLogo() {
  return (
    <div className="flex items-center gap-3" aria-label="Huawei">
      <svg className="h-11 w-11 shrink-0" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <path d="M32 5c3 9 3 17 0 24-3-7-3-15 0-24Z" fill="#d71920" />
        <path d="M22 8c6 7 9 14 8 22-5-6-8-13-8-22Z" fill="#d71920" />
        <path d="M42 8c0 9-3 16-8 22-1-8 2-15 8-22Z" fill="#d71920" />
        <path d="M13 18c8 4 13 9 15 16-7-3-12-8-15-16Z" fill="#d71920" />
        <path d="M51 18c-3 8-8 13-15 16 2-7 7-12 15-16Z" fill="#d71920" />
        <path d="M8 31c9 1 15 4 20 10-8 0-14-4-20-10Z" fill="#d71920" />
        <path d="M56 31c-6 6-12 10-20 10 5-6 11-9 20-10Z" fill="#d71920" />
        <path d="M17 45h30c-4 8-10 12-15 12s-11-4-15-12Z" fill="#d71920" />
      </svg>
      <div className="leading-none">
        <div className="text-2xl font-black text-red-600">HUAWEI</div>
        <div className="mt-1 text-xs font-semibold text-slate-500">生态周报</div>
      </div>
    </div>
  );
}
