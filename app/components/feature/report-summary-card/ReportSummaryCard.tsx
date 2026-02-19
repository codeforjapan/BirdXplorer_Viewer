import { Button } from "@mantine/core";

import { GraphContainer } from "~/components/graph/GraphContainer";
import { GraphWrapper } from "~/components/graph/GraphWrapper";

export type ReportSummaryCardProps = {
  className?: string;
  description: string;
  href: string;
  updatedAt: string;
  title?: string;
};

export const ReportSummaryCard = ({
  className,
  description,
  href,
  updatedAt,
  title = "レポート",
}: ReportSummaryCardProps) => {
  return (
    <GraphWrapper
      className={className}
      title={title}
      updatedAt={updatedAt}
    >
      <GraphContainer>
        <p className="text-body-l line-height-170 line-clamp-16 whitespace-pre-wrap text-white">
          {description}
        </p>
      </GraphContainer>
    </GraphWrapper>
  );
};
