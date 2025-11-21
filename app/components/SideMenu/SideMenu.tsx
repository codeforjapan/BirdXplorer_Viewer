import { LogoIcon } from "~/components/logo";
import { SideBarNav } from "./SideBarNav";

export type SideMenuProps = {
  className?: string;
};

export function SideMenu({ className }: SideMenuProps) {
  return (
    <aside
      className={`flex h-screen w-[180px] flex-col bg-black px-4 py-5 ${className || ""}`}
    >
      <a href="/">
        <LogoIcon />
      </a>
      <nav className="mt-10 flex flex-col">
        <SideBarNav icon="dashboard" label="Dashboard" href="/" isActive />
        <SideBarNav icon="feature" label="Feature" href="/feature" />
        <SideBarNav icon="report" label="Report" href="/report" />
        <SideBarNav icon="search" label="Search" href="/search" />
      </nav>
    </aside>
  );
}
