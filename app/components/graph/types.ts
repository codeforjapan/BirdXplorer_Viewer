/**
 * グラフコンポーネント用の共通データ型定義
 * バックエンドAPIから受け取るデータの型を定義
 */

/** APIデータ用のステータス型（フィルター用の"all"を含まない） */
export type NoteStatus = "published" | "evaluating" | "unpublished" | "temporarilyPublished";

/** 公開ステータス別の件数 */
export type StatusCounts = {
  /** 公開中の件数 */
  published: number;
  /** 評価中の件数 */
  evaluating: number;
  /** 非公開の件数 */
  unpublished: number;
  /** 一時公開の件数 */
  temporarilyPublished: number;
};

/**
 * ノート評価データの共通型
 * NotesEvaluationChartSection, NotesEvaluationStatusChart で使用
 */
export type NoteEvaluationData = {
  /** ノートの一意識別子 */
  noteId: string;
  /** ノートの表示名 */
  name: string;
  /** 「役に立った」の評価数 */
  helpful: number;
  /** 「役に立たなかった」の評価数 */
  notHelpful: number;
  /** インプレッション数 */
  impressions: number;
  /** ステータス */
  status: NoteStatus;
};

/**
 * ポスト影響力データの型
 * PostInfluenceChart で使用
 */
export type PostInfluenceData = {
  /** ポストの一意識別子 */
  postId: string;
  /** ポストの表示名 */
  name: string;
  /** リポスト数 */
  reposts: number;
  /** いいね数 */
  likes: number;
  /** インプレッション数 */
  impressions: number;
  /** ステータス（ついているコミュニティノートのステータス） */
  status: NoteStatus;
};

/**
 * 日別ノート作成数データ
 * DailyNotesCreationChart で使用
 */
export type DailyNotesCreationDataItem = {
  /** 日付（YYYY-MM-DD形式） */
  date: string;
} & StatusCounts;

/**
 * 日別ポスト投稿数データ
 * DailyPostCountChart で使用
 */
export type DailyPostCountDataItem = {
  /** 日付（YYYY-MM-DD形式） */
  date: string;
} & StatusCounts;

/**
 * 月別ノートデータ
 * NotesAnnualChartSection で使用
 */
export type MonthlyNoteData = {
  /** 月（YYYY-MM形式） */
  month: string;
  /** 公開率（0〜100のパーセンテージ） */
  publicationRate: number;
} & StatusCounts;

/**
 * イベントマーカー
 * DailyNotesCreationChart, DailyPostCountChart で使用
 */
export type EventMarker = {
  /** 日付（YYYY-MM-DD形式） */
  date: string;
  /** 表示ラベル（例: "7/3 公示"） */
  label: string;
};

/**
 * 期間選択オプション
 * 期間切り替え可能なグラフで使用（フロントエンド定数）
 */
export type PeriodOption<T extends string = string> = { value: T; label: string };

/** 年月（YYYY-MM形式） */
export type YearMonth = `${number}-${number}`;

/** 期間レンジ（YYYY-MM_YYYY-MM形式） */
export type PeriodRangeValue = `${YearMonth}_${YearMonth}`;
