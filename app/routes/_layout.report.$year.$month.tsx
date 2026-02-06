/* eslint-disable react-refresh/only-export-components */
import { Container } from "@mantine/core";

import { ReportIcon } from "~/components/icons";
import { OtherReportCardSection } from "~/components/other-report-card-section/OtherReportCardSection";
import { WEB_PATHS } from "~/constants/paths";
import type { ReportItem } from "~/data/reports";
import { DEFAULT_KOUCHOU_AI_PATH, REPORT_ITEMS } from "~/data/reports";

import type { LayoutHandle } from "./_layout";
import type { Route } from "./+types/_layout.report.$year.$month";

type LoaderData = {
  report: ReportItem | null;
};

export const meta: Route.MetaFunction = ({ data }) => {
  const loaderData = data as LoaderData | undefined;
  if (!loaderData?.report) {
    return [{ title: "レポートが見つかりません - BirdXplorer" }];
  }
  return [
    { title: `${loaderData.report.title} - BirdXplorer` },
    {
      name: "description",
      content: `${loaderData.report.title}のレポートページ`,
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

export const handle: LayoutHandle<{ report: ReportItem | null }> = {
  breadcrumb: (data: { report: ReportItem | null } | undefined) => [
    { label: "TOP", href: WEB_PATHS.home },
    { label: data?.report?.title ?? "レポート", href: WEB_PATHS.report.index },
  ],
  pageTitle: {
    icon: <ReportIcon isActive />,
    title: "Report",
    subtitle: "月次レポート",
  },
};

const getAllReports = (): ReportItem[] => {
  return REPORT_ITEMS;
};

export const loader = ({ params }: Route.LoaderArgs): LoaderData => {
  const typedParams = params as { year?: string; month?: string };
  const { year, month } = typedParams;

  if (!year || !month) {
    return {
      report: null,
    };
  }

  const reports = getAllReports();
  const report = reports.find(
    (r) => r.href === `/report/${year}/${month}`,
  );

  return {
    report: report ?? null,
  };
};

export default function ReportDetail({ loaderData }: Route.ComponentProps) {
  const { report } = loaderData as LoaderData;

  if (!report) {
    return (
      <Container className="py-8" size="xl">
        <div className="text-center text-white">
          <h1 className="text-heading-xl mb-4">404</h1>
          <p className="text-body-l">レポートが見つかりませんでした</p>
        </div>
      </Container>
    );
  }

  return (
    <Container px="0" size="xl">
      <h2 className="text-heading-xl-sp md:text-heading-xl mb-4 text-white">
        {report.title}
      </h2>

      <iframe
        height="2330px"
        sandbox="allow-scripts allow-popups allow-forms"
        src={String(report.kouchouAiPath ?? DEFAULT_KOUCHOU_AI_PATH)}
        title="広聴AI"
        width="100%"
      />

      <OtherReportCardSection className="mt-4 md:mt-8" maxItems={4} />
    </Container>
  );
}
