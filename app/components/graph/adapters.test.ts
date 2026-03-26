import { describe, expect, it } from "vitest";

import type {
  DailyPostCountDataItem as ApiDailyPostCountDataItem,
  MonthlyNoteDataItem,
  NoteEvaluationDataItem,
  PostInfluenceDataItem,
} from "~/generated/api/schemas";

import {
  toDailyPostCountData,
  toMonthlyNoteData,
  toNoteEvaluationData,
  toPostInfluenceData,
} from "./adapters";

describe("graph adapters", () => {
  it("toDailyPostCountData aggregates by date and status", () => {
    const items: ApiDailyPostCountDataItem[] = [
      { date: "2025-01-01", postCount: 2, status: "published" },
      { date: "2025-01-01", postCount: 3, status: "evaluating" },
      { date: "2025-01-01", postCount: 1 },
      { date: "2025-01-02", postCount: 5, status: "unknown" as never },
    ];

    expect(toDailyPostCountData(items)).toEqual([
      {
        date: "2025-01-01",
        published: 3,
        evaluating: 3,
        unpublished: 0,
        temporarilyPublished: 0,
      },
      {
        date: "2025-01-02",
        published: 5,
        evaluating: 0,
        unpublished: 0,
        temporarilyPublished: 0,
      },
    ]);
  });

  it("toMonthlyNoteData keeps publicationRate values", () => {
    const items: MonthlyNoteDataItem[] = [
      {
        month: "2025-01",
        published: 10,
        evaluating: 2,
        unpublished: 1,
        temporarilyPublished: 0,
        publicationRate: 0.75,
      },
    ];

    expect(toMonthlyNoteData(items)).toEqual(items);
  });

  it("toNoteEvaluationData maps counts and status", () => {
    const items: NoteEvaluationDataItem[] = [
      {
        noteId: "note-1",
        name: "note",
        helpfulCount: 12,
        notHelpfulCount: 4,
        impressionCount: 200,
        status: "invalid" as never,
      },
    ];

    expect(toNoteEvaluationData(items)).toEqual([
      {
        noteId: "note-1",
        name: "note",
        helpful: 12,
        notHelpful: 4,
        impressions: 200,
        status: "published",
      },
    ]);
  });

  it("toPostInfluenceData maps counts and status", () => {
    const items: PostInfluenceDataItem[] = [
      {
        postId: "post-1",
        name: "post",
        repostCount: 5,
        likeCount: 20,
        impressionCount: 100,
        status: "evaluating",
      },
    ];

    expect(toPostInfluenceData(items)).toEqual([
      {
        postId: "post-1",
        name: "post",
        reposts: 5,
        likes: 20,
        impressions: 100,
        status: "evaluating",
      },
    ]);
  });
});
