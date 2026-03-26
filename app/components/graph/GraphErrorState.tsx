import { Button, Stack, Text } from "@mantine/core";

import type { GraphApiError } from "./api";

export type GraphErrorStateProps = {
  error: GraphApiError;
  onRetry?: () => void;
};

export const GraphErrorState = ({ error, onRetry }: GraphErrorStateProps) => {
  return (
    <Stack align="center" className="min-h-[240px]" gap={8} justify="center">
      <Text c="white" fw={600} size="sm">
        {error.message}
      </Text>
      {error.issues?.length ? (
        <Stack gap={2}>
          {error.issues.slice(0, 3).map((issue, index) => (
            <Text c="dimmed" key={`${issue}-${index}`} size="xs">
              {issue}
            </Text>
          ))}
        </Stack>
      ) : null}
      {onRetry ? (
        <Button
          color="primary"
          onClick={onRetry}
          radius="xl"
          size="xs"
          variant="outline"
        >
          再試行
        </Button>
      ) : null}
    </Stack>
  );
};
