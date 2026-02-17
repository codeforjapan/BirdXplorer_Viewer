import { Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { InfoIcon } from "~/components/icons/InfoIcon";
import { NoteIcon } from "~/components/icons/Note";
import { PageTitle } from "~/components/PageTitle";
import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";

export type AboutSectionProps = {
  className?: string;
};

/**
 * About Sectionコンポーネント
 * - サービスの説明を表示
 * - コミュニティノートとNotionへのリンクを含む（将来的に追加予定）
 */
export const AboutSection = ({ className }: AboutSectionProps) => {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;

  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-4">
        <PageTitle
          icon={<InfoIcon isActive />}
          subtitle="バードエクスプローラについて"
          title="About us"
        />
        <a
          className="inline-flex items-center gap-2 text-primary hover:underline"
          href="https://help.x.com/ja/using-x/community-notes"
          rel="noopener noreferrer"
          target="_blank"
        >
          <NoteIcon isActive />
          <span>コミュニティーノートとは？</span>
        </a>
      </div>
      <div className="p-4 md:p-6">
        <Text c="white" className={isMobile ? "text-body-m" : "text-body-l"}>
          BirdXplorerは、Code for Japanが開発するオープンソースの情報分析・可視化ツールです。X（旧Twitter）のコミュニティノートデータを活用し、真偽不明情報の動向や議論の背景を可視化するAPIおよびダッシュボードを提供します。AIによるトピック分類や関連投稿の分析を通じて、市民・研究者・メディアが情報空間を客観的に把握し、健全な公共議論を支えることを目的としています。市民参加型で情報環境を読み解くための基盤として、ハッカソンや研究、公共的プロジェクトで活用されています。{" "}
          【
          <a
            className="inline-flex items-center gap-2 text-primary hover:underline"
            href="https://www.disinformation.code4japan.org/?source=copy_link"
            rel="noopener noreferrer"
            target="_blank"
          >
            <NoteIcon isActive />
            Notionで詳細をみる
          </a>
          】
        </Text>
      </div>
    </section>
  );
};
