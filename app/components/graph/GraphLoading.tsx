import { Loader, Stack, Text } from "@mantine/core";

export type GraphLoadingProps = {
  /** ローディング表示の高さ */
  height?: number | string;
};

export const GraphLoading = ({ height = 320 }: GraphLoadingProps) => {
  return (
    <Stack
      align="center"
      justify="center"
      style={{
        height,
        borderRadius: "8px",
        backgroundColor: "var(--color-gray-1)",
      }}
    >
      <Loader color="blue" size="md" />
      <Text c="dimmed" size="sm">
        グラフを読み込み中...
      </Text>
    </Stack>
  );
};
