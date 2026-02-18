import type { ReactNode } from "react";

type BaseCardProps = {
  title: ReactNode;
  body: ReactNode;
  titleBgColor?: string;
  className?: string;
  href?: string;
};

export function BaseCard({
  title,
  body,
  titleBgColor = "bg-black",
  className,
  href,
}: BaseCardProps) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      className={`flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-2 transition-opacity ${href ? "cursor-pointer hover:opacity-80" : ""} ${className ?? ""}`}
      {...(href ? { href } : {})}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 ${titleBgColor}`}
      >
        <div className="text-body-l-bold-compact">{title}</div>
      </div>
      <div className="flex flex-1 items-center bg-gray-1 p-5">{body}</div>
    </Tag>
  );
}
