import { Skeleton } from "@mantine/core";

export type GraphLoadingProps = {
  /** ローディング表示の高さ */
  height?: number | string;
};

export const GraphLoading = ({ height = 320 }: GraphLoadingProps) => {
  return <Skeleton height={height} radius="md" />;
};
