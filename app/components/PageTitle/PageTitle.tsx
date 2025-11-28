import type { ReactNode } from "react";

type PageTitleProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  className?: string;
};

export function PageTitle({
  icon,
  title,
  subtitle,
  className,
}: PageTitleProps) {
  return (
    <div
      className={`flex h-auto flex-col items-start gap-2 md:h-12 md:flex-row md:items-center md:gap-3 ${className ?? ""}`}
    >
      <div className="flex items-center gap-3">
        <div className="size-6 shrink-0">{icon}</div>
        <h1 className="m-0 text-base leading-tight font-bold text-gray-1 md:text-lg">
          {title}
        </h1>
      </div>
      <span className="text-[11px] leading-normal font-normal text-gray-2 md:text-xs">
        {subtitle}
      </span>
    </div>
  );
}
