import { Box, Divider } from "@mantine/core";

type GraphContainerProps = {
  /** グラフ本体（任意のグラフコンポーネント） */
  children: React.ReactNode;
  /** 下部に配置するコントロール（フィルターなど） */
  footer?: React.ReactNode;
};

/**
 * グラフをwrapするレイアウトコンテナー
 * - グラフの種類に依存しない純粋なレイアウトコンポーネント
 * - 下部にステータスなどのコントロールを配置可能（任意）
 */
export const GraphContainer = ({ children, footer }: GraphContainerProps) => {
  return (
    <Box
      className="w-full overflow-hidden"
      style={{
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        backgroundColor: "#111111",
      }}
    >
      {/* グラフ本体 */}
      <div className="p-4">{children}</div>

      {/* フッター: フィルターコントロールなど */}
      {footer && (
        <>
          <Divider color="rgba(255, 255, 255, 0.2)" />
          <div className="px-6 py-4" style={{ backgroundColor: "#000000" }}>
            {footer}
          </div>
        </>
      )}
    </Box>
  );
};
