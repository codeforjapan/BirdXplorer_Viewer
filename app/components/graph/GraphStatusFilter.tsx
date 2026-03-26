import { Group, Radio, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";

import { STATUS_FILTER_OPTIONS, type StatusValue } from "./constants";

/** ステータスの設定 */
type StatusConfig = {
  value: StatusValue;
  label: string;
  color?: string;
};

type GraphStatusFilterProps = {
  value: StatusValue;
  onChange: (value: StatusValue) => void;
  statuses?: StatusConfig[];
  label?: string;
};

/**
 * ステータスフィルター用ラジオボタングループ
 * グラフのデータをステータス別にフィルタリングする際に使用
 */
export const GraphStatusFilter = ({
  value,
  onChange,
  statuses = STATUS_FILTER_OPTIONS,
  label = "ステータス",
}: GraphStatusFilterProps) => {
  // スマホ判定（640px以下）- SSR時はデスクトップ表示をデフォルトとする
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;

  const radioGroup = (
    <Radio.Group onChange={(v) => onChange(v as StatusValue)} value={value}>
      <Group gap="lg">
        {statuses.map((status) => (
          <Radio
            color="var(--color-primary)"
            key={status.value}
            label={status.label}
            styles={{
              radio: {
                cursor: "pointer",
                backgroundColor: "transparent",
                borderColor:
                  value === status.value
                    ? "var(--color-primary)"
                    : "var(--color-gray-3)",
                borderWidth: "1px",
              },
              icon: {
                color: "var(--color-primary)",
              },
              label: {
                cursor: "pointer",
                color: "white",
              },
            }}
            value={status.value}
          />
        ))}
      </Group>
    </Radio.Group>
  );

  // スマホ: 縦並び、デスクトップ: 横並び
  if (isMobile) {
    return (
      <Stack gap="sm">
        <Text c="white" fw={700} size="md">
          {label}
        </Text>
        {radioGroup}
      </Stack>
    );
  }

  return (
    <Group align="center" gap="lg">
      <Text c="white" fw={700} size="md">
        {label}
      </Text>
      {radioGroup}
    </Group>
  );
};
