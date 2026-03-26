import { Box, Divider } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";

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
  // スマホ判定（640px以下）- SSR時はデスクトップ表示をデフォルトとする
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;

  return (
    <Box
      className="w-full overflow-hidden"
      style={{
        border: "1px solid var(--color-graph-border)",
        borderRadius: "12px",
        backgroundColor: "var(--color-gray-1)",
      }}
    >
      {/* グラフ本体 */}
      <div className={isMobile ? "p-2" : "p-4"}>{children}</div>

      {/* フッター: フィルターコントロールなど */}
      {footer && (
        <>
          <Divider color="var(--color-graph-border)" />
          <div
            className={isMobile ? "px-4 py-3" : "px-6 py-4"}
            style={{ backgroundColor: "var(--color-black)" }}
          >
            {footer}
          </div>
        </>
      )}
    </Box>
  );
};
