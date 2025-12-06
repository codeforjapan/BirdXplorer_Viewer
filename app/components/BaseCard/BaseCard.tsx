import type { ReactNode } from "react";

type BaseCardProps = {
  title: ReactNode;
  body: ReactNode;
  titleBgColor?: string;
  className?: string;
};

export function BaseCard({
  title,
  body,
  titleBgColor = "bg-black",
  className,
}: BaseCardProps) {
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-2 ${className ?? ""}`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 ${titleBgColor}`}
      >
        <div className="text-body-l-bold-compact">{title}</div>
      </div>
      <div className="flex flex-1 items-center bg-gray-1 p-5">{body}</div>
    </div>
  );
}
