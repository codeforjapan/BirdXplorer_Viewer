import type { ReactNode } from "react";

import { PageTitleDivider } from "./PageTitleDivider";

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
        <h1 className="md:text-heading-xl text-heading-xl-sp m-0 text-white">
          {title}
        </h1>
      </div>
      <div className="h-4 w-px shrink-0 self-center bg-white md:h-6" />
      <span className="text-body-l text-white">{subtitle}</span>
    </div>
  );
}
