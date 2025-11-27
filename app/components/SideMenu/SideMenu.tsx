import { useLocation } from "react-router";

import { LogoIcon } from "~/components/logo";
import { WEB_PATHS } from "~/constants/paths";

import { SideBarNav } from "./SideBarNav";

export type SideMenuProps = {
  className?: string;
};

const NAV_ITEMS = [
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

export function SideMenu({ className }: SideMenuProps) {
  const location = useLocation();
  return (
    <aside
      className={`flex h-screen w-[190px] flex-col bg-black p-5 ${className ?? ""}`}
    >
      <a href="/">
        <LogoIcon />
      </a>
      <nav className="mt-10 flex flex-col">
        {NAV_ITEMS.map((item) => (
          <SideBarNav
            key={item.href}
            {...item}
            isActive={item.href === location.pathname}
          />
        ))}
      </nav>
    </aside>
  );
}
