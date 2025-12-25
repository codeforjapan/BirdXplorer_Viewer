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
      hidePeriodSelector
      title={title}
      updatedAt={updatedAt}
    >
      <GraphContainer
        footer={
          <div className="flex justify-end">
            <Button
              className="!text-body-l"
              component="a"
              href={href}
              radius="md"
              variant="outline"
            >
              レポートの詳細を見る
            </Button>
          </div>
        }
      >
        <p className="text-body-l line-clamp-8 whitespace-pre-wrap text-white">
          {description}
        </p>
      </GraphContainer>
    </GraphWrapper>
  );
};
