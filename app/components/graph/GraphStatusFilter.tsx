import { Group, Radio, Text } from "@mantine/core";

import { STATUS_COLORS } from "./constants";

/** ステータスの値 */
export type StatusValue = "all" | "published" | "evaluating" | "unpublished";

/** ステータスの設定 */
type StatusConfig = {
  value: StatusValue;
  label: string;
  color?: string;
};

/** デフォルトのステータス設定 */
const DEFAULT_STATUSES: StatusConfig[] = [
  { value: "all", label: "全て" },
  { value: "published", label: "公開中", color: STATUS_COLORS.published },
  { value: "evaluating", label: "評価中", color: STATUS_COLORS.evaluating },
  { value: "unpublished", label: "非公開", color: STATUS_COLORS.unpublished },
];

type GraphStatusFilterProps = {
  /** 現在選択中のステータス */
  value: StatusValue;
  /** ステータス変更時のコールバック */
  onChange: (value: StatusValue) => void;
  /** カスタムステータス設定 */
  statuses?: StatusConfig[];
  /** ラベルテキスト（デフォルト: "ステータス"） */
  label?: string;
};

export const GraphStatusFilter = ({
  value,
  onChange,
  statuses = DEFAULT_STATUSES,
  label = "ステータス",
}: GraphStatusFilterProps) => {
  return (
    <Group align="center" gap="lg">
      <Text c="white" fw={700} size="md">
        {label}
      </Text>
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
    </Group>
  );
};
