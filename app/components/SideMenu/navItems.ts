import { WEB_PATHS } from "~/constants/paths";

export const NAV_ITEMS = [
  {
    icon: "dashboard" as const,
    label: "Dashboard",
    href: WEB_PATHS.home,
  },
  {
    icon: "feature" as const,
    label: "Feature",
    href: WEB_PATHS.feature.index,
  },
  {
    icon: "report" as const,
    label: "Report",
    href: WEB_PATHS.report.index,
  },
  {
    icon: "search" as const,
    label: "Search",
    href: WEB_PATHS.search.index,
  },
];
