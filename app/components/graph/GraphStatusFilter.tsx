import { Group, Radio, Text } from "@mantine/core";

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
  { value: "published", label: "公開中", color: "#42a5f5" },
  { value: "evaluating", label: "評価中", color: "#ab47bc" },
  { value: "unpublished", label: "非公開", color: "#ec407a" },
];

type GraphStatusFilterProps = {
  /** 現在選択中のステータス */
  value: StatusValue;
  /** ステータス変更時のコールバック */
  onChange: (value: StatusValue) => void;
  /** 凡例の色を表示するか（デフォルト: false） */
  showLegendColors?: boolean;
  /** カスタムステータス設定 */
  statuses?: StatusConfig[];
  /** ラベルテキスト（デフォルト: "ステータス"） */
  label?: string;
};

export const GraphStatusFilter = ({
  value,
  onChange,
  showLegendColors = false,
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
              key={status.value}
              label={
                showLegendColors && status.color ? (
                  <Group align="center" gap="xs">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span>{status.label}</span>
                  </Group>
                ) : (
                  status.label
                )
              }
              styles={{
                radio: {
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  borderColor: "#cccccc",
                  borderWidth: "1px",
                  "&[data-checked]": {
                    backgroundColor: "transparent",
                    borderColor: status.color || "#42a5f5",
                    color: status.color || "#42a5f5",
                  },
                },
                icon: {
                  color: status.color || "#42a5f5",
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
