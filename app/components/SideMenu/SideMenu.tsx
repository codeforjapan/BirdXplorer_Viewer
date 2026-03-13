import { useLocation } from "react-router";

import { LogoIcon } from "~/components/logo";

import { SideBarNav } from "./SideBarNav";
import { NAV_ITEMS } from "./navItems";

export type SideMenuProps = {
  className?: string;
};

export function SideMenu({ className }: SideMenuProps) {
  const location = useLocation();
  return (
    <aside
      className={`flex w-[190px] flex-col bg-black p-5 ${className ?? ""}`}
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
