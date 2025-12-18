import type { AccountRankingData } from "./AccountRankingSection";

/**
 * アカウントランキング用モックデータを生成
 */
export const generateMockData = (): AccountRankingData[] => {
  // サンプルとなる日本語ユーザー名のリスト
  const sampleUsers = [
    { username: "earthquake_japan", displayName: "麒麟地震研究所" },
    { username: "breaking_news_jp", displayName: "ツイッター速報～Breaking News" },
    { username: "news_daily_jp", displayName: "デイリーニュース速報" },
    { username: "fact_check_jp", displayName: "ファクトチェックJP" },
    { username: "science_news_jp", displayName: "サイエンスニュース" },
    { username: "tech_updates_jp", displayName: "テックアップデート" },
    { username: "politics_watch_jp", displayName: "政治ウォッチャー" },
    { username: "weather_info_jp", displayName: "気象情報センター" },
    { username: "sports_news_jp", displayName: "スポーツ速報" },
    { username: "economy_today_jp", displayName: "経済トゥデイ" },
    { username: "culture_news_jp", displayName: "カルチャーニュース" },
    { username: "health_tips_jp", displayName: "健康情報局" },
    { username: "edu_info_jp", displayName: "教育インフォメーション" },
    { username: "travel_japan", displayName: "トラベルジャパン" },
    { username: "food_news_jp", displayName: "フードニュース" },
  ];

  const result: AccountRankingData[] = [];

  for (let i = 0; i < sampleUsers.length; i++) {
    const user = sampleUsers[i];
    
    // 上位ほど付与数が多くなるように設定
    const noteCount = Math.floor(Math.random() * 100) + (15 - i) * 50 + 300;
    
    // 前回比の変動値（-20 〜 +50の範囲でランダム）
    const changeValue = Math.floor(Math.random() * 70) - 20;
    const changeDirection: "up" | "down" | "neutral" =
      changeValue > 0 ? "up" : changeValue < 0 ? "down" : "neutral";
    const changeSign = changeValue > 0 ? "+" : changeValue === 0 ? "±" : "";
    const change = changeValue === 0 ? "→" : `${changeSign}${changeValue}`;
    
    // 世界ランキング（上位ほど低い数値）
    const worldRank = i + 1 + Math.floor(Math.random() * 3);

    result.push({
      username: user.username,
      displayName: user.displayName,
      noteCount,
      change,
      worldRank,
      changeDirection,
    });
  }

  return result;
};

