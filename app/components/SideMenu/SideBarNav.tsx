import { Link } from "react-router";

import { DashboardIcon, FeatureIcon, ReportIcon, SearchIcon } from "./icons";

export type SideBarNavProps = {
  icon: "dashboard" | "feature" | "report" | "search";
  label: string;
  href: string;
  isActive?: boolean;
};

const iconMap = {
  dashboard: DashboardIcon,
  feature: FeatureIcon,
  report: ReportIcon,
  search: SearchIcon,
};

export function SideBarNav({ icon, label, href, isActive }: SideBarNavProps) {
  const Icon = iconMap[icon];

  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-1 ${
        isActive ? "bg-gray-1" : ""
      }`}
    >
      <Icon isActive={isActive} />
      <span
        className={`text-[18px] leading-tight ${
          isActive ? "font-bold text-white" : "font-normal text-white"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
