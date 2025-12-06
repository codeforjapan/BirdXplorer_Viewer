import { Outlet, useMatches } from "react-router";

import { BreadCrumb, type BreadCrumbItem } from "~/components/BreadCrumb/BreadCrumb";
import { PageTitle } from "~/components/PageTitle/PageTitle";

export type LayoutHandle = {
  breadcrumb: BreadCrumbItem[];
  pageTitle: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
  };
};

export default function Layout() {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const handle = currentRoute?.handle as LayoutHandle | undefined;

  if (!handle) {
    return <Outlet />;
  }

  return (
    <div className="px-15 pt-10">
      <div className="mb-6">
        <BreadCrumb items={handle.breadcrumb} />
      </div>

      <div className="mb-8">
        <PageTitle
          icon={handle.pageTitle.icon}
          subtitle={handle.pageTitle.subtitle}
          title={handle.pageTitle.title}
        />
      </div>

      <Outlet />
    </div>
  );
}
