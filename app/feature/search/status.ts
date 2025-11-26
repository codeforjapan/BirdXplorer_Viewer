import type { NoteCurrentStatus } from "~/generated/api/schemas/noteCurrentStatus";

export const NOTE_CURRENT_STATUS = {
  CURRENTLY_RATED_HELPFUL: "現在のところ「役に立った」と評価されています",
  CURRENTLY_RATED_NOT_HELPFUL:
    "現在のところ「役に立たなかった」と評価されています",
  NEEDS_MORE_RATINGS: "さらに評価が必要",
} as const satisfies Record<NonNullable<NoteCurrentStatus>, string>;

export const convertNoteStatusToLabel = (status: NoteCurrentStatus) => {
  switch (status) {
    case null:
      return "このノートにはまだ評価がありません";
    case "CURRENTLY_RATED_HELPFUL":
      return "現在のところ「役に立った」と評価されています";
    case "CURRENTLY_RATED_NOT_HELPFUL":
      return "現在のところ「役に立たなかった」と評価されています";
    case "NEEDS_MORE_RATINGS":
      return "さらに評価が必要";
    default:
      return status satisfies never;
  }
};
