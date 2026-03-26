import type {
  DailyNotesCreationDataItem as ApiDailyNotesCreationDataItem,
  DailyPostCountDataItem as ApiDailyPostCountDataItem,
  MonthlyNoteDataItem,
  NoteEvaluationDataItem,
  PostInfluenceDataItem,
} from "~/generated/api/schemas";

import type {
  DailyNotesCreationDataItem,
  DailyPostCountDataItem,
  MonthlyNoteData,
  NoteEvaluationData,
  NoteStatus,
  PostInfluenceData,
} from "./types";

const NOTE_STATUS_VALUES = [
  "published",
  "evaluating",
  "unpublished",
  "temporarilyPublished",
] as const;

const isNoteStatus = (value: unknown): value is NoteStatus => {
  return NOTE_STATUS_VALUES.includes(value as NoteStatus);
};

const toNoteStatus = (value: unknown): NoteStatus => {
  return isNoteStatus(value) ? value : "published";
};

const createEmptyStatusCounts = () => ({
  published: 0,
  evaluating: 0,
  unpublished: 0,
  temporarilyPublished: 0,
});

export const toDailyNotesCreationData = (
  items: ApiDailyNotesCreationDataItem[],
): DailyNotesCreationDataItem[] => {
  return items;
};

export const toDailyPostCountData = (
  items: ApiDailyPostCountDataItem[],
): DailyPostCountDataItem[] => {
  const byDate = new Map<string, DailyPostCountDataItem>();

  items.forEach((item) => {
    const entry = byDate.get(item.date) ?? {
      date: item.date,
      ...createEmptyStatusCounts(),
    };

    // status が無い場合でも合計を表示するため published に寄せる
    const status = isNoteStatus(item.status) ? item.status : "published";
    entry[status] += item.postCount;

    byDate.set(item.date, entry);
  });

  return Array.from(byDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
};

export const toMonthlyNoteData = (
  items: MonthlyNoteDataItem[],
): MonthlyNoteData[] => {
  return items;
};

export const toNoteEvaluationData = (
  items: NoteEvaluationDataItem[],
): NoteEvaluationData[] => {
  return items.map((item) => ({
    noteId: item.noteId,
    name: item.name,
    helpful: item.helpfulCount,
    notHelpful: item.notHelpfulCount,
    impressions: item.impressionCount,
    status: toNoteStatus(item.status),
  }));
};

export const toPostInfluenceData = (
  items: PostInfluenceDataItem[],
): PostInfluenceData[] => {
  return items.map((item) => ({
    postId: item.postId,
    name: item.name,
    reposts: item.repostCount,
    likes: item.likeCount,
    impressions: item.impressionCount,
    status: toNoteStatus(item.status),
  }));
};
