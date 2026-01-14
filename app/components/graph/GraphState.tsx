import { Stack, Text } from "@mantine/core";

import type { GraphApiError } from "./api";
import { GraphErrorState } from "./GraphErrorState";
import { GraphLoading } from "./GraphLoading";

export type GraphStateStatus = "loading" | "error" | "empty" | "success";

export type GraphStateProps = {
  status: GraphStateStatus;
  error?: GraphApiError;
  onRetry?: () => void;
  emptyMessage?: string;
  loadingHeight?: number | string;
  children: React.ReactNode;
};

export const GraphState = ({
  status,
  error,
  onRetry,
  emptyMessage = "表示できるデータがありません",
  loadingHeight,
  children,
}: GraphStateProps) => {
  if (status === "loading") {
    return <GraphLoading height={loadingHeight} />;
  }

  if (status === "error") {
    return error ? <GraphErrorState error={error} onRetry={onRetry} /> : null;
  }

  if (status === "empty") {
    return (
      <Stack align="center" className="min-h-[240px]" justify="center">
        <Text c="dimmed" size="sm">
          {emptyMessage}
        </Text>
      </Stack>
    );
  }

  return <>{children}</>;
};
